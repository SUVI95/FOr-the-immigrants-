# Skills Matching System - Complete Documentation

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [EU AI Act Compliance](#eu-ai-act-compliance)
4. [Components](#components)
5. [API Endpoints](#api-endpoints)
6. [Database Schema](#database-schema)
7. [User Flows](#user-flows)
8. [Setup Instructions](#setup-instructions)

---

## System Overview

The Skills Matching System is a **EU AI Act compliant** job matching platform that helps immigrants in Finland find employment opportunities based on their skills, qualifications, and language level.

### Key Features

- ✅ **Non-AI Rule-Based Matching** (No Risk) - Calculates job fit scores
- ✅ **AI Skills Analysis** (Low-Risk) - Extracts and maps skills to ESCO framework
- ✅ **AI Job Suggestions** (Low-Risk) - Optional personalized suggestions
- ✅ **OPH Recognition Fast-Track** - Foreign qualification recognition
- ✅ **Retention Tracking** - Job retention monitoring
- ✅ **Impact Dashboards** - User and municipality metrics

### Core Principle

**"AI Assists, User Decides, Employer Chooses"**

- AI is never in the hiring decision chain
- Users always decide which jobs to apply for
- Employers make independent hiring decisions
- AI only provides information and suggestions

---

## Architecture

### Two-Tier Approach

```
┌─────────────────────────────────────────┐
│  Tier 1: Non-AI Matching (NO RISK)   │
│  - Rule-based algorithm                │
│  - Deterministic calculations          │
│  - Transparent match scores             │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│  Tier 2: AI Suggestions (LOW-RISK)    │
│  - Optional AI explanations             │
│  - Informational only                  │
│  - User can toggle on/off              │
└─────────────────────────────────────────┘
```

### Component Structure

```
avatars/tavus/voice-assistant-frontend/
├── lib/
│   └── skills-matching-engine.ts        # Non-AI matching algorithm
├── components/
│   ├── SkillsJobMatching.tsx            # Main matching UI
│   ├── SkillsDiscoveryPanel.tsx         # Skills analysis UI
│   ├── OPHRecognitionTracker.tsx         # OPH recognition UI
│   ├── RetentionTracker.tsx             # Retention tracking UI
│   └── ImpactDashboard.tsx               # Impact metrics UI
├── app/
│   ├── work-opportunities/
│   │   └── page.tsx                     # Work opportunities page (integrated)
│   └── api/
│       ├── skills/
│       │   ├── analyze/route.ts         # AI skills analysis (LOW-RISK)
│       │   └── get/route.ts              # Get user skills
│       ├── jobs/
│       │   ├── match/route.ts            # Non-AI matching (NO RISK)
│       │   └── ai-suggestions/route.ts  # AI suggestions (LOW-RISK)
│       ├── oph-recognition/route.ts     # OPH recognition API
│       ├── retention/route.ts           # Retention tracking API
│       └── impact/route.ts               # Impact metrics API
```

---

## EU AI Act Compliance

### Risk Classifications

| Component | Risk Level | Compliance | Purpose |
|-----------|-----------|------------|---------|
| Rule-Based Matching | **NO RISK** | None | Calculate job matches |
| AI Skills Analysis | **LOW-RISK** | Minimal (transparency) | Extract and explain skills |
| AI Suggestions | **LOW-RISK** | Minimal (transparency) | Provide job suggestions |
| **Total System** | **LOW-RISK** | **Minimal** | **User empowerment** |

### Compliance Features

#### Non-AI Matching (No Risk)
- ✅ Deterministic algorithm (no machine learning)
- ✅ Fully transparent calculations
- ✅ User can see match breakdown
- ✅ No AI decision-making

#### AI Components (Low-Risk)
- ✅ Transparency notices in UI
- ✅ Users can opt-out of AI suggestions
- ✅ Educational purpose only
- ✅ No employment decisions
- ✅ Clear disclaimers
- ✅ GDPR compliant data handling
- ✅ Pseudonymization for AI calls

---

## Components

### 1. SkillsJobMatching Component

**File:** `components/SkillsJobMatching.tsx`

**Purpose:** Display jobs matched to user skills with transparent match scores

**Features:**
- Loads rule-based matches from API
- Displays match scores (0-100%)
- Shows match breakdown (skills, language, qualifications)
- Lists matched and missing skills
- Optional AI suggestions toggle
- EU AI Act compliance notice

**Usage:**
```tsx
import { SkillsJobMatching } from "@/components/SkillsJobMatching";

<SkillsJobMatching />
```

### 2. SkillsDiscoveryPanel Component

**File:** `components/SkillsDiscoveryPanel.tsx`

**Purpose:** AI-powered skills analysis and extraction

**Features:**
- Analyzes user qualifications
- Maps skills to ESCO framework
- Creates skills profile
- Research consent form

### 3. OPHRecognitionTracker Component

**File:** `components/OPHRecognitionTracker.tsx`

**Purpose:** Track foreign qualification recognition with OPH

**Features:**
- Submit recognition requests
- Track recognition status
- View decision notes
- OPH reference numbers

### 4. RetentionTracker Component

**File:** `components/RetentionTracker.tsx`

**Purpose:** Track job retention and integration progress

**Features:**
- Check-in timeline (1, 3, 12 months)
- Satisfaction scores
- Retention status
- Leave reasons

### 5. ImpactDashboard Component

**File:** `components/ImpactDashboard.tsx`

**Purpose:** Display impact metrics for users and municipalities

**Features:**
- User progress view
- Municipality aggregate view
- Job placements, language progress, skills gained
- Retention rates
- Average time to employment

---

## API Endpoints

### Skills Analysis

#### `POST /api/skills/analyze`
- **Risk:** LOW-RISK AI
- **Purpose:** Analyze user skills and map to ESCO
- **Input:** `{ userId, qualifications, workExperience }`
- **Output:** `{ skills, analysis, explanation }`

#### `GET /api/skills/get`
- **Risk:** No Risk
- **Purpose:** Get user skills from database
- **Input:** `?userId=...`
- **Output:** `{ skills: string[] }`

### Job Matching

#### `POST /api/jobs/match`
- **Risk:** NO RISK (Non-AI)
- **Purpose:** Calculate job matches using rule-based algorithm
- **Input:** `{ userId, jobIds? }`
- **Output:** `{ matches: MatchResult[] }`

#### `GET /api/jobs/match`
- **Risk:** No Risk
- **Purpose:** Get saved matches for user
- **Input:** `?userId=...&limit=20`
- **Output:** `{ matches: MatchResult[] }`

#### `POST /api/jobs/ai-suggestions`
- **Risk:** LOW-RISK AI
- **Purpose:** Get AI-generated job suggestions
- **Input:** `{ userId, jobIds, userSkills, userLanguageLevel }`
- **Output:** `{ suggestions: AISuggestion[] }`

### OPH Recognition

#### `POST /api/oph-recognition`
- **Risk:** No Risk
- **Purpose:** Submit recognition request
- **Input:** `{ userId, qualificationTitle, qualificationType, issuingCountry, issuingInstitution, documentUrl }`
- **Output:** `{ requestId, status, message }`

#### `GET /api/oph-recognition`
- **Risk:** No Risk
- **Purpose:** Get recognition status
- **Input:** `?userId=...&requestId=...`
- **Output:** `{ requests: OPHRequest[] }`

#### `PUT /api/oph-recognition`
- **Risk:** No Risk
- **Purpose:** Update recognition request status
- **Input:** `{ requestId, status, ophReferenceNumber, decisionNotes, translatedDocumentUrl }`
- **Output:** `{ requestId, status, updatedAt }`

### Retention Tracking

#### `GET /api/retention`
- **Risk:** No Risk
- **Purpose:** Get retention records
- **Input:** `?userId=...`
- **Output:** `{ records: RetentionRecord[] }`

#### `POST /api/retention`
- **Risk:** No Risk
- **Purpose:** Create retention record
- **Input:** `{ userId, jobId, companyName, startDate }`
- **Output:** `{ recordId, status }`

### Impact Metrics

#### `GET /api/impact`
- **Risk:** No Risk
- **Purpose:** Get impact metrics
- **Input:** `?userId=...` or `?municipality=true`
- **Output:** `{ metrics: ImpactMetrics }`

---

## Database Schema

**File:** `database_schema_skills_matching.sql`

### Key Tables

1. **`job_opportunities`** - Job listings with required skills
2. **`skills_profiles`** - User skills in ESCO format
3. **`skills_analyses`** - AI-generated analyses (LOW-RISK)
4. **`job_matches`** - Rule-based match results (NO RISK)
5. **`oph_recognition_requests`** - OPH qualification recognition
6. **`retention_tracking`** - Job retention monitoring
7. **`impact_metrics`** - Analytics for dashboards
8. **`professional_connections`** - Network connections

### Migration Instructions

See [Setup Instructions](#setup-instructions) below.

---

## User Flows

### Flow 1: Skills Analysis & Job Matching

```
1. User completes skills analysis
   ↓
2. AI analyzes skills (LOW-RISK) → Extracts skills, maps to ESCO
   ↓
3. Non-AI matching engine calculates job matches (NO RISK)
   ↓
4. User sees jobs sorted by match score (rule-based)
   ↓
5. Optional: User enables AI suggestions (LOW-RISK)
   ↓
6. User browses jobs and decides which to apply for
   ↓
7. User applies directly to employer
   ↓
8. Employer makes hiring decision (no AI involved)
```

### Flow 2: OPH Recognition

```
1. User submits qualification recognition request
   ↓
2. Document uploaded and translated (if needed)
   ↓
3. Request sent to OPH
   ↓
4. Status tracked: pending → submitted → in_review → approved/rejected
   ↓
5. User receives updates and decision
```

### Flow 3: Retention Tracking

```
1. User starts a job
   ↓
2. Retention record created
   ↓
3. Check-ins at 1, 3, 12 months
   ↓
4. Satisfaction scores recorded
   ↓
5. Retention status tracked
```

---

## Setup Instructions

### 1. Database Migration

**Option A: Using Neon SQL Editor (Recommended)**

1. Go to: https://console.neon.tech/app/projects/proud-breeze-78072175/sql
2. Open `avatars/tavus/database_schema_skills_matching.sql`
3. Copy all SQL code
4. Paste into Neon SQL Editor
5. Click "Run"

**Option B: Using psql command line**

```bash
cd /Users/gisrieliamaro/FOr-the-immigrants-/avatars/tavus
psql 'postgresql://neondb_owner:npg_A35QzgMxEqHo@ep-old-voice-a9yusk0l-pooler.gwc.azure.neon.tech/neondb?sslmode=require&channel_binding=require' < database_schema_skills_matching.sql
```

### 2. Verify Tables Created

After migration, verify these tables exist:
- ✅ `job_opportunities`
- ✅ `skills_profiles`
- ✅ `skills_analyses`
- ✅ `job_matches`
- ✅ `oph_recognition_requests`
- ✅ `retention_tracking`
- ✅ `impact_metrics`
- ✅ `professional_connections`

### 3. Component Integration

The `SkillsJobMatching` component is already integrated into:
- `app/work-opportunities/page.tsx`

To add other components:

```tsx
import { OPHRecognitionTracker } from "@/components/OPHRecognitionTracker";
import { RetentionTracker } from "@/components/RetentionTracker";
import { ImpactDashboard } from "@/components/ImpactDashboard";

// Add to your page
<OPHRecognitionTracker />
<RetentionTracker />
<ImpactDashboard />
```

### 4. Environment Variables

Ensure these are set in `.env`:
```bash
DATABASE_URL=postgresql://...
OPENAI_API_KEY=...  # For AI skills analysis and suggestions
```

---

## Match Score Calculation

### Algorithm (Non-AI, Rule-Based)

```
Overall Score = (Skills Match × 60%) + (Language Match × 30%) + (Qualifications × 10%)

Where:
- Skills Match: Percentage of required skills user has (0-100%)
- Language Match: Comparison of user level vs required level (0-100%)
- Qualifications: Simple keyword matching (0-100%)
```

### Match Score Interpretation

- **80-100%**: Excellent match (Green)
- **60-79%**: Good match (Yellow)
- **40-59%**: Partial match (Yellow)
- **0-39%**: Limited match (Red)

---

## ESCO Framework Integration

The system uses the **European Skills, Competences, Qualifications and Occupations (ESCO)** framework for standardized skill mapping.

### ESCO Skill Format

```json
{
  "skill": "Communication",
  "esco_code": "S1.1",
  "level": "intermediate",
  "source": "qualification"
}
```

### Benefits

- ✅ Standardized skill recognition across Europe
- ✅ Better matching accuracy
- ✅ Easier skill transferability
- ✅ Compliance with EU standards

---

## Testing

### Test Skills Analysis

1. Navigate to work-opportunities page
2. Complete skills analysis
3. Verify skills are extracted and mapped to ESCO
4. Check skills profile in database

### Test Job Matching

1. Ensure user has skills profile
2. Navigate to work-opportunities page
3. Verify `SkillsJobMatching` component loads
4. Check match scores are calculated
5. Verify match breakdown is displayed

### Test AI Suggestions

1. Enable AI suggestions toggle
2. Verify suggestions appear
3. Check disclaimers are shown
4. Verify suggestions are informational only

---

## Troubleshooting

### No Matches Showing

- Check user has completed skills analysis
- Verify `skills_profiles` table has user data
- Check `job_opportunities` table has active jobs
- Verify API endpoints are working

### AI Suggestions Not Loading

- Check `OPENAI_API_KEY` is set
- Verify API endpoint is accessible
- Check browser console for errors
- Ensure user has skills profile

### Database Errors

- Verify database migration completed
- Check `DATABASE_URL` is correct
- Verify tables exist
- Check database connection

---

## Maintenance

### Adding New Job Opportunities

Insert into `job_opportunities` table:

```sql
INSERT INTO job_opportunities (
  title, company, field, city, language_requirement, job_type,
  description, requirements, required_skills, preferred_skills,
  language_level_required, xp_reward, deadline, application_link, tags
) VALUES (...);
```

### Updating Match Algorithm

Edit `lib/skills-matching-engine.ts`:
- Modify `calculateSkillsMatch` function
- Adjust scoring weights
- Add new matching criteria

---

## Support & Documentation

- **EU AI Act Compliance:** See `EU_AI_ACT_COMPLIANT_SKILLS_MATCHING.md`
- **De-Risking Strategy:** See `DE_RISKING_STRATEGY.md`
- **Implementation Summary:** See `IMPLEMENTATION_SUMMARY_SKILLS_MATCHING.md`

---

**Last Updated:** 2025-01-XX
**Version:** 1.0.0
**Status:** ✅ Production Ready

