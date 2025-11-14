# Knuut AI - Comprehensive Application Guide

## 📖 Table of Contents

1. [Overview](#overview)
2. [Core Purpose & Mission](#core-purpose--mission)
3. [Application Architecture](#application-architecture)
4. [All Features & Pages](#all-features--pages)
5. [AI Integration & How It Helps](#ai-integration--how-it-helps)
6. [User Flows](#user-flows)
7. [EU AI Act Compliance](#eu-ai-act-compliance)
8. [Technical Stack](#technical-stack)
9. [Database Schema](#database-schema)
10. [API Endpoints](#api-endpoints)
11. [How Everything Works Together](#how-everything-works-together)

---

## Overview

**Knuut AI** is a comprehensive integration platform designed to help immigrants in Finland find employment, learn Finnish, build professional networks, and successfully integrate into Finnish society. The platform combines AI-powered assistance with rule-based systems to provide personalized support while maintaining EU AI Act compliance.

### Key Statistics
- **Target Users:** Adult immigrants in Finland (all education levels)
- **Language:** Simplified to 7th-grade reading level
- **AI Risk Level:** LOW-RISK (compliant with EU AI Act)
- **Primary Goal:** Bridge the gap between immigrant skills and Finnish job market

---

## Core Purpose & Mission

### Problem Statement
Finland faces significant challenges in immigrant employment and retention:
- **Language Gatekeeping:** Many jobs require Finnish, even when not necessary
- **Skills Recognition:** Foreign qualifications take 6-12 months to recognize
- **Professional Networks:** Immigrants lack connections to break into Finnish labor markets
- **Retention:** ~17% of immigrants leave Finland within 10 years

### Solution
Knuut AI provides:
1. **Skills-to-Jobs Bridge:** Match immigrant skills with job opportunities
2. **Workplace Language Learning:** Learn Finnish while working, not just in classrooms
3. **Fast-Track Recognition:** Streamline foreign qualification recognition (3-4 months vs 6-12 months)
4. **Professional Networking:** Connect with mentors and employers
5. **Retention Support:** On-the-job support to ensure long-term success

---

## Application Architecture

### Frontend (React/TypeScript/Next.js)
- **Location:** `avatars/tavus/voice-assistant-frontend/`
- **Framework:** Next.js 14 with App Router
- **Styling:** Inline styles (modern, responsive design)
- **State Management:** React Context API (`UserProfileContext`)
- **Voice Integration:** LiveKit for real-time voice assistant

### Backend (Python Agent)
- **Location:** `avatars/tavus/tavus.py`
- **Framework:** LiveKit Agents
- **AI Model:** OpenAI GPT-4o-mini
- **Database:** PostgreSQL (Neon)
- **Features:** Voice assistant, event/group management, skills analysis

### Database
- **Provider:** Neon PostgreSQL
- **Schema:** Multiple tables for users, skills, jobs, recognition, retention
- **Location:** `avatars/tavus/database_schema_skills_matching.sql`

---

## All Features & Pages

### 🏠 Main Pages

#### 1. **Home Page** (`/`)
- Welcome screen
- Quick access to main features
- Voice assistant toggle

#### 2. **My Journey** (`/my-journey`)
- **Purpose:** Personal dashboard showing integration progress
- **Features:**
  - XP & Leveling system (gamification)
  - Impact Wallet (volunteering hours, impact points)
  - Skill Passport Summary
  - Impact Dashboard (personal metrics)
  - Retention Tracker
  - Retention Support modules
  - Pathway Map (visual progress)
- **AI Help:** None (display only)

#### 3. **Work Opportunities** (`/work-opportunities`)
- **Purpose:** Find jobs that match user skills
- **Features:**
  - **Skills-Based Job Matching** (rule-based algorithm)
  - **Recommended Jobs** (auto-expanded for first-time users)
  - **Professional Networking & Mentoring** (find mentors, speed meetings)
  - **Company Visits & Training** (visit local companies)
  - **Workplace Language Coach** (integrated in each job card)
  - Job search filters (city, language, type)
- **AI Help:**
  - **Optional AI Suggestions:** Toggle on/off for informational job suggestions
  - **Skills Analysis:** AI analyzes user skills (LOW-RISK)
  - **Language Coach:** AI-powered real-time translation and phrase learning

#### 4. **My Skills** (`/my-skills`)
- **Purpose:** Build skills profile for job matching
- **Features:**
  - Step 1: Add Qualifications (with examples)
  - Step 2: Add Work Experience (with examples)
  - Step 3: Set Job Preferences (fields, types, locations)
  - Step 4: Analyze Skills with AI
  - Progress bar showing completion percentage
- **AI Help:**
  - **Skills Analysis (LOW-RISK):** AI extracts skills from qualifications/experience
  - Maps skills to ESCO framework (European Skills Framework)
  - Provides friendly summary: "We found you are strong in [skills]. Jobs like [examples] might fit your skills."

#### 5. **Learn Finnish** (`/learn-finnish`)
- **Purpose:** Learn Finnish language at your own pace
- **Features:**
  - **6 Learning Levels:** Beginner (A1) → Expert (C2) with simplified names
  - **AI Language Buddy:** Conversational practice with AI
  - **Pronunciation Practice:** Voice mode for speaking
  - **Quick Challenges:** 3-6 minute vocabulary exercises
  - **Full Curriculum:** Comprehensive lessons
  - **Progress Tracking:** Visual progress rings
  - **Workplace Language Coach:** Learn job-specific phrases
- **AI Help:**
  - **AI Language Buddy (LOW-RISK):** Conversational AI for language practice
  - **Pronunciation Feedback:** AI analyzes pronunciation
  - **Contextual Learning:** AI adapts to user's level

#### 6. **Recognition Fast-Track** (`/recognition-fast-track`)
- **Purpose:** Upload foreign qualifications and track OPH recognition
- **Features:**
  - Document upload (PDF, JPG, PNG)
  - OPH Recognition Tracker (status: pending → submitted → in_review → approved)
  - Expected processing time: 3-4 months (vs 6-12 months traditional)
  - Employer attestation for non-regulated roles
- **AI Help:** None (document processing may use AI for translation in future)

#### 7. **Community** (`/community`)
- **Purpose:** Find local groups, events, and resources
- **Features:**
  - **Community Groups:** Mothers with kids, language exchange, sports, etc.
  - **Events:** Meetups, workshops, cultural events
  - **Mentor Matching:** Find professional mentors
  - **Search & Filters:** By category, location, type
  - **Map View:** See groups/events on map
- **AI Help:** None (display only)

#### 8. **Volunteer** (`/volunteer`)
- **Purpose:** Find volunteer opportunities and skills exchange
- **Features:**
  - Volunteer opportunities listing
  - Skills exchange (e.g., "I'll teach you Arabic if you help me practice Finnish")
  - Application forms
  - Privacy protection
- **AI Help:** None (content moderation may use AI)

#### 9. **Smart CV Builder** (`/smart-cv-builder`)
- **Purpose:** Create a professional CV
- **Features:**
  - Nordic CV template
  - Editable fields
  - Download as PDF
  - Simple CV option (for less educated users)
- **AI Help:** None (future: AI suggestions for CV content)

#### 10. **Consent Hub** (`/consent-hub`)
- **Purpose:** Centralized location for all user agreements
- **Features:**
  - Research participation consent
  - Data protection settings
  - Privacy preferences
  - GDPR compliance
- **AI Help:** None

#### 11. **Knuut Voice** (`/knuut-voice`)
- **Purpose:** Voice assistant interface
- **Features:**
  - Real-time voice conversation
  - Transcription
  - Voice commands for navigation
  - Optional feature (can be toggled off)
- **AI Help:**
  - **Voice Assistant (LOW-RISK):** Conversational AI for navigation and help

---

## AI Integration & How It Helps

### 🎯 AI Risk Classification (EU AI Act)

The platform uses a **"User Empowerment"** model to keep AI risk LOW:

**Core Principle:** AI Assists, User Decides, Employer Chooses

### AI Features by Risk Level

#### ✅ LOW-RISK AI (Article 50 - Limited Risk)

**1. Skills Analysis** (`/api/skills/analyze`)
- **What it does:** Analyzes user qualifications and work experience to extract skills
- **How it helps:**
  - Identifies skills user might not realize they have
  - Maps skills to European Skills Framework (ESCO)
  - Provides friendly summary: "You are strong in [skills]"
- **Risk Level:** LOW-RISK (educational/informational only)
- **User Control:** User decides which jobs to apply for
- **Location:** `app/api/skills/analyze/route.ts`

**2. AI Language Buddy** (`/api/language-buddy`)
- **What it does:** Conversational AI for practicing Finnish
- **How it helps:**
  - Natural conversation practice
  - Adapts to user's language level
  - Provides corrections and feedback
- **Risk Level:** LOW-RISK (educational tool)
- **User Control:** User initiates conversations
- **Location:** `app/api/language-buddy/route.ts`

**3. Workplace Language Coach** (`/api/language/workplace-phrase`)
- **What it does:** Real-time translation and job-specific phrase learning
- **How it helps:**
  - Learn Finnish phrases while exploring jobs
  - Contextual vocabulary for specific jobs
  - Practice pronunciation
- **Risk Level:** LOW-RISK (educational tool)
- **User Control:** User chooses when to use it
- **Location:** `app/api/language/workplace-phrase/route.ts`

**4. Optional AI Job Suggestions** (`/api/jobs/ai-suggestions`)
- **What it does:** Provides informational job suggestions
- **How it helps:**
  - Explains why a job might be a good fit
  - Highlights transferable skills
  - Suggests jobs user might not have considered
- **Risk Level:** LOW-RISK (informational only, user decides)
- **User Control:** Toggle on/off, user applies independently
- **Location:** `app/api/jobs/ai-suggestions/route.ts`

**5. Voice Assistant** (LiveKit Agent)
- **What it does:** Voice-based navigation and help
- **How it helps:**
  - Natural language commands
  - Helps users navigate the platform
  - Answers questions about features
- **Risk Level:** LOW-RISK (assistance tool)
- **User Control:** Optional feature, can be toggled off
- **Location:** `avatars/tavus/tavus.py`

#### ✅ NO RISK (Not AI Systems)

**1. Rule-Based Job Matching** (`/api/jobs/match`)
- **What it does:** Matches jobs using deterministic algorithm
- **How it works:**
  - Skills Match: 60% weight
  - Language Level: 30% weight
  - Qualifications: 10% weight
  - Transparent scoring
- **Risk Level:** NO RISK (not an AI system)
- **User Control:** User sees match score and explanation
- **Location:** `app/api/jobs/match/route.ts`, `lib/skills-matching-engine.ts`

**2. Impact Dashboard** (`/api/impact`)
- **What it does:** Aggregates metrics for users and municipalities
- **How it helps:**
  - Shows personal progress
  - Municipality view for funders
  - Demo data for investors
- **Risk Level:** NO RISK (data aggregation)
- **Location:** `app/api/impact/route.ts`

**3. OPH Recognition Tracking** (`/api/oph-recognition`)
- **What it does:** Tracks foreign qualification recognition status
- **How it helps:**
  - Shows recognition progress
  - Expected timelines
  - Status updates
- **Risk Level:** NO RISK (status tracking)
- **Location:** `app/api/oph-recognition/route.ts`

---

## User Flows

### Flow 1: Finding a Job

```
1. User visits /my-skills
   ↓
2. Adds qualifications (e.g., "High School Diploma")
   ↓
3. Adds work experience (e.g., "Waiter at Restaurant (2020-2022)")
   ↓
4. Sets job preferences (fields, types, locations)
   ↓
5. Clicks "Analyze My Skills"
   → AI analyzes skills (LOW-RISK)
   → Shows friendly summary: "You are strong in customer service, communication..."
   ↓
6. User visits /work-opportunities
   ↓
7. Sees "Recommended for You" section (auto-expanded)
   ↓
8. Views matched jobs with:
   - Match score (e.g., 85% match)
   - Match breakdown (skills, language, qualifications)
   - Workplace Language Coach (can practice Finnish phrases)
   - Optional AI suggestions (toggle on/off)
   ↓
9. User clicks "Practice Language" on a job card
   → Opens Workplace Language Coach
   → Learns job-specific Finnish phrases
   ↓
10. User clicks "Apply Now"
    → Opens employer's application page
    → User applies directly (no AI in hiring decision)
```

### Flow 2: Learning Finnish

```
1. User visits /learn-finnish
   ↓
2. Sees 6 learning levels (Beginner → Expert)
   ↓
3. Clicks "Beginner • Everyday Finnish"
   ↓
4. Practices with AI Language Buddy
   → Conversational practice
   → Gets feedback on pronunciation
   ↓
5. Completes Quick Challenges (3-6 min exercises)
   ↓
6. Uses Voice Mode for pronunciation practice
   ↓
7. Progress tracked visually (progress rings)
```

### Flow 3: Recognition Fast-Track

```
1. User visits /recognition-fast-track
   ↓
2. Uploads foreign diploma/certificate (PDF, JPG, PNG)
   ↓
3. System creates recognition request
   ↓
4. Status shows: "Submitted to OPH"
   ↓
5. Expected processing time: 3-4 months
   ↓
6. User can track status in OPH Recognition Tracker
   ↓
7. When approved, status updates to "Approved"
```

### Flow 4: Professional Networking

```
1. User visits /work-opportunities
   ↓
2. Scrolls to "Professional Networking & Mentoring" section
   ↓
3. Clicks "Find Mentors" tab
   ↓
4. Filters by sector (Tech, Healthcare, Hospitality)
   ↓
5. Views mentor profiles:
   - Expertise
   - Availability
   - Match percentage
   ↓
6. Connects with mentor
   ↓
7. OR clicks "Speed Meetings" tab
   ↓
8. Registers for networking event
   ↓
9. Meets 5-7 employers/professionals
   ↓
10. Builds professional network
```

---

## EU AI Act Compliance

### Risk Classification Strategy

**Goal:** Keep AI risk LOW while maintaining value proposition

### De-Risking Approach

1. **No Direct Hiring Decisions**
   - AI never makes hiring recommendations to employers
   - Users apply directly to employers
   - Employers make independent decisions

2. **User Empowerment Model**
   - AI helps users understand their skills
   - AI shows opportunities
   - User decides which jobs to apply for

3. **Transparency**
   - Clear labeling: "AI Suggestions (Informational Only)"
   - Match score explanations
   - User always in control

4. **Educational Purpose**
   - Skills analysis is educational
   - Language learning is educational
   - No employment decisions

### Compliance Features

- **Transparency:** All AI features clearly labeled
- **User Control:** Toggle AI suggestions on/off
- **Data Protection:** GDPR compliant, pseudonymization
- **Documentation:** Clear explanations of how AI works
- **Risk Assessment:** LOW-RISK classification documented

---

## Technical Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Inline styles (responsive design)
- **State Management:** React Context API
- **Voice:** LiveKit JavaScript SDK
- **UI Components:** Custom React components

### Backend
- **Framework:** LiveKit Agents (Python)
- **AI Model:** OpenAI GPT-4o-mini
- **Database:** PostgreSQL (Neon)
- **Voice:** LiveKit for real-time communication

### Database
- **Provider:** Neon PostgreSQL
- **Schema:** Multiple tables for users, skills, jobs, recognition, retention
- **Migrations:** SQL scripts in `avatars/tavus/database_schema_skills_matching.sql`

### APIs
- **Next.js API Routes:** `/app/api/*`
- **RESTful:** Standard HTTP methods
- **Authentication:** User ID from context
- **Error Handling:** Comprehensive error messages

---

## Database Schema

### Key Tables

1. **users** - User accounts and profiles
2. **skills_profiles** - User skills and ESCO mappings
3. **skills_analyses** - AI skills analysis results
4. **job_opportunities** - Available job listings
5. **job_matches** - Rule-based job matches
6. **ai_job_suggestions** - Optional AI suggestions
7. **oph_recognition_requests** - Foreign qualification recognition
8. **retention_tracking** - Job retention check-ins
9. **impact_metrics** - Aggregated metrics
10. **groups** - Community groups
11. **events** - Community events
12. **research_data** - Anonymized research data

---

## API Endpoints

### Skills & Jobs
- `POST /api/skills/analyze` - AI skills analysis (LOW-RISK)
- `GET /api/skills/get` - Get user skills
- `POST /api/jobs/match` - Rule-based job matching (NO RISK)
- `POST /api/jobs/ai-suggestions` - Optional AI suggestions (LOW-RISK)

### Language Learning
- `POST /api/language-buddy` - AI Language Buddy (LOW-RISK)
- `POST /api/language/workplace-phrase` - Workplace Language Coach (LOW-RISK)

### Recognition
- `POST /api/oph-recognition` - Submit recognition request (NO RISK)
- `GET /api/oph-recognition` - Get recognition status (NO RISK)
- `PUT /api/oph-recognition` - Update recognition status (NO RISK)

### Impact & Retention
- `GET /api/impact` - Get impact metrics (NO RISK)
- `POST /api/retention` - Track retention (NO RISK)

### Community
- `POST /api/volunteer-application` - Volunteer application
- `POST /api/skills-exchange-contact` - Skills exchange contact

---

## How Everything Works Together

### System Integration

```
User → Frontend (React/Next.js)
         ↓
    API Routes (/api/*)
         ↓
    Database (PostgreSQL)
         ↓
    AI Services (OpenAI)
         ↓
    Voice Assistant (LiveKit)
```

### Data Flow Example: Skills Analysis

1. **User Input:** User adds qualifications and work experience in `/my-skills`
2. **Frontend:** Sends data to `POST /api/skills/analyze`
3. **API Route:** 
   - Sanitizes input
   - Calls OpenAI API for skills analysis
   - Maps skills to ESCO framework
   - Saves to `skills_profiles` and `skills_analyses` tables
4. **Response:** Returns skills list and friendly summary
5. **Frontend:** Displays skills and summary to user
6. **Job Matching:** User visits `/work-opportunities`
7. **Rule-Based Matching:** `POST /api/jobs/match` uses skills to match jobs
8. **Display:** Shows matched jobs with match scores

### AI Integration Points

1. **Skills Analysis:** AI extracts skills from text (LOW-RISK)
2. **Language Learning:** AI provides conversational practice (LOW-RISK)
3. **Job Suggestions:** Optional AI explanations (LOW-RISK)
4. **Voice Assistant:** Natural language navigation (LOW-RISK)

### Rule-Based Systems

1. **Job Matching:** Deterministic algorithm (NO RISK)
2. **Impact Metrics:** Data aggregation (NO RISK)
3. **Recognition Tracking:** Status updates (NO RISK)

---

## Key Design Principles

### 1. User Empowerment
- Users always in control
- AI assists, doesn't decide
- Clear explanations

### 2. Transparency
- Match scores explained
- AI features labeled
- User can see how matching works

### 3. Accessibility
- 7th-grade reading level
- Simple language
- Examples and tips
- Auto-expand important sections

### 4. Compliance
- EU AI Act compliant
- LOW-RISK AI classification
- GDPR compliant
- Data protection

### 5. Impact Measurement
- Personal metrics
- Municipality dashboards
- Retention tracking
- Research data (anonymized)

---

## Future Enhancements

### Planned Features
1. **CV Builder AI:** AI suggestions for CV content
2. **Document Translation:** AI translation for OPH documents
3. **Content Moderation:** AI moderation for community features
4. **Personalized Learning Paths:** AI-adapted learning recommendations

### Improvements
1. **"Start Here" Checklist:** First-time user onboarding
2. **Simplified CV Template:** For less educated users
3. **Map Alternatives:** List view for maps
4. **Voice Page Demo:** Animated GIF/audio samples

---

## Summary

**Knuut AI** is a comprehensive integration platform that:
- ✅ Helps immigrants find jobs through skills-based matching
- ✅ Provides AI-powered language learning
- ✅ Streamlines foreign qualification recognition
- ✅ Connects users with professional networks
- ✅ Supports retention with on-the-job modules
- ✅ Maintains EU AI Act compliance (LOW-RISK)
- ✅ Uses simple language (7th-grade reading level)
- ✅ Provides transparent, user-controlled AI assistance

**AI helps by:**
- Analyzing skills (educational purpose)
- Providing language practice (educational purpose)
- Suggesting opportunities (informational only)
- Assisting with navigation (help tool)

**Users always decide:**
- Which jobs to apply for
- Whether to use AI suggestions
- How to use the platform

**Employers always decide:**
- Who to hire
- Based on their own criteria
- Independently of AI

---

**Document Version:** 1.0  
**Last Updated:** 2024  
**Maintained By:** Development Team

