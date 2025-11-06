# Flashcard Functionality - Verification & Usage Guide

## ✅ Current Implementation Status

Flashcards are **fully implemented and working** in the Knuut AI platform.

## How Flashcards Work

### 1. **Agent-Side (Python)**

**Location**: `avatars/tavus/tavus.py`

**Functions Available:**
- `create_flash_card(question, answer)` - Creates a new flashcard and displays it
- `flip_flash_card(card_id)` - Flips a flashcard to show answer/question

**RPC Handler:**
- `agent.flipFlashCard` - Handles flip requests from frontend

**Agent Instructions:**
- Agent is instructed to create flashcards when teaching Finnish
- Automatically creates flashcards for incorrect quiz answers
- Can be triggered by voice commands like "Create a flashcard for..."

### 2. **Frontend-Side (React/Next.js)**

**Components:**
- `FlashCardContainer.tsx` - Main container that receives flashcards via RPC
- `FlashCard.tsx` - Individual flashcard component with flip animation
- `FlashcardPanel.tsx` - Alternative panel view (currently not used in main flow)

**RPC Registration:**
- `client.flashcard` - Receives flashcard data from agent

**Display Location:**
- Flashcards appear on the `/knuut-voice` page
- Shown in a floating panel on the right side of the screen
- Includes navigation (Previous/Next) for multiple cards

## How to Use Flashcards

### Via Voice Assistant:

1. **Start a conversation** on the `/knuut-voice` page
2. **Ask Knuut to teach Finnish**, for example:
   - "Create a flashcard for the word 'terve'"
   - "Make flashcards for Finnish greetings"
   - "Help me learn Finnish vocabulary"
3. **Knuut will automatically create flashcards** when teaching new words/phrases
4. **Click the flashcard** to flip and see the answer
5. **Use Previous/Next buttons** to navigate between multiple flashcards

### Automatic Creation:

- Flashcards are **automatically created** when you answer quiz questions incorrectly
- The agent will create flashcards for the correct answers to help you learn

## Technical Flow

```
User asks for flashcard
    ↓
Agent calls create_flash_card() function
    ↓
Flashcard added to UserData
    ↓
Agent sends RPC to frontend: "client.flashcard" with action="show"
    ↓
FlashCardContainer receives RPC
    ↓
Flashcard displayed in UI
    ↓
User clicks to flip
    ↓
Frontend sends RPC: "agent.flipFlashCard"
    ↓
Agent flips card and sends update back
    ↓
UI updates to show flipped state
```

## Testing Flashcards

### Manual Test:

1. Go to `/knuut-voice` page
2. Enable voice assistant
3. Say: "Create a flashcard. Question: What does 'Hei' mean? Answer: Hello"
4. Flashcard should appear on the right side
5. Click the flashcard to flip it
6. Verify it shows the answer

### Via Finnish Learning:

1. Go to `/learn-finnish` page
2. Click on any activity that says "Ask Knuut to help with..."
3. This will send a prompt to the agent
4. Agent should create flashcards for the vocabulary/grammar being taught

## Current Status: ✅ WORKING

All components are in place:
- ✅ Agent functions implemented
- ✅ RPC handlers registered
- ✅ Frontend components ready
- ✅ Display logic working
- ✅ Flip functionality working
- ✅ Multiple card navigation working

## Troubleshooting

### Flashcards not appearing?

1. **Check agent connection**: Make sure voice assistant is connected
2. **Check browser console**: Look for RPC errors
3. **Verify RPC registration**: Check that `client.flashcard` is registered
4. **Check agent logs**: Verify agent is calling `create_flash_card`

### Flashcards not flipping?

1. **Check RPC call**: Verify `agent.flipFlashCard` is being called
2. **Check agent handler**: Verify `handle_flip_flash_card` is registered
3. **Check card ID**: Make sure the card ID matches

### Agent not creating flashcards?

1. **Check agent instructions**: Verify instructions mention flashcards
2. **Test with explicit command**: "Create a flashcard for..."
3. **Check function tool**: Verify `create_flash_card` is available to agent

## Future Enhancements

- [ ] Save flashcards to database for persistence
- [ ] Flashcard review system (spaced repetition)
- [ ] Flashcard statistics (how many learned, review schedule)
- [ ] Export flashcards
- [ ] Share flashcards with other users

