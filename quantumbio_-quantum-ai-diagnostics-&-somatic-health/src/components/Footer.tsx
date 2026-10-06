import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="font-semibold text-slate-300">QuantumBio Health & Biomedical Diagnostics</span>
          <span className="block text-slate-400 text-[11px] mt-0.5">
            Quantum Molecular AI and Somatosensory Biomechanical Therapeutics
          </span>
        </div>

        <div className="flex items-center gap-6">
          <a href="#interactive-anatomy" className="hover:text-slate-200 transition-colors">
            Interactive Anatomy
          </a>
          <a href="#quantum-diagnostics" className="hover:text-slate-200 transition-colors">
            Diagnostics Engine
          </a>
          <a href="#mnc-presentation" className="hover:text-slate-200 transition-colors">
            MNC Pitch Deck
          </a>
        </div>

        <div className="text-slate-400 text-[11px]">
          Clinical Decision Support System · For Educational & Preventive Health
        </div>
      </div>
    </footer>
  );
};
