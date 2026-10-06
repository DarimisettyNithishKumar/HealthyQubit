import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  User, 
  Activity, 
  Calendar, 
  Layers, 
  Printer, 
  Sparkles,
  Save,
  Check,
  AlertCircle
} from 'lucide-react';
import { usePatientHealth } from '../context/PatientHealthContext';
import { useAuth } from '../context/AuthContext';
import { generateConsultationPdf, ConsultationPdfOptions } from '../utils/generateConsultationPdf';
import { db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

interface ConsultationReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConsultationReportModal: React.FC<ConsultationReportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { profile, diagnosticHistory, preferredPractices, bookmarkedFoods } = usePatientHealth();
  const { currentUser, isAuthenticated } = useAuth();

  const [scope, setScope] = useState<'full' | 'diagnostics' | 'therapy'>('full');
  const [doctorName, setDoctorName] = useState<string>('Dr. Sarah Jenkins, MD - Orthopedic & Somatic Medicine');
  const [consultationNotes, setConsultationNotes] = useState<string>(
    'Patient presents with recurrent forward-head posture and postural cervicothoracic shear. Prescribed targeted somatosensory yoga asana decompression and anti-inflammatory nutraceutical co-factors.'
  );
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [savedToCloud, setSavedToCloud] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleDownloadPdf = async () => {
    setIsGenerating(true);
    try {
      const options: ConsultationPdfOptions = {
        profile,
        diagnosticHistory,
        preferredPractices,
        bookmarkedFoods,
        referringDoctor: doctorName,
        consultationNotes,
        scope,
      };

      const docPdf = generateConsultationPdf(options);
      const filename = `QuantumBio_Consultation_Report_${profile.patientId}_${new Date().toISOString().split('T')[0]}.pdf`;
      docPdf.save(filename);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);

      // Save report metadata to Firestore if user logged in
      if (currentUser) {
        const reportId = `rep-${Date.now()}`;
        await setDoc(doc(db, 'users', currentUser.uid, 'reports', reportId), {
          reportId,
          userId: currentUser.uid,
          doctorName,
          generatedAt: new Date().toISOString(),
          diagnosticCount: diagnosticHistory.length,
          therapyPlanScope: scope,
          complianceRate: profile.complianceRatePercent,
          patientId: profile.patientId,
        });
        setSavedToCloud(true);
        setTimeout(() => setSavedToCloud(false), 3500);
      }
    } catch (err) {
      console.error('PDF Generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 sm:p-7 space-y-6 shadow-2xl animate-fadeIn max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-teal-400 uppercase tracking-wider">
                <span>PROFESSIONAL CONSULTATION DOSSIER</span>
                <span aria-hidden="true">·</span>
                <span>VECTOR PDF ENGINE</span>
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Export Patient Diagnostic History & Therapy Plan
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {downloadSuccess && (
          <div className="p-3 bg-emerald-950/40 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Consultation PDF successfully downloaded to your device!</span>
          </div>
        )}

        {savedToCloud && (
          <div className="p-3 bg-teal-950/40 border border-teal-500/50 rounded-xl text-xs text-teal-300 flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4 text-teal-400 shrink-0" />
            <span>Report metadata archived to your Firestore patient cloud profile.</span>
          </div>
        )}

        {/* Scope Selector */}
        <div>
          <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-2 font-semibold">
            SELECT REPORT SCOPE:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => setScope('full')}
              className={`p-3 rounded-xl border text-left transition-all ${
                scope === 'full'
                  ? 'bg-teal-500/20 text-teal-300 border-teal-500/60 shadow-md'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <div className="font-semibold text-xs text-white mb-0.5">Comprehensive Dossier</div>
              <div className="text-[11px] text-slate-400">All diagnostics, therapy plan, vitals & foods</div>
            </button>

            <button
              type="button"
              onClick={() => setScope('diagnostics')}
              className={`p-3 rounded-xl border text-left transition-all ${
                scope === 'diagnostics'
                  ? 'bg-teal-500/20 text-teal-300 border-teal-500/60 shadow-md'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <div className="font-semibold text-xs text-white mb-0.5">Diagnostic History</div>
              <div className="text-[11px] text-slate-400">Clinical timeline, Hartree energies & findings</div>
            </button>

            <button
              type="button"
              onClick={() => setScope('therapy')}
              className={`p-3 rounded-xl border text-left transition-all ${
                scope === 'therapy'
                  ? 'bg-teal-500/20 text-teal-300 border-teal-500/60 shadow-md'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <div className="font-semibold text-xs text-white mb-0.5">Therapy Plan Only</div>
              <div className="text-[11px] text-slate-400">Prescribed asanas, holding cadences & targets</div>
            </button>
          </div>
        </div>

        {/* Clinician & Consultation Notes Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1.5 font-semibold">
              ATTENDING / REFERRING CLINICIAN:
            </label>
            <input
              type="text"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-400"
              placeholder="e.g. Dr. Jane Smith, MD - Spine & Orthopedics"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1.5 font-semibold">
              CONSULTATION PURPOSE:
            </label>
            <input
              type="text"
              value={consultationNotes}
              onChange={(e) => setConsultationNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-400"
              placeholder="Case summary or referral reason"
            />
          </div>
        </div>

        {/* Document Overview Summary Box */}
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
          <span className="text-[11px] font-mono text-teal-400 uppercase tracking-wider block font-semibold">
            DOCUMENT CONTENT PREVIEW:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div>
              <span className="text-[10px] text-slate-500 block">PATIENT</span>
              <span className="text-slate-200 font-bold">{profile.name}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">DIAGNOSTIC ENTRIES</span>
              <span className="text-slate-200 font-bold">{diagnosticHistory.length} Recorded</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">THERAPY PROTOCOLS</span>
              <span className="text-slate-200 font-bold">{preferredPractices.length} Prescribed</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">FORMAT</span>
              <span className="text-teal-400 font-bold">Standard A4 Vector PDF</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-800/80 pt-2.5">
            The generated document includes an official medical letterhead, HIPAA-grade security statement, chronological diagnostic timeline with variational quantum Hartree energy values, prescribed yoga posture biomechanics, contraindications, and specialist signature attestation line.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <span className="text-[11px] text-slate-400 font-mono">
            {isAuthenticated ? '✓ Cloud Sync to Firestore Active' : 'Offline / Local EHR Mode'}
          </span>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isGenerating}
              className="w-full sm:w-auto px-5 py-2.5 bg-teal-400 hover:bg-teal-300 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 shrink-0"
            >
              {isGenerating ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Compiling PDF Document...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Consultation PDF Report</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
