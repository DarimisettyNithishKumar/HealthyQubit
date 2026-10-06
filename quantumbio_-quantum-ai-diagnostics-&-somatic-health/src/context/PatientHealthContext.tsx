import React, { createContext, useContext, useState, useEffect } from 'react';
import { PatientProfile, DiagnosticRecord, PreferredPractice } from '../types';
import { auth, savePatientProfileToCloud, loadPatientProfileFromCloud } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface PatientHealthContextType {
  profile: PatientProfile;
  diagnosticHistory: DiagnosticRecord[];
  preferredPractices: PreferredPractice[];
  bookmarkedFoods: string[];
  isCloudSynced: boolean;
  addDiagnosticRecord: (record: Omit<DiagnosticRecord, 'id' | 'date'>) => void;
  deleteDiagnosticRecord: (id: string) => void;
  toggleFavoritePractice: (asanaId: string) => void;
  logCompletedPractice: (asanaId: string, durationMinutes: number) => void;
  toggleBookmarkFood: (foodName: string) => void;
  updateProfile: (partial: Partial<PatientProfile>) => void;
  resetToDefaults: () => void;
  syncWithCloud: () => Promise<void>;
}

const DEFAULT_PROFILE: PatientProfile = {
  patientId: 'QB-72941-EHR',
  name: 'Alex Chen',
  age: 34,
  occupation: 'Lead Solutions Architect (MNC Enterprise)',
  bloodGroup: 'O+ Rh-Positive',
  quantumBioResonanceScore: 89,
  cellularInflammationHsCRP: '1.2 mg/L (Optimal Homeostasis)',
  cervicalLoadKg: 21.4,
  hrvRestingMs: 64,
  complianceRatePercent: 94,
};

const DEFAULT_DIAGNOSTICS: DiagnosticRecord[] = [
  {
    id: 'diag-001',
    date: '2026-10-04',
    bodyPart: 'Cervical Spine & Trapezius',
    symptoms: 'Postural neck rigidity, bilateral upper trapezius spasm, forward-head translation (+21kg shear).',
    severity: 'Moderate',
    diagnosis: 'Upper Crossed Syndrome & C5-C6 Facet Hyper-mobility Strain',
    confidence: 0.96,
    prescribedAsana: 'Griva Shakti Vikasaka & Gomukhasana Arms',
    prescribedFoods: ['Fresh Turmeric Root with Black Pepper', 'Type-I & III Collagen Peptides'],
    quantumEnergyHartree: -128.452,
    status: 'Active Protocol',
  },
  {
    id: 'diag-002',
    date: '2026-09-28',
    bodyPart: 'Lumbar Spine & Sacroiliac Axis',
    symptoms: 'Deep dull ache over L4-S1 after 8-hour sprint review sitting, morning stiffness.',
    severity: 'Moderate',
    diagnosis: 'Axial Lumbar Disc Desiccation & Multifidus Spindle Inhibition',
    confidence: 0.94,
    prescribedAsana: 'Supta Matsyendrasana (Supine Twist)',
    prescribedFoods: ['Boswellia Serrata (AKBA 65%)', 'Grass-Fed Bovine Colostrum'],
    quantumEnergyHartree: -134.120,
    status: 'Completed',
  },
  {
    id: 'diag-003',
    date: '2026-09-15',
    bodyPart: 'Cranial & Neural Hub',
    symptoms: 'Bilateral tension headache, visual strain, elevated sympathetic overdrive.',
    severity: 'Mild',
    diagnosis: 'Tension Cephalalgia with Suboccipital Trigger Points',
    confidence: 0.98,
    prescribedAsana: 'Shashankasana & Bhramari Pranayama',
    prescribedFoods: ['Wild Blueberries & Dark Cacao Flavanols', 'Magnesium L-Threonate'],
    quantumEnergyHartree: -118.910,
    status: 'Completed',
  },
];

