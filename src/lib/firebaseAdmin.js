import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

const rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
let serviceAccount;
if (rawServiceAccount) {
  try {
    serviceAccount = JSON.parse(rawServiceAccount);
  } catch {
    serviceAccount = undefined;
  }
}

const projectId = serviceAccount?.project_id || process.env.FIREBASE_PROJECT_ID;
const clientEmail = serviceAccount?.client_email || process.env.FIREBASE_CLIENT_EMAIL;
const privateKeySource = serviceAccount?.private_key || process.env.FIREBASE_PRIVATE_KEY || '';
const privateKey = privateKeySource.replace(/\\n/g, '\n');

const storageBucket =
  (
    process.env.STORAGEBUCKET ||
    process.env.FIREBASE_STORAGE_BUCKET ||
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    process.env.NEXT_PUBLIC_STORAGEBUCKET ||
    ''
  ).trim() || undefined;

const hasServiceAccount = Boolean(projectId && clientEmail && privateKey);

const adminConfig = {
  ...(hasServiceAccount
    ? {
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      }
    : projectId
    ? { projectId }
    : {}),
  ...(storageBucket ? { storageBucket } : {}),
};

const adminApp = getApps().length ? getApps()[0] : initializeApp(adminConfig);

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
export const adminStorage = getStorage(adminApp);
