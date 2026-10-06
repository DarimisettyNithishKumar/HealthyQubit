import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { BodyPartData, BodyRegion } from '../types';
import { ANATOMY_CATALOG } from '../data/anatomyCatalog';
import { 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Layers, 
  Activity, 
  Eye, 
  Sparkles,
  Flame,
  ShieldCheck,
  Heart,
  Sliders,
  Compass,
  ArrowRight,
  Zap
} from 'lucide-react';

export type AnatomicalLayerType = 'muscular' | 'skeletal' | 'nervous' | 'organs' | 'heatmap' | 'translucent';

interface ThreeDimensionalBodyCanvasProps {
  selectedRegionId: BodyRegion;
  onSelectRegion: (region: BodyPartData) => void;
  activeLayer: AnatomicalLayerType;
  onLayerChange: (layer: AnatomicalLayerType) => void;
}

interface MeshMetadata {
  regionId: BodyRegion;
  partName: string;
  system: 'muscle' | 'skeleton' | 'organ' | 'nerve';
  baseColor: number;
  radialDir: [number, number, number]; // vector for exploded dissection mode
}

export const ThreeDimensionalBodyCanvas: React.FC<ThreeDimensionalBodyCanvasProps> = ({
  selectedRegionId,
  onSelectRegion,
  activeLayer,
  onLayerChange,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const bodyGroupRef = useRef<THREE.Group | null>(null);
  const interactiveMeshesRef = useRef<THREE.Mesh[]>([]);
  const heartMeshRef = useRef<THREE.Mesh | null>(null);
  const reqAnimIdRef = useRef<number | null>(null);

  // Turntable and interaction state
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(false);
  const [hoveredPartName, setHoveredPartName] = useState<string | null>(null);
  const [explodeRatio, setExplodeRatio] = useState<number>(0);
  const [showExplodeControl, setShowExplodeControl] = useState<boolean>(false);
  const [currentZoom, setCurrentZoom] = useState<number>(5.2);

  // Drag-to-rotate tracking references
  const isDraggingRef = useRef<boolean>(false);
  const prevPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const rotationVelocityRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const targetRotationRef = useRef<{ x: number; y: number }>({ x: 0.05, y: 0 });
  const currentRotationRef = useRef<{ x: number; y: number }>({ x: 0.05, y: 0 });

  // Camera targets for smooth framing
  const regionCameraTargets: Record<BodyRegion, { x: number; y: number; z: number; targetY: number }> = {
    head: { x: 0, y: 2.8, z: 2.9, targetY: 2.7 },
    neck: { x: 0, y: 2.2, z: 2.7, targetY: 2.2 },
    shoulders: { x: 0, y: 1.8, z: 3.2, targetY: 1.7 },
    chest: { x: 0, y: 1.4, z: 3.2, targetY: 1.35 },
    gut: { x: 0, y: 0.8, z: 3.0, targetY: 0.75 },
    back: { x: 0, y: 1.0, z: -3.2, targetY: 0.9 }, // posterior view target
    pelvis: { x: 0, y: 0.2, z: 3.0, targetY: 0.15 },
    knees: { x: 0, y: -0.9, z: 3.2, targetY: -0.9 },
    feet: { x: 0, y: -1.7, z: 3.0, targetY: -1.75 },
  };

  const cameraTargetRef = useRef<{ x: number; y: number; z: number; targetY: number }>({
    x: 0,
    y: 0.4,
    z: 5.2,
    targetY: 0.3,
  });

  // Primary Three.js setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x020617, 0.06);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 5.2);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // 4. Clinical Three-Point Studio Lighting
    const ambientLight = new THREE.AmbientLight(0x0f172a, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x14b8a6, 2.8);
    keyLight.position.set(3, 4, 4);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.8);
    fillLight.position.set(-3, 1, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x06b6d4, 2.6);
    rimLight.position.set(0, 3, -4);
    scene.add(rimLight);

    const bottomGlow = new THREE.PointLight(0x0d9488, 1.4, 8);
    bottomGlow.position.set(0, -2.2, 1.5);
    scene.add(bottomGlow);

    // 5. Build Human Body Anatomical Mesh Hierarchy
    const bodyGroup = new THREE.Group();
    bodyGroupRef.current = bodyGroup;
    scene.add(bodyGroup);

    interactiveMeshesRef.current = [];

    // Helper material generator
    const createMat = (baseColor: number, roughness = 0.45, metalness = 0.1) => {
      return new THREE.MeshStandardMaterial({
        color: baseColor,
        roughness,
        metalness,
      });
    };

    // Helper to register anatomical part
    const addPart = (
      geom: THREE.BufferGeometry,
      mat: THREE.Material,
      regionId: BodyRegion,
      partName: string,
      system: 'muscle' | 'skeleton' | 'organ' | 'nerve',
      pos: [number, number, number],
      rot: [number, number, number] = [0, 0, 0],
      scale: [number, number, number] = [1, 1, 1],
      radialDir: [number, number, number] = [0, 0, 0]
    ) => {
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(...pos);
      mesh.rotation.set(...rot);
      mesh.scale.set(...scale);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      mesh.userData = {
        regionId,
        partName,
        system,
        baseColor: (mat as THREE.MeshStandardMaterial).color ? (mat as THREE.MeshStandardMaterial).color.getHex() : 0x14b8a6,
        originalPos: pos,
        radialDir,
      } as MeshMetadata & { originalPos: [number, number, number] };

      bodyGroup.add(mesh);
      interactiveMeshesRef.current.push(mesh);
      return mesh;
    };

    // Colors
    const muscleCol = 0x991b1b; // Anatomical terracotta/crimson
    const boneCol = 0xe2e8f0;   // Ivory skeleton
    const organCol = 0xb91c1c;  // Visceral organ
    const lungCol = 0x38bdf8;   // Pulmonary cyan
    const nerveCol = 0xf59e0b;  // Gold/amber nerve

    // ================== A. CRANIUM & HEAD (head) ==================
    // 1. Cranial Vault (Bones)
    const craniumGeom = new THREE.SphereGeometry(0.32, 32, 28);
    craniumGeom.scale(0.88, 1.08, 0.96);
    addPart(craniumGeom, createMat(boneCol, 0.55, 0.2), 'head', 'Cranial Vault & Frontal Bone', 'skeleton', [0, 2.76, 0], [0, 0, 0], [1, 1, 1], [0, 0.4, 0.1]);

    // 2. Temporalis & Frontalis (Muscles)
    const temporalisGeom = new THREE.SphereGeometry(0.33, 28, 24);
    temporalisGeom.scale(0.89, 1.09, 0.94);
    addPart(temporalisGeom, createMat(muscleCol, 0.4, 0.1), 'head', 'Frontalis & Temporalis Muscle', 'muscle', [0, 2.76, 0.02], [0, 0, 0], [1, 1, 1], [0, 0.5, 0.3]);

    // 3. Mandible Jaw Bone
    const mandibleGeom = new THREE.BoxGeometry(0.24, 0.14, 0.22);
    addPart(mandibleGeom, createMat(boneCol, 0.6, 0.2), 'head', 'Mandible & TMJ Condyle', 'skeleton', [0, 2.45, 0.1], [0.15, 0, 0], [1, 1, 1], [0, 0.1, 0.4]);

    // ================== B. CERVICAL SPINE & NECK (neck) ==================
    // 1. Cervical Vertebrae (C1-C7 Column)
    const cervicalSpineGeom = new THREE.CylinderGeometry(0.09, 0.11, 0.36, 16);
    addPart(cervicalSpineGeom, createMat(boneCol, 0.5, 0.2), 'neck', 'Cervical Vertebrae (C1-C7)', 'skeleton', [0, 2.22, -0.04], [0, 0, 0], [1, 1, 1], [0, 0, -0.2]);

    // 2. Sternocleidomastoid & Scalene Muscles
    const neckMusclesGeom = new THREE.CylinderGeometry(0.14, 0.17, 0.38, 24);
    addPart(neckMusclesGeom, createMat(muscleCol, 0.45, 0.1), 'neck', 'Sternocleidomastoid & Deep Flexors', 'muscle', [0, 2.2, 0.02], [0, 0, 0], [1, 1, 1], [0, 0, 0.3]);

    // ================== C. SCAPULOHUMERAL GIRDLE & ARMS (shoulders) ==================
    // 1. Clavicular Arch
    const clavicleGeom = new THREE.CylinderGeometry(0.035, 0.035, 1.25, 16);
    addPart(clavicleGeom, createMat(boneCol, 0.6, 0.2), 'shoulders', 'Clavicles & Acromioclavicular Arch', 'skeleton', [0, 1.88, 0.06], [0, 0, Math.PI / 2], [1, 1, 1], [0, 0.2, 0.2]);

    // 2. Deltoids (L/R)
    const deltoidGeom = new THREE.SphereGeometry(0.2, 24, 20);
    deltoidGeom.scale(1.2, 0.95, 0.9);
    addPart(deltoidGeom, createMat(muscleCol, 0.4, 0.1), 'shoulders', 'Right Deltoid & Rotator Cuff', 'muscle', [0.72, 1.8, 0], [0, 0, -0.2], [1, 1, 1], [0.5, 0.1, 0]);
    addPart(deltoidGeom.clone(), createMat(muscleCol, 0.4, 0.1), 'shoulders', 'Left Deltoid & Rotator Cuff', 'muscle', [-0.72, 1.8, 0], [0, 0, 0.2], [1, 1, 1], [-0.5, 0.1, 0]);

    // 3. Brachium Upper Arms (Biceps & Triceps)
    const upperArmGeom = new THREE.CylinderGeometry(0.11, 0.09, 0.68, 16);
    addPart(upperArmGeom, createMat(muscleCol, 0.45, 0.1), 'shoulders', 'Right Biceps / Triceps', 'muscle', [0.82, 1.3, 0], [0, 0, -0.15], [1, 1, 1], [0.6, 0, 0]);
    addPart(upperArmGeom.clone(), createMat(muscleCol, 0.45, 0.1), 'shoulders', 'Left Biceps / Triceps', 'muscle', [-0.82, 1.3, 0], [0, 0, 0.15], [1, 1, 1], [-0.6, 0, 0]);

    // 4. Forearms & Wrists
    const forearmGeom = new THREE.CylinderGeometry(0.085, 0.07, 0.72, 16);
    addPart(forearmGeom, createMat(muscleCol, 0.45, 0.1), 'shoulders', 'Right Forearm Flexors', 'muscle', [0.96, 0.6, 0.05], [0, 0, -0.2], [1, 1, 1], [0.7, -0.2, 0]);
    addPart(forearmGeom.clone(), createMat(muscleCol, 0.45, 0.1), 'shoulders', 'Left Forearm Flexors', 'muscle', [-0.96, 0.6, 0.05], [0, 0, 0.2], [1, 1, 1], [-0.7, -0.2, 0]);

    // Hands
    const handGeom = new THREE.BoxGeometry(0.09, 0.22, 0.06);
    addPart(handGeom, createMat(boneCol, 0.5, 0.2), 'shoulders', 'Right Hand & Metacarpals', 'skeleton', [1.08, 0.15, 0.05], [0, 0, -0.2]);
    addPart(handGeom.clone(), createMat(boneCol, 0.5, 0.2), 'shoulders', 'Left Hand & Metacarpals', 'skeleton', [-1.08, 0.15, 0.05], [0, 0, 0.2]);

    // ================== D. THORAX & CHEST (chest) ==================
    // 1. Ribcage & Thoracic Spine
    const ribcageGeom = new THREE.CylinderGeometry(0.48, 0.4, 0.65, 32);
    ribcageGeom.scale(1.15, 1, 0.72);
    addPart(ribcageGeom, createMat(boneCol, 0.55, 0.2), 'chest', 'Thoracic Ribcage (T1-T12) & Sternum', 'skeleton', [0, 1.48, 0], [0, 0, 0], [1, 1, 1], [0, 0, -0.2]);

    // 2. Pectoralis Major Muscles (L/R)
    const pecGeom = new THREE.BoxGeometry(0.38, 0.32, 0.14);
    pecGeom.scale(1, 0.9, 0.8);
    addPart(pecGeom, createMat(muscleCol, 0.4, 0.1), 'chest', 'Right Pectoralis Major', 'muscle', [0.26, 1.52, 0.18], [0, 0, -0.1], [1, 1, 1], [0.3, 0.2, 0.4]);
    addPart(pecGeom.clone(), createMat(muscleCol, 0.4, 0.1), 'chest', 'Left Pectoralis Major', 'muscle', [-0.26, 1.52, 0.18], [0, 0, 0.1], [1, 1, 1], [-0.3, 0.2, 0.4]);

    // 3. Cardiopulmonary Organs (Heart & Lungs inside chest)
    const heartGeom = new THREE.SphereGeometry(0.14, 20, 18);
    heartGeom.scale(0.9, 1.15, 0.85);
    const heartMesh = addPart(heartGeom, createMat(0xd946ef, 0.3, 0.2), 'chest', 'Myocardium Heart (Beating)', 'organ', [-0.07, 1.48, 0.06], [0, 0, 0.2], [1, 1, 1], [0, 0, 0.5]);
    heartMeshRef.current = heartMesh;

    // Lungs
    const lungGeom = new THREE.SphereGeometry(0.18, 20, 18);
    lungGeom.scale(0.9, 1.4, 0.75);
    addPart(lungGeom, createMat(lungCol, 0.4, 0.1), 'chest', 'Right Pulmonary Lung', 'organ', [0.24, 1.48, 0.02], [0, 0, -0.1], [1, 1, 1], [0.4, 0, 0.3]);
    addPart(lungGeom.clone(), createMat(lungCol, 0.4, 0.1), 'chest', 'Left Pulmonary Lung', 'organ', [-0.24, 1.48, 0.02], [0, 0, 0.1], [1, 1, 1], [-0.4, 0, 0.3]);

    // ================== E. ABDOMEN & ENTERIC VISCERA (gut) ==================
    // 1. Rectus Abdominis (Six-pack abdominal core)
    const absGeom = new THREE.BoxGeometry(0.36, 0.55, 0.12);
    addPart(absGeom, createMat(muscleCol, 0.4, 0.1), 'gut', 'Rectus Abdominis & Linea Alba', 'muscle', [0, 0.92, 0.16], [0, 0, 0], [1, 1, 1], [0, 0, 0.5]);

    // 2. Visceral Enteric Organs (Stomach, Liver & Intestines)
    const gutVisceraGeom = new THREE.CylinderGeometry(0.38, 0.36, 0.52, 28);
    gutVisceraGeom.scale(1, 1, 0.7);
    addPart(gutVisceraGeom, createMat(0x10b981, 0.45, 0.1), 'gut', 'Enteric Viscera & Digestive Wall', 'organ', [0, 0.9, 0.02], [0, 0, 0], [1, 1, 1], [0, 0, 0.3]);

    // ================== F. LUMBAR SPINE & THORACIC AXIS (back) ==================
    // 1. Lumbar Spine Lordosis (L1-L5)
    const lumbarGeom = new THREE.CylinderGeometry(0.09, 0.11, 0.72, 16);
    addPart(lumbarGeom, createMat(boneCol, 0.5, 0.25), 'back', 'Lumbar Spine (L1-L5 Lordosis)', 'skeleton', [0, 0.98, -0.18], [0, 0, 0], [1, 1, 1], [0, 0, -0.4]);

    // 2. Latissimus Dorsi & Multifidus (Posterior wings)
    const latissimusGeom = new THREE.BoxGeometry(0.85, 0.7, 0.12);
    latissimusGeom.scale(1, 1, 0.8);
    addPart(latissimusGeom, createMat(muscleCol, 0.45, 0.1), 'back', 'Latissimus Dorsi & Multifidus', 'muscle', [0, 1.25, -0.16], [0, 0, 0], [1, 1, 1], [0, 0, -0.5]);

    // ================== G. PELVIC BASIN & HIPS (pelvis) ==================
    // 1. Pelvic Bone Girdle & Sacrum
    const pelvisGeom = new THREE.CylinderGeometry(0.46, 0.42, 0.42, 32);
    pelvisGeom.scale(1.18, 1, 0.82);
    addPart(pelvisGeom, createMat(boneCol, 0.55, 0.2), 'pelvis', 'Pelvic Basin, Iliac Crest & Sacrum', 'skeleton', [0, 0.4, 0], [0, 0, 0], [1, 1, 1], [0, -0.1, -0.2]);

    // 2. Gluteals & Iliopsoas Complex
    const gluteGeom = new THREE.SphereGeometry(0.28, 24, 20);
    gluteGeom.scale(1, 1.1, 0.9);
    addPart(gluteGeom, createMat(muscleCol, 0.45, 0.1), 'pelvis', 'Right Gluteus Maximus & Medius', 'muscle', [0.24, 0.38, -0.16], [0, 0, 0], [1, 1, 1], [0.3, 0, -0.4]);
    addPart(gluteGeom.clone(), createMat(muscleCol, 0.45, 0.1), 'pelvis', 'Left Gluteus Maximus & Medius', 'muscle', [-0.24, 0.38, -0.16], [0, 0, 0], [1, 1, 1], [-0.3, 0, -0.4]);

    // ================== H. THIGHS & KNEES (knees) ==================
    // 1. Femur Bones (L/R)
    const femurGeom = new THREE.CylinderGeometry(0.08, 0.08, 0.95, 16);
    addPart(femurGeom, createMat(boneCol, 0.55, 0.2), 'knees', 'Right Femur Shaft', 'skeleton', [0.34, -0.32, 0], [0, 0, 0.04]);
    addPart(femurGeom.clone(), createMat(boneCol, 0.55, 0.2), 'knees', 'Left Femur Shaft', 'skeleton', [-0.34, -0.32, 0], [0, 0, -0.04]);

    // 2. Quadriceps & Hamstrings Muscles
    const quadGeom = new THREE.CylinderGeometry(0.2, 0.16, 0.94, 24);
    addPart(quadGeom, createMat(muscleCol, 0.45, 0.1), 'knees', 'Right Quadriceps & Hamstrings', 'muscle', [0.34, -0.32, 0.02], [0, 0, 0.04], [1, 1, 1], [0.3, 0, 0.3]);
    addPart(quadGeom.clone(), createMat(muscleCol, 0.45, 0.1), 'knees', 'Left Quadriceps & Hamstrings', 'muscle', [-0.34, -0.32, 0.02], [0, 0, -0.04], [1, 1, 1], [-0.3, 0, 0.3]);

    // 3. Patellae & Knee Articulations
    const kneeGeom = new THREE.SphereGeometry(0.13, 20, 18);
    addPart(kneeGeom, createMat(boneCol, 0.5, 0.2), 'knees', 'Right Patella & Meniscus', 'skeleton', [0.34, -0.88, 0.09], [0, 0, 0], [1, 1, 1], [0.2, 0, 0.4]);
    addPart(kneeGeom.clone(), createMat(boneCol, 0.5, 0.2), 'knees', 'Left Patella & Meniscus', 'skeleton', [-0.34, -0.88, 0.09], [0, 0, 0], [1, 1, 1], [-0.2, 0, 0.4]);

    // ================== I. SHINS, CALVES & FEET (feet) ==================
    // 1. Tibia & Fibula Bones
    const tibiaGeom = new THREE.CylinderGeometry(0.07, 0.065, 0.9, 16);
    addPart(tibiaGeom, createMat(boneCol, 0.55, 0.2), 'feet', 'Right Tibia & Fibula', 'skeleton', [0.34, -1.38, 0], [0, 0, 0]);
    addPart(tibiaGeom.clone(), createMat(boneCol, 0.55, 0.2), 'feet', 'Left Tibia & Fibula', 'skeleton', [-0.34, -1.38, 0], [0, 0, 0]);

    // 2. Gastrocnemius / Calves Muscles
    const calfGeom = new THREE.CylinderGeometry(0.15, 0.11, 0.88, 20);
    addPart(calfGeom, createMat(muscleCol, 0.45, 0.1), 'feet', 'Right Gastrocnemius Calf', 'muscle', [0.34, -1.38, -0.02], [0, 0, 0], [1, 1, 1], [0.3, 0, -0.3]);
    addPart(calfGeom.clone(), createMat(muscleCol, 0.45, 0.1), 'feet', 'Left Gastrocnemius Calf', 'muscle', [-0.34, -1.38, -0.02], [0, 0, 0], [1, 1, 1], [-0.3, 0, -0.3]);

    // 3. Plantar Foundation & Calcaneus Heel
    const footGeom = new THREE.BoxGeometry(0.17, 0.12, 0.42);
    addPart(footGeom, createMat(boneCol, 0.5, 0.2), 'feet', 'Right Plantar Fascia & Calcaneus', 'skeleton', [0.34, -1.86, 0.12], [0, 0, 0], [1, 1, 1], [0.2, -0.2, 0.3]);
    addPart(footGeom.clone(), createMat(boneCol, 0.5, 0.2), 'feet', 'Left Plantar Fascia & Calcaneus', 'skeleton', [-0.34, -1.86, 0.12], [0, 0, 0], [1, 1, 1], [-0.2, -0.2, 0.3]);

    // ================== J. SUSHUMNA MERIDIAN HOLOGRAPHIC BEAM ==================
    const beamGeom = new THREE.CylinderGeometry(0.018, 0.018, 5.0, 16);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x14b8a6,
      transparent: true,
      opacity: 0.7,
    });
    const meridianBeam = new THREE.Mesh(beamGeom, beamMat);
    meridianBeam.position.set(0, 0.5, 0);
    bodyGroup.add(meridianBeam);

    // Glowing Concentric Base Pedestal Rings
    const ringGeom = new THREE.RingGeometry(1.4, 1.45, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x14b8a6,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45,
    });
    const ringMesh = new THREE.Mesh(ringGeom, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = -1.95;
    scene.add(ringMesh);

    const innerRingGeom = new THREE.RingGeometry(0.9, 0.93, 48);
    const innerRingMesh = new THREE.Mesh(innerRingGeom, ringMat);
    innerRingMesh.rotation.x = Math.PI / 2;
    innerRingMesh.position.y = -1.94;
    scene.add(innerRingMesh);

    // ================== K. INTERACTIVE MOUSE / TOUCH PICKING & 360° DRAG ==================
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Mouse Move (Raycast Hover + Drag Rotation)
    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX;
      const clientY = e.clientY;

      if (isDraggingRef.current) {
        // Drag-to-rotate in 360°
        const deltaX = clientX - prevPointerRef.current.x;
        const deltaY = clientY - prevPointerRef.current.y;
        prevPointerRef.current = { x: clientX, y: clientY };

        // Store velocity for inertia
        rotationVelocityRef.current = {
          x: deltaX * 0.007,
          y: deltaY * 0.007,
        };

        targetRotationRef.current.y += deltaX * 0.007;
        targetRotationRef.current.x = Math.max(
          -0.6,
          Math.min(0.6, targetRotationRef.current.x + deltaY * 0.007)
        );
      } else {
        // Raycaster Hover check
        mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(interactiveMeshesRef.current);

        if (intersects.length > 0) {
          const topMesh = intersects[0].object as THREE.Mesh;
          const meta = topMesh.userData as MeshMetadata;
          setHoveredPartName(meta.partName);
          container.style.cursor = 'pointer';
        } else {
          setHoveredPartName(null);
          container.style.cursor = 'grab';
        }
      }
    };

    // Pointer Down (Start Drag / Click)
    const onPointerDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      prevPointerRef.current = { x: e.clientX, y: e.clientY };
      rotationVelocityRef.current = { x: 0, y: 0 };
      container.style.cursor = 'grabbing';
    };

    // Pointer Up (End Drag / Perform Click Selection if minimal movement)
    const onPointerUp = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const movedDist = Math.hypot(
        e.clientX - prevPointerRef.current.x,
        e.clientY - prevPointerRef.current.y
      );

      isDraggingRef.current = false;
      container.style.cursor = 'grab';

      // If minimal drag movement, treat as click selection
      if (movedDist < 5) {
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(interactiveMeshesRef.current);

        if (intersects.length > 0) {
          const hitMesh = intersects[0].object as THREE.Mesh;
          const meta = hitMesh.userData as MeshMetadata;
          const matchedCatalog = ANATOMY_CATALOG.find((c) => c.id === meta.regionId);
          if (matchedCatalog) {
            onSelectRegion(matchedCatalog);
          }
        }
      }
    };

    // Touch Support for Mobile / Tablets
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        prevPointerRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        rotationVelocityRef.current = { x: 0, y: 0 };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && isDraggingRef.current) {
        const clientX = e.touches[0].clientX;
        const clientY = e.touches[0].clientY;
        const deltaX = clientX - prevPointerRef.current.x;
        const deltaY = clientY - prevPointerRef.current.y;
        prevPointerRef.current = { x: clientX, y: clientY };

        targetRotationRef.current.y += deltaX * 0.009;
        targetRotationRef.current.x = Math.max(
          -0.6,
          Math.min(0.6, targetRotationRef.current.x + deltaY * 0.009)
        );
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      isDraggingRef.current = false;
    };

    // Wheel Scroll for Zooming
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const deltaZ = e.deltaY * 0.005;
      cameraTargetRef.current.z = Math.max(2.2, Math.min(8.0, cameraTargetRef.current.z + deltaZ));
      setCurrentZoom(cameraTargetRef.current.z);
    };

    container.addEventListener('mousemove', onPointerMove);
    container.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mouseup', onPointerUp);
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);
    container.addEventListener('wheel', onWheel, { passive: false });

    // ================== L. SMOOTH 60FPS RENDER & DYNAMICS LOOP ==================
    let previousTime = performance.now();
    let heartTime = 0;

    const animate = (currentTime: number) => {
      reqAnimIdRef.current = requestAnimationFrame(animate);
      const delta = (currentTime - previousTime) * 0.001;
      previousTime = currentTime;
      heartTime += delta * 4.5;

      // Beating heart pulse animation
      if (heartMeshRef.current) {
        const pulse = 1 + Math.sin(heartTime) * 0.08 + Math.cos(heartTime * 2) * 0.04;
        heartMeshRef.current.scale.set(pulse, pulse * 1.15, pulse * 0.9);
      }

      // Auto-rotation turntable if enabled
      if (isAutoRotating && !isDraggingRef.current) {
        targetRotationRef.current.y += 0.008;
      } else if (!isDraggingRef.current) {
        // Inertia decay
        targetRotationRef.current.y += rotationVelocityRef.current.x;
        targetRotationRef.current.x = Math.max(
          -0.6,
          Math.min(0.6, targetRotationRef.current.x + rotationVelocityRef.current.y)
        );
        rotationVelocityRef.current.x *= 0.92;
        rotationVelocityRef.current.y *= 0.92;
      }

      // Smoothly interpolate body rotation toward target
      currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * 0.12;
      currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * 0.12;

      if (bodyGroupRef.current) {
        bodyGroupRef.current.rotation.y = currentRotationRef.current.y;
        bodyGroupRef.current.rotation.x = currentRotationRef.current.x;
      }

      // Smooth camera interpolation
      if (cameraRef.current) {
        const target = cameraTargetRef.current;
        cameraRef.current.position.lerp(new THREE.Vector3(target.x, target.y, target.z), 0.06);
        cameraRef.current.lookAt(0, target.targetY, 0);
      }

      renderer.render(scene, camera);
    };

    reqAnimIdRef.current = requestAnimationFrame(animate);

    // Resize handler
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
      container.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mouseup', onPointerUp);
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      container.removeEventListener('wheel', onWheel);
      if (reqAnimIdRef.current) cancelAnimationFrame(reqAnimIdRef.current);
      if (rendererRef.current && rendererRef.current.domElement) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, []);

  // Update dynamic exploded view positioning (0 to 1)
  useEffect(() => {
    interactiveMeshesRef.current.forEach((mesh) => {
      const uData = mesh.userData as MeshMetadata & { originalPos: [number, number, number] };
      if (!uData || !uData.originalPos) return;

      const [ox, oy, oz] = uData.originalPos;
      const [rx, ry, rz] = uData.radialDir;

      mesh.position.x = ox + rx * (explodeRatio / 100) * 1.4;
      mesh.position.y = oy + ry * (explodeRatio / 100) * 1.4;
      mesh.position.z = oz + rz * (explodeRatio / 100) * 1.4;
    });
  }, [explodeRatio]);

  // Update layer materials and selection highlights
  useEffect(() => {
    interactiveMeshesRef.current.forEach((mesh) => {
      const meta = mesh.userData as MeshMetadata;
      const isSelected = meta.regionId === selectedRegionId;
      const mat = mesh.material as THREE.MeshStandardMaterial;

      // Visibility based on system layer
      if (activeLayer === 'skeletal') {
        // Skeletal system: hide muscles and organs unless selected
        if (meta.system === 'muscle' || meta.system === 'organ') {
          mesh.visible = isSelected;
          mat.transparent = true;
          mat.opacity = 0.25;
        } else {
          mesh.visible = true;
          mat.transparent = false;
          mat.opacity = 1.0;
        }
      } else if (activeLayer === 'organs') {
        // Internal organs emphasis
        if (meta.system === 'organ') {
          mesh.visible = true;
          mat.transparent = false;
          mat.opacity = 1.0;
        } else if (meta.system === 'muscle') {
          mat.transparent = true;
          mat.opacity = 0.3;
        } else {
          mesh.visible = true;
          mat.transparent = true;
          mat.opacity = 0.5;
        }
      } else {
        mesh.visible = true;
        mat.transparent = activeLayer === 'translucent';
        mat.opacity = activeLayer === 'translucent' ? 0.65 : 1.0;
      }

      // Material color themes
      if (activeLayer === 'heatmap') {
        // Somatic strain thermography
        if (isSelected) {
          mat.color.setHex(0xef4444);
          mat.emissive.setHex(0xb91c1c);
        } else if (meta.regionId === 'back' || meta.regionId === 'neck') {
          mat.color.setHex(0xf97316);
          mat.emissive.setHex(0x7c2d12);
        } else if (meta.regionId === 'knees' || meta.regionId === 'shoulders') {
          mat.color.setHex(0xeab308);
          mat.emissive.setHex(0x713f12);
        } else {
          mat.color.setHex(0x0284c7);
          mat.emissive.setHex(0x0c4a6e);
        }
      } else if (activeLayer === 'skeletal') {
        if (isSelected) {
          mat.color.setHex(0x38bdf8);
          mat.emissive.setHex(0x0284c7);
        } else {
          mat.color.setHex(meta.system === 'skeleton' ? 0xf8fafc : 0x475569);
          mat.emissive.setHex(0x0f172a);
        }
      } else if (activeLayer === 'muscular') {
        if (isSelected) {
          mat.color.setHex(0x14b8a6);
          mat.emissive.setHex(0x0f766e);
        } else {
          mat.color.setHex(meta.system === 'muscle' ? 0x991b1b : 0xe2e8f0);
          mat.emissive.setHex(0x000000);
        }
      } else if (activeLayer === 'nervous') {
        // Bio-electric nervous system
        if (isSelected) {
          mat.color.setHex(0xfacc15);
          mat.emissive.setHex(0xa16207);
        } else if (meta.system === 'nerve') {
          mat.color.setHex(0xeab308);
          mat.emissive.setHex(0x713f12);
        } else {
          mat.color.setHex(0x1e293b);
          mat.emissive.setHex(0x0f172a);
          mat.transparent = true;
          mat.opacity = 0.45;
        }
      } else if (activeLayer === 'organs') {
        if (isSelected) {
          mat.color.setHex(0x2dd4bf);
          mat.emissive.setHex(0x0d9488);
        } else if (meta.system === 'organ') {
          mat.color.setHex(meta.baseColor);
          mat.emissive.setHex(0x3b0764);
        } else {
          mat.color.setHex(0x334155);
          mat.emissive.setHex(0x000000);
        }
      } else {
        // Translucent cybernetic hologram
        mat.transparent = true;
        mat.opacity = isSelected ? 0.95 : 0.55;
        if (isSelected) {
          mat.color.setHex(0x2dd4bf);
          mat.emissive.setHex(0x14b8a6);
        } else {
          mat.color.setHex(0x0369a1);
          mat.emissive.setHex(0x082f49);
        }
      }
    });

    // Camera target alignment based on selected region
    if (regionCameraTargets[selectedRegionId]) {
      const tgt = regionCameraTargets[selectedRegionId];
      cameraTargetRef.current = {
        x: tgt.x,
        y: tgt.y,
        z: Math.max(2.6, Math.min(6.5, tgt.z)),
        targetY: tgt.targetY,
      };
      setCurrentZoom(tgt.z);
    }
  }, [selectedRegionId, activeLayer]);

  // Preset camera angle navigators
  const setPresetAngle = (azimuthY: number, elevationX = 0.05) => {
    targetRotationRef.current = { x: elevationX, y: azimuthY };
    setIsAutoRotating(false);
  };

  const handleResetCamera = () => {
    cameraTargetRef.current = { x: 0, y: 0.4, z: 5.2, targetY: 0.3 };
    targetRotationRef.current = { x: 0.05, y: 0 };
    setCurrentZoom(5.2);
    setIsAutoRotating(false);
  };

  const handleZoom = (deltaZ: number) => {
    cameraTargetRef.current.z = Math.max(2.2, Math.min(8.0, cameraTargetRef.current.z + deltaZ));
    setCurrentZoom(cameraTargetRef.current.z);
  };

  const selectedData = ANATOMY_CATALOG.find((c) => c.id === selectedRegionId);

  return (
    <div className="relative w-full h-[540px] sm:h-[620px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col">
      {/* 3D Viewport Header HUD */}
      <div className="absolute top-3.5 left-3.5 right-3.5 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left Status Readout */}
        <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-3 py-1.5 rounded-lg shadow-lg pointer-events-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
          <span className="text-xs font-mono text-teal-300 uppercase tracking-wider font-bold">
            360° HUMAN ANATOMY ATLAS
          </span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="text-xs text-white font-medium">
            {hoveredPartName || selectedData?.label}
          </span>
        </div>

        {/* Right Layer Mode Pills */}
        <div className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-1 rounded-lg shadow-lg pointer-events-auto">
          <button
            onClick={() => onLayerChange('muscular')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              activeLayer === 'muscular'
                ? 'bg-rose-600 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Complete Muscular System"
          >
            Muscles
          </button>
          <button
            onClick={() => onLayerChange('skeletal')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              activeLayer === 'skeletal'
                ? 'bg-slate-200 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Skeletal Bones & Joints"
          >
            Skeleton
          </button>
          <button
            onClick={() => onLayerChange('nervous')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors flex items-center gap-1 ${
              activeLayer === 'nervous'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Bio-Electric Nervous System & Plexus"
          >
            <Zap className="w-3 h-3 fill-current" />
            <span>Nerves</span>
          </button>
          <button
            onClick={() => onLayerChange('organs')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors flex items-center gap-1 ${
              activeLayer === 'organs'
                ? 'bg-purple-600 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Internal Cardiopulmonary & Visceral Organs"
          >
            <Heart className="w-3 h-3 fill-current" />
            <span>Organs</span>
          </button>
          <button
            onClick={() => onLayerChange('heatmap')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors flex items-center gap-1 ${
              activeLayer === 'heatmap'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Somatic Strain Thermography"
          >
            <Flame className="w-3 h-3 fill-current" />
            <span>Heatmap</span>
          </button>
          <button
            onClick={() => onLayerChange('translucent')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              activeLayer === 'translucent'
                ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Translucent X-Ray Bio-Hologram"
          >
            X-Ray
          </button>
        </div>
      </div>

      {/* Center 360 Drag Interaction Hint Overlay */}
      <div className="absolute top-14 left-4 z-10 pointer-events-none flex items-center gap-2 text-[11px] font-mono text-slate-400 bg-slate-950/70 backdrop-blur-sm px-2.5 py-1 rounded border border-slate-800">
        <Compass className="w-3.5 h-3.5 text-teal-400" />
        <span>DRAG ANYWHERE TO ROTATE 360° · SCROLL TO ZOOM · CLICK TO SELECT</span>
      </div>

      {/* Main Three.js WebGL Canvas Mount Container */}
      <div
        ref={mountRef}
        className="w-full h-full relative select-none cursor-grab active:cursor-grabbing"
      />

      {/* Floating 360 Angle Preset & Camera Controls (Bottom-Right) */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col items-end gap-2">
        {/* Exploded Dissection Slider Popup */}
        {showExplodeControl && (
          <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/80 p-3 rounded-xl shadow-xl flex flex-col gap-2 w-56 animate-fadeIn">
            <div className="flex items-center justify-between text-xs font-mono text-teal-300">
              <span className="flex items-center gap-1">
                <Sliders className="w-3 h-3" />
                <span>EXPLODED VIEW</span>
              </span>
              <span>{explodeRatio}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={explodeRatio}
              onChange={(e) => setExplodeRatio(Number(e.target.value))}
              className="w-full accent-teal-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>ASSEMBLED</span>
              <span>DISSECTED</span>
            </div>
          </div>
        )}

        {/* Action Button Strip */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-1.5 rounded-xl shadow-lg">
          {/* Explode slider toggle */}
          <button
            onClick={() => setShowExplodeControl(!showExplodeControl)}
            className={`px-2 py-1.5 rounded text-xs font-mono flex items-center gap-1 transition-colors ${
              showExplodeControl || explodeRatio > 0
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Toggle Anatomical Exploded Dissection View"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Dissect</span>
          </button>

          <span aria-hidden="true" className="w-px h-4 bg-slate-800" />

          {/* Quick 360 View Angle Presets */}
          <button
            onClick={() => setPresetAngle(0)}
            className="px-2 py-1 text-xs font-mono text-slate-300 hover:text-white hover:bg-slate-800 rounded"
            title="Front Anatomical View (0°)"
          >
            Front
          </button>
          <button
            onClick={() => setPresetAngle(Math.PI / 2)}
            className="px-2 py-1 text-xs font-mono text-slate-300 hover:text-white hover:bg-slate-800 rounded"
            title="Right Lateral View (90°)"
          >
            Side
          </button>
          <button
            onClick={() => setPresetAngle(Math.PI)}
            className="px-2 py-1 text-xs font-mono text-slate-300 hover:text-white hover:bg-slate-800 rounded"
            title="Posterior Back View (180°)"
          >
            Back
          </button>

          <span aria-hidden="true" className="w-px h-4 bg-slate-800" />

          {/* 360 Turntable Auto-Spin Toggle */}
          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`p-1.5 rounded transition-colors ${
              isAutoRotating ? 'text-teal-400 bg-teal-500/20' : 'text-slate-400 hover:text-white'
            }`}
            title={isAutoRotating ? 'Pause 360° Turntable' : 'Auto-Rotate 360°'}
          >
            <RotateCw className="w-4 h-4" />
          </button>

          {/* Zoom In / Out */}
          <button
            onClick={() => handleZoom(-0.6)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom(0.6)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          {/* Reset Camera */}
          <button
            onClick={handleResetCamera}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
            title="Reset Camera View to Full Body"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Region Selector Horizontal Chips at Bottom-Left */}
      <div className="absolute bottom-4 left-4 z-20 flex flex-wrap gap-1 max-w-sm sm:max-w-md">
        {ANATOMY_CATALOG.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectRegion(cat)}
            className={`text-[10px] font-mono px-2.5 py-1 rounded-md transition-all ${
              selectedRegionId === cat.id
                ? 'bg-teal-400 text-slate-950 font-bold shadow-md shadow-teal-500/30 scale-105'
                : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
            }`}
          >
            {cat.label.split(' ')[0]}
          </button>
        ))}
      </div>
    </div>
  );
};
