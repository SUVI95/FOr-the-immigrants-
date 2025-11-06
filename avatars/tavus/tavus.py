"""
---
title: Tavus Avatar
category: avatars
tags: [avatar, openai, deepgram, tavus]
difficulty: intermediate
description: Shows how to create a tavus avatar that can help a user learn about the Fall of the Roman Empire using flash cards and quizzes.
demonstrates:
  - Creating a new tavus avatar session
  - Using RPC to send messages to the client for flash cards and quizzes using `perform_rpc`
  - Using `register_rpc_method` to register the RPC methods so that the agent can receive messages from the client
  - Using UserData to store state for the cards and the quizzes
  - Using custom data classes to represent the flash cards and quizzes
---
"""
import logging
import json
import uuid
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional, List, TypedDict
from datetime import datetime
from dotenv import load_dotenv
from livekit.agents import JobContext, WorkerOptions, cli, RoomOutputOptions, RoomInputOptions
from livekit.agents.llm import function_tool
from livekit.agents.voice import Agent, AgentSession, RunContext
from livekit.plugins.turn_detector.english import EnglishModel
from livekit.plugins import silero, tavus, openai, deepgram
import asyncio
from database import get_database, Database

load_dotenv(dotenv_path=Path(__file__).parent.parent.parent / '.env')

logger = logging.getLogger("avatar")
logger.setLevel(logging.INFO)

class QuizAnswerDict(TypedDict):
    text: str
    is_correct: bool

class QuizQuestionDict(TypedDict):
    text: str
    answers: List[QuizAnswerDict]

@dataclass
class FlashCard:
    """Class to represent a flash card."""
    id: str
    question: str
    answer: str
    is_flipped: bool = False

@dataclass
class QuizAnswer:
    """Class to represent a quiz answer option."""
    id: str
    text: str
    is_correct: bool

@dataclass
class QuizQuestion:
    """Class to represent a quiz question."""
    id: str
    text: str
    answers: List[QuizAnswer]

@dataclass
class Quiz:
    """Class to represent a quiz."""
    id: str
    questions: List[QuizQuestion]

@dataclass
class Group:
    """Class to represent a community group."""
    id: str
    name: str
    description: str
    group_type: str  # e.g., "mothers_with_kids", "language_exchange", "sports"
    member_count: int = 0
    location_lat: Optional[float] = None
    location_lng: Optional[float] = None
    location_name: Optional[str] = None
    created_by: str = ""
    created_at: str = ""

@dataclass
class Event:
    """Class to represent an event/meetup."""
    id: str
    title: str
    description: str
    event_date: str  # ISO format
    location_name: str
    location_lat: Optional[float] = None
    location_lng: Optional[float] = None
    group_id: Optional[str] = None
    rsvp_count: int = 0
    created_by: str = ""
    created_at: str = ""

