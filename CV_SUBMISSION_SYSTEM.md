# CV Submission System

## Overview

A complete CV submission system has been implemented for your Next.js application, inspired by the Simple Job Board WordPress plugin. Users can now submit their CVs directly through the work opportunities page.

## Features

✅ **CV Upload**: Users can upload PDF, DOC, DOCX, or TXT files (max 5MB)
✅ **Cover Letter**: Optional cover letter field
✅ **Form Validation**: Client and server-side validation
✅ **File Storage**: CVs are stored in `public/uploads/cv/`
✅ **Database Ready**: Schema prepared for storing submissions
✅ **Email Notifications**: Placeholder for admin and applicant emails
✅ **Integration**: Seamlessly integrated into work opportunities page

## Files Created

### 1. Database Migration
- **File**: `avatars/tavus/database_migrations/cv_submissions.sql`
- **Purpose**: Creates the `cv_submissions` table to store CV submissions
- **Run**: Execute this SQL file in your PostgreSQL database

### 2. API Endpoint
- **File**: `avatars/tavus/voice-assistant-frontend/app/api/cv-submission/route.ts`
- **Purpose**: Handles CV file uploads and form submissions
- **Endpoint**: `POST /api/cv-submission`
- **Features**:
  - File validation (type and size)
  - Secure file storage
  - Form data processing

### 3. CV Submission Form Component
- **File**: `avatars/tavus/voice-assistant-frontend/components/CVSubmissionForm.tsx`
- **Purpose**: React component for CV submission modal
- **Features**:
  - Modal dialog interface
  - File upload with preview
  - Form validation
  - Success/error states

### 4. Integration Updates
- **Files Updated**:
  - `app/work-opportunities/page.tsx`
  - `components/SkillsJobMatching.tsx`
- **Changes**: Added CV submission form integration to "Apply Now" buttons

## How It Works

1. **User clicks "Apply Now"** on a job listing
2. **System checks** if job has external link:
   - If external link exists → Opens external site
   - If no external link → Shows CV submission form
3. **User fills form**:
   - Name (required)
   - Email (required)
   - Phone (optional)
   - CV file (required)
   - Cover letter (optional)
4. **File is uploaded** to `public/uploads/cv/`
5. **Submission is saved** (database integration needed)
6. **Success message** is shown

## Database Setup

Run the migration file to create the CV submissions table:

```sql
-- Execute this file:
avatars/tavus/database_migrations/cv_submissions.sql
```

## Next Steps (TODO)

### 1. Database Integration
Update `app/api/cv-submission/route.ts` to save submissions to database:

```typescript
// Replace TODO comments with actual database calls
const { db } = await import("@/lib/db");
const submission = await db.cv_submissions.insert({
  user_id: userId || null,
  job_id: jobId,
  applicant_name: applicantName,
  // ... other fields
});
```

### 2. Email Notifications
Implement email sending for:
- Admin/employer notification when CV is submitted
- Applicant confirmation email

### 3. Admin Dashboard
Create an admin page to:
- View all CV submissions
- Filter by job, status, date
- Download CVs
- Update submission status
- Add notes

### 4. File Storage
Consider using cloud storage (AWS S3, Cloudinary) instead of local storage for production.

## Usage Example

```typescript
// In any component
import { CVSubmissionForm } from "@/components/CVSubmissionForm";

function MyComponent() {
  const [showForm, setShowForm] = useState(false);
  
  return (
    <>
      <button onClick={() => setShowForm(true)}>Apply</button>
      {showForm && (
        <CVSubmissionForm
          jobId="job-123"
          jobTitle="Software Developer"
          company="Tech Corp"
          onClose={() => setShowForm(false)}
          onSuccess={() => console.log("CV submitted!")}
          userId="user-456"
        />
      )}
    </>
  );
}
```

## Security Considerations

- ✅ File type validation
- ✅ File size limits (5MB)
- ✅ Sanitized filenames
- ⚠️ Add authentication checks
- ⚠️ Add rate limiting
- ⚠️ Add virus scanning (for production)
- ⚠️ Secure file access (prevent direct URL access)

## File Structure

```
public/
  uploads/
    cv/
      [timestamp]_[filename].pdf

database_migrations/
  cv_submissions.sql

app/
  api/
    cv-submission/
      route.ts

components/
  CVSubmissionForm.tsx
```

## Testing

1. Navigate to `/work-opportunities`
2. Click "Apply Now" on any job
3. Fill out the form and upload a CV
4. Check `public/uploads/cv/` for uploaded file
5. Check database for submission record (after DB integration)

## Notes

- The Simple Job Board WordPress plugin was used as inspiration but adapted for Next.js
- Files are stored locally in `public/uploads/cv/` - consider cloud storage for production
- Database integration is prepared but needs actual implementation
- Email notifications are stubbed out and need implementation

