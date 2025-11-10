    @function_tool
    async def create_flash_card(self, context: RunContext[UserData], question: str, answer: str):
        """Create a new flash card and display it to the user. USE THIS whenever you teach a new Finnish word or phrase.
        
        IMPORTANT: This function automatically displays the flashcard on the user's screen. Just call it with the question and answer.

        Args:
            question: The question or front side of the flash card (e.g., "What does 'Hei' mean?")
            answer: The answer or back side of the flash card (e.g., "Hello")
        """
        try:
            userdata = context.userdata
            logger.info(f"🃏 Creating flashcard: Q='{question}' A='{answer}'")
            card = userdata.add_flash_card(question, answer)

            # Get the room from the userdata
            if not userdata.ctx or not userdata.ctx.room:
                logger.error("❌ Cannot access room from userdata.ctx")
                return f"Created a flash card, but couldn't access the room to send it."

            room = userdata.ctx.room

            # Get the first participant in the room (should be the client)
            participants = room.remote_participants
            if not participants:
                logger.error("❌ No remote participants found in room")
                return f"Created a flash card, but no participants found to send it to."

            # Get the first participant from the dictionary of remote participants
            participant = next(iter(participants.values()), None)
            if not participant:
                logger.error("❌ Could not get first participant")
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
            logger.info(f"📤 Sending flashcard via RPC to {participant.identity}: {json_payload}")
            
            try:
                await room.local_participant.perform_rpc(
                    destination_identity=participant.identity,
                    method="client.flashcard",
                    payload=json_payload
                )
                logger.info(f"✅ Flashcard sent successfully!")
            except Exception as e:
                logger.error(f"❌ Error sending flashcard via RPC: {e}", exc_info=True)
                return f"Created a flash card but failed to send it: {str(e)}"

            return f"Flashcard created and displayed! Question: '{question}'"
        except Exception as e:
            logger.error(f"❌ Error in create_flash_card: {e}", exc_info=True)
            return f"Error creating flashcard: {str(e)}"

    @function_tool
    async def create_quiz(self, context: RunContext[UserData], questions: List[QuizQuestionDict]):
        """Create a new quiz with multiple choice questions and display it to the user. USE THIS when user asks for a quiz or wants to practice.
        
        IMPORTANT: This function automatically displays the quiz on the user's screen. Just call it with the questions.
        DO NOT mention this function in your speech - it runs silently in the background.
        You MUST include at least 3-5 questions. Each question needs at least 2-4 answer options, with exactly ONE marked as correct.

        Args:
            questions: A list of question objects. Each question object must have:
                - text: The question text (e.g., "What does 'Hei' mean?")
                - answers: A list of 2-4 answer objects, each with:
                    - text: The answer text (e.g., "Hello")
                    - is_correct: Boolean - set to True for the correct answer, False for others
                    
        Example:
            questions = [
                {
                    "text": "What does 'Hei' mean?",
                    "answers": [
                        {"text": "Hello", "is_correct": True},
                        {"text": "Goodbye", "is_correct": False},
                        {"text": "Thank you", "is_correct": False}
                    ]
                },
                {
                    "text": "How do you say 'Good morning' in Finnish?",
                    "answers": [
                        {"text": "Hyvää huomenta", "is_correct": True},
                        {"text": "Hei", "is_correct": False},
                        {"text": "Kiitos", "is_correct": False}
                    ]
                }
            ]
        """
        try:
            userdata = context.userdata
            logger.info(f"📝 Creating quiz with {len(questions)} questions")
            
            if not questions or len(questions) == 0:
                logger.error("❌ No questions provided to create_quiz")
                return "Error: Quiz must have at least one question. Please provide questions."
            
            quiz = userdata.add_quiz(questions)

            # Get the room from the userdata
            if not userdata.ctx or not userdata.ctx.room:
                logger.error("❌ Cannot access room from userdata.ctx")
                return f"Created a quiz, but couldn't access the room to send it."

            room = userdata.ctx.room

            # Get the first participant in the room (should be the client)
            participants = room.remote_participants
            if not participants:
                logger.error("❌ No remote participants found in room")
                return f"Created a quiz, but no participants found to send it to."

            # Get the first participant from the dictionary of remote participants
            participant = next(iter(participants.values()), None)
            if not participant:
                logger.error("❌ Could not get first participant")
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
            logger.info(f"📤 Sending quiz via RPC to {participant.identity}: {len(client_questions)} questions")
            
            try:
                await room.local_participant.perform_rpc(
                    destination_identity=participant.identity,
                    method="client.quiz",
                    payload=json_payload
                )
                logger.info(f"✅ Quiz sent successfully!")
            except Exception as e:
                logger.error(f"❌ Error sending quiz via RPC: {e}", exc_info=True)
                return f"Created a quiz but failed to send it: {str(e)}"

            return f"Quiz created and displayed! It has {len(questions)} questions. Answer them when you're ready!"
        except Exception as e:
            logger.error(f"❌ Error in create_quiz: {e}", exc_info=True)
            return f"Error creating quiz: {str(e)}"

