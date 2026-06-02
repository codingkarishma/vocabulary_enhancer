# LexUp - Vocabulary Learning App

A vocabulary learning app built with React Native + Expo, Supabase backend, and Zustand state management.

## Features

- **Authentication**: Email login and signup with Supabase
- **Vocabulary Assessment**: 15-question assessment to determine starting level
- **Learning Chapters**: 5 chapters with 20 words each
- **Daily Learning**: 5 words per day with meanings and examples
- **Sentence Practice**: Write sentences using the words learned
- **Chapter Quizzes**: 20-question quizzes with 80% pass requirement
- **Revision Flow**: Review incorrectly answered words
- **Staircase Progression**: Visual chapter progression system
- **Consistency Tracking**: Daily streak with milestone rewards

## Tech Stack

- **Frontend**: React Native + Expo
- **Backend**: Supabase
- **Database**: PostgreSQL
- **State Management**: Zustand
- **Authentication**: Supabase Auth
- **Styling**: React Native (NativeWind ready)

## Project Structure

```
lexup/
├── App.js                 # Entry point
├── app.json               # Expo configuration
├── package.json
├── .env.example           # Environment variables template
├── database-schema.sql    # Database schema for Supabase
└── src/
    ├── config/
    │   └── supabase.js    # Supabase configuration
    ├── screens/           # All screen components
    │   ├── LoginScreen.js
    │   ├── SignupScreen.js
    │   ├── AssessmentScreen.js
    │   ├── AssessmentResultScreen.js
    │   ├── HomeScreen.js
    │   ├── WordLearningScreen.js
    │   ├── SentencePracticeScreen.js
    │   ├── QuizScreen.js
    │   └── QuizResultScreen.js
    └── store/             # Zustand stores
        ├── authStore.js   # Authentication state
        └── learningStore.js # Learning state
```

## Setup Instructions

### 1. Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- A Supabase account

### 2. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor and run the `database-schema.sql` file
3. Copy your project URL and anon key from Settings > API

### 3. Environment Configuration

1. Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your Supabase credentials:

   ```
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

3. Also update `src/config/supabase.js` with the same values:
   ```javascript
   const SUPABASE_URL = 'https://your-project.supabase.co';
   const SUPABASE_ANON_KEY = 'your-anon-key';
   ```

### 4. Install Dependencies

```bash
npm install
```

### 5. Run the App

#### For Web (development)

```bash
npm start
# Press 'w' to open in web browser
```

#### For Android Emulator

```bash
npm run android
```

#### For iOS Simulator (Mac only)

```bash
npm run ios
```

## User Journey

1. **Sign Up** → Create account with email and password
2. **Assessment** → 15 questions to determine vocabulary level
3. **Level Assignment** → Assigned to Beginner/Intermediate/Advanced
4. **Home Screen** → See staircase progression and current streak
5. **Daily Learning** → Learn 5 words with meanings and examples
6. **Sentence Practice** → Practice using words in sentences
7. **Chapter Quiz** → Take 20-question quiz (80% to pass)
8. **Progress** → Unlock next chapter, maintain streak

## Vocabulary Levels

- **Beginner**: < 60% on assessment
- **Intermediate**: 60-79% on assessment
- **Advanced**: ≥ 80% on assessment

## Quiz Requirements

- **Total Questions**: 20
- **Question Types**: Meaning, Synonym, Context
- **Pass Mark**: 80%
- **Retry**: Available if score < 80%

## Consistency Milestones

- 7 Days → Seed 🌱
- 15 Days → Sprout 🌿
- 30 Days → Tree 🌳
- 45 Days → Dedicated Learner 🔥
- 90 Days → Consistency Champion 🏆

## Database Schema

### Tables

- **users**: User profiles and progress
- **chapters**: Learning chapters
- **words**: Vocabulary words with definitions
- **user_words**: Tracks which words users have learned
- **quiz_results**: Quiz performance data

## Future Enhancements

- AI-powered sentence validation
- Spaced repetition algorithm
- Leaderboards
- Social features
- Offline mode
- Video explanations
- Native mobile apps (iOS/Android builds)

## Deployment

### Expo EAS Build

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure your project
eas build:configure

# Build for iOS/Android
eas build --platform ios
eas build --platform android

# Submit to stores
eas submit
```

## Troubleshooting

### Supabase Connection Issues

1. Verify your Supabase URL and key are correct
2. Check that Row Level Security (RLS) policies are enabled
3. Ensure the database schema is properly set up

### Expo Development Server Issues

1. Clear cache: `expo start --clear`
2. Reset modules: `npm install`
3. Check port availability (default: 19000)

## License

MIT

## Support

For issues or questions, please create an issue in the repository.
