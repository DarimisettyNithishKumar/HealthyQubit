import React, { useState, useEffect } from 'react';
import { ANATOMY_CATALOG } from '../data/anatomyCatalog';
import { BodyPartData, BodyRegion, InnerStructureKeyPoint } from '../types';
import { usePatientHealth } from '../context/PatientHealthContext';
import { 
  Activity, 
  Layers, 
  Eye, 
  EyeOff,
  Play, 
  Bookmark, 
  BookmarkCheck, 
  Sparkles, 
  ShieldCheck, 
  Apple, 
  Heart, 
  Wind, 
  Zap, 
  CheckCircle2, 
  Maximize2,
  Check,
  Box,
  Compass,
  X,
  Flame,
  Info,
  Sliders,
  SlidersHorizontal,
  Cpu
} from 'lucide-react';
import { ThreeDimensionalBodyCanvas, AnatomicalLayerType } from './ThreeDimensionalBodyCanvas';
import { SystemWireframeOverlay, WireframeSystem } from './SystemWireframeOverlay';

interface TextbookAnatomyExplorerProps {
  onStartPractice: (region: BodyPartData) => void;
  selectedRegionId?: BodyRegion;
  onSelectRegion?: (region: BodyPartData) => void;
}

type InnerStructureTab = 'cross-section' | 'muscles' | 'joints' | 'nerves' | 'quantum';

const WIREFRAME_SYSTEM_DESCRIPTIONS: Record<
  BodyRegion,
  { skeletal: string; muscular: string; nervous: string }
> = {
  head: {
    skeletal:
      'Cranial Vault Calvaria dome, Coronal & Sagittal Sutures, Orbit Rims, Zygomatic Arches & Mandibular TMJ Condyles',
    muscular:
      'Temporalis radiating fan vectors, Frontalis vertical myofibrils & Masseter chewing power chevrons',
    nervous:
      'Trigeminal Nerve CN-V (V1 ophthalmic, V2 maxillary, V3 mandibular), Circle of Willis arterial ring & Cortical Synaptic Nodes',
  },
  neck: {
    skeletal:
      'C1 (Atlas) ring & C2 (Axis) dens, C3-C7 vertebral column stack with disc cushion spacers & Lordosis curve axis',
    muscular:
      'Sternocleidomastoid (SCM) diagonal sheath vectors, Scalene triad (ant/med/post) & Levator Scapulae posterior web',
    nervous:
      'Cervical spinal cord central conduit, C1-C8 radicular root outlets & bilateral descending Vagus Nerve tracks',
  },
  chest: {
    skeletal:
      'Manubrium, Sternal Body, Xiphoid process & Ribs 1-8 bucket-handle costal arches with thoracic axis',
    muscular:
      'Pectoralis Major clavicular/sternal vectors, Intercostal myofascial cross-hatch & Diaphragmatic dome arch',
    nervous:
      'Sympathetic paravertebral chain, Intercostal nerve radicles & Cardiac autonomic plexus',
  },
  shoulders: {
    skeletal:
      'Clavicular S-strut, Acromion shelf, Coracoid process hook, Glenoid Cavity labrum & Humeral Head geodesic sphere',
    muscular:
      'Supraspinatus tendon subacromial tunnel, Infraspinatus & Teres Minor posterior convergent vectors',
    nervous:
      'Brachial plexus trunks, Suprascapular nerve supraspinatus notch & Axillary circumflex sensory arc',
  },
  back: {
    skeletal:
      'L1-L5 lumbar vertebrae stack, Lordotic curvature axis, Nucleus pulposus disc spacers & Facet joints',
    muscular:
      'Erector Spinae longitudinal columns (Longissimus/Iliocostalis), Multifidus rotators & Thoracolumbar fascia',
    nervous:
      'Cauda Equina filament cascade, L4-S1 sciatic nerve roots & Dorsal root ganglia outlets',
  },
  gut: {
    skeletal:
      'Thoracolumbar junction, Costal margin 11th-12th floating rib support & L1-L3 transverse processes',
    muscular:
      'Rectus Abdominis tendinous intersections, Transverse Abdominis girdle & External Oblique slings',
    nervous:
      'Enteric nervous system (Auerbach & Meissner plexuses), Celiac mesenteric ganglion & Splanchnic fibers',
  },
  pelvis: {
    skeletal:
      'Iliac Crest flange, Sacroiliac Joint articulations, Acetabular labrum cup & Femoral Head ball-and-socket',
    muscular:
      'Iliopsoas deep hip flexor vector, Piriformis pelvic bridge & Gluteus Medius abductor fans',
    nervous:
      'Lumbosacral trunk, Sciatic nerve greater sciatic notch exit & Pudendal neural arc',
  },
  knees: {
    skeletal:
      'Distal Femoral condyles, Tibial plateau, Patellar trochlear groove & Medial/Lateral C-shaped meniscal rings',
    muscular:
      'Quadriceps retinacular tendon, Patellar ligament, Popliteus unlock rotator & Hamstring insertions',
    nervous:
      'Tibial nerve popliteal fossa descent, Common Peroneal nerve fibular neck wrap & Saphenous nerve branches',
  },
  feet: {
    skeletal:
      'Talus trochlea saddle, Calcaneus heel cantilever, Navicular/Cuneiform midfoot arch & 5 Metatarsal rays',
    muscular:
      'Achilles tendon high-tensile ribbon, Plantar Fascia longitudinal fan (Windlass mechanism) & Intrinsic arch tensors',
    nervous:
      'Tibial nerve tarsal tunnel conduit, Medial & Lateral Plantar nerve division & Digital sensory branches',
  },
};

