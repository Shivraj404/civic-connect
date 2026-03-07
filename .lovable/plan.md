

## Plan: Set Up Database, Auth & Admin Account

### Current State
- No database tables exist
- No storage buckets
- Admin login page exists but no data backend
- User is on `/admin/login`

### Step 1: Create Database Tables (migration)

**`issues` table** — stores all civic complaints:
- id, title, description, category, status, department, image_url, latitude, longitude, address, user_id, user_name, created_at, updated_at
- RLS: authenticated users can insert their own, anyone can read, admins can update/delete all

**`user_roles` table** — admin role management:
- id, user_id, role (enum: admin, moderator, user)
- `has_role()` security definer function
- RLS policies using `has_role()`

**Storage bucket** `issue-images` for photo uploads.

### Step 2: Enable Auto-Confirm Signups
So you can sign up and immediately log in without email verification (for testing).

### Step 3: Create Your Admin Account
After tables are created, you'll sign up through the admin login page with your chosen email/password. Then I'll insert a row into `user_roles` to grant you the `admin` role.

**Suggested credentials** (you'll enter these on the signup form):
- Email: `admin@civicai.com`
- Password: `Admin@123456`

(You can use any email/password you want — these are just suggestions.)

### Step 4: Wire Up All Pages to Database
- **ReportIssue.tsx**: Insert issues into DB, upload images to storage
- **TrackIssues.tsx**: Fetch real issues from DB
- **AdminDashboard.tsx**: CRUD operations against DB, admin role check
- **Auth.tsx**: New citizen login/signup page at `/auth`
- **Navbar.tsx**: Add login/logout links
- **App.tsx**: Add `/auth` route

### Step 5: Protect Admin Dashboard
Check `user_roles` table to verify the logged-in user has admin role before showing dashboard.

### Files Changed
- **New**: `src/pages/Auth.tsx`
- **Modified**: `ReportIssue.tsx`, `TrackIssues.tsx`, `AdminDashboard.tsx`, `Navbar.tsx`, `App.tsx`
- **Database**: 2 tables, 1 enum, 1 function, RLS policies, 1 storage bucket