const DEFAULT_PRACTICES: PreferredPractice[] = [
  {
    id: 'pref-1',
    asanaId: 'neck',
    sanskrit: 'Griva Shakti Vikasaka & Gomukhasana',
    english: 'Cervical Articulation & Cow Face Arms',
    targetRegion: 'Cervical Spine & Trapezius',
    durationMinutes: 4,
    sessionsCompleted: 14,
    totalMinutes: 56,
    isFavorite: true,
    lastPracticedDate: '2026-10-05',
    intensity: 'Moderate',
  },
  {
    id: 'pref-2',
    asanaId: 'back',
    sanskrit: 'Supta Matsyendrasana',
    english: 'Supine Decompression Twist',
    targetRegion: 'Lumbar Spine & Sacroiliac Axis',
    durationMinutes: 5,
    sessionsCompleted: 18,
    totalMinutes: 90,
    isFavorite: true,
    lastPracticedDate: '2026-10-04',
    intensity: 'Gentle',
  },
  {
    id: 'pref-3',
    asanaId: 'head',
    sanskrit: 'Shashankasana & Bhramari',
    english: 'Hare Pose with Humming Vagal Resonance',
    targetRegion: 'Cranial & Neural Hub',
    durationMinutes: 3,
    sessionsCompleted: 9,
    totalMinutes: 27,
    isFavorite: false,
    lastPracticedDate: '2026-10-02',
    intensity: 'Restorative',
  },
  {
    id: 'pref-4',
    asanaId: 'gut',
    sanskrit: 'Pavanamuktasana & Visceral Twist',
    english: 'Wind-Relieving Visceral Peristaltic Pose',
    targetRegion: 'Abdominal Viscera & Enteric Core',
    durationMinutes: 4,
    sessionsCompleted: 7,
    totalMinutes: 28,
    isFavorite: true,
    lastPracticedDate: '2026-09-30',
    intensity: 'Gentle',
  },
];

const DEFAULT_BOOKMARKED_FOODS = [
  'Fresh Turmeric Root & Black Pepper (Curcumin + Piperine)',
  'Wild-Caught Sockeye Salmon (Omega-3 EPA/DHA)',
  'Boswellia Serrata (Frankincense Resin - AKBA 65%)',
  'Wild Blueberries & Dark Cacao Flavanols',
];

const PatientHealthContext = createContext<PatientHealthContextType | undefined>(undefined);

