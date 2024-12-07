import { initializeApp, getApps, cert } from 'firebase-admin/app';

const getFirebaseAdminApp = () => {
    if (getApps().length > 0) {
        return getApps()[0];
    }

    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
    const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;

    if (!privateKey || !projectId || !clientEmail) {
        throw new Error('Firebase Admin credentials are missing. Check your environment variables.');
    }

    const firebaseAdminConfig = {
        credential: cert({
            projectId,
            clientEmail,
            privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
    };

    try {
        return initializeApp(firebaseAdminConfig);
    } catch (error) {
        console.error('Error initializing Firebase Admin:', error);
        throw error;
    }
};

export const adminApp = getFirebaseAdminApp(); 