@dataclass
class UserData:
    """Class to store user data during a session."""
    ctx: Optional[JobContext] = None
    flash_cards: List[FlashCard] = field(default_factory=list)
    quizzes: List[Quiz] = field(default_factory=list)
    groups: List[Group] = field(default_factory=list)
    events: List[Event] = field(default_factory=list)

    def reset(self) -> None:
        """Reset session data."""
        # Keep flash cards and quizzes intact

    def add_flash_card(self, question: str, answer: str) -> FlashCard:
        """Add a new flash card to the collection."""
        card = FlashCard(
            id=str(uuid.uuid4()),
            question=question,
            answer=answer
        )
        self.flash_cards.append(card)
        return card

    def get_flash_card(self, card_id: str) -> Optional[FlashCard]:
        """Get a flash card by ID."""
        for card in self.flash_cards:
            if card.id == card_id:
                return card
        return None

    def flip_flash_card(self, card_id: str) -> Optional[FlashCard]:
        """Flip a flash card by ID."""
        card = self.get_flash_card(card_id)
        if card:
            card.is_flipped = not card.is_flipped
            return card
        return None

    def add_quiz(self, questions: List[QuizQuestionDict]) -> Quiz:
        """Add a new quiz to the collection."""
        quiz_questions = []
        for q in questions:
            answers = []
            for a in q["answers"]:
                answers.append(QuizAnswer(
                    id=str(uuid.uuid4()),
                    text=a["text"],
                    is_correct=a["is_correct"]
                ))
            quiz_questions.append(QuizQuestion(
                id=str(uuid.uuid4()),
                text=q["text"],
                answers=answers
            ))

        quiz = Quiz(
            id=str(uuid.uuid4()),
            questions=quiz_questions
        )
        self.quizzes.append(quiz)
        return quiz

    def get_quiz(self, quiz_id: str) -> Optional[Quiz]:
        """Get a quiz by ID."""
        for quiz in self.quizzes:
            if quiz.id == quiz_id:
                return quiz
        return None

    def check_quiz_answers(self, quiz_id: str, user_answers: dict) -> List[tuple]:
        """Check user's quiz answers and return results."""
        quiz = self.get_quiz(quiz_id)
        if not quiz:
            return []

        results = []
        for question in quiz.questions:
            user_answer_id = user_answers.get(question.id)

            # Find the selected answer and the correct answer
            selected_answer = None
            correct_answer = None

            for answer in question.answers:
                if answer.id == user_answer_id:
                    selected_answer = answer
                if answer.is_correct:
                    correct_answer = answer

            is_correct = selected_answer and selected_answer.is_correct
            results.append((question, selected_answer, correct_answer, is_correct))

        return results
    
    def add_group(self, name: str, description: str, group_type: str, 
                  location_name: Optional[str] = None,
                  location_lat: Optional[float] = None,
                  location_lng: Optional[float] = None) -> Group:
        """Add a new group to the collection."""
        group = Group(
            id=str(uuid.uuid4()),
            name=name,
            description=description,
            group_type=group_type,
            location_name=location_name,
            location_lat=location_lat,
            location_lng=location_lng,
            created_at=datetime.now().isoformat()
        )
        self.groups.append(group)
        return group
    
    def get_group(self, group_id: str) -> Optional[Group]:
        """Get a group by ID."""
        for group in self.groups:
            if group.id == group_id:
                return group
        return None
    
    def add_event(self, title: str, description: str, event_date: str,
                  location_name: str, location_lat: Optional[float] = None,
                  location_lng: Optional[float] = None,
                  group_id: Optional[str] = None) -> Event:
        """Add a new event to the collection."""
        event = Event(
            id=str(uuid.uuid4()),
            title=title,
            description=description,
            event_date=event_date,
            location_name=location_name,
            location_lat=location_lat,
            location_lng=location_lng,
            group_id=group_id,
            created_at=datetime.now().isoformat()
        )
        self.events.append(event)
        return event
    
    def get_event(self, event_id: str) -> Optional[Event]:
        """Get an event by ID."""
        for event in self.events:
            if event.id == event_id:
                return event
        return None

