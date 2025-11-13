# Knuut AI: Feature Priority Roadmap
## Building the "National News" Features

---

## 🎯 PRIORITY 1: Skills-Based Job Matching (Weeks 1-4)

### The Problem
- Employers filter by language before skills
- Qualified immigrants never get interviews
- Skills mismatch despite labor shortages

### The Solution
**Blind Skills Matching Engine**

### Implementation:

#### Week 1-2: Skills Passport Enhancement
```typescript
// New component: SkillsMatchingEngine.tsx
- ESCO taxonomy integration (European Skills Framework)
- Task-level skill extraction from:
  * Diplomas (AI OCR + parsing)
  * Work samples (portfolio analysis)
  * OPH recognition status
  * Previous job descriptions
- Skills scoring (0-100 per skill category)
```

#### Week 2-3: Blind Matching Algorithm
```typescript
// New API: /api/job-matching
- Input: User skills (ESCO codes)
- Process:
  1. Match skills to job requirements (ESCO codes)
  2. Calculate match score (skills only, no language check)
  3. Filter: Match score > 70% = "Skills Match"
  4. Flag: "Language can be learned on job" for match
- Output: Ranked job matches with skills evidence
```

#### Week 3-4: Employer Dashboard (Skills-First View)
```typescript
// New page: /employer/job-matches
- Shows candidates with:
  * Skills match score (prominent)
  * Skills evidence (diplomas, work samples)
  * "Language support guaranteed" badge
  * Language level (secondary, below skills)
- Filter: Skills match > language requirement
```

### Success Metrics:
- 50%+ of matches are skills-first (language secondary)
- 30%+ increase in interview rates for immigrants
- Employer feedback: "We found qualified candidates we would have missed"

---

## 🎯 PRIORITY 2: AI Language-in-Work Coach (Weeks 5-8)

### The Problem
- Language requirements block employment
- Classroom learning is slow (18 months to B1)
- Need to learn while working

### The Solution
**Real-Time Workplace Language Coach**

### Implementation:

#### Week 5-6: Real-Time Interpreter
```typescript
// New component: WorkplaceLanguageCoach.tsx
- Mobile app + headset integration
- Real-time speech-to-speech translation:
  * Finnish → User's language (for understanding)
  * User's language → Finnish (for speaking)
- Context-aware: Detects workplace context (meeting, patient care, etc.)
- Phrase suggestions: Common workplace phrases based on context
```

#### Week 6-7: Micro-Lessons System
```typescript
// New feature: Daily micro-lessons
- 5-minute lessons tied to actual work tasks
- Example: "Today you'll learn: Patient care phrases"
- Spaced repetition: Review phrases from previous days
- Progress tracking: Words/phrases learned per week
```

#### Week 7-8: Language KPI Integration
```typescript
// New API: /api/language-kpis
- Weekly language assessment:
  * Comprehension score (from workplace interactions)
  * Production score (phrases used correctly)
  * Task-specific vocabulary (job-relevant words)
- Counts toward formal certification:
  * YKI (National Certificate) preparation
  * Integration Programme language requirement
- Dashboard: "You're 60% to B1 level"
```

### Success Metrics:
- 6 months to B1 (vs 18 months traditional)
- 80%+ user engagement (daily micro-lessons)
- Employer feedback: "Language support made hiring possible"

---

## 🎯 PRIORITY 3: Fast-Track Recognition Hub (Weeks 9-12)

### The Problem
- OPH recognition takes 6-12 months
- Employers don't trust foreign qualifications
- Fragmented process (multiple systems)

### The Solution
**Integrated Recognition Workflow**

### Implementation:

#### Week 9-10: Document Pre-Collection
```typescript
// New component: RecognitionHub.tsx
- AI document scanner:
  * Scans diplomas, transcripts, certificates
  * Extracts: Degree, institution, dates, grades
  * Organizes: By country, qualification type
- Pre-fills OPH application forms
- Checks completeness: "You need X document"
```

#### Week 10-11: OPH Integration
```typescript
// New API: /api/recognition/oph
- Option A: OPH API integration (if available)
- Option B: Workflow automation:
  * Submits application to OPH
  * Tracks status (pending, in review, approved)
  * Notifications: Status updates
- Status dashboard: "Recognition in progress: Week 2 of 4"
```

#### Week 11-12: Employer Attestation
```typescript
// New feature: Employer endorsement
- For non-regulated roles:
  * Generates employer attestation letter
  * "Skills verified, suitable for role X"
  * Digital signature (employer confirms)
- Shows in employer dashboard:
  * "Skills verified by employer Y"
  * "Recognition in progress (OPH)"
```

### Success Metrics:
- 2-4 weeks recognition (vs 6-12 months)
- 80%+ application completeness (first submission)
- Employer trust: "We can verify skills while OPH processes"

---

## 🎯 PRIORITY 4: Retention Guarantee System (Weeks 13-16)

### The Problem
- Employers fear immigrant retention
- High turnover costs
- No support after hiring

