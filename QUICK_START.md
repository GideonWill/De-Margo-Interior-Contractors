# Quick Start Guide - Payment System

## What Was Built

✅ Complete payment system for client projects
✅ Firebase Firestore database integration
✅ Paystack payment gateway (Ghana)
✅ Responsive design (mobile, tablet, desktop)

## Next Steps (Required)

### 1. Create Firebase Project (5 minutes)

1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Name: `demargo-interior`
4. Disable Google Analytics
5. Click "Create project"

### 2. Enable Firestore (2 minutes)

1. Click "Firestore Database" → "Create database"
2. Select "Production mode"
3. Choose location: `europe-west1` (closest to Ghana)
4. Click "Enable"

### 3. Get Firebase Config (2 minutes)

1. Click gear icon ⚙️ → "Project settings"
2. Scroll to "Your apps"
3. Click web icon `</>`
4. App nickname: `Demargo Website`
5. Copy the config values

### 4. Create Paystack Account (10 minutes)

1. Go to https://paystack.com
2. Sign up and verify email
3. Go to Settings → API Keys
4. Copy your **Test Public Key** (starts with `pk_test_`)

### 5. Configure Environment (3 minutes)

Create `.env.local` file in project root:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123

VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_test_key
```

### 6. Add Test Project (3 minutes)

In Firebase Console → Firestore:

1. Create collection: `projects`
2. Add document with these fields:

```
clientName: "Test Client"
clientEmail: "test@example.com"
clientPhone: "+233123456789"
projectTitle: "Test Project"
projectDescription: "Test description"
totalAmount: 1000
amountPaid: 0
balance: 1000
status: "approved"
```

### 7. Test It! (5 minutes)

1. Run: `npm run dev`
2. Go to http://localhost:5173
3. Verify site functionality

## Files Created

- `src/firebase.js` - Firebase configuration
- `src/services/projectService.js` - Database operations
- `src/components/PaymentModal.jsx` - Payment popup
- `.env.example` - Environment template
- `PAYMENT_SETUP.md` - Detailed setup guide

## How It Works

1. **Admin sends** payment request to client
2. **Client receives** request or uses self-service forms
3. **Client clicks** payment link/button
4. **Paystack opens** secure payment form
5. **Payment processes** through Paystack
6. **System records** payment in Firestore
7. **Project updates** automatically

## Need Help?

📖 Read: `PAYMENT_SETUP.md` for detailed instructions
📊 Check: Browser console for error messages
🔍 Verify: Environment variables are set correctly

## Going Live

When ready for production:

1. Get Paystack **Live** public key
2. Update `.env.local` with live key
3. Run: `npm run build`
4. Deploy to Netlify/Vercel

---

**Total Setup Time: ~30 minutes**
