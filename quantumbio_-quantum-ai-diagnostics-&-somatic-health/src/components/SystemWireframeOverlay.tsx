import React from 'react';
import { BodyRegion } from '../types';

export type WireframeSystem = 'none' | 'skeletal' | 'muscular' | 'nervous';

interface SystemWireframeOverlayProps {
  regionId: BodyRegion;
  activeSystem: WireframeSystem;
  opacity?: number; // 0 to 1
  animatedPulse?: boolean;
}

export const SystemWireframeOverlay: React.FC<SystemWireframeOverlayProps> = ({
  regionId,
  activeSystem,
  opacity = 0.88,
  animatedPulse = true,
}) => {
  if (activeSystem === 'none') return null;

  // Render SVG vector wireframe based on regionId and activeSystem
  const renderWireframeContent = () => {
    switch (regionId) {
      // ==========================================
      // 1. HEAD (Cranial Vault & Cortex)
      // ==========================================
      case 'head':
        if (activeSystem === 'skeletal') {
          return (
            <g className="wireframe-skeletal text-cyan-300">
              {/* Cranial Vault Calvaria Dome Mesh */}
              <ellipse cx="50" cy="42" rx="36" ry="34" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 2" />
              <ellipse cx="50" cy="40" rx="30" ry="28" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
              
              {/* Coronal & Sagittal Sutures */}
              <path d="M50,8 L50,42 M20,38 Q50,44 80,38" fill="none" stroke="#38bdf8" strokeWidth="1.4" strokeDasharray="4 2" />
              
              {/* Frontal Bone & Supraorbital Ridges */}
              <path d="M28,48 Q38,44 48,48 M52,48 Q62,44 72,48" fill="none" stroke="#38bdf8" strokeWidth="1.6" />
              
              {/* Zygomatic Arches & Orbit Rims */}
              <ellipse cx="36" cy="54" rx="7" ry="6" fill="none" stroke="currentColor" strokeWidth="1.0" />
              <ellipse cx="64" cy="54" rx="7" ry="6" fill="none" stroke="currentColor" strokeWidth="1.0" />
              
              {/* Mandible Jaw & TMJ Condyle Pivots */}
              <path d="M22,54 L25,68 Q50,82 75,68 L78,54" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
              <circle cx="22" cy="54" r="2.5" fill="#38bdf8" />
              <circle cx="78" cy="54" r="2.5" fill="#38bdf8" />

              {/* Grid Latitudes & Longitudes */}
              <path d="M16,42 Q50,60 84,42 M18,30 Q50,18 82,30" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
            </g>
          );
        } else if (activeSystem === 'muscular') {
          return (
            <g className="wireframe-muscular text-rose-400">
              {/* Temporalis Muscle Radiating Fan Vectors */}
              <path d="M20,28 Q34,42 38,62 M24,20 Q36,38 38,62 M32,15 Q38,36 39,62 M42,12 Q40,36 40,62" fill="none" stroke="#f43f5e" strokeWidth="1.2" />
              <path d="M80,28 Q66,42 62,62 M76,20 Q64,38 62,62 M68,15 Q62,36 61,62 M58,12 Q60,36 60,62" fill="none" stroke="#f43f5e" strokeWidth="1.2" />
              
              {/* Frontalis Vertical Myofibrillar Lines */}
              <path d="M42,22 L42,42 M46,18 L46,44 M50,16 L50,44 M54,18 L54,44 M58,22 L58,42" fill="none" stroke="#fb7185" strokeWidth="1.0" strokeDasharray="3 1.5" />
              
              {/* Masseter Chevron Power Vectors */}
              <path d="M28,60 L28,76 M33,59 L33,78 M67,59 L67,78 M72,60 L72,76" fill="none" stroke="#f43f5e" strokeWidth="1.4" />
              
              {/* Orbicularis Oculi Circumferential Vectors */}
              <ellipse cx="36" cy="54" rx="9" ry="8" fill="none" stroke="#f59e0b" strokeWidth="0.9" strokeDasharray="2 2" />
              <ellipse cx="64" cy="54" rx="9" ry="8" fill="none" stroke="#f59e0b" strokeWidth="0.9" strokeDasharray="2 2" />
            </g>
          );
        } else {
          // Nervous system
          return (
            <g className="wireframe-nervous text-amber-300">
              {/* Trigeminal Nerve (CN V) Trunk & Trifurcation */}
              <circle cx="50" cy="52" r="3" fill="#eab308" className="animate-ping" opacity="0.8" />
              <circle cx="50" cy="52" r="2.5" fill="#fef08a" />
              {/* V1 Ophthalmic */}
              <path d="M50,52 Q42,46 32,38 M50,52 Q58,46 68,38" fill="none" stroke="#eab308" strokeWidth="1.4" />
              {/* V2 Maxillary */}
              <path d="M50,52 Q38,54 26,56 M50,52 Q62,54 74,56" fill="none" stroke="#eab308" strokeWidth="1.4" />
              {/* V3 Mandibular */}
              <path d="M50,52 Q44,64 34,74 M50,52 Q56,64 66,74" fill="none" stroke="#eab308" strokeWidth="1.4" />

              {/* Circle of Willis & Cortical Synaptic Nodes */}
              <ellipse cx="50" cy="38" rx="14" ry="10" fill="none" stroke="#06b6d4" strokeWidth="1.2" strokeDasharray="2 2" />
              <circle cx="38" cy="34" r="2" fill="#06b6d4" />
              <circle cx="62" cy="34" r="2" fill="#06b6d4" />
              <circle cx="50" cy="28" r="2" fill="#06b6d4" />

              {/* Neural Axonal Arborization Network */}
              <path d="M38,34 Q28,24 22,18 M62,34 Q72,24 78,18 M50,28 L50,14" fill="none" stroke="#eab308" strokeWidth="0.8" strokeDasharray="3 3" />
              <path d="M38,34 Q32,44 24,48 M62,34 Q68,44 76,48" fill="none" stroke="#eab308" strokeWidth="0.8" strokeDasharray="3 3" />
            </g>
          );
        }

      // ==========================================
      // 2. NECK (Cervical Spine C1-C7)
      // ==========================================
      case 'neck':
        if (activeSystem === 'skeletal') {
          return (
            <g className="wireframe-skeletal text-cyan-300">
              {/* C1 (Atlas) Ring & C2 (Axis) Odontoid Dens */}
              <ellipse cx="50" cy="18" rx="16" ry="6" fill="none" stroke="#38bdf8" strokeWidth="1.6" />
              <path d="M50,14 L50,24" fill="none" stroke="#38bdf8" strokeWidth="2.0" />
              
              {/* C3 to C7 Vertebral Stack with Intervertebral Disc Spacers */}
              {[28, 38, 48, 58, 68].map((y, idx) => (
                <g key={idx}>
                  {/* Vertebral Body Box */}
                  <rect x="36" y={y} width="28" height="7" rx="1.5" fill="none" stroke="#38bdf8" strokeWidth="1.2" />
                  {/* Disc Cushion Line */}
                  <line x1="38" y1={y + 7.5} x2="62" y2={y + 7.5} stroke="#06b6d4" strokeWidth="1.0" strokeDasharray="2 1" />
                  {/* Transverse Processes (L/R) */}
                  <line x1="36" y1={y + 3.5} x2="26" y2={y + 3.5} stroke="currentColor" strokeWidth="1.0" />
                  <circle cx="26" cy={y + 3.5} r="1.5" fill="currentColor" />
                  <line x1="64" y1={y + 3.5} x2="74" y2={y + 3.5} stroke="currentColor" strokeWidth="1.0" />
                  <circle cx="74" cy={y + 3.5} r="1.5" fill="currentColor" />
                </g>
              ))}

              {/* Cervical Lordosis Curve Axis */}
              <path d="M50,12 Q44,42 50,78" fill="none" stroke="#38bdf8" strokeWidth="1.4" strokeDasharray="4 2" />
            </g>
          );
        } else if (activeSystem === 'muscular') {
          return (
            <g className="wireframe-muscular text-rose-400">
              {/* Sternocleidomastoid (SCM) Diagonal Sheath Vectors */}
              <path d="M32,15 Q38,45 44,78 M36,15 Q42,45 47,78" fill="none" stroke="#f43f5e" strokeWidth="1.8" />
              <path d="M68,15 Q62,45 56,78 M64,15 Q58,45 53,78" fill="none" stroke="#f43f5e" strokeWidth="1.8" />
              
              {/* Scalene Muscle Triad (Anterior, Medius, Posterior) */}
              <path d="M40,28 L30,76 M40,32 L26,76 M40,36 L22,76" fill="none" stroke="#fb7185" strokeWidth="1.1" strokeDasharray="3 1.5" />
              <path d="M60,28 L70,76 M60,32 L74,76 M60,36 L78,76" fill="none" stroke="#fb7185" strokeWidth="1.1" strokeDasharray="3 1.5" />
              
              {/* Levator Scapulae & Trapezius Posterior Web */}
              <path d="M34,22 Q24,52 18,80 M66,22 Q76,52 82,80" fill="none" stroke="#f59e0b" strokeWidth="1.4" />
            </g>
          );
        } else {
          return (
            <g className="wireframe-nervous text-amber-300">
              {/* Spinal Cord Cervical Central Conduit */}
              <path d="M50,10 L50,82" fill="none" stroke="#eab308" strokeWidth="2.4" />
              
              {/* Cervical Spinal Nerves (C1-C8) Root Outlets */}
              {[18, 28, 38, 48, 58, 68].map((y, idx) => (
                <g key={idx}>
                  <circle cx="46" cy={y} r="2" fill="#fef08a" />
                  <circle cx="54" cy={y} r="2" fill="#fef08a" />
                  {/* Radicular Outlets into Brachial/Cervical Plexus */}
                  <path d={`M46,${y} Q32,${y + 4} 20,${y + 10}`} fill="none" stroke="#eab308" strokeWidth="1.3" />
                  <path d={`M54,${y} Q68,${y + 4} 80,${y + 10}`} fill="none" stroke="#eab308" strokeWidth="1.3" />
                </g>
              ))}

              {/* Vagus Nerve (CN X) Bilateral Descending Tracks */}
              <path d="M40,12 L38,82 M60,12 L62,82" fill="none" stroke="#06b6d4" strokeWidth="1.2" strokeDasharray="4 2" />
            </g>
          );
        }

      // ==========================================
      // 3. CHEST (Thoracic Cage & Cardiopulmonary)
      // ==========================================
      case 'chest':
        if (activeSystem === 'skeletal') {
          return (
            <g className="wireframe-skeletal text-cyan-300">
              {/* Sternum (Manubrium, Body, Xiphoid) */}
              <polygon points="46,14 54,14 53,24 47,24" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
              <rect x="47" y="25" width="6" height="34" rx="1" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
              <polygon points="48,60 52,60 50,68" fill="none" stroke="#38bdf8" strokeWidth="1.2" />

              {/* Ribs 1-8 Bucket-Handle Costal Arches */}
              {[18, 26, 34, 42, 50, 58, 66].map((y, idx) => (
                <g key={idx}>
                  <path d={`M47,${y} Q20,${y - 4} 12,${y + 12}`} fill="none" stroke="#38bdf8" strokeWidth="1.2" />
                  <path d={`M53,${y} Q80,${y - 4} 88,${y + 12}`} fill="none" stroke="#38bdf8" strokeWidth="1.2" />
                </g>
              ))}

              {/* Thoracic Spine Axis Behind */}
              <line x1="50" y1="12" x2="50" y2="78" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.5" />
            </g>
          );
        } else if (activeSystem === 'muscular') {
          return (
            <g className="wireframe-muscular text-rose-400">
              {/* Pectoralis Major Radiating Clavicular & Sternal Vectors */}
              <path d="M48,18 Q30,22 18,28 M48,26 Q30,28 18,28 M48,34 Q32,32 18,28 M48,42 Q34,36 18,28 M48,50 Q36,40 18,28" fill="none" stroke="#f43f5e" strokeWidth="1.3" />
              <path d="M52,18 Q70,22 82,28 M52,26 Q70,28 82,28 M52,34 Q68,32 82,28 M52,42 Q66,36 82,28 M52,50 Q64,40 82,28" fill="none" stroke="#f43f5e" strokeWidth="1.3" />
              
              {/* Intercostal Myofascial Cross-Hatch Grid */}
              <path d="M24,30 L32,46 M28,38 L36,54 M32,46 L40,62" fill="none" stroke="#fb7185" strokeWidth="0.8" opacity="0.6" />
              <path d="M76,30 L68,46 M72,38 L64,54 M68,46 L60,62" fill="none" stroke="#fb7185" strokeWidth="0.8" opacity="0.6" />
              
              {/* Diaphragmatic Dome Muscle Arch */}
              <path d="M16,68 Q50,48 84,68" fill="none" stroke="#f59e0b" strokeWidth="1.8" />
            </g>
          );
        } else {
          return (
            <g className="wireframe-nervous text-amber-300">
              {/* Sympathetic Paravertebral Ganglia Chain */}
              <line x1="44" y1="14" x2="44" y2="76" stroke="#eab308" strokeWidth="1.0" />
              <line x1="56" y1="14" x2="56" y2="76" stroke="#eab308" strokeWidth="1.0" />
              {[20, 30, 40, 50, 60, 70].map((y, idx) => (
                <g key={idx}>
                  <circle cx="44" cy={y} r="2" fill="#fef08a" />
                  <circle cx="56" cy={y} r="2" fill="#fef08a" />
                  {/* Intercostal Nerve Runs */}
                  <path d={`M44,${y} Q26,${y} 12,${y + 8}`} fill="none" stroke="#eab308" strokeWidth="1.1" />
                  <path d={`M56,${y} Q74,${y} 88,${y + 8}`} fill="none" stroke="#eab308" strokeWidth="1.1" />
                </g>
              ))}

              {/* Cardiac Autonomic Plexus Mesh (Center Left) */}
              <circle cx="42" cy="42" r="8" fill="none" stroke="#06b6d4" strokeWidth="1.2" strokeDasharray="2 2" />
              <circle cx="42" cy="42" r="3" fill="#06b6d4" className="animate-ping" opacity="0.7" />
            </g>
          );
        }

      // ==========================================
      // 4. SHOULDERS (Rotator Cuff & Labrum)
      // ==========================================
      case 'shoulders':
        if (activeSystem === 'skeletal') {
          return (
            <g className="wireframe-skeletal text-cyan-300">
              {/* Clavicle S-Strut */}
              <path d="M12,22 Q32,18 52,24" fill="none" stroke="#38bdf8" strokeWidth="1.8" />
              {/* Acromion Process Shelf */}
              <path d="M52,24 L62,26 L66,32" fill="none" stroke="#38bdf8" strokeWidth="1.6" />
              {/* Coracoid Process Hook */}
              <path d="M48,28 Q44,34 40,36" fill="none" stroke="#38bdf8" strokeWidth="1.4" />
              
              {/* Glenoid Cavity & Articular Labrum Ring */}
              <ellipse cx="48" cy="48" rx="6" ry="12" fill="none" stroke="#38bdf8" strokeWidth="1.6" />
              
              {/* Humeral Head Geodesic Sphere */}
              <ellipse cx="64" cy="50" rx="16" ry="16" fill="none" stroke="#38bdf8" strokeWidth="1.4" strokeDasharray="3 2" />
              <ellipse cx="64" cy="50" rx="10" ry="16" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
              <path d="M60,66 L64,88 M72,64 L76,88" fill="none" stroke="#38bdf8" strokeWidth="1.6" />
            </g>
          );
        } else if (activeSystem === 'muscular') {
          return (
            <g className="wireframe-muscular text-rose-400">
              {/* Supraspinatus Tendon Subacromial Tunnel Vector */}
              <path d="M22,26 Q42,28 62,38" fill="none" stroke="#f43f5e" strokeWidth="2.2" />
              <polygon points="62,38 56,36 58,42" fill="#f43f5e" />

              {/* Infraspinatus & Teres Minor Posterior Convergent Vectors */}
              <path d="M20,44 Q40,46 66,46" fill="none" stroke="#fb7185" strokeWidth="1.5" />
              <path d="M22,58 Q42,56 68,54" fill="none" stroke="#fb7185" strokeWidth="1.5" />

              {/* Deltoid Tri-Pennate Multipennate Shell */}
              <path d="M52,24 Q76,32 82,62" fill="none" stroke="#f59e0b" strokeWidth="1.4" strokeDasharray="3 2" />
              <path d="M62,26 Q82,42 78,74" fill="none" stroke="#f59e0b" strokeWidth="1.4" strokeDasharray="3 2" />
            </g>
          );
        } else {
          return (
            <g className="wireframe-nervous text-amber-300">
              {/* Brachial Plexus Cords (Lateral & Posterior) */}
              <path d="M18,16 Q36,28 46,38" fill="none" stroke="#eab308" strokeWidth="2.0" />
              
              {/* Axillary Nerve Circumflexing Humeral Neck */}
              <path d="M46,38 Q64,48 76,58" fill="none" stroke="#eab308" strokeWidth="1.8" />
              <ellipse cx="66" cy="58" rx="8" ry="4" fill="none" stroke="#06b6d4" strokeWidth="1.2" strokeDasharray="2 2" />

              {/* Suprascapular Nerve into Notch */}
              <path d="M38,24 L44,34 Q48,40 50,48" fill="none" stroke="#eab308" strokeWidth="1.2" />
              <circle cx="44" cy="34" r="2.5" fill="#fef08a" />
            </g>
          );
        }

      // ==========================================
      // 5. BACK (Lumbar Spine & Multifidus)
      // ==========================================
      case 'back':
        if (activeSystem === 'skeletal') {
          return (
            <g className="wireframe-skeletal text-cyan-300">
              {/* Lumbar Vertebrae L1 to L5 Blocks with Intervertebral Discs */}
              {[14, 28, 42, 56, 70].map((y, idx) => (
                <g key={idx}>
                  <rect x="34" y={y} width="32" height="9" rx="1.5" fill="none" stroke="#38bdf8" strokeWidth="1.4" />
                  {/* Facet Joints Interlocking Planes (L/R) */}
                  <polygon points={`28,${y + 1} 34,${y + 3} 34,${y + 7} 28,${y + 5}`} fill="none" stroke="#06b6d4" strokeWidth="1.0" />
                  <polygon points={`72,${y + 1} 66,${y + 3} 66,${y + 7} 72,${y + 5}`} fill="none" stroke="#06b6d4" strokeWidth="1.0" />
                  {/* Spinous Process Posterior Anchor */}
                  <rect x="47" y={y + 1} width="6" height="7" fill="none" stroke="currentColor" strokeWidth="0.8" />
                </g>
              ))}

              {/* Sacrum Triangular Base S1 */}
              <polygon points="32,80 68,80 50,94" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
            </g>
          );
        } else if (activeSystem === 'muscular') {
          return (
            <g className="wireframe-muscular text-rose-400">
              {/* Multifidus Deep Herringbone Chevron Stabilizers */}
              {[20, 34, 48, 62].map((y, idx) => (
                <g key={idx}>
                  <line x1="50" y1={y} x2="34" y2={y + 12} stroke="#f43f5e" strokeWidth="1.6" />
                  <line x1="50" y1={y} x2="66" y2={y + 12} stroke="#f43f5e" strokeWidth="1.6" />
                  <circle cx="50" cy={y} r="1.5" fill="#f43f5e" />
                </g>
              ))}

              {/* Erector Spinae Longitudinal Heavy Cables */}
              <path d="M26,12 L26,82 M30,12 L30,82 M70,12 L70,82 M74,12 L74,82" fill="none" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="4 2" />

              {/* Thoracolumbar Fascia Rhomboid Tension Matrix */}
              <polygon points="50,14 74,48 50,82 26,48" fill="none" stroke="#fb7185" strokeWidth="0.8" opacity="0.5" />
            </g>
          );
        } else {
          return (
            <g className="wireframe-nervous text-amber-300">
              {/* Conus Medullaris & Dural Sac Trunk */}
              <path d="M50,10 L50,42" fill="none" stroke="#eab308" strokeWidth="3.0" />
              <polygon points="46,42 54,42 50,48" fill="#eab308" />

              {/* Cauda Equina Descending Horse-Tail Filament Bundle */}
              <path d="M48,48 L44,82 M49,48 L48,82 M50,48 L50,82 M51,48 L52,82 M52,48 L56,82" fill="none" stroke="#fef08a" strokeWidth="1.0" strokeDasharray="3 2" />

              {/* L4, L5, S1 Dorsal Root Ganglia & Sciatic Convergence */}
              {[42, 56, 70].map((y, idx) => (
                <g key={idx}>
                  <circle cx="32" cy={y} r="2.5" fill="#eab308" />
                  <circle cx="68" cy={y} r="2.5" fill="#eab308" />
                  <path d={`M32,${y} Q22,${y + 8} 16,${y + 20}`} fill="none" stroke="#eab308" strokeWidth="1.5" />
                  <path d={`M68,${y} Q78,${y + 8} 84,${y + 20}`} fill="none" stroke="#eab308" strokeWidth="1.5" />
                </g>
              ))}
            </g>
          );
        }

      // ==========================================
      // 6. GUT (Enteric Plexus & Abdominal Core)
      // ==========================================
      case 'gut':
        if (activeSystem === 'skeletal') {
          return (
            <g className="wireframe-skeletal text-cyan-300">
              {/* Subcostal Rib Margin */}
              <path d="M14,18 Q50,30 86,18" fill="none" stroke="#38bdf8" strokeWidth="1.6" />
              {/* Lumbar Lordotic Spine Pillar Behind */}
              <rect x="44" y="24" width="12" height="54" rx="2" fill="none" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="3 2" />
              {/* Iliac Crest Upper Rim */}
              <path d="M12,74 Q32,68 50,78 Q68,68 88,74" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
            </g>
          );
        } else if (activeSystem === 'muscular') {
          return (
            <g className="wireframe-muscular text-rose-400">
              {/* Rectus Abdominis 6-Pack Compartments & Linea Alba */}
              <line x1="50" y1="18" x2="50" y2="82" stroke="#f43f5e" strokeWidth="2.0" />
              {[32, 48, 64].map((y, idx) => (
                <line key={idx} x1="32" y1={y} x2="68" y2={y} stroke="#f43f5e" strokeWidth="1.4" />
              ))}
              <rect x="32" y="18" width="16" height="64" rx="2" fill="none" stroke="#fb7185" strokeWidth="1.2" />
              <rect x="52" y="18" width="16" height="64" rx="2" fill="none" stroke="#fb7185" strokeWidth="1.2" />

              {/* Transversus Abdominis Horizontal Corset Bands */}
              <path d="M16,36 L32,36 M68,36 L84,36 M16,52 L32,52 M68,52 L84,52" fill="none" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="3 2" />
            </g>
          );
        } else {
          return (
            <g className="wireframe-nervous text-amber-300">
              {/* Enteric Nervous System (ENS) Dense Synaptic Web */}
              <circle cx="50" cy="38" r="4" fill="#eab308" />
              <text x="50" y="32" textAnchor="middle" fill="#fef08a" fontSize="5" fontFamily="monospace">CELIAC PLEXUS</text>
              
              {/* Radiating Splanchnic & Myenteric Neural Web */}
              <path d="M50,38 L32,48 L24,62 M50,38 L68,48 L76,62 M50,38 L42,68 M50,38 L58,68" fill="none" stroke="#eab308" strokeWidth="1.2" />
              <circle cx="32" cy="48" r="2" fill="#06b6d4" />
              <circle cx="68" cy="48" r="2" fill="#06b6d4" />
              <circle cx="42" cy="68" r="2" fill="#06b6d4" />
              <circle cx="58" cy="68" r="2" fill="#06b6d4" />

              {/* Auerbach & Meissner Mesh Over Gut Loops */}
              <ellipse cx="50" cy="56" rx="22" ry="16" fill="none" stroke="#06b6d4" strokeWidth="0.8" strokeDasharray="2 3" />
            </g>
          );
        }

      // ==========================================
      // 7. PELVIS (Pelvic Basin & Hip Joint)
      // ==========================================
      case 'pelvis':
        if (activeSystem === 'skeletal') {
          return (
            <g className="wireframe-skeletal text-cyan-300">
              {/* Iliac Wing Shell Curvatures (L/R) */}
              <path d="M22,22 Q12,42 24,64 L36,72" fill="none" stroke="#38bdf8" strokeWidth="1.6" />
              <path d="M78,22 Q88,42 76,64 L64,72" fill="none" stroke="#38bdf8" strokeWidth="1.6" />
              
              {/* Sacroiliac (SI) Joint Wedge & Sacrum */}
              <polygon points="38,20 62,20 50,46" fill="none" stroke="#38bdf8" strokeWidth="1.4" />
              <line x1="38" y1="20" x2="42" y2="38" stroke="#06b6d4" strokeWidth="1.8" />
              <line x1="62" y1="20" x2="58" y2="38" stroke="#06b6d4" strokeWidth="1.8" />

              {/* Acetabulum Hip Sockets & Femoral Heads */}
              <circle cx="26" cy="58" r="8" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
              <circle cx="74" cy="58" r="8" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
              <path d="M26,58 L18,84 M74,58 L82,84" fill="none" stroke="#38bdf8" strokeWidth="1.8" />

              {/* Pubic Symphysis Arch */}
              <path d="M42,66 Q50,72 58,66" fill="none" stroke="#38bdf8" strokeWidth="1.4" />
            </g>
          );
        } else if (activeSystem === 'muscular') {
          return (
            <g className="wireframe-muscular text-rose-400">
              {/* Iliopsoas Powerful Conical Descending Vector */}
              <path d="M40,24 Q32,44 26,62 M60,24 Q68,44 74,62" fill="none" stroke="#f43f5e" strokeWidth="2.2" />

              {/* Piriformis Horizontal Stabilizing Strap */}
              <path d="M46,38 L22,54 M54,38 L78,54" fill="none" stroke="#f59e0b" strokeWidth="2.0" />

              {/* Gluteus Medius Fan Radiations */}
              <path d="M22,24 Q18,40 22,52 M78,24 Q82,40 78,52" fill="none" stroke="#fb7185" strokeWidth="1.2" strokeDasharray="3 2" />

              {/* Pelvic Floor Levator Ani Hammock */}
              <path d="M34,68 Q50,82 66,68" fill="none" stroke="#f43f5e" strokeWidth="1.5" />
            </g>
          );
        } else {
          return (
            <g className="wireframe-nervous text-amber-300">
              {/* Lumbosacral Trunk & Sacral Plexus Hub */}
              <circle cx="50" cy="30" r="3" fill="#eab308" />
              
              {/* Sciatic Nerve Heavy Trunk Emerging Beneath Piriformis */}
              <path d="M46,34 Q34,44 28,66 L24,88" fill="none" stroke="#eab308" strokeWidth="2.6" />
              <path d="M54,34 Q66,44 72,66 L76,88" fill="none" stroke="#eab308" strokeWidth="2.6" />
              <circle cx="28" cy="66" r="2.5" fill="#fef08a" />
              <circle cx="72" cy="66" r="2.5" fill="#fef08a" />

              {/* Pudendal & Obturator Nerve Branches */}
              <path d="M48,36 Q42,56 46,72 M52,36 Q58,56 54,72" fill="none" stroke="#06b6d4" strokeWidth="1.2" strokeDasharray="3 2" />
            </g>
          );
        }

      // ==========================================
      // 8. KNEES (Meniscus & Patellofemoral)
      // ==========================================
      case 'knees':
        if (activeSystem === 'skeletal') {
          return (
            <g className="wireframe-skeletal text-cyan-300">
              {/* Femoral Condyles (Medial & Lateral) Dual Cylinders */}
              <ellipse cx="38" cy="32" rx="12" ry="16" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
              <ellipse cx="62" cy="32" rx="12" ry="16" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
              
              {/* Patella Teardrop Sesamoid Shield */}
              <polygon points="50,22 42,32 50,42 58,32" fill="none" stroke="#38bdf8" strokeWidth="1.6" />
              
              {/* Joint Space & Meniscus C-Ring Profiles */}
              <ellipse cx="38" cy="50" rx="11" ry="3.5" fill="none" stroke="#06b6d4" strokeWidth="1.8" />
              <ellipse cx="62" cy="50" rx="11" ry="3.5" fill="none" stroke="#06b6d4" strokeWidth="1.8" />

              {/* Tibial Plateau Flat Planar Shelf */}
              <path d="M24,54 L76,54 M30,54 L34,84 M70,54 L66,84" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
              {/* Fibular Head */}
              <circle cx="22" cy="62" r="4.5" fill="none" stroke="#38bdf8" strokeWidth="1.2" />
            </g>
          );
        } else if (activeSystem === 'muscular') {
          return (
            <g className="wireframe-muscular text-rose-400">
              {/* Quadriceps Central Tendon Vector */}
              <line x1="50" y1="12" x2="50" y2="24" stroke="#f43f5e" strokeWidth="2.4" />
              
              {/* Vastus Medialis Oblique (VMO) 55-Degree Medial Horizontal Vector */}
              <path d="M68,16 L54,30" stroke="#f43f5e" strokeWidth="2.2" />
              <polygon points="54,30 58,24 60,30" fill="#f43f5e" />

              {/* Vastus Lateralis Counter-Tension Vector */}
              <path d="M32,16 L46,30" stroke="#fb7185" strokeWidth="1.8" />

              {/* Patellar Ligament Extensor Fulcrum to Tibial Tuberosity */}
              <line x1="50" y1="42" x2="50" y2="68" stroke="#f43f5e" strokeWidth="2.2" />
              <circle cx="50" cy="68" r="2.5" fill="#f43f5e" />

              {/* Hamstring Tendons Crossing Lateral/Medial */}
              <path d="M26,30 L22,64 M74,30 L78,64" fill="none" stroke="#f59e0b" strokeWidth="1.4" />
            </g>
          );
        } else {
          return (
            <g className="wireframe-nervous text-amber-300">
              {/* Tibial Nerve Descending through Popliteal Fossa */}
              <path d="M50,12 L50,84" fill="none" stroke="#eab308" strokeWidth="2.2" />
              
              {/* Common Peroneal Nerve Wrap Around Fibular Neck (Compression Risk) */}
              <path d="M48,28 Q32,44 22,60 L20,78" fill="none" stroke="#eab308" strokeWidth="1.8" />
              <circle cx="22" cy="60" r="2.5" fill="#fef08a" />

              {/* Saphenous Infrapatellar Sensory Terminal Fibers */}
              <path d="M58,34 Q66,48 62,68 M62,52 L54,58" fill="none" stroke="#06b6d4" strokeWidth="1.0" strokeDasharray="3 2" />
            </g>
          );
        }

      // ==========================================
      // 9. FEET (Plantar Arch & Calcaneus)
      // ==========================================
      case 'feet':
        if (activeSystem === 'skeletal') {
          return (
            <g className="wireframe-skeletal text-cyan-300">
              {/* Talus Trochlea Dome Saddle */}
              <ellipse cx="44" cy="28" rx="10" ry="7" fill="none" stroke="#38bdf8" strokeWidth="1.6" />
              
              {/* Calcaneus Heel Cantilever Block */}
              <path d="M26,34 L40,34 L40,68 L24,64 Z" fill="none" stroke="#38bdf8" strokeWidth="1.6" />
              
              {/* Navicular & Cuneiform Midfoot Arch */}
              <path d="M46,36 L62,38 L60,54 L44,52 Z" fill="none" stroke="#38bdf8" strokeWidth="1.2" />
              
              {/* 5 Metatarsal Rays */}
              <path d="M60,42 L82,48 M60,46 L82,56 M60,50 L82,64" fill="none" stroke="#38bdf8" strokeWidth="1.4" />
              
              {/* Medial Longitudinal Arch Truss Line */}
              <path d="M28,64 Q46,46 76,64" fill="none" stroke="#06b6d4" strokeWidth="1.2" strokeDasharray="3 2" />
            </g>
          );
        } else if (activeSystem === 'muscular') {
          return (
            <g className="wireframe-muscular text-rose-400">
              {/* Achilles Tendon High-Tensile Ribbon */}
              <path d="M28,12 L28,42" fill="none" stroke="#f43f5e" strokeWidth="2.5" />
              <line x1="24" y1="26" x2="32" y2="26" stroke="#f43f5e" strokeWidth="1.5" />

              {/* Plantar Fascia Longitudinal Fan (Windlass Mechanism) */}
              <path d="M30,64 Q48,56 74,62 M30,64 Q50,60 76,68 M30,64 Q52,64 76,74" fill="none" stroke="#f43f5e" strokeWidth="1.8" />
              <polygon points="76,68 70,64 70,72" fill="#f43f5e" />

              {/* Abductor Hallucis & Arch Tensor Intrinsic Network */}
              <path d="M32,60 Q52,48 70,54" fill="none" stroke="#f59e0b" strokeWidth="1.3" strokeDasharray="3 2" />
            </g>
          );
        } else {
          return (
            <g className="wireframe-nervous text-amber-300">
              {/* Tibial Nerve behind Medial Malleolus (Tarsal Tunnel) */}
              <path d="M32,12 Q34,36 36,52" fill="none" stroke="#eab308" strokeWidth="2.2" />
              <circle cx="36" cy="52" r="2.5" fill="#fef08a" />

              {/* Medial & Lateral Plantar Nerve Division */}
              <path d="M36,52 Q52,50 74,54" fill="none" stroke="#eab308" strokeWidth="1.6" />
              <path d="M36,52 Q54,62 76,68" fill="none" stroke="#eab308" strokeWidth="1.6" />

              {/* Digital Sensory Branches */}
              <path d="M74,54 L86,52 M76,68 L86,72" fill="none" stroke="#06b6d4" strokeWidth="1.0" strokeDasharray="2 2" />
            </g>
          );
        }

      default:
        return null;
    }
  };

  return (
    <div
      className="absolute inset-0 pointer-events-none select-none z-10 transition-opacity duration-300"
      style={{ opacity }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-[0_0_8px_rgba(20,184,166,0.35)]"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Subtle phosphor glow filters */}
          <filter id="glow-skeletal" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {renderWireframeContent()}
      </svg>
    </div>
  );
};
