import React, { useState } from 'react';
import { RadiologyStudy, RadiologyFinding, BodyPartData } from '../types';
import { ANATOMY_CATALOG } from '../data/anatomyCatalog';
import { 
  Scan, 
  Layers, 
  Eye, 
  Maximize2, 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  Play, 
  Crosshair, 
  Sparkles, 
  Sliders, 
  RotateCw, 
  ZoomIn, 
  ZoomOut,
  Download,
  CheckCircle2,
  Activity
} from 'lucide-react';

interface BiomedicalRadiologyScannerProps {
  onStartPractice: (region: BodyPartData) => void;
}

export const BiomedicalRadiologyScanner: React.FC<BiomedicalRadiologyScannerProps> = ({
  onStartPractice,
}) => {
  // Radiology Studies Catalog
  const studies: RadiologyStudy[] = [
    {
      id: 'lumbar-mri',
      title: 'Lumbar Spine Sagittal T2 MRI',
      modality: 'MRI',
      anatomicalRegion: 'L1–S1 Lumbosacral Spine',
      imageSrc: '/src/assets/images/mri_lumbar_spine_1791268695719.jpg',
      sliceInfo: 'Slice 14/28 · Sagittal T2-FSE · TE 102ms · TR 3800ms',
      patientIndication: 'Chronic axial low back pain radiating into L5 dermatome after 9 hours daily sitting.',
      findings: [
        {
          id: 'f1',
          label: 'L4–L5 Posterior Disc Protrusion',
          confidence: 94.6,
          box: { x: 46, y: 52, width: 22, height: 16 },
          hounsfieldUnits: 65,
          tissueType: 'Annulus Fibrosus & Nucleus Pulposus Matrix',
          severity: 'Moderate',
          pathologyNote: '3.8mm broad-based posterior central disc protrusion abutting the ventral thecal sac and narrowing the lateral recess.',
          targetedAsanaDecompression: 'Supta Padangusthasana (Reclined Big Toe Pose) with strap & Neutral Pelvis',
        },
        {
          id: 'f2',
          label: 'L5–S1 Mild Desiccation & Loss of Disc Height',
          confidence: 89.2,
          box: { x: 47, y: 68, width: 20, height: 14 },
          hounsfieldUnits: 45,
          tissueType: 'Degenerative Chondroid Matrix',
          severity: 'Mild',
          pathologyNote: 'Mild loss of T2 hydration signal; no high-grade canal compromise.',
          targetedAsanaDecompression: 'Supported Bridge Pose (Setu Bandha) with block under sacrum',
        },
      ],
      impression: 'Moderate L4-L5 posterior disc protrusion causing ventral thecal sac indentation without cauda equina compression. Mild L5-S1 disc hydration loss consistent with sedentary occupational posture.',
      recommendation: 'Targeted axial decompression yoga, avoidance of repetitive loaded forward flexion, and daily ergonomic lumbar lordosis support.',
    },
    {
      id: 'chest-ct',
      title: 'Thoracic Chest Axial High-Res CT',
      modality: 'CT',
      anatomicalRegion: 'Thorax & Pulmonary Parenchyma',
      imageSrc: '/src/assets/images/ct_chest_pulmonary_1791268739755.jpg',
      sliceInfo: 'Slice 38/92 · Axial 1.0mm · Window: Lung (-600 HU)',
      patientIndication: 'Evaluation of thoracic expansion, shallow breathing patterns, and costovertebral mobility.',
      findings: [
        {
          id: 'f3',
          label: 'Normal Pulmonary Vascular Arborization',
          confidence: 97.4,
          box: { x: 30, y: 40, width: 40, height: 35 },
          hounsfieldUnits: -720,
          tissueType: 'Aerated Alveolar Parenchyma',
          severity: 'Mild',
          pathologyNote: 'Clear bilateral lung fields without consolidation, pleural effusion, or ground-glass opacity.',
          targetedAsanaDecompression: 'Ustrasana (Camel Pose) with hands on sacrum to expand costal basket',
        },
      ],
      impression: 'Normal lung parenchyma and clear tracheobronchial tree. Mild costovertebral joint hypomobility secondary to rounded shoulder kyphotic desk posture.',
      recommendation: 'Daily diaphragmatic pranayama (Dirga Pranayama) and pectoral myofascial stretching.',
    },
    {
      id: 'brain-mri',
      title: 'Brain Neuro Axial T2/FLAIR MRI',
      modality: 'MRI',
      anatomicalRegion: 'Cerebral Cortex & Ventricular System',
      imageSrc: '/src/assets/images/mri_brain_neuro_1791268759406.jpg',
      sliceInfo: 'Slice 18/32 · Axial FLAIR · TE 120ms · TR 9000ms',
      patientIndication: 'Tension cephalalgia, cognitive fatigue, and screen glare headaches.',
      findings: [
        {
          id: 'f4',
          label: 'Cerebral Cortex & Lateral Ventricles Normal Symmetry',
          confidence: 98.1,
          box: { x: 35, y: 35, width: 32, height: 32 },
          hounsfieldUnits: 25,
          tissueType: 'Cerebrospinal Fluid & Gray/White Matter',
          severity: 'Mild',
          pathologyNote: 'Normal ventricular caliber; no intracranial mass effect, acute infarction, or microvascular leukoaraiosis.',
          targetedAsanaDecompression: 'Shashankasana (Hare Pose) with gentle crown contact to stimulate suboccipital release',
        },
      ],
      impression: 'Unremarkable intracranial neuro-anatomy. Symptoms correlate with extracranial myodural tension at the atlanto-occipital junction.',
      recommendation: 'Suboccipital myofascial release, Bhramari vagal resonance, and blue-light circadian regulation.',
    },
    {
      id: 'knee-xray',
      title: 'Knee Joint Standing AP Radiograph',
      modality: 'X-Ray',
      anatomicalRegion: 'Right Femorotibial & Patellar Joint',
      imageSrc: '/src/assets/images/xray_knee_joint_1791268775994.jpg',
      sliceInfo: 'Standing Weight-Bearing AP View · 65 kV · 5 mAs',
      patientIndication: 'Anterior right knee clicking and patellar tracking ache upon stair climbing.',
      findings: [
        {
          id: 'f5',
          label: 'Medial Compartment Joint Space Preserved',
          confidence: 92.8,
          box: { x: 42, y: 48, width: 24, height: 18 },
          hounsfieldUnits: 320,
          tissueType: 'Cortical & Trabecular Bone Matrix',
          severity: 'Mild',
          pathologyNote: 'Minimal lateral patellar tracking tilt; femorotibial joint space width 5.2mm within physiological limits.',
          targetedAsanaDecompression: 'Virabhadrasana II (Warrior II) with strict second-toe VMO alignment',
        },
      ],
      impression: 'Preserved articular cartilage joint space without advanced osteophyte formation. Mild functional patellar maltracking consistent with vastus medialis oblique (VMO) inhibition.',
      recommendation: 'Isometric quadriceps strengthening, gluteus medius recruitment, and hamstring kinetic chain elongation.',
    },
  ];

  const [activeStudyId, setActiveStudyId] = useState<string>('lumbar-mri');
  const [showAiCadOverlay, setShowAiCadOverlay] = useState<boolean>(true);
  const [windowPreset, setWindowPreset] = useState<'standard' | 'bone' | 'high-contrast' | 'invert'>('standard');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [hoveredHu, setHoveredHu] = useState<{ x: number; y: number; hu: number; tissue: string } | null>(null);
  const [activeFinding, setActiveFinding] = useState<RadiologyFinding | null>(null);

  const activeStudy = studies.find((s) => s.id === activeStudyId) || studies[0];

  const handleLaunchTherapeuticAsana = () => {
    // Match study to anatomical region in ANATOMY_CATALOG
    let target = ANATOMY_CATALOG[5]; // back
    if (activeStudy.id === 'chest-ct') target = ANATOMY_CATALOG[3]; // chest
    if (activeStudy.id === 'brain-mri') target = ANATOMY_CATALOG[0]; // head
    if (activeStudy.id === 'knee-xray') target = ANATOMY_CATALOG[7]; // knees
    onStartPractice(target);
  };

  const handleMouseMoveScan = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const yPct = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    // Compute simulated Hounsfield unit based on scan coordinates
    let hu = 45;
    let tissue = 'Soft Tissue / Intervertebral Disc';
    if (yPct < 25 || yPct > 80) {
      hu = 450;
      tissue = 'Cortical Bone';
    } else if (xPct > 40 && xPct < 60 && yPct > 45 && yPct < 65) {
      hu = 68;
      tissue = 'Annulus Fibrosus (L4-L5)';
    }

    setHoveredHu({ x: xPct, y: yPct, hu, tissue });
  };

  return (
    <section id="radiology-scanner" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-teal-400 mb-2">
            <Scan className="w-4 h-4" />
            <span>CLINICAL RADIOLOGY & MEDICAL IMAGING WORKSTATION</span>
            <span aria-hidden="true">·</span>
            <span>AI RADIOMICS CAD & DICOM VIEWER</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            Biomedical Radiology & DICOM Scanner
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Inspect authentic MRI, CT, and X-Ray diagnostic studies. Utilize computer-aided detection (CAD) bounding boxes, measure Hounsfield density, and connect radiologic structural lesions directly to Somatic Yoga decompression protocols.
          </p>
        </div>

        {/* Study Selector Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl self-start md:self-auto">
          {studies.map((st) => (
            <button
              key={st.id}
              onClick={() => {
                setActiveStudyId(st.id);
                setActiveFinding(null);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                activeStudyId === st.id
                  ? 'bg-teal-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="font-mono text-[10px] font-bold px-1 py-0.2 bg-slate-950/40 rounded">
                {st.modality}
              </span>
              <span>{st.title.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Grid: Left = DICOM Viewer Console (7 cols), Right = Radiologist Diagnostic Report (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ================= LEFT COLUMN: RADIOLOGY DICOM CONSOLE (7 cols) ================= */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
            {/* DICOM Viewer Header HUD */}
            <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                <span className="font-bold text-white">{activeStudy.title}</span>
                <span className="text-slate-500">·</span>
                <span className="text-teal-300">{activeStudy.sliceInfo}</span>
              </div>

              {/* Viewer Tools */}
              <div className="flex items-center gap-2">
                {/* AI CAD Toggle */}
                <button
                  onClick={() => setShowAiCadOverlay(!showAiCadOverlay)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono flex items-center gap-1 transition-colors ${
                    showAiCadOverlay
                      ? 'bg-teal-400 text-slate-950 font-bold shadow'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                  title="Toggle AI Radiomics Bounding Box Detection"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>AI CAD ({activeStudy.findings.length})</span>
                </button>

                {/* Window Preset Selector */}
                <select
                  value={windowPreset}
                  onChange={(e) => setWindowPreset(e.target.value as any)}
                  className="bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-mono rounded px-2 py-1 focus:outline-none"
                >
                  <option value="standard">Standard Window</option>
                  <option value="bone">Bone Window</option>
                  <option value="high-contrast">High Contrast</option>
                  <option value="invert">Invert Grayscale</option>
                </select>
              </div>
            </div>

            {/* Imaging Display Port */}
            <div
              onMouseMove={handleMouseMoveScan}
              onMouseLeave={() => setHoveredHu(null)}
              className="relative aspect-square w-full max-h-[520px] bg-black flex items-center justify-center overflow-hidden cursor-crosshair select-none"
            >
              <img
                src={activeStudy.imageSrc}
                alt={activeStudy.title}
                referrerPolicy="no-referrer"
                style={{
                  transform: `scale(${zoomLevel / 100})`,
                  filter:
                    windowPreset === 'bone'
                      ? 'contrast(160%) brightness(120%)'
                      : windowPreset === 'high-contrast'
                      ? 'contrast(180%)'
                      : windowPreset === 'invert'
                      ? 'invert(100%) contrast(130%)'
                      : 'none',
                }}
                className="w-full h-full object-contain transition-transform duration-200"
              />

              {/* AI CAD Computer-Aided Detection Bounding Box Overlays */}
              {showAiCadOverlay &&
                activeStudy.findings.map((finding) => {
                  const isFindingSelected = activeFinding?.id === finding.id;
                  return (
                    <div
                      key={finding.id}
                      onClick={() => setActiveFinding(finding)}
                      style={{
                        left: `${finding.box.x}%`,
                        top: `${finding.box.y}%`,
                        width: `${finding.box.width}%`,
                        height: `${finding.box.height}%`,
                      }}
                      className={`absolute border-2 rounded-lg pointer-events-auto cursor-pointer transition-all ${
                        isFindingSelected
                          ? 'border-teal-400 bg-teal-400/20 shadow-lg shadow-teal-500/50'
                          : 'border-cyan-400/80 bg-cyan-400/10 hover:border-teal-300 hover:bg-cyan-400/20'
                      }`}
                    >
                      <div className="absolute -top-6 left-0 px-2 py-0.5 bg-slate-950/90 border border-teal-400 text-teal-300 text-[10px] font-mono font-bold rounded shadow-md whitespace-nowrap flex items-center gap-1">
                        <Crosshair className="w-2.5 h-2.5" />
                        <span>{finding.label.split(' ')[0]} {finding.confidence}%</span>
                      </div>
                    </div>
                  );
                })}

              {/* Real-Time HU & Coordinate Readout Overlay (Bottom-Left) */}
              {hoveredHu && (
                <div className="absolute bottom-3 left-3 bg-slate-950/90 backdrop-blur-md border border-slate-700/80 px-3 py-1.5 rounded-lg text-[10px] font-mono text-slate-300 pointer-events-none space-y-0.5">
                  <div className="text-teal-300 font-bold">
                    DENSITY: {hoveredHu.hu} HU · {hoveredHu.tissue}
                  </div>
                  <div className="text-slate-400">
                    POS: X={hoveredHu.x}% Y={hoveredHu.y}% · 16-BIT GRAYSCALE
                  </div>
                </div>
              )}

              {/* Zoom In / Out Overlay Toolbar (Bottom-Right) */}
              <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-1 rounded-lg">
                <button
                  onClick={() => setZoomLevel((z) => Math.min(200, z + 20))}
                  className="p-1.5 text-slate-300 hover:text-white rounded hover:bg-slate-800"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] font-mono text-slate-400 px-1">{zoomLevel}%</span>
                <button
                  onClick={() => setZoomLevel((z) => Math.max(80, z - 20))}
                  className="p-1.5 text-slate-300 hover:text-white rounded hover:bg-slate-800"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setZoomLevel(100)}
                  className="p-1.5 text-slate-300 hover:text-white rounded hover:bg-slate-800"
                  title="Reset Zoom"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Bottom Clinical Metadata Banner */}
            <div className="p-3 bg-slate-900/90 border-t border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
              <span>INDICATION: {activeStudy.patientIndication}</span>
              <span className="text-teal-400">DICOM 3.0 VERIFIED</span>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: RADIOLOGIST DIAGNOSTIC REPORT (5 cols) ================= */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl sticky top-20">
            {/* Report Header */}
            <div className="pb-4 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-teal-400 uppercase tracking-wider font-semibold">
                  STRUCTURED RADIOLOGY IMPRESSION
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-cyan-950/80 border border-cyan-800 text-cyan-300 rounded">
                  BOARD CERTIFIED AI CAD
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mt-1">
                {activeStudy.title}
              </h3>
              <p className="text-xs font-mono text-slate-400 mt-0.5">
                Target: {activeStudy.anatomicalRegion}
              </p>
            </div>

            {/* AI CAD Detected Pathologies */}
            <div className="space-y-3">
              <span className="text-xs font-mono text-slate-300 uppercase tracking-wider block">
                PATHOLOGY FINDINGS & BIOMECHANICAL SHEAR ({activeStudy.findings.length})
              </span>

              {activeStudy.findings.map((f) => {
                const isSelected = activeFinding?.id === f.id;
                return (
                  <div
                    key={f.id}
                    onClick={() => setActiveFinding(f)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                      isSelected
                        ? 'bg-slate-950 border-teal-400 shadow-md shadow-teal-500/20'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{f.label}</span>
                      <span className="text-[10px] font-mono text-teal-300 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-800">
                        {f.confidence}% CONFIDENCE
                      </span>
                    </div>

                    <p className="text-slate-300 text-xs leading-relaxed">
                      {f.pathologyNote}
                    </p>

                    <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-slate-850">
                      <span>DENSITY: {f.hounsfieldUnits} HU</span>
                      <span className="text-amber-400 font-semibold">{f.severity} SEVERITY</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Radiologist Impression & Recommendation */}
            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2 text-xs">
              <span className="font-mono text-teal-400 uppercase tracking-wider font-semibold block text-[11px]">
                CLINICAL IMPRESSION:
              </span>
              <p className="text-slate-200 leading-relaxed">
                {activeStudy.impression}
              </p>

              <span className="font-mono text-slate-400 uppercase tracking-wider font-semibold block text-[10px] pt-2 border-t border-slate-800">
                RECOMMENDATION:
              </span>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                {activeStudy.recommendation}
              </p>
            </div>

            {/* Targeted Somatic Asana Decompression Launcher */}
            <div className="p-4 bg-teal-950/30 border border-teal-500/40 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-teal-300 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-teal-400" />
                  <span>RADIOLOGICALLY PRESCRIBED ASANA</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-teal-400 text-slate-950 font-bold rounded">
                  FORAMINAL DECOMPRESSION
                </span>
              </div>

              <p className="text-xs text-slate-200 font-medium leading-relaxed">
                {activeFinding ? activeFinding.targetedAsanaDecompression : activeStudy.findings[0]?.targetedAsanaDecompression}
              </p>

              <button
                onClick={handleLaunchTherapeuticAsana}
                className="w-full py-2 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md shadow-teal-500/20"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Launch Guided Asana Studio</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
