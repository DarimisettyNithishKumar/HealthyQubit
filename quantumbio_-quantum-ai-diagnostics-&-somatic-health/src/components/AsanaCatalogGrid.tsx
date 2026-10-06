import React, { useState } from 'react';
import { ANATOMY_CATALOG } from '../data/anatomyCatalog';
import { BodyPartData } from '../types';
import { Play, Wind, ShieldAlert, Sparkles, Filter } from 'lucide-react';

interface AsanaCatalogGridProps {
  onSelectAsana: (region: BodyPartData) => void;
  onLaunchPractice: (region: BodyPartData) => void;
}

export const AsanaCatalogGrid: React.FC<AsanaCatalogGridProps> = ({
  onSelectAsana,
  onLaunchPractice,
}) => {
  const [filterIntensity, setFilterIntensity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredRegions = ANATOMY_CATALOG.filter((region) => {
    const matchesIntensity =
      filterIntensity === 'all' ||
      region.primaryAsana.intensity.toLowerCase() === filterIntensity.toLowerCase();
    const matchesSearch =
      region.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      region.primaryAsana.sanskrit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      region.primaryAsana.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
      region.anatomicalArea.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesIntensity && matchesSearch;
  });

  return (
    <section id="asana-catalog" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-teal-400 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>THERAPEUTIC SOMATIC PHARMACOPOEIA</span>
            <span aria-hidden="true">·</span>
            <span>EVIDENCE-BASED ASANA PROTOCOLS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            Therapeutic Yoga Asana Library
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Prescriptive yoga postures targeted for occupational musculoskeletal disorders, desk fatigue, and autonomic regulation.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <input
            type="text"
            placeholder="Search asana or symptom..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />

          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
            {['all', 'restorative', 'gentle', 'moderate', 'dynamic'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterIntensity(lvl)}
                className={`px-2.5 py-1 text-xs font-medium rounded capitalize transition-colors ${
                  filterIntensity === lvl
                    ? 'bg-teal-500 text-slate-950 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Asana Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRegions.map((region) => {
          const asana = region.primaryAsana;
          return (
            <div
              key={region.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all rounded-xl p-6 flex flex-col justify-between group"
            >
              <div>
                {/* Card header kicker */}
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                  <span className="text-teal-400">{region.label}</span>
                  <span>{asana.intensity}</span>
                </div>

                {/* Asana Name */}
                <h3 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors">
                  {asana.sanskrit}
                </h3>
                <div className="text-xs text-slate-300 font-medium mb-3">
                  {asana.english}
                </div>

                {/* Breathing & Duration */}
                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono py-2 border-y border-slate-800/80 mb-3">
                  <span className="flex items-center gap-1">
                    <Wind className="w-3.5 h-3.5 text-teal-400" />
                    <span>{asana.breathingRatio.split('(')[0].trim()}</span>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{Math.floor(asana.durationSeconds / 60)} min</span>
                </div>

                {/* Biomechanical summary */}
                <p className="text-xs text-slate-300 line-clamp-3 mb-4 leading-relaxed">
                  {asana.biomechanicalAction}
                </p>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectAsana(region)}
                  className="text-xs text-teal-400 hover:text-teal-300 font-medium"
                >
                  View Anatomy Mapping
                </button>

                <button
                  onClick={() => onLaunchPractice(region)}
                  className="px-3 py-1.5 bg-teal-400 hover:bg-teal-300 text-slate-950 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Practice</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
