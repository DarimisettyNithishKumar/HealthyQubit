import React, { useState } from 'react';
import { usePatientHealth } from '../context/PatientHealthContext';
import { BodyPartData } from '../types';
import { ANATOMY_CATALOG } from '../data/anatomyCatalog';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  Activity, 
  Heart, 
  Zap, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Trash2, 
  Star, 
  Bookmark, 
  Play, 
  Printer, 
  Sparkles, 
  Plus, 
  RotateCcw,
  Apple,
  Award,
  TrendingDown,
  BarChart2,
  Download,
  FileText
} from 'lucide-react';
import { QuantumEnergyAnalyticsDashboard } from './QuantumEnergyAnalyticsDashboard';
import { ConsultationReportModal } from './ConsultationReportModal';

interface PatientHealthProfileProps {
  onStartPractice: (region: BodyPartData) => void;
  onOpenNewDiagnostic: () => void;
}

export const PatientHealthProfile: React.FC<PatientHealthProfileProps> = ({
  onStartPractice,
  onOpenNewDiagnostic,
}) => {
  const {
    profile,
    diagnosticHistory,
    preferredPractices,
    bookmarkedFoods,
    deleteDiagnosticRecord,
    toggleFavoritePractice,
    logCompletedPractice,
    toggleBookmarkFood,
    resetToDefaults,
  } = usePatientHealth();

  const [activeTab, setActiveTab] = useState<'diagnostics' | 'energy-graph' | 'yoga' | 'nutrition' | 'quantum-ai'>('diagnostics');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [forecastLoading, setForecastLoading] = useState<boolean>(false);
  const [forecastResult, setForecastResult] = useState<string | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);

  const filteredHistory = diagnosticHistory.filter((item) => {
    return filterSeverity === 'all' || item.severity.toLowerCase() === filterSeverity.toLowerCase();
  });

  const handleRunAiForecast = () => {
    setForecastLoading(true);
    setTimeout(() => {
      setForecastLoading(false);
      setForecastResult(
        `Quantum predictive model predicts a 44.8% reduction in cervical myofascial strain and an increase of +12ms in vagal Heart Rate Variability over the next 21 days with continued compliance of ${profile.complianceRatePercent}%. Ground-state energy minimization remains optimal at -128.45 Hartree.`
      );
    }, 1200);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="patient-profile" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Security & Verification Ribbon */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8 shadow-xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          {/* Patient Bio & Cryptographic Badge */}
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
              <User className="w-7 h-7" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-xs font-mono px-2 py-0.5 bg-teal-500/20 text-teal-300 border border-teal-500/40 rounded flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>SECURE EHR ID: {profile.patientId}</span>
                </span>
                <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-500" />
                  <span>ENCRYPTED SOMATIC RECORD</span>
                </span>
              </div>

              <h2 className="text-2xl font-bold text-white tracking-tight">
                {profile.name}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                <span>{profile.occupation}</span>
                <span aria-hidden="true">·</span>
                <span>Age: {profile.age}</span>
                <span aria-hidden="true">·</span>
                <span>Blood: {profile.bloodGroup}</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
            <button
              onClick={() => setIsPdfModalOpen(true)}
              className="px-4 py-2 bg-teal-400 hover:bg-teal-300 text-slate-950 text-xs font-bold rounded-lg transition-all shadow-md shadow-teal-500/20 flex items-center gap-1.5"
              title="Generate downloadable PDF report of diagnostic history and recommended therapy plan"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Consultation PDF</span>
            </button>

            <button
              onClick={onOpenNewDiagnostic}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 border border-slate-700"
            >
              <Plus className="w-3.5 h-3.5 text-teal-400" />
              <span>New Diagnostic</span>
            </button>

            <button
              onClick={() => setIsPdfModalOpen(true)}
              className="px-3 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 border border-slate-700"
              title="Print or export consultation record"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={resetToDefaults}
              className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-colors"
              title="Reset profile data to clinical defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Biometric Quantum Health Vitals Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-6">
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">
              BIO-RESONANCE SCORE
            </span>
            <div className="text-2xl font-mono font-bold text-teal-400 tabular-nums mt-0.5">
              {profile.quantumBioResonanceScore}/100
            </div>
            <span className="text-[10px] text-teal-500/90 font-mono">Quantum Coherent</span>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">
              CELLULAR INFLAMMATION
            </span>
            <div className="text-base font-semibold text-white mt-1 truncate">
              {profile.cellularInflammationHsCRP.split('(')[0]}
            </div>
            <span className="text-[10px] text-emerald-400 font-mono">hsCRP Low Risk</span>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">
              CERVICAL LOAD TORQUE
            </span>
            <div className="text-2xl font-mono font-bold text-white tabular-nums mt-0.5">
              {profile.cervicalLoadKg} kg
            </div>
            <span className="text-[10px] text-amber-400 font-mono">Ergonomic Shear</span>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">
              RESTING HRV METRIC
            </span>
            <div className="text-2xl font-mono font-bold text-cyan-300 tabular-nums mt-0.5">
              {profile.hrvRestingMs} ms
            </div>
            <span className="text-[10px] text-cyan-400 font-mono">Parasympathetic Bias</span>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">
              SOMATIC COMPLIANCE
            </span>
            <div className="text-2xl font-mono font-bold text-emerald-400 tabular-nums mt-0.5">
              {profile.complianceRatePercent}%
            </div>
            <span className="text-[10px] text-emerald-500/90 font-mono">High Adherence</span>
          </div>
        </div>
      </div>

      {/* Main Profile Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-6">
        <button
          onClick={() => setActiveTab('diagnostics')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'diagnostics'
              ? 'bg-teal-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Diagnostic History ({diagnosticHistory.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('energy-graph')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'energy-graph'
              ? 'bg-teal-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <TrendingDown className="w-3.5 h-3.5" />
          <span>Quantum Energy Graph</span>
        </button>

        <button
          onClick={() => setActiveTab('yoga')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'yoga'
              ? 'bg-teal-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>Preferred Yoga Practices ({preferredPractices.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('nutrition')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'nutrition'
              ? 'bg-teal-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Apple className="w-3.5 h-3.5" />
          <span>Saved Healing Foods ({bookmarkedFoods.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('quantum-ai')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'quantum-ai'
              ? 'bg-teal-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Quantum AI Trajectory</span>
        </button>
      </div>

      {/* TAB 1: DIAGNOSTIC HISTORY */}
      {activeTab === 'diagnostics' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              CLINICAL TRIAGE LOGS
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPdfModalOpen(true)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-teal-300 hover:text-white border border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                title="Download Diagnostic History & Therapy Plan as PDF"
              >
                <Download className="w-3 h-3 text-teal-400" />
                <span>Export PDF Report</span>
              </button>

              {/* Severity Filter */}
              <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
              {['all', 'mild', 'moderate', 'severe'].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setFilterSeverity(sev)}
                  className={`px-2.5 py-1 rounded capitalize transition-colors ${
                    filterSeverity === sev
                      ? 'bg-teal-500 text-slate-950 font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {sev}
                </button>
              ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {filteredHistory.map((rec) => (
              <div
                key={rec.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-teal-400 font-semibold">
                      {rec.date}
                    </span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="text-xs text-white font-medium">{rec.bodyPart}</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        rec.severity === 'Severe'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : rec.severity === 'Moderate'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-teal-950 text-teal-300 border border-teal-800'
                      }`}
                    >
                      {rec.severity}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">
                      VQE: {rec.quantumEnergyHartree} Ha
                    </span>
                    <span className="text-xs font-mono text-emerald-400 font-semibold">
                      {Math.round(rec.confidence * 100)}% Conf
                    </span>
                    <button
                      onClick={() => deleteDiagnosticRecord(rec.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition-colors ml-2"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white">{rec.diagnosis}</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    <span className="text-slate-400">Symptoms: </span>
                    {rec.symptoms}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-2.5 bg-slate-950/60 rounded border border-slate-800 text-xs">
                    <span className="text-teal-400 font-semibold block mb-0.5">
                      PRESCRIBED ASANA:
                    </span>
                    <span className="text-white">{rec.prescribedAsana}</span>
                  </div>

                  <div className="p-2.5 bg-slate-950/60 rounded border border-slate-800 text-xs">
                    <span className="text-cyan-400 font-semibold block mb-0.5">
                      NUTRACEUTICAL PROTOCOL:
                    </span>
                    <span className="text-slate-300">{rec.prescribedFoods.join(', ')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: QUANTUM ENERGY HARTREE RECHARTS GRAPH */}
      {activeTab === 'energy-graph' && (
        <div className="space-y-4">
          <QuantumEnergyAnalyticsDashboard />
        </div>
      )}

      {/* TAB 3: PREFERRED YOGA PRACTICES */}
      {activeTab === 'yoga' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              MY DAILY SOMATIC QUEUE
            </span>
            <span className="text-xs text-teal-400 font-mono">
              {preferredPractices.reduce((acc, curr) => acc + curr.totalMinutes, 0)} TOTAL MINUTES LOGGED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {preferredPractices.map((practice) => {
              const matchedRegion = ANATOMY_CATALOG.find((r) => r.id === practice.asanaId) || ANATOMY_CATALOG[1];

              return (
                <div
                  key={practice.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="text-[10px] font-mono text-teal-400 uppercase">
                          {practice.targetRegion}
                        </span>
                        <h4 className="text-base font-bold text-white mt-0.5">
                          {practice.sanskrit}
                        </h4>
                        <div className="text-xs text-slate-300 font-medium">
                          {practice.english}
                        </div>
                      </div>

                      <button
                        onClick={() => toggleFavoritePractice(practice.asanaId)}
                        className={`p-1.5 rounded transition-colors ${
                          practice.isFavorite ? 'text-amber-400' : 'text-slate-500 hover:text-white'
                        }`}
                        title={practice.isFavorite ? 'Starred' : 'Star practice'}
                      >
                        <Star className={`w-4 h-4 ${practice.isFavorite ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800 text-xs font-mono my-2 text-center">
                      <div>
                        <span className="text-[10px] text-slate-400 block">SESSIONS</span>
                        <span className="font-semibold text-white">{practice.sessionsCompleted}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">TOTAL MINS</span>
                        <span className="font-semibold text-teal-300">{practice.totalMinutes}m</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">LAST DONE</span>
                        <span className="text-slate-300 text-[11px]">{practice.lastPracticedDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => onStartPractice(matchedRegion)}
                      className="flex-1 py-2 bg-teal-400 hover:bg-teal-300 text-slate-950 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Start Guided Session</span>
                    </button>

                    <button
                      onClick={() => logCompletedPractice(practice.asanaId, practice.durationMinutes)}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition-colors border border-slate-700"
                      title="Log completed session"
                    >
                      <span>+Log Done</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: SAVED HEALING FOODS */}
      {activeTab === 'nutrition' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              BOOKMARKED BIO-ACTIVE HEALING FOODS
            </span>
            <span className="text-xs text-slate-400 font-mono">{bookmarkedFoods.length} ITEMS SAVED</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookmarkedFoods.map((foodName, idx) => (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
                    <Apple className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">{foodName}</h5>
                    <span className="text-[11px] text-teal-300 font-mono">
                      Targeted Bioactive Nutraceutical
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => toggleBookmarkFood(foodName)}
                  className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Remove from saved foods"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: QUANTUM AI RECOVERY TRAJECTORY FORECAST */}
      {activeTab === 'quantum-ai' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-teal-400 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>HAMILTONIAN CELLULAR REJUVENATION PREDICTOR</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                Quantum AI Somatic Recovery Trajectory
              </h3>
            </div>

            <button
              onClick={handleRunAiForecast}
              disabled={forecastLoading}
              className="px-4 py-2 bg-teal-400 hover:bg-teal-300 disabled:bg-slate-800 text-slate-950 font-semibold text-xs rounded-lg transition-colors flex items-center gap-2 self-start sm:self-auto"
            >
              <Zap className={`w-3.5 h-3.5 ${forecastLoading ? 'animate-bounce' : ''}`} />
              <span>{forecastLoading ? 'Simulating Energy Path...' : 'Compute 21-Day Forecast'}</span>
            </button>
          </div>

          {forecastResult ? (
            <div className="p-4 bg-teal-950/20 border border-teal-500/40 rounded-xl space-y-3">
              <span className="text-xs font-mono text-teal-400 font-semibold uppercase tracking-wider block">
                QUANTUM BIO-METABOLIC PROJECTION
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">
                {forecastResult}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono">
                <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">PROJECTED CERVICAL TORQUE</span>
                  <span className="text-sm font-semibold text-emerald-400">12.1 kg (-43%)</span>
                </div>
                <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">PREDICTED HRV COHERENCE</span>
                  <span className="text-sm font-semibold text-teal-300">76 ms (+18%)</span>
                </div>
                <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">VQE GROUND HARMONY</span>
                  <span className="text-sm font-semibold text-white">-128.45 Hartree</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-slate-400">
              Click "Compute 21-Day Forecast" to model multi-week cellular recovery curves.
            </div>
          )}
        </div>
      )}
      {/* Downloadable Consultation Report PDF Modal */}
      <ConsultationReportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
      />
    </section>
  );
};
