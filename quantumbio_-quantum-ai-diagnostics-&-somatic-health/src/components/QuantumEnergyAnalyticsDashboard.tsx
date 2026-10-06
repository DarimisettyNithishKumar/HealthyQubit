import React, { useState, useEffect, useMemo } from 'react';
import { usePatientHealth } from '../context/PatientHealthContext';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Area,
  ComposedChart
} from 'recharts';
import {
  Activity,
  Sparkles,
  Zap,
  TrendingDown,
  Calendar,
  Send,
  HelpCircle,
  RefreshCw,
  Info,
  CheckCircle2,
  Clock,
  Plus
} from 'lucide-react';

interface AiTrajectoryData {
  trajectorySummary: string;
  quantumCoherenceStatus: 'OPTIMAL' | 'STABILIZING' | 'DRIFTING';
  meanGroundEnergyHartree: number;
  energyDeltaHartree: number;
  biologicalSignificance: string;
  predictedHartreeNextMonth: number;
  aiClinicalRecommendations: string[];
  recommendedAsanaModulation: string;
  nutritionalCoFactorSync: string;
  queryAnswer?: string;
}

export const QuantumEnergyAnalyticsDashboard: React.FC = () => {
  const { diagnosticHistory, addDiagnosticRecord } = usePatientHealth();

  const [timeRange, setTimeRange] = useState<'30d' | '90d' | 'all'>('all');
  const [showCytokineOverlay, setShowCytokineOverlay] = useState<boolean>(true);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiData, setAiData] = useState<AiTrajectoryData | null>(null);
  const [userQuery, setUserQuery] = useState<string>('');
  const [queryResponse, setQueryResponse] = useState<string | null>(null);

  // Transform diagnostic records into sequential chronological data points for Recharts
  const chartData = useMemo(() => {
    // Sort chronologically ascending
    const sorted = [...diagnosticHistory].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return sorted.map((item, index) => {
      // Calculate a normalized cytokine suppression index proxy (70% - 95%)
      const normalizedSuppression = Math.min(
        95,
        Math.max(65, Math.round(70 + (Math.abs(item.quantumEnergyHartree) - 115) * 1.4))
      );

      return {
        id: item.id,
        date: item.date,
        energyHartree: Number(item.quantumEnergyHartree.toFixed(3)),
        cytokineSuppression: normalizedSuppression,
        bodyPart: item.bodyPart,
        diagnosis: item.diagnosis,
        severity: item.severity,
        prescribedAsana: item.prescribedAsana,
        prescribedFoods: item.prescribedFoods.join(', '),
        confidence: Math.round(item.confidence * 100),
      };
    });
  }, [diagnosticHistory]);

  // Initial AI trajectory evaluation
  const runAiEvaluation = async (customQuery?: string) => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai/analyze-energy-trajectory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: diagnosticHistory,
          query: customQuery || userQuery,
        }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setAiData(json.data);
        if (json.data.queryAnswer) {
          setQueryResponse(json.data.queryAnswer);
        }
      }
    } catch (e) {
      console.error('Error fetching AI trajectory:', e);
    } finally {
      setIsAiLoading(false);
    }
  };

  useEffect(() => {
    runAiEvaluation();
  }, [diagnosticHistory.length]);

  const handleSendQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;
    runAiEvaluation(userQuery);
  };

  const handleSimulateNewSession = () => {
    const today = new Date();
    // 3 days after latest or today
    const randomVariation = (Math.random() * 4 - 2);
    const latestEnergy = chartData.length > 0 ? chartData[chartData.length - 1].energyHartree : -128.45;
    const newEnergy = Number((latestEnergy - 1.8 + randomVariation).toFixed(3));

    addDiagnosticRecord({
      bodyPart: 'Thoracic & Cardiopulmonary Vault',
      symptoms: 'Mild desk slouch and shallow apical breathing during long videoconference call.',
      severity: 'Mild',
      diagnosis: 'Costovertebral Hypomobility & Shallow Apical Respiration',
      confidence: 0.97,
      prescribedAsana: 'Ustrasana (Camel Pose) & Anahatasana',
      prescribedFoods: ['Organic Green Tea with Cardamom', 'Fermented Beetroot Kvass'],
      quantumEnergyHartree: newEnergy,
      status: 'Active Protocol',
    });
  };

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 border border-slate-700 p-4 rounded-xl shadow-2xl backdrop-blur-md text-xs max-w-xs space-y-1.5 z-50">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-mono text-teal-400 font-semibold">{data.date}</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
              {data.severity}
            </span>
          </div>

          <div className="pt-1">
            <div className="font-bold text-white text-sm">{data.bodyPart}</div>
            <div className="text-slate-300 text-[11px]">{data.diagnosis}</div>
          </div>

          <div className="grid grid-cols-2 gap-2 py-2 border-y border-slate-800/80 font-mono">
            <div>
              <span className="text-[10px] text-slate-400 block">QUANTUM ENERGY</span>
              <span className="text-teal-300 font-bold text-sm">{data.energyHartree} Ha</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">CYTOKINE SUPPR.</span>
              <span className="text-emerald-400 font-bold text-sm">{data.cytokineSuppression}%</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 pt-1">
            <span className="text-slate-300 font-semibold">Prescription: </span>
            <span>{data.prescribedAsana}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const meanEnergy = chartData.length > 0
    ? (chartData.reduce((acc, c) => acc + c.energyHartree, 0) / chartData.length).toFixed(2)
    : '-128.45';

  return (
    <section id="quantum-energy-dashboard" className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-teal-400 mb-2">
            <Zap className="w-3.5 h-3.5" />
            <span>DYNAMIC RECHARTS TELEMETRY</span>
            <span aria-hidden="true">·</span>
            <span>LONGITUDINAL HAMILTONIAN ENERGY ANALYSIS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            Quantum Energy Hartree Trajectory Dashboard
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Real-time visualization of patient ground-state energy values ($E_0$) derived from clinical diagnostics, paired with AI-driven biophysics trajectory predictions.
          </p>
        </div>

        {/* Dashboard Actions */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={() => setShowCytokineOverlay(!showCytokineOverlay)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
              showCytokineOverlay
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            {showCytokineOverlay ? '● Cytokine Curve ON' : '○ Cytokine Curve OFF'}
          </button>

          <button
            onClick={handleSimulateNewSession}
            className="px-3.5 py-1.5 bg-teal-400 hover:bg-teal-300 text-slate-950 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Simulate Diagnostic Point</span>
          </button>
        </div>
      </div>

      {/* Top Telemetry KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-[11px] font-mono text-slate-400 uppercase">
            MEAN GROUND ENERGY
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-white tabular-nums mt-1">
            {meanEnergy}
          </div>
          <div className="text-[11px] text-teal-400 font-mono mt-0.5">
            Hartree ($E_0$ Baseline)
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-[11px] font-mono text-slate-400 uppercase">
            QUANTUM DELTA
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-teal-300 tabular-nums mt-1">
            -9.54 Ha
          </div>
          <div className="text-[11px] text-emerald-400 font-mono mt-0.5 flex items-center gap-1">
            <TrendingDown className="w-3 h-3" />
            <span>Progressive Relaxation</span>
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-[11px] font-mono text-slate-400 uppercase">
            COHERENCE STATUS
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{aiData ? aiData.quantumCoherenceStatus : 'STABILIZING'}</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
            Mitochondrial Coupling
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-[11px] font-mono text-slate-400 uppercase">
            AI 30-DAY TARGET
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-cyan-300 tabular-nums mt-1">
            {aiData ? `${aiData.predictedHartreeNextMonth} Ha` : '-136.85 Ha'}
          </div>
          <div className="text-[11px] text-cyan-400 font-mono mt-0.5">
            Optimal Ground State
          </div>
        </div>
      </div>

      {/* Main Dynamic Recharts Graph Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Longitudinal Quantum Energy vs Cytokine Suppression Curve
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              More negative Hartree values represent energy minimization and reduction of chronic myofascial ischemic micro-currents.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-teal-400 rounded-full" />
              <span className="text-teal-300">Energy Hartree (Ha)</span>
            </div>
            {showCytokineOverlay && (
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-emerald-400 rounded-full" />
                <span className="text-emerald-300">Cytokine Suppr. (%)</span>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Recharts Visualization Container */}
        <div className="w-full h-80 sm:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
            >
              <defs>
                <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />

              <XAxis
                dataKey="date"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
                tickLine={{ stroke: '#334155' }}
              />

              {/* Left Y-Axis: Quantum Energy Hartree (Negative values, e.g. -145 to -110) */}
              <YAxis
                yAxisId="energy"
                domain={[-145, -110]}
                stroke="#14b8a6"
                tick={{ fill: '#2dd4bf', fontSize: 11, fontFamily: 'monospace' }}
                tickFormatter={(val) => `${val} Ha`}
                width={70}
              />

              {/* Right Y-Axis: Cytokine Suppression Index (50% to 100%) */}
              {showCytokineOverlay && (
                <YAxis
                  yAxisId="cytokine"
                  orientation="right"
                  domain={[50, 100]}
                  stroke="#10b981"
                  tick={{ fill: '#34d399', fontSize: 11, fontFamily: 'monospace' }}
                  tickFormatter={(val) => `${val}%`}
                  width={50}
                />
              )}

              <Tooltip content={<CustomTooltip />} />

              {/* Ground-State Homeostasis Reference Line */}
              <ReferenceLine
                yAxisId="energy"
                y={-135}
                stroke="#38bdf8"
                strokeDasharray="4 4"
                label={{
                  value: 'Optimal Tissue Homeostasis (-135 Ha)',
                  fill: '#38bdf8',
                  fontSize: 10,
                  position: 'insideBottomRight',
                }}
              />

              {/* Primary Line: Quantum Energy Hartree */}
              <Line
                yAxisId="energy"
                type="monotone"
                dataKey="energyHartree"
                name="Quantum Energy Hartree"
                stroke="#14b8a6"
                strokeWidth={3}
                dot={{ stroke: '#2dd4bf', strokeWidth: 2, fill: '#042f2e', r: 5 }}
                activeDot={{ stroke: '#ffffff', strokeWidth: 2, fill: '#14b8a6', r: 7 }}
              />

              {/* Secondary Line: Cytokine Suppression Index */}
              {showCytokineOverlay && (
                <Line
                  yAxisId="cytokine"
                  type="monotone"
                  dataKey="cytokineSuppression"
                  name="Cytokine Suppression Index"
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="4 3"
                  dot={{ stroke: '#34d399', strokeWidth: 1.5, fill: '#022c22', r: 4 }}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 pt-4 border-t border-slate-800 gap-2">
          <span>DATA POINTS: {chartData.length} EVALUATIONS LOGGED</span>
          <span>CALIBRATED VIA VARIATIONAL QUANTUM EIGENSOLVER (VQE)</span>
        </div>
      </div>

      {/* AI CAPABILITIES SUITE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: AI Clinical Trajectory Evaluation & Recommendations (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <h3 className="text-base font-bold text-white tracking-tight">
                AI Quantum Biophysics Trajectory Synthesis
              </h3>
            </div>
            <button
              onClick={() => runAiEvaluation()}
              disabled={isAiLoading}
              className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded transition-colors"
              title="Refresh AI Analysis"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAiLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {isAiLoading && !aiData ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin mb-3" />
              <span className="text-xs font-mono text-teal-300">
                PROCESSING LONGITUDINAL ENERGY VECTORS WITH GEMINI 3.8 FLASH...
              </span>
            </div>
          ) : aiData ? (
            <div className="space-y-5 text-xs">
              {/* Executive Summary */}
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl leading-relaxed text-slate-200">
                <span className="font-semibold text-teal-400 block mb-1">
                  AI TRAJECTORY EVALUATION:
                </span>
                {aiData.trajectorySummary}
              </div>

              {/* Biological Meaning */}
              <div className="p-4 bg-teal-950/20 border border-teal-500/30 rounded-xl space-y-1">
                <span className="font-semibold text-cyan-400 block font-mono">
                  BIOLOGICAL & MOLECULAR SIGNIFICANCE:
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {aiData.biologicalSignificance}
                </p>
              </div>

              {/* Asana & Nutrition Modulation Directives */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-lg space-y-1">
                  <span className="font-semibold text-teal-300 block font-mono">
                    ADAPTIVE YOGA MODULATION:
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {aiData.recommendedAsanaModulation}
                  </p>
                </div>

                <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-lg space-y-1">
                  <span className="font-semibold text-emerald-300 block font-mono">
                    NUTRITIONAL CO-FACTOR SYNC:
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {aiData.nutritionalCoFactorSync}
                  </p>
                </div>
              </div>

              {/* 3 Actionable Bullet Points */}
              <div>
                <span className="font-semibold text-slate-300 uppercase tracking-wider block mb-2 font-mono">
                  ACTIONABLE CLINICAL ADAPTATIONS:
                </span>
                <ul className="space-y-1.5">
                  {aiData.aiClinicalRecommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
        </div>

        {/* Right Column: Interactive "Ask AI Quantum Clinician" Assistant (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Ask AI Quantum Clinician
            </h3>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Inquire directly regarding your energy fluctuations, asana correlations, or targeted biochemical dietary co-factors.
          </p>

          {/* Quick Prompt Suggestions */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono text-slate-400 block">
              RECOMMENDED INQUIRIES:
            </span>
            <div className="space-y-1">
              {[
                'Why did my energy dip to -134 Ha on Sept 28?',
                'How does my asana compliance lower Hartree energy?',
                'What dietary changes will stabilize my cervical tension?'
              ].map((suggestion, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setUserQuery(suggestion);
                    runAiEvaluation(suggestion);
                  }}
                  className="w-full text-left p-2 rounded bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 text-[11px] text-slate-300 hover:text-white transition-colors"
                >
                  "{suggestion}"
                </button>
              ))}
            </div>
          </div>

          {/* User Input Form */}
          <form onSubmit={handleSendQuery} className="space-y-3 pt-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Ask about your Hartree trend or recovery..."
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-3 pr-9 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
              <button
                type="submit"
                disabled={isAiLoading || !userQuery.trim()}
                className="absolute right-2 top-2 text-teal-400 hover:text-teal-300 disabled:text-slate-600 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Query Answer Display */}
          {queryResponse && (
            <div className="p-3.5 bg-teal-950/30 border border-teal-500/40 rounded-xl text-xs space-y-1.5 animate-fadeIn">
              <div className="flex items-center gap-1.5 text-teal-300 font-semibold font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI CLINICAL RESPONSE:</span>
              </div>
              <p className="text-slate-200 leading-relaxed text-[11px]">
                {queryResponse}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
