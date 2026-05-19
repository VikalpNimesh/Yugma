# In-App Purchases (IAP) Implementation & Production Guide
This guide provides a comprehensive, end-to-end blueprint for setting up, integrating, testing, and deploying In-App Purchases (IAP) on both **Android (Google Play Billing)** and **iOS (Apple App Store Kit)**. 

It is tailored to align with **Yugma's** tech stack—specifically using **React Native**, `react-native-iap`, and a backend verification architecture.

---

## 1. Core Concepts: Product Types & Use Cases

Before setting up IAP, you must understand the four distinct categories of digital goods and when to create them.

| Product Type | Google Play Console Name | Apple App Store Connect Name | Core Behavior | Yugma Example |
| :--- | :--- | :--- | :--- | :--- |
| **Consumable** | One-time Product (Consumable) | Consumable | Can be purchased repeatedly. Used/depleted inside the app (must be "consumed" programmatically on the client before buying again). | Wallet credits, swiping boosts, instant matchmaking recharges. |
| **Non-Consumable** | One-time Product (Non-consumable) | Non-Consumable | Purchased once, permanently unlocks a feature. Does not expire and must be restorable across devices owned by the user. | "Remove Ads Permanently", "Unlock Premium Background Theme". |
| **Auto-Renewing Subscriptions** | Subscription (with Base Plans) | Auto-Renewing Subscription | Charges recurring fees automatically at the end of each billing cycle (weekly, monthly, yearly) until canceled by the user. | **Yugma Premium Membership** (Weekly, Monthly, Quarterly, Yearly tiers). |
| **Non-Renewing Subscriptions** | N/A | Non-Renewing Subscription | Grants access to premium content for a fixed duration (e.g., 3 months) but does **not** auto-renew. | "6-Month Premium Pass" (rarely used now, standard auto-renewing is preferred). |

### 💡 Recommendation for Yugma
- Use **Auto-Renewing Subscriptions** for the core Premium tiers (PremiumPlansScreen).
- Use **Consumable Products** if you introduce coins, credits, or individual "Super Likes" or "Profile Boosts" that can be depleted.

---

## 2. Store Configuration: Step-by-Step Setup

### 🤖 Android Setup (Google Play Console)
Google Play billing now utilizes the **Subscriptions V2** paradigm, where a single Subscription ID contains multiple **Base Plans** and **Offers**. This is exactly how Yugma's Android billing is parsed.

1. **Merchant Account**:
   - Go to Google Play Console ➡️ **Settings** ➡️ **Merchant Account** and complete your setup to receive payments.
2. **App Permissions**:
   - Ensure your `android/app/src/main/AndroidManifest.xml` includes:
     ```xml
     <uses-permission android:name="com.android.vending.BILLING" />
     ```
3. **Create Subscriptions**:
   - In Play Console, go to **Products** ➡️ **Subscriptions**.
   - Create a subscription with a single identifier (e.g., `premium`).
   - Click into `premium` and click **Add Base Plan**:
     - **Base Plan ID**: `weekly`, `monthly`, `quarterly`, `halfyearly`, `yearly`
     - **Type**: Auto-renewing
     - **Price**: Set local prices per region.
   - Click **Activate** on each base plan.
   
   > [!IMPORTANT]
   > Do **not** create separate subscription products for `premium_weekly` and `premium_monthly`. Google Play V2 relies on a single parent Subscription SKU (`premium`) containing multiple base plan IDs. This matches Yugma's frontend parser:
   > `premiumSub.subscriptionOfferDetailsAndroid` mapping `basePlanId` to Weekly/Monthly/etc.

4. **Create One-time Products (for Consumables/Non-Consumables)**:
   - Go to **Products** ➡️ **In-app products** ➡️ **Create product**.
   - Set **Product ID** (e.g., `coins_100`).
   - Define price and activate it.

---

### 🍏 iOS Setup (App Store Connect)
Apple maintains a simpler one-SKU-to-one-product structure. Every subscription length and tier must be its own independent Product ID, grouped together in a **Subscription Group**.

1. **Agreements and Tax**:
   - In App Store Connect, go to **Agreements, Tax, and Banking** and sign the **Paid Apps Agreement**. You cannot test or load products until this is active.
