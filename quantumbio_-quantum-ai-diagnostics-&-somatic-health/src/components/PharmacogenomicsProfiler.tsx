import React, { useState } from 'react';
import { PharmacogenomicVariant, BodyPartData } from '../types';
import { ANATOMY_CATALOG } from '../data/anatomyCatalog';
import { 
  Dna, 
  Pill, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Activity, 
  Play, 
  Apple, 
  ShieldCheck, 
  HelpCircle,
  FileCheck
} from 'lucide-react';

interface PharmacogenomicsProfilerProps {
  onStartPractice: (region: BodyPartData) => void;
}

export const PharmacogenomicsProfiler: React.FC<PharmacogenomicsProfilerProps> = ({
  onStartPractice,
}) => {
  const [selectedVariantId, setSelectedVariantId] = useState<string>('mthfr');

  const variants: PharmacogenomicVariant[] = [
    {
      gene: 'MTHFR',
      variant: 'C677T Heterozygous (677C>T)',
      rsId: 'rs1801133',
      genotype: 'C/T',
      phenotype: 'Reduced 5-MTHF Synthesis (~35% reduction in enzymatic folate methylation)',
      impactScore: 'Moderate Caution',
      drugInteractions: [
        'Methotrexate (Increased toxicity risk)',
        'Synthetic Folic Acid (Unmetabolized folic acid accumulation)',
        'Nitrous Oxide (Inactivates methionine synthase)'
      ],
      pathwayMechanism: 'Slowed conversion of 5,10-methylenetetrahydrofolate to 5-methyltetrahydrofolate (5-MTHF), leading to elevated plasma homocysteine and suboccipital arterial tension.',
      epigeneticNutrigenomics: 'Supplement with bioactive L-5-Methyltetrahydrofolate (5-MTHF) 800mcg/day, Methylcobalamin B12, and Trimethylglycine (Betaine). Avoid synthetic fortified folic acid.',
      lifestyleGuidance: 'Incorporate Bhramari Humming Pranayama to stimulate cerebral nitric oxide synthesis and Matsyasana to decompress thoracic vascular lymphatic drainage.'
    },
    {
      gene: 'CYP2D6',
      variant: '*4 Null Allele (Intermediate Metabolizer)',
      rsId: 'rs3892097',
      genotype: '*1/*4',
      phenotype: 'Intermediate Drug Metabolizer (IM)',
      impactScore: 'Moderate Caution',
      drugInteractions: [
        'Codeine (Blunted analgesic conversion to morphine)',
        'Tramadol (Decreased efficacy)',
        'Metoprolol (Elevated plasma concentrations; increased bradycardia risk)',
        'Fluoxetine & Duloxetine (Altered clearance kinetics)'
      ],
      pathwayMechanism: 'Impaired hepatic cytochrome P450 2D6 phase-I monooxygenase activity, responsible for metabolizing 25% of all clinical pharmaceutical agents.',
      epigeneticNutrigenomics: 'Sulforaphane from raw broccoli sprouts (100mg/day) to upregulate Nrf2 phase-II glucuronidation. Curcumin and Milk Thistle to protect hepatic phase-II conjugation pathways.',
      lifestyleGuidance: 'Avoid polypharmacy when possible. Utilize non-pharmacological somatic pain modalities such as spinal decompression yoga and acupuncture.'
    },
    {
      gene: 'COMT',
      variant: 'Val158Met (Met/Met Genotype)',
      rsId: 'rs4680',
      genotype: 'A/A (Met/Met)',
      phenotype: 'Slow Catecholamine Breakdown ("Worrier" Stress Phenotype)',
      impactScore: 'High Risk',
      drugInteractions: [
        'Amphetamines & Methylphenidate (Severe hyper-arousal and anxiety)',
        'L-DOPA (Prolonged duration of action)',
        'High-Dose Caffeine (Prolonged jitteriness and insomnia)'
      ],
      pathwayMechanism: '4-fold decrease in catechol-O-methyltransferase enzymatic activity in prefrontal cortex. High baseline synaptic dopamine confers exceptional detail focus but causes prolonged cortisol arousal under corporate deadlines.',
      epigeneticNutrigenomics: 'Magnesium L-Threonate (400mg) to modulate NMDA receptors. Low-caffeine green tea (L-Theanine 200mg). Avoid high-dose catecholamine-stimulating pre-workouts.',
      lifestyleGuidance: 'Mandatory daily parasympathetic somatic practices: Shavasana, Nadi Shodhana (Alternate Nostril Pranayama), and evening restorative Yin Yoga.'
    },
    {
      gene: 'APOE',
      variant: 'Apolipoprotein E (ε3/ε4 Heterozygote)',
      rsId: 'rs429358',
      genotype: 'ε3/ε4',
      phenotype: 'Heightened Neurovascular & Atherogenic Sensitivity',
      impactScore: 'High Risk',
      drugInteractions: [
        'Statins (Altered myopathy risk profile; monitor CK enzymes)',
        'High-Dose Saturated Fats / Ketogenic Diets (Marked ApoB/LDL particle elevation)'
      ],
      pathwayMechanism: 'Altered lipid-binding affinity of apoE isoform impairing blood-brain barrier clearance of amyloid-beta and accelerating vascular endothelial LDL-C retention.',
      epigeneticNutrigenomics: 'Mediterranean-style dietary pattern rich in Extra Virgin Olive Oil polyphenols, wild Alaskan salmon Omega-3 EPA/DHA, and wild blueberries. Avoid coconut oil/butter keto diets.',
      lifestyleGuidance: 'Daily aerobic postural flows (Surya Namaskar) combined with cardiovascular endurance to stimulate cerebral glymphatic clearance during deep sleep.'
    },
    {
      gene: 'HLA-B27',
      variant: 'HLA-B*2705 Allele (Negative)',
      rsId: 'rs13202464',
      genotype: 'Negative',
      phenotype: 'Low Risk for Autoimmune Spondyloarthropathy',
      impactScore: 'Normal Function',
      drugInteractions: [
        'Biologic TNF-Inhibitors (Not indicated for autoimmune axial spondyloarthritis)'
      ],
      pathwayMechanism: 'Normal MHC Class-I antigen presentation without misfolded heavy chain aggregation or IL-23/IL-17 axis autoimmune hyper-activation in sacroiliac joints.',
      epigeneticNutrigenomics: 'Maintain gut microbiome diversity with prebiotic fibers and fermented foods to preserve mucosal barrier integrity.',
      lifestyleGuidance: 'Safe for full range-of-motion spinal mobility asanas including gentle backbends and hip openers.'
    },
    {
      gene: 'ACTN3',
      variant: 'Alpha-Actinin-3 (R577X - RX Heterozygote)',
      rsId: 'rs1815739',
      genotype: 'C/T (577R/X)',
      phenotype: 'Balanced Power & Postural Muscular Endurance',
      impactScore: 'Normal Function',
      drugInteractions: [
        'None identified'
      ],
      pathwayMechanism: 'Balanced synthesis of sarcomeric alpha-actinin-3 in fast-twitch Type-IIa/IIx myofibers alongside Type-I slow postural oxidative fibers.',
      epigeneticNutrigenomics: 'Adequate leucine and essential amino acids (EAAs) supporting myofibrillar protein synthesis and satellite cell regeneration.',
      lifestyleGuidance: 'Optimal response to both dynamic strength postures (Warrior sequence) and restorative static endurance holds.'
    }
  ];

  const selectedVariant = variants.find((v) => v.gene.toLowerCase() === selectedVariantId.toLowerCase()) || variants[0];

  const handleLaunchTargetedYoga = () => {
    let region = ANATOMY_CATALOG[0]; // head for COMT / MTHFR
    if (selectedVariant.gene === 'APOE') region = ANATOMY_CATALOG[3]; // chest
    if (selectedVariant.gene === 'HLA-B27') region = ANATOMY_CATALOG[5]; // back
    if (selectedVariant.gene === 'ACTN3') region = ANATOMY_CATALOG[7]; // knees
    onStartPractice(region);
  };

  return (
    <section id="pharmacogenomics" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-teal-400 mb-2">
            <Dna className="w-4 h-4" />
            <span>PRECISION MEDICINE & EPIGENETICS</span>
            <span aria-hidden="true">·</span>
            <span>PHARMACOGENOMICS (PGX) & SNP RISK ENGINE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            Precision Pharmacogenomics & Epigenetics
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Analyze single nucleotide polymorphisms (SNPs) governing hepatic drug metabolism, neuro-transmitter dopamine clearance, methylation pathways, and cardiovascular risk to personalize medical safety and somatic routines.
          </p>
        </div>

        {/* Status Badge */}
        <div className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-teal-300 flex items-center gap-2 self-start md:self-auto">
          <FileCheck className="w-4 h-4 text-teal-400" />
          <span>6 CLINICAL VARIANTS SEQUENCED</span>
        </div>
      </div>

      {/* Main Split Grid: Left = Gene Variant Cards, Right = Precision Pharmacogenomic Rx */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ================= LEFT COLUMN: SNP VARIANT CARDS (6 cols) ================= */}
        <div className="lg:col-span-6 space-y-3">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1">
            PATIENT GENOMIC VARIANTS (ACTIONABLE SNPS):
          </span>

          {variants.map((v) => {
            const isSelected = v.gene === selectedVariant.gene;
            return (
              <div
                key={v.gene}
                onClick={() => setSelectedVariantId(v.gene.toLowerCase())}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                  isSelected
                    ? 'bg-slate-900 border-teal-500 shadow-lg shadow-teal-500/10'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-base font-bold text-white font-mono">{v.gene}</span>
                    <span className="text-xs text-slate-400 font-mono">({v.rsId})</span>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                      v.impactScore === 'High Risk'
                        ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
                        : v.impactScore === 'Moderate Caution'
                        ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                        : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                    }`}
                  >
                    {v.impactScore}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">{v.variant}</span>
                  <span className="font-mono text-teal-300 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    Genotype: {v.genotype}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {v.phenotype}
                </p>
              </div>
            );
          })}
        </div>

        {/* ================= RIGHT COLUMN: INTERACTIVE PHARMACOGENOMIC RX (6 cols) ================= */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl sticky top-20">
            {/* Header */}
            <div className="pb-4 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-teal-400 uppercase tracking-wider font-semibold">
                  GENOMIC DOSING & DRUG INTERACTION INTELLIGENCE
                </span>
                <span className="text-xs font-mono px-2 py-0.5 bg-slate-950 text-teal-300 border border-slate-800 rounded font-bold">
                  {selectedVariant.rsId}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mt-1">
                {selectedVariant.gene}: {selectedVariant.variant}
              </h3>
              <p className="text-xs font-mono text-teal-300 mt-0.5">
                Clinical Phenotype: {selectedVariant.phenotype}
              </p>
            </div>

            {/* Drug Interactions & Black Box Warnings */}
            <div className="p-4 bg-rose-950/20 border border-rose-900/50 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-rose-300 text-xs font-mono font-bold">
                <Pill className="w-4 h-4 text-rose-400" />
                <span>PHARMACEUTICAL CONTRAINDICATIONS & METABOLISM ALERTS</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-200">
                {selectedVariant.drugInteractions.map((drug, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{drug}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Biochemical Pathway Mechanism */}
            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1.5 text-xs">
              <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-semibold block">
                MOLECULAR BIOLOGICAL MECHANISM:
              </span>
              <p className="text-slate-200 leading-relaxed">
                {selectedVariant.pathwayMechanism}
              </p>
            </div>

            {/* Epigenetic & Nutrigenomics Supplementation */}
            <div className="p-4 bg-purple-950/20 border border-purple-500/40 rounded-xl space-y-2 text-xs">
              <span className="text-[11px] font-mono text-purple-300 uppercase tracking-wider font-semibold block flex items-center gap-1.5">
                <Apple className="w-3.5 h-3.5 text-purple-400" />
                <span>EPIGENETIC & NUTRIGENOMIC INTERVENTION RX:</span>
              </span>
              <p className="text-slate-200 leading-relaxed">
                {selectedVariant.epigeneticNutrigenomics}
              </p>
            </div>

            {/* Somatic Yoga Protocol */}
            <div className="p-4 bg-teal-950/30 border border-teal-500/40 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-teal-300 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-teal-400" />
                  <span>SOMATIC AUTONOMIC REGULATION</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-teal-400 text-slate-950 font-bold rounded">
                  EPIGENETIC HOMEOSTASIS
                </span>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {selectedVariant.lifestyleGuidance}
              </p>

              <button
                onClick={handleLaunchTargetedYoga}
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
