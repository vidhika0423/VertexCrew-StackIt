# Clerk Authentication Setup for StackIt

## Overview
This guide will help you set up Clerk authentication for your StackIt Q&A application.

## Features Implemented
- ✅ Sign In/Sign Up button in the top right corner
- ✅ User profile button (avatar) when signed in
- ✅ "Ask Question" button only visible to signed-in users
- ✅ Comment sections only visible to signed-in users
- ✅ Answer submission only available to signed-in users
- ✅ Guest users can view questions but cannot interact

## Setup Steps

### 1. Get Your Clerk Keys
1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application or select an existing one
3. Navigate to **API Keys** in the sidebar
4. Copy your **Publishable Key** (starts with `pk_test_` or `pk_live_`)

### 2. Configure Clerk in Your App
1. Open `src/config/clerk.js`
2. Replace `'pk_test_YOUR_PUBLISHABLE_KEY_HERE'` with your actual publishable key
3. Save the file

### 3. Wrap Your App with ClerkProvider
In your `src/main.jsx` or `src/App.jsx`, wrap your app with ClerkProvider:

```jsx
import { ClerkProvider } from '@clerk/clerk-react';
import { clerkConfig } from './config/clerk';

function App() {
  return (
    <ClerkProvider publishableKey={clerkConfig.publishableKey}>
      <YourApp />
    </ClerkProvider>
  );
}
```

### 4. Test the Authentication
1. Start your development server: `npm run dev`
2. You should see a "Sign In" button in the top right corner
3. Click it to test the sign-in flow
4. After signing in, you should see:
   - Your avatar in the top right
   - An "Ask Question" button
   - Comment sections on questions
   - Ability to add answers in post modals

## How It Works

### For Signed-In Users:
- Can ask questions (green "Ask Question" button)
- Can leave comments on questions
- Can add answers in post modals
- See their profile avatar in the top right
- Personalized greeting with their name

### For Guest Users:
- Can view all questions and answers
- Can search and filter questions
- Can navigate through pagination
- See a "Sign In" button in the top right
- Cannot ask questions or leave comments
- See prompts to sign in when trying to interact

## Security Features
- All interactive features are protected behind authentication
- Guest users cannot submit any content
- User information is securely managed by Clerk
- No sensitive data is stored locally

## Troubleshooting

### Clerk Not Working?
1. Check that your publishable key is correct
2. Ensure ClerkProvider is wrapping your entire app
3. Check the browser console for any errors
4. Verify your Clerk application is active in the dashboard

### Styling Issues?
- The authentication buttons are styled to match your app's design
- User avatars are circular with hover effects
- All buttons have consistent styling and animations

### Need to Customize?
- Modify the button styles in `src/pages/Home.module.css`
- Adjust the sign-in prompt styling in `src/components/PostModal.module.css`
- Customize Clerk appearance in the dashboard

## Next Steps
Once authentication is working, you can:
1. Add user roles and permissions
2. Implement user profiles
3. Add email verification
4. Set up social login providers
5. Add user preferences and settings 