2. **Create a Subscription Group**:
   - Go to **Apps** ➡️ **Your App** ➡️ **In-App Purchases** ➡️ **Subscriptions**.
   - Click **Create** under **Subscription Groups** (e.g., "Premium Group").
   - Subscription groups allow users to upgrade/downgrade between tiers (e.g., monthly to yearly) smoothly, with Apple automatically handling the billing offsets.
3. **Create Subscriptions inside the Group**:
   - Inside the Group, click **Create** under **Subscriptions**.
   - **Product ID (SKU)**: Create unique identifiers for each billing cycle, such as `premium_weekly`, `premium_monthly`, `premium_yearly`.
   - Select the duration (1 Week, 1 Month, etc.) and set pricing.
4. **Create One-time Products (Consumable / Non-Consumable)**:
   - Go to **In-App Purchases** ➡️ **App Store Purchases** ➡️ **Create**.
   - Select **Consumable** or **Non-Consumable**, assign a Product ID (e.g., `coins_100_ios`), set price, and save.

---

## 3. Frontend Implementation Sequence

In `react-native-iap`, standard interaction with store products requires a strict sequence of calls. Here is the operational lifecycle and why each step must occur in order.

```mermaid
sequenceDiagram
    autonumber
    participant App as React Native App
    participant SDK as react-native-iap
    participant OS as Store OS (Google/Apple)
    
    rect rgb(240, 248, 255)
    Note over App,OS: Phase 1: Initialization & Connection
    App->>SDK: initConnection()
    SDK->>OS: Open connection to Billing Client
    OS-->>SDK: Billing Client Ready
    SDK-->>App: Connection established
    end

    rect rgb(245, 245, 245)
    Note over App,OS: Phase 2: Fetching Store Offerings
    App->>SDK: getProducts() or getSubscriptions(SKUs)
    SDK->>OS: Query product metadata & pricing
    OS-->>SDK: Return formatted localized pricing & structures
    SDK-->>App: Set local state with products
    end

    rect rgb(255, 240, 245)
    Note over App,OS: Phase 3: Synchronizing User State
    App->>SDK: getActiveSubscriptions() / getAvailablePurchases()
    SDK->>OS: Query active purchases tied to Apple ID / Google Account
    OS-->>SDK: Return active transactions receipts
    SDK-->>App: Refresh active plans state
    end
```

### ❓ Why call these functions in this sequence?

1. **`IAP.initConnection()`**:
   - **Why first**: Opens connection channels to Android Play Billing and iOS StoreKit. Without a successful initialization, all subsequent calls will throw an immediate native crash or error.
2. **`IAP.getSubscriptions({ skus })` or `IAP.getProducts({ skus })`**:
   - **Why second**: Queries the Google/Apple servers to get the exact, real-time localized pricing, currency symbols, and subscription metadata. This is required because you **must never hardcode prices** in your UI; store terms mandate displaying localized currency.
3. **`IAP.getActiveSubscriptions()`**:
   - **Why third**: Retrieves active receipts currently recognized by the device's logged-in OS account. By fetching this *after* loading products, you can filter out already purchased subscription plans from the UI (preventing users from purchasing something they already own) or unlock features immediately on launch if their subscription is still valid.

---

## 4. The Complete Transaction Lifecycle

An IAP transaction is a multi-step handshake. If you fail to finish a transaction, Apple or Google will automatically **refund the user** after a few days!

```mermaid
sequenceDiagram
    autonumber
    participant User as User (UI)
    participant Client as React Native Client
    participant OS as Store Server (Google/Apple)
    participant BE as Yugma Backend
    
    User->>Client: Clicks "Select Plan" & Purchases
    Client->>OS: requestPurchase(SKU)
    OS-->>User: OS System Payment Modal
    User->>OS: Confirms with Biometrics / Password
    OS-->>OS: Process payment
    OS-->>Client: purchaseUpdatedListener (Triggers with Receipt)
    
    rect rgb(255, 253, 230)
    Note over Client,BE: Secure Verification Flow
    Client->>BE: POST /subscription/verify (Send receipt + transactionDetails)
    BE->>OS: Verify secure receipt with Google/Apple Server API
    OS-->>BE: Returns verified receipt data (Status: Active)
    BE->>BE: Update user state in database (isPremium = true)
    BE-->>Client: HTTP 200 OK (Verification Successful)
    end
    
    Client->>OS: finishTransaction({ purchase })
    Note right of OS: Transaction marked complete.<br/>Payment captured permanently.
    Client-->>User: Show Success Modal
```