export const TextbookAnatomyExplorer: React.FC<TextbookAnatomyExplorerProps> = ({
  onStartPractice,
  selectedRegionId = 'neck',
  onSelectRegion,
}) => {
  const { 
    preferredPractices, 
    toggleFavoritePractice, 
    bookmarkedFoods, 
    toggleBookmarkFood,
  } = usePatientHealth();

  const [viewMode, setViewMode] = useState<'3d-canvas' | 'atlas-plate'>('3d-canvas');
  const [activeLayer, setActiveLayer] = useState<AnatomicalLayerType>('muscular');
  const [currentRegionId, setCurrentRegionId] = useState<BodyRegion>(selectedRegionId);
  const [rightActiveTab, setRightActiveTab] = useState<'yoga' | 'nutrition'>('yoga');
  const [innerStructureTab, setInnerStructureTab] = useState<InnerStructureTab>('cross-section');
  const [wireframeSystem, setWireframeSystem] = useState<WireframeSystem>('skeletal');
  const [wireframeOpacity, setWireframeOpacity] = useState<number>(0.85);
  const [isWireframePulse, setIsWireframePulse] = useState<boolean>(true);
  const [activeKeyPoint, setActiveKeyPoint] = useState<InnerStructureKeyPoint | null>(null);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState<boolean>(false);
  const [savedAlert, setSavedAlert] = useState<string | null>(null);

  // Synchronize when selectedRegionId prop updates from parent
  useEffect(() => {
    if (selectedRegionId) {
      setCurrentRegionId(selectedRegionId);
      setActiveKeyPoint(null);
    }
  }, [selectedRegionId]);

  const region = ANATOMY_CATALOG.find((r) => r.id === currentRegionId) || ANATOMY_CATALOG[1];

  const handleSelect = (r: BodyPartData) => {
    setCurrentRegionId(r.id);
    setActiveKeyPoint(null);
    if (onSelectRegion) onSelectRegion(r);
  };

  const handleWireframeToggle = (system: WireframeSystem) => {
    setWireframeSystem(system);
    // Optionally synchronize with 3D canvas active layer
    if (system === 'skeletal') {
      setActiveLayer('skeletal');
    } else if (system === 'muscular') {
      setActiveLayer('muscular');
    } else if (system === 'nervous') {
      setActiveLayer('nervous');
    }
  };

  const handleLayerChange = (layer: AnatomicalLayerType) => {
    setActiveLayer(layer);
    if (layer === 'skeletal') setWireframeSystem('skeletal');
    else if (layer === 'muscular') setWireframeSystem('muscular');
    else if (layer === 'nervous') setWireframeSystem('nervous');
  };

  const isPracticeSaved = preferredPractices.some((p) => p.asanaId === region.id && p.isFavorite);

  const handleSavePractice = () => {
    toggleFavoritePractice(region.id);
    setSavedAlert(`Saved ${region.primaryAsana.sanskrit} to your Preferred Practices!`);
    setTimeout(() => setSavedAlert(null), 3000);
  };

  // Dedicated inner structure illustration for this specific body part
  const currentInnerImage = region.innerStructureImage || '/src/assets/images/inner_neck_cervical_1791267517154.jpg';
  const keyPoints = region.innerStructureKeyPoints || [];

  return (
    <section id="textbook-anatomy" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-teal-400 mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>GRAY'S & NETTER CLINICAL ATLAS STANDARD</span>
            <span aria-hidden="true">·</span>
            <span>360° INTERACTIVE 3D BODY & DEEP INNER TISSUE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            Clinical Anatomical Explorer: Inner Structure, Yoga & Nutrition
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Inspect the complete human body in 360° rotation on the left. Click any sector to explore its dedicated deep inner muscles, articular joints, and nerves, paired with targeted therapeutic Yogas and biochemical healing nutrition on the right.
          </p>
        </div>

        {/* View Mode Toggle: 3D Body Canvas (360°) vs 2D Atlas Plate */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
            <button
              onClick={() => setViewMode('3d-canvas')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                viewMode === '3d-canvas'
                  ? 'bg-teal-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>3D Body (360° Drag)</span>
            </button>
            <button
              onClick={() => setViewMode('atlas-plate')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                viewMode === 'atlas-plate'
                  ? 'bg-teal-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>2D Atlas Plate</span>
            </button>
          </div>
        </div>
      </div>

      {savedAlert && (
        <div className="mb-6 p-3 bg-teal-950/40 border border-teal-500/50 rounded-lg text-xs text-teal-300 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
          <span>{savedAlert}</span>
        </div>
      )}

      {/* Main Split Grid: Left = 360° Body & Dedicated Inner Structure, Right = Yoga & Healing Foods */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ================= LEFT COLUMN: 360° HUMAN BODY & DEDICATED INNER STRUCTURE (5 cols) ================= */}
        <div className="lg:col-span-5 space-y-6">
          {viewMode === '3d-canvas' ? (
            /* 1. Real-Time 360° Rotatable Three.js Human Body Canvas */
            <ThreeDimensionalBodyCanvas
              selectedRegionId={region.id}
              onSelectRegion={handleSelect}
              activeLayer={activeLayer}
              onLayerChange={handleLayerChange}
            />
          ) : (
            /* 2. Medical 2D Full Body Atlas Plate with Interactive Hotspot Pins */
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden flex flex-col items-center">
              <div className="w-full flex items-center justify-between text-[11px] font-mono text-slate-400 pb-3 mb-2 border-b border-slate-800">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                  <span>FULL 3D ANATOMICAL PLATE: 9 INTERACTIVE SECTORS</span>
                </span>
                <span className="text-teal-400 font-semibold">{region.label.split(' ')[0]} SELECTED</span>
              </div>

              {/* Realistic Complete 3D Human Body Render Plate */}
              <div className="relative w-full max-w-[340px] aspect-[3/4] rounded-lg overflow-hidden border border-slate-800/80 bg-slate-950 flex items-center justify-center select-none shadow-inner">
                <img
                  src="/src/assets/images/full_3d_body_atlas_1791267646043.jpg"
                  alt="Full body complete 3D medical anatomy model showing muscular and skeletal systems"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />

                {/* Subtle vignette gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40 pointer-events-none" />

                {/* Hotspot Pins overlaid across the full anatomical body */}
                {ANATOMY_CATALOG.map((item) => {
                  const coords = item.anteriorCoordinates;
                  const isSelected = item.id === region.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      style={{
                        left: `${coords.x}%`,
                        top: `${coords.y}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                      className="absolute z-20 group focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded-full"
                      aria-label={`Select ${item.label}`}
                    >
                      <div className="relative flex items-center justify-center">
                        <div
                          className={`absolute w-8 h-8 rounded-full transition-all duration-300 ${
                            isSelected
                              ? 'bg-teal-400/40 scale-125 animate-ping'
                              : 'bg-transparent group-hover:bg-cyan-400/20 group-hover:scale-110'
                          }`}
                        />
                        <div
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-tight border shadow-lg flex items-center gap-1 transition-all ${
                            isSelected
                              ? 'bg-teal-400 text-slate-950 border-white scale-110 shadow-teal-500/50'
                              : 'bg-slate-900/90 text-teal-300 border-teal-500/60 hover:bg-teal-500 hover:text-slate-950 hover:scale-105'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-slate-950' : 'bg-teal-400'}`} />
                          <span>{item.label.split(' ')[0]}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Horizontal Region Quick-Chips */}
              <div className="w-full mt-4 pt-3 border-t border-slate-800">
                <span className="text-[11px] font-mono text-slate-400 block mb-2">
                  SELECT BODY SECTOR:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {ANATOMY_CATALOG.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      className={`text-xs px-2.5 py-1 rounded transition-colors ${
                        item.id === region.id
                          ? 'bg-teal-500 text-slate-950 font-semibold'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      {item.label.split('&')[0].trim()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= DEDICATED INNER STRUCTURE CROSS-SECTION & DEEP ANATOMY ================= */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
            {/* Header with Region Title & Cross-Section Tag */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Inner Anatomical Structure: {region.label}
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-cyan-950/60 text-cyan-300 border border-cyan-800/60 rounded">
                DEDICATED CROSS-SECTION
              </span>
            </div>

            {/* Interactive Wireframe System Control Panel */}
            <div className="p-3.5 bg-slate-950/90 rounded-xl border border-slate-800/90 space-y-3 shadow-inner">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-teal-400" />
                  <span className="text-[11px] font-mono font-bold tracking-wider text-slate-200 uppercase">
                    ANATOMICAL WIREFRAME SYSTEM:
                  </span>
                </div>
                
                {/* Opacity slider & Pulse toggle */}
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                  <span className="hidden sm:inline">OPACITY:</span>
                  <input
                    type="range"
                    min="0.2"
                    max="1"
                    step="0.05"
                    value={wireframeOpacity}
                    onChange={(e) => setWireframeOpacity(parseFloat(e.target.value))}
                    className="w-16 sm:w-20 accent-teal-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                    title={`Wireframe Opacity: ${Math.round(wireframeOpacity * 100)}%`}
                  />
                  <span className="w-7 text-right text-teal-300 font-semibold">{Math.round(wireframeOpacity * 100)}%</span>
                  
                  <button
                    onClick={() => setIsWireframePulse(!isWireframePulse)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-colors ${
                      isWireframePulse
                        ? 'bg-teal-500/20 text-teal-300 border-teal-500/50'
                        : 'bg-slate-900 text-slate-500 border-slate-800'
                    }`}
                    title="Toggle bioluminescent pulse glow animation"
                  >
                    Pulse {isWireframePulse ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>

              {/* Wireframe System Toggles: Skeletal, Muscular, Nervous, Pure Photo */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {/* 1. SKELETAL */}
                <button
                  onClick={() => handleWireframeToggle('skeletal')}
                  className={`p-2 rounded-lg border text-left transition-all flex flex-col justify-between ${
                    wireframeSystem === 'skeletal'
                      ? 'bg-sky-500 text-slate-950 border-sky-300 shadow-md shadow-sky-500/20 font-bold'
                      : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-sky-500/50 hover:text-sky-300'
                  }`}
                  aria-pressed={wireframeSystem === 'skeletal'}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-[11px] font-mono uppercase tracking-tight">Skeletal</span>
                    <ShieldCheck className={`w-3.5 h-3.5 ${wireframeSystem === 'skeletal' ? 'text-slate-950' : 'text-sky-400'}`} />
                  </div>
                  <span className={`text-[10px] leading-tight ${wireframeSystem === 'skeletal' ? 'text-slate-900 font-medium' : 'text-slate-400'}`}>
                    Bones & Articulations
                  </span>
                </button>

                {/* 2. MUSCULAR */}
                <button
                  onClick={() => handleWireframeToggle('muscular')}
                  className={`p-2 rounded-lg border text-left transition-all flex flex-col justify-between ${
                    wireframeSystem === 'muscular'
                      ? 'bg-rose-500 text-white border-rose-300 shadow-md shadow-rose-500/20 font-bold'
                      : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-rose-500/50 hover:text-rose-300'
                  }`}
                  aria-pressed={wireframeSystem === 'muscular'}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-[11px] font-mono uppercase tracking-tight">Muscular</span>
                    <Activity className={`w-3.5 h-3.5 ${wireframeSystem === 'muscular' ? 'text-white' : 'text-rose-400'}`} />
                  </div>
                  <span className={`text-[10px] leading-tight ${wireframeSystem === 'muscular' ? 'text-rose-100 font-medium' : 'text-slate-400'}`}>
                    Myofascial Vectors
                  </span>
                </button>

                {/* 3. NERVOUS */}
                <button
                  onClick={() => handleWireframeToggle('nervous')}
                  className={`p-2 rounded-lg border text-left transition-all flex flex-col justify-between ${
                    wireframeSystem === 'nervous'
                      ? 'bg-amber-400 text-slate-950 border-amber-200 shadow-md shadow-amber-400/20 font-bold'
                      : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-amber-500/50 hover:text-amber-300'
                  }`}
                  aria-pressed={wireframeSystem === 'nervous'}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-[11px] font-mono uppercase tracking-tight">Nervous</span>
                    <Zap className={`w-3.5 h-3.5 ${wireframeSystem === 'nervous' ? 'text-slate-950' : 'text-amber-400'}`} />
                  </div>
                  <span className={`text-[10px] leading-tight ${wireframeSystem === 'nervous' ? 'text-slate-900 font-medium' : 'text-slate-400'}`}>
                    Neural Plexus & Axons
                  </span>
                </button>

                {/* 4. OFF / PURE PHOTO */}
                <button
                  onClick={() => handleWireframeToggle('none')}
                  className={`p-2 rounded-lg border text-left transition-all flex flex-col justify-between ${
                    wireframeSystem === 'none'
                      ? 'bg-slate-800 text-white border-slate-600 shadow-sm font-bold'
                      : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                  }`}
                  aria-pressed={wireframeSystem === 'none'}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-[11px] font-mono uppercase tracking-tight">Off</span>
                    <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <span className="text-[10px] text-slate-400 leading-tight">
                    Pure Tissue Slice
                  </span>
                </button>
              </div>

              {/* Dynamic Anatomical System Descriptor Banner (Updates dynamically as region changes!) */}
              <div className="p-2.5 rounded-lg border text-xs leading-relaxed transition-all flex items-start gap-2 bg-slate-900/80 border-slate-800">
                <span className="shrink-0 mt-0.5">
                  {wireframeSystem === 'skeletal' && <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block shadow-[0_0_8px_#38bdf8]" />}
                  {wireframeSystem === 'muscular' && <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block shadow-[0_0_8px_#f43f5e]" />}
                  {wireframeSystem === 'nervous' && <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block shadow-[0_0_8px_#eab308]" />}
                  {wireframeSystem === 'none' && <span className="w-2.5 h-2.5 rounded-full bg-slate-500 inline-block" />}
                </span>
                <div className="flex-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider block mb-0.5 text-slate-200">
                    {wireframeSystem !== 'none'
                      ? `${region.label.toUpperCase()} · ${wireframeSystem.toUpperCase()} SYSTEM ARCHITECTURE:`
                      : `${region.label.toUpperCase()} · UNFILTERED CLINICAL SLICE:`}
                  </span>
                  <p className="text-[11px] text-slate-300">
                    {wireframeSystem !== 'none'
                      ? WIREFRAME_SYSTEM_DESCRIPTIONS[region.id][wireframeSystem]
                      : `Displaying clinical cross-section of ${region.label} (${region.anatomicalArea}) without vector overlays. Click 'Skeletal', 'Muscular', or 'Nervous' to project vector wireframes.`}
                  </p>
                </div>
              </div>
            </div>

            {/* Inner Structure Sub-Tabs */}
            <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800">
              <button
                onClick={() => setInnerStructureTab('cross-section')}
                className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors ${
                  innerStructureTab === 'cross-section'
                    ? 'bg-teal-400 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Cross-Section & Wireframe
              </button>
              <button
                onClick={() => setInnerStructureTab('muscles')}
                className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors ${
                  innerStructureTab === 'muscles'
                    ? 'bg-teal-400 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Deep Muscles ({region.innerStructure.muscles.length})
              </button>
              <button
                onClick={() => setInnerStructureTab('joints')}
                className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors ${
                  innerStructureTab === 'joints'
                    ? 'bg-teal-400 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Articular Joints ({region.innerStructure.joints.length})
              </button>
              <button
                onClick={() => setInnerStructureTab('nerves')}
                className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors ${
                  innerStructureTab === 'nerves'
                    ? 'bg-teal-400 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Innervation
              </button>
              <button
                onClick={() => setInnerStructureTab('quantum')}
                className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors ${
                  innerStructureTab === 'quantum'
                    ? 'bg-teal-400 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Cellular Matrix
              </button>
            </div>

            {/* TAB CONTENT A: DEDICATED CLINICAL CROSS-SECTION IMAGE WITH INTERACTIVE PIN LANDMARKS & WIREFRAME OVERLAY */}
            {innerStructureTab === 'cross-section' && (
              <div className="space-y-3">
                <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-950 aspect-[16/9] group">
                  {/* Distinct High-Resolution Medical Illustration for THIS Body Part */}
                  <img
                    src={currentInnerImage}
                    alt={`High-resolution clinical anatomical cross section of human ${region.label}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Dynamic Vector Wireframe Overlay for Selected Region & System */}
                  <SystemWireframeOverlay
                    regionId={region.id}
                    activeSystem={wireframeSystem}
                    opacity={wireframeOpacity}
                    animatedPulse={isWireframePulse}
                  />

                  {/* Active Wireframe HUD Badge */}
                  {wireframeSystem !== 'none' && (
                    <div className="absolute top-2.5 left-2.5 z-20 pointer-events-none">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-tight border shadow-md flex items-center gap-1.5 backdrop-blur-md ${
                        wireframeSystem === 'skeletal'
                          ? 'bg-sky-950/80 text-sky-300 border-sky-500/60'
                          : wireframeSystem === 'muscular'
                          ? 'bg-rose-950/80 text-rose-300 border-rose-500/60'
                          : 'bg-amber-950/80 text-amber-300 border-amber-500/60'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full animate-ping ${
                          wireframeSystem === 'skeletal'
                            ? 'bg-sky-400'
                            : wireframeSystem === 'muscular'
                            ? 'bg-rose-400'
                            : 'bg-amber-400'
                        }`} />
                        <span>{wireframeSystem.toUpperCase()} WIREFRAME ({Math.round(wireframeOpacity * 100)}%)</span>
                      </span>
                    </div>
                  )}

                  {/* Gradient bottom banner */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent p-3 flex items-end justify-between pointer-events-none">
                    <div className="text-xs font-mono text-slate-200">
                      <span className="text-teal-400 font-semibold">TISSUE ARCHITECTURE: </span>
                      <span>{region.anatomicalArea}</span>
                    </div>
                  </div>

                  {/* Magnify / Fullscreen Button */}
                  <button
                    onClick={() => setIsZoomModalOpen(true)}
                    className="absolute top-2.5 right-2.5 z-20 p-1.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 rounded-lg text-slate-300 hover:text-white shadow-md transition-colors"
                    title="Inspect High-Resolution Cross Section & Wireframe in Fullscreen"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Interactive Landmark Pins overlaid on the cross-section image */}
                  {keyPoints.map((pt, idx) => {
                    const isPtActive = activeKeyPoint?.label === pt.label;
                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveKeyPoint(isPtActive ? null : pt)}
                        style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                        className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 group/pin focus:outline-none"
                        title={pt.label}
                      >
                        <div className="relative flex items-center justify-center">
                          <span
                            className={`absolute w-6 h-6 rounded-full transition-all ${
                              isPtActive
                                ? 'bg-teal-400/50 scale-125 animate-ping'
                                : 'bg-transparent group-hover/pin:bg-cyan-400/30'
                            }`}
                          />
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold border shadow-lg transition-transform ${
                              isPtActive
                                ? 'bg-teal-400 text-slate-950 border-white scale-110 shadow-teal-500/50'
                                : 'bg-slate-900/90 text-teal-300 border-teal-500/80 hover:scale-110'
                            }`}
                          >
                            {idx + 1}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Active Landmark Detail Box (if clicked) */}
                {activeKeyPoint ? (
                  <div className="p-3 bg-teal-950/30 border border-teal-500/40 rounded-lg text-xs space-y-1 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-teal-300 flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5" />
                        <span>LANDMARK: {activeKeyPoint.label}</span>
                      </span>
                      <button
                        onClick={() => setActiveKeyPoint(null)}
                        className="text-slate-400 hover:text-white text-[11px]"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-slate-200 leading-relaxed text-[11px]">
                      {activeKeyPoint.description}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {keyPoints.map((pt, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveKeyPoint(pt)}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 hover:text-teal-300 hover:border-teal-500/50 transition-colors flex items-center gap-1"
                      >
                        <span className="w-3 h-3 rounded-full bg-teal-400/20 text-teal-400 inline-flex items-center justify-center text-[9px] font-bold">
                          {idx + 1}
                        </span>
                        <span>{pt.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT B: DEEP MUSCLES INVOLVED */}
            {innerStructureTab === 'muscles' && (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                <div className="text-xs font-mono text-teal-400 font-semibold flex items-center gap-1.5 uppercase tracking-wider">
                  <Activity className="w-3.5 h-3.5" />
                  <span>PRIMARY MUSCLES & MYOFASCIAL TISSUE</span>
                </div>
                <div className="space-y-2">
                  {region.innerStructure.muscles.map((muscle, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">{muscle.name}</span>
                        <span className="font-mono text-[11px] text-teal-300 italic">{muscle.latinName}</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed text-[11px]">{muscle.action}</p>
                      <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-slate-800">
                        <span>FIBER: {muscle.fiberType}</span>
                        <span>TRIGGER: {muscle.triggerPoints.split(';')[0]}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT C: JOINTS & ARTICULATIONS */}
            {innerStructureTab === 'joints' && (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                <div className="text-xs font-mono text-cyan-400 font-semibold flex items-center gap-1.5 uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>ARTICULAR JOINTS & CARTILAGE</span>
                </div>
                <div className="space-y-2">
                  {region.innerStructure.joints.map((joint, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-200">{joint.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{joint.jointType}</span>
                      </div>
                      <div className="text-[11px] text-slate-300">{joint.cartilageTissue}</div>
                      <div className="text-[10px] font-mono text-amber-400/90 pt-1 border-t border-slate-800">
                        VULNERABILITY: {joint.mechanicalVulnerability}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT D: INNERVATION & NERVES */}
            {innerStructureTab === 'nerves' && (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                <div className="text-xs font-mono text-amber-400 font-semibold flex items-center gap-1.5 uppercase tracking-wider">
                  <Zap className="w-3.5 h-3.5" />
                  <span>PERIPHERAL INNERVATION & NERVE PATHWAYS</span>
                </div>
                <div className="space-y-2">
                  {region.innerStructure.nerves.map((nerve, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-amber-300">{nerve.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{nerve.roots}</span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{nerve.pathways}</p>
                      <div className="text-[10px] font-mono text-rose-300/90 pt-1 border-t border-slate-800">
                        SOMATIC SYMPTOMS: {nerve.somaticSymptoms}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT E: QUANTUM CELLULAR MATRIX */}
            {innerStructureTab === 'quantum' && (
              <div className="space-y-3">
                <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-lg grid grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">FASCIAL TENSION FIELD</span>
                    <span className="text-sm font-semibold text-teal-300 tabular-nums">
                      {region.innerStructure.quantumFascialTension}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">ATP METABOLISM EFFICIENCY</span>
                    <span className="text-sm font-semibold text-emerald-400 tabular-nums">
                      {region.innerStructure.atpEfficiencyRate}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg text-xs space-y-1.5">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block font-semibold">
                    QUANTUM TARGET BIOMARKER:
                  </span>
                  <p className="text-slate-200 text-xs leading-relaxed">
                    {region.quantumTarget}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ================= RIGHT COLUMN: YOGA ASANAS & HEALING FOODS (7 cols) ================= */}
        <div className="lg:col-span-7 space-y-6">
          {/* Top Segmented Switcher: Yoga Asana vs Healing Foods */}
          <div className="flex items-center justify-between p-1.5 bg-slate-900 border border-slate-800 rounded-xl">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setRightActiveTab('yoga')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 ${
                  rightActiveTab === 'yoga'
                    ? 'bg-teal-400 text-slate-950 shadow-sm font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>Targeted Yoga Asanas</span>
              </button>
              <button
                onClick={() => setRightActiveTab('nutrition')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 ${
                  rightActiveTab === 'nutrition'
                    ? 'bg-teal-400 text-slate-950 shadow-sm font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Apple className="w-3.5 h-3.5 fill-current" />
                <span>Healing Foods & Nutrition</span>
              </button>
            </div>

            <span className="text-xs font-mono text-slate-400 pr-2 hidden sm:inline">
              TARGET: {region.label.toUpperCase()}
            </span>
          </div>

          {/* TAB 1: TARGETED YOGA ASANAS */}
          {rightActiveTab === 'yoga' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 shadow-xl">
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-teal-400 mb-1">
                    <span>PRIMARY POSTURAL THERAPY</span>
                    <span aria-hidden="true">·</span>
                    <span>{region.primaryAsana.intensity} INTENSITY</span>
                    <span aria-hidden="true">·</span>
                    <span>{region.primaryAsana.doshaAlignment}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {region.primaryAsana.sanskrit}
                  </h3>
                  <div className="text-xs text-teal-300 font-medium mt-0.5">
                    {region.primaryAsana.english}
                  </div>
                </div>

                {/* Top Action Buttons */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    onClick={handleSavePractice}
                    className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 border ${
                      isPracticeSaved
                        ? 'bg-teal-500/20 text-teal-300 border-teal-500/50'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                    }`}
                  >
                    {isPracticeSaved ? <BookmarkCheck className="w-3.5 h-3.5 text-teal-400" /> : <Bookmark className="w-3.5 h-3.5" />}
                    <span>{isPracticeSaved ? 'Preferred' : 'Save'}</span>
                  </button>

                  <button
                    onClick={() => onStartPractice(region)}
                    className="px-4 py-2 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-md shadow-teal-500/20 whitespace-nowrap"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Practice Guided Studio</span>
                  </button>
                </div>
              </div>

              {/* Respiratory Metronome Cadence Readout */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 text-slate-300">
                  <Wind className="w-4 h-4 text-teal-400" />
                  <span className="font-semibold text-teal-400">PRANAYAMA CADENCE:</span>
                  <span>{region.primaryAsana.breathingRatio}</span>
                </div>
                <span className="text-slate-400 font-bold">
                  {Math.floor(region.primaryAsana.durationSeconds / 60)} MIN HOLD
                </span>
              </div>

              {/* Biomechanical Vector Action */}
              <div className="p-4 bg-slate-950/60 rounded-lg border border-slate-800 text-xs">
                <span className="text-teal-400 font-semibold uppercase tracking-wider block mb-1">
                  BIOMECHANICAL VECTOR & DECOMPRESSION MECHANISM:
                </span>
                <p className="text-slate-200 leading-relaxed">
                  {region.primaryAsana.biomechanicalAction}
                </p>
              </div>

              {/* Step by Step Execution Instructions */}
              <div>
                <h4 className="text-xs font-mono text-slate-300 uppercase tracking-wider mb-2.5">
                  POSTURE ALIGNMENT PROTOCOL
                </h4>
                <ol className="space-y-2 text-xs text-slate-300 list-decimal list-inside pl-1">
                  {region.primaryAsana.steps.map((step, idx) => (
                    <li key={idx} className="leading-relaxed pl-1">
                      <span className="text-slate-200">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Supporting Secondary Postures */}
              <div className="pt-4 border-t border-slate-800">
                <h4 className="text-xs font-mono text-slate-300 uppercase tracking-wider mb-3">
                  COMPLEMENTARY POSTURES IN SEQUENCE
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {region.secondaryAsanas.map((sec, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-950/50 border border-slate-800 rounded-lg text-xs flex flex-col justify-between"
                    >
                      <div>
                        <span className="font-medium text-white block mb-0.5">{sec.name}</span>
                        <span className="text-[11px] text-slate-400">{sec.target}</span>
                      </div>
                      <span className="text-[10px] font-mono text-teal-400 mt-2 block font-semibold">
                        {sec.duration}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clinical Contraindications */}
              <div className="p-3 bg-amber-950/20 border border-amber-900/40 rounded-lg text-xs text-amber-300/90 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-amber-300">CONTRAINDICATIONS: </span>
                  <span>{region.primaryAsana.contraindications.join(', ')}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TARGETED HEALING FOODS & NUTRITION */}
          {rightActiveTab === 'nutrition' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 shadow-xl">
              {/* Card Header with Dietary Photo */}
              <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-950 aspect-[16/6] mb-2">
                <img
                  src="/src/assets/images/healing_nutritional_foods_1791266001168.jpg"
                  alt="Clinical dietary photograph of healing anti-inflammatory foods"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent p-4 flex items-end justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-teal-400 uppercase tracking-wider block">
                      BIO-ACTIVE NUTRITIONAL PHARMACOPOEIA
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      Targeted Healing Foods for {region.label}
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-slate-300 hidden sm:inline">
                    BIOCHEMICAL TISSUE REPAIR
                  </span>
                </div>
              </div>

              {/* Quantum Asana + Food Synergy Banner */}
              <div className="p-4 bg-teal-950/20 border border-teal-500/40 rounded-xl text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-teal-300 font-semibold font-mono">
                    <Sparkles className="w-4 h-4 text-teal-400" />
                    <span>QUANTUM ASANA-NUTRITION SYNERGY MULTIPLIER</span>
                  </div>
                  <span className="px-2 py-0.5 bg-teal-500/20 border border-teal-500/50 text-teal-300 rounded font-mono text-[11px] font-bold">
                    {region.quantumSynergy.synergyScore}
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {region.quantumSynergy.combinedMechanism}
                </p>
                <div className="text-[11px] font-mono text-emerald-400 pt-1 border-t border-teal-500/20">
                  CELLULAR PREDICTED IMPACT: {region.quantumSynergy.cellularOutcome}
                </div>
              </div>

              {/* List of 3 Targeted Healing Foods */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono text-slate-300 uppercase tracking-wider">
                  PRESCRIBED NUTRACEUTICAL BIO-ACTIVES
                </h4>

                {region.healingFoods.map((food, idx) => {
                  const isBookmarked = bookmarkedFoods.includes(food.name);
                  return (
                    <div
                      key={idx}
                      className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2.5 transition-all hover:border-slate-700"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-slate-900 border border-slate-700 rounded text-teal-300 font-bold">
                              {food.category}
                            </span>
                            <span className="text-xs text-slate-400 font-mono">
                              {food.doshaEffect.split(';')[0]}
                            </span>
                          </div>
                          <h5 className="text-sm font-bold text-white">{food.name}</h5>
                          <span className="text-xs text-slate-300 font-medium block">
                            Key Active: {food.bioactiveCompounds}
                          </span>
                        </div>

                        {/* Bookmark Button */}
                        <button
                          onClick={() => toggleBookmarkFood(food.name)}
                          className={`p-2 rounded-lg transition-colors border ${
                            isBookmarked
                              ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                              : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'
                          }`}
                          title={isBookmarked ? 'Bookmarked in Patient Profile' : 'Bookmark this food'}
                        >
                          {isBookmarked ? <BookmarkCheck className="w-4 h-4 text-teal-400" /> : <Bookmark className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Mechanism */}
                      <p className="text-xs text-slate-300 leading-relaxed">
                        <span className="font-semibold text-slate-200">Biochemical Action: </span>
                        {food.mechanism}
                      </p>

                      {/* Preparation & Timing */}
                      <div className="p-2.5 bg-slate-900/80 rounded border border-slate-800 text-xs font-mono text-slate-300 flex items-start gap-2">
                        <span className="text-teal-400 font-semibold shrink-0">PREPARATION & TIMING:</span>
                        <span>{food.prepAndTiming}</span>
                      </div>

                      {/* Quantum Resonance */}
                      <div className="text-[11px] font-mono text-cyan-400/90">
                        QUANTUM RESONANCE: {food.quantumNutrientResonance}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FULLSCREEN MAGNIFIED MODAL FOR CROSS-SECTION & WIREFRAME INSPECTION */}
      {isZoomModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full p-6 space-y-4 shadow-2xl animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
                <h3 className="text-lg font-bold text-white">
                  High-Resolution Anatomical Cross-Section: {region.label}
                </h3>
              </div>
              <button
                onClick={() => setIsZoomModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                title="Close fullscreen preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Wireframe System Controls Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-slate-950 rounded-xl border border-slate-800">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-mono text-slate-400 mr-1">WIREFRAME:</span>
                <button
                  onClick={() => handleWireframeToggle('skeletal')}
                  className={`px-2.5 py-1 text-xs font-mono rounded font-semibold transition-colors ${
                    wireframeSystem === 'skeletal'
                      ? 'bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/20'
                      : 'bg-slate-900 text-slate-300 hover:text-sky-300'
                  }`}
                >
                  Skeletal
                </button>
                <button
                  onClick={() => handleWireframeToggle('muscular')}
                  className={`px-2.5 py-1 text-xs font-mono rounded font-semibold transition-colors ${
                    wireframeSystem === 'muscular'
                      ? 'bg-rose-500 text-white font-bold shadow-md shadow-rose-500/20'
                      : 'bg-slate-900 text-slate-300 hover:text-rose-300'
                  }`}
                >
                  Muscular
                </button>
                <button
                  onClick={() => handleWireframeToggle('nervous')}
                  className={`px-2.5 py-1 text-xs font-mono rounded font-semibold transition-colors ${
                    wireframeSystem === 'nervous'
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
                      : 'bg-slate-900 text-slate-300 hover:text-amber-300'
                  }`}
                >
                  Nervous
                </button>
                <button
                  onClick={() => handleWireframeToggle('none')}
                  className={`px-2.5 py-1 text-xs font-mono rounded font-semibold transition-colors ${
                    wireframeSystem === 'none'
                      ? 'bg-slate-800 text-white font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  Off
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span>OPACITY:</span>
                <input
                  type="range"
                  min="0.2"
                  max="1"
                  step="0.05"
                  value={wireframeOpacity}
                  onChange={(e) => setWireframeOpacity(parseFloat(e.target.value))}
                  className="w-20 accent-teal-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
                <span className="w-8 text-right text-teal-300 font-semibold">{Math.round(wireframeOpacity * 100)}%</span>
              </div>
            </div>

            {/* Magnified Image Container with Live SystemWireframeOverlay */}
            <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-[16/9]">
              <img
                src={currentInnerImage}
                alt={region.label}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <SystemWireframeOverlay
                regionId={region.id}
                activeSystem={wireframeSystem}
                opacity={wireframeOpacity}
                animatedPulse={isWireframePulse}
              />

              {wireframeSystem !== 'none' && (
                <div className="absolute top-3 left-3 z-20 pointer-events-none">
                  <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold tracking-tight border shadow-lg flex items-center gap-2 backdrop-blur-md ${
                    wireframeSystem === 'skeletal'
                      ? 'bg-sky-950/80 text-sky-300 border-sky-500/60'
                      : wireframeSystem === 'muscular'
                      ? 'bg-rose-950/80 text-rose-300 border-rose-500/60'
                      : 'bg-amber-950/80 text-amber-300 border-amber-500/60'
                  }`}>
                    <span className={`w-2 h-2 rounded-full animate-ping ${
                      wireframeSystem === 'skeletal'
                        ? 'bg-sky-400'
                        : wireframeSystem === 'muscular'
                        ? 'bg-rose-400'
                        : 'bg-amber-400'
                    }`} />
                    <span>{wireframeSystem.toUpperCase()} VECTOR OVERLAY ACTIVE</span>
                  </span>
                </div>
              )}
            </div>

            {/* Dynamic System Descriptor in Modal */}
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-1">
              <span className="text-[10px] font-mono text-teal-400 uppercase font-semibold block">
                {wireframeSystem !== 'none'
                  ? `${wireframeSystem.toUpperCase()} SYSTEM ARCHITECTURE (${region.label.toUpperCase()}):`
                  : `CLINICAL CROSS-SECTION ARCHITECTURE (${region.label.toUpperCase()}):`}
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {wireframeSystem !== 'none'
                  ? WIREFRAME_SYSTEM_DESCRIPTIONS[region.id][wireframeSystem]
                  : region.anatomicalArea}
              </p>
            </div>

            {/* Landmark Glossary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {keyPoints.map((pt, idx) => (
                <div key={idx} className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs">
                  <span className="font-semibold text-teal-300 block mb-0.5">
                    {idx + 1}. {pt.label}
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {pt.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
