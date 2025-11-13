# Security & Compliance Guide for Knuut AI
## EU AI Act, GDPR, and Government Sales Readiness

---

## 📋 Table of Contents
1. [EU AI Act Compliance](#eu-ai-act-compliance)
2. [GDPR Compliance](#gdpr-compliance)
3. [Data Security for Government Sales](#data-security-for-government-sales)
4. [OpenAI Usage & Data Privacy](#openai-usage--data-privacy)
5. [Implementation Checklist](#implementation-checklist)
6. [Technical Recommendations](#technical-recommendations)

---

## 🎯 EU AI Act Compliance

### Risk Classification
**Your Application: Limited Risk AI System**

According to the EU AI Act, Knuut AI falls under **"Limited Risk"** AI systems because:
- ✅ Educational/training AI systems (language learning)
- ✅ Recommender systems (matching users, suggesting events)
- ✅ No high-risk categories (no biometric identification, critical infrastructure, etc.)

### Requirements for Limited Risk AI Systems

#### 1. **Transparency Obligations** ✅ (Partially Implemented)
- **Requirement**: Users must be informed they're interacting with AI
- **Current Status**: Needs improvement
- **Action Items**:
  ```typescript
  // Add to all AI interactions
  <div className="ai-disclosure">
    <small>🤖 Powered by AI - Your conversations are processed by OpenAI</small>
  </div>
  ```

#### 2. **User Rights & Controls** ✅ (Implemented)
- ✅ Users can disable AI moderation (DataProtectionPanel)
- ✅ Users can request data deletion (GDPR right)
- ✅ Users can download their data
- **Needs**: Add explicit AI interaction opt-out

#### 3. **Data Governance** ⚠️ (Needs Work)
- **Requirement**: Document data sources, processing, and outputs
- **Action**: Create data processing documentation

#### 4. **Accuracy & Reliability** ⚠️ (Needs Monitoring)
- **Requirement**: Monitor AI outputs for accuracy
- **Action**: Implement logging and quality checks

---

## 🔒 GDPR Compliance

### Current Implementation Status

#### ✅ **Implemented**
1. **Data Protection Panel** (`DataProtectionPanel.tsx`)
   - User can request data deletion
   - Email/phone verification
   - AI moderation toggle

2. **Database Schema**
   - User data properly structured
   - Foreign key constraints
   - Timestamps for audit trail

#### ⚠️ **Needs Implementation**

### 1. **Privacy Policy & Consent Management**
```typescript
// Create: app/privacy/page.tsx
// Must include:
- What data is collected
- How OpenAI processes data
- User rights (access, rectification, erasure, portability)
- Data retention periods
- Third-party processors (OpenAI, LiveKit, etc.)
- Contact information for DPO (Data Protection Officer)
```

### 2. **Data Minimization**
**Current Issue**: Sending full user messages to OpenAI
**Solution**: Implement data anonymization/pseudonymization

```typescript
// app/api/language-buddy/route.ts - IMPROVED VERSION
export async function POST(request: Request) {
  try {
    const { topic, message, userId } = await request.json();
    
    // ✅ Data Minimization: Only send necessary data
    const sanitizedMessage = sanitizeUserInput(message);
    
    // ✅ Pseudonymization: Use user ID hash instead of email
    const userHash = hashUserId(userId);
    
    // ✅ Add metadata for compliance
    const metadata = {
      purpose: "language_learning",
      retention_days: 90,
      user_consent: true,
      data_category: "educational_content"
    };
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `${TOPIC_PROMPTS[topic]}\n\nIMPORTANT: Do not store or log personal information.`,
          },
          {
            role: "user",
            content: sanitizedMessage,
          },
        ],
        max_tokens: 150,
        temperature: 0.7,
        // ✅ OpenAI Data Processing Agreement
        user: userHash, // Pseudonymized user ID
      }),
    });
    
    // ✅ Log for audit (without personal data)
    await logAIInteraction({
      userId: userHash,
      topic,
      timestamp: new Date(),
      model: "gpt-4o-mini",
      tokens_used: data.usage?.total_tokens,
    });
    
    return NextResponse.json({ reply: output });
  } catch (error) {
    // ✅ Error handling without exposing sensitive data
    console.error("Language buddy error", error);
    return NextResponse.json({ error: "Service temporarily unavailable" }, { status: 500 });
  }
}
```

### 3. **Right to Access (Article 15)**
```typescript
// Create: app/api/user-data-export/route.ts
export async function GET(request: Request) {
  const userId = getUserIdFromRequest(request);
  
  const userData = {
    profile: await getUserProfile(userId),
    learning_history: await getLearningHistory(userId),
    ai_interactions: await getAILogs(userId), // Pseudonymized
    community_activity: await getCommunityActivity(userId),
    consent_history: await getConsentHistory(userId),
  };
  
  return NextResponse.json(userData, {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="my-data-${userId}.json"`
    }
  });
}
```

### 4. **Right to Erasure (Article 17)**
```typescript
// Create: app/api/user-data-deletion/route.ts
export async function DELETE(request: Request) {
  const userId = getUserIdFromRequest(request);
  
  // ✅ Soft delete (mark as deleted, retain for legal requirements)
  await softDeleteUser(userId);
  
  // ✅ Delete from OpenAI (if using their API with user IDs)
  await deleteOpenAIUserData(userId);
  
  // ✅ Anonymize logs
  await anonymizeUserLogs(userId);
  
  // ✅ Schedule hard delete after retention period
  await scheduleHardDelete(userId, 30); // 30 days retention
  
  return NextResponse.json({ 
    message: "Deletion request processed",
    estimated_completion: "30 days"
  });
}
```

### 5. **Data Processing Agreement (DPA) with OpenAI**
**CRITICAL FOR GOVERNMENT SALES**

OpenAI offers a **Data Processing Agreement (DPA)** that includes:
- ✅ GDPR compliance commitments
- ✅ Data processing addendum
- ✅ SOC 2 Type II compliance
- ✅ Data residency options (EU data centers)

**Action Required**:
1. Contact OpenAI Enterprise Sales
2. Request DPA and Business Associate Agreement (BAA) for government
3. Enable "Data Processing" mode in OpenAI API
4. Configure data residency to EU (if available)

---

## 🏛️ Data Security for Government Sales

### Security Requirements Checklist

#### 1. **Encryption**
```typescript
// ✅ Implement end-to-end encryption
// - TLS 1.3 for all API calls
// - Encrypt sensitive data at rest
// - Use environment variables for secrets (never commit)

// Database encryption
// - Enable PostgreSQL encryption at rest
// - Use encrypted connections (SSL/TLS)
```

#### 2. **Access Controls**
```typescript
// Implement role-based access control (RBAC)
type UserRole = 'user' | 'moderator' | 'admin' | 'government_auditor';

interface AccessControl {
  canViewUserData: (role: UserRole) => boolean;
  canDeleteData: (role: UserRole) => boolean;
  canExportData: (role: UserRole) => boolean;
}
```

#### 3. **Audit Logging**
```typescript
// Create comprehensive audit logs
interface AuditLog {
  timestamp: Date;
  userId: string;
  action: string;
  resource: string;
  ipAddress: string;
  userAgent: string;
  result: 'success' | 'failure';
  metadata: Record<string, any>;
}

// Log all:
// - Data access
// - Data modifications
// - AI interactions
// - User consent changes
// - Data exports/deletions
```

#### 4. **Data Residency**
**For Government Sales - CRITICAL**:
- ✅ Store data in EU data centers only
- ✅ Use EU-based OpenAI endpoints (if available)
- ✅ Use EU-based database (Neon PostgreSQL - EU region)
- ✅ Use EU-based hosting (Vercel EU, AWS EU, etc.)

#### 5. **Compliance Certifications**
**Required for Government Contracts**:
- ✅ **ISO 27001** (Information Security Management)
- ✅ **SOC 2 Type II** (via OpenAI Enterprise)
- ✅ **GDPR Compliance** (Documentation + Implementation)
- ⚠️ **ISO 9001** (Quality Management) - Consider
- ⚠️ **Common Criteria** (For high-security government) - If needed

---

## 🤖 OpenAI Usage & Data Privacy

### Current Implementation Analysis

**File**: `app/api/language-buddy/route.ts`

**Issues Found**:
1. ❌ No user consent tracking
2. ❌ No data minimization
3. ❌ No pseudonymization
4. ❌ No audit logging
5. ❌ No error handling for sensitive data

### Recommended Implementation

```typescript
// app/api/language-buddy/route.ts - SECURE VERSION
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";

// ✅ Check user consent before processing
async function checkUserConsent(userId: string): Promise<boolean> {
  const user = await getUserFromDB(userId);
  return user?.gdprConsent === true && user?.aiProcessingConsent === true;
}

// ✅ Sanitize user input (remove PII)
function sanitizeUserInput(input: string): string {
  // Remove email addresses
  input = input.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]');
  
  // Remove phone numbers
  input = input.replace(/\b\d{10,}\b/g, '[PHONE]');
  
  // Remove potential addresses
  input = input.replace(/\b\d+\s+[A-Za-z\s]+(?:Street|Avenue|Road|Katu|Tie)\b/gi, '[ADDRESS]');
  
  return input;
}

// ✅ Pseudonymize user ID
function pseudonymizeUserId(userId: string): string {
  return hash(userId, 10); // Use bcrypt or similar
}

export async function POST(request: Request) {
  try {
    const { topic, message, userId } = await request.json();

    // ✅ Validate input
    if (!topic || !message || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ✅ Check consent
    const hasConsent = await checkUserConsent(userId);
    if (!hasConsent) {
      return NextResponse.json({ 
        error: "AI processing consent required",
        consent_url: "/privacy"
      }, { status: 403 });
    }

    // ✅ Sanitize input
    const sanitizedMessage = sanitizeUserInput(message);
    const userHash = pseudonymizeUserId(userId);

    // ✅ Log interaction (for audit)
    await logAIInteraction({
      userId: userHash,
      topic,
      messageLength: sanitizedMessage.length,
      timestamp: new Date(),
      purpose: "language_learning"
    });

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Service configuration error" }, { status: 500 });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `${TOPIC_PROMPTS[topic]}\n\nIMPORTANT: Do not request, store, or log personal information.`,
          },
          {
            role: "user",
            content: sanitizedMessage,
          },
        ],
        max_tokens: 150,
        temperature: 0.7,
        user: userHash, // Pseudonymized user ID for OpenAI
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      // ✅ Don't log sensitive error details
      console.error("OpenAI API error");
      await logError({
        userId: userHash,
        error_type: "openai_api_error",
        timestamp: new Date()
      });
      return NextResponse.json({ error: "AI service temporarily unavailable" }, { status: 500 });
    }

    const data = await response.json();
    const output = data?.choices?.[0]?.message?.content ?? "Anteeksi, en ymmärtänyt. Kokeillaan uudelleen.";

    // ✅ Log successful interaction
    await logAIInteraction({
      userId: userHash,
      topic,
      tokensUsed: data.usage?.total_tokens,
      timestamp: new Date(),
      status: "success"
    });

    return NextResponse.json({ reply: output });
  } catch (error) {
    // ✅ Generic error message (no sensitive data)
    console.error("Language buddy error");
    return NextResponse.json({ error: "Service temporarily unavailable" }, { status: 500 });
  }
}
```

### OpenAI Data Processing Agreement

**For Government Sales - REQUIRED**:

1. **Contact OpenAI Enterprise**:
   - Email: enterprise@openai.com
   - Request: DPA, BAA, SOC 2 reports
   - Ask about: EU data residency options

2. **Enable Data Processing Controls**:
   ```typescript
   // Use OpenAI API with data processing controls
   const response = await fetch("https://api.openai.com/v1/chat/completions", {
     // ... existing code ...
     body: JSON.stringify({
       // ... existing code ...
       // ✅ Add data processing instructions
       user: userHash, // Required for DPA compliance
     }),
   });
   ```

3. **Alternative: Self-Hosted LLM** (For maximum security):
   - Consider: Llama 2, Mistral AI (EU-based)
   - Benefits: Full data control, no third-party processing
   - Trade-off: Lower quality, higher infrastructure costs

---

## ✅ Implementation Checklist

### Phase 1: GDPR Compliance (Priority: HIGH)

- [ ] **Privacy Policy Page**
  - Create `/app/privacy/page.tsx`
  - Include: Data collection, processing, user rights, contact info
  - Add consent checkbox on signup

- [ ] **Consent Management**
  - Track user consent in database
  - Allow users to withdraw consent
  - Stop AI processing if consent withdrawn

- [ ] **Data Export Functionality**
  - Create `/app/api/user-data-export/route.ts`
  - Export all user data in JSON format
  - Include AI interaction logs (pseudonymized)

- [ ] **Data Deletion Functionality**
  - Improve existing deletion in `DataProtectionPanel.tsx`
  - Implement soft delete (30-day retention)
  - Anonymize logs
  - Delete from OpenAI (if using user IDs)

- [ ] **Data Minimization**
  - Sanitize user inputs before sending to OpenAI
  - Remove PII (emails, phones, addresses)
  - Pseudonymize user IDs

### Phase 2: EU AI Act Compliance (Priority: MEDIUM)

- [ ] **AI Disclosure**
  - Add "Powered by AI" badges to all AI interactions
  - Inform users about AI processing
  - Explain how AI makes suggestions

- [ ] **Transparency Documentation**
  - Document AI model used (GPT-4o-mini)
  - Document training data sources
  - Document limitations and accuracy

- [ ] **User Controls**
  - Allow users to disable AI features
  - Provide alternative non-AI options
  - Clear opt-out mechanisms

- [ ] **Monitoring & Quality Assurance**
  - Log AI outputs for quality checks
  - Monitor for bias or errors
  - Implement feedback mechanisms

### Phase 3: Government Sales Readiness (Priority: HIGH for Sales)

- [ ] **Security Hardening**
  - Enable encryption at rest
  - Implement RBAC
  - Add comprehensive audit logging
  - Penetration testing

- [ ] **Compliance Documentation**
  - GDPR compliance statement
  - EU AI Act compliance documentation
  - Data processing documentation
  - Security policies

- [ ] **OpenAI Enterprise Setup**
  - Contact OpenAI Enterprise sales
  - Sign DPA and BAA
  - Configure EU data residency (if available)
  - Get SOC 2 reports

- [ ] **Certifications**
  - ISO 27001 (if required by government)
  - SOC 2 Type II (via OpenAI)
  - GDPR compliance audit

- [ ] **Data Residency**
  - Confirm all data in EU
  - Use EU-based services only
  - Document data flow

---

## 🔧 Technical Recommendations

### 1. **Environment Variables Security**
```bash
# .env.example (DO NOT commit .env)
OPENAI_API_KEY=sk-...
DATABASE_URL=postgresql://...
LIVEKIT_API_KEY=...
LIVEKIT_API_SECRET=...

