// Clerk Configuration
// Replace these with your actual Clerk keys from your Clerk dashboard

export const clerkConfig = {
  publishableKey: 'pk_test_YOUR_PUBLISHABLE_KEY_HERE',
  // You can also add other Clerk configuration options here
};

// To get your Clerk keys:
// 1. Go to https://dashboard.clerk.com/
// 2. Create a new application or select existing one
// 3. Go to API Keys in the sidebar
// 4. Copy your Publishable Key
// 5. Replace 'pk_test_YOUR_PUBLISHABLE_KEY_HERE' with your actual key

// Then in your main.jsx or App.jsx, wrap your app with ClerkProvider:
/*
import { ClerkProvider } from '@clerk/clerk-react';
import { clerkConfig } from './config/clerk';

function App() {
  return (
    <ClerkProvider publishableKey={clerkConfig.publishableKey}>
      <YourApp />
    </ClerkProvider>
  );
}
*/ 