# Valentine Template - Simp 💝

A Next.js web application for creating and sharing interactive Valentine's Day templates with Supabase backend.

## Features

- 💕 Email-only authentication (magic link/OTP) via Supabase Auth
- 📝 Customizable Valentine question editor
- 🎨 Beautiful animated UI with floating hearts and sparkles
- 🎉 Interactive "Yes/No" buttons with confetti effects
- 🔗 Shareable public links
- 📱 Mobile responsive design
- ✨ Smooth animations and pastel gradients

## Tech Stack

- **Next.js 15** - App Router with TypeScript
- **Supabase** - Authentication and Database
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Canvas Confetti** - Celebration effects

## Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- A Supabase account and project

## Supabase Setup

1. Create a new Supabase project at [https://supabase.com](https://supabase.com)

2. Create a `projects` table with the following schema:

```sql
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_email TEXT NOT NULL,
  template_type TEXT NOT NULL,
  template_code TEXT NOT NULL,
  slug TEXT UNIQUE,
  is_published BOOLEAN DEFAULT true,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_projects_owner_type ON projects(owner_email, template_type);
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_type_published ON projects(template_type, is_published);
CREATE INDEX idx_projects_owner_code ON projects(owner_email, template_code);
```

3. **Enable Row Level Security (RLS)** (Optional - API routes use service role key to bypass RLS):

```sql
-- Enable RLS on projects table
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view published templates (for public sharing)
CREATE POLICY "Public can view published templates"
  ON projects
  FOR SELECT
  USING (is_published = true);
```

**Note**: The application uses API routes with the service role key to handle authentication and authorization, which bypasses RLS. You can optionally enable these policies for additional security layers.

4. **Create test user and template record**:

```sql
-- No Supabase Auth user needed!
-- Just insert a template record with email + template_code:

INSERT INTO projects (owner_email, template_type, template_code, slug, is_published, data)
VALUES 
  ('your-test-email@example.com', 'simp', 'YOUR-SECRET-CODE', 'test-slug-123', true, '{"question": "Will you be my Valentine? 💖"}');
```

**Important**: Users access the editor by entering their email + template_code. No Supabase Auth account needed.

## Installation

1. Clone or navigate to this directory:
```bash
cd d:/template/simp
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```bash
cp .env.example .env.local
```

4. Add your Supabase credentials to `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Important**: The `SUPABASE_SERVICE_ROLE_KEY` is required for API routes to bypass Row Level Security policies. You can find this in your Supabase project settings under API → Project API keys → `service_role` key. **Keep this secret!**

## Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

### Authentication Flow
1. User logs in with **email and template_code** (no password, no Supabase Auth)
2. System verifies template exists with matching email, template_code, and template_type
3. If match found, grants access via session storage

### Authorization & Editor Access
1. **Strict Access Control**: Backend checks if a row exists where:
   - `owner_email = user.email` (normalized: trimmed and lowercased)
   - `template_code = user's entered code`
   - `template_type = 'simp'`
2. **If NO match**: 
   - ❌ Access denied on login page
   - Shows: "Invalid email or template code"
3. **If match exists**:
   - ✅ Load `data.question` into editor
   - If `data` is NULL, initialize with default: `{ "question": "Will you be my Valentine? 💖" }`
   - User can edit and save

### Save Behavior
On every save, the system:
1. Updates `data.question` with new text
2. Sets `is_published = true`
3. Ensures `slug` field is not null (generates one if missing)
4. Auto-generates and displays shareable link: `https://yourdomain.com/v/{slug}`

### Public View
1. Accessible via `/v/[slug]`
2. Fetches template where:
   - `slug = params.slug`
   - `template_type = 'simp'`
   - `is_published = true`
3. Displays interactive Valentine UI (read-only)
4. Anyone can view, only owner can edit

### Security
- **Row Level Security (RLS)** enabled on templates table
- Users can SELECT and UPDATE only their own templates (where `owner_email = auth.email()`)
- Public can SELECT templates where `is_published = true`
- Email matching is exact (trimmed and lowercased for consistency)

## Project Structure

```
simp/
├── app/
│   ├── auth/
│   │   ├── login/          # Login page
│   │   ├── callback/       # Auth callback handler
│   │   └── auth-code-error/ # Error page
│   ├── editor/             # Template editor (protected)
│   ├── v/[slug]/           # Public view page
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home (redirects to login)
│   └── globals.css         # Global styles
├── components/
│   ├── FloatingHearts.tsx  # Animated hearts background
│   ├── Sparkles.tsx        # Sparkle animations
│   └── ValentineCard.tsx   # Main Valentine UI card
├── lib/
│   ├── supabase/
│   │   ├── client.ts       # Client-side Supabase
│   │   └── server.ts       # Server-side Supabase
│   ├── types.ts            # TypeScript types
│   └── utils.ts            # Utility functions
└── package.json
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

Make sure to set these in your hosting platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Customization

### Change Default Question
Edit [app/editor/page.tsx](app/editor/page.tsx) line with the default question value.

### Modify Colors
Edit [tailwind.config.ts](tailwind.config.ts) to change the color scheme.

### Add More Template Types
The system supports multiple template types. Just change `template_type = 'simp'` to your desired type in the queries.

## Troubleshooting

### Common Issues

#### "You are not authorized to edit this template"
This means no template record exists for your email with `template_type = 'simp'`. 

**Solution**: Create a template record manually:
```sql
INSERT INTO templates (owner_email, template_type, slug, is_published, data)
VALUES 
  ('your-email@example.com', 'simp', 'unique-slug-here', true, '{"question": "Will you be my Valentine? 💖"}');
```

#### Email matching issues
- Emails are **normalized** (trimmed and lowercased)
- Check browser console for logs: `🔍 Auth check`, `📧 Normalized email`, `🔎 Template query`
- Verify your email in Supabase Auth matches exactly (no trailing spaces)

#### RLS Policy Errors
If you see "permission denied" errors:
1. Verify RLS policies are created correctly
2. Check that `auth.email()` matches your logged-in email
3. Try disabling RLS temporarily for debugging:
   ```sql
   ALTER TABLE templates DISABLE ROW LEVEL SECURITY;
   ```

#### Template not loading
1. Open browser DevTools → Console
2. Look for debug logs:
   - `🔍 Auth check:` - Shows if user is authenticated
   - `📧 Normalized email:` - Shows the email being used in queries
   - `🔎 Template query:` - Shows the database query result
   - `✅ Template found:` or `⛔ No template found`
3. Verify in Supabase Dashboard:
   - Go to Table Editor → templates
   - Check if a row exists with your email and `template_type = 'simp'`

### Debugging Steps

1. **Check Authentication**:
   ```javascript
   // In browser console on editor page:
   console.log('Look for: 🔍 Auth check')
   ```

2. **Verify Email Matching**:
   - Check the console for `📧 Normalized email`
   - Compare with Supabase Auth users table
   - Ensure no case mismatch or spaces

3. **Check Template Query**:
   - Console shows `🔎 Template query` with results
   - If `fetchError`, check RLS policies
   - If no data, template doesn't exist

4. **Test Database Direct Query**:
   ```sql
   SELECT * FROM templates 
   WHERE owner_email = 'your-email@example.com' 
   AND template_type = 'simp';
   ```

### Authentication not working
- Verify Supabase URL and anon key are correct
- Check email provider is enabled in Supabase
- Ensure callback URL is whitelisted in Supabase

### Database errors
- Verify the `templates` table exists with correct schema
- Check Row Level Security (RLS) policies if enabled

## License

MIT

## Support

For issues and questions, please check the Supabase and Next.js documentation.
