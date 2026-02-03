# Payment System Setup Guide

This guide will help you set up the payment system for your Demargo Interior website.

## Prerequisites

- A Firebase account (free tier is sufficient)
- A Paystack account (for Ghana-based payments)
- Basic understanding of environment variables

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name: `demargo-interior` (or your preferred name)
4. Disable Google Analytics (optional, not needed for this project)
5. Click "Create project"

## Step 2: Set Up Firestore Database

1. In your Firebase project, click "Firestore Database" in the left sidebar
2. Click "Create database"
3. Select "Start in **production mode**" (we'll configure rules next)
4. Choose a Cloud Firestore location (select closest to Ghana, e.g., `europe-west1`)
5. Click "Enable"

### Configure Firestore Security Rules

1. Go to "Firestore Database" → "Rules" tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Projects collection - read-only for clients
    match /projects/{projectId} {
      allow read: if true;
      allow write: if false; // Only admin can write (you'll add projects manually)
    }
    
    // Payments collection - read-only
    match /payments/{paymentId} {
      allow read: if true;
      allow write: if false; // Only the payment system can write
    }
  }
}
```

3. Click "Publish"

> **Note**: These rules allow anyone to read projects and payments. For production, you should implement authentication and restrict access to specific users.

## Step 3: Get Firebase Configuration

1. In Firebase Console, click the gear icon ⚙️ next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon `</>` to add a web app
5. Enter app nickname: `Demargo Website`
6. **Do NOT** check "Also set up Firebase Hosting"
7. Click "Register app"
8. Copy the `firebaseConfig` object values

## Step 4: Create Paystack Account

1. Go to [Paystack](https://paystack.com)
2. Click "Sign Up" and create an account
3. Complete business verification (required for live payments)
4. Go to Settings → API Keys & Webhooks
5. Copy your **Test Public Key** (starts with `pk_test_`)

> **Important**: Use test keys for development. Switch to live keys only when ready for production.

## Step 5: Configure Environment Variables

1. In your project root, create a file named `.env.local`
2. Copy the contents from `.env.example`
3. Fill in your actual values:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# Paystack Configuration (TEST key for development)
VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_actual_test_key_here
```

4. Save the file

> **Security Note**: Never commit `.env.local` to Git. It's already in `.gitignore`.

## Step 6: Add Sample Project to Firestore

1. Go to Firebase Console → Firestore Database
2. Click "Start collection"
3. Collection ID: `projects`
4. Click "Next"
5. Add a document with these fields:

| Field Name | Type | Value (Example) |
|------------|------|-----------------|
| clientName | string | John Doe |
| clientEmail | string | john@example.com |
| clientPhone | string | +233123456789 |
| projectTitle | string | Living Room Renovation |
| projectDescription | string | Complete living room interior design with curtains and lighting |
| totalAmount | number | 5000 |
| amountPaid | number | 0 |
| balance | number | 5000 |
| status | string | approved |
| createdAt | timestamp | (auto-generated) |
| updatedAt | timestamp | (auto-generated) |

7. Click "Save"

### Project Status Values

- `pending` - Project submitted, awaiting approval
- `approved` - Project approved, client can make payment
- `in-progress` - Work has started
- `completed` - Work completed
- `paid` - Fully paid

> **Important**: Only projects with status `approved` and `balance > 0` will show the payment button.

## Step 7: Test the Payment System

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser to `http://localhost:5173`

3. Verify site functionality

4. To test personal projects or measurement payments, follow the specific page instructions.

5. Click "Make Payment" on the approved project

6. Use Paystack test card:
   - Card Number: `4084 0840 8408 4081`
   - CVV: `408`
   - Expiry: Any future date
   - PIN: `0000`
   - OTP: `123456`

7. Verify payment success and check Firestore for updated payment records

## Step 8: Adding More Projects

### Option 1: Manually via Firebase Console

1. Go to Firestore Database → `projects` collection
2. Click "Add document"
3. Fill in all required fields (see Step 6)
4. Click "Save"

### Option 2: Import from CSV (Advanced)

You can use Firebase Admin SDK or third-party tools to bulk import projects from a CSV file.

## Step 9: Going Live

When ready for production:

1. **Update Firestore Rules** for better security:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /projects/{projectId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    match /payments/{paymentId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if false;
    }
  }
}
```

2. **Switch to Paystack Live Keys**:
   - Get your Live Public Key from Paystack Dashboard
   - Update `.env.local`:
     ```env
     VITE_PAYSTACK_PUBLIC_KEY=pk_live_your_actual_live_key_here
     ```

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Deploy** to your hosting provider (Netlify, Vercel, etc.)

## Troubleshooting

### Firebase Connection Issues

- Verify all environment variables are correctly set
- Check browser console for error messages
- Ensure Firestore is enabled in Firebase Console

### Paystack Payment Not Opening

- Verify Paystack public key is correct
- Check browser console for errors
- Ensure you're using the correct key (test vs live)

### Projects Not Showing

- Verify project status is `approved`
- Check that clientEmail or clientPhone matches exactly
- Ensure Firestore rules allow read access

### Payment Not Recording

- Check browser console for errors
- Verify Firestore write permissions
- Ensure payment service is correctly imported

## Support

For issues or questions:
- Firebase: [Firebase Documentation](https://firebase.google.com/docs/firestore)
- Paystack: [Paystack Documentation](https://paystack.com/docs)
- React Paystack: [react-paystack GitHub](https://github.com/iamraphson/react-paystack)

## Security Best Practices

1. **Never expose secret keys** - Only use public keys in frontend
2. **Implement authentication** - Add user login for production
3. **Validate on backend** - Verify payments server-side (future enhancement)
4. **Use HTTPS** - Always use HTTPS in production
5. **Monitor transactions** - Regularly check Paystack dashboard for anomalies
6. **Backup Firestore** - Enable automatic backups in Firebase Console
