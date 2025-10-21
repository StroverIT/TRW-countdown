# Setup Guide for TRW Countdown

This guide will help you set up the Firebase configuration for the TRW Countdown application.

## Prerequisites

Before you begin, make sure you have:
- A Firebase account (create one at [firebase.google.com](https://firebase.google.com))
- Node.js 18+ installed
- The project dependencies installed (`npm install`)

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard to create your project
4. Once created, you'll be redirected to your project dashboard

## Step 2: Enable Firestore Database

1. In the Firebase Console, click on "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" for development (or "Start in production mode" if you want to set up rules immediately)
4. Select a location for your database (choose one close to your users)
5. Click "Enable"

## Step 3: Get Your Firebase Configuration

1. In the Firebase Console, click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to the "Your apps" section
4. Click the web icon (`</>`) to add a web app
5. Give your app a nickname (e.g., "TRW Countdown")
6. Click "Register app"
7. You'll see a configuration object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

## Step 4: Create Your .env File

1. In the root directory of this project, create a file named `.env`
   ```bash
   touch .env
   ```

2. Copy the template below and paste it into your `.env` file:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id_here
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
   VITE_FIREBASE_APP_ID=your_app_id_here
   ```

3. Replace the placeholder values with your actual Firebase configuration values:
   - `VITE_FIREBASE_API_KEY` → `apiKey` from Firebase config
   - `VITE_FIREBASE_AUTH_DOMAIN` → `authDomain` from Firebase config
   - `VITE_FIREBASE_PROJECT_ID` → `projectId` from Firebase config
   - `VITE_FIREBASE_STORAGE_BUCKET` → `storageBucket` from Firebase config
   - `VITE_FIREBASE_MESSAGING_SENDER_ID` → `messagingSenderId` from Firebase config
   - `VITE_FIREBASE_APP_ID` → `appId` from Firebase config

### Example .env File

Here's what your `.env` file should look like with actual values:

```env
VITE_FIREBASE_API_KEY=AIzaSyDXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=trw-countdown-12345.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=trw-countdown-12345
VITE_FIREBASE_STORAGE_BUCKET=trw-countdown-12345.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890abcdef
```

## Step 5: Set Up Firestore Security Rules

For development, you can use these permissive rules:

1. Go to Firestore Database → Rules in the Firebase Console
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if true;  // Public access for development
    }
  }
}
```

3. Click "Publish"

**⚠️ Important:** For production, you should implement proper security rules to protect your data.

### Recommended Production Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/transactions/{transactionId} {
      // Allow users to read and write only their own data
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Or for a simple userId-based system without auth:
      // allow read, write: if true;  // Consider adding more restrictions
    }
  }
}
```

## Step 6: Start the Development Server

1. Make sure you've saved your `.env` file
2. Restart your development server:
   ```bash
   npm run dev
   ```

3. Open your browser to [http://localhost:5173](http://localhost:5173)
4. You should now see the application without any Firebase errors!

## Troubleshooting

### Error: "Missing Firebase environment variables"

**Solution:** 
- Make sure your `.env` file exists in the root directory
- Check that all environment variables start with `VITE_`
- Restart the development server after creating/modifying the `.env` file

### Error: "Firebase configuration has undefined values"

**Solution:**
- Double-check that you copied all values correctly from Firebase Console
- Make sure there are no extra spaces or quotes around the values
- Verify that your `.env` file is properly formatted (no extra commas, semicolons, etc.)

### Error: "projects/undefined/databases/(default)"

**Solution:**
- This means the `VITE_FIREBASE_PROJECT_ID` is not set correctly
- Check your `.env` file and make sure the project ID matches your Firebase project
- Restart the development server

### Application stuck on "Loading your savings..."

**Solution:**
- Check the browser console for errors
- Verify that your Firestore database is enabled
- Check that your Firestore security rules allow reads and writes
- Make sure your Firebase configuration is correct

### Changes to .env file not taking effect

**Solution:**
- Vite only reads environment variables at startup
- You must restart the development server (`Ctrl+C` then `npm run dev`)
- Clear your browser cache if issues persist

## Security Notes

1. **Never commit your `.env` file to version control**
   - The `.env` file is already in `.gitignore`
   - If you accidentally commit it, immediately rotate your Firebase API key

2. **API Key Exposure**
   - Firebase API keys are safe to expose in client-side code
   - However, you should still protect them in production with proper security rules

3. **Production Deployment**
   - When deploying to production (Vercel, Netlify, etc.), add your environment variables in the hosting platform's dashboard
   - Don't include the `.env` file in your production build

## Next Steps

Once your Firebase is set up:

1. Enter a User ID on the welcome screen
2. Start adding savings transactions
3. Track your progress toward the 13,380.93 BGN goal!

## Need Help?

- [Firebase Documentation](https://firebase.google.com/docs)
- [Vite Environment Variables Guide](https://vitejs.dev/guide/env-and-mode.html)
- Check the project's README.md for more information

---

Happy saving! 🎯💰

