# Netflix Clone

A React Native Netflix clone application with trailer preview functionality and profile management.

## Features

### Authentication & Profiles
- User login/signup system
- Profile management (max 3 profiles)
- Profile switching
- Profile customization (avatar, name)

### Movie Browsing
- Home screen with categorized movies
- Trending section
- Categories (Movies, TV Shows, My List)
- Search functionality
- Hover preview with auto-playing trailers
- Full-screen trailer playback on click

### UI/UX
- Dark theme throughout the app
- Smooth animations and transitions
- Netflix-style card layout
- Responsive design for all screen sizes

### Movie Details
- Movie/Show information
- Cast information
- Similar recommendations
- Add to My List functionality
- Share functionality

## Project Structure

```
src/
├── screens/              
│   ├── auth/            # Login, Signup screens
│   ├── profile/         # Profile selection, management
│   ├── browse/          # Main browsing screens
│   └── details/         # Movie detail screens
├── components/        
│   ├── shared/          # Reusable components
│   │   ├── buttons/
│   │   ├── cards/
│   │   └── layout/
│   └── screen-specific/ # Screen-specific components
├── navigation/          # Navigation configuration
├── services/           
│   ├── auth/           # Authentication services
│   ├── api/            # Movie API integration
│   └── youtube/        # YouTube API for trailers
├── hooks/              # Custom React hooks
├── constants/          
│   ├── theme.ts        # Dark theme configuration
│   └── api.ts          # API endpoints
├── utils/              # Helper functions
├── assets/             # Images, icons
└── types/              # TypeScript definitions
```

## Tech Stack

- React Native
- TypeScript
- React Navigation
- Expo
- Firebase (Authentication)
- TMDB API (Movie data)
- YouTube API (Trailers)
- Styled Components

## Required APIs
1. TMDB API - For movie data and information
2. YouTube API - For movie trailers
3. Firebase - For authentication and profile management

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env` file with:
```
TMDB_API_KEY=your_tmdb_api_key
YOUTUBE_API_KEY=your_youtube_api_key
FIREBASE_CONFIG=your_firebase_config
```

3. Run the development server:
```bash
npm start
```

## Screens Flow

1. **Authentication Flow**
   - Login Screen
   - Signup Screen
   - Profile Selection Screen
   - Profile Management Screen

2. **Main Flow**
   - Home Screen (Browse)
   - Category Screens
   - Search Screen
   - Movie Details Screen
   - Full-screen Trailer Player

3. **Profile Flow**
   - Profile Selection
   - Profile Edit
   - Profile Creation

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