class AvatarAgent(Agent):
    def __init__(self) -> None:
        # Note: STT, LLM, TTS are configured in the AgentSession, not here
        # This Agent only provides instructions and function tools
        super().__init__(
            instructions="""
                You are Knuut AI — an immigrant language coach, career mentor, and integration guide for Finland.
                Your mission is to bridge people to Finnish opportunities with voice-to-voice coaching.

                Voice & tone: friendly, confident, attentive, supportive; natural and human. Use brief, clear sentences.
                Be multilingual: auto-detect the user’s spoken language immediately and respond in that language.
                - If the user switches language mid-conversation, adapt instantly.
                - Keep replies bilingual when teaching (user’s language + Finnish), but keep them concise.

                What you do:
                - Coach Finnish through conversation; adapt A0 → professional fluency; track progress.
                - Mentor for jobs in Finland: CV, applications, interviews, workplace culture & etiquette.
                - Guide integration: permits/registration basics (remind to verify with authorities).
                - Help find community groups and events: mothers with kids, language exchange, cultural groups, sports, etc.
                - Organize and discover meetups: coffee meetups, playdates, cultural events, networking events in Kajaani.
                - Provide emotional support and practical next steps.

                Local context (very important): You are operating in Finland, specifically Kajaani.
                - Know key institutions and resources: InfoFinland, Migri (residence permits), DVV (population register), Kela (social security), Vero (taxes), Omakanta/My Kanta (health records), Traficom (driving licence), Police ID.
                - City services for Kajaani: city website, newcomers information, libraries, community centers.
                - Jobs: recommend and guide through Finnish job platforms including duunijobs.fi (requested), TE Services / Työmarkkinatori (Job Market Finland), LinkedIn, Indeed Finland. Help with searches around Kajaani and Kainuu region.
                - When asked about jobs, provide concrete next actions (search queries, how to register as jobseeker, how to get a tax card, how to get a Finnish ID, how to book Migri appointments).

                Ethics: you are an AI mentor, not an authority. Handle personal data carefully; encourage official verification.

                Conversation rules (very important for voice):
                - Keep turns short (1–2 sentences), ask clarifying questions first.
                - Create flash cards for key phrases or concepts; quiz lightly to reinforce.
                - When teaching Finnish, ALWAYS create flashcards for new vocabulary, phrases, or grammar concepts.
                - Use the create_flash_card function to help users learn and remember Finnish words and phrases.
                - Encourage: "You're doing great — let's take the next step together."
                - Prefer structured, step-by-step guidance with clear links or references when relevant.
            """
        )

    @function_tool
    async def create_flash_card(self, context: RunContext[UserData], question: str, answer: str):
        """Create a new flash card and display it to the user.

        Args:
            question: The question or front side of the flash card
            answer: The answer or back side of the flash card
        """
        userdata = context.userdata
        card = userdata.add_flash_card(question, answer)

        # Get the room from the userdata
        if not userdata.ctx or not userdata.ctx.room:
            return f"Created a flash card, but couldn't access the room to send it."

        room = userdata.ctx.room

        # Get the first participant in the room (should be the client)
        participants = room.remote_participants
        if not participants:
            return f"Created a flash card, but no participants found to send it to."

        # Get the first participant from the dictionary of remote participants
        participant = next(iter(participants.values()), None)
        if not participant:
            return f"Created a flash card, but couldn't get the first participant."
        payload = {
            "action": "show",
            "id": card.id,
            "question": card.question,
            "answer": card.answer,
            "index": len(userdata.flash_cards) - 1
        }

        # Make sure payload is properly serialized
        json_payload = json.dumps(payload)
        logger.info(f"Sending flash card payload: {json_payload}")
        await room.local_participant.perform_rpc(
            destination_identity=participant.identity,
            method="client.flashcard",
            payload=json_payload
        )

        return f"I've created a flash card with the question: '{question}'"

    @function_tool
    async def flip_flash_card(self, context: RunContext[UserData], card_id: str):
        """Flip a flash card to show the answer or question.

        Args:
            card_id: The ID of the flash card to flip
        """
        userdata = context.userdata
        card = userdata.flip_flash_card(card_id)

        if not card:
            return f"Flash card with ID {card_id} not found."

        # Get the room from the userdata
        if not userdata.ctx or not userdata.ctx.room:
            return f"Flipped the flash card, but couldn't access the room to send it."

        room = userdata.ctx.room

        # Get the first participant in the room (should be the client)
        participants = room.remote_participants
        if not participants:
            return f"Flipped the flash card, but no participants found to send it to."

        # Get the first participant from the dictionary of remote participants
        participant = next(iter(participants.values()), None)
        if not participant:
            return f"Flipped the flash card, but couldn't get the first participant."
        payload = {
            "action": "flip",
            "id": card.id
        }

        # Make sure payload is properly serialized
        json_payload = json.dumps(payload)
        logger.info(f"Sending flip card payload: {json_payload}")
        await room.local_participant.perform_rpc(
            destination_identity=participant.identity,
            method="client.flashcard",
            payload=json_payload
        )

        return f"I've flipped the flash card to show the {'answer' if card.is_flipped else 'question'}"

    @function_tool
    async def create_quiz(self, context: RunContext[UserData], questions: List[QuizQuestionDict]):
        """Create a new quiz with multiple choice questions and display it to the user.

        Args:
            questions: A list of question objects. Each question object should have:
                - text: The question text
                - answers: A list of answer objects, each with:
                    - text: The answer text
                    - is_correct: Boolean indicating if this is the correct answer
        """
        userdata = context.userdata
        quiz = userdata.add_quiz(questions)

        # Get the room from the userdata
        if not userdata.ctx or not userdata.ctx.room:
            return f"Created a quiz, but couldn't access the room to send it."

        room = userdata.ctx.room

        # Get the first participant in the room (should be the client)
        participants = room.remote_participants
        if not participants:
            return f"Created a quiz, but no participants found to send it to."

        # Get the first participant from the dictionary of remote participants
        participant = next(iter(participants.values()), None)
        if not participant:
            return f"Created a quiz, but couldn't get the first participant."

        # Format questions for client
        client_questions = []
        for q in quiz.questions:
            client_answers = []
            for a in q.answers:
                client_answers.append({
                    "id": a.id,
                    "text": a.text
                })
            client_questions.append({
                "id": q.id,
                "text": q.text,
                "answers": client_answers
            })

        payload = {
            "action": "show",
            "id": quiz.id,
            "questions": client_questions
        }

        # Make sure payload is properly serialized
        json_payload = json.dumps(payload)
        logger.info(f"Sending quiz payload: {json_payload}")
        await room.local_participant.perform_rpc(
            destination_identity=participant.identity,
            method="client.quiz",
            payload=json_payload
        )

        return f"I've created a quiz with {len(questions)} questions. Please answer them when you're ready."

    @function_tool
    async def create_group(self, context: RunContext[UserData], name: str, description: str, 
                          group_type: str, location_name: Optional[str] = None,
                          location_lat: Optional[float] = None, location_lng: Optional[float] = None):
        """Create a new community group (like Peanut - for mothers with kids, language exchange, etc.).
        
        Args:
            name: Name of the group
            description: Description of what the group is about
            group_type: Type of group (e.g., "mothers_with_kids", "language_exchange", "sports", "cultural")
            location_name: Optional location name (e.g., "Kajaani Center")
            location_lat: Optional latitude for map display
            location_lng: Optional longitude for map display
        """
        userdata = context.userdata
        
        # Try to save to database first
        db = await get_database()
        db_group = None
        if db:
            try:
                # Get user_id from context if available
                user_id = getattr(userdata, 'user_id', None)
                db_group = await db.create_group(
                    name, description, group_type, location_name, 
                    location_lat, location_lng, user_id
                )
                logger.info(f"Saved group to database: {db_group['id'] if db_group else 'failed'}")
            except Exception as e:
                logger.error(f"Error saving group to database: {e}")
        
        # Also add to in-memory storage
        group = userdata.add_group(name, description, group_type, location_name, location_lat, location_lng)
        
        # Use database group if available, otherwise use in-memory
        if db_group:
            group.id = str(db_group['id'])
            group.member_count = db_group.get('member_count', 0)

        if not userdata.ctx or not userdata.ctx.room:
            return f"Created a group, but couldn't access the room to send it."

        room = userdata.ctx.room
        participants = room.remote_participants
        if not participants:
            return f"Created a group, but no participants found to send it to."

        participant = next(iter(participants.values()), None)
        if not participant:
            return f"Created a group, but couldn't get the first participant."

        payload = {
            "action": "show",
            "id": group.id,
            "name": group.name,
            "description": group.description,
            "group_type": group.group_type,
            "location_name": group.location_name,
            "location_lat": group.location_lat,
            "location_lng": group.location_lng,
            "member_count": group.member_count,
            "created_at": group.created_at
        }

        json_payload = json.dumps(payload)
        logger.info(f"Sending group payload: {json_payload}")
        await room.local_participant.perform_rpc(
            destination_identity=participant.identity,
            method="client.group",
            payload=json_payload
        )

        return f"I've created a group called '{name}' for {group_type}. You can now invite others to join!"

    @function_tool
    async def find_groups(self, context: RunContext[UserData], group_type: Optional[str] = None,
                         location_lat: Optional[float] = None, location_lng: Optional[float] = None,
                         max_distance_km: float = 10.0):
        """Find community groups nearby (like Peanut - mothers with kids, language exchange, etc.).
        
        Args:
            group_type: Optional filter by group type (e.g., "mothers_with_kids", "language_exchange")
            location_lat: Optional user's latitude for distance calculation
            location_lng: Optional user's longitude for distance calculation
            max_distance_km: Maximum distance to search (default 10km)
        """
        userdata = context.userdata
        
        # Try to get from database first
        db = await get_database()
        groups_data = []
        
        if db:
            try:
                db_groups = await db.find_groups(group_type, location_lat, location_lng, max_distance_km)
                groups_data = [
                    {
                        "id": str(g['id']),
                        "name": g['name'],
                        "description": g['description'],
                        "group_type": g['group_type'],
                        "location_name": g.get('location_name'),
                        "location_lat": float(g['location_lat']) if g.get('location_lat') else None,
                        "location_lng": float(g['location_lng']) if g.get('location_lng') else None,
                        "member_count": g.get('member_count', 0)
                    }
                    for g in db_groups
                ]
                logger.info(f"Found {len(groups_data)} groups from database")
            except Exception as e:
                logger.error(f"Error getting groups from database: {e}")
        
        # Fallback to in-memory groups if database is empty
        if not groups_data:
            filtered_groups = userdata.groups
            if group_type:
                filtered_groups = [g for g in filtered_groups if g.group_type == group_type]
            
            groups_data = [
                {
                    "id": group.id,
                    "name": group.name,
                    "description": group.description,
                    "group_type": group.group_type,
                    "location_name": group.location_name,
                    "location_lat": group.location_lat,
                    "location_lng": group.location_lng,
                    "member_count": group.member_count
                }
                for group in filtered_groups
            ]

        if not userdata.ctx or not userdata.ctx.room:
            return f"Found {len(groups_data)} groups, but couldn't access the room to send them."

        room = userdata.ctx.room
        participants = room.remote_participants
        if not participants:
            return f"Found {len(groups_data)} groups, but no participants found to send them to."

        participant = next(iter(participants.values()), None)
        if not participant:
            return f"Found {len(groups_data)} groups, but couldn't get the first participant."

        payload = {
            "action": "show_list",
            "groups": groups_data,
            "count": len(groups_data)
        }

        json_payload = json.dumps(payload)
        logger.info(f"Sending groups list payload: {json_payload}")
        await room.local_participant.perform_rpc(
            destination_identity=participant.identity,
            method="client.group",
            payload=json_payload
        )

        return f"I found {len(groups_data)} groups matching your criteria. Check them out!"

    @function_tool
    async def create_event(self, context: RunContext[UserData], title: str, description: str,
                          event_date: str, location_name: str, location_lat: Optional[float] = None,
                          location_lng: Optional[float] = None, group_id: Optional[str] = None):
        """Create a new event/meetup (like Meetup - coffee meetups, playdates, etc.).
        
        Args:
            title: Event title
            description: Event description
            event_date: Event date in ISO format (e.g., "2025-11-10T10:00:00")
            location_name: Location name (e.g., "Kahvila Kajaani")
            location_lat: Optional latitude for Google Maps
            location_lng: Optional longitude for Google Maps
            group_id: Optional group ID if event belongs to a group
        """
        userdata = context.userdata
        
        # Try to save to database first
        db = await get_database()
        db_event = None
        if db:
            try:
                user_id = getattr(userdata, 'user_id', None)
                db_event = await db.create_event(
                    title, description, event_date, location_name,
                    location_lat, location_lng, group_id, user_id
                )
                logger.info(f"Saved event to database: {db_event['id'] if db_event else 'failed'}")
            except Exception as e:
                logger.error(f"Error saving event to database: {e}")
        
        # Also add to in-memory storage
        event = userdata.add_event(title, description, event_date, location_name, location_lat, location_lng, group_id)
        
        # Use database event if available
        if db_event:
            event.id = str(db_event['id'])
            event.rsvp_count = db_event.get('rsvp_count', 0)

        if not userdata.ctx or not userdata.ctx.room:
            return f"Created an event, but couldn't access the room to send it."

        room = userdata.ctx.room
        participants = room.remote_participants
        if not participants:
            return f"Created an event, but no participants found to send it to."

        participant = next(iter(participants.values()), None)
        if not participant:
            return f"Created an event, but couldn't get the first participant."

        payload = {
            "action": "show",
            "id": event.id,
            "title": event.title,
            "description": event.description,
            "event_date": event.event_date,
            "location_name": event.location_name,
            "location_lat": event.location_lat,
            "location_lng": event.location_lng,
            "group_id": event.group_id,
            "rsvp_count": event.rsvp_count,
            "created_at": event.created_at
        }

        json_payload = json.dumps(payload)
        logger.info(f"Sending event payload: {json_payload}")
        await room.local_participant.perform_rpc(
            destination_identity=participant.identity,
            method="client.event",
            payload=json_payload
        )

        return f"I've created an event '{title}' on {event_date} at {location_name}. People can now RSVP!"

    @function_tool
    async def find_events(self, context: RunContext[UserData], group_id: Optional[str] = None,
                         location_lat: Optional[float] = None, location_lng: Optional[float] = None,
                         max_distance_km: float = 10.0, upcoming_only: bool = True):
        """Find events/meetups nearby (like Meetup - coffee meetups, playdates, etc.).
        
        Args:
            group_id: Optional filter by group ID
            location_lat: Optional user's latitude for distance calculation
            location_lng: Optional user's longitude for distance calculation
            max_distance_km: Maximum distance to search (default 10km)
            upcoming_only: Only show upcoming events (default True)
        """
        userdata = context.userdata
        
        # Try to get from database first
        db = await get_database()
        events_data = []
        
        if db:
            try:
                db_events = await db.find_events(group_id, location_lat, location_lng, max_distance_km, upcoming_only)
                events_data = [
                    {
                        "id": str(e['id']),
                        "title": e['title'],
                        "description": e['description'],
                        "event_date": e['event_date'].isoformat() if hasattr(e['event_date'], 'isoformat') else str(e['event_date']),
                        "location_name": e['location_name'],
                        "location_lat": float(e['location_lat']) if e.get('location_lat') else None,
                        "location_lng": float(e['location_lng']) if e.get('location_lng') else None,
                        "group_id": str(e['group_id']) if e.get('group_id') else None,
                        "rsvp_count": e.get('rsvp_count', 0)
                    }
                    for e in db_events
                ]
                logger.info(f"Found {len(events_data)} events from database")
            except Exception as e:
                logger.error(f"Error getting events from database: {e}")
        
        # Fallback to in-memory events if database is empty
        if not events_data:
            filtered_events = userdata.events
            if group_id:
                filtered_events = [e for e in filtered_events if e.group_id == group_id]
            
            if upcoming_only:
                now = datetime.now().isoformat()
                filtered_events = [e for e in filtered_events if e.event_date > now]
            
            events_data = [
                {
                    "id": event.id,
                    "title": event.title,
                    "description": event.description,
                    "event_date": event.event_date,
                    "location_name": event.location_name,
                    "location_lat": event.location_lat,
                    "location_lng": event.location_lng,
                    "group_id": event.group_id,
                    "rsvp_count": event.rsvp_count
                }
                for event in filtered_events
            ]

        if not userdata.ctx or not userdata.ctx.room:
            return f"Found {len(events_data)} events, but couldn't access the room to send them."

        room = userdata.ctx.room
        participants = room.remote_participants
        if not participants:
            return f"Found {len(events_data)} events, but no participants found to send them to."

        participant = next(iter(participants.values()), None)
        if not participant:
            return f"Found {len(events_data)} events, but couldn't get the first participant."

        payload = {
            "action": "show_list",
            "events": events_data,
            "count": len(events_data)
        }

        json_payload = json.dumps(payload)
        logger.info(f"Sending events list payload: {json_payload}")
        await room.local_participant.perform_rpc(
            destination_identity=participant.identity,
            method="client.event",
            payload=json_payload
        )

        return f"I found {len(events_data)} upcoming events. Check them out!"

    async def on_enter(self):
        # Initial greeting is handled by session.generate_reply() after session.start()
        pass

