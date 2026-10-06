import { BodyPartData } from '../types';

export const ANATOMY_CATALOG: BodyPartData[] = [
  {
    id: 'head',
    label: 'Cranial & Neural Hub',
    anatomicalArea: 'Suboccipital, Frontal & Temporoparietal Cortex',
    commonIssues: [
      'Tension Cephalalgia & Screen Fatigue',
      'Cognitive Overload & Mental Exhaustion',
      'Cranial Dural Strain & Insomnia',
      'Suboccipital Muscle Hypertonicity'
    ],
    quantumTarget: 'Cortical GABA/Glutamate Quantum Spin Resonance & Vagal Baroreceptors',
    anteriorCoordinates: { x: 50, y: 10 },
    posteriorCoordinates: { x: 50, y: 10 },
    innerStructureImage: '/src/assets/images/inner_head_cortex_1791267501754.jpg',
    innerStructureKeyPoints: [
      { label: 'Cerebral Cortex Gyri', x: 42, y: 32, description: 'Prefrontal and temporal neural lobes governing cognitive executive focus and autonomic regulation' },
      { label: 'Cranial Vault Dura Mater', x: 54, y: 18, description: 'Tough fibrous envelope protecting cranial vasculature; tense during stress headaches' },
      { label: 'Circle of Willis Network', x: 62, y: 56, description: 'Anastomotic arterial ring ensuring steady perfusion to oxygen-hungry cortical tissue' },
      { label: 'Suboccipital Nerve Trunk', x: 38, y: 76, description: 'Myodural bridge fibers transmitting postural strain from tech-neck directly to the dural sac' }
    ],
    innerStructure: {
      muscles: [
        {
          name: 'Rectus Capitis Posterior Major & Minor',
          latinName: 'Musculi recti capitis posteriores',
          action: 'Extends head at atlanto-occipital joint; anchors suboccipital myodural bridge to the dura mater',
          triggerPoints: 'Radiates intense pain from base of skull behind eye orbit',
          fiberType: 'Dense Type-I slow oxidative spindles (highest density in human body)'
        },
        {
          name: 'Temporalis & Frontalis Complex',
          latinName: 'Musculus temporalis et frontalis',
          action: 'Elevates mandible; draws scalp forward; mediates facial grimacing during stress',
          triggerPoints: 'Bilateral temporal throbbing headache and dental sensitivity',
          fiberType: 'Mixed Type-I and Type-IIa fast-twitch fibers'
        }
      ],
      joints: [
        {
          name: 'Atlanto-Occipital Articulation (C0–C1)',
          jointType: 'Synovial condyloid joint',
          cartilageTissue: 'Thin hyaline cartilage vulnerable to compression shearing',
          mechanicalVulnerability: 'Susceptible to forward-head tilting torque, compressing occipital condyles'
        },
        {
          name: 'Temporomandibular Joint (TMJ)',
          jointType: 'Bicondylar ginglymoarthrodial joint',
          cartilageTissue: 'Fibrocartilaginous articular disc',
          mechanicalVulnerability: 'Nocturnal bruxism clenching causes disc anterior displacement'
        }
      ],
      nerves: [
        {
          name: 'Greater Occipital Nerve (C2 dorsal ramus)',
          roots: 'Spinal C2 posterior ramus',
          pathways: 'Pierces semispinalis capitis and trapezius aponeurosis',
          somaticSymptoms: 'Sharp shooting neuralgia up back of scalp into crown'
        },
        {
          name: 'Trigeminal Nerve (CN V - Ophthalmic & Maxillary)',
          roots: 'Pons brainstem nuclei',
          pathways: 'Trigeminal ganglion into supraorbital fissure',
          somaticSymptoms: 'Retro-orbital eye ache, photophobia, and forehead tightness'
        }
      ],
      quantumFascialTension: '84.2 N/m (Elevated Dural Shearing)',
      atpEfficiencyRate: '68% (Mitochondrial Oxidative Stress Coupling)'
    },
    healingFoods: [
      {
        name: 'Wild Blueberries & Dark Cacao Flavanols',
        category: 'Neuro-modulator',
        bioactiveCompounds: 'Anthocyanins (Cyanidin-3-glucoside) & (-)-Epicatechin',
        mechanism: 'Crosses blood-brain barrier to stimulate BDNF (Brain-Derived Neurotrophic Factor) and enhance cerebral nitric oxide vasodilation.',
        quantumNutrientResonance: 'Electron tunneling along mitochondrial respiratory complex I stabilizes microvascular endothelium.',
        prepAndTiming: 'Consume 1 cup fresh wild berries with 10g 85%+ raw dark cacao morning or mid-afternoon.',
        doshaEffect: 'Cools excess Pitta, nourishes Majja Dhatu (nervous tissue).'
      },
      {
        name: 'Ashwagandha (KSM-66) in Golden Almond Milk',
        category: 'Neuro-modulator',
        bioactiveCompounds: 'Withanolides (Withaferin A & Withanolide D)',
        mechanism: 'GABA-mimetic modulation that dampens HPA-axis hyperactivation and reduces serum cortisol by up to 27.9%.',
        quantumNutrientResonance: 'Spin state stabilization of hypothalamic glucocorticoid receptors.',
        prepAndTiming: '600mg extract steeped in warm almond milk with pinch of nutmeg 45 minutes before sleep.',
        doshaEffect: 'Deeply pacifies Vata restlessness and insomnia.'
      },
      {
        name: 'Magnesium L-Threonate & Pumpkin Seed Kernels',
        category: 'Antioxidant',
        bioactiveCompounds: 'Chelated Magnesium L-Threonate & Zinc Phytates',
        mechanism: 'Enhances synaptic density and blocks hyper-excitatory NMDA calcium influx channels.',
        quantumNutrientResonance: 'Dipole alignment accelerates cellular ATP phosphorylation.',
        prepAndTiming: '2 tablespoons raw sprouted seeds with evening meal.',
        doshaEffect: 'Stabilizes fluctuating mental Prana.'
      }
    ],
    quantumSynergy: {
      synergyScore: '96.4% Biological Synergy',
      combinedMechanism: 'Bhramari humming vibration opens cerebral microvasculature while Blueberry anthocyanins quench free radicals produced by mental strain.',
      cellularOutcome: '34% faster restoration of thalamocortical alpha brainwave coherence.'
    },
    primaryAsana: {
      sanskrit: 'Shashankasana & Bhramari Pranayama',
      english: 'Hare Pose with Humming Vagal Resonance',
      durationSeconds: 180,
      breathingRatio: '4s Inhale · 6s Humming Exhalation (1:1.5 parasympathetic pacing)',
      steps: [
        'Kneel in Vajrasana on a firm mat, maintaining erect axial spine and neutral pelvis.',
        'Inhale deeply through nostrils while raising both arms overhead, elongating thoracic vertebrae.',
        'Slowly exhale from the hips, folding forward until the crown of the head rests lightly on the ground.',
        'Reach backwards to cup your heels with palms, lifting hips gently to decompress suboccipital region.',
        'Inhale softly, and exhale with a sustained low-pitch Bhramari buzzing bee hum for 6–8 steady cycles.'
      ],
      biomechanicalAction: 'Induces gentle axial decompression of the atlanto-occipital joint, stimulates carotid baroreceptors for blood pressure homeostasis, and releases hyperactive suboccipital muscles.',
      contraindications: ['Acute cervical disc herniation', 'Severe untreated vertigo', 'Uncontrolled ocular hypertension'],
      clinicalRationale: 'Stimulates parasympathetic cholinergic pathways, downregulates sympathetic autonomic outflow, and synchronizes thalamocortical alpha rhythms.',
      intensity: 'Restorative',
      doshaAlignment: 'Pacifies aggravated Vata and Pitta'
    },
    secondaryAsanas: [
      { name: 'Balasana (Child Pose with Forehead Support)', target: 'Cranio-sacral fascial unwinding', duration: '3 mins' },
      { name: 'Nadi Shodhana Pranayama (Alternate Nostril)', target: 'Hemispheric autonomic synchronization', duration: '5 mins' },
      { name: 'Viparita Karani (Inverted Legs-Up-The-Wall)', target: 'Cerebral lymphatic glymphatic drainage', duration: '5 mins' }
    ]
  },
  {
    id: 'neck',
    label: 'Cervical Spine & Trapezius',
    anatomicalArea: 'C1–C7 Vertebrae, Levator Scapulae & Upper Trapezius',
    commonIssues: [
      'Tech-Neck & Forward Head Posture (+27kg gravitational torque)',
      'Cervical Spondylosis & Nerve Root Pinning',
      'Upper Crossed Syndrome & Trapezius Spasms',
      'Restricted Lateral Cervical Rotation'
    ],
    quantumTarget: 'Nuchal Ligament Collagen Piezoelectric Current & Substance-P Clearance',
    anteriorCoordinates: { x: 50, y: 17 },
    posteriorCoordinates: { x: 50, y: 17 },
    innerStructureImage: '/src/assets/images/inner_neck_cervical_1791267517154.jpg',
    innerStructureKeyPoints: [
      { label: 'Atlas (C1) & Axis (C2)', x: 50, y: 22, description: 'Atlantoaxial pivot joint enabling 50% of cervical rotational excursion' },
      { label: 'Cervical Facet Joints', x: 38, y: 48, description: 'Diarthrodial sliding joints susceptible to impingement in forward head posture' },
      { label: 'Deep Cervical Flexors', x: 64, y: 54, description: 'Longus colli and capitis; essential tonic stabilizers that inhibit trapezius spasm' },
      { label: 'Vertebral Artery Foramina', x: 50, y: 78, description: 'Bone conduit traversing cervical transverse foramina supplying the cerebellum' }
    ],
    innerStructure: {
      muscles: [
        {
          name: 'Levator Scapulae',
          latinName: 'Musculus levator scapulae',
          action: 'Elevates scapula; rotates glenoid cavity inferiorly; pulls neck laterally during unilateral spasm',
          triggerPoints: 'Pain angle between neck and upper scapula, preventing head turning over shoulder',
          fiberType: 'Tonic postural fibers prone to adaptive ischemic shortening'
        },
        {
          name: 'Sternocleidomastoid (SCM)',
          latinName: 'Musculus sternocleidomastoideus',
          action: 'Flexes cervical vertebral column; rotates head to opposite side; sternal & clavicular heads',
          triggerPoints: 'Refers autonomic symptoms: dizziness, tension headache behind ear, visual aura',
          fiberType: 'Biphasic fast/slow motor units'
        },
        {
          name: 'Upper Trapezius',
          latinName: 'Pars descendens musculi trapezii',
          action: 'Suspends shoulder girdle against gravity; extends and laterally bends cervical spine',
          triggerPoints: 'Burning pain along superior margin of shoulder into mastoid process',
          fiberType: 'High constant muscle tone under keyboard typing'
        }
      ],
      joints: [
        {
          name: 'C3–C7 Facet Zygapophysial Joints',
          jointType: 'Planar synovial articulation',
          cartilageTissue: 'Hyaline cartilage with richly innervated fibrous capsule',
          mechanicalVulnerability: 'Forward head carriage forces facet imbrication and capsule impingement'
        },
        {
          name: 'Uncovertebral Joints of Luschka',
          jointType: 'Symphysis/pseudo-arthrosis between uncinate processes',
          cartilageTissue: 'Fibrocartilaginous rim',
          mechanicalVulnerability: 'Hypertrophic osteophytes encroach on intervertebral foramina'
        }
      ],
      nerves: [
        {
          name: 'C5–C6 Cervical Spinal Nerve Roots',
          roots: 'Spinal cord segments C5–C6',
          pathways: 'Pass through intervertebral foramina into brachial plexus upper trunk',
          somaticSymptoms: 'Dull ache radiating into deltoid and lateral forearm with paraspinal stiffness'
        },
        {
          name: 'Spinal Accessory Nerve (CN XI)',
          roots: 'C1–C5 cranial/spinal roots',
          pathways: 'Traverses posterior cervical triangle into trapezius and SCM',
          somaticSymptoms: 'Neurogenic spasm and inability to shrug against resistance'
        }
      ],
      quantumFascialTension: '92.6 N/m (Extreme Nuchal Ligament Strain)',
      atpEfficiencyRate: '62% (Chronic Lactic Acidosis)'
    },
    healingFoods: [
      {
        name: 'Fresh Turmeric Root & Black Pepper (Curcumin + Piperine)',
        category: 'Anti-inflammatory',
        bioactiveCompounds: 'Curcuminoids (Curcumin, Demethoxycurcumin) & Piperine alkaloid',
        mechanism: 'Potent inhibition of NF-kB transcription and COX-2 pathway, accelerating clearance of substance-P in spastic muscles.',
        quantumNutrientResonance: 'Resonant pi-electron cloud neutralizes reactive oxygen species in ischemic myocytes.',
        prepAndTiming: 'Simmer 1 inch fresh crushed turmeric root in warm water with cracked black peppercorns and cold-pressed coconut oil.',
        doshaEffect: 'Pacifies Kapha congestion and dissolves Ama (metabolic toxins).'
      },
      {
        name: 'Hydrolyzed Type-I & Type-III Collagen Peptides',
        category: 'Tissue Repair',
        bioactiveCompounds: 'Proline-Hydroxyproline & Glycine Oligopeptides',
        mechanism: 'Stimulates tenocytes and fibroblasts to synthesize fresh cross-linked collagen in strained nuchal ligaments.',
        quantumNutrientResonance: 'Triple-helix hydrogen bond vibration enhances tensile elasticity.',
        prepAndTiming: '10g dissolved in bone broth or herbal infusion mid-morning.',
        doshaEffect: 'Deeply unctuous, grounding Vata joint dryness.'
      },
      {
        name: 'Wild-Caught Sockeye Salmon (Omega-3 EPA/DHA)',
        category: 'Tissue Repair',
        bioactiveCompounds: 'Resolvins (E1, D1) & Astaxanthin antioxidant',
        mechanism: 'Pro-resolving lipid mediators actively turn off chronic inflammatory signaling in cervical facet capsules.',
        quantumNutrientResonance: 'Polyunsaturated membrane fluidity restores nutrient perfusion.',
        prepAndTiming: '150g steamed or gently pan-seared with lemon and fresh dill 3x weekly.',
        doshaEffect: 'Strengthens Ojas and builds muscle tone.'
      }
    ],
    quantumSynergy: {
      synergyScore: '98.1% Biological Synergy',
      combinedMechanism: 'Griva Shakti Vikasaka restores synovial pumping while Curcumin + Resolvins eliminate inflammatory cytokines inside facet joint capsules.',
      cellularOutcome: '42% decrease in cervical paraspinal muscular stiffness within 14 days.'
    },
    primaryAsana: {
      sanskrit: 'Griva Shakti Vikasaka & Gomukhasana Arms',
      english: 'Cervical Micro-Articulation & Cow Face Shoulder Release',
      durationSeconds: 240,
      breathingRatio: '4s Inhale · 4s Hold · 4s Exhale (Samavritti Square Ratio)',
      steps: [
        'Sit tall in Sukhasana or on a chair with shoulders depressed away from the ears.',
        'Inhale, lengthening the back of the neck; exhale, gently dropping right ear toward right shoulder.',
        'Extend left fingertips toward the floor at a 45-degree angle to enhance myofascial release along the levator scapulae.',
        'Raise left arm overhead, bend elbow behind head, and reach right arm from below to interlace fingers or grasp a strap.',
        'Maintain open thoracic cage and draw front ribs inward for 6 deep diaphragmatic breaths; reverse symmetrically.'
      ],
      biomechanicalAction: 'Rebalances reciprocal inhibition between overactive pectoralis/upper trapezius and underactive deep cervical flexors (Longus Colli/Capitis).',
      contraindications: ['Acute cervical radicular shooting pain', 'Vertebrobasilar vascular insufficiency'],
      clinicalRationale: 'Restores the normal 35–45 degree cervical lordotic curve, preventing progressive disc degenerative compression and suboccipital neuralgia.',
      intensity: 'Moderate',
      doshaAlignment: 'Releases Vata stiffness in joints'
    },
    secondaryAsanas: [
      { name: 'Ardha Matsyendrasana (Gentle Cervical Twist)', target: 'Facet joint synovial lubrication', duration: '3 mins' },
      { name: 'Bhujangasana with Chin Retraction', target: 'Deep cervical flexor conditioning', duration: '2 mins' },
      { name: 'Garudasana Arms (Eagle Arm Wrap)', target: 'Rhomboid and posterior capsule decompression', duration: '3 mins' }
    ]
  },
  {
    id: 'shoulders',
    label: 'Scapulohumeral Complex',
    anatomicalArea: 'Rotator Cuff, Deltoids, Rhomboids & Acromioclavicular Joint',
    commonIssues: [
      'Protracted Shoulders & Rounded Desk Slouch',
      'Subacromial Impingement Syndrome',
      'Rotator Cuff Supraspinatus Tendinopathy',
      'Restricted Glenohumeral Glenoid Mobility'
    ],
    quantumTarget: 'Tendon Extracellular Matrix Glycosaminoglycan Hydration Field',
    anteriorCoordinates: { x: 34, y: 24 },
    posteriorCoordinates: { x: 34, y: 24 },
    innerStructureImage: '/src/assets/images/inner_shoulder_rotator_1791267552232.jpg',
    innerStructureKeyPoints: [
      { label: 'Glenohumeral Articular Labrum', x: 48, y: 46, description: 'Fibrocartilaginous ring deepening shallow glenoid socket for 360° arm mobility' },
      { label: 'Supraspinatus Tendon Insertion', x: 35, y: 30, description: 'Crucial rotator cuff tendon susceptible to ischemic compression beneath acromion' },
      { label: 'Subacromial Bursa', x: 62, y: 26, description: 'Friction-reducing synovial sac prone to impingement inflammatory bursitis' },
      { label: 'Deltoid & Rotator Cuff Myofascia', x: 74, y: 65, description: 'Dynamic force-couple balancing deltoid upward pull against rotator downward depression' }
    ],
    innerStructure: {
      muscles: [
        {
          name: 'Supraspinatus Tendon',
          latinName: 'Musculus supraspinatus',
          action: 'Initiates first 15° of glenohumeral arm abduction; depresses humeral head into glenoid fossa',
          triggerPoints: 'Deep ache over mid-deltoid, exacerbates when reaching overhead or sleeping on side',
          fiberType: 'Avascular critical zone at tendon insertion into greater tubercle'
        },
        {
          name: 'Pectoralis Minor',
          latinName: 'Musculus pectoralis minor',
          action: 'Draws scapula anteriorly and inferiorly; elevates ribs 3–5 during forced respiration',
          triggerPoints: 'Anterior chest pain mimicking cardiac angina; entraps axillary neurovascular bundle',
          fiberType: 'Short, dense tonic myofascial fibers chronically shortened in desk workers'
        },
        {
          name: 'Serratus Anterior',
          latinName: 'Musculus serratus anterior',
          action: 'Protracts and upwardly rotates scapula, pinning scapula firmly against thoracic wall',
          triggerPoints: 'Pain along mid-axillary line; causes scapular winging when inhibited',
          fiberType: 'High-endurance digitated muscle slips'
        }
      ],
      joints: [
        {
          name: 'Glenohumeral Joint',
          jointType: 'Multiaxial ball-and-socket synovial joint',
          cartilageTissue: 'Glenoid labrum fibrocartilage deepening shallow socket',
          mechanicalVulnerability: 'Unbalanced anterior translation grinds supraspinatus against acromion process'
        },
        {
          name: 'Acromioclavicular (AC) Joint',
          jointType: 'Planar synovial joint with fibrocartilaginous disc',
          cartilageTissue: 'Dense coracoclavicular ligamentous complex',
          mechanicalVulnerability: 'Degenerative subacromial spurring reduces subacromial space below 7mm'
        }
      ],
      nerves: [
        {
          name: 'Suprascapular Nerve (C5–C6)',
          roots: 'Upper trunk of brachial plexus',
          pathways: 'Traverses suprascapular notch beneath superior transverse scapular ligament',
          somaticSymptoms: 'Deep posterior shoulder weakness and infraspinatus muscle wasting'
        },
        {
          name: 'Axillary Nerve (C5–C6)',
          roots: 'Posterior cord of brachial plexus',
          pathways: 'Passes through quadrangular space around surgical neck of humerus',
          somaticSymptoms: 'Numbness over badge area of lateral deltoid'
        }
      ],
      quantumFascialTension: '88.1 N/m (Anterior Chest Fascial Adhesion)',
      atpEfficiencyRate: '65% (Hypoperfusion in Rotator Cuff)'
    },
    healingFoods: [
      {
        name: 'Tart Montmorency Cherries & Pomegranate Arils',
        category: 'Anti-inflammatory',
        bioactiveCompounds: 'Anthocyanins (Cyanidin-3-glucoside) & Punicalagins',
        mechanism: 'Reduces exercise-induced and postural oxidative tendon damage by up to 38%, lowering serum creatinine kinase.',
        quantumNutrientResonance: 'Scavenges free radicals in hypovascular tendinous insertions.',
        prepAndTiming: '30ml concentrated pure tart cherry juice mixed with water post-stretching session.',
        doshaEffect: 'Sweet, astringent; cools Pitta inflammation.'
      },
      {
        name: 'Bone Broth with Glucosamine & Chondroitin Sulfate',
        category: 'Tissue Repair',
        bioactiveCompounds: 'Sulfated Glycosaminoglycans (GAGs) & Hyaluronic Acid',
        mechanism: 'Replenishes synovial fluid viscosity and rebuilds micro-sheared glenoid labrum cartilage.',
        quantumNutrientResonance: 'Anionic charge of sulfate groups binds water molecules into resilient gel.',
        prepAndTiming: '1 mug warm simmering broth with sea salt and rosemary daily.',
        doshaEffect: 'Heals Vata cracking and popping in joints.'
      },
      {
        name: 'Cold-Pressed Extra Virgin Olive Oil (Oleocanthal)',
        category: 'Anti-inflammatory',
        bioactiveCompounds: 'Oleocanthal & Hydroxytyrosol Polyphenols',
        mechanism: 'Natural non-steroidal anti-inflammatory compound that mimics ibuprofen COX-1 and COX-2 inhibition without gastric erosion.',
        quantumNutrientResonance: 'Lipophilic polyphenol integrates into tendon sheath cellular membranes.',
        prepAndTiming: '2 tablespoons drizzled unheated over raw or steamed vegetables with meals.',
        doshaEffect: 'Balances all three doshas when consumed unheated.'
      }
    ],
    quantumSynergy: {
      synergyScore: '95.3% Biological Synergy',
      combinedMechanism: 'Garudasana arms expand subacromial space while Tart Cherry anthocyanins suppress localized tendon sheath inflammation.',
      cellularOutcome: '38% increase in pain-free overhead shoulder arc range of motion.'
    },
    primaryAsana: {
      sanskrit: 'Urdhva Hastasana to Garudasana Arms',
      english: 'Ascending Salutation into Eagle Arms Thoracic Expander',
      durationSeconds: 210,
      breathingRatio: '4s Inhale · 2s Retain · 4s Exhale',
      steps: [
        'Stand tall in Tadasana with even weight distribution across both soles.',
        'Inhale, sweeping arms laterally and upward into Urdhva Hastasana, rotating biceps inward.',
        'Exhale, crossing right elbow beneath left elbow at chest height, wrapping forearms until palms press.',
        'Lift elbows to eye level while simultaneously pressing forearms forward and away from the face.',
        'Feel the expansive stretch through the posterior interscapular region; hold for 6 full breaths; switch arms.'
      ],
      biomechanicalAction: 'Protraction and upward rotation of the scapula creates decompression within the subacromial arch and mobilizes tight posterior capsular fibers.',
      contraindications: ['Acute grade-3 rotator cuff tear', 'Anterior shoulder dislocation history'],
      clinicalRationale: 'Breaks the cycle of chronic internal rotation contracture common in keyboard users, restoring the natural scapulohumeral rhythm.',
      intensity: 'Moderate',
      doshaAlignment: 'Mobilizes stagnant Kapha in the chest'
    },
    secondaryAsanas: [
      { name: 'Prasarita Padottanasana C (Interlaced Hands)', target: 'Pectoralis minor myofascial opening', duration: '3 mins' },
      { name: 'Dolphin Pose (Ardha Pincha Mayurasana)', target: 'Serratus anterior activation', duration: '2 mins' },
      { name: 'Paschim Namaskarasana (Reverse Prayer)', target: 'Biceps tendon and anterior deltoid release', duration: '3 mins' }
    ]
  },
  {
    id: 'chest',
    label: 'Thorax & Cardiopulmonary Vault',
    anatomicalArea: 'Thoracic Spine (T1–T12), Costochondral Junctions & Lungs',
    commonIssues: [
      'Thoracic Kyphosis & Collapsed Breathing Capacity',
      'Apical Shallow Respiration & Hyperventilation',
      'Costochondritis & Sternal Tightness',
      'Reduced Heart Rate Variability (HRV) under Stress'
    ],
    quantumTarget: 'Alveolar Hemoglobin Spin Oxygen Affinity & Vagal Cardiorespiratory Synchronization',
    anteriorCoordinates: { x: 50, y: 28 },
    posteriorCoordinates: { x: 50, y: 28 },
    innerStructureImage: '/src/assets/images/inner_chest_thoracic_1791267531852.jpg',
    innerStructureKeyPoints: [
      { label: 'Costochondral Ribcage Joints', x: 50, y: 26, description: 'Flexible cartilaginous junctions enabling thoracic volume expansion during pranayama' },
      { label: 'Cardiopulmonary Myocardium', x: 42, y: 52, description: 'Heart chambers and coronary network synced to vagal parasympathetic rhythm' },
      { label: 'Intercostal Neurovascular Bundle', x: 68, y: 46, description: 'Intercostal nerve, artery, and vein running along costal groove beneath each rib' },
      { label: 'Diaphragmatic Central Tendon', x: 50, y: 82, description: 'Aponeurotic dome separating thoracic from abdominal pressure chambers' }
    ],
    innerStructure: {
      muscles: [
        {
          name: 'Diaphragm (Thoracic Diaphragm)',
          latinName: 'Diaphragma',
          action: 'Primary engine of respiration; flattens downward during inspiration, creating negative thoracic pressure',
          triggerPoints: 'Paradoxical chest breathing leaves diaphragm chronically elevated and atrophied',
          fiberType: 'Fatigue-resistant skeletal muscle with dual phrenic nerve pacemakers'
        },
        {
          name: 'Intercostales Interni & Externi',
          latinName: 'Musculi intercostales',
          action: 'Elevates and depresses ribs in bucket-handle and pump-handle kinetic excursion',
          triggerPoints: 'Sharp stabbing pain along costal margins mimicking pleurisy',
          fiberType: 'Rhythmic respiratory postural stabilizers'
        }
      ],
      joints: [
        {
          name: 'Costovertebral & Costotransverse Joints',
          jointType: 'Synovial planar joint anchoring ribs 1–12 to vertebral bodies and transverse processes',
          cartilageTissue: 'Radiate costovertebral ligaments and fibrous capsule',
          mechanicalVulnerability: 'Prolonged slumping causes rib head subluxation and restricted chest expansion'
        },
        {
          name: 'Sternocostal Synchondroses',
          jointType: 'Primary cartilaginous joint (rib 1) and synovial joints (ribs 2–7)',
          cartilageTissue: 'Costal hyaline cartilage bars',
          mechanicalVulnerability: 'Costochondral junction microtrauma produces anterior chest tenderness'
        }
      ],
      nerves: [
        {
          name: 'Phrenic Nerve (C3–C5 Keep the Diaphragm Alive)',
          roots: 'Cervical ventral rami C3, C4, C5',
          pathways: 'Descends through thorax between heart and lungs',
          somaticSymptoms: 'Referred shoulder tip pain and shallow paradoxical ventilation'
        },
        {
          name: 'Vagus Nerve (CN X - Cardiac & Pulmonary Plexuses)',
          roots: 'Medulla oblongata dorsal motor nucleus',
          pathways: 'Exits jugular foramen, courses along carotid sheath into thoracic viscera',
          somaticSymptoms: 'Low HRV, tachycardia, chest tightness, and hyper-sympathetic agitation'
        }
      ],
      quantumFascialTension: '81.4 N/m (Restricted Thoracic Cage Excursion)',
      atpEfficiencyRate: '71% (Alveolar Hypoventilation)'
    },
    healingFoods: [
      {
        name: 'Organic Green Tea (EGCG) & Cardamom Pods',
        category: 'Antioxidant',
        bioactiveCompounds: 'Epigallocatechin Gallate (EGCG) & L-Theanine',
        mechanism: 'Inhibits pulmonary endothelial inflammation, enhances parasympathetic heart rate variability, and dilates bronchial bronchioles.',
        quantumNutrientResonance: 'Polyphenol electron delocalization protects alveolar capillary membranes.',
        prepAndTiming: 'Brew loose-leaf green tea at 80°C with 2 crushed green cardamom pods at 10 AM.',
        doshaEffect: 'Clears chest phlegm (Kapha) and expands Prana Vayu.'
      },
      {
        name: 'Fermented Beetroot Kvass & Nitric Oxide Precursors',
        category: 'Tissue Repair',
        bioactiveCompounds: 'Inorganic Dietary Nitrates (NO3-) & Betalain Pigments',
        mechanism: 'Enzymatically converted into nitric oxide, lowering systemic vascular resistance and improving pulmonary V/Q ratio.',
        quantumNutrientResonance: 'Redox cycling improves oxygen transport kinetics of hemoglobin.',
        prepAndTiming: '60ml fresh cold-pressed fermented beet kvass before afternoon exercise or breathwork.',
        doshaEffect: 'Nourishes Rakta Dhatu (blood tissue).'
      },
      {
        name: 'Raw Unpasteurized Honey with Crushed Long Pepper (Pippali)',
        category: 'Digestive Agni',
        bioactiveCompounds: 'Piperine & Methylglyoxal',
        mechanism: 'Stimulates tracheobronchial ciliary clearance and expands pulmonary surfactant production.',
        quantumNutrientResonance: 'Aromatic resonance clears lymphatic stagnation in mediastinum.',
        prepAndTiming: '1 teaspoon raw honey with pinch of pippali taken slowly on an empty stomach.',
        doshaEffect: 'Potent Rasayana for lungs; destroys deep-seated Kapha.'
      }
    ],
    quantumSynergy: {
      synergyScore: '97.2% Biological Synergy',
      combinedMechanism: 'Ustrasana extends costochondral joints while Beetroot Nitric Oxide maximizes pulmonary alveolar oxygenation.',
      cellularOutcome: '29% increase in resting parasympathetic Heart Rate Variability (HRV).'
    },
    primaryAsana: {
      sanskrit: 'Ustrasana & Anahatasana',
      english: 'Camel Pose & Heart-Melting Thoracic Opener',
      durationSeconds: 240,
      breathingRatio: '4s Deep Inhale · 4s Controlled Exhale (Coherence Breathing)',
      steps: [
        'Kneel on mat with knees and shins hip-width apart, pressing tops of feet firmly downward.',
        'Place palms on sacrum with fingers pointing downward, drawing elbows toward each other behind back.',
        'Inhale, lifting sternum toward the ceiling while lengthening thoracic spine and engaging gluteals.',
        'Carefully reach back to clasp heels one at a time, keeping pelvis stacked vertically over knees.',
        'Maintain smooth, expansive diaphragmatic breathing across the collarbones for 5 cycles; return mindfully.'
      ],
      biomechanicalAction: 'Opens anterior intercostal spaces, activates erector spinae, and counteracts habitual hunched thoracic kyphosis.',
      contraindications: ['Severe lumbar spondylolisthesis', 'Uncontrolled arterial hypertension', 'Acute spinal stenosis'],
      clinicalRationale: 'Expands anatomical lung vital capacity, enhances oxygenation efficiency, and promotes baroreflex sensitivity.',
      intensity: 'Dynamic',
      doshaAlignment: 'Kindles Prana and balances Anahata chakra'
    },
    secondaryAsanas: [
      { name: 'Matsyasana (Fish Pose with Block Support)', target: 'Thyroid stimulation and apical lung ventilation', duration: '4 mins' },
      { name: 'Bhujangasana (Low Sphinx to Cobra)', target: 'Thoracic extension & diaphragm excursion', duration: '3 mins' },
      { name: 'Pranayama Anulom Vilom', target: 'Autonomic nervous system coherence', duration: '5 mins' }
    ]
  },
  {
    id: 'gut',
    label: 'Abdominal Viscera & Enteric Core',
    anatomicalArea: 'Peritoneal Cavity, Enteric Nervous System & Digestive Tract',
    commonIssues: [
      'Irritable Bowel & Stress-Induced Dysmotility',
      'Metabolic Sluggishness & Visceral Adiposity',
      'Sympathetic Vasoconstriction of Splanchnic Bed',
      'Diaphragmatic-Gut Pressure Disconnect'
    ],
    quantumTarget: 'Microbiome SCFA Metabolite Quantum Dynamics & Vagal Gut-Brain Axis Signaling',
    anteriorCoordinates: { x: 50, y: 40 },
    posteriorCoordinates: { x: 50, y: 40 },
    innerStructureImage: '/src/assets/images/inner_gut_enteric_1791267582854.jpg',
    innerStructureKeyPoints: [
      { label: 'Enteric Nervous Plexus', x: 50, y: 38, description: 'Second brain containing 500 million neurons producing 90% of bodily serotonin' },
      { label: 'Gastric Mucosal Microvasculature', x: 38, y: 56, description: 'Epithelial tight junctions defending systemic circulation from endotoxins' },
      { label: 'Mesenteric Lymphoid Nodes', x: 66, y: 52, description: 'Gut-associated lymphoid tissue (GALT) housing 70% of human immune defenses' },
      { label: 'Rectus Sheath & Linea Alba', x: 50, y: 84, description: 'Deep aponeurotic tendon band transferring abdominal kinetic pressure' }
    ],
    innerStructure: {
      muscles: [
        {
          name: 'Transversus Abdominis',
          latinName: 'Musculus transversus abdominis',
          action: 'Deepest abdominal corset muscle; compresses abdominal viscera, supports lumbar spine via thoracolumbar fascia',
          triggerPoints: 'Hypotonic in desk sitting; contributes to abdominal distension and lumbar shear',
          fiberType: 'Slow-twitch tonic stabilizing fibers'
        },
        {
          name: 'Rectus Abdominis & Obliques',
          latinName: 'Musculi obliqui externus et internus abdominis',
          action: 'Flexes and rotates trunk; facilitates diaphragmatic visceral massage during twisting',
          triggerPoints: 'Refer pain across epigastrium mimicking indigestion or renal colic',
          fiberType: 'Biphasic fast/slow motor units'
        }
      ],
      joints: [
        {
          name: 'Visceral Peritoneal Fascial Tethers',
          jointType: 'Visceral ligamentous attachments (Mesentery, Greater Omentum, Ligament of Treitz)',
          cartilageTissue: 'Serous mesothelial membranes with smooth muscle slips',
          mechanicalVulnerability: 'Chronic seated compression restricts motility and venous drainage of visceral organs'
        }
      ],
      nerves: [
        {
          name: 'Enteric Nervous System (Auerbach & Meissner Plexuses)',
          roots: '100+ million intrinsic gut neurons independent of spinal cord',
          pathways: 'Myenteric and submucosal gut wall layers',
          somaticSymptoms: 'Visceral hypersensitivity, bloating, cramping, and stress-triggered gut dysmotility'
        },
        {
          name: 'Celiac & Superior Mesenteric Plexus (Sympathetic)',
          roots: 'Splanchnic nerves T5–T12',
          pathways: 'Prevertebral ganglia along abdominal aorta',
          somaticSymptoms: 'Splanchnic vasoconstriction during chronic stress, suppressing digestive enzymes'
        }
      ],
      quantumFascialTension: '86.5 N/m (Peritoneal Fascial Clenching)',
      atpEfficiencyRate: '60% (Dysbiosis & Mitochondrial Decoupling)'
    },
    healingFoods: [
      {
        name: 'Fresh Ginger Root & Triphala Decoction',
        category: 'Digestive Agni',
        bioactiveCompounds: 'Gingerols, Shogaols & Tannins (Chebulic & Ellagic acid)',
        mechanism: 'Accelerates gastric emptying by 50%, enhances 5-HT4 receptor peristalsis, and tones intestinal mucosal tight junctions.',
        quantumNutrientResonance: 'Quantum tunneling of gingerol hydrogen atoms stimulates vagal sensory terminals in the stomach wall.',
        prepAndTiming: 'Simmer 1 teaspoon grated ginger and half teaspoon Triphala powder in 200ml water before dinner.',
        doshaEffect: 'Balances all three doshas; kindles Jatharagni without overheating.'
      },
      {
        name: 'Fermented Kimchi / Sauerkraut & Cultured Buttermilk',
        category: 'Tissue Repair',
        bioactiveCompounds: 'Lactobacillus plantarum, Short-Chain Fatty Acids (Butyrate, Acetate)',
        mechanism: 'Feeds colonocytes, restores mucosal barrier integrity, and synthesizes 90% of circulating peripheral serotonin.',
        quantumNutrientResonance: 'Probiotic bio-fermentation produces antioxidant redox enzymes.',
        prepAndTiming: '2 tablespoons unpasteurized fermented vegetables with lunch daily.',
        doshaEffect: 'Calms Vata gut dryness; nourishes enteric flora.'
      },
      {
        name: 'A2 Grass-Fed Ghee with Cumin & Fennel (Jeera-Saunf)',
        category: 'Anti-inflammatory',
        bioactiveCompounds: 'Conjugated Linoleic Acid (CLA) & Butyric Acid',
        mechanism: 'Soothes inflamed gastrointestinal lining, reduces intestinal permeability ("leaky gut"), and binds lipophilic vitamins A, D, E, K.',
        quantumNutrientResonance: 'Lipid transport field crosses cellular enterocyte walls effortlessly.',
        prepAndTiming: '1 teaspoon warm melted ghee over steamed rice or warm broth at start of meals.',
        doshaEffect: 'Supreme Rasayana for cooling Pitta and softening Vata.'
      }
    ],
    quantumSynergy: {
      synergyScore: '98.5% Biological Synergy',
      combinedMechanism: 'Pavanamuktasana physical peristaltic massage combined with Gingerol 5-HT4 activation clears visceral bloating within 20 minutes.',
      cellularOutcome: '45% acceleration of colonic transit time and gut-brain neurotransmitter balance.'
    },
    primaryAsana: {
      sanskrit: 'Pavanamuktasana & Ardha Matsyendrasana',
      english: 'Wind-Relieving Posture & Seated Visceral Peristaltic Twist',
      durationSeconds: 240,
      breathingRatio: '3s Inhale · 6s Slow Visceral Exhale (Vagal Downregulation)',
      steps: [
        'Lie supine on back, exhaling as right knee is hugged firmly against the right lower abdominal quadrant.',
        'Hold for 4 deep respiratory breaths, applying therapeutic pressure to the ascending colon.',
        'Release and repeat with the left leg to provide targeted pressure on the descending colon.',
        'Draw both knees firmly to the chest, rocking gently side to side to massage posterior abdominal organs.',
        'Transition to seated position and perform a gentle spinal twist, breathing deeply into the navel center.'
      ],
      biomechanicalAction: 'Applies cyclical compressive gradients to intra-abdominal viscera, promoting veno-lymphatic return and colon peristalsis.',
      contraindications: ['Abdominal hernia', 'Recent abdominal surgery (<10 weeks)', 'Active ulcerative colitis flare-up'],
      clinicalRationale: 'Directly stimulates the enteric nervous system via the vagus nerve, reducing visceral hypersensitivity and enhancing mucosal perfusion.',
      intensity: 'Gentle',
      doshaAlignment: 'Kindles Samana Vayu and digestive Agni'
    },
    secondaryAsanas: [
      { name: 'Vajrasana (Post-Meal Thunderbolt)', target: 'Directing splanchnic blood flow to gut', duration: '5 mins' },
      { name: 'Malasana (Garland Deep Squat)', target: 'Pelvic floor relaxation & anorectal angle alignment', duration: '3 mins' },
      { name: 'Dhanurasana (Bow Pose)', target: 'Abdominal wall toning & visceral massage', duration: '2 mins' }
    ]
  },
  {
    id: 'back',
    label: 'Lumbar Spine & Sacroiliac Axis',
    anatomicalArea: 'L1–L5 Vertebrae, Quadratus Lumborum & Multifidus Muscles',
    commonIssues: [
      'Chronic Lower Back Stiffness from Sedentary Chairs',
      'L4-L5 / L5-S1 Intervertebral Disc Compression',
      'Sacroiliac Joint Dysfunction & Pelvic Torsion',
      'Sciatic Nerve Piriformis Entrapment'
    ],
    quantumTarget: 'Nucleus Pulposus Proteoglycan Osmotic Turgor & Intervertebral Disc Imbibition',
    anteriorCoordinates: { x: 50, y: 50 },
    posteriorCoordinates: { x: 50, y: 50 },
    innerStructureImage: '/src/assets/images/inner_spine_lumbar_1791267568274.jpg',
    innerStructureKeyPoints: [
      { label: 'Lumbar Vertebra L4-L5 Body', x: 48, y: 34, description: 'Weight-bearing cancellous bone bearing up to 3x body mass during bending' },
      { label: 'Intervertebral Disc Annulus & Nucleus', x: 52, y: 52, description: 'Hydrated proteoglycan gel cushion absorbing axial shock and spinal load' },
      { label: 'Cauda Equina Nerve Roots', x: 36, y: 64, description: 'Lumbosacral spinal nerve root bundle traversing the thecal sac' },
      { label: 'Deep Multifidus Stabilizers', x: 72, y: 58, description: 'Essential micro-rotational stabilizer muscles guarding each vertebra' }
    ],
    innerStructure: {
      muscles: [
        {
          name: 'Lumbar Multifidus & Erector Spinae',
          latinName: 'Musculi multifidi lumborum',
          action: 'Segmental intervertebral stabilizers; controls micro-shear rotation between adjacent vertebrae',
          triggerPoints: 'Rapidly atrophies and undergoes fatty infiltration within 48 hours of low back injury',
          fiberType: 'Type-I postural muscle fibers rich in muscle spindles for proprioceptive feedback'
        },
        {
          name: 'Quadratus Lumborum (QL)',
          latinName: 'Musculus quadratus lumborum',
          action: 'Laterally flexes vertebral column; anchors 12th rib during respiration; elevates ilium',
          triggerPoints: 'Deep agonizing ache over sacroiliac joint and upper buttock, worse on sitting up',
          fiberType: 'Biphasic stabilizer that takes over when deep multifidus shuts down'
        },
        {
          name: 'Psoas Major',
          latinName: 'Musculus psoas major',
          action: 'Crosses lumbar spine and hip joint; flexes thigh; pulls lumbar spine into excessive lordosis when tight',
          triggerPoints: 'Pain along vertical paraspinal line radiating into anterior thigh',
          fiberType: 'Deep visceral-somatic emotional fight-or-flight muscle'
        }
      ],
      joints: [
        {
          name: 'L4–L5 and L5–S1 Intervertebral Discs',
          jointType: 'Secondary cartilaginous symphysis (Annulus Fibrosus + Nucleus Pulposus)',
          cartilageTissue: 'Type-II collagen and water-binding chondroitin sulfate proteoglycans',
          mechanicalVulnerability: 'Prolonged slumped sitting increases intradiscal pressure from 500N to over 1400N'
        },
        {
          name: 'Sacroiliac (SI) Joint',
          jointType: 'Part synovial, part syndesmosis joint transferring upper body load into pelvis',
          cartilageTissue: 'Dense auricular hyaline cartilage on sacrum, fibrocartilage on ilium',
          mechanicalVulnerability: 'Pelvic asymmetry and leg-length discrepancy cause asymmetric torque lock'
        }
      ],
      nerves: [
        {
          name: 'Sciatic Nerve (L4–S3 Spinal Roots)',
          roots: 'L4, L5, S1, S2, S3 ventral rami',
          pathways: 'Exits greater sciatic foramen beneath piriformis muscle down posterior thigh',
          somaticSymptoms: 'Sharp burning, tingling, or electric shooting pain from buttock into calf and foot'
        },
        {
          name: 'Sinuvertebral Nerve (Nerve of Luschka)',
          roots: 'Recurrent branch of spinal nerve entering intervertebral foramen',
          pathways: 'Innervates outer third of annulus fibrosus and posterior longitudinal ligament',
          somaticSymptoms: 'Deep, sickening non-radicular axial lower back pain'
        }
      ],
      quantumFascialTension: '95.8 N/m (Severe Thoracolumbar Shear)',
      atpEfficiencyRate: '58% (Ischemic Disc Cartilage Degeneration)'
    },
    healingFoods: [
      {
        name: 'Grass-Fed Bovine Colostrum & Type-II Collagen Hydrolysate',
        category: 'Tissue Repair',
        bioactiveCompounds: 'Transforming Growth Factor-Beta (TGF-beta), IGF-1, Undenatured Collagen',
        mechanism: 'Directly stimulates chondrocytes inside nucleus pulposus to rebuild proteoglycan aggrecan chains and rehydrate disc height.',
        quantumNutrientResonance: 'Peptide signaling promotes cellular stem-cell migration into avascular cartilage.',
        prepAndTiming: '5g colostrum powder stirred into room temperature water upon waking.',
        doshaEffect: 'Rebuilds Ojas and strengthens Asthi Dhatu (bone/cartilage).'
      },
      {
        name: 'Boswellia Serrata (Frankincense Resin - AKBA 65%)',
        category: 'Anti-inflammatory',
        bioactiveCompounds: 'Acetyl-11-keto-beta-boswellic acid (AKBA)',
        mechanism: 'Specific, non-redox inhibitor of 5-Lipoxygenase (5-LOX), stopping inflammatory leukotriene synthesis that degrades disc matrix.',
        quantumNutrientResonance: 'Inhibits inflammatory enzyme binding without disrupting protective prostaglandins.',
        prepAndTiming: '400mg standardized extract with healthy fats at breakfast.',
        doshaEffect: 'Grounds Vata pain and restores spinal mobility.'
      },
      {
        name: 'Golden Bone Broth with Celery Seed & Stinging Nettle',
        category: 'Tissue Repair',
        bioactiveCompounds: 'Silicon, Potassium, 3-n-butylphthalide (3nB)',
        mechanism: 'Flushes paraspinal lactic acid accumulations, alkalizes tissue fluid, and supplies trace minerals for vertebral trabecular density.',
        quantumNutrientResonance: 'Silica crystalline matrix reinforces collagen cross-linking.',
        prepAndTiming: 'Drink 250ml hot mineral-rich broth mid-afternoon.',
        doshaEffect: 'Pacifies Vata dry joint degeneration.'
      }
    ],
    quantumSynergy: {
      synergyScore: '99.2% Biological Synergy',
      combinedMechanism: 'Supta Matsyendrasana creates negative hydrodynamic pressure sucking fluid into L4-S1 discs, while Boswellia AKBA and Collagen supply raw matrix building blocks.',
      cellularOutcome: '52% reduction in morning paraspinal stiffness and improved disc turgor within 21 days.'
    },
    primaryAsana: {
      sanskrit: 'Supta Matsyendrasana & Marjaryasana-Bitilasana',
      english: 'Supine Spinal Decompression Twist & Segmental Cat-Cow',
      durationSeconds: 300,
      breathingRatio: '4s Inhale · 2s Hold · 6s Exhale (Parasympathetic bias)',
      steps: [
        'Lie supine with arms stretched out in a T-shape at shoulder level, palms down.',
        'Bend knees and plant feet flat; draw right knee toward chest and extend left leg straight.',
        'Gently guide right knee across the body toward the left floor while turning gaze toward the right hand.',
        'Anchor the right shoulder blade firmly to the ground; feel the deep spiral stretch along the thoracolumbar fascia.',
        'Stay for 8–10 slow, expansive breaths into the lower lumbar quadrant; repeat identically on opposite side.'
      ],
      biomechanicalAction: 'Rotational shearing decompresses lumbar facet capsules, unloads compressive axial disc pressure, and releases spastic quadratus lumborum.',
      contraindications: ['Acute lumbar disc herniation with sequestration', 'Severe spondylolisthesis grade 2+', 'Cauda equina signs'],
      clinicalRationale: 'Facilitates hydrodynamic fluid imbibition into avascular disc cartilage, restoring disc height lost during hours of sitting.',
      intensity: 'Gentle',
      doshaAlignment: 'Grounds Apana Vayu and alleviates lower body tension'
    },
    secondaryAsanas: [
      { name: 'Setu Bandhasana (Supported Bridge with Block)', target: 'Gluteal recruitment & lumbar decompression', duration: '4 mins' },
      { name: 'Apanasana (Knees to Chest)', target: 'Sacroiliac joint stabilization and paraspinal release', duration: '3 mins' },
      { name: 'Salabhasana (Locust Pose Variant)', target: 'Posterior chain & multifidus muscle strengthening', duration: '2 mins' }
    ]
  },
  {
    id: 'pelvis',
    label: 'Pelvis & Hip Girdle',
    anatomicalArea: 'Psoas Major, Iliacus, Piriformis, Gluteals & Labrum',
    commonIssues: [
      'Psoas Shortening & Adaptive Hip Flexor Contracture',
      'Anterior Pelvic Tilt & Gluteal Amnesia',
      'Deep Gluteal Syndrome & Piriformis Spasm',
      'Restricted Femoroacetabular Internal/External Rotation'
    ],
    quantumTarget: 'Somatic Emotional Fascial Tension Field & Acetabular Synovial Hydrodynamics',
    anteriorCoordinates: { x: 50, y: 56 },
    posteriorCoordinates: { x: 50, y: 56 },
    innerStructureImage: '/src/assets/images/inner_pelvis_hip_1791267596884.jpg',
    innerStructureKeyPoints: [
      { label: 'Sacroiliac Articular Joint', x: 42, y: 32, description: 'Keystone articular joint transferring kinetic load between spine and lower extremities' },
      { label: 'Acetabulofemoral Hip Socket', x: 28, y: 58, description: 'Deep ball-and-socket joint cushioned by fibrocartilaginous acetabular labrum' },
      { label: 'Iliopsoas Deep Tendon Insertion', x: 68, y: 54, description: 'Primary hip flexor anchor onto lesser trochanter, storing emotional fight-or-flight tension' },
      { label: 'Pelvic Floor Perineal Diaphragm', x: 50, y: 80, description: 'Muscular sling supporting pelvic viscera and regulating intra-abdominal pressure' }
    ],
    innerStructure: {
      muscles: [
        {
          name: 'Piriformis Muscle',
          latinName: 'Musculus piriformis',
          action: 'Laterally rotates extended thigh; abducts flexed thigh at hip; stabilizes femoral head in acetabulum',
          triggerPoints: 'Compresses underlying sciatic nerve; causes deep gluteal agony mimicking herniated disc',
          fiberType: 'High-density short external rotator muscle'
        },
        {
          name: 'Iliopsoas Complex (Psoas + Iliacus)',
          latinName: 'Musculus iliopsoas',
          action: 'Most powerful flexor of hip; anterior pelvic tilt driver; links emotional stress to hip tightness',
          triggerPoints: 'Severe groin pain and inability to stand completely upright after prolonged sitting',
          fiberType: 'Deep somatic core fascial network'
        },
        {
          name: 'Gluteus Medius & Minimus',
          latinName: 'Musculi glutei medius et minimus',
          action: 'Abducts thigh; prevents contralateral pelvic drop during single-leg stance (Trendelenburg gait)',
          triggerPoints: 'Lateral hip bursitis pain; causes knee valgus collapse when inhibited',
          fiberType: 'Key kinetic chain dynamic stabilizer'
        }
      ],
      joints: [
        {
          name: 'Femoroacetabular Hip Joint',
          jointType: 'Deep synovial ball-and-socket joint',
          cartilageTissue: 'Acetabular labrum fibrocartilaginous seal and thick hyaline cartilage',
          mechanicalVulnerability: 'Femoroacetabular impingement (FAI Cam/Pincer) pinches labrum during deep flexion'
        },
        {
          name: 'Pubic Symphysis',
          jointType: 'Secondary cartilaginous joint linking left and right pubic bones',
          cartilageTissue: 'Interpubic fibrocartilaginous disc with superior pubic ligament',
          mechanicalVulnerability: 'Adductor muscle imbalance creates osteitis pubis shearing strain'
        }
      ],
      nerves: [
        {
          name: 'Lateral Femoral Cutaneous Nerve (L2–L3)',
          roots: 'Lumbar plexus ventral branches',
          pathways: 'Passes beneath inguinal ligament medial to anterior superior iliac spine (ASIS)',
          somaticSymptoms: 'Meralgia Paresthetica: Burning pain and skin numbness along anterolateral thigh'
        },
        {
          name: 'Superior Gluteal Nerve (L4–S1)',
          roots: 'L4, L5, S1 ventral rami',
          pathways: 'Exits above piriformis through suprapiriform foramen into gluteus medius',
          somaticSymptoms: 'Gluteal weakness, pelvic instability, and lateral hip ache'
        }
      ],
      quantumFascialTension: '91.4 N/m (Somatic Pelvic Floor Hypertonicity)',
      atpEfficiencyRate: '63% (Gluteal Amnesia & Blood Pooling)'
    },
    healingFoods: [
      {
        name: 'Organic Walnuts & Flaxseed Lignans',
        category: 'Tissue Repair',
        bioactiveCompounds: 'Alpha-Linolenic Acid (ALA) & Secoisolariciresinol Diglucoside',
        mechanism: 'Reduces systemic osteoclast bone resorption, lubricates pelvic fascia, and balances sex hormone metabolite ratios.',
        quantumNutrientResonance: 'Membrane fluidity of phospholipid bilayers enhances hip joint flexibility.',
        prepAndTiming: 'Handful raw soaked walnuts with 1 tablespoon freshly ground golden flaxseeds in morning porridge.',
        doshaEffect: 'Grounds scattered Vata and nourishes Shukra/Artava Dhatu.'
      },
      {
        name: 'Guggulu Resin (Commiphora Mukul Extract)',
        category: 'Anti-inflammatory',
        bioactiveCompounds: 'Guggulsterones (E- and Z-Guggulsterone)',
        mechanism: 'Antagonizes farnesoid X receptor (FXR), clears deep chronic joint stagnation, and reduces synovial inflammatory fluid.',
        quantumNutrientResonance: 'Resinous terpenes clear lipid peroxidation in deep pelvic fascial pockets.',
        prepAndTiming: '500mg purified Guggulu tablet taken with warm water after lunch.',
        doshaEffect: 'Scrapes away toxic Ama; unsurpassed for deep hip stiffness.'
      },
      {
        name: 'Sesame Seed Tahini with Warm Date Paste',
        category: 'Tissue Repair',
        bioactiveCompounds: 'Sesamin Lignans, Calcium & Zinc',
        mechanism: 'High bioavailable organic calcium and copper nourish the femoral head trabecular bone and relax pelvic floor muscles.',
        quantumNutrientResonance: 'Piezoelectric bone mineral integration.',
        prepAndTiming: '2 tablespoons unhulled tahini blended with 2 Medjool dates and warm oat milk.',
        doshaEffect: 'Heavy, unctuous, warming; supreme pacifier of Apana Vayu.'
      }
    ],
    quantumSynergy: {
      synergyScore: '96.8% Biological Synergy',
      combinedMechanism: 'Pigeon Pose unlocks external rotator myofascial knots while Guggulsterones degrade chronic inflammatory cytokines inside the hip capsule.',
      cellularOutcome: '40% increase in pain-free internal and external hip rotation.'
    },
    primaryAsana: {
      sanskrit: 'Eka Pada Rajakapotasana (Pigeon) & Baddha Konasana',
      english: 'Sleeping Pigeon & Bound Angle Hip Capsule Opener',
      durationSeconds: 270,
      breathingRatio: '4s Inhale · 6s Relaxed Exhale',
      steps: [
        'From downward-facing dog, bring right knee forward behind right wrist, angling right foot toward left groin.',
        'Slide left leg straight back, un-tucking toes and squaring pelvis forward toward the front of the mat.',
        'Inhale, lifting tall through the crown to lengthen the psoas; exhale, walking hands forward into a fold.',
        'Rest forehead on stacked fists or block, releasing all clenching in the right gluteus and piriformis.',
        'Breathe into the hip joint for 8 slow breath cycles; press back and repeat on the left leg.'
      ],
      biomechanicalAction: 'Stretches the deep external rotators (piriformis, obturators) and lengthens the contralateral iliopsoas tendon.',
      contraindications: ['Acute meniscus tear', 'Hip labral tear with mechanical clicking', 'Sacroiliac joint inflammation'],
      clinicalRationale: 'Relieves chronic tension stored in the pelvic diaphragm and psoas major, releasing the fight-or-flight somatic stress loop.',
      intensity: 'Moderate',
      doshaAlignment: 'Releases suppressed Apana Vayu in pelvic basin'
    },
    secondaryAsanas: [
      { name: 'Anjaneyasana (Low Crescent Lunge)', target: 'Iliopsoas and rectus femoris elongation', duration: '3 mins' },
      { name: 'Gomukhasana Legs (Cow Face Hips)', target: 'Tensor fasciae latae and IT-band release', duration: '3 mins' },
      { name: 'Supta Baddha Konasana (Reclined Cobbler)', target: 'Adductor release & parasympathetic calming', duration: '5 mins' }
    ]
  },
  {
    id: 'knees',
    label: 'Stifle Joint & Kinetic Chains',
    anatomicalArea: 'Patellofemoral Joint, Menisci, Cruciate Ligaments & VMO',
    commonIssues: [
      'Patellofemoral Pain Syndrome (Runner / Desk Knee)',
      'Vastus Medialis Oblique (VMO) Weakness & Tracking Malalignment',
      'Hamstring Tendinopathy & Popliteal Tension',
      'Osteoarthritic Joint Space Narrowing'
    ],
    quantumTarget: 'Cartilage Extracellular Proteoglycan Viscoelastic Load Matrix',
    anteriorCoordinates: { x: 42, y: 73 },
    posteriorCoordinates: { x: 42, y: 73 },
    innerStructureImage: '/src/assets/images/inner_knee_meniscus_1791267610058.jpg',
    innerStructureKeyPoints: [
      { label: 'Femoral Condyle Hyaline Cartilage', x: 50, y: 28, description: 'Glassy articular cartilage layer providing ultra-low friction articulation' },
      { label: 'Medial & Lateral Meniscus', x: 38, y: 54, description: 'C-shaped fibrocartilaginous shock absorbers distributing compressive weight load' },
      { label: 'Anterior Cruciate Ligament (ACL)', x: 58, y: 50, description: 'Primary restraint against anterior tibial translation and knee hyperextension' },
      { label: 'Patellar Tendon & VMO Insertion', x: 50, y: 76, description: 'Extensor kinetic fulcrum transmitting quadriceps force onto tibial tuberosity' }
    ],
    innerStructure: {
      muscles: [
        {
          name: 'Vastus Medialis Oblique (VMO)',
          latinName: 'Musculus vastus medialis, pars obliqua',
          action: 'Distal horizontal fibers of vastus medialis; actively counteracts lateral pull of vastus lateralis on patella',
          triggerPoints: 'Rapidly atrophies with knee swelling, leading to patellofemoral cartilage grinding',
          fiberType: 'Dynamic kinetic stabilizer requiring strict end-range recruitment'
        },
        {
          name: 'Popliteus Muscle',
          latinName: 'Musculus popliteus',
          action: '"Key to the knee" - laterally rotates femur on tibia to unlock knee from full extension into flexion',
          triggerPoints: 'Deep agonizing ache behind the knee capsule, especially when descending stairs',
          fiberType: 'Deep intrinsic capsular stabilizer'
        },
        {
          name: 'Hamstrings (Biceps Femoris & Semimembranosus)',
          latinName: 'Musculi ischiocrurales',
          action: 'Flexes knee; extends hip; provides dynamic restraint against anterior tibial translation',
          triggerPoints: 'Taut bands restrict straight leg raise and increase patellar compressive forces',
          fiberType: 'Fast-twitch postural muscles prone to chronic contracture'
        }
      ],
      joints: [
        {
          name: 'Patellofemoral Joint',
          jointType: 'Sellar synovial articulation with thickest hyaline cartilage in human body (up to 7mm)',
          cartilageTissue: 'Thick retropatellar hyaline cartilage',
          mechanicalVulnerability: 'Abnormal Q-angle causes uneven lateral facet loading and chondromalacia patellae'
        },
        {
          name: 'Tibiofemoral Joint & Menisci',
          jointType: 'Modified hinge (bicondylar) joint with medial & lateral fibrocartilaginous menisci',
          cartilageTissue: 'C-shaped medial meniscus anchored to MCL; O-shaped lateral meniscus',
          mechanicalVulnerability: 'Rotational torque with knee flexed tears avascular inner two-thirds of meniscus'
        }
      ],
      nerves: [
        {
          name: 'Saphenous Nerve (Infrapatellar Branch)',
          roots: 'Femoral nerve L2–L4 terminal sensory branch',
          pathways: 'Pierces roof of adductor canal, travels down medial knee',
          somaticSymptoms: 'Hypersensitive burning skin ache over anteromedial knee joint line'
        },
        {
          name: 'Common Peroneal (Fibular) Nerve',
          roots: 'Sciatic nerve L4–S2 division',
          pathways: 'Winds superficially around fibular head',
          somaticSymptoms: 'Foot drop and numbness on dorsum of foot if compressed by tight cross-legged sitting'
        }
      ],
      quantumFascialTension: '89.2 N/m (Patellar Retinacular Imbalance)',
      atpEfficiencyRate: '67% (Cartilage Chondrocyte Avascular Stress)'
    },
    healingFoods: [
      {
        name: 'Cold-Water Mackerel & Green-Lipped Mussel Extract',
        category: 'Tissue Repair',
        bioactiveCompounds: 'Eicosapentaenoic Acid (EPA), Furan Fatty Acids & Glycosaminoglycans',
        mechanism: 'Reduces cartilage-degrading matrix metalloproteinase enzymes (MMP-13 and ADAMTS-5) by up to 44%.',
        quantumNutrientResonance: 'Lipid bilayer protection preserves articular chondrocyte viability.',
        prepAndTiming: '120g grilled mackerel with lemon twice weekly or 1000mg green-lipped mussel oil daily.',
        doshaEffect: 'Restores Snigdha (unctuousness) to dry cracking joints.'
      },
      {
        name: 'Rosehip Powder & Bioactive Galactolipids (GOPO)',
        category: 'Anti-inflammatory',
        bioactiveCompounds: 'Galactolipid GOPO & Vitamin C Ester',
        mechanism: 'Inhibits inflammatory chemotaxis of peripheral neutrophils into the synovial joint space.',
        quantumNutrientResonance: 'Protects extracellular matrix from free radical degradation.',
        prepAndTiming: '5g pure wild organic rosehip powder blended into morning smoothie or yogurt.',
        doshaEffect: 'Cools localized Pitta swelling without aggravating Vata.'
      },
      {
        name: 'Avocado Unsaponifiables (ASU) with Raw Walnuts',
        category: 'Tissue Repair',
        bioactiveCompounds: 'Phytosterols (Beta-Sitosterol, Campesterol, Stigmasterol)',
        mechanism: 'Stimulates aggrecan synthesis in articular cartilage and prevents subchondral bone remodeling.',
        quantumNutrientResonance: 'Sterol alignment reinforces lipid microdomains of cartilage cells.',
        prepAndTiming: 'Half fresh Haas avocado with raw walnuts daily.',
        doshaEffect: 'Balances Vata dryness and maintains joint lubrication.'
      }
    ],
    quantumSynergy: {
      synergyScore: '97.6% Biological Synergy',
      combinedMechanism: 'Warrior II isometric alignment tracks VMO properly while Green-Lipped Mussel GAGs inhibit MMP-13 cartilage breakdown enzymes.',
      cellularOutcome: '36% reduction in stair-climbing knee pain and improved patellar tracking.'
    },
    primaryAsana: {
      sanskrit: 'Virabhadrasana II (Warrior II) & Utkatasana Isometric',
      english: 'Warrior II Functional Alignment & Chair Pose Quad Stabilizer',
      durationSeconds: 240,
      breathingRatio: '4s Inhale · 4s Exhale (Sthiram Sukham Steadiness)',
      steps: [
        'Step feet 3.5 to 4 feet apart; turn right foot out 90 degrees and pivot left foot slightly inward (15 degrees).',
        'Bend right knee to stack directly over right ankle, tracking strictly in line with the second toe (prevent medial collapse).',
        'Actively engage the inner quad (VMO) while pressing firmly through the outer blade of the back left foot.',
        'Extend arms parallel to the floor, gazing calmly over right middle finger; maintain level pelvis.',
        'Hold for 6–8 steady breaths; straighten leg, pivot feet, and repeat symmetrically on left leg.'
      ],
      biomechanicalAction: 'Selectively recruits the vastus medialis oblique and gluteus medius to normalize patellar tracking vectors and improve synovial circulation.',
      contraindications: ['Acute ACL / PCL instability', 'Unhealed meniscus bucket-handle tears'],
      clinicalRationale: 'Strengthens eccentric quadriceps control, aligns the physiological Q-angle, and preserves articular cartilage from uneven shear wear.',
      intensity: 'Dynamic',
      doshaAlignment: 'Builds physical stamina and stability'
    },
    secondaryAsanas: [
      { name: 'Setu Bandha with Block Between Knees', target: 'Adductor and VMO co-contraction', duration: '3 mins' },
      { name: 'Janu Sirsasana (Head to Knee Pose)', target: 'Hamstring release without knee torsion', duration: '3 mins' },
      { name: 'Tadasana (Tripod Foot Grounding)', target: 'Proprioceptive kinetic chain realignment', duration: '3 mins' }
    ]
  },
  {
    id: 'feet',
    label: 'Plantar Foundation & Ankles',
    anatomicalArea: 'Plantar Fascia, Calcaneus, Talus & Gastrocnemius-Soleus',
    commonIssues: [
      'Plantar Fasciitis & Heel Spur Micro-Tears',
      'Collapsed Medial Longitudinal Arch (Flatfoot)',
      'Achilles Tendinopathy & Ankle Impingement',
      'Peripheral Microvascular Pooling in Lower Extremities'
    ],
    quantumTarget: 'Piezoelectric Bone Remodeling Vectors & Plantar Lymphatic Pump',
    anteriorCoordinates: { x: 42, y: 92 },
    posteriorCoordinates: { x: 42, y: 92 },
    innerStructureImage: '/src/assets/images/inner_foot_plantar_1791267623608.jpg',
    innerStructureKeyPoints: [
      { label: 'Talocrural Ankle Mortise', x: 45, y: 28, description: 'Hinge joint transferring full body mass from tibia onto the talus dome' },
      { label: 'Calcaneus Heel Tuberosity', x: 30, y: 58, description: 'Largest tarsal bone serving as primary heel impact strike pad and lever arm' },
      { label: 'Plantar Fascia Aponeurosis', x: 62, y: 72, description: 'Thick connective tissue band maintaining medial arch and Windlass kinetic recoil' },
      { label: 'Intrinsic Metatarsal Arch', x: 78, y: 60, description: 'Transverse and longitudinal arches acting as dynamic spring during locomotion' }
    ],
    innerStructure: {
      muscles: [
        {
          name: 'Plantar Aponeurosis & Intrinsic Foot Flexors',
          latinName: 'Aponeurosis plantaris & Musculus flexor digitorum brevis',
          action: 'Windlass mechanism; tensions during toe extension to raise medial longitudinal arch for shock absorption',
          triggerPoints: 'Stabbing morning heel pain upon taking first steps out of bed',
          fiberType: 'Extremely dense fibrous connective tissue with high collagen tensile modulus'
        },
        {
          name: 'Tibialis Posterior',
          latinName: 'Musculus tibialis posterior',
          action: 'Dynamic primary stabilizer of medial longitudinal arch; inverts foot and plantarflexes ankle',
          triggerPoints: 'Insufficiency causes progressive flatfoot and medial ankle tendon collapse',
          fiberType: 'High-endurance kinetic chain postural stabilizer'
        },
        {
          name: 'Soleus & Gastrocnemius (Triceps Surae)',
          latinName: 'Musculus triceps surae',
          action: 'Primary plantarflexor; acts as peripheral skeletal muscle venous pump returned blood to heart',
          triggerPoints: 'Nocturnal calf cramps and Achilles insertion tightness',
          fiberType: 'Soleus is 80%+ slow-twitch postural; gastrocnemius is fast explosive power'
        }
      ],
      joints: [
        {
          name: 'Subtalar (Talocalcaneal) Joint',
          jointType: 'Synovial joint allowing foot inversion and eversion on uneven terrain',
          cartilageTissue: 'Interosseous talocalcaneal ligament and hyaline facets',
          mechanicalVulnerability: 'Excessive pronation unlocks foot midtarsal joints, transferring torsion up to knee'
        },
        {
          name: 'Talocrural (Ankle Mortise) Joint',
          jointType: 'Uniaxial hinge synovial joint formed by tibia, fibula, and trochlea of talus',
          cartilageTissue: 'Dense articular cartilage with medial deltoid and lateral collateral ligaments',
          mechanicalVulnerability: 'Anterior capsular impingement reduces dorsiflexion below normal 20 degrees'
        }
      ],
      nerves: [
        {
          name: 'Tibial Nerve & Plantar Branches',
          roots: 'L4–S3 spinal roots',
          pathways: 'Passes beneath flexor retinaculum through tarsal tunnel behind medial malleolus',
          somaticSymptoms: 'Tarsal Tunnel Syndrome: Burning pins-and-needles across sole and ball of foot'
        },
        {
          name: 'Deep Peroneal (Fibular) Nerve',
          roots: 'L4–S1 roots',
          pathways: 'Runs under extensor retinaculum on anterior ankle into first web space',
          somaticSymptoms: 'Tight shoes cause tingling between big toe and second toe'
        }
      ],
      quantumFascialTension: '94.1 N/m (Extreme Plantar Fascial Tension)',
      atpEfficiencyRate: '61% (Peripheral Venous Stagnation)'
    },
    healingFoods: [
      {
        name: 'Grass-Fed Bone Gelatin & Vitamin C Citrus Zest',
        category: 'Tissue Repair',
        bioactiveCompounds: 'Glycine, Hydroxyproline & Bioflavonoid Rutin',
        mechanism: 'Stimulates rapid cross-linking in micro-torn plantar fascia collagen fibers and strengthens Achilles tenocytes.',
        quantumNutrientResonance: 'Piezoelectric alignment triggers calcium deposition at calcaneal bone spurs.',
        prepAndTiming: '15g pure gelatin dissolved in warm water with lemon juice 45 minutes prior to foot stretching.',
        doshaEffect: 'Builds Asthi and Majja Dhatus; roots Vata energy.'
      },
      {
        name: 'Ginger-Infused Warm Castor Oil & Epsom Salt Foot Soaks',
        category: 'Anti-inflammatory',
        bioactiveCompounds: 'Ricinoleic Acid & Magnesium Sulfate Transdermal Ions',
        mechanism: 'Transdermally penetrates thickened plantar aponeurosis, downregulates substance-P, and relaxes contracted intrinsic foot muscles.',
        quantumNutrientResonance: 'Ionic magnesium unlocks actin-myosin contraction loops.',
        prepAndTiming: 'Soak feet for 15 minutes in warm water with 1 cup Epsom salt followed by castor oil massage.',
        doshaEffect: 'Pacifies Vata dry cracking soles and heel spurs.'
      },
      {
        name: 'Sprouted Black Sesame Seeds (Kala Til) with Warm Jaggery',
        category: 'Tissue Repair',
        bioactiveCompounds: 'Sesamolin, Organic Calcium, Iron & Zinc',
        mechanism: 'Highest natural source of bio-chelated bone and ligament minerals, strengthening calcaneal trabeculae.',
        quantumNutrientResonance: 'Mineral crystalline matrix reinforces ligamentous insertion points.',
        prepAndTiming: '1 tablespoon toasted black sesame seeds with small piece of unrefined jaggery in morning.',
        doshaEffect: 'Ancient Ayurvedic remedy for foot weakness and dry bones.'
      }
    ],
    quantumSynergy: {
      synergyScore: '98.9% Biological Synergy',
      combinedMechanism: 'Vajrasana toe tuck stretches dense plantar fascia while Gelatin + Vitamin C supply critical amino acids for fascial micro-repair.',
      cellularOutcome: '48% reduction in morning heel pain and accelerated plantar fascia collagen remodeling.'
    },
    primaryAsana: {
      sanskrit: 'Vajrasana Toe Tuck & Tadasana Podal Alignment',
      english: 'Thunderbolt Plantar Fascial Stretch & Mountain Tripod Rooting',
      durationSeconds: 180,
      breathingRatio: '4s Inhale · 4s Exhale',
      steps: [
        'Kneel on mat with knees together; tuck all ten toes underneath, ensuring pinky toes are not trapped.',
        'Slowly sit back onto heels, keeping the torso upright and spine elongated.',
        'Rest hands on thighs, allowing bodyweight to gently open and stretch the thick plantar aponeurosis.',
        'Take 5 deep breaths; release and tap tops of feet on floor, then transition to standing Tadasana.',
        'In Tadasana, lift all toes, spread them wide, and anchor the tripod points: big toe ball, baby toe ball, and heel center.'
      ],
      biomechanicalAction: 'Lengthens contracted plantar fascia, mobilizes metatarsophalangeal joints, and activates deep intrinsic foot stabilizers.',
      contraindications: ['Acute calcaneal stress fracture', 'Severe diabetic peripheral neuropathy without sensation'],
      clinicalRationale: 'Restores natural arch shock-absorption mechanism, preventing kinetic chain compensation up through knees, hips, and lower back.',
      intensity: 'Restorative',
      doshaAlignment: 'Deep grounding of Vata energy'
    },
    secondaryAsanas: [
      { name: 'Adho Mukha Svanasana (Downward Dog Heel Pedals)', target: 'Achilles tendon & soleus elongation', duration: '3 mins' },
      { name: 'Vrksasana (Tree Pose Balance)', target: 'Subtalar joint proprioception & balance', duration: '2 mins' },
      { name: 'Viparita Karani (Legs-up-the-Wall)', target: 'Plantar venous drainage & lymph reduction', duration: '5 mins' }
    ]
  }
];