### 🧑‍💻 React Native Integration Code
Here is how your client listener should be structured to handle the lifecycle securely. This logic lives inside your global **IapContext / useIAP hook**:

```typescript
import { useEffect } from 'react';
import * as IAP from 'react-native-iap';
import { Platform } from 'react-native';
import axiosInstance from '../api/axios/axiosInstance';

export const useIapSetup = (userId: string) => {
    useEffect(() => {
        // 1. Initialize Connection
        IAP.initConnection().then(() => {
            console.log("IAP Connection Initialized");
        });

        // 2. Set Up Purchase Updated Listener (Triggers automatically upon successful OS purchase)
        const purchaseUpdateSubscription = IAP.purchaseUpdatedListener(async (purchase) => {
            const receipt = purchase.transactionReceipt || purchase.purchaseToken;
            
            if (receipt) {
                try {
                    // A. Send payload to Backend for secure verification
                    const payload = {
                        userId,
                        productId: purchase.productId,
                        purchaseToken: purchase.purchaseToken || purchase.transactionReceipt,
                        transactionId: purchase.transactionId || purchase.originalTransactionIdIOS,
                        transactionDate: purchase.transactionDate,
                        packageName: Platform.OS === 'android' ? 'com.yugma.dating' : undefined,
                    };

                    const response = await axiosInstance.post('/subscription/verify', payload);

                    if (response.status === 200 || response.status === 201) {
                        console.log('Secure verification success on backend.');
                        
                        // B. Critical step: Finish transaction to tell Google/Apple payment is fully consumed
                        // isConsumable is false for subscriptions and non-consumables
                        await IAP.finishTransaction({ purchase, isConsumable: false });
                    } else {
                        console.error('Backend validation failed. Transaction left unfinished.');
                    }
                } catch (err) {
                    console.error('API Verification error:', err);
                }
            }
        });

        // 3. Purchase Error Listener
        const purchaseErrorSubscription = IAP.purchaseErrorListener((error) => {
            console.warn('purchaseErrorListener', error);
        });

        return () => {
            purchaseUpdateSubscription.remove();
            purchaseErrorSubscription.remove();
            IAP.endConnection();
        };
    }, [userId]);
};
```

---

## 5. Backend (BE) Architecture & Verification

> [!CAUTION]
> **Never trust client-side transaction results!**
> Clients can be manipulated via jailbroken devices, proxy interceptors, or local IAP simulator cracks (like LocalAPStore). You **must** verify the receipt directly with Apple and Google servers from your backend server.

### 📤 What to Send to the Backend & Why

Your Mobile client must send the following payload to `POST /subscription/verify`:

```json
{
  "userId": "usr_9823472",
  "productId": "premium",
  "purchaseToken": "gpa.3374-2937-2938-19238",
  "transactionId": "100000029382103",
  "packageName": "com.yugma.dating",
  "basePlan": "monthly"
}
```

- **`userId`**: Maps the premium privileges to a specific account in your database.
- **`purchaseToken` / `transactionReceipt`**: The core cryptographic token issued by Google/Apple. Your backend uses this token to query the stores directly.
- **`productId`**: Tells the backend what product line is being purchased.
- **`packageName` (Android) / `bundleId` (iOS)**: Required by store verify APIs to ensure the receipt belongs to your specific application.
- **`basePlan` / `offerToken`**: Specifically needed in Google Play V2 to map whether the user purchased the Weekly, Monthly, or Yearly tier.

---

### 🛡️ Backend Verification Workflow

```mermaid
graph TD
    A[Client sends Receipt Payload] --> B{Determine OS}
    B -->|Android| C[Call Google Publisher API]
    B -->|iOS| D[Call App Store Server API / JWT]
    
    C --> E{Google status code == 200?}
    D --> F{Apple status code == 200?}
    
    E -->|Yes| G[Check expiryTimeMillis > Date.now()]
    F -->|Yes| H[Check expiresDate > Date.now()]
    
    G -->|Valid| I[Activate Premium in DB]
    H -->|Valid| I
    
    G -->|Expired/Invalid| J[Return Error & Reject]
    H -->|Expired/Invalid| J
```