async def entrypoint(ctx: JobContext):
    logger.info(f"🎯 Entrypoint called - Room: {ctx.room.name}")
    agent = AvatarAgent()
    await ctx.connect()
    logger.info(f"✅ Connected to room: {ctx.room.name}, Participant: {ctx.room.local_participant.identity}")

    # Create a single AgentSession with userdata
    # Configure STT, LLM, TTS for the session - Tavus will handle the audio/video output
    userdata = UserData(ctx=ctx)
    session = AgentSession[UserData](
        userdata=userdata,
        # Original working STT configuration
        stt=deepgram.STT(model="nova-3", language="en"),
        llm="openai/gpt-4.1-mini",
        tts=openai.TTS(),  # OpenAI TTS - using your API key
        vad=silero.VAD.load(),
        turn_detection=EnglishModel()
    )

    # Ensure agent responds to user input
    @session.on("user_input_transcribed")
    def _on_transcript(event):
        try:
            transcript = getattr(event, "transcript", "").strip()
            is_final = getattr(event, "is_final", False)
            if is_final and transcript:
                logger.info(f"Final transcript received, generating reply: {transcript}")
                # generate_reply returns a SpeechHandle, not a coroutine - call it directly
                try:
                    speech_handle = session.generate_reply(user_input=transcript)
                    logger.info(f"Reply generation started for: {transcript}")
                except Exception as e:
                    logger.error(f"Error calling generate_reply: {e}", exc_info=True)
        except Exception as e:
            logger.error(f"Error in transcript handler: {e}", exc_info=True)

    # Create the avatar session
    avatar = tavus.AvatarSession(
        replica_id="r70c81a0519b",
        persona_id="p9cfffba3847",
        avatar_participant_name="assistant"
    )

    # Register RPC method for flipping flash cards from client
    async def handle_flip_flash_card(rpc_data):
        try:
            logger.info(f"Received flash card flip payload: {rpc_data}")

            # Extract the payload from the RpcInvocationData object
            payload_str = rpc_data.payload
            logger.info(f"Extracted payload string: {payload_str}")

            # Parse the JSON payload
            payload_data = json.loads(payload_str)
            logger.info(f"Parsed payload data: {payload_data}")

            card_id = payload_data.get("id")

            if card_id:
                card = userdata.flip_flash_card(card_id)
                if card:
                    logger.info(f"Flipped flash card {card_id}, is_flipped: {card.is_flipped}")
                    # Send a message to the user via the agent, we're disabling this for now.
                    # session.generate_reply(user_input=(f"Please describe the {'answer' if card.is_flipped else 'question'}"))
                else:
                    logger.error(f"Card with ID {card_id} not found")
            else:
                logger.error("No card ID found in payload")

            return None
        except json.JSONDecodeError as e:
            logger.error(f"JSON parsing error for payload '{rpc_data.payload}': {e}")
            return f"error: {str(e)}"
        except Exception as e:
            logger.error(f"Error handling flip flash card: {e}")
            return f"error: {str(e)}"

    # Register RPC method for handling quiz submissions
    async def handle_submit_quiz(rpc_data):
        try:
            logger.info(f"Received quiz submission payload: {rpc_data}")

            # Extract the payload from the RpcInvocationData object
            payload_str = rpc_data.payload
            logger.info(f"Extracted quiz submission string: {payload_str}")

            # Parse the JSON payload
            payload_data = json.loads(payload_str)
            logger.info(f"Parsed quiz submission data: {payload_data}")

            quiz_id = payload_data.get("id")
            user_answers = payload_data.get("answers", {})

            if not quiz_id:
                logger.error("No quiz ID found in payload")
                return "error: No quiz ID found in payload"

            # Check the quiz answers
            quiz_results = userdata.check_quiz_answers(quiz_id, user_answers)
            if not quiz_results:
                logger.error(f"Quiz with ID {quiz_id} not found")
                return "error: Quiz not found"

            # Count correct answers
            correct_count = sum(1 for _, _, _, is_correct in quiz_results if is_correct)
            total_count = len(quiz_results)

            # Create a verbal response for the agent to say
            result_summary = f"You got {correct_count} out of {total_count} questions correct."

            # Generate feedback for each question
            feedback_details = []
            for question, selected_answer, correct_answer, is_correct in quiz_results:
                if is_correct:
                    feedback = f"Question: {question.text}\nYour answer: {selected_answer.text} ✓ Correct!"
                else:
                    feedback = f"Question: {question.text}\nYour answer: {selected_answer.text if selected_answer else 'None'} ✗ Incorrect. The correct answer is: {correct_answer.text}"

                    # Create a flash card for incorrectly answered questions
                    card = userdata.add_flash_card(question.text, correct_answer.text)
                    participant = next(iter(ctx.room.remote_participants.values()), None)
                    if participant:
                        flash_payload = {
                            "action": "show",
                            "id": card.id,
                            "question": card.question,
                            "answer": card.answer,
                            "index": len(userdata.flash_cards) - 1
                        }
                        json_flash_payload = json.dumps(flash_payload)
                        await ctx.room.local_participant.perform_rpc(
                            destination_identity=participant.identity,
                            method="client.flashcard",
                            payload=json_flash_payload
                        )

                feedback_details.append(feedback)

            detailed_feedback = "\n\n".join(feedback_details)
            full_response = f"{result_summary}\n\n{detailed_feedback}"

            # Have the agent say the results
            session.say(full_response)

            return "success"
        except json.JSONDecodeError as e:
            logger.error(f"JSON parsing error for quiz submission payload '{rpc_data.payload}': {e}")
            return f"error: {str(e)}"
        except Exception as e:
            logger.error(f"Error handling quiz submission: {e}")
            return f"error: {str(e)}"

    # Register RPC method for joining groups
    async def handle_join_group(rpc_data):
        try:
            logger.info(f"Received join group payload: {rpc_data}")
            payload_str = rpc_data.payload
            payload_data = json.loads(payload_str)
            
            group_id = payload_data.get("group_id")
            if group_id:
                # Try to save to database
                db = await get_database()
                user_id = getattr(userdata, 'user_id', None)
                if db and user_id:
                    try:
                        await db.join_group(group_id, user_id)
                        logger.info(f"User {user_id} joined group {group_id} in database")
                    except Exception as e:
                        logger.error(f"Error joining group in database: {e}")
                
                # Also update in-memory
                group = userdata.get_group(group_id)
                if group:
                    group.member_count += 1
                    logger.info(f"User joined group {group_id}, new member count: {group.member_count}")
                    return "success"
                else:
                    logger.error(f"Group with ID {group_id} not found")
                    return "error: group not found"
            return "error: no group_id provided"
        except Exception as e:
            logger.error(f"Error handling join group: {e}", exc_info=True)
            return f"error: {str(e)}"

    # Register RPC method for RSVPing to events
    async def handle_rsvp_event(rpc_data):
        try:
            logger.info(f"Received RSVP event payload: {rpc_data}")
            payload_str = rpc_data.payload
            payload_data = json.loads(payload_str)
            
            event_id = payload_data.get("event_id")
            status = payload_data.get("status", "going")
            if event_id:
                # Try to save to database
                db = await get_database()
                user_id = getattr(userdata, 'user_id', None)
                if db and user_id:
                    try:
                        await db.rsvp_event(event_id, user_id, status)
                        logger.info(f"User {user_id} RSVPed to event {event_id} in database")
                    except Exception as e:
                        logger.error(f"Error RSVPing to event in database: {e}")
                
                # Also update in-memory
                event = userdata.get_event(event_id)
                if event:
                    event.rsvp_count += 1
                    logger.info(f"User RSVPed to event {event_id}, new RSVP count: {event.rsvp_count}")
                    return "success"
                else:
                    logger.error(f"Event with ID {event_id} not found")
                    return "error: event not found"
            return "error: no event_id provided"
        except Exception as e:
            logger.error(f"Error handling RSVP event: {e}", exc_info=True)
            return f"error: {str(e)}"

    # Register RPC method for manual event creation from UI
    async def handle_create_event_manual(rpc_data):
        try:
            logger.info(f"Received manual event creation payload: {rpc_data}")
            payload_str = rpc_data.payload
            payload_data = json.loads(payload_str)
            
            logger.info(f"Parsed event creation data: {payload_data}")
            
            # Create event using the existing function tool
            from livekit.agents.voice import RunContext
            context = RunContext(userdata=userdata, session=session)
            
            result = await agent.create_event(
                context,
                title=payload_data.get("title"),
                description=payload_data.get("description"),
                event_date=payload_data.get("event_date"),
                location_name=payload_data.get("location_name"),
                location_lat=payload_data.get("location_lat"),
                location_lng=payload_data.get("location_lng"),
                group_id=payload_data.get("group_id")
            )
            
            logger.info(f"Event created via manual input: {result}")
            return "success"
        except Exception as e:
            logger.error(f"Error handling manual event creation: {e}", exc_info=True)
            return f"error: {str(e)}"

    # Register RPC methods - The method names need to match exactly what the client is calling
    logger.info("Registering RPC methods")
    ctx.room.local_participant.register_rpc_method(
        "agent.flipFlashCard",
        handle_flip_flash_card
    )

    ctx.room.local_participant.register_rpc_method(
        "agent.submitQuiz",
        handle_submit_quiz
    )

    ctx.room.local_participant.register_rpc_method(
        "agent.joinGroup",
        handle_join_group
    )

    ctx.room.local_participant.register_rpc_method(
        "agent.rsvpEvent",
        handle_rsvp_event
    )

    ctx.room.local_participant.register_rpc_method(
        "agent.createEvent",
        handle_create_event_manual
    )

    # Register RPC method for processing user text input from learning activities
    async def handle_process_user_input(rpc_data):
        try:
            logger.info(f"Received user input payload: {rpc_data}")
            payload_str = rpc_data.payload
            payload_data = json.loads(payload_str)
            user_text = payload_data.get("text", "")
            
            if user_text:
                logger.info(f"Processing user input: {user_text}")
                # Generate a reply to the user's text input
                session.generate_reply(user_input=user_text)
            else:
                logger.warning("No text found in user input payload")
            
            return None
        except Exception as e:
            logger.error(f"Error processing user input: {e}", exc_info=True)
            return f"error: {str(e)}"
    
    ctx.room.local_participant.register_rpc_method(
        "agent.processUserInput",
        handle_process_user_input
    )

    # Start the agent session first to enable audio input/output
    logger.info("Starting agent session...")
    await session.start(
        room=ctx.room,
        room_input_options=RoomInputOptions(),  # Revert to default working config
        room_output_options=RoomOutputOptions(
            audio_enabled=True,  # Enable audio output - Tavus avatar will publish audio track
        ),
        agent=agent
    )
    logger.info("Agent session started successfully")
    
    # Start the avatar with the same session - Tavus will receive TTS audio from the session
    logger.info("Starting Tavus avatar session...")
    try:
        await avatar.start(session, room=ctx.room)
        logger.info("Tavus avatar session started successfully")
    except Exception as e:
        logger.error(f"Failed to start Tavus avatar: {e}", exc_info=True)
        raise
    
    # Generate initial greeting after both session and avatar are started
    logger.info("Generating initial greeting...")
    try:
        # generate_reply returns a SpeechHandle, not a coroutine - call it directly
        speech_handle = session.generate_reply()
        logger.info(f"Initial greeting generated successfully: {speech_handle}")
    except Exception as e:
        logger.error(f"Error generating initial greeting: {e}", exc_info=True)

if __name__ == "__main__":
    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint
        )
    )
