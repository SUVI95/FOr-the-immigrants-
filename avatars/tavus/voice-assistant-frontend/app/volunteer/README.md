# Volunteer & Skills Exchange Platform

## Overview

The Volunteer & Skills Exchange platform is a community feature that allows users in Kajaani to:
1. **Volunteer** for local community projects and opportunities
2. **Exchange skills** with other community members (e.g., "I'll teach you Arabic if you help me practice Finnish")

This system prioritizes **privacy**, **safety**, and **moderation** to ensure a secure and respectful community environment.

---

## Architecture

### Frontend Components

#### 1. **Main Page** (`app/volunteer/page.tsx`)
- Displays volunteer opportunities and skills exchange listings
- Handles user interactions and modal management
- Integrates with LiveKit for voice assistant features (optional)

#### 2. **Volunteer Application Modal** (`components/VolunteerApplicationModal.tsx`)
- Form for users to apply to volunteer opportunities
- Collects: name, email, phone, motivation, relevant skills, availability
- Validates required fields before submission

#### 3. **Skills Exchange Contact Modal** (`components/SkillsExchangeContactModal.tsx`)
- Form for users to contact skills exchange posters
- Collects: name, email, phone, message, skills, privacy consent
- Includes privacy notices and consent requirements

### Backend API Routes

#### 1. **Volunteer Applications** (`app/api/volunteer-application/route.ts`)
- **Endpoint**: `POST /api/volunteer-application`
- **Purpose**: Handles volunteer application submissions
- **Validation**: Checks required fields (opportunity_id, name, email, motivation)
- **Future Integration**: Database storage, email notifications

#### 2. **Skills Exchange Contact** (`app/api/skills-exchange-contact/route.ts`)
- **Endpoint**: `POST /api/skills-exchange-contact`
- **Purpose**: Handles skills exchange contact requests
- **Features**: Content moderation, privacy protection, email notifications
- **Validation**: Required fields, privacy consent, content moderation

---

## Privacy & Security Features

### 🔒 Privacy Protection

#### For Skills Exchange:
1. **No Public Email Display**
   - Exchange posters' emails are never shown publicly
   - Contact information is only shared after mutual agreement

2. **Two-Step Contact Process**
   - Step 1: User sends a message (contact info is NOT shared yet)
   - Step 2: Exchange poster reviews and accepts/declines
   - Step 3: Only if accepted, contact information is shared

3. **Privacy Consent**
   - Users must explicitly agree to privacy policy before contacting
   - Clear explanation of what information will be shared and when