#### 🤖 For Google Play Billing (Node.js Example)
Use the official `googleapis` library on your backend:

```javascript
const { google } = require('googleapis');

const auth = new google.auth.GoogleAuth({
  keyFile: './path-to-your-service-account-key.json', // Service Account JSON from Google Cloud Console
  scopes: ['https://www.googleapis.com/auth/androidpublisher'],
});

const androidpublisher = google.androidpublisher({
  version: 'v3',
  auth: auth,
});

async function verifyGoogleSubscription(packageName, subscriptionId, purchaseToken) {
  try {
    const res = await androidpublisher.purchases.subscriptions.get({
      packageName: packageName,      // e.g., 'com.yugma.dating'
      subscriptionId: subscriptionId,  // e.g., 'premium'
      token: purchaseToken,           // The purchaseToken from client
    });

    const paymentState = res.data.paymentState; // 1 = Payment Received, 0 = Pending/Trial
    const expiryTime = parseInt(res.data.expiryTimeMillis, 10);

    if (expiryTime > Date.now()) {
      return {
        isValid: true,
        expiryDate: new Date(expiryTime),
        originalTransactionId: res.data.orderId,
      };
    }
    return { isValid: false, reason: 'Subscription Expired' };
  } catch (error) {
    console.error('Google Verification Error:', error);
    return { isValid: false, error };
  }
}
```

#### 🍏 For Apple App Store Billing (Node.js Example)
Use the App Store Server API (preferred over the deprecated `/verifyReceipt` endpoint):

```javascript
const jwt = require('jsonwebtoken');
const axios = require('axios');

// Create a JWT to authenticate with Apple App Store Server API
function generateAppleToken() {
  const privateKey = '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQD...'; // From App Store Connect
  const keyId = 'KEY_ID'; 
  const issuerId = 'ISSUER_UUID';
  const bundleId = 'com.yugma.dating';

  const token = jwt.sign({}, privateKey, {
    algorithm: 'ES256',
    keyid: keyId,
    issuer: issuerId,
    audience: 'appstoreconnect-v1',
    expiresIn: '10m',
  });
  return token;
}

async function verifyAppleTransaction(transactionId) {
  const token = generateAppleToken();
  const environment = 'Sandbox'; // Switch to 'Production' for live builds
  const url = `https://api.storekit.itunes.apple.com/inApps/v1/subscriptions/${transactionId}`; // App Store Server API URL
  
  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // The response contains signed transactions inside a JWS (JSON Web Signature)
    const signedData = response.data.data[0].lastTransactions[0].signedTransactionInfo;
    const decodedTransaction = jwt.decode(signedData); // Decode Apple's JWS format

    const expiryTime = decodedTransaction.expiresDate;

    if (expiryTime > Date.now()) {
      return {
        isValid: true,
        expiryDate: new Date(expiryTime),
        originalTransactionId: decodedTransaction.originalTransactionId,
      };
    }
    return { isValid: false, reason: 'Apple Subscription Expired' };
  } catch (error) {
    console.error('Apple Server API Error:', error);
    return { isValid: false, error };
  }
}
```

---

### 🗄️ Database Architecture
Your Database should decouple **Purchases/Transactions** (the record of money changing hands) from the **Active Subscription Status** (what the user actually has access to).

#### 1. `users` Table Updates
```sql
ALTER TABLE users ADD COLUMN is_premium BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN premium_expires_at TIMESTAMP NULL;
```

#### 2. `transactions` Table (Audit log for every purchase attempted/completed)
```sql
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    store VARCHAR(10) NOT NULL,            -- 'google' or 'apple'
    product_id VARCHAR(100) NOT NULL,      -- 'premium' or basePlan
    transaction_id VARCHAR(255) UNIQUE,     -- orderId or transactionId from stores
    purchase_token TEXT NOT NULL,          -- purchaseToken or JWS receipt
    status VARCHAR(50) NOT NULL,           -- 'SUCCESS', 'REFUNDED', 'PENDING'
    amount DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 3. `user_subscriptions` Table (Tracks the active duration)