# ✅ Use secrets management
# - Vercel: Environment Variables (encrypted)
# - AWS: Secrets Manager
# - Azure: Key Vault
```

### 2. **Database Security**
```sql
-- Add GDPR compliance columns
ALTER TABLE users ADD COLUMN gdpr_consent BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN gdpr_consent_date TIMESTAMP;
ALTER TABLE users ADD COLUMN ai_processing_consent BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN data_deletion_requested BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN data_deletion_requested_at TIMESTAMP;
ALTER TABLE users ADD COLUMN deleted_at TIMESTAMP; -- Soft delete

-- Add audit log table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100),
    ip_address INET,
    user_agent TEXT,
    result VARCHAR(20),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add AI interaction logs (pseudonymized)
CREATE TABLE IF NOT EXISTS ai_interaction_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_hash VARCHAR(255) NOT NULL, -- Pseudonymized
    topic VARCHAR(100),
    message_length INTEGER,
    tokens_used INTEGER,
    model VARCHAR(50),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_hash (user_hash),
    INDEX idx_timestamp (timestamp)
);
```

### 3. **API Security Middleware**
```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // ✅ Add security headers
  const response = NextResponse.next();
  
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  response.headers.set('Content-Security-Policy', "default-src 'self'");
  
  return response;
}

export const config = {
  matcher: '/api/:path*',
};
```

### 4. **Rate Limiting**
```typescript
// Prevent abuse and protect OpenAI API
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 requests per minute
});

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const { success } = await ratelimit.limit(ip);
  
  if (!success) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }
  
  // ... rest of handler
}
```

---

## 📞 Next Steps

### Immediate Actions (This Week)
1. ✅ Review this document with legal counsel
2. ✅ Contact OpenAI Enterprise for DPA/BAA
3. ✅ Create privacy policy page
4. ✅ Implement data sanitization in OpenAI API calls

### Short-term (This Month)
1. ✅ Implement consent management
2. ✅ Add data export functionality
3. ✅ Improve data deletion
4. ✅ Add audit logging

### Long-term (For Government Sales)
1. ✅ Security audit and penetration testing
2. ✅ ISO 27001 certification (if required)
3. ✅ Complete compliance documentation
4. ✅ Government contract preparation

---

## 📚 Resources

- [EU AI Act Official Text](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32021R0106)
- [GDPR Official Website](https://gdpr.eu/)
- [OpenAI Data Processing Agreement](https://openai.com/enterprise-privacy)
- [OpenAI Enterprise Sales](mailto:enterprise@openai.com)
- [Finnish Data Protection Authority](https://tietosuoja.fi/en)

---

**Last Updated**: 2025-01-12
**Version**: 1.0
**Status**: Draft - Review with Legal Counsel Required

