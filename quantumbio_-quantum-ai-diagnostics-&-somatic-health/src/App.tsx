/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { TextbookAnatomyExplorer } from './components/TextbookAnatomyExplorer';
import { BiomedicalLabAnalyzer } from './components/BiomedicalLabAnalyzer';
import { BiomedicalRadiologyScanner } from './components/BiomedicalRadiologyScanner';
import { PharmacogenomicsProfiler } from './components/PharmacogenomicsProfiler';
import { DigitalTwinTelemetry } from './components/DigitalTwinTelemetry';
import { PatientHealthProfile } from './components/PatientHealthProfile';
import { AsanaPracticeModal } from './components/AsanaPracticeModal';
import { QuantumDiagnosticsPanel } from './components/QuantumDiagnosticsPanel';
import { QuantumSimulationLab } from './components/QuantumSimulationLab';
import { AsanaCatalogGrid } from './components/AsanaCatalogGrid';
import { QuantumEnergyAnalyticsDashboard } from './components/QuantumEnergyAnalyticsDashboard';
import { QuantumVoiceLiveStudio } from './components/QuantumVoiceLiveStudio';
import { BiomedicalSearchGrounding } from './components/BiomedicalSearchGrounding';
import { VeoAnatomicalVideoStudio } from './components/VeoAnatomicalVideoStudio';
import { ConsultationReportModal } from './components/ConsultationReportModal';
import { Footer } from './components/Footer';
import { ANATOMY_CATALOG } from './data/anatomyCatalog';
import { BodyPartData, DiagnosticResult } from './types';
import { PatientHealthProvider, usePatientHealth } from './context/PatientHealthContext';
import { AuthProvider } from './context/AuthContext';

