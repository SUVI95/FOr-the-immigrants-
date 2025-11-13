# EU AI Act Compliant Skills Matching Implementation

## Overview

This document describes the implementation of skills-to-jobs matching that complies with the EU AI Act while maintaining full functionality and user value.

## Key Principle: **AI Assists, User Decides, Employer Chooses**

The system uses a **two-tier approach**:
1. **Non-AI Rule-Based Matching** (No Risk) - For actual job matching decisions
2. **LOW-RISK AI Suggestions** (Article 50) - For informational suggestions only

---

## Architecture

### 1. Non-AI Rule-Based Matching Engine

**Location:** `lib/skills-matching-engine.ts`

**EU AI Act Classification:** ✅ **NOT AN AI SYSTEM** (No Risk)

**How It Works:**
- Deterministic algorithm that calculates match scores based on:
  - Skills overlap (required vs user skills)
  - Language level comparison
  - Qualification matching
- Uses simple string matching and rule-based scoring
- No machine learning or AI decision-making
- Fully transparent and explainable

**Match Score Calculation:**
```
Overall Score = (Skills Match × 60%) + (Language Match × 30%) + (Qualifications × 10%)

Where:
- Skills Match: Percentage of required skills user has
- Language Match: Comparison of user level vs required level
- Qualifications: Simple keyword matching
```

**Benefits:**
- ✅ No regulatory burden
- ✅ Fast and reliable
- ✅ Fully transparent
- ✅ User can see exactly why a job matches

---

### 2. AI Skills Analysis (LOW-RISK)

**Location:** `app/api/skills/analyze/route.ts`

**EU AI Act Classification:** ✅ **Limited Risk AI** (Article 50)

**Purpose:**
- Extract skills from user qualifications and experience
- Map skills to ESCO (European Skills Framework) when possible
- Provide educational explanations of skills profile
- **NOT used for job matching decisions**

**Compliance:**
- ✅ Transparency: Users informed it's AI-generated
- ✅ User control: Users can opt-out or ignore suggestions
- ✅ No employment decisions: Only informational
- ✅ Educational purpose: Helps users understand their skills

**ESCO Framework Integration:**
- AI attempts to map skills to ESCO codes
- ESCO codes stored separately for standardized matching
- Falls back to skill names if ESCO codes unavailable

---

### 3. AI Job Suggestions (LOW-RISK)

**Location:** `app/api/jobs/ai-suggestions/route.ts`

**EU AI Act Classification:** ✅ **Limited Risk AI** (Article 50)

**Purpose:**
- Provide personalized explanations of why jobs might be interesting
- Suggest skills to develop
- Explain how user skills relate to job requirements
- **NOT used for ranking or filtering jobs**

**Key Features:**
- ✅ Optional: Users can toggle AI suggestions on/off
- ✅ Informational only: No impact on job matching
- ✅ Transparent: Clear disclaimer that it's AI-generated
- ✅ Separate from matching: Matching happens independently

---

## User Flow

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

**Key Point:** AI is never in the decision chain. It only provides information and suggestions.

---

## Database Schema

**Location:** `database_schema_skills_matching.sql`

**Key Tables:**

1. **`job_opportunities`** - Stores job listings with required skills
2. **`skills_profiles`** - Stores user skills in ESCO format
3. **`skills_analyses`** - Stores AI-generated analyses (LOW-RISK)
4. **`job_matches`** - Stores rule-based match results (NO RISK)
5. **`oph_recognition_requests`** - OPH qualification recognition workflow
6. **`retention_tracking`** - Job retention monitoring
7. **`impact_metrics`** - Analytics for dashboards

---

## API Endpoints

### 1. `/api/jobs/match` (POST)
- **Classification:** NOT AN AI SYSTEM
- **Purpose:** Calculate job matches using rule-based algorithm
- **Input:** `{ userId, jobIds? }`
- **Output:** Array of jobs with match scores and breakdowns

### 2. `/api/jobs/ai-suggestions` (POST)
- **Classification:** Limited Risk AI (Article 50)
- **Purpose:** Get AI-generated suggestions for jobs
- **Input:** `{ userId, jobIds, userSkills, userLanguageLevel }`
- **Output:** Array of AI suggestions with disclaimers

