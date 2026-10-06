import React, { useState } from 'react';
import { ANATOMY_CATALOG } from '../data/anatomyCatalog';
import { BodyPartData, BodyRegion } from '../types';
import { Play, Sparkles, Activity, ShieldAlert, CheckCircle2, ChevronRight, RotateCcw } from 'lucide-react';

interface InteractiveBodyMapProps {
  onSelectRegion: (region: BodyPartData) => void;
  onStartPractice: (region: BodyPartData) => void;
  onOpenDiagnostics: (region: BodyPartData) => void;
  selectedRegionId?: BodyRegion;
}

export const InteractiveBodyMap: React.FC<InteractiveBodyMapProps> = ({
  onSelectRegion,
  onStartPractice,
  onOpenDiagnostics,
  selectedRegionId = 'back',
}) => {
  const [viewOrientation, setViewOrientation] = useState<'anterior' | 'posterior'>('anterior');
  const [hoveredRegion, setHoveredRegion] = useState<BodyPartData | null>(null);

  const selectedRegion = ANATOMY_CATALOG.find((r) => r.id === selectedRegionId) || ANATOMY_CATALOG[5]; // Default to back

  const handleSelect = (region: BodyPartData) => {
    onSelectRegion(region);
  };

  return (
    <section id="interactive-anatomy" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header section with clean typography */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-teal-400 mb-2">
            <Activity className="w-3.5 h-3.5" />
            <span>SOMATOSENSORY BIOMECHANICAL MAP</span>
            <span aria-hidden="true">·</span>
            <span>REAL-TIME ASANA TARGETING</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            Interactive Anatomical Health Map
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Select any region of the human body to reveal targeted therapeutic Yoga Asanas, biomechanical alignment cues, and quantum cellular biomarker targets.
          </p>
        </div>

        {/* View orientation toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg self-start md:self-auto">
          <button
            onClick={() => setViewOrientation('anterior')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              viewOrientation === 'anterior'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Anterior (Front)
          </button>
          <button
            onClick={() => setViewOrientation('posterior')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              viewOrientation === 'posterior'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Posterior (Back)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Anatomical Interactive Hologram Canvas */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-xl p-6 relative overflow-hidden flex flex-col items-center">
          {/* Subtle grid backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

          {/* Top readout info */}
          <div className="w-full flex items-center justify-between text-xs text-slate-400 font-mono mb-4 border-b border-slate-800/80 pb-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span>ACTIVE SCAN: {viewOrientation.toUpperCase()}</span>
            </span>
            <span>9 CLINICAL REGIONS</span>
          </div>

          {/* Interactive SVG Human Figure */}
          <div className="relative w-full max-w-[320px] aspect-[1/2] flex items-center justify-center my-2 select-none">
            <svg
              viewBox="0 0 200 400"
              className="w-full h-full drop-shadow-xl"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Stylized Human Body Silhouette */}
              <defs>
                <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0f172a" />
                  <stop offset="50%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
                <linearGradient id="meridianGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.8" />
                </linearGradient>
              </defs>

              {/* Head */}
              <circle cx="100" cy="40" r="22" fill="url(#bodyGradient)" stroke="#334155" strokeWidth="1.5" />
              
              {/* Neck */}
              <path d="M92 62 L108 62 L110 75 L90 75 Z" fill="url(#bodyGradient)" stroke="#334155" strokeWidth="1" />

              {/* Torso & Pelvis */}
              <path
                d="M68 78 Q100 70 132 78 L126 150 Q100 156 74 150 Z"
                fill="url(#bodyGradient)"
                stroke="#334155"
                strokeWidth="1.5"
              />
              <path
                d="M74 150 L126 150 L130 190 Q100 204 70 190 Z"
                fill="url(#bodyGradient)"
                stroke="#334155"
                strokeWidth="1.5"
              />

              {/* Left Arm (viewer right) */}
              <path
                d="M132 78 L152 140 L160 210 L152 214 L144 142 L126 86 Z"
                fill="url(#bodyGradient)"
                stroke="#334155"
                strokeWidth="1"
              />
              {/* Right Arm (viewer left) */}
              <path
                d="M68 78 L48 140 L40 210 L48 214 L56 142 L74 86 Z"
                fill="url(#bodyGradient)"
                stroke="#334155"
                strokeWidth="1"
              />

              {/* Left Leg (viewer right) */}
              <path
                d="M102 195 L124 200 L122 280 L118 360 L108 360 L110 280 L102 210 Z"
                fill="url(#bodyGradient)"
                stroke="#334155"
                strokeWidth="1"
              />
              {/* Right Leg (viewer left) */}
              <path
                d="M98 195 L76 200 L78 280 L82 360 L92 360 L90 280 L98 210 Z"
                fill="url(#bodyGradient)"
                stroke="#334155"
                strokeWidth="1"
              />

              {/* Subtle Central Neural Meridian Line (Sushumna Nadi) */}
              <line
                x1="100"
                y1="30"
                x2="100"
                y2="200"
                stroke="url(#meridianGlow)"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />

              {/* Axial Spine Lines on Posterior View */}
              {viewOrientation === 'posterior' && (
                <path
                  d="M100 62 L100 190"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  strokeOpacity="0.4"
                />
              )}
            </svg>

            {/* Clickable Hotspots mapped proportionally onto the body */}
            {ANATOMY_CATALOG.map((region) => {
              const coords =
                viewOrientation === 'anterior'
                  ? region.anteriorCoordinates
                  : region.posteriorCoordinates;
              const isSelected = selectedRegion.id === region.id;
              const isHovered = hoveredRegion?.id === region.id;

              return (
                <button
                  key={region.id}
                  onClick={() => handleSelect(region)}
                  onMouseEnter={() => setHoveredRegion(region)}
                  onMouseLeave={() => setHoveredRegion(null)}
                  style={{
                    left: `${coords.x}%`,
                    top: `${coords.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className="absolute group z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded-full"
                  aria-label={`Select ${region.label}`}
                >
                  <div className="relative flex items-center justify-center">
                    {/* Pulsing ring */}
                    <div
                      className={`absolute w-7 h-7 rounded-full transition-all duration-300 ${
                        isSelected
                          ? 'bg-teal-400/30 scale-125 animate-ping'
                          : isHovered
                          ? 'bg-cyan-400/20 scale-110'
                          : 'bg-transparent'
                      }`}
                    />
                    {/* Inner core circle */}
                    <div
                      className={`w-4 h-4 rounded-full border-2 transition-transform duration-200 shadow-md flex items-center justify-center ${
                        isSelected
                          ? 'bg-teal-400 border-white scale-125 shadow-teal-500/50'
                          : isHovered
                          ? 'bg-cyan-400 border-slate-900 scale-110'
                          : 'bg-slate-800 border-teal-500/80 hover:bg-teal-500'
                      }`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          isSelected ? 'bg-slate-950' : 'bg-teal-300'
                        }`}
                      />
                    </div>

                    {/* Tooltip on hover */}
                    <div
                      className={`absolute left-6 whitespace-nowrap bg-slate-900/95 border border-slate-700 text-xs px-2.5 py-1 rounded shadow-lg pointer-events-none transition-opacity duration-200 z-30 ${
                        isHovered || isSelected ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <span className="font-medium text-white">{region.label}</span>
                      <span className="text-teal-400 ml-1.5 text-[10px]">
                        {region.primaryAsana.sanskrit.split('&')[0]}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Body Sector Chips at bottom */}
          <div className="w-full mt-4 pt-4 border-t border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 block mb-2">QUICK SELECTION:</span>
            <div className="flex flex-wrap gap-1.5">
              {ANATOMY_CATALOG.map((region) => (
                <button
                  key={region.id}
                  onClick={() => handleSelect(region)}
                  className={`text-xs px-2.5 py-1 rounded transition-colors ${
                    selectedRegion.id === region.id
                      ? 'bg-teal-500 text-slate-950 font-semibold shadow-sm'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {region.label.split('&')[0].trim()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Asana Prescription & Biomechanical Intelligence */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Selected Region Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5 pb-5 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-teal-400 mb-1">
                  <span>TARGET REGION</span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedRegion.anatomicalArea}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {selectedRegion.label}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Quantum Target: <span className="text-slate-300">{selectedRegion.quantumTarget}</span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={() => onStartPractice(selectedRegion)}
                  className="px-4 py-2 text-xs font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start Guided Practice</span>
                </button>
                <button
                  onClick={() => onOpenDiagnostics(selectedRegion)}
                  className="px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg transition-colors flex items-center gap-1.5 border border-slate-700 whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>AI Diagnostics</span>
                </button>
              </div>
            </div>

            {/* Primary Asana Highlight */}
            <div className="bg-slate-950/70 border border-teal-500/30 rounded-lg p-5 mb-6">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="text-xs font-mono text-teal-300 uppercase tracking-wider">
                  PRIMARY THERAPEUTIC ASANA PRESCRIPTION
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>Intensity: {selectedRegion.primaryAsana.intensity}</span>
                  <span aria-hidden="true">·</span>
                  <span>{Math.floor(selectedRegion.primaryAsana.durationSeconds / 60)} mins</span>
                </div>
              </div>

              <div className="mb-3">
                <h4 className="text-lg font-bold text-white">
                  {selectedRegion.primaryAsana.sanskrit}
                </h4>
                <div className="text-xs text-slate-300 font-medium">
                  {selectedRegion.primaryAsana.english}
                </div>
              </div>

              {/* Breathing Cadence Indicator */}
              <div className="flex items-center gap-2 py-2 px-3 bg-slate-900 rounded border border-slate-800 text-xs text-slate-300 mb-4 font-mono">
                <span className="text-teal-400 font-semibold">BREATH RATIO:</span>
                <span>{selectedRegion.primaryAsana.breathingRatio}</span>
              </div>

              {/* Step by Step Sequence */}
              <div className="space-y-2 mb-4">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  EXECUTION PROTOCOL:
                </span>
                <ol className="space-y-1.5 text-xs text-slate-300 list-decimal list-inside pl-1">
                  {selectedRegion.primaryAsana.steps.map((step, idx) => (
                    <li key={idx} className="leading-relaxed">
                      <span className="text-slate-200">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Biomechanical Vector Action */}
              <div className="p-3 bg-slate-900/90 rounded border border-slate-800/80 mb-3 text-xs">
                <span className="text-teal-400 font-semibold block mb-1">
                  BIOMECHANICAL & KINETIC VECTOR:
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {selectedRegion.primaryAsana.biomechanicalAction}
                </p>
              </div>

              {/* Clinical Contraindications */}
              <div className="flex items-start gap-2 text-xs text-amber-300/90 bg-amber-950/20 border border-amber-900/40 p-2.5 rounded">
                <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                <div>
                  <span className="font-semibold text-amber-300">CLINICAL CONTRAINDICATIONS: </span>
                  <span>{selectedRegion.primaryAsana.contraindications.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Secondary Asanas & Common Pathology Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Supporting Asanas */}
              <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-lg">
                <h5 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
                  SUPPORTING ASANA SEQUENCE
                </h5>
                <ul className="space-y-2 text-xs">
                  {selectedRegion.secondaryAsanas.map((sec, idx) => (
                    <li key={idx} className="flex items-start justify-between pb-2 border-b border-slate-850 last:border-none">
                      <div>
                        <span className="font-medium text-slate-200 block">{sec.name}</span>
                        <span className="text-slate-400 text-[11px]">{sec.target}</span>
                      </div>
                      <span className="font-mono text-slate-400 text-[11px] whitespace-nowrap ml-2">
                        {sec.duration}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Common Pathology Targets */}
              <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-lg">
                <h5 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
                  PREVENTIVE REHABILITATION TARGETS
                </h5>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {selectedRegion.commonIssues.map((issue, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