### The Solution
**12-Month Retention Guarantee with Support**

### Implementation:

#### Week 13-14: Guarantee Framework
```typescript
// New component: RetentionGuarantee.tsx
- 12-month guarantee contract:
  * Employer pays placement fee
  * Knuut guarantees retention
  * If retention < 80%, partial rebate
  * If retention > 90%, shared savings
- Support package:
  * Ongoing mentoring (weekly check-ins)
  * Language support (workplace coach)
  * Integration coaching (cultural, workplace)
```

#### Week 14-15: Retention Tracking
```typescript
// New API: /api/retention/tracking
- Tracks:
  * Employment status (active, left, terminated)
  * Check-in frequency (mentor meetings)
  * Support usage (language coach, integration)
  * Satisfaction scores (employer + employee)
- Dashboard: Real-time retention rate
- Alerts: "At-risk" employees (low engagement)
```

#### Week 15-16: Rebate/Shared Savings Calculator
```typescript
// New feature: Financial model
- Rebate calculation:
  * If retention < 80%: 20% fee rebate
  * If retention < 70%: 40% fee rebate
- Shared savings:
  * If retention > 90%: 10% of re-hiring cost savings
  * Example: €5,000 saved → €500 to employer
```

### Success Metrics:
- 85%+ retention rate (vs 60% industry average)
- 90%+ employer satisfaction
- €2M+ in cost savings (re-hiring avoided)

---

## 🎯 PRIORITY 5: Public Impact Dashboard (Weeks 17-20)

### The Problem
- No measurable outcomes
- Fragmented services, no coordination
- Government needs proof of impact

### The Solution
**Real-Time Impact Dashboard**

### Implementation:

#### Week 17-18: Municipality Dashboard
```typescript
// New page: /municipality/dashboard
- Real-time metrics:
  * Placements (total, by month, by sector)
  * Retention rate (12-month, by sector)
  * Language gains (B1 achievement rate, time-to-B1)
  * Recognition time (average, by qualification type)
  * Employer satisfaction (NPS score)
- Filters: By city, sector, time period
- Export: PDF reports for government
```

#### Week 18-19: Public Dashboard
```typescript
// New page: /public/impact
- Privacy-safe aggregate metrics:
  * Total placements (anonymized)
  * Success stories (with consent)
  * Sector breakdown (care, tech, services)
  * Regional comparison (Helsinki vs Espoo, etc.)
- Media-ready visualizations:
  * Charts, graphs, infographics
  * "Impact in Numbers" section
```

#### Week 19-20: Reporting System
```typescript
// New API: /api/reports/quarterly
- Quarterly impact reports:
  * Executive summary
  * Key metrics
  * Success stories
  * Challenges & solutions
  * Next quarter goals
- Auto-generated PDFs
- Email distribution (municipalities, media)
```

### Success Metrics:
- 100% municipality adoption (dashboard usage)
- Media coverage: 5+ articles citing dashboard data
- Government recognition: "Proves Integration Programme success"

---

## 📊 IMPLEMENTATION SUMMARY

### Timeline: 20 Weeks (5 Months)

**Phase 1 (Weeks 1-4):** Skills Matching
**Phase 2 (Weeks 5-8):** Language-in-Work
**Phase 3 (Weeks 9-12):** Recognition Hub
**Phase 4 (Weeks 13-16):** Retention System
**Phase 5 (Weeks 17-20):** Impact Dashboard

### Resources Needed:
- 2-3 Full-stack developers
- 1 AI/ML engineer (for language coach)
- 1 Designer (for dashboards)
- 1 Product manager (coordination)

### Budget Estimate:
- Development: €150K-200K
- OPH API integration: €20K-50K (if custom)
- Infrastructure: €10K-20K (scaling)
- **Total: €180K-270K**

### ROI:
- Municipality contracts: €500K-2M/year
- Employer subscriptions: €200K-500K/year
- Government contract: €1M-5M/year
- **Break-even: 6-12 months**

---

## 🚀 LAUNCH STRATEGY

### Month 1-2: Pilot (Helsinki)
- 50-100 immigrants
- 10-20 employers (care sector)
- Test all 5 features
- Measure everything

### Month 3: First Results
- Publish impact report
- Media outreach
- Government presentation

### Month 4-6: Scale
- Expand to 3-5 cities
- 500+ placements
- National coverage

---

## 🎯 SUCCESS CRITERIA

**National News Worthy:**
- ✅ 500+ job placements in 6 months
- ✅ 85%+ retention rate
- ✅ 6 months to B1 (vs 18 months)
- ✅ 2-4 weeks recognition (vs 6-12 months)
- ✅ €2M+ employer cost savings
- ✅ Government partnership
- ✅ Media coverage (YLE, HS, national news)

**The Headline:**
**"How Knuut AI Solved Finland's Immigrant Integration Crisis: 500 Jobs, 85% Retention, Measurable Impact"**