### 3. `/api/skills/analyze` (POST)
- **Classification:** Limited Risk AI (Article 50)
- **Purpose:** Analyze user skills and map to ESCO
- **Input:** `{ userId, qualifications, workExperience }`
- **Output:** Skills array with ESCO codes and analysis

---

## UI Components

### SkillsJobMatching Component

**Location:** `components/SkillsJobMatching.tsx`

**Features:**
- Displays jobs sorted by match score (rule-based)
- Shows transparent match breakdown
- Lists matched and missing skills
- Optional AI suggestions toggle
- Clear EU AI Act compliance notice

**Match Score Display:**
- Green (80%+): Excellent match
- Yellow (60-79%): Good match
- Red (<60%): Partial match

---

## Compliance Checklist

### ✅ Non-AI Matching (No Risk)
- [x] Deterministic algorithm
- [x] No machine learning
- [x] Fully transparent calculations
- [x] User can see match breakdown

### ✅ AI Skills Analysis (Limited Risk)
- [x] Transparency notice
- [x] User can opt-out
- [x] Educational purpose only
- [x] No employment decisions
- [x] ESCO framework integration

### ✅ AI Suggestions (Limited Risk)
- [x] Optional feature
- [x] Clear disclaimers
- [x] Informational only
- [x] Separate from matching
- [x] User always decides

### ✅ General Compliance
- [x] No AI in hiring decisions
- [x] User empowerment model
- [x] Transparent explanations
- [x] GDPR compliant data handling
- [x] Pseudonymization for AI calls

---

## Risk Classification Summary

| Component | Risk Level | Compliance Burden | Purpose |
|-----------|-----------|-------------------|---------|
| Rule-Based Matching | **NO RISK** | None | Calculate job matches |
| AI Skills Analysis | **LOW-RISK** | Minimal (transparency) | Extract and explain skills |
| AI Suggestions | **LOW-RISK** | Minimal (transparency) | Provide job suggestions |
| **Total System** | **LOW-RISK** | **Minimal** | **User empowerment** |

---

## Value Maintained

Despite the low-risk classification, the system maintains all core value:

✅ **Skills-Based Job Discovery**
- Users find jobs matching their skills
- Transparent match scores
- Clear skill gaps identified

✅ **ESCO Framework Integration**
- Standardized skill mapping
- European skills framework compliance
- Better skill recognition

✅ **Personalized Suggestions**
- AI helps users understand opportunities
- Explains skill relationships
- Suggests skill development

✅ **User Empowerment**
- Users control their job search
- Transparent matching process
- No "black box" decisions

---

## Implementation Status

### ✅ Completed
- [x] Non-AI rule-based matching engine
- [x] AI skills analysis with ESCO support
- [x] AI suggestions API (LOW-RISK)
- [x] Job matching API (NO RISK)
- [x] Skills-to-jobs matching component
- [x] Database schema for skills matching
- [x] Transparent match score display

### 🚧 In Progress
- [ ] OPH recognition fast-track workflow
- [ ] Retention tracking module
- [ ] Impact dashboard for users/municipalities
- [ ] Professional network expansion

---

## Next Steps

1. **Integrate matching into work-opportunities page**
   - Add SkillsJobMatching component
   - Connect to existing job listings
   - Update UI to show match scores

2. **Add OPH Recognition Fast-Track**
   - Document upload API
   - Translation service integration
   - Status tracking UI

3. **Build Impact Dashboards**
   - User dashboard: Personal progress
   - Municipality dashboard: Aggregate metrics
   - Public dashboard: Anonymized statistics

4. **Retention Tracking**
   - Check-in system (1, 3, 12 months)
   - Satisfaction surveys
   - Retention analytics

---

## Funding & Investor Appeal

### Before (High-Risk Model)
- ❌ High-Risk AI classification
- ❌ €100K-500K compliance costs
- ❌ 12-18 months to market
- ❌ Complex audits required

### After (Low-Risk Model)
- ✅ Low-Risk AI classification
- ✅ €10K-50K compliance costs
- ✅ 3-6 months to market
- ✅ Minimal compliance burden
- ✅ Same user value
- ✅ Better user experience (transparency)

**Result:** Same impact, 10x lower risk, 3x faster to market! 🚀

---

## References

- EU AI Act: https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai
- ESCO Framework: https://ec.europa.eu/esco/portal/home
- DE_RISKING_STRATEGY.md: See project root for detailed de-risking strategy

