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
from typing import Optional, List
try:
    from typing_extensions import TypedDict
except ImportError:
    from typing import TypedDict
from datetime import datetime
from dotenv import load_dotenv
from livekit.agents import JobContext, WorkerOptions, cli, RoomOutputOptions, RoomInputOptions
from livekit.agents.voice import Agent, AgentSession, RunContext
from livekit.plugins.turn_detector.english import EnglishModel
from livekit.plugins import silero, openai, deepgram
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
                You are Knuut AI — an energetic, enthusiastic, and deeply engaging language coach, career mentor, and integration guide for Finland. Your mission is to make learning Finnish exciting, accessible, and fun while helping immigrants thrive in Finland.

                PERSONALITY & ENGAGEMENT (CRITICAL FOR INVESTOR DEMO):
                - Be EXTREMELY enthusiastic, warm, and encouraging — like the best teacher who makes learning addictive
                - Show genuine excitement when the user makes progress: "Wow! That's amazing! You're learning so fast!"
                - Use active listening: "I hear you!", "That's a great question!", "Let me help you with that!"
                - Be conversational and natural — like talking to a friend who's also an expert teacher
                - Celebrate small wins: "Perfect!", "Excellent pronunciation!", "You've got this!"
                - Show energy and passion: Make the user feel like they're in the best language class ever
                - Be responsive and adaptive: If the user seems confused, slow down and explain differently
                - Use encouraging phrases: "You're doing fantastic!", "Keep going!", "I'm so proud of your progress!"

                RESPONSE STYLE - ALIVE, ENGAGING, ACCURATE:
                - Be ALIVE and ENGAGING - show enthusiasm, energy, and personality
                - Listen ACCURATELY - pay close attention to what the user says
                - Respond naturally and conversationally - like a real person, not a robot
                - Keep responses concise but warm (2-3 sentences for voice)
                - Show excitement: "Great question!", "Let me help!", "Perfect!"
                - Be accurate in understanding - if unsure, ask for clarification
                - Use natural Finnish pronunciation - sound like a native speaker
                - Respond quickly but thoughtfully - balance speed with quality
                
                TEACHING STYLE - CONVERSATIONAL VOICE-TO-VOICE:
                - Teach Finnish through natural conversation
                - Use the "say it with me" approach: "Repeat after me: 'Hei' means hello!"
                - Give immediate feedback on pronunciation and usage
                - Create engaging learning moments: "Let's practice this together!"
                - Make connections: "Remember when we learned X? This is similar!"
                - Keep it conversational - no visual aids, just voice interaction

                MULTILINGUAL & NATIVE FINNISH PRONUNCIATION (CRITICAL):
                - You are a NATIVE Finnish speaker - speak Finnish with PERFECT native pronunciation and accent
                - When speaking Finnish words/phrases, pronounce them EXACTLY like a native Finn would
                - NO English accent when speaking Finnish - you sound like you were born and raised in Finland
                - Use native Finnish intonation, rhythm, and pronunciation patterns
                - When teaching Finnish, demonstrate PERFECT native pronunciation - be the gold standard
                - Speak Finnish words with natural Finnish phonetics (e.g., roll your R's, use Finnish vowel sounds)
                - Auto-detect user's language instantly and respond in that language
                - When teaching Finnish, use bilingual approach (user's language + Finnish)
                - If user switches language mid-conversation, adapt immediately
                - Keep Finnish examples clear and simple
                - IMPORTANT: Your Finnish pronunciation must be flawless - users learn by imitating you

                WHAT YOU DO:
                - Coach Finnish through engaging conversation (A0 → professional fluency)
                - Mentor for jobs: CV, applications, interviews, workplace culture
                - Guide integration: permits, registration, key services
                - Help find community: groups, events, meetups in Kajaani
                - Provide emotional support with practical next steps

                LOCAL CONTEXT (Kajaani, Finland):
                - Key resources: InfoFinland, Migri, DVV, Kela, Vero, Omakanta, Traficom, Police ID
                - Job platforms: duunijobs.fi, TE Services, Työmarkkinatori, LinkedIn, Indeed
                - City services: Kajaani city website, libraries, community centers
                - Always provide concrete next actions

                CONVERSATION RULES - ALIVE & ENGAGING:
                - Be ALIVE - show personality, enthusiasm, and engagement
                - Listen ACCURATELY - understand exactly what the user says
                - Teach through voice conversation only - no visual aids
                - Show genuine enthusiasm: "Great question!", "Let's practice!", "Awesome!"
                - Be the teacher who is ALIVE and ENGAGING - make learning fun!
                - Respond naturally and conversationally - be human, not robotic
                - Listen carefully and respond accurately to what the user actually says
                - Keep responses natural and conversational - pure voice-to-voice interaction
            """,
            allow_interruptions=False  # Disable interruptions to prevent greeting loops
        )


    async def on_enter(self):
        # Greeting is handled in entrypoint after session.start()
        # This ensures session is fully initialized before generating audio
        pass

async def entrypoint(ctx: JobContext):
    logger.info(f"🎯 Entrypoint called - Room: {ctx.room.name}")
    agent = AvatarAgent()
    await ctx.connect()
    logger.info(f"✅ Connected to room: {ctx.room.name}, Participant: {ctx.room.local_participant.identity}")
    logger.info(f"Agent participant name: {ctx.room.local_participant.name}")
    # Note: Participant name cannot be set after connection (read-only)
    # The useVoiceAssistant hook detects the agent by audio tracks, not by name

    # Create a single AgentSession with userdata
    # Configure STT, LLM, TTS for the session - Tavus will handle the audio/video output
    userdata = UserData(ctx=ctx)
    
    # Check if Deepgram API key is available, if not use OpenAI STT as fallback
    import os
    # Verify OpenAI API key is loaded
    openai_key = os.getenv("OPENAI_API_KEY")
    if openai_key:
        logger.info(f"✅ OpenAI API key loaded (length: {len(openai_key)})")
    else:
        logger.error("❌ OPENAI_API_KEY not found in environment! Voice will not work.")
        # Try to reload from .env file
        from pathlib import Path
        load_dotenv(dotenv_path=Path(__file__).parent.parent.parent / '.env', override=True)
        openai_key = os.getenv("OPENAI_API_KEY")
        if openai_key:
            logger.info(f"✅ OpenAI API key loaded from .env file (length: {len(openai_key)})")
        else:
            logger.error("❌ OPENAI_API_KEY still not found after reloading .env file!")
    
    deepgram_key = os.getenv("DEEPGRAM_API_KEY")
    if deepgram_key:
        # Use multilingual model to support both English and Finnish
        stt_provider = deepgram.STT(model="nova-2", language="fi")  # Finnish language support
        logger.info("Using Deepgram STT with Finnish language support")
    else:
        # Fallback to OpenAI STT if Deepgram key is not available
        stt_provider = openai.STT()
        logger.warning("DEEPGRAM_API_KEY not found, using OpenAI STT as fallback")
    
    # Create LLM with BEST model for intelligent, fast responses (gpt-4o is fastest and smartest)
    try:
        llm_provider = openai.LLM(model="gpt-4o")  # BEST model - fastest and most intelligent
        logger.info("✅ OpenAI LLM initialized with BEST model: gpt-4o (fastest & smartest)")
    except Exception as e:
        logger.error(f"❌ Failed to initialize OpenAI LLM: {e}, trying gpt-4o-mini", exc_info=True)
        try:
            llm_provider = openai.LLM(model="gpt-4o-mini")  # Fallback
            logger.info("✅ Using gpt-4o-mini as fallback")
        except Exception as e2:
            logger.error(f"❌ Failed to initialize fallback LLM: {e2}", exc_info=True)
            raise
    
    # Configure VAD for ACCURATE listening - detect speech precisely, wait for user to finish
    vad = silero.VAD.load(
        min_speech_duration=0.1,  # Very fast detection of speech start
        min_silence_duration=0.8,  # Wait 0.8s of silence - fast response but accurate
    )
    
    # Use EnglishModel for turn detection (MultilingualModel requires extra files)
    # This ensures agent starts immediately without crashing
    try:
        from livekit.plugins.turn_detector.english import EnglishModel
        turn_detection = EnglishModel()
        logger.info("Using EnglishModel for turn detection")
    except Exception as e:
        logger.warning(f"EnglishModel initialization failed: {e}, using VAD only")
        turn_detection = None
    
    # Configure TTS with MALE voice and FAST model for low latency
    # Using "tts-1" (faster) instead of "tts-1-hd" (slower but higher quality) for speed
    try:
        # Use "onyx" - deep male voice, FAST model for low latency
        tts_provider = openai.TTS(voice="onyx", model="tts-1")  # Male voice, FAST model (was tts-1-hd - slower!)
        logger.info("Using OpenAI TTS with onyx voice (male) and FAST tts-1 model for low latency")
    except Exception as e:
        logger.warning(f"Failed to configure OpenAI TTS with onyx voice: {e}, trying echo (male)")
        try:
            tts_provider = openai.TTS(voice="echo", model="tts-1")  # Male voice alternative, FAST model
            logger.info("Using OpenAI TTS with echo voice (male) and FAST tts-1 model")
        except Exception as e2:
            logger.warning(f"Failed to configure OpenAI TTS with echo voice: {e2}, using default")
            tts_provider = openai.TTS(model="tts-1")  # Use fast model even for default
    
    # Create session with turn_detection only if it's available (can be None)
    session_kwargs = {
        "userdata": userdata,
        "stt": stt_provider,
        "llm": llm_provider,
        "tts": tts_provider,
        "vad": vad,
    }
    if turn_detection is not None:
        session_kwargs["turn_detection"] = turn_detection
        logger.info("AgentSession created with turn detection")
    else:
        logger.info("AgentSession created without turn detection (using VAD only)")
    
    session = AgentSession[UserData](**session_kwargs)

    # CRITICAL: Only respond to FINAL transcripts - ignore partial transcripts to prevent interruptions
    # This allows users to speak fully without being cut off
    @session.on("user_input_transcribed")
    def _on_transcript(event):
        try:
            transcript = getattr(event, "transcript", "").strip()
            is_final = getattr(event, "is_final", False)
            # ONLY respond to FINAL transcripts - ignore partial transcripts completely
            if transcript and is_final:  # CRITICAL: Only process final transcripts
                logger.info(f"Final transcript received: {transcript}")
                try:
                    session.generate_reply(user_input=transcript)
                    logger.info(f"Reply generation started for final transcript: {transcript}")
                except Exception as e:
                    logger.error(f"Error calling generate_reply: {e}", exc_info=True)
            elif transcript and not is_final:
                # Log partial transcripts but DO NOT respond - let user finish speaking
                logger.debug(f"Partial transcript (ignoring): {transcript}")
        except Exception as e:
            logger.error(f"Error in transcript handler: {e}", exc_info=True)

    # Simplified: No Tavus avatar, no RPC handlers - just voice-to-voice conversation
    logger.info("Voice-to-voice mode: No Tavus avatar, no flashcards, no quizzes")

    # Start the agent session - on_enter() is empty so no automatic greeting
    logger.info("Starting agent session with optimized settings...")
    await session.start(
        room=ctx.room,
        room_input_options=RoomInputOptions(
            # Optimize for ULTRA-FAST audio processing
            audio_sample_rate=16000,  # Standard sample rate for faster processing
            audio_num_channels=1,  # Mono audio for faster processing
        ),
        room_output_options=RoomOutputOptions(
            audio_enabled=True,  # Enable audio output - CRITICAL for frontend detection
        ),
        agent=agent
    )
    logger.info("Agent session started successfully")
    
    # Wait a moment for session to fully initialize
    await asyncio.sleep(0.5)
    
    # Verify that audio tracks are published
    logger.info(f"Agent participant identity: {ctx.room.local_participant.identity}")
    logger.info(f"Agent participant name: {ctx.room.local_participant.name}")
    
    # CRITICAL: Wait for user to connect, then publish greeting audio track
    # The frontend connects first, then dispatches the agent
    # We need to wait for the user to be in the room before greeting
    logger.info("=" * 80)
    logger.info("WAITING FOR USER TO CONNECT")
    logger.info("=" * 80)
    
    # Wait up to 10 seconds for user to connect (they connect before agent is dispatched)
    max_wait = 10
    waited = 0
    while len(ctx.room.remote_participants) == 0 and waited < max_wait:
        await asyncio.sleep(0.5)
        waited += 0.5
    
    user_count = len(ctx.room.remote_participants)
    logger.info(f"✅ Users in room: {user_count}")
    
    # Now publish greeting using session.say() - this will create an audio track
    logger.info("=" * 80)
    logger.info("PUBLISHING GREETING AUDIO TRACK")
    logger.info("=" * 80)
    
    try:
        greeting_text = "Hei! I'm Knuut, your Finnish language teacher. How can I help you today?"
        logger.info(f"🎤 Saying greeting: {greeting_text}")
        
        # Use session.say() - this generates TTS and publishes audio track
        await session.say(greeting_text)
        logger.info("✅ session.say() completed - audio track should be published")
        
        # Wait for audio track to be published and visible to remote participants
        await asyncio.sleep(3.0)  # Give time for TTS generation and track publication
        
        # Verify audio tracks are published
        track_count = len(ctx.room.local_participant.track_publications)
        logger.info(f"📊 Published tracks count: {track_count}")
        if track_count > 0:
            for pub in ctx.room.local_participant.track_publications.values():
                try:
                    muted = getattr(pub, 'is_muted', False)
                    logger.info(f"  ✅ Track: source={pub.source}, kind={pub.kind}, name={getattr(pub, 'name', 'N/A')}")
                except Exception as e:
                    logger.info(f"  ✅ Track: source={pub.source}, kind={pub.kind}")
            logger.info("✅✅✅ Audio track published - frontend should detect agent now! ✅✅✅")
        else:
            logger.error("❌❌❌ NO AUDIO TRACKS PUBLISHED! This is why frontend can't detect agent! ❌❌❌")
            
        # Log remote participants to verify they can see us
        logger.info(f"🔍 Remote participants: {len(ctx.room.remote_participants)}")
        for p in ctx.room.remote_participants.values():
            logger.info(f"  👤 Remote: {p.identity}, audio tracks: {len(p.audio_track_publications)}")
            
    except Exception as e:
        logger.error(f"❌ ERROR publishing greeting: {e}", exc_info=True)
        import traceback
        logger.error(traceback.format_exc())
        logger.warning("Agent will continue - user can still interact")

if __name__ == "__main__":
    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint
        )
    )
