# Knuut AI - Design Overview

## 🎨 Current UI Design

### Design Pattern: **Modal Overlays** (Not Side Menu)

The current design uses **modal overlays** that appear on top of the main screen when groups/events are found.

---

## 📱 Main Screen Layout

```
┌─────────────────────────────────────────────┐
│  [Knuut AI Voice Assistant - Main Screen]   │
│                                             │
│    ┌─────────────────────────────────┐     │
│    │                                 │     │
│    │   [Avatar/Video Visualizer]     │     │
│    │   or Audio Waveform             │     │
│    │                                 │     │
│    └─────────────────────────────────┘     │
│                                             │
│    "How can I help you today?"             │
│                                             │
│    ┌─────────────────────────────────┐     │
│    │ [Conversation History]         │     │
│    │                                 │     │
│    │ You: "Find groups for mothers"  │     │
│    │ Knuut: "I found 3 groups..."    │     │
│    └─────────────────────────────────┘     │
│                                             │
│    [🎤 Hold to speak] [📋 View Cards]      │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🎯 Modal Overlay (Groups/Events)

When user says "find groups" or "show events", a modal appears:

```
┌─────────────────────────────────────────────┐
│  [Dark Background Overlay - 50% opacity]   │
│                                             │
│         ┌───────────────────────────┐     │
│         │  Community Groups     [×] │     │
│         ├───────────────────────────┤     │
│         │                           │     │
│         │  ┌─────────────────────┐  │     │
│         │  │ 👶                 │  │     │
│         │  │ Mothers with Kids  │  │     │
│         │  │                     │  │     │
│         │  │ Coffee meetups for │  │     │
│         │  │ mothers in Kajaani │  │     │
│         │  │                     │  │     │
│         │  │ 📍 Kajaani Center  │  │     │
│         │  │ 👥 5 members       │  │     │
│         │  │                     │  │     │
│         │  │ [Join] [View Map]  │  │     │
│         │  └─────────────────────┘  │     │
│         │                           │     │
│         │  ┌─────────────────────┐  │     │
│         │  │ 🗣️                 │  │     │
│         │  │ Language Exchange   │  │     │
│         │  │                     │  │     │
│         │  │ Practice Finnish &  │  │     │
│         │  │ English together    │  │     │
│         │  │                     │  │     │
│         │  │ 📍 1.2 km away      │  │     │
│         │  │ 👥 12 members       │  │     │
│         │  │                     │  │     │
│         │  │ [Join] [View Map]  │  │     │
│         │  └─────────────────────┘  │     │
│         │                           │     │
│         │  [Scrollable if many]     │     │
│         └───────────────────────────┘     │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 📅 Event Modal Example

```
┌─────────────────────────────────────────────┐
│  [Dark Background Overlay]                  │
│                                             │
│         ┌───────────────────────────┐     │
│         │  Upcoming Events      [×] │     │
│         ├───────────────────────────┤     │
│         │                           │     │
│         │  ┌─────────────────────┐  │     │
│         │  │ 📅                 │  │     │
│         │  │ Coffee & Playdate  │  │     │
│         │  │                     │  │     │
│         │  │ Tomorrow, 10:00 AM │  │     │
│         │  │                     │  │     │
│         │  │ Coffee meetup for  │  │     │
│         │  │ mothers with kids  │  │     │
│         │  │                     │  │     │
│         │  │ 📍 Kahvila Kajaani │  │     │
│         │  │ 👥 4 going         │  │     │
│         │  │                     │  │     │
│         │  │ [RSVP] [View Map] │  │     │
│         │  └─────────────────────┘  │     │
│         │                           │     │
│         └───────────────────────────┘     │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🎨 Design Features

### ✅ Current Design:
- **Modal Overlays** - Full-screen dark background with centered content
- **Card-Based Layout** - Clean, modern cards for each group/event
- **Smooth Animations** - Framer Motion for entrance/exit
- **Mobile Responsive** - Works on all screen sizes
- **Google Maps Integration** - Opens in new tab
- **Icons** - Visual icons for group types (👶 🗣️ ⚽ 🎭)

### Color Scheme:
- **Primary Blue**: `#0066FF` (buttons, accents)
- **Success Green**: `#00C853` (map buttons)
- **Background**: White cards on dark overlay
- **Text**: Dark gray (`#1A1A1A`)

---

## 📂 Component Structure

```
voice-assistant-frontend/
├── app/
│   └── page.tsx              # Main page (includes Group/Event containers)
│
└── components/
    ├── GroupContainer.tsx     # Modal overlay for groups
    ├── GroupCard.tsx          # Individual group card
    ├── EventContainer.tsx     # Modal overlay for events
    ├── EventCard.tsx          # Individual event card
    ├── FlashCardContainer.tsx # Existing flashcards
    └── QuizContainer.tsx      # Existing quizzes
```

---

## 🔄 User Flow

1. **User talks to Knuut:**
   ```
   User: "Find groups for mothers with kids"
   ```

2. **Agent processes:**
   - Calls `find_groups(group_type="mothers_with_kids")`
   - Queries database
   - Sends data via RPC to frontend

3. **Frontend displays:**
   - Modal overlay appears with smooth animation
   - Cards show matching groups
   - User can click "Join" or "View Map"

4. **User interacts:**
   - Click "Join" → Updates database, shows success
   - Click "View Map" → Opens Google Maps in new tab
   - Click "×" → Closes modal

---

## 🚀 To See It In Action:

1. **Install dependencies:**
   ```bash
   cd avatars/tavus
   pip install asyncpg
   
   cd voice-assistant-frontend
   npm install
   ```

2. **Set up database:**
   - Add `DATABASE_URL` to `.env`
   - Run `database_schema.sql` in Neon

3. **Start everything:**
   ```bash
   # Terminal 1: Agent
   cd avatars/tavus
   ./start_agent.sh
   
   # Terminal 2: Frontend
   cd avatars/tavus/voice-assistant-frontend
   npm run dev
   ```

4. **Test it:**
   - Open http://localhost:3000
   - Click "Start a conversation"
   - Say: "Create a group for mothers with kids"
   - See the modal appear with the group card!

---

## 💡 Future Design Options (Not Implemented Yet)

If you want to change the design, we could add:

1. **Side Menu:**
   - Left sidebar with navigation
   - Always visible groups/events list
   - Dashboard view

2. **Bottom Sheet:**
   - Slide up from bottom (mobile-friendly)
   - Swipe to dismiss

3. **Tabbed Interface:**
   - Tabs for Groups, Events, Dashboard
   - No overlays, always visible

4. **Embedded Maps:**
   - Google Maps embedded in cards
   - No need to open new tab

---

**Current Design: Modal Overlays** ✅
**Status: Fully Implemented** ✅