```sql
CREATE TABLE user_subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    store VARCHAR(10) NOT NULL,
    original_transaction_id VARCHAR(255) UNIQUE,
    current_transaction_id VARCHAR(255),
    expires_at TIMESTAMP NOT NULL,
    auto_renew BOOLEAN DEFAULT TRUE,
    raw_status TEXT,                       -- JSON details from store verification API
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 6. Testing: From Scratch to Production

Testing must be done methodically. You cannot complete live transactions in local development or emulators using standard setups.

### 🤖 Android Testing Strategy
1. **Prepare a Signed Build**:
   - Create a signed Release build (AAB format) with billing permission, and upload it to an **Internal Testing Track** in the Google Play Console. You cannot test IAP on Google Play without uploading the build at least once.
2. **Add License Testers**:
   - Go to Google Play Console ➡️ **Setup** ➡️ **License Testing**.
   - Add your tester's Gmail address.
   - Set **License response** to `RESPOND_NORMALLY` (allows standard flows).
3. **Set Up Tester Account on Device**:
   - Add the tester’s Gmail account to your Android test device.
   - Open Play Store on the device and make sure that this email is the primary account.
4. **Trigger Billing Flow**:
   - Build the app on your device or emulator. When you trigger a purchase, the Google Play dialog will show **"Test Card, always approves"** or **"Slow test card (takes 5 minutes)"**. No real money will be charged.
5. **Subscription Speed-Up**:
   - In Sandbox testing, subscriptions are heavily accelerated so you can verify expiration, renewal, and grace periods:
     - 1 week = 3 minutes
     - 1 month = 5 minutes
     - 1 year = 30 minutes

---

### 🍏 iOS Testing Strategy (Sandbox)
1. **Set Up Sandbox Testers**:
   - Go to App Store Connect ➡️ **Users and Access** ➡️ **Sandbox Testers**.
   - Create a tester profile using a real email format (you can use sub-addressing, e.g., `test+apple@yugma.com`). You will need to verify the email.
2. **Logged-in Sandbox Account on Device**:
   - **Do not** log out of your personal Apple ID in your iPhone settings.
   - Instead, go to iPhone Settings ➡️ **App Store** ➡️ Scroll down to the bottom to **Sandbox Account**.
   - Sign in with your Sandbox Tester account credentials here.
3. **Testing on Simulators vs Devices**:
   - *Simulator*: Standard React Native iOS simulators support calling StoreKit, but they do **not** simulate receipt updates or secure server verify cycles reliably.
   - *Real Device (Highly Recommended)*: Always test IAP on a physical iPhone connected via Xcode. It correctly requests sandbox receipts and parses transaction listeners.
4. **Sandbox Settings on iOS 14+**:
   - Under iPhone Settings ➡️ **App Store** ➡️ **Sandbox Account**, you can click into your test account to manage active subscriptions, force cancellations, or change the renewal speed (e.g., speed up 1 month to 5 minutes) to verify renewal logic.

---

## 7. Production Checklist: Going Live

Before you submit your application to Apple and Google for public release, make sure to execute this final checklist:

- [ ] **Paid Agreements Active**: Verify App Store Connect ➡️ Agreements, Tax, and Banking is in the "Active" status. If "Pending User Info" or "Awaiting Agreement", iOS products will return empty arrays on `getSubscriptions()`.
- [ ] **IAP Review Submission**: In App Store Connect, ensure you attach your new In-App Purchases / Subscriptions to the App Store Release Version before sending it to review. If you don't attach them, Apple's App Reviewers will see an empty plan screen and **reject** your app.
- [ ] **Enable Real Server URLs**: Ensure your backend API targets Google's production endpoints and Apple's production URL (`https://api.storekit.itunes.apple.com/`) rather than the sandbox environments.
- [ ] **Implement Server Webhooks (Store Notifications)**: Configure Play Console Real-Time Developer Notifications (RTDN) and App Store Server Notifications. If a user cancels, upgrades, or disputes a subscription via their OS system settings, you must listen to these webhooks to update your DB state; otherwise, they will retain premium features forever for free.
- [ ] **Restore Purchase Button**: Ensure your premium subscription screens have a clear, functional "Restore Purchase" button. Apple guidelines explicitly reject apps that do not provide a path for users to restore their previously purchased premium status on a new device.
