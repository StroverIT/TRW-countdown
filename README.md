# TRW Countdown - React Web Application

A cross-platform savings tracker app that helps users track their progress toward a financial goal (13,380.93 BGN) by December 31, 2025. Built with React, TypeScript, Tailwind CSS, and Firebase Firestore.

## Features

- **Real-time synchronization** across devices using Firebase Firestore
- **User ID-based system** - no authentication required
- **Progress tracking** with visual progress bar and countdown
- **Transaction management** - add, view, and delete savings transactions
- **Responsive design** - works on mobile, tablet, and desktop
- **Offline support** - data persists when offline

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **TanStack Query** for state management and caching
- **Firebase Firestore** for real-time database
- **date-fns** for date formatting

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project with Firestore enabled

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd react-trw-countdown
```

2. Install dependencies:

```bash
npm install
```

3. Set up Firebase:

   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore Database
   - Get your Firebase configuration
   - Create a `.env` file in the root directory with your Firebase credentials:

```bash
# Create .env file
touch .env
```

Add the following to your `.env` file:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## Environment Variables

The application uses environment variables for Firebase configuration. Make sure to create a `.env` file with the correct Firebase credentials as shown in the setup instructions above.

### Firestore Rules

For development, you can use these permissive rules:

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

**Note**: For production, implement proper security rules.

## Project Structure

```
src/
├── components/          # React components
│   ├── UserIDView.tsx  # User ID entry screen
│   ├── ContentView.tsx  # Main application interface
│   ├── AddTransactionView.tsx  # Modal for adding transactions
│   ├── TransactionRow.tsx      # Individual transaction display
│   └── ProgressBar.tsx         # Progress visualization
├── hooks/               # Custom React hooks
│   ├── useUserID.ts    # User ID management
│   └── useTransactions.ts  # Transaction data management
├── services/            # Business logic services
│   ├── userIdService.ts # User ID persistence
│   └── firebaseService.ts  # Firebase operations
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── config/              # Configuration files
│   └── firebase.ts      # Firebase setup
└── App.tsx              # Main application component
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Data Structure

### Firestore Collections

```
users/{userId}/transactions/{transactionId}
{
  "amount": 1000.50,
  "date": Timestamp,
  "note": "Salary bonus"
}
```

### Transaction Interface

```typescript
interface SavingsTransaction {
  id: string;
  amount: number;
  date: Date;
  note?: string;
}
```

## Features Overview

### User ID Management

- Simple user identification without authentication
- User ID validation (3-20 characters)
- Persistent storage using localStorage
- Easy switching between user accounts

### Transaction Management

- Add new savings transactions
- View transaction history
- Delete transactions
- Real-time updates across devices

### Progress Tracking

- Visual progress bar showing completion percentage
- Countdown to target date (December 31, 2025)
- Current total vs target amount display
- Responsive design for all screen sizes

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on every push

### Netlify

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Configure environment variables

### Firebase Hosting

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Build: `npm run build`
5. Deploy: `firebase deploy`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository.
# TRW-countdown
