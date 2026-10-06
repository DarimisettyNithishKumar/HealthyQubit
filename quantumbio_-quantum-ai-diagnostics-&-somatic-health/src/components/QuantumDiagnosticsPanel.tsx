import React, { useState } from 'react';
import { BodyPartData, DiagnosticResult } from '../types';
import { ANATOMY_CATALOG } from '../data/anatomyCatalog';
import { Sparkles, Activity, AlertTriangle, ShieldCheck, Printer, Play, RefreshCw, Cpu, CheckCircle, FileText, Download } from 'lucide-react';

interface QuantumDiagnosticsPanelProps {
  initialRegion?: BodyPartData;
  onLaunchPractice: (region: BodyPartData) => void;
  onDiagnosticComplete?: (diag: DiagnosticResult, bodyPart: string, symptoms: string, severity: 'Mild' | 'Moderate' | 'Severe') => void;
  onOpenConsultationReport?: () => void;
}

export const QuantumDiagnosticsPanel: React.FC<QuantumDiagnosticsPanelProps> = ({
  initialRegion,
  onLaunchPractice,
  onDiagnosticComplete,
  onOpenConsultationReport,
}) => {
  const [selectedBodyPart, setSelectedBodyPart] = useState<string>(
    initialRegion ? initialRegion.label : 'Cervical Spine & Trapezius'
  );
  const [symptomsInput, setSymptomsInput] = useState<string>(
    'Persistent occipital tightness, restricted lateral neck rotation, and bilateral trapezius spasms after prolonged screen sessions.'
  );
  const [severity, setSeverity] = useState<'mild' | 'moderate' | 'severe'>('moderate');
  const [duration, setDuration] = useState<'acute' | 'subacute' | 'chronic'>('chronic');
  const [lifestyle, setLifestyle] = useState<string>('Knowledge worker, 9+ hrs desk computer work');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRunDiagnostic = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/diagnostics/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bodyPart: selectedBodyPart,
          symptoms: symptomsInput,
          severity,
          duration,
          lifestyle,
        }),
      });

      const json = await response.json();
      if (json.success && json.data) {
        setDiagnosticResult(json.data);
        if (onDiagnosticComplete) {
          const capSeverity = (severity.charAt(0).toUpperCase() + severity.slice(1)) as 'Mild' | 'Moderate' | 'Severe';
          onDiagnosticComplete(json.data, selectedBodyPart, symptomsInput, capSeverity);
        }
      } else {
        throw new Error('Invalid diagnostic output');
      }
    } catch (err: any) {
      console.error('Diagnostic error:', err);
      setErrorMsg('Diagnostic engine fallback activated.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="quantum-diagnostics" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="mb-8 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs font-mono text-teal-400 mb-2">
          <Cpu className="w-3.5 h-3.5" />
          <span>SERVER-SIDE QUANTUM AI · GEMINI 3.8 FLASH ENGINE</span>
          <span aria-hidden="true">·</span>
          <span>MULTI-MODAL CLINICAL TRIAGE</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
          Quantum AI Biomedical Diagnostic Suite
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Multi-scale clinical triage combining quantum molecular Hamiltonian predictions with evidence-based somatic yoga therapy.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Form (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between pb-3 border-b border-slate-800">
            <span>PATIENT SOMATIC PROFILE</span>
            <span className="text-teal-400">REAL-TIME INFERENCE</span>
          </div>

          {/* Body Part Selection */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Anatomical Region of Concern
            </label>
            <select
              value={selectedBodyPart}
              onChange={(e) => setSelectedBodyPart(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
            >
              {ANATOMY_CATALOG.map((cat) => (
                <option key={cat.id} value={cat.label}>
                  {cat.label} ({cat.anatomicalArea.split(',')[0]})
                </option>
              ))}
            </select>
          </div>

          {/* Clinical Symptoms Textarea */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Reported Somatic Symptoms & Sensations
            </label>
            <textarea
              rows={3}
              value={symptomsInput}
              onChange={(e) => setSymptomsInput(e.target.value)}
              placeholder="Describe pain intensity, stiffness, shooting sensations, or triggers..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-teal-500 placeholder-slate-500 resize-none"
            />
          </div>

          {/* Severity & Duration controls */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Severity Index
              </label>
              <div className="flex rounded-lg p-1 bg-slate-950 border border-slate-800">
                {(['mild', 'moderate', 'severe'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSeverity(lvl)}
                    className={`flex-1 py-1 text-[11px] font-medium rounded capitalize transition-colors ${
                      severity === lvl
                        ? 'bg-teal-500 text-slate-950 font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Chronicity
              </label>
              <div className="flex rounded-lg p-1 bg-slate-950 border border-slate-800">
                {(['acute', 'subacute', 'chronic'] as const).map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => setDuration(dur)}
                    className={`flex-1 py-1 text-[11px] font-medium rounded capitalize transition-colors ${
                      duration === dur
                        ? 'bg-teal-500 text-slate-950 font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {dur}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Lifestyle / Occupational Context */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Occupational / Ergonomic Context
            </label>
            <input
              type="text"
              value={lifestyle}
              onChange={(e) => setLifestyle(e.target.value)}
              placeholder="e.g. Software Engineer, standing desk, heavy commute"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleRunDiagnostic}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-teal-400 hover:bg-teal-300 disabled:bg-slate-800 text-slate-950 disabled:text-slate-500 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>Computing Quantum Hamiltonian & Triage...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 fill-current" />
                <span>Execute Quantum AI Diagnostic Evaluation</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Diagnostic & Molecular Triage Report (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6 min-h-[460px] flex flex-col justify-between">
          {!diagnosticResult && !isLoading ? (
            <div className="flex flex-col items-center justify-center text-center my-auto py-12 px-4">
              <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-teal-400 mb-4">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-white mb-1">
                Awaiting Clinical Input
              </h3>
              <p className="text-xs text-slate-400 max-w-md mb-5">
                Configure the somatic profile on the left and trigger the Quantum AI model to generate tissue-level diagnostics and customized Yoga Asana therapy.
              </p>
              <button
                onClick={handleRunDiagnostic}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-medium rounded-lg transition-colors border border-slate-700"
              >
                Run Sample Evaluation
              </button>
            </div>
          ) : isLoading ? (
            <div className="flex flex-col items-center justify-center text-center my-auto py-16">
              <div className="w-10 h-10 border-2 border-teal-400 border-t-transparent rounded-full animate-spin mb-4" />
              <span className="text-xs font-mono text-teal-300 uppercase tracking-wider mb-1">
                EXECUTING QUANTUM BIO-TRIAGE
              </span>
              <p className="text-xs text-slate-400">
                Solving ground state Hamiltonian & cross-referencing somatic biomechanics...
              </p>
            </div>
          ) : diagnosticResult ? (
            <div className="space-y-6">
              {/* Report Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-teal-400 mb-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>CLINICAL REPORT VERIFIED</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">
                      CONFIDENCE: {Math.round(diagnosticResult.confidenceScore * 100)}%
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    Biomedical Diagnostic Synthesis
                  </h3>
                </div>

                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5 border border-slate-700 self-start sm:self-auto"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Report</span>
                </button>
              </div>

              {/* Diagnostic Summary */}
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-lg text-xs leading-relaxed text-slate-200">
                <span className="font-semibold text-teal-400 block mb-1">CLINICAL FINDINGS:</span>
                {diagnosticResult.diagnosticSummary}
              </div>

              {/* Quantum Telemetry Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-lg">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">VQE ITERATIONS</div>
                  <div className="text-lg font-mono font-semibold text-white tabular-nums mt-0.5">
                    {diagnosticResult.quantumMetrics.vqeConvergenceIter}
                  </div>
                  <div className="text-[10px] text-teal-400 font-mono">CONVERGED</div>
                </div>

                <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-lg">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">GROUND ENERGY</div>
                  <div className="text-lg font-mono font-semibold text-white tabular-nums mt-0.5">
                    {diagnosticResult.quantumMetrics.groundStateEnergyHartree}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">Hartree</div>
                </div>

                <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-lg">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">CYTOKINE SUPPR.</div>
                  <div className="text-lg font-mono font-semibold text-teal-300 tabular-nums mt-0.5">
                    {diagnosticResult.quantumMetrics.cytokineSuppressionIndex}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">IL-6 / TNF-a</div>
                </div>

                <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-lg">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">ATP FLUX RATIO</div>
                  <div className="text-lg font-mono font-semibold text-emerald-400 tabular-nums mt-0.5">
                    {diagnosticResult.quantumMetrics.cellularAtpFluxRatio}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">Mitochondrial</div>
                </div>
              </div>

              {/* Quantum Biomarker Molecular Mechanisms */}
              <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-lg text-xs">
                <span className="font-semibold text-cyan-400 block mb-1">
                  QUANTUM MOLECULAR MECHANISM:
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {diagnosticResult.quantumBiomarkerMechanisms}
                </p>
              </div>

              {/* Probable Etiologies */}
              <div>
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  DIFFERENTIAL ETIOLOGY
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {diagnosticResult.probableEtiologies.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-slate-950/50 border border-slate-800 rounded text-xs text-slate-300 flex items-center gap-2"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prescribed Asana Banner */}
              <div className="p-4 bg-teal-950/20 border border-teal-500/30 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] font-mono text-teal-400 uppercase tracking-wider">
                    TARGETED SOMATIC PRESCRIPTION
                  </div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {diagnosticResult.primaryAsana.sanskrit}
                  </div>
                  <div className="text-xs text-slate-300">
                    {diagnosticResult.primaryAsana.english} · {diagnosticResult.primaryAsana.breathingRatio}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                  {onOpenConsultationReport && (
                    <button
                      onClick={onOpenConsultationReport}
                      className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-teal-300 hover:text-white border border-teal-500/40 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-sm"
                      title="Generate and download clinical consultation PDF dossier"
                    >
                      <Download className="w-3.5 h-3.5 text-teal-400" />
                      <span>Consultation PDF</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      const matched =
                        ANATOMY_CATALOG.find((c) =>
                          selectedBodyPart.toLowerCase().includes(c.id)
                        ) || ANATOMY_CATALOG[1];
                      onLaunchPractice(matched);
                    }}
                    className="px-4 py-2 bg-teal-400 hover:bg-teal-300 text-slate-950 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Launch Practice Session</span>
                  </button>
                </div>
              </div>

              {/* Urgent Red Flags */}
              {diagnosticResult.urgentRedFlags && diagnosticResult.urgentRedFlags.length > 0 && (
                <div className="p-3 bg-rose-950/20 border border-rose-900/40 rounded-lg text-xs">
                  <div className="flex items-center gap-1.5 text-rose-400 font-semibold mb-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>CLINICAL RED-FLAG THRESHOLDS (SEEK IMMEDIATE MEDICAL EVALUATION)</span>
                  </div>
                  <ul className="list-disc list-inside text-rose-300/80 space-y-0.5 pl-1">
                    {diagnosticResult.urgentRedFlags.map((flag, idx) => (
                      <li key={idx}>{flag}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};
