import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
import { BodyPartData, BodyRegion } from '../types';
import { ANATOMY_CATALOG } from '../data/anatomyCatalog';
import { usePatientHealth } from '../context/PatientHealthContext';
import {
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Layers,
  Activity,
  Search,
  Sparkles,
  Heart,
  Apple,
  Play,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Wind,
  ShieldCheck,
  Compass,
  Sliders,
  Check,
  X
} from 'lucide-react';

interface HumanAtlas3DProps {
  onStartPractice: (region: BodyPartData) => void;
  selectedRegionId?: BodyRegion;
  onSelectRegion?: (region: BodyPartData) => void;
}

interface AnatomicalStructure {
  id: string;
  name: string;
  system: 'skeleton' | 'muscles' | 'heart' | 'nervous' | 'respiratory' | 'digestive';
  regionId: BodyRegion;
  assembledPos: [number, number, number];
  explodedPos: [number, number, number];
  scale: [number, number, number];
  rotation: [number, number, number];
  color: number;
  geometryType: 'box' | 'cylinder' | 'sphere' | 'torus' | 'capsule';
  latinName: string;
  action: string;
  innervation: string;
}

export const HumanAtlas3D: React.FC<HumanAtlas3DProps> = ({
  onStartPractice,
  selectedRegionId = 'neck',
  onSelectRegion,
}) => {
  const { 
    preferredPractices, 
    toggleFavoritePractice, 
    bookmarkedFoods, 
    toggleBookmarkFood 
  } = usePatientHealth();

  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const meshesGroupRef = useRef<THREE.Group | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const partMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map());

  // Interactive UI State
  const [explodePercent, setExplodePercent] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSystemFilter, setActiveSystemFilter] = useState<'all' | 'skeleton' | 'muscles' | 'organs'>('all');
  const [selectedPartId, setSelectedPartId] = useState<string>('cervical-spine');
  const [currentRegionId, setCurrentRegionId] = useState<BodyRegion>(selectedRegionId);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(false);
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
  const [rightPanelTab, setRightPanelTab] = useState<'anatomy' | 'yoga' | 'nutrition'>('anatomy');
  const [isInspectDrawerOpen, setIsInspectDrawerOpen] = useState<boolean>(true);

  // System visibility toggles matching the reference screenshot
  const [systemsVisibility, setSystemsVisibility] = useState({
    skeleton: true,
    muscles: true,
    heart: true,
    nervous: true,
    respiratory: true,
    digestive: true,
  });

  // Current selected region catalog data
  const currentRegionData = useMemo(() => {
    return ANATOMY_CATALOG.find((r) => r.id === currentRegionId) || ANATOMY_CATALOG[1];
  }, [currentRegionId]);

  // Construct comprehensive catalog of 3D anatomical structures with Assembled & Exploded coordinates
  const anatomicalStructures: AnatomicalStructure[] = useMemo(() => {
    const list: AnatomicalStructure[] = [];

    // Helper to generate grid of exploded positions (like Screenshot 1!)
    let gridIdx = 0;
    const getGridPos = (row: number, col: number): [number, number, number] => {
      const x = (col - 5.5) * 0.9;
      const y = (3.5 - row) * 0.8;
      const z = -0.5;
      return [x, y, z];
    };

    // 1. SKELETON PIECES (Bone Ivory)
    const boneCol = 0xf1f5f9;
    // Skull
    list.push({
      id: 'cranium',
      name: 'Cranium & Frontal Bone',
      system: 'skeleton',
      regionId: 'head',
      assembledPos: [0, 3.1, 0],
      explodedPos: getGridPos(0, 0),
      scale: [0.42, 0.48, 0.44],
      rotation: [0, 0, 0],
      color: boneCol,
      geometryType: 'sphere',
      latinName: 'Os frontale et cranium',
      action: 'Protects the cerebral cortex and provides cranial vault dural attachments',
      innervation: 'Trigeminal nerve (CN V) sensory divisions'
    });
    list.push({
      id: 'mandible',
      name: 'Mandible & TMJ Condyle',
      system: 'skeleton',
      regionId: 'head',
      assembledPos: [0, 2.7, 0.15],
      explodedPos: getGridPos(0, 1),
      scale: [0.28, 0.16, 0.24],
      rotation: [0, 0, 0],
      color: boneCol,
      geometryType: 'box',
      latinName: 'Mandibula',
      action: 'Mastication and mandibular elevation/depression',
      innervation: 'Mandibular nerve (CN V3)'
    });
    // Cervical spine vertebrae
    for (let i = 1; i <= 7; i++) {
      list.push({
        id: `cervical-c${i}`,
        name: `Cervical Vertebra C${i}`,
        system: 'skeleton',
        regionId: 'neck',
        assembledPos: [0, 2.5 - (i * 0.065), -0.02],
        explodedPos: getGridPos(0, 1 + i),
        scale: [0.18, 0.05, 0.16],
        rotation: [0, 0, 0],
        color: boneCol,
        geometryType: 'cylinder',
        latinName: `Vertebra cervicalis C${i}`,
        action: 'Maintains cervical lordosis; transmits vertebral artery through transverse foramina',
        innervation: `Cervical spinal nerve C${i}`
      });
    }
    // Clavicles & Scapulae
    list.push({
      id: 'clavicle-r',
      name: 'Right Clavicle (Collarbone)',
      system: 'skeleton',
      regionId: 'shoulders',
      assembledPos: [0.45, 1.95, 0.08],
      explodedPos: getGridPos(1, 0),
      scale: [0.55, 0.06, 0.06],
      rotation: [0, 0, 0.12],
      color: boneCol,
      geometryType: 'cylinder',
      latinName: 'Clavicula dextra',
      action: 'Strut transmitting thoracic loads to scapula and upper extremity',
      innervation: 'Supraclavicular nerves (C3-C4)'
    });
    list.push({
      id: 'clavicle-l',
      name: 'Left Clavicle (Collarbone)',
      system: 'skeleton',
      regionId: 'shoulders',
      assembledPos: [-0.45, 1.95, 0.08],
      explodedPos: getGridPos(1, 1),
      scale: [0.55, 0.06, 0.06],
      rotation: [0, 0, -0.12],
      color: boneCol,
      geometryType: 'cylinder',
      latinName: 'Clavicula sinistra',
      action: 'Strut transmitting thoracic loads to scapula and upper extremity',
      innervation: 'Supraclavicular nerves (C3-C4)'
    });
    // Sternum
    list.push({
      id: 'sternum',
      name: 'Sternum & Manubrium',
      system: 'skeleton',
      regionId: 'chest',
      assembledPos: [0, 1.55, 0.22],
      explodedPos: getGridPos(1, 2),
      scale: [0.14, 0.52, 0.06],
      rotation: [0, 0, 0],
      color: boneCol,
      geometryType: 'box',
      latinName: 'Sternum',
      action: 'Anterior anchor for true ribs 1-7 and costal cartilages',
      innervation: 'Intercostal nerves 1-6'
    });
    // Ribcage arches
    for (let r = 1; r <= 8; r++) {
      list.push({
        id: `rib-r-${r}`,
        name: `Right Rib ${r} Arch`,
        system: 'skeleton',
        regionId: 'chest',
        assembledPos: [0.42, 1.8 - (r * 0.08), 0.02],
        explodedPos: getGridPos(1, 2 + r),
        scale: [0.45, 0.04, 0.35],
        rotation: [0.1, 0, 0.05],
        color: boneCol,
        geometryType: 'torus',
        latinName: `Costa dextra ${r}`,
        action: 'Expands bucket-handle diameter of chest during inspiration',
        innervation: `Intercostal nerve T${r}`
      });
    }
    // Lumbar spine (L1-L5)
    for (let l = 1; l <= 5; l++) {
      list.push({
        id: `lumbar-l${l}`,
        name: `Lumbar Vertebra L${l}`,
        system: 'skeleton',
        regionId: 'back',
        assembledPos: [0, 1.05 - (l * 0.085), -0.1],
        explodedPos: getGridPos(2, l),
        scale: [0.26, 0.07, 0.22],
        rotation: [0, 0, 0],
        color: boneCol,
        geometryType: 'cylinder',
        latinName: `Vertebra lumbalis L${l}`,
        action: 'Transmits bodyweight load and resists axial shearing',
        innervation: `Lumbar spinal nerve L${l}`
      });
    }
    // Pelvis Basin
    list.push({
      id: 'pelvis-ilium',
      name: 'Pelvic Girdle & Iliac Crest',
      system: 'skeleton',
      regionId: 'pelvis',
      assembledPos: [0, 0.45, -0.04],
      explodedPos: getGridPos(2, 6),
      scale: [0.72, 0.38, 0.45],
      rotation: [0, 0, 0],
      color: boneCol,
      geometryType: 'box',
      latinName: 'Os coxae (Ilium, Ischium, Pubis)',
      action: 'Transfers axial weight to lower limbs; deep somatic foundation',
      innervation: 'Lumbosacral plexus'
    });
    // Femur Bones
    list.push({
      id: 'femur-r',
      name: 'Right Femur Shaft & Head',
      system: 'skeleton',
      regionId: 'knees',
      assembledPos: [0.38, -0.32, 0],
      explodedPos: getGridPos(2, 7),
      scale: [0.14, 0.95, 0.14],
      rotation: [0, 0, 0.05],
      color: boneCol,
      geometryType: 'cylinder',
      latinName: 'Femur dextrum',
      action: 'Principal weight-bearing bone of the thigh',
      innervation: 'Femoral nerve (L2-L4)'
    });
    list.push({
      id: 'femur-l',
      name: 'Left Femur Shaft & Head',
      system: 'skeleton',
      regionId: 'knees',
      assembledPos: [-0.38, -0.32, 0],
      explodedPos: getGridPos(2, 8),
      scale: [0.14, 0.95, 0.14],
      rotation: [0, 0, -0.05],
      color: boneCol,
      geometryType: 'cylinder',
      latinName: 'Femur sinistrum',
      action: 'Principal weight-bearing bone of the thigh',
      innervation: 'Femoral nerve (L2-L4)'
    });
    // Patellas
    list.push({
      id: 'patella-r',
      name: 'Right Patella (Kneecap)',
      system: 'skeleton',
      regionId: 'knees',
      assembledPos: [0.36, -0.85, 0.12],
      explodedPos: getGridPos(2, 9),
      scale: [0.12, 0.14, 0.08],
      rotation: [0, 0, 0],
      color: boneCol,
      geometryType: 'sphere',
      latinName: 'Patella dextra',
      action: 'Increases quadriceps tendon leverage over knee fulcrum',
      innervation: 'Femoral nerve branches'
    });
    // Tibia & Fibula
    list.push({
      id: 'tibia-r',
      name: 'Right Tibia & Fibula',
      system: 'skeleton',
      regionId: 'feet',
      assembledPos: [0.36, -1.45, 0],
      explodedPos: getGridPos(2, 10),
      scale: [0.13, 0.92, 0.13],
      rotation: [0, 0, 0],
      color: boneCol,
      geometryType: 'cylinder',
      latinName: 'Tibia et fibula dextra',
      action: 'Shin weight transmission and ankle mortise stability',
      innervation: 'Tibial and common peroneal nerves'
    });

    // 2. MUSCULAR SYSTEM (Crimson / Terracotta Myofascial tone)
    const muscleCol = 0x991b1b;
    // Frontalis & Temporalis
    list.push({
      id: 'frontalis',
      name: 'Frontalis & Temporalis Fascia',
      system: 'muscles',
      regionId: 'head',
      assembledPos: [0, 3.2, 0.18],
      explodedPos: getGridPos(3, 0),
      scale: [0.4, 0.22, 0.1],
      rotation: [0, 0, 0],
      color: muscleCol,
      geometryType: 'box',
      latinName: 'Musculus frontalis et temporalis',
      action: 'Elevates eyebrows; contracts during screen fatigue and migraine aura',
      innervation: 'Facial nerve (CN VII)'
    });
    // Trapezius Superior
    list.push({
      id: 'trapezius',
      name: 'Upper & Middle Trapezius',
      system: 'muscles',
      regionId: 'neck',
      assembledPos: [0, 2.1, -0.15],
      explodedPos: getGridPos(3, 1),
      scale: [0.85, 0.55, 0.14],
      rotation: [0, 0, 0],
      color: 0xb91c1c,
      geometryType: 'box',
      latinName: 'Musculus trapezius',
      action: 'Suspends the shoulder girdle against gravity; tightens severely during stress',
      innervation: 'Spinal Accessory Nerve (CN XI)'
    });
    // Sternocleidomastoid
    list.push({
      id: 'scm-muscle',
      name: 'Sternocleidomastoid (SCM)',
      system: 'muscles',
      regionId: 'neck',
      assembledPos: [0.18, 2.25, 0.1],
      explodedPos: getGridPos(3, 2),
      scale: [0.08, 0.45, 0.08],
      rotation: [0, 0, -0.2],
      color: muscleCol,
      geometryType: 'cylinder',
      latinName: 'Musculus sternocleidomastoideus',
      action: 'Flexes neck, turns chin upward and to opposite side',
      innervation: 'Spinal Accessory Nerve (CN XI) & C2-C3'
    });
    // Pectoralis Major (L/R)
    list.push({
      id: 'pectoralis-major-r',
      name: 'Right Pectoralis Major',
      system: 'muscles',
      regionId: 'chest',
      assembledPos: [0.32, 1.62, 0.18],
      explodedPos: getGridPos(3, 3),
      scale: [0.38, 0.28, 0.12],
      rotation: [0, 0, -0.15],
      color: 0x991b1b,
      geometryType: 'box',
      latinName: 'Musculus pectoralis major dexter',
      action: 'Adducts and internally rotates humerus; anterior chest expansion in Camel pose',
      innervation: 'Medial and lateral pectoral nerves'
    });
    list.push({
      id: 'pectoralis-major-l',
      name: 'Left Pectoralis Major',
      system: 'muscles',
      regionId: 'chest',
      assembledPos: [-0.32, 1.62, 0.18],
      explodedPos: getGridPos(3, 4),
      scale: [0.38, 0.28, 0.12],
      rotation: [0, 0, 0.15],
      color: 0x991b1b,
      geometryType: 'box',
      latinName: 'Musculus pectoralis major sinister',
      action: 'Adducts and internally rotates humerus; anterior chest expansion in Camel pose',
      innervation: 'Medial and lateral pectoral nerves'
    });
    // Rectus Abdominis (Six-pack)
    list.push({
      id: 'rectus-abdominis',
      name: 'Rectus Abdominis & Linea Alba',
      system: 'muscles',
      regionId: 'gut',
      assembledPos: [0, 1.05, 0.18],
      explodedPos: getGridPos(3, 5),
      scale: [0.32, 0.65, 0.09],
      rotation: [0, 0, 0],
      color: 0x7f1d1d,
      geometryType: 'box',
      latinName: 'Musculus rectus abdominis',
      action: 'Flexes vertebral column, compresses abdominal viscera, supports posture',
      innervation: 'Thoracoabdominal nerves T7-T11'
    });
    // Latissimus Dorsi
    list.push({
      id: 'latissimus-dorsi',
      name: 'Latissimus Dorsi (Back Wings)',
      system: 'muscles',
      regionId: 'back',
      assembledPos: [0, 1.35, -0.18],
      explodedPos: getGridPos(3, 6),
      scale: [0.95, 0.72, 0.12],
      rotation: [0, 0, 0],
      color: 0x991b1b,
      geometryType: 'box',
      latinName: 'Musculus latissimus dorsi',
      action: 'Extends, adducts, and internally rotates arm; links pelvis to upper back',
      innervation: 'Thoracodorsal nerve (C6-C8)'
    });
    // Lumbar Multifidus
    list.push({
      id: 'multifidus',
      name: 'Deep Lumbar Multifidus',
      system: 'muscles',
      regionId: 'back',
      assembledPos: [0, 0.95, -0.16],
      explodedPos: getGridPos(3, 7),
      scale: [0.18, 0.55, 0.08],
      rotation: [0, 0, 0],
      color: 0xb91c1c,
      geometryType: 'box',
      latinName: 'Musculi multifidi lumborum',
      action: 'Key segment-by-segment stabilizer of lumbar vertebrae; atrophies in desk work',
      innervation: 'Medial branches of dorsal rami'
    });
    // Gluteus Maximus & Medius
    list.push({
      id: 'gluteus-maximus',
      name: 'Gluteus Maximus & Piriformis',
      system: 'muscles',
      regionId: 'pelvis',
      assembledPos: [0, 0.38, -0.22],
      explodedPos: getGridPos(3, 8),
      scale: [0.78, 0.45, 0.28],
      rotation: [0, 0, 0],
      color: 0x991b1b,
      geometryType: 'box',
      latinName: 'Musculus gluteus maximus',
      action: 'Primary hip extensor and external rotator; stabilizes pelvis in walking',
      innervation: 'Inferior gluteal nerve (L5-S2)'
    });
    // Quadriceps (VMO & Rectus Femoris)
    list.push({
      id: 'quadriceps-r',
      name: 'Right Quadriceps & Vastus Medialis (VMO)',
      system: 'muscles',
      regionId: 'knees',
      assembledPos: [0.38, -0.35, 0.1],
      explodedPos: getGridPos(3, 9),
      scale: [0.34, 0.88, 0.32],
      rotation: [0, 0, 0.03],
      color: 0x991b1b,
      geometryType: 'cylinder',
      latinName: 'Musculus quadriceps femoris dexter',
      action: 'Extends knee; VMO stabilizes patellar tracking in Warrior II pose',
      innervation: 'Femoral nerve (L2-L4)'
    });
    list.push({
      id: 'quadriceps-l',
      name: 'Left Quadriceps & Vastus Medialis (VMO)',
      system: 'muscles',
      regionId: 'knees',
      assembledPos: [-0.38, -0.35, 0.1],
      explodedPos: getGridPos(3, 10),
      scale: [0.34, 0.88, 0.32],
      rotation: [0, 0, -0.03],
      color: 0x991b1b,
      geometryType: 'cylinder',
      latinName: 'Musculus quadriceps femoris sinister',
      action: 'Extends knee; VMO stabilizes patellar tracking in Warrior II pose',
      innervation: 'Femoral nerve (L2-L4)'
    });
    // Gastrocnemius & Plantar Fascia
    list.push({
      id: 'gastrocnemius-r',
      name: 'Right Gastrocnemius & Achilles Tendon',
      system: 'muscles',
      regionId: 'feet',
      assembledPos: [0.36, -1.35, -0.08],
      explodedPos: getGridPos(3, 11),
      scale: [0.24, 0.72, 0.22],
      rotation: [0, 0, 0],
      color: 0x991b1b,
      geometryType: 'cylinder',
      latinName: 'Musculus gastrocnemius et tendo calcaneus',
      action: 'Plantarflexes foot and flexes knee; peripheral skeletal muscle pump',
      innervation: 'Tibial nerve (S1-S2)'
    });

    // 3. VITAL ORGANS & SYSTEMS (Heart, Nervous, Respiratory, Digestive)
    list.push({
      id: 'heart-organ',
      name: 'Human Heart (Cardiovascular Core)',
      system: 'heart',
      regionId: 'chest',
      assembledPos: [0.08, 1.55, 0.08],
      explodedPos: getGridPos(4, 0),
      scale: [0.24, 0.28, 0.24],
      rotation: [0.2, 0.1, 0],
      color: 0xef4444,
      geometryType: 'sphere',
      latinName: 'Cor (Myocardium)',
      action: 'Pumps oxygenated blood through arterial tree; regulates autonomic HRV',
      innervation: 'Cardiac autonomic plexus (Vagus nerve & sympathetic trunks)'
    });
    list.push({
      id: 'lungs-respiratory',
      name: 'Lungs & Bronchial Tree',
      system: 'respiratory',
      regionId: 'chest',
      assembledPos: [0, 1.52, 0.04],
      explodedPos: getGridPos(4, 1),
      scale: [0.65, 0.58, 0.38],
      rotation: [0, 0, 0],
      color: 0x38bdf8,
      geometryType: 'box',
      latinName: 'Pulmones',
      action: 'Gas exchange; alveolar expansion stimulated by Pranayama breathing ratios',
      innervation: 'Pulmonary plexus & Phrenic nerve (C3-C5)'
    });
    list.push({
      id: 'brain-cns',
      name: 'Brain & Cerebrospinal Axis',
      system: 'nervous',
      regionId: 'head',
      assembledPos: [0, 3.1, 0.02],
      explodedPos: getGridPos(4, 2),
      scale: [0.38, 0.42, 0.42],
      rotation: [0, 0, 0],
      color: 0xa855f7,
      geometryType: 'sphere',
      latinName: 'Encephalon',
      action: 'Central cognitive processing, thalamocortical alpha wave modulation',
      innervation: 'Cranial nerves I-XII'
    });
    list.push({
      id: 'digestive-gut',
      name: 'Enteric Viscera & Stomach/Intestines',
      system: 'digestive',
      regionId: 'gut',
      assembledPos: [0, 0.88, 0.04],
      explodedPos: getGridPos(4, 3),
      scale: [0.44, 0.48, 0.38],
      rotation: [0, 0, 0],
      color: 0x10b981,
      geometryType: 'sphere',
      latinName: 'Systema digestorium',
      action: 'Nutrient absorption, enteric 5-HT serotonin synthesis, vagal gut-brain axis',
      innervation: 'Enteric nervous system & Celiac plexus'
    });

    return list;
  }, []);

  // Filtered structures based on search or system filter
  const filteredStructures = useMemo(() => {
    return anatomicalStructures.filter((item) => {
      const matchesSearch =
        searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.latinName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSystem =
        activeSystemFilter === 'all' ||
        (activeSystemFilter === 'skeleton' && item.system === 'skeleton') ||
        (activeSystemFilter === 'muscles' && item.system === 'muscles') ||
        (activeSystemFilter === 'organs' && item.system !== 'skeleton' && item.system !== 'muscles');

      const isSystemVisible = systemsVisibility[item.system];

      return matchesSearch && matchesSystem && isSystemVisible;
    });
  }, [anatomicalStructures, searchQuery, activeSystemFilter, systemsVisibility]);

  // Current selected part metadata
  const selectedPart = useMemo(() => {
    return anatomicalStructures.find((p) => p.id === selectedPartId) || anatomicalStructures[0];
  }, [anatomicalStructures, selectedPartId]);

  // Handle clicking a specific anatomical structure
  const handleSelectPart = (structure: AnatomicalStructure) => {
    setSelectedPartId(structure.id);
    setCurrentRegionId(structure.regionId);
    if (onSelectRegion) {
      const catalogItem = ANATOMY_CATALOG.find((c) => c.id === structure.regionId);
      if (catalogItem) onSelectRegion(catalogItem);
    }
  };

  // Initialize Three.js Scene and build all anatomical parts
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene with clean surgical/clinical studio tone matching screenshot
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0f172a); // Deep slate background

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.8, 6.2);
    cameraRef.current = camera;

    // 3. Renderer with antialiasing
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // 4. Clinical Medical Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(4, 5, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    fillLight.position.set(-4, 2, 4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x2dd4bf, 1.8);
    rimLight.position.set(0, 4, -5);
    scene.add(rimLight);

    // 5. Build Meshes Group
    const meshesGroup = new THREE.Group();
    meshesGroupRef.current = meshesGroup;
    scene.add(meshesGroup);

    partMeshesRef.current.clear();

    // Instantiate 3D meshes for all anatomical structures
    anatomicalStructures.forEach((item) => {
      let geom: THREE.BufferGeometry;
      switch (item.geometryType) {
        case 'sphere':
          geom = new THREE.SphereGeometry(1, 24, 20);
          break;
        case 'cylinder':
          geom = new THREE.CylinderGeometry(1, 1, 1, 20);
          break;
        case 'torus':
          geom = new THREE.TorusGeometry(1, 0.2, 12, 24);
          break;
        case 'box':
        default:
          geom = new THREE.BoxGeometry(1, 1, 1);
          break;
      }

      const mat = new THREE.MeshStandardMaterial({
        color: item.color,
        roughness: item.system === 'skeleton' ? 0.6 : 0.45,
        metalness: item.system === 'skeleton' ? 0.15 : 0.05,
      });

      const mesh = new THREE.Mesh(geom, mat);
      mesh.scale.set(...item.scale);
      mesh.rotation.set(...item.rotation);
      mesh.position.set(...item.assembledPos);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      mesh.userData = { id: item.id, item };
      meshesGroup.add(mesh);
      partMeshesRef.current.set(item.id, mesh);
    });

    // Raycaster for interactive clicking
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(meshesGroup.children);
      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const struct = hit.userData.item as AnatomicalStructure;
        if (struct) {
          setHoveredLabel(struct.name);
          container.style.cursor = 'pointer';
        }
      } else {
        setHoveredLabel(null);
        container.style.cursor = 'grab';
      }
    };

    const onPointerDown = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(meshesGroup.children);
      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const struct = hit.userData.item as AnatomicalStructure;
        if (struct) {
          handleSelectPart(struct);
        }
      }
    };

    container.addEventListener('mousemove', onPointerMove);
    container.addEventListener('click', onPointerDown);

    // Mouse drag for manual orbit rotation
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onDragMove = (e: MouseEvent) => {
      if (!isDragging || !meshesGroupRef.current) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      meshesGroupRef.current.rotation.y += deltaX * 0.008;
      meshesGroupRef.current.rotation.x = Math.max(
        -0.4,
        Math.min(0.4, meshesGroupRef.current.rotation.x + deltaY * 0.008)
      );
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onDragMove);

    // Scroll to zoom
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!cameraRef.current) return;
      cameraRef.current.position.z = Math.max(
        2.5,
        Math.min(9.0, cameraRef.current.position.z + e.deltaY * 0.005)
      );
    };
    container.addEventListener('wheel', onWheel, { passive: false });

    // 6. Continuous Render Loop
    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);

      if (isAutoRotating && meshesGroupRef.current) {
        meshesGroupRef.current.rotation.y += 0.006;
      }

      renderer.render(scene, camera);
    };
    animationFrameIdRef.current = requestAnimationFrame(animate);

    // Window resize
    const handleResize = () => {
      if (!container || !cameraRef.current || !rendererRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', onPointerMove);
      container.removeEventListener('click', onPointerDown);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mousemove', onDragMove);
      container.removeEventListener('wheel', onWheel);
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
      if (rendererRef.current && rendererRef.current.domElement) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [anatomicalStructures]);

  // Update dynamic explosion positioning (0% -> 100%) and highlights
  useEffect(() => {
    const t = explodePercent / 100;

    anatomicalStructures.forEach((item) => {
      const mesh = partMeshesRef.current.get(item.id);
      if (!mesh) return;

      // Visibility based on system switches
      const isVisible = systemsVisibility[item.system];
      mesh.visible = isVisible;

      // Interpolate position between assembled and exploded (like Screenshot 1!)
      const ax = item.assembledPos[0];
      const ay = item.assembledPos[1];
      const az = item.assembledPos[2];

      const ex = item.explodedPos[0];
      const ey = item.explodedPos[1];
      const ez = item.explodedPos[2];

      mesh.position.x = ax + (ex - ax) * t;
      mesh.position.y = ay + (ey - ay) * t;
      mesh.position.z = az + (ez - az) * t;

      // Highlight selected structure
      const isSelected = item.id === selectedPartId;
      const mat = mesh.material as THREE.MeshStandardMaterial;

      if (isSelected) {
        mat.color.setHex(0x14b8a6); // Glowing teal highlight
        mat.emissive.setHex(0x0f766e);
      } else {
        mat.color.setHex(item.color);
        mat.emissive.setHex(0x000000);
      }
    });
  }, [explodePercent, selectedPartId, systemsVisibility, anatomicalStructures]);

  // Camera preset views
  const setCameraView = (view: 'front' | 'back' | 'side' | 'reset') => {
    if (!meshesGroupRef.current || !cameraRef.current) return;
    setIsAutoRotating(false);

    if (view === 'front') {
      meshesGroupRef.current.rotation.set(0, 0, 0);
      cameraRef.current.position.set(0, 0.8, 6.2);
    } else if (view === 'back') {
      meshesGroupRef.current.rotation.set(0, Math.PI, 0);
      cameraRef.current.position.set(0, 0.8, 6.2);
    } else if (view === 'side') {
      meshesGroupRef.current.rotation.set(0, Math.PI / 2, 0);
      cameraRef.current.position.set(0, 0.8, 6.2);
    } else if (view === 'reset') {
      meshesGroupRef.current.rotation.set(0, 0, 0);
      cameraRef.current.position.set(0, 0.8, 6.2);
      setExplodePercent(0);
    }
  };

  const isPracticeSaved = preferredPractices.some((p) => p.asanaId === currentRegionData.id && p.isFavorite);

  return (
    <section id="human-atlas-3d" className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Header matching reference screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-teal-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-teal-400" />
            <span>INTERACTIVE ANATOMY</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>2,234 MODELED PIECES · BODYPARTS3D ATLAS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <span>Human Atlas 3D</span>
            <span className="text-xs px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-mono border border-teal-500/40">
              EXPLODABLE 3D DISSECTION
            </span>
          </h2>
        </div>

        {/* Search input on top right (matching screenshot) */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Find a structure / (e.g. Trapezius, C5, Femur)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-750 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      {/* Main Split Grid: Left 3D Stage (7 cols) + Right Clinical Therapeutics (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ================= LEFT: 3D ATLAS STAGE (7 cols) ================= */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl relative overflow-hidden shadow-2xl h-[620px] sm:h-[680px] flex flex-col">
          {/* FLOATING LEFT CARD: SYSTEMS TOGGLE PANEL (Matching screenshot) */}
          <div className="absolute top-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-3.5 shadow-2xl w-48 text-xs select-none">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
              <span className="font-bold text-white font-mono text-[11px] uppercase">SYSTEMS [15]</span>
              <button
                onClick={() => setSystemsVisibility({
                  skeleton: true, muscles: true, heart: true, nervous: true, respiratory: true, digestive: true
                })}
                className="text-[10px] text-teal-400 hover:text-teal-300 font-mono"
              >
                Reset All
              </button>
            </div>

            {/* Quick Filter Segment */}
            <div className="flex gap-1 p-0.5 bg-slate-950 rounded mb-2.5 text-[10px] font-medium">
              <button
                onClick={() => setActiveSystemFilter('all')}
                className={`flex-1 py-1 rounded text-center transition-colors ${
                  activeSystemFilter === 'all' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveSystemFilter('skeleton')}
                className={`flex-1 py-1 rounded text-center transition-colors ${
                  activeSystemFilter === 'skeleton' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                Bones
              </button>
              <button
                onClick={() => setActiveSystemFilter('muscles')}
                className={`flex-1 py-1 rounded text-center transition-colors ${
                  activeSystemFilter === 'muscles' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                Muscles
              </button>
            </div>

            {/* Toggles list with counters matching screenshot */}
            <div className="space-y-1.5 text-[11px]">
              {[
                { key: 'skeleton', label: 'Skeleton', count: 206, dot: 'bg-slate-200' },
                { key: 'muscles', label: 'Muscles', count: 432, dot: 'bg-rose-500' },
                { key: 'heart', label: 'Heart', count: 23, dot: 'bg-red-400' },
                { key: 'nervous', label: 'Nervous system', count: 159, dot: 'bg-purple-400' },
                { key: 'respiratory', label: 'Respiratory', count: 119, dot: 'bg-sky-400' },
                { key: 'digestive', label: 'Digestive', count: 84, dot: 'bg-emerald-400' },
              ].map((sys) => {
                const isChecked = systemsVisibility[sys.key as keyof typeof systemsVisibility];
                return (
                  <div key={sys.key} className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${sys.dot}`} />
                      <span>{sys.label}</span>
                    </span>
                    <div className="flex items-center gap-1.5 font-mono text-[10px]">
                      <span className="text-slate-500">{sys.count}</span>
                      <button
                        onClick={() =>
                          setSystemsVisibility((prev) => ({
                            ...prev,
                            [sys.key]: !prev[sys.key as keyof typeof systemsVisibility],
                          }))
                        }
                        className={`w-6 h-3.5 rounded-full p-0.5 transition-colors ${
                          isChecked ? 'bg-teal-400' : 'bg-slate-700'
                        }`}
                      >
                        <div
                          className={`w-2.5 h-2.5 rounded-full bg-slate-950 transition-transform ${
                            isChecked ? 'translate-x-2.5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* FLOATING HOVER INSPECTION TOOLTIP (Matching screenshot) */}
          {hoveredLabel && (
            <div className="absolute top-4 right-16 z-20 bg-slate-900/95 border border-teal-500/50 px-3 py-1.5 rounded-lg shadow-xl text-xs font-mono text-teal-300 pointer-events-none animate-fadeIn">
              <span className="text-slate-400">STRUCTURE: </span>
              <span className="font-bold text-white">{hoveredLabel}</span>
            </div>
          )}

          {/* Three.js Interactive Canvas Container */}
          <div ref={mountRef} className="w-full h-full relative cursor-grab active:cursor-grabbing" />

          {/* FLOATING BOTTOM PILL: EXPLODE ANATOMY SLIDER (Matching screenshot 1 & 2!) */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-full px-5 py-2.5 shadow-2xl flex items-center gap-4 text-xs font-mono select-none">
            <span className="text-slate-400 whitespace-nowrap">Explode anatomy</span>
            <input
              type="range"
              min="0"
              max="100"
              value={explodePercent}
              onChange={(e) => setExplodePercent(parseInt(e.target.value))}
              className="w-36 accent-teal-400 cursor-pointer"
            />
            <span className="text-teal-400 font-bold tabular-nums min-w-[36px]">
              {explodePercent}%
            </span>
            <button
              onClick={() => setExplodePercent(0)}
              className="p-1 text-slate-400 hover:text-white rounded"
              title="Reset explosion"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* FLOATING RIGHT VERTICAL CAMERA BUTTONS (Matching screenshot) */}
          <div className="absolute top-1/2 -translate-y-1/2 right-4 z-20 flex flex-col gap-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-1.5 rounded-xl shadow-xl">
            <button
              onClick={() => setCameraView('front')}
              className="w-8 h-8 rounded-lg bg-teal-400 text-slate-950 font-mono font-bold text-xs flex items-center justify-center hover:bg-teal-300 transition-colors shadow"
              title="Front View [F]"
            >
              F
            </button>
            <button
              onClick={() => setCameraView('side')}
              className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 font-mono text-xs flex items-center justify-center hover:text-white hover:bg-slate-700 transition-colors"
              title="Side View [S]"
            >
              S
            </button>
            <button
              onClick={() => setCameraView('back')}
              className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 font-mono text-xs flex items-center justify-center hover:text-white hover:bg-slate-700 transition-colors"
              title="Back View [B]"
            >
              B
            </button>
            <div className="w-6 h-px bg-slate-850 my-1 mx-auto" />
            <button
              onClick={() => setIsAutoRotating(!isAutoRotating)}
              className={`w-8 h-8 rounded-lg text-xs flex items-center justify-center transition-colors ${
                isAutoRotating ? 'bg-teal-500/20 text-teal-400' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
              title="Toggle 360° Turntable"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCameraView('reset')}
              className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-xs flex items-center justify-center transition-colors"
              title="Reset Camera"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ================= RIGHT: SPECIFIC INNER STRUCTURE, YOGA & FOODS (5 cols) ================= */}
        <div className="lg:col-span-5 space-y-5">
          {/* Segmented Top Switcher */}
          <div className="flex items-center justify-between p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              onClick={() => setRightPanelTab('anatomy')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                rightPanelTab === 'anatomy' ? 'bg-teal-400 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Inner Structure</span>
            </button>
            <button
              onClick={() => setRightPanelTab('yoga')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                rightPanelTab === 'yoga' ? 'bg-teal-400 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Targeted Yoga</span>
            </button>
            <button
              onClick={() => setRightPanelTab('nutrition')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                rightPanelTab === 'nutrition' ? 'bg-teal-400 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Apple className="w-3.5 h-3.5" />
              <span>Healing Foods</span>
            </button>
          </div>

          {/* TAB 1: SPECIFIC INNER STRUCTURE DETAILS (NO STATIC IMAGE!) */}
          {rightPanelTab === 'anatomy' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
              {/* Active Selected Part Title */}
              <div className="border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2 text-xs font-mono text-teal-400 mb-1">
                  <span>SYSTEM: {selectedPart.system.toUpperCase()}</span>
                  <span aria-hidden="true">·</span>
                  <span>{currentRegionData.label}</span>
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {selectedPart.name}
                </h3>
                <div className="text-xs text-teal-300 font-mono italic mt-0.5">
                  {selectedPart.latinName}
                </div>
              </div>

              {/* Action and Biomechanical Function */}
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl text-xs space-y-1">
                <span className="font-semibold text-slate-200 block font-mono text-[11px] uppercase text-teal-400">
                  BIOMECHANICAL ROLE & ACTION:
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {selectedPart.action}
                </p>
              </div>

              {/* Innervation & Nerve Supply */}
              <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-xl text-xs space-y-1">
                <span className="font-semibold text-purple-300 block font-mono text-[11px] uppercase">
                  NEURAL INNERVATION & SPINAL ROOTS:
                </span>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {selectedPart.innervation}
                </p>
              </div>

              {/* Region Specific Muscles & Articular Joints */}
              <div className="space-y-3">
                <span className="text-xs font-mono text-slate-300 uppercase tracking-wider block font-semibold">
                  ASSOCIATED MUSCLES & ARTICULATIONS IN REGION:
                </span>

                <div className="space-y-2">
                  {currentRegionData.innerStructure.muscles.slice(0, 2).map((m, idx) => (
                    <div key={idx} className="p-3 bg-slate-950/40 border border-slate-850 rounded-lg text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">{m.name}</span>
                        <span className="text-[10px] text-teal-300 font-mono italic">{m.latinName}</span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{m.action}</p>
                      <div className="text-[10px] font-mono text-amber-400/90 pt-1 border-t border-slate-850">
                        TRIGGER POINT: {m.triggerPoints}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-lg text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">
                      {currentRegionData.innerStructure.joints[0]?.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {currentRegionData.innerStructure.joints[0]?.jointType}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    {currentRegionData.innerStructure.joints[0]?.cartilageTissue}
                  </div>
                  <div className="text-[10px] font-mono text-rose-400/90 pt-1 border-t border-slate-850">
                    LOAD VULNERABILITY: {currentRegionData.innerStructure.joints[0]?.mechanicalVulnerability}
                  </div>
                </div>
              </div>

              {/* Quick Jump Buttons to Yoga & Foods */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setRightPanelTab('yoga')}
                  className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-slate-700"
                >
                  <Heart className="w-3.5 h-3.5 text-teal-400" />
                  <span>View Targeted Asanas</span>
                </button>
                <button
                  onClick={() => setRightPanelTab('nutrition')}
                  className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-slate-700"
                >
                  <Apple className="w-3.5 h-3.5 text-emerald-400" />
                  <span>View Healing Foods</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: TARGETED YOGA ASANAS */}
          {rightPanelTab === 'yoga' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
              <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-teal-400 mb-1">
                    <span>PRESCRIPTIVE POSTURE FOR {currentRegionData.label.toUpperCase()}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {currentRegionData.primaryAsana.sanskrit}
                  </h3>
                  <div className="text-xs text-teal-300 font-medium">
                    {currentRegionData.primaryAsana.english}
                  </div>
                </div>

                <button
                  onClick={() => onStartPractice(currentRegionData)}
                  className="px-4 py-2 bg-teal-400 hover:bg-teal-300 text-slate-950 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Practice</span>
                </button>
              </div>

              {/* Breathing Cadence Indicator */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 text-slate-300">
                  <Wind className="w-4 h-4 text-teal-400" />
                  <span className="font-semibold text-teal-400">PRANAYAMA RATIO:</span>
                  <span>{currentRegionData.primaryAsana.breathingRatio}</span>
                </div>
                <span className="text-slate-400">
                  {Math.floor(currentRegionData.primaryAsana.durationSeconds / 60)} MIN
                </span>
              </div>

              {/* Biomechanical Vector */}
              <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 text-xs">
                <span className="text-teal-400 font-semibold uppercase tracking-wider block mb-1">
                  BIOMECHANICAL ACTION:
                </span>
                <p className="text-slate-200 leading-relaxed text-[11px]">
                  {currentRegionData.primaryAsana.biomechanicalAction}
                </p>
              </div>

              {/* Steps */}
              <div className="space-y-2">
                <span className="text-xs font-mono text-slate-300 uppercase tracking-wider block font-semibold">
                  ALIGNMENT STEPS:
                </span>
                <ol className="space-y-1.5 text-xs text-slate-300 list-decimal list-inside pl-1">
                  {currentRegionData.primaryAsana.steps.map((step, idx) => (
                    <li key={idx} className="leading-relaxed pl-1 text-[11px]">
                      <span className="text-slate-200">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Contraindications */}
              <div className="p-3 bg-amber-950/20 border border-amber-900/40 rounded-lg text-xs text-amber-300/90 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-amber-300">CONTRAINDICATIONS: </span>
                  <span>{currentRegionData.primaryAsana.contraindications.join(', ')}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TARGETED HEALING FOODS */}
          {rightPanelTab === 'nutrition' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
              <div className="border-b border-slate-800 pb-3">
                <div className="text-xs font-mono text-teal-400 uppercase tracking-wider mb-1">
                  BIOCHEMICAL TISSUE REPAIR PHARMACOPOEIA
                </div>
                <h3 className="text-lg font-bold text-white">
                  Healing Foods for {currentRegionData.label}
                </h3>
              </div>

              {/* Quantum Asana + Food Synergy Multiplier */}
              <div className="p-4 bg-teal-950/20 border border-teal-500/40 rounded-xl text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-teal-300 font-semibold font-mono">
                    <Sparkles className="w-4 h-4 text-teal-400" />
                    <span>QUANTUM ASANA-FOOD SYNERGY:</span>
                  </div>
                  <span className="px-2 py-0.5 bg-teal-500/20 text-teal-300 rounded font-mono font-bold text-[11px]">
                    {currentRegionData.quantumSynergy.synergyScore}
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {currentRegionData.quantumSynergy.combinedMechanism}
                </p>
              </div>

              {/* Curated Foods List */}
              <div className="space-y-3">
                {currentRegionData.healingFoods.map((food, idx) => {
                  const isBookmarked = bookmarkedFoods.includes(food.name);
                  return (
                    <div
                      key={idx}
                      className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-slate-900 border border-slate-750 rounded text-teal-300">
                              {food.category}
                            </span>
                          </div>
                          <h5 className="text-xs font-bold text-white">{food.name}</h5>
                          <span className="text-[11px] text-slate-300">
                            Key Active: {food.bioactiveCompounds}
                          </span>
                        </div>

                        <button
                          onClick={() => toggleBookmarkFood(food.name)}
                          className={`p-1.5 rounded transition-colors ${
                            isBookmarked ? 'text-teal-400 bg-teal-500/20' : 'text-slate-500 hover:text-white'
                          }`}
                          title="Bookmark food"
                        >
                          {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                        </button>
                      </div>

                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        <span className="font-semibold text-slate-200">Action: </span>
                        {food.mechanism}
                      </p>

                      <div className="text-[10px] font-mono text-teal-400 pt-1 border-t border-slate-850">
                        PREPARATION: {food.prepAndTiming}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
