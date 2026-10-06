import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  getDocFromServer,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  onSnapshot
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Firestore with configured database ID
export const db = getFirestore(
  app, 
  firebaseConfig.firestoreDatabaseId || '(default)'
);

// Connection test as required by skill guidelines
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('[Firebase] Connection verified successfully.');
    return true;
  } catch (error: any) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[Firebase] Client is offline or database initializing.');
    }
    return false;
  }
}

// Auto-run connection test on module evaluation
testFirestoreConnection();

// Google Sign-In helper
export async function signInWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Upsert user profile to Firestore
    if (user) {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Patient',
        photoURL: user.photoURL || '',
        lastLogin: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }

    return user;
  } catch (error: any) {
    console.error('[Firebase] Sign-in error:', error);
    throw error;
  }
}

// Sign-Out helper
export async function signOutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('[Firebase] Sign-out error:', error);
    throw error;
  }
}

// Sync Patient Health Record to Firestore
export async function savePatientProfileToCloud(userId: string, data: {
  simulatedVQEHistory: any[];
  preferredPractices: any[];
  bookmarkedFoods: string[];
}): Promise<void> {
  if (!userId) return;
  try {
    const profileRef = doc(db, 'users', userId, 'healthProfile', 'current');
    await setDoc(profileRef, {
      userId,
      simulatedVQEHistory: JSON.stringify(data.simulatedVQEHistory),
      preferredPractices: JSON.stringify(data.preferredPractices),
      bookmarkedFoods: JSON.stringify(data.bookmarkedFoods),
      recentDiagnosticCount: data.simulatedVQEHistory.length,
      lastUpdated: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error('[Firebase] Failed to save patient profile to cloud:', error);
  }
}

// Load Patient Health Record from Firestore
export async function loadPatientProfileFromCloud(userId: string): Promise<{
  simulatedVQEHistory?: any[];
  preferredPractices?: any[];
  bookmarkedFoods?: string[];
} | null> {
  if (!userId) return null;
  try {
    const profileRef = doc(db, 'users', userId, 'healthProfile', 'current');
    const snap = await getDoc(profileRef);
    if (snap.exists()) {
      const d = snap.data();
      return {
        simulatedVQEHistory: d.simulatedVQEHistory ? JSON.parse(d.simulatedVQEHistory) : undefined,
        preferredPractices: d.preferredPractices ? JSON.parse(d.preferredPractices) : undefined,
        bookmarkedFoods: d.bookmarkedFoods ? JSON.parse(d.bookmarkedFoods) : undefined,
      };
    }
  } catch (error) {
    console.error('[Firebase] Failed to load patient profile from cloud:', error);
  }
  return null;
}