#### For Volunteer Applications:
- Applications are sent directly to the organization/poster
- Contact information is shared immediately (as it's a formal application)
- Organizations receive full application details for review

### 🛡️ Content Moderation

The system includes automatic content moderation to prevent spam, abuse, and inappropriate content.

#### Moderation Checks (`app/api/skills-exchange-contact/route.ts`):

```typescript
function moderateContent(content: string): { approved: boolean; reason?: string }
```

**Current Checks:**
1. **Message Length**: Minimum 10 characters, maximum 2000 characters
2. **Inappropriate Keywords**: Filters common spam/scam keywords
3. **Link Spam Detection**: Flags messages with excessive links (>3 links)
4. **Extensible**: Easy to add more sophisticated moderation (e.g., AI-based)

**Moderation Flow:**
```
User submits message
    ↓
Content moderation check
    ↓
If approved → Save to database → Notify poster
If rejected → Return error to user (with reason)
```

**Future Enhancements:**
- Integration with AI moderation services (OpenAI, Perspective API)
- Machine learning for spam detection
- Manual review queue for flagged content
- User reporting system

---

## User Flows

### Volunteer Application Flow

```
1. User browses volunteer opportunities
2. User clicks "Volunteer Now →"
3. Modal opens with application form
4. User fills in:
   - Name (required)
   - Email (required)
   - Phone (optional)
   - Motivation (required)
   - Relevant skills (optional)
   - Availability (optional)
5. User submits application
6. System validates and saves to database
7. Organization receives email notification
8. User receives confirmation email
9. Organization can review and contact applicant
```

### Skills Exchange Contact Flow

```
1. User browses skills exchange listings
2. User clicks "Contact via Knuut AI →"
3. Modal opens with contact form
4. User fills in:
   - Name (required)
   - Email (required) - with privacy notice
   - Phone (optional)
   - Your skills/what you can offer
   - Message (required)
   - Privacy consent checkbox (required)
5. User submits message
6. Content moderation check:
   - If rejected → Error shown to user
   - If approved → Continue
7. Message saved with "pending" status
8. Exchange poster receives email notification
9. User receives confirmation email
10. Exchange poster can:
    - Accept → Contact info shared, both parties notified
    - Decline → User notified, no contact info shared
11. If accepted, both parties can contact each other directly
```

---

## Database Schema (Planned)

### Volunteer Applications Table

```sql
CREATE TABLE volunteer_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID REFERENCES volunteer_opportunities(id),
  applicant_name VARCHAR(255) NOT NULL,
  applicant_email VARCHAR(255) NOT NULL,
  applicant_phone VARCHAR(50),
  motivation TEXT NOT NULL,
  relevant_skills TEXT,
  availability VARCHAR(255),
  submitted_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'pending', -- pending, reviewed, accepted, rejected
  reviewed_at TIMESTAMP,
  reviewed_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Skills Exchange Contacts Table

```sql
CREATE TABLE skills_exchange_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exchange_id UUID REFERENCES skills_exchanges(id),
  contact_name VARCHAR(255) NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(50),
  message TEXT NOT NULL,
  contact_skills TEXT,
  submitted_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected, completed
  moderation_status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
  moderation_reason TEXT,
  privacy_consent BOOLEAN NOT NULL,
  poster_accepted_at TIMESTAMP,
  poster_declined_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for performance
CREATE INDEX idx_exchange_contacts_exchange_id ON skills_exchange_contacts(exchange_id);
CREATE INDEX idx_exchange_contacts_status ON skills_exchange_contacts(status);
```

### Skills Exchanges Table

```sql
CREATE TABLE skills_exchanges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  skills_offered TEXT[] NOT NULL,
  skills_wanted TEXT[] NOT NULL,
  location VARCHAR(255) NOT NULL,
  poster_user_id UUID REFERENCES users(id),
  poster_email VARCHAR(255) NOT NULL, -- Not displayed publicly
  poster_name VARCHAR(255) NOT NULL,  -- Not displayed publicly
  status VARCHAR(50) DEFAULT 'active', -- active, closed, removed
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## Email Notifications

### Volunteer Application Emails

#### To Organization:
```
Subject: New Volunteer Application: [Opportunity Title]

Hello [Organization Name],

A new volunteer application has been submitted:

Position: [Opportunity Title]
Applicant: [Name]
Email: [Email]
Phone: [Phone if provided]

Motivation:
[User's motivation text]

Relevant Skills: [Skills if provided]
Availability: [Availability if provided]

Please log in to review this application:
[Link to admin panel]
```

#### To Applicant:
```
Subject: Application Received: [Opportunity Title]

Thank you for your interest in volunteering!

We've received your application for:
[Opportunity Title]

The organization will review your application and contact you soon.

Best regards,
Knuut AI Team
```

### Skills Exchange Contact Emails

#### To Exchange Poster:
```
Subject: New Skills Exchange Contact: [Exchange Title]

Hello [Poster Name],

Someone is interested in your skills exchange:

Exchange: [Exchange Title]
From: [Contact Name]

Message:
[User's message]

Their Skills: [Skills if provided]

📧 Contact Email: [Email] (will be shared if you accept)
📞 Phone: [Phone if provided] (will be shared if you accept)

You can:
1. Accept this exchange and contact them directly
2. Decline if it's not a good match
3. Reply via Knuut AI platform

Log in to manage your exchanges:
[Link to my-exchanges page]
```

#### To Contact User:
```
Subject: Message Sent: Skills Exchange Contact

Hello [Contact Name],

Your message has been sent to the person who posted the skills exchange.

Exchange: [Exchange Title]

Your message has been reviewed and approved. The exchange poster will receive a notification and can choose to accept or decline your contact request.

If they accept, your contact information will be shared with them and they can reach out to you directly.

You'll receive another email when they respond.

Best regards,
Knuut AI Team
```

---

## Integration Points

### 1. LiveKit Voice Assistant (Optional)

The system supports integration with Knuut AI voice assistant via RPC:

```typescript
// If voice assistant is active, use RPC
if (roomContext && voiceAssistant?.agent) {
  await roomContext.localParticipant.performRpc({
    destinationIdentity: voiceAssistant.agent.identity,
    method: "agent.submitVolunteerApplication", // or "agent.submitSkillsExchangeContact"
    payload: JSON.stringify(data),
  });
} else {
  // Otherwise, use direct API call
  await fetch("/api/volunteer-application", { ... });
}
```

### 2. Database Integration

**TODO**: Uncomment and implement database operations in:
- `app/api/volunteer-application/route.ts`
- `app/api/skills-exchange-contact/route.ts`

**Required Libraries:**
- PostgreSQL client (e.g., `pg`, `postgres`, or `drizzle-orm`)
- Environment variable: `DATABASE_URL`

### 3. Email Service Integration

**TODO**: Implement email sending service:
- Options: SendGrid, Resend, AWS SES, Nodemailer
- Environment variables: `EMAIL_API_KEY`, `EMAIL_FROM`
- Template system for consistent email formatting

**Example with Resend:**
```typescript
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'Knuut AI <noreply@knuut.ai>',
  to: recipientEmail,
  subject: emailSubject,
  html: emailBody,
});
```

---

## Security Considerations

### 1. Input Validation
- All user inputs are validated on both client and server
- Required fields are enforced
- Email format validation
- Phone number format validation (optional)

### 2. Content Moderation
- Automatic content filtering
- Spam detection
- Inappropriate content detection
- Extensible for AI-based moderation

### 3. Privacy Protection
- No public display of email addresses
- Two-step contact process for skills exchange
- Explicit privacy consent required
- GDPR-compliant data handling

### 4. Rate Limiting (Future)
- Implement rate limiting on API endpoints
- Prevent spam/abuse
- Use middleware like `express-rate-limit` or similar

### 5. Data Encryption
- Store sensitive data encrypted at rest
- Use HTTPS for all communications
- Consider encrypting email addresses in database

---

## Testing

### Manual Testing Checklist

#### Volunteer Applications:
- [ ] Submit application with all required fields
- [ ] Submit application missing required fields (should fail)
- [ ] Verify email notifications are sent
- [ ] Verify database record is created
- [ ] Test with voice assistant (if available)

#### Skills Exchange Contact:
- [ ] Submit contact without privacy consent (should fail)
- [ ] Submit contact with inappropriate content (should be rejected)
- [ ] Submit valid contact request
- [ ] Verify moderation passes
- [ ] Verify email notifications are sent
- [ ] Test acceptance/decline flow (when implemented)

### Automated Testing (Future)

```typescript
// Example test structure
describe('Volunteer Application API', () => {
  it('should accept valid application', async () => {
    const response = await fetch('/api/volunteer-application', {
      method: 'POST',
      body: JSON.stringify({
        opportunity_id: 'test-123',
        name: 'Test User',
        email: 'test@example.com',
        motivation: 'I want to help',
      }),
    });
    expect(response.status).toBe(200);
  });

  it('should reject application with missing fields', async () => {
    // Test validation
  });

  it('should moderate content', async () => {
    // Test moderation
  });
});
```

---

## Future Enhancements

### 1. Enhanced Moderation
- AI-based content moderation (OpenAI, Perspective API)
- Machine learning for spam detection
- Manual review queue for admins
- User reporting system

### 2. User Dashboard
- Users can view their submitted applications
- Users can manage their skills exchange posts
- Users can accept/decline contact requests
- Notification center for updates

### 3. Matching System
- AI-powered matching for skills exchanges
- Suggest compatible exchanges based on skills
- Recommend volunteer opportunities based on interests

### 4. Reviews & Ratings
- Allow users to rate completed exchanges
- Review system for volunteer experiences
- Build trust through community feedback

### 5. Analytics Dashboard
- Track application success rates
- Monitor exchange completion rates
- Community engagement metrics
- Retention analysis

---

## Environment Variables

Required environment variables:

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Email Service (choose one)
RESEND_API_KEY=re_xxxxxxxxxxxxx
# OR
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
# OR
AWS_SES_ACCESS_KEY=xxxxxxxxxxxxx
AWS_SES_SECRET_KEY=xxxxxxxxxxxxx

# Email Configuration
EMAIL_FROM=noreply@knuut.ai
APP_URL=https://knuut.ai

# Optional: AI Moderation
OPENAI_API_KEY=sk-xxxxxxxxxxxxx  # For AI-based moderation
PERSPECTIVE_API_KEY=xxxxxxxxxxxxx  # Google Perspective API
```

---

## File Structure

```
app/volunteer/
├── page.tsx                    # Main volunteer page component
├── README.md                   # This file
└── ...

components/
├── VolunteerApplicationModal.tsx        # Volunteer application form modal
└── SkillsExchangeContactModal.tsx      # Skills exchange contact form modal

app/api/
├── volunteer-application/
│   └── route.ts               # Volunteer application API endpoint
└── skills-exchange-contact/
    └── route.ts               # Skills exchange contact API endpoint
```

---

## Developer Notes

### Adding New Moderation Rules

Edit `moderateContent()` in `app/api/skills-exchange-contact/route.ts`:

```typescript
function moderateContent(content: string): { approved: boolean; reason?: string } {
  // Add your custom checks here
  if (customCheck(content)) {
    return { approved: false, reason: "Custom rejection reason" };
  }
  // ... existing checks
  return { approved: true };
}
```

### Adding New Volunteer Opportunity Fields

1. Update `VolunteerOpportunity` interface in `page.tsx`
2. Update `VolunteerApplicationModal` to include new fields
3. Update API route to handle new fields
4. Update database schema

### Customizing Email Templates

Email templates are in the API route files. Customize the email body HTML/text in:
- `app/api/volunteer-application/route.ts`
- `app/api/skills-exchange-contact/route.ts`

Consider using a template engine like Handlebars or React Email for better maintainability.

---

## Support & Questions

For questions or issues:
1. Check the code comments in the relevant files
2. Review the API route handlers for validation logic
3. Check the component files for UI/UX details
4. Contact the development team lead

---

## Changelog

### Version 1.0.0 (Current)
- Initial implementation
- Volunteer application system
- Skills exchange contact system
- Basic content moderation
- Privacy protection framework
- Email notification structure (ready for integration)

---

**Last Updated**: [Current Date]
**Maintained By**: Knuut AI Development Team

