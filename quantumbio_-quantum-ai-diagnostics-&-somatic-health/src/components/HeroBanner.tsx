import React from 'react';
import { Sparkles, ArrowRight, Activity, ShieldCheck } from 'lucide-react';

interface HeroBannerProps {
  onExploreAnatomy: () => void;
  onOpenBiomarkers: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onExploreAnatomy,
  onOpenBiomarkers,
}) => {
  return (
    <section className="relative overflow-hidden border-b border-slate-800 bg-slate-950 py-16 sm:py-24">
      {/* Background Hero Image with measured scrim */}
      <div className="absolute inset-0 pointer-events-none opacity-25 mix-blend-luminosity">
        <img
          src="/src/assets/images/quantum_bio_hero_1791265063278.jpg"
          alt="Quantum AI biomedical neural mapping visualization"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Metadata line without pills */}
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-4">
            <span className="text-teal-400 font-semibold">QUANTUM AI BIOMEDICAL SUITE</span>
            <span aria-hidden="true">·</span>
            <span>CLINICAL DIAGNOSTICS & RADIOLOGY</span>
            <span aria-hidden="true">·</span>
            <span>EVIDENCE-BASED ASANA THERAPEUTICS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white text-balance leading-tight">
            Enterprise Quantum AI Biomedical & Health Diagnostics
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
            A unified multi-service clinical platform delivering 360° 3D human anatomical modeling, cytokine blood biomarker analysis, DICOM radiology scanning, precision pharmacogenomics, live digital twin vitals, and targeted therapeutic Yoga Asana protocols.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={onExploreAnatomy}
              className="px-5 py-2.5 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs sm:text-sm rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-teal-500/20"
            >
              <span>Explore 360° Anatomical Atlas</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenBiomarkers}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-medium text-xs sm:text-sm rounded-lg transition-colors flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Clinical Biomarker Lab</span>
            </button>
          </div>

          {/* Proof Adjacency Metrics */}
          <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-white tabular-nums">
                9 Zones
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Mapped Somatic Meridians
              </div>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-teal-400 tabular-nums">
                240x
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Quantum VQE Acceleration
              </div>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-cyan-400 tabular-nums">
                &lt;180ms
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Real-Time Inference Latency
              </div>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-emerald-400 tabular-nums">
                4.8x ROI
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Estimated Enterprise Savings
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
