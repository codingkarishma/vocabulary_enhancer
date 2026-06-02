# LexUp Setup Guide

## Step-by-Step Setup Instructions

### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project" or go to your organization dashboard
3. Choose a project name (e.g., "lexup")
4. Choose a strong database password
5. Select your region (closest to your users)
6. Click "Create new project" and wait for initialization (2-3 minutes)

### Step 2: Get Your Supabase Credentials

1. In your Supabase project, go to **Settings > API**
2. Under "Project URL", copy the URL
3. Under "Project API keys", find the "anon" key and copy it
4. Keep these safe - you'll need them next

### Step 3: Set Up Environment Variables

1. In the project root, create `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` with your credentials:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-key...
   ```

### Step 4: Create Database Schema

1. In Supabase, go to **SQL Editor**
2. Click "New Query"
3. Open `database-schema.sql` from your project
4. Copy the entire contents into the SQL editor
5. Click "Run" to execute all queries
6. You should see success messages for each table creation

### Step 5: Install Dependencies

```bash
npm install
```

### Step 6: Start Development Server

```bash
npm start
```

Follow the prompts to run on your desired platform.

## Accessing the App

### Web Browser

1. Press `w` in the terminal
2. Your browser will open at `http://localhost:19006`

### Android Emulator

- Ensure Android Emulator is running
- Press `a` in the terminal

### iOS Simulator (Mac only)

- Press `i` in the terminal

## Testing the App

### Creating a Test Account

1. Go to the Signup screen
2. Enter: `test@example.com` / `password123`
3. Confirm signup (may need to verify email in Supabase if email verification is enabled)

### Running the Assessment

1. Log in with your test account
2. Take the 15-question assessment
3. Get assigned a level based on your score

### Exploring Features

1. **Home Screen**: View chapters and streak progress
2. **Word Learning**: Learn 5 words per day
3. **Sentence Practice**: Write sentences using words
4. **Quiz**: Take the chapter quiz (20 questions)

## Database Management

### Viewing Data in Supabase

1. In Supabase, go to **Table Editor**
2. Select any table to view its data:
   - `users`: User profiles and progress
   - `words`: All vocabulary words
   - `chapters`: Learning chapters
   - `user_words`: Words learned by users
   - `quiz_results`: Quiz scores

### Modifying Data

1. You can directly edit records in the Table Editor
2. Or use the Supabase Dashboard to manage data
3. Use SQL Editor for complex queries

## Deployment

### Build for iOS

```bash
eas build --platform ios
```

### Build for Android

```bash
eas build --platform android
```

### Submit to App Stores

```bash
eas submit --platform ios
eas submit --platform android
```

(Requires paid EAS account)

## Troubleshooting

### Issue: "Connection refused" or Network Error

**Solution**:

- Verify your Supabase URL is correct
- Check your internet connection
- Make sure `.env.local` has the correct credentials
- Restart the development server

### Issue: "RLS policy violation" or 403 errors

**Solution**:

- This means Row Level Security is blocking access
- Go to Supabase > SQL Editor
- Re-run the database schema setup
- Ensure you're logged in when making requests

### Issue: "Module not found" errors

**Solution**:

- Delete `node_modules` folder
- Run `npm install` again
- Clear Expo cache: `expo start --clear`

### Issue: "You must provide either a URL and API key..."

**Solution**:

- Your `.env.local` file is not set up
- Follow Step 3 above carefully
- Make sure you're using the correct key names
- Restart the dev server after updating `.env.local`

## Important Notes

1. **Never commit `.env.local`** to git - it contains sensitive credentials
2. **Row Level Security (RLS)** is enabled for all tables - data access is restricted to authenticated users
3. **Email verification** is optional - you can disable it in Supabase Auth settings
4. The app uses **Zustand** for state management - all state is stored locally and synced with Supabase
5. The database schema includes **sample words** for all 5 chapters

## Next Steps

1. Customize the vocabulary words in your database
2. Add more chapters if needed
3. Customize colors and styling in the screen components
4. Add analytics tracking
5. Set up push notifications for daily reminders
6. Deploy to Expo EAS or compile native apps

## Support

- Supabase Docs: https://supabase.com/docs
- React Native Docs: https://reactnative.dev
- Expo Docs: https://docs.expo.dev
- Zustand Docs: https://github.com/pmndrs/zustand

Good luck with LexUp! 🚀
