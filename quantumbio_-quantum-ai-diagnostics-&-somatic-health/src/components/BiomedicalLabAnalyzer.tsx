import React, { useState } from 'react';
import { BiomarkerItem, BodyPartData } from '../types';
import { ANATOMY_CATALOG } from '../data/anatomyCatalog';
import { 
  Activity, 
  FlaskConical, 
  AlertTriangle, 
  CheckCircle2, 
  Heart, 
  Sparkles, 
  Sliders, 
  Download, 
  Filter, 
  TrendingUp, 
  TrendingDown,
  Play,
  Apple,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';

interface BiomedicalLabAnalyzerProps {
  onStartPractice: (region: BodyPartData) => void;
}

export const BiomedicalLabAnalyzer: React.FC<BiomedicalLabAnalyzerProps> = ({
  onStartPractice,
}) => {
  // Preset Patient Clinical States
  const [selectedPreset, setSelectedPreset] = useState<'executive' | 'metabolic' | 'optimal' | 'custom'>('executive');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedBiomarkerId, setSelectedBiomarkerId] = useState<string>('il6');

  // Baseline biomarker data
  const defaultBiomarkers: BiomarkerItem[] = [
    {
      id: 'il6',
      name: 'Interleukin-6 (IL-6)',
      category: 'Inflammatory Cytokines',
      value: 7.4,
      unit: 'pg/mL',
      optimalMin: 0.5,
      optimalMax: 2.5,
      criticalThreshold: 10.0,
      status: 'Elevated',
      clinicalMeaning: 'Pro-inflammatory cytokine driving myofascial stiffness, vascular hyper-reactivity, and chronic fatigue.',
      somaticYogaProtocol: 'Matsyasana (Fish Pose) & Bhramari Humming Vagal Stimulation',
      nutraceuticalRecommendation: 'High-bioavailability Curcumin (95% curcuminoids) with Piperine · 1000mg/day',
    },
    {
      id: 'hscrp',
      name: 'High-Sensitivity CRP (hs-CRP)',
      category: 'Inflammatory Cytokines',
      value: 3.8,
      unit: 'mg/L',
      optimalMin: 0.1,
      optimalMax: 1.0,
      criticalThreshold: 5.0,
      status: 'Elevated',
      clinicalMeaning: 'Hepatic acute-phase reactant indicating vascular endothelium inflammation and prolonged ergonomic musculoskeletal distress.',
      somaticYogaProtocol: 'Setu Bandhasana (Supported Bridge Pose) with Deep Diaphragmatic Breath',
      nutraceuticalRecommendation: 'Omega-3 EPA/DHA Resolvins · 2500mg daily (1.5:1 EPA:DHA ratio)',
    },
    {
      id: 'tnfa',
      name: 'Tumor Necrosis Factor-α (TNF-α)',
      category: 'Inflammatory Cytokines',
      value: 6.2,
      unit: 'pg/mL',
      optimalMin: 0.8,
      optimalMax: 3.0,
      criticalThreshold: 8.5,
      status: 'Elevated',
      clinicalMeaning: 'Macrophage signaling cytokine mediating articular cartilage catabolism and synovial lining hyper-permeability.',
      somaticYogaProtocol: 'Bhujangasana (Gentle Cobra Pose) to decompress anterior chest fascia',
      nutraceuticalRecommendation: 'EGCG Green Tea Epigallocatechin Gallate · 400mg standardized extract',
    },
    {
      id: 'cortisol',
      name: 'Morning Serum Cortisol (AM)',
      category: 'Neuro-Endocrine & Stress',
      value: 23.6,
      unit: 'μg/dL',
      optimalMin: 7.0,
      optimalMax: 18.0,
      criticalThreshold: 28.0,
      status: 'Elevated',
      clinicalMeaning: 'Adrenal glucocorticoid hyper-secretion reflecting severe sympathetic autonomic dominance and corporate burnout loop.',
      somaticYogaProtocol: 'Viparita Karani (Inverted Legs-Up-The-Wall) & 4-7-8 Parasympathetic Pacing',
      nutraceuticalRecommendation: 'Sensoril Ashwagandha (Withania somnifera) · 600mg before sleep',
    },
    {
      id: 'bdnf',
      name: 'Brain-Derived Neurotrophic Factor (BDNF)',
      category: 'Neuro-Endocrine & Stress',
      value: 16.2,
      unit: 'ng/mL',
      optimalMin: 22.0,
      optimalMax: 45.0,
      criticalThreshold: 12.0,
      status: 'Borderline',
      clinicalMeaning: 'Suppressed neuroplasticity and hippocampal neurogenesis from prolonged desk sedentary screen overload.',
      somaticYogaProtocol: 'Sirsasana (Headstand Preparation) or Supported Downward Dog (Adho Mukha Svanasana)',
      nutraceuticalRecommendation: 'L-Theanine with Lion’s Mane (Hericium erinaceus) · 500mg morning',
    },
    {
      id: 'homocysteine',
      name: 'Homocysteine (Plasma)',
      category: 'Neuro-Endocrine & Stress',
      value: 12.8,
      unit: 'μmol/L',
      optimalMin: 4.0,
      optimalMax: 9.0,
      criticalThreshold: 15.0,
      status: 'Elevated',
      clinicalMeaning: 'Impaired sulfur-amino acid remethylation; correlates with cerebral microvascular stiffness and cervical headaches.',
      somaticYogaProtocol: 'Ardha Matsyendrasana (Spinal Twist) stimulating mesenteric and hepatic venous return',
      nutraceuticalRecommendation: 'Bioactive L-5-Methyltetrahydrofolate (5-MTHF) & Methylcobalamin B12',
    },
    {
      id: 'hba1c',
      name: 'Hemoglobin A1c (HbA1c)',
      category: 'Metabolic & Glycemic',
      value: 5.8,
      unit: '%',
      optimalMin: 4.5,
      optimalMax: 5.4,
      criticalThreshold: 6.5,
      status: 'Borderline',
      clinicalMeaning: 'Insulin receptor desensitization and advanced glycation end-products (AGEs) crosslinking spinal fascial tissue.',
      somaticYogaProtocol: 'Utkatasana (Chair Pose) & Warrior II for deep myofibrillar GLUT4 glucose uptake',
      nutraceuticalRecommendation: 'Berberine Phytosome (500mg twice daily with meals) + Ceylon Cinnamon',
    },
    {
      id: 'fastingInsulin',
      name: 'Fasting Insulin',
      category: 'Metabolic & Glycemic',
      value: 11.4,
      unit: 'μIU/mL',
      optimalMin: 2.0,
      optimalMax: 6.0,
      criticalThreshold: 18.0,
      status: 'Borderline',
      clinicalMeaning: 'Compensatory hyperinsulinemia driving visceral fat storage and slow lymphatic clearance.',
      somaticYogaProtocol: 'Navasana (Boat Pose) & Agnisara Kriya to ignite deep abdominal metabolic agni',
      nutraceuticalRecommendation: 'Alpha-Lipoic Acid (R-ALA 300mg) with Magnesium Glycinate',
    },
    {
      id: 'apob',
      name: 'Apolipoprotein B (ApoB)',
      category: 'Cardiovascular & Lipids',
      value: 104,
      unit: 'mg/dL',
      optimalMin: 50,
      optimalMax: 80,
      criticalThreshold: 120,
      status: 'Elevated',
      clinicalMeaning: 'Atherogenic particle count reflecting arterial shear stress and small-dense LDL retention.',
      somaticYogaProtocol: 'Surya Namaskar (Sun Salutations) moderate-paced aerobic-flow sequences',
      nutraceuticalRecommendation: 'Citrus Bergamot BPF Extract (1000mg/day) & Plant Sterols',
    },
    {
      id: 'troponin',
      name: 'High-Sensitivity Troponin I',
      category: 'Cardiovascular & Lipids',
      value: 3.1,
      unit: 'ng/L',
      optimalMin: 0.5,
      optimalMax: 5.0,
      criticalThreshold: 14.0,
      status: 'Optimal',
      clinicalMeaning: 'Zero myocardial ischemic micro-injury detected; cardiac myocytes exhibit healthy membrane integrity.',
      somaticYogaProtocol: 'Anahatasana (Melting Heart Pose) for gentle thoracic cardiopulmonary opening',
      nutraceuticalRecommendation: 'Coenzyme Q10 (Ubiquinol 100mg) for mitochondrial ATP electron transfer',
    },
    {
      id: 'alt',
      name: 'Alanine Aminotransferase (ALT)',
      category: 'Hepatic & Renal',
      value: 28,
      unit: 'U/L',
      optimalMin: 10,
      optimalMax: 35,
      criticalThreshold: 55,
      status: 'Optimal',
      clinicalMeaning: 'Hepatic transaminase activity within stable physiological clearance zone.',
      somaticYogaProtocol: 'Jathara Parivartanasana (Belly Twist) to promote biliary flow',
      nutraceuticalRecommendation: 'Milk Thistle (Silymarin 80% extract) · 250mg daily',
    },
    {
      id: 'egfr',
      name: 'eGFR Creatinine Clearance',
      category: 'Hepatic & Renal',
      value: 98,
      unit: 'mL/min',
      optimalMin: 90,
      optimalMax: 120,
      criticalThreshold: 60,
      status: 'Optimal',
      clinicalMeaning: 'Renal glomerular filtration and nitrogenous waste excretion operating at peak efficiency.',
      somaticYogaProtocol: 'Baddha Konasana (Bound Angle Pose) supporting pelvic and renal hemodynamics',
      nutraceuticalRecommendation: 'Hydration with electrolyte trace minerals and fulvic acid complexes',
    },
  ];

  const [biomarkers, setBiomarkers] = useState<BiomarkerItem[]>(defaultBiomarkers);

  // Apply preset clinical patient profiles
  const applyPreset = (preset: 'executive' | 'metabolic' | 'optimal' | 'custom') => {
    setSelectedPreset(preset);
    if (preset === 'executive') {
      setBiomarkers(defaultBiomarkers);
    } else if (preset === 'metabolic') {
      setBiomarkers((prev) =>
        prev.map((b) => {
          if (b.id === 'hba1c') return { ...b, value: 6.4, status: 'Elevated' };
          if (b.id === 'fastingInsulin') return { ...b, value: 16.8, status: 'Elevated' };
          if (b.id === 'il6') return { ...b, value: 5.2, status: 'Elevated' };
          if (b.id === 'cortisol') return { ...b, value: 18.5, status: 'Borderline' };
          return b;
        })
      );
    } else if (preset === 'optimal') {
      setBiomarkers((prev) =>
        prev.map((b) => ({
          ...b,
          value: Number(((b.optimalMin + b.optimalMax) / 2).toFixed(1)),
          status: 'Optimal',
        }))
      );
    }
  };

  // Update single biomarker value
  const handleValueChange = (id: string, newVal: number) => {
    setSelectedPreset('custom');
    setBiomarkers((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          let st: BiomarkerItem['status'] = 'Optimal';
          if (newVal >= b.criticalThreshold) st = 'Critical';
          else if (newVal > b.optimalMax) st = 'Elevated';
          else if (newVal > (b.optimalMax * 0.9)) st = 'Borderline';
          else if (newVal < b.optimalMin) st = 'Borderline';
          return { ...b, value: Number(newVal.toFixed(1)), status: st };
        }
        return b;
      })
    );
  };

  const filteredBiomarkers = biomarkers.filter((b) => {
    if (activeCategory === 'all') return true;
    return b.category === activeCategory;
  });

  const selectedBiomarker = biomarkers.find((b) => b.id === selectedBiomarkerId) || biomarkers[0];

  // Composite health scores
  const elevatedCount = biomarkers.filter((b) => b.status === 'Elevated' || b.status === 'Critical').length;
  const optimalCount = biomarkers.filter((b) => b.status === 'Optimal').length;
  const overallResilienceScore = Math.round((optimalCount / biomarkers.length) * 100);

  // Link to yoga practice
  const handleLaunchTargetedYoga = () => {
    // Find matching body region based on biomarker category
    let targetRegion = ANATOMY_CATALOG[1]; // default neck
    if (selectedBiomarker.category === 'Cardiovascular & Lipids') targetRegion = ANATOMY_CATALOG[3]; // chest
    if (selectedBiomarker.category === 'Metabolic & Glycemic') targetRegion = ANATOMY_CATALOG[4]; // gut
    if (selectedBiomarker.category === 'Neuro-Endocrine & Stress') targetRegion = ANATOMY_CATALOG[0]; // head
    if (selectedBiomarker.id === 'il6' || selectedBiomarker.id === 'hscrp') targetRegion = ANATOMY_CATALOG[5]; // back
    onStartPractice(targetRegion);
  };

  return (
    <section id="biomarker-lab" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-teal-400 mb-2">
            <FlaskConical className="w-4 h-4" />
            <span>MNC ENTERPRISE CLINICAL LABORATORY DIAGNOSTICS</span>
            <span aria-hidden="true">·</span>
            <span>CYTOKINE & METABOLIC BIOMARKER ENGINE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            Clinical Laboratory & Biomarker Analyzer
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Inspect systemic inflammatory cytokines, lipid fractionation, neuro-endocrine stress hormones, and glycemic profiles. Interactively adjust values or test enterprise health profiles to generate targeted Somatic Yoga and biochemical nutraceutical protocols.
          </p>
        </div>

        {/* Preset Patient Profile Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg self-start md:self-auto">
          <button
            onClick={() => applyPreset('executive')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              selectedPreset === 'executive'
                ? 'bg-teal-400 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Corporate Strain Profile
          </button>
          <button
            onClick={() => applyPreset('metabolic')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              selectedPreset === 'metabolic'
                ? 'bg-teal-400 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Desk Fatigue / Glycemic
          </button>
          <button
            onClick={() => applyPreset('optimal')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              selectedPreset === 'optimal'
                ? 'bg-teal-400 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Optimal Baseline
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase">BIOLOGICAL HOMEOSTASIS INDEX</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-teal-300 font-mono">{overallResilienceScore}%</span>
            <span className="text-xs text-slate-400">Composite Score</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                overallResilienceScore > 75 ? 'bg-teal-400' : overallResilienceScore > 50 ? 'bg-amber-400' : 'bg-rose-500'
              }`}
              style={{ width: `${overallResilienceScore}%` }}
            />
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase">INFLAMMATORY BURDEN</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-400 font-mono">{elevatedCount} Biomarkers</span>
            <span className="text-xs text-slate-400">Out of Range</span>
          </div>
          <span className="text-[11px] text-slate-400 block pt-1">
            IL-6, hs-CRP & TNF-α Cytokine Load
          </span>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase">AUTONOMIC STRESS VECTOR</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-400 font-mono">Sympathetic Tilt</span>
            <span className="text-xs text-slate-400">Cortisol AM: 23.6μg/dL</span>
          </div>
          <span className="text-[11px] text-slate-400 block pt-1">
            Parasympathetic Vagal Restoration Indicated
          </span>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase">QUANTUM ATP METABOLISM FLUX</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-400 font-mono">88.4% Efficiency</span>
            <span className="text-xs text-slate-400">Electron Transport</span>
          </div>
          <span className="text-[11px] text-slate-400 block pt-1">
            Mitochondrial Coupling Optimal
          </span>
        </div>
      </div>

      {/* Main Split Grid: Left = Biomarker Panel Table & Sliders, Right = Selected Biomarker Action Rx */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ================= LEFT COLUMN: BIOMARKER PANELS (7 cols) ================= */}
        <div className="lg:col-span-7 space-y-4">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
            {['all', 'Inflammatory Cytokines', 'Neuro-Endocrine & Stress', 'Metabolic & Glycemic', 'Cardiovascular & Lipids', 'Hepatic & Renal'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  activeCategory === cat
                    ? 'bg-teal-400 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat === 'all' ? 'All Panels (12)' : cat.split('&')[0].trim()}
              </button>
            ))}
          </div>

          {/* Biomarkers List Cards */}
          <div className="space-y-3">
            {filteredBiomarkers.map((item) => {
              const isSelected = item.id === selectedBiomarker.id;
              const percentOfMax = Math.min(100, Math.max(0, (item.value / item.criticalThreshold) * 100));

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedBiomarkerId(item.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-teal-500 shadow-lg shadow-teal-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{item.name}</h4>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                            item.status === 'Optimal'
                              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                              : item.status === 'Borderline'
                              ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                              : 'bg-rose-950/80 text-rose-300 border border-rose-800 animate-pulse'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">{item.category}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-lg font-mono font-bold text-white">
                        {item.value} <span className="text-xs font-normal text-slate-400">{item.unit}</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 block">
                        Ref: {item.optimalMin} - {item.optimalMax} {item.unit}
                      </span>
                    </div>
                  </div>

                  {/* Range Visualizer Bar */}
                  <div className="space-y-1 pt-1">
                    <div className="relative w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          item.status === 'Optimal'
                            ? 'bg-emerald-400'
                            : item.status === 'Borderline'
                            ? 'bg-amber-400'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${percentOfMax}%` }}
                      />
                    </div>
                  </div>

                  {/* Interactive Slider for Custom Calibration */}
                  <div className="pt-2 flex items-center gap-3">
                    <span className="text-[10px] font-mono text-slate-400">ADJUST TEST VALUE:</span>
                    <input
                      type="range"
                      min={item.optimalMin * 0.4}
                      max={item.criticalThreshold * 1.3}
                      step={item.optimalMax > 20 ? 1 : 0.1}
                      value={item.value}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => handleValueChange(item.id, parseFloat(e.target.value))}
                      className="flex-1 accent-teal-400 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                    />
                    <span className="text-xs font-mono text-teal-300 w-14 text-right">
                      {item.value} {item.unit.split('/')[0]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= RIGHT COLUMN: CLINICAL DETAIL & THERAPEUTIC RX (5 cols) ================= */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 shadow-xl sticky top-20">
            {/* Header */}
            <div className="pb-4 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-teal-400 uppercase tracking-wider font-semibold">
                  CLINICAL BIOMARKER INTERPRETATION
                </span>
                <span
                  className={`text-xs font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    selectedBiomarker.status === 'Optimal'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : selectedBiomarker.status === 'Borderline'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-rose-500/20 text-rose-300'
                  }`}
                >
                  {selectedBiomarker.status}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mt-1">
                {selectedBiomarker.name}
              </h3>
              <p className="text-sm font-mono text-teal-300 mt-0.5">
                Current Level: {selectedBiomarker.value} {selectedBiomarker.unit}
              </p>
            </div>

            {/* Pathophysiological Mechanism */}
            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-lg space-y-1.5 text-xs">
              <span className="text-slate-300 font-semibold font-mono uppercase text-[11px] block text-cyan-400">
                PATHOPHYSIOLOGICAL MECHANISM:
              </span>
              <p className="text-slate-200 leading-relaxed">
                {selectedBiomarker.clinicalMeaning}
              </p>
            </div>

            {/* Prescribed Somatic Yoga Protocol */}
            <div className="p-4 bg-teal-950/30 border border-teal-500/40 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-teal-300 text-xs font-mono font-bold">
                  <Activity className="w-4 h-4 text-teal-400" />
                  <span>TARGETED SOMATIC YOGA RX</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-teal-400 text-slate-950 rounded font-bold">
                  CYTOKINE MODULATION
                </span>
              </div>

              <p className="text-xs text-slate-200 font-medium">
                {selectedBiomarker.somaticYogaProtocol}
              </p>

              <button
                onClick={handleLaunchTargetedYoga}
                className="w-full py-2 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md shadow-teal-500/20"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Launch Guided Asana Studio</span>
              </button>
            </div>

            {/* Targeted Nutraceutical Prescription */}
            <div className="p-4 bg-purple-950/20 border border-purple-500/40 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-purple-300 text-xs font-mono font-bold">
                <Apple className="w-4 h-4 text-purple-400" />
                <span>BIOACTIVE NUTRACEUTICAL PRESCRIPTION</span>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed">
                {selectedBiomarker.nutraceuticalRecommendation}
              </p>
            </div>

            {/* Reference Range Legend */}
            <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
              <div className="flex justify-between">
                <span>Optimal Homeostatic Range:</span>
                <span className="text-emerald-400 font-semibold">{selectedBiomarker.optimalMin} - {selectedBiomarker.optimalMax} {selectedBiomarker.unit}</span>
              </div>
              <div className="flex justify-between">
                <span>Critical Pathological Threshold:</span>
                <span className="text-rose-400 font-semibold">&gt; {selectedBiomarker.criticalThreshold} {selectedBiomarker.unit}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
