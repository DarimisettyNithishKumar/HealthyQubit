export type BodyRegion = 
  | 'head'
  | 'neck'
  | 'chest'
  | 'shoulders'
  | 'back'
  | 'gut'
  | 'pelvis'
  | 'knees'
  | 'feet';

export interface YogaAsana {
  sanskrit: string;
  english: string;
  durationSeconds: number;
  breathingRatio: string;
  steps: string[];
  biomechanicalAction: string;
  contraindications: string[];
  clinicalRationale: string;
  intensity: 'Gentle' | 'Moderate' | 'Restorative' | 'Dynamic';
  doshaAlignment?: string;
}

export interface SecondaryAsana {
  name: string;
  target: string;
  duration: string;
}

export interface InnerMuscle {
  name: string;
  latinName: string;
  action: string;
  triggerPoints: string;
  fiberType: string;
}

export interface InnerJoint {
  name: string;
  jointType: string;
  cartilageTissue: string;
  mechanicalVulnerability: string;
}

export interface InnerNerve {
  name: string;
  roots: string;
  pathways: string;
  somaticSymptoms: string;
}

export interface InnerStructure {
  muscles: InnerMuscle[];
  joints: InnerJoint[];
  nerves: InnerNerve[];
  quantumFascialTension: string;
  atpEfficiencyRate: string;
}

export interface HealingFood {
  name: string;
  category: 'Anti-inflammatory' | 'Tissue Repair' | 'Neuro-modulator' | 'Antioxidant' | 'Digestive Agni';
  bioactiveCompounds: string;
  mechanism: string;
  quantumNutrientResonance: string;
  prepAndTiming: string;
  doshaEffect: string;
}

export interface QuantumSynergy {
  synergyScore: string;
  combinedMechanism: string;
  cellularOutcome: string;
}

export interface QuantumMetrics {
  vqeConvergenceIter: number;
  groundStateEnergyHartree: number;
  cytokineSuppressionIndex: string;
  cellularAtpFluxRatio: string;
  freeRadicalScavengingTau: string;
}

export interface DiagnosticResult {
  diagnosticSummary: string;
  confidenceScore: number;
  probableEtiologies: string[];
  quantumBiomarkerMechanisms: string;
  quantumMetrics: QuantumMetrics;
  primaryAsana: YogaAsana;
  secondaryAsanas: SecondaryAsana[];
  ergonomicAndLifestyleInterventions: string[];
  urgentRedFlags: string[];
}

export interface InnerStructureKeyPoint {
  label: string;
  x: number; // percentage
  y: number; // percentage
  description: string;
}

export interface BodyPartData {
  id: BodyRegion;
  label: string;
  anatomicalArea: string;
  commonIssues: string[];
  quantumTarget: string;
  primaryAsana: YogaAsana;
  secondaryAsanas: SecondaryAsana[];
  innerStructure: InnerStructure;
  healingFoods: HealingFood[];
  quantumSynergy: QuantumSynergy;
  anteriorCoordinates: { x: number; y: number };
  posteriorCoordinates: { x: number; y: number };
  innerStructureImage?: string;
  innerStructureKeyPoints?: InnerStructureKeyPoint[];
}

export interface DiagnosticRecord {
  id: string;
  date: string;
  bodyPart: string;
  symptoms: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
  diagnosis: string;
  confidence: number;
  prescribedAsana: string;
  prescribedFoods: string[];
  quantumEnergyHartree: number;
  status: 'Completed' | 'Active Protocol' | 'Under Review';
}

export interface PreferredPractice {
  id: string;
  asanaId: string;
  sanskrit: string;
  english: string;
  targetRegion: string;
  durationMinutes: number;
  sessionsCompleted: number;
  totalMinutes: number;
  isFavorite: boolean;
  lastPracticedDate: string;
  intensity: string;
}

export interface PatientProfile {
  patientId: string;
  name: string;
  age: number;
  occupation: string;
  bloodGroup: string;
  quantumBioResonanceScore: number;
  cellularInflammationHsCRP: string;
  cervicalLoadKg: number;
  hrvRestingMs: number;
  complianceRatePercent: number;
}

export interface PresentationSlide {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  category: string;
  keyMetric: {
    value: string;
    label: string;
    context: string;
  };
  executiveSummary: string;
  bulletPoints: string[];
  speakerNotes: string;
}

export interface BiomarkerItem {
  id: string;
  name: string;
  category: 'Inflammatory Cytokines' | 'Metabolic & Glycemic' | 'Cardiovascular & Lipids' | 'Neuro-Endocrine & Stress' | 'Hepatic & Renal';
  value: number;
  unit: string;
  optimalMin: number;
  optimalMax: number;
  criticalThreshold: number;
  status: 'Optimal' | 'Borderline' | 'Elevated' | 'Critical';
  clinicalMeaning: string;
  somaticYogaProtocol: string;
  nutraceuticalRecommendation: string;
}

export interface RadiologyFinding {
  id: string;
  label: string;
  confidence: number;
  box: { x: number; y: number; width: number; height: number };
  hounsfieldUnits: number;
  tissueType: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
  pathologyNote: string;
  targetedAsanaDecompression: string;
}

export interface RadiologyStudy {
  id: string;
  title: string;
  modality: 'MRI' | 'CT' | 'X-Ray';
  anatomicalRegion: string;
  imageSrc: string;
  sliceInfo: string;
  patientIndication: string;
  findings: RadiologyFinding[];
  impression: string;
  recommendation: string;
}

export interface PharmacogenomicVariant {
  gene: string;
  variant: string;
  rsId: string;
  genotype: string;
  phenotype: string;
  impactScore: 'High Risk' | 'Moderate Caution' | 'Normal Function' | 'Enhanced Clearance';
  drugInteractions: string[];
  pathwayMechanism: string;
  epigeneticNutrigenomics: string;
  lifestyleGuidance: string;
}

export interface TelemetryVital {
  timestamp: string;
  heartRateBpm: number;
  hrvMs: number;
  glucoseMgDl: number;
  spo2Percent: number;
  systolicBp: number;
  diastolicBp: number;
  vagalToneRatio: number;
}