function AppContent() {
  const { addDiagnosticRecord, logCompletedPractice } = usePatientHealth();

  const [activeTab, setActiveTab] = useState<NavTab>('textbook');
  const [selectedRegion, setSelectedRegion] = useState<BodyPartData>(ANATOMY_CATALOG[1]); // Default to Neck / Cervical
  const [isPracticeModalOpen, setIsPracticeModalOpen] = useState<boolean>(false);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState<boolean>(false);
  const [practiceRegion, setPracticeRegion] = useState<BodyPartData>(ANATOMY_CATALOG[1]);

  const handleStartPractice = (region: BodyPartData) => {
    setPracticeRegion(region);
    setIsPracticeModalOpen(true);
  };

  const handleSelectFromCatalog = (region: BodyPartData) => {
    setSelectedRegion(region);
    setActiveTab('textbook');
    const el = document.getElementById('textbook-anatomy');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDiagnosticComplete = (
    diag: DiagnosticResult,
    bodyPart: string,
    symptoms: string,
    severity: 'Mild' | 'Moderate' | 'Severe'
  ) => {
    addDiagnosticRecord({
      bodyPart,
      symptoms,
      severity,
      diagnosis: diag.probableEtiologies[0] || 'Postural Strain Syndrome',
      confidence: diag.confidenceScore,
      prescribedAsana: `${diag.primaryAsana.sanskrit} (${diag.primaryAsana.english})`,
      prescribedFoods: ['Fresh Turmeric Root & Black Pepper', 'Omega-3 EPA/DHA Resolvins'],
      quantumEnergyHartree: diag.quantumMetrics.groundStateEnergyHartree,
      status: 'Active Protocol',
    });
  };

  const handleSessionComplete = (durationMinutes: number) => {
    logCompletedPractice(practiceRegion.id, durationMinutes);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500/30 selection:text-teal-200">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenQuickDiagnostic={() => {
          setActiveTab('diagnostics');
          const el = document.getElementById('quantum-diagnostics');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenConsultationReport={() => setIsConsultationModalOpen(true)}
      />

      <main className="flex-1">
        {/* SERVICE 1: 360° 3D ANATOMICAL ATLAS & SOMATIC THERAPEUTICS */}
        {activeTab === 'textbook' && (
          <div>
            <HeroBanner
              onExploreAnatomy={() => {
                const el = document.getElementById('textbook-anatomy');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenBiomarkers={() => setActiveTab('biomarkers')}
            />

            {/* Core 360° 3D Anatomical Explorer with Dedicated Inner Cross-Section and Yogas/Foods */}
            <TextbookAnatomyExplorer
              selectedRegionId={selectedRegion.id}
              onSelectRegion={setSelectedRegion}
              onStartPractice={handleStartPractice}
            />

            {/* Asana Pharmacopoeia Grid */}
            <AsanaCatalogGrid
              onSelectAsana={handleSelectFromCatalog}
              onLaunchPractice={handleStartPractice}
            />
          </div>
        )}

        {/* FEATURE: GEMINI 3.8 LIVE VOICE CONVERSATIONS */}
        {activeTab === 'voice' && (
          <div className="py-4">
            <QuantumVoiceLiveStudio />
          </div>
        )}

        {/* FEATURE: GOOGLE SEARCH GROUNDING WITH GEMINI 3.5 FLASH */}
        {activeTab === 'search' && (
          <div className="py-4">
            <BiomedicalSearchGrounding />
          </div>
        )}

        {/* FEATURE: ANIMATE IMAGES INTO VIDEO WITH VEO 3.1 FAST */}
        {activeTab === 'video' && (
          <div className="py-4">
            <VeoAnatomicalVideoStudio />
          </div>
        )}

        {/* SERVICE 2: CLINICAL LABORATORY & BIOMARKER ANALYZER */}
        {activeTab === 'biomarkers' && (
          <div className="py-4">
            <BiomedicalLabAnalyzer onStartPractice={handleStartPractice} />
          </div>
        )}

        {/* SERVICE 3: BIOMEDICAL RADIOLOGY & DICOM / RADIOMICS SCANNER */}
        {activeTab === 'radiology' && (
          <div className="py-4">
            <BiomedicalRadiologyScanner onStartPractice={handleStartPractice} />
          </div>
        )}

        {/* SERVICE 4: PRECISION PHARMACOGENOMICS & EPIGENETICS */}
        {activeTab === 'genomics' && (
          <div className="py-4">
            <PharmacogenomicsProfiler onStartPractice={handleStartPractice} />
          </div>
        )}

        {/* SERVICE 5: DIGITAL TWIN & REAL-TIME PHYSIOLOGICAL TELEMETRY */}
        {activeTab === 'telemetry' && (
          <div className="py-4">
            <DigitalTwinTelemetry onStartPractice={handleStartPractice} />
          </div>
        )}

        {/* SERVICE 6: QUANTUM AI DIAGNOSTICS SUITE */}
        {activeTab === 'diagnostics' && (
          <div className="py-4">
            <QuantumDiagnosticsPanel
              initialRegion={selectedRegion}
              onLaunchPractice={handleStartPractice}
              onDiagnosticComplete={handleDiagnosticComplete}
              onOpenConsultationReport={() => setIsConsultationModalOpen(true)}
            />
          </div>
        )}

        {/* SERVICE 7: QUANTUM MOLECULAR SIMULATION LAB */}
        {activeTab === 'simulation' && (
          <div className="py-4">
            <QuantumSimulationLab />
          </div>
        )}

        {/* SERVICE 8: QUANTUM ENERGY HARTREE ANALYTICS DASHBOARD */}
        {activeTab === 'energy' && (
          <div className="py-4">
            <QuantumEnergyAnalyticsDashboard />
          </div>
        )}

        {/* SERVICE 9: SECURE PATIENT HEALTH PROFILE & ENTERPRISE PASS */}
        {activeTab === 'profile' && (
          <div className="py-4">
            <PatientHealthProfile
              onStartPractice={handleStartPractice}
              onOpenNewDiagnostic={() => setActiveTab('diagnostics')}
            />
          </div>
        )}
      </main>

      {/* Guided Asana Practice Modal with Voice & Respiratory Metronome */}
      <AsanaPracticeModal
        region={practiceRegion}
        isOpen={isPracticeModalOpen}
        onClose={() => setIsPracticeModalOpen(false)}
        onComplete={handleSessionComplete}
      />

      {/* Downloadable Consultation Report PDF Modal */}
      <ConsultationReportModal
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
      />

      {/* Clean Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PatientHealthProvider>
        <AppContent />
      </PatientHealthProvider>
    </AuthProvider>
  );
}