export const PatientHealthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<PatientProfile>(() => {
    try {
      const saved = localStorage.getItem('qb_patient_profile');
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [diagnosticHistory, setDiagnosticHistory] = useState<DiagnosticRecord[]>(() => {
    try {
      const saved = localStorage.getItem('qb_diagnostic_history');
      return saved ? JSON.parse(saved) : DEFAULT_DIAGNOSTICS;
    } catch {
      return DEFAULT_DIAGNOSTICS;
    }
  });

  const [preferredPractices, setPreferredPractices] = useState<PreferredPractice[]>(() => {
    try {
      const saved = localStorage.getItem('qb_preferred_practices');
      return saved ? JSON.parse(saved) : DEFAULT_PRACTICES;
    } catch {
      return DEFAULT_PRACTICES;
    }
  });

  const [bookmarkedFoods, setBookmarkedFoods] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('qb_bookmarked_foods');
      return saved ? JSON.parse(saved) : DEFAULT_BOOKMARKED_FOODS;
    } catch {
      return DEFAULT_BOOKMARKED_FOODS;
    }
  });

  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(false);

  // Sync from Firestore when user signs in
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const cloudData = await loadPatientProfileFromCloud(user.uid);
          if (cloudData) {
            if (cloudData.simulatedVQEHistory && cloudData.simulatedVQEHistory.length > 0) {
              setDiagnosticHistory(cloudData.simulatedVQEHistory);
            }
            if (cloudData.preferredPractices && cloudData.preferredPractices.length > 0) {
              setPreferredPractices(cloudData.preferredPractices);
            }
            if (cloudData.bookmarkedFoods && cloudData.bookmarkedFoods.length > 0) {
              setBookmarkedFoods(cloudData.bookmarkedFoods);
            }
          }
          setIsCloudSynced(true);
        } catch (e) {
          console.warn('Could not load profile from Firestore:', e);
        }
      } else {
        setIsCloudSynced(false);
      }
    });

    return () => unsub();
  }, []);

  // Sync to Firestore on state change if user logged in
  const syncWithCloud = async () => {
    const user = auth.currentUser;
    if (user) {
      await savePatientProfileToCloud(user.uid, {
        simulatedVQEHistory: diagnosticHistory,
        preferredPractices,
        bookmarkedFoods,
      });
      setIsCloudSynced(true);
    }
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const timer = setTimeout(() => {
        savePatientProfileToCloud(user.uid, {
          simulatedVQEHistory: diagnosticHistory,
          preferredPractices,
          bookmarkedFoods,
        });
        setIsCloudSynced(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [diagnosticHistory, preferredPractices, bookmarkedFoods]);

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('qb_patient_profile', JSON.stringify(profile));
    } catch (e) {
      console.warn('Failed to save profile to localStorage', e);
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem('qb_diagnostic_history', JSON.stringify(diagnosticHistory));
    } catch (e) {
      console.warn('Failed to save history to localStorage', e);
    }
  }, [diagnosticHistory]);

  useEffect(() => {
    try {
      localStorage.setItem('qb_preferred_practices', JSON.stringify(preferredPractices));
    } catch (e) {
      console.warn('Failed to save practices to localStorage', e);
    }
  }, [preferredPractices]);

  useEffect(() => {
    try {
      localStorage.setItem('qb_bookmarked_foods', JSON.stringify(bookmarkedFoods));
    } catch (e) {
      console.warn('Failed to save foods to localStorage', e);
    }
  }, [bookmarkedFoods]);

  const addDiagnosticRecord = (record: Omit<DiagnosticRecord, 'id' | 'date'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newRecord: DiagnosticRecord = {
      ...record,
      id: `diag-${Date.now()}`,
      date: today,
    };
    setDiagnosticHistory((prev) => [newRecord, ...prev]);

    // Update compliance rate
    setProfile((prev) => ({
      ...prev,
      complianceRatePercent: Math.min(100, prev.complianceRatePercent + 1),
    }));
  };

  const deleteDiagnosticRecord = (id: string) => {
    setDiagnosticHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleFavoritePractice = (asanaId: string) => {
    setPreferredPractices((prev) =>
      prev.map((p) => (p.asanaId === asanaId ? { ...p, isFavorite: !p.isFavorite } : p))
    );
  };

  const logCompletedPractice = (asanaId: string, durationMinutes: number) => {
    const today = new Date().toISOString().split('T')[0];
    setPreferredPractices((prev) =>
      prev.map((p) => {
        if (p.asanaId === asanaId) {
          return {
            ...p,
            sessionsCompleted: p.sessionsCompleted + 1,
            totalMinutes: p.totalMinutes + durationMinutes,
            lastPracticedDate: today,
          };
        }
        return p;
      })
    );

    // Increase patient bio-resonance score slightly as reward
    setProfile((prev) => ({
      ...prev,
      quantumBioResonanceScore: Math.min(99, prev.quantumBioResonanceScore + 1),
      hrvRestingMs: Math.min(85, prev.hrvRestingMs + 1),
    }));
  };

  const toggleBookmarkFood = (foodName: string) => {
    setBookmarkedFoods((prev) =>
      prev.includes(foodName) ? prev.filter((f) => f !== foodName) : [...prev, foodName]
    );
  };

  const updateProfile = (partial: Partial<PatientProfile>) => {
    setProfile((prev) => ({ ...prev, ...partial }));
  };

  const resetToDefaults = () => {
    setProfile(DEFAULT_PROFILE);
    setDiagnosticHistory(DEFAULT_DIAGNOSTICS);
    setPreferredPractices(DEFAULT_PRACTICES);
    setBookmarkedFoods(DEFAULT_BOOKMARKED_FOODS);
    localStorage.removeItem('qb_patient_profile');
    localStorage.removeItem('qb_diagnostic_history');
    localStorage.removeItem('qb_preferred_practices');
    localStorage.removeItem('qb_bookmarked_foods');
  };

  return (
    <PatientHealthContext.Provider
      value={{
        profile,
        diagnosticHistory,
        preferredPractices,
        bookmarkedFoods,
        isCloudSynced,
        addDiagnosticRecord,
        deleteDiagnosticRecord,
        toggleFavoritePractice,
        logCompletedPractice,
        toggleBookmarkFood,
        updateProfile,
        resetToDefaults,
        syncWithCloud,
      }}
    >
      {children}
    </PatientHealthContext.Provider>
  );
};

export const usePatientHealth = () => {
  const context = useContext(PatientHealthContext);
  if (!context) {
    throw new Error('usePatientHealth must be used within a PatientHealthProvider');
  }
  return context;
};
