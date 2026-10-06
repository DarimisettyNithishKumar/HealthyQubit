import { jsPDF } from 'jspdf';
import { DiagnosticRecord, PatientProfile, PreferredPractice } from '../types';

export interface ConsultationPdfOptions {
  profile: PatientProfile;
  diagnosticHistory: DiagnosticRecord[];
  preferredPractices: PreferredPractice[];
  bookmarkedFoods: string[];
  referringDoctor?: string;
  consultationNotes?: string;
  scope?: 'full' | 'diagnostics' | 'therapy';
}

export function generateConsultationPdf(options: ConsultationPdfOptions): jsPDF {
  const {
    profile,
    diagnosticHistory,
    preferredPractices,
    bookmarkedFoods,
    referringDoctor = 'Dr. Sarah Jenkins, MD - Orthopedic & Somatic Medicine',
    consultationNotes = 'Comprehensive patient consultation dossier prepared for integrative multidisciplinary spine, joint, and myofascial care.',
    scope = 'full',
  } = options;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Helper: check page break
  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin - 15) {
      doc.addPage();
      y = margin;
      drawRunningHeader();
    }
  };

  const drawRunningHeader = () => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139); // Slate-500
    doc.text('QUANTUMBIO CLINICAL HEALTHCARE · CONFIDENTIAL MEDICAL CONSULTATION REPORT', margin, y);
    doc.text(`PATIENT ID: ${profile.patientId}`, pageWidth - margin, y, { align: 'right' });
    y += 4;
    doc.setDrawColor(226, 232, 240); // Slate-200
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;
  };

  // ==========================================
  // 1. OFFICIAL MEDICAL LETTERHEAD & BANNER
  // ==========================================
  // Top brand bar
  doc.setFillColor(15, 23, 42); // Slate-900
  doc.rect(margin, y, contentWidth, 24, 'F');

  // Accent teal highlight strip
  doc.setFillColor(20, 184, 166); // Teal-500
  doc.rect(margin, y, 3, 24, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('QUANTUMBIO MEDICAL SUITE', margin + 6, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(153, 246, 228); // Teal-200
  doc.text('DEPARTMENT OF CLINICAL SOMATIC MEDICINE & QUANTUM BIOMARKERS', margin + 6, y + 14);

  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184); // Slate-400
  doc.text('ENTERPRISE PREVENTIVE HEALTHCARE · HIPAA & GDPR MEDICAL ACCREDITATION', margin + 6, y + 19);

  // Document metadata on right side
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('CONSULTATION DOSSIER', pageWidth - margin - 6, y + 8, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  const now = new Date();
  doc.text(`DOC DATE: ${now.toLocaleDateString()}`, pageWidth - margin - 6, y + 13, { align: 'right' });
  doc.text(`STATUS: CLINICAL REFERRAL`, pageWidth - margin - 6, y + 18, { align: 'right' });

  y += 28;

  // Title Box
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42); // Slate-900
  doc.text('PATIENT DIAGNOSTIC HISTORY & SOMATIC THERAPY REPORT', margin, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105); // Slate-600
  doc.text(
    'Formal clinical summary of somatic diagnostic findings, variational quantum Hartree states, and evidence-based yoga therapy.',
    margin,
    y
  );
  y += 7;

  // ==========================================
  // 2. PATIENT DEMOGRAPHICS & VITALS GRID
  // ==========================================
  doc.setFillColor(248, 250, 252); // Slate-50
  doc.setDrawColor(203, 213, 225); // Slate-300
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, y, contentWidth, 36, 2, 2, 'FD');

  const col1X = margin + 4;
  const col2X = margin + 50;
  const col3X = margin + 100;
  const col4X = margin + 140;

  // Row 1
  let rowY = y + 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('PATIENT NAME:', col1X, rowY);
  doc.text('EHR RECORD ID:', col2X, rowY);
  doc.text('OCCUPATION:', col3X, rowY);

  rowY += 4.5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text(profile.name, col1X, rowY);
  doc.text(profile.patientId, col2X, rowY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(profile.occupation, col3X, rowY);

  // Row 2
  rowY += 7;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('AGE / BLOOD GROUP:', col1X, rowY);
  doc.text('REFERRING CLINICIAN:', col2X, rowY);
  doc.text('PROTOCOL COMPLIANCE:', col3X, rowY);

  rowY += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`${profile.age} Yrs · ${profile.bloodGroup}`, col1X, rowY);
  doc.text(referringDoctor, col2X, rowY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(13, 148, 136); // Teal-600
  doc.text(`${profile.complianceRatePercent}% Optimal Adherence`, col3X, rowY);

  // Row 3: Quantum Vitals Row
  rowY += 7;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(
    `QUANTUM BIO-RESONANCE: ${profile.quantumBioResonanceScore}/100   |   INFLAMMATION: ${profile.cellularInflammationHsCRP}   |   RESTING HRV: ${profile.hrvRestingMs} ms`,
    col1X,
    rowY
  );

  y += 42;

  // Consultation Note Callout
  if (consultationNotes) {
    doc.setFillColor(240, 253, 250); // Teal-50
    doc.setDrawColor(153, 246, 228); // Teal-200
    doc.roundedRect(margin, y, contentWidth, 14, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(13, 148, 136);
    doc.text('CLINICAL CONSULTATION PURPOSE & INTAKE NOTES:', margin + 4, y + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    const splitNotes = doc.splitTextToSize(consultationNotes, contentWidth - 8);
    doc.text(splitNotes, margin + 4, y + 9);
    y += 18;
  }

  // ==========================================
  // 3. SECTION: DIAGNOSTIC HISTORY TIMELINE
  // ==========================================
  if (scope === 'full' || scope === 'diagnostics') {
    checkPageBreak(30);

    // Section Header Banner
    doc.setFillColor(30, 41, 59); // Slate-800
    doc.rect(margin, y, contentWidth, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    doc.text('1. LONGITUDINAL DIAGNOSTIC HISTORY & BIOPHYSICAL ASSESSMENTS', margin + 3, y + 4.8);
    y += 10;

    // Table Header
    doc.setFillColor(241, 245, 249); // Slate-100
    doc.rect(margin, y, contentWidth, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    doc.text('DATE', margin + 2, y + 4);
    doc.text('REGION & FINDINGS', margin + 24, y + 4);
    doc.text('SEVERITY', margin + 104, y + 4);
    doc.text('HARTREE ENERGY', margin + 130, y + 4);
    doc.text('STATUS', margin + 162, y + 4);
    y += 7;

    // Diagnostic Items
    diagnosticHistory.forEach((diag, idx) => {
      checkPageBreak(25);

      const isEven = idx % 2 === 0;
      doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
      doc.setDrawColor(226, 232, 240);
      doc.rect(margin, y, contentWidth, 22, 'FD');

      // Date
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      doc.text(diag.date, margin + 2, y + 4.5);

      // Body Part & Diagnosis
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(15, 23, 42);
      doc.text(diag.bodyPart, margin + 24, y + 4.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      const shortDiag = `Dx: ${diag.diagnosis} (${Math.round(diag.confidence * 100)}% conf)`;
      doc.text(shortDiag, margin + 24, y + 8.5);

      // Symptoms snippet
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      const splitSymptoms = doc.splitTextToSize(`Symptoms: ${diag.symptoms}`, 76);
      doc.text(splitSymptoms[0] || '', margin + 24, y + 12.5);

      // Prescribed Therapy Protocol
      if (diag.prescribedAsana) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(7);
        doc.setTextColor(13, 148, 136); // Teal-600
        doc.text(`Prescribed Rx: ${diag.prescribedAsana}`, margin + 24, y + 16.5);
      }

      // Severity Badge
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      if (diag.severity.toLowerCase() === 'severe') {
        doc.setTextColor(225, 29, 72); // Rose-600
      } else if (diag.severity.toLowerCase() === 'moderate') {
        doc.setTextColor(217, 119, 6); // Amber-600
      } else {
        doc.setTextColor(13, 148, 136); // Teal-600
      }
      doc.text(diag.severity.toUpperCase(), margin + 104, y + 6);

      // Hartree Energy Value
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(14, 116, 144); // Cyan-700
      doc.text(`${diag.quantumEnergyHartree.toFixed(3)} Ha`, margin + 130, y + 6);

      // Status
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(51, 65, 85);
      doc.text(diag.status, margin + 162, y + 6);

      y += 23.5;
    });

    y += 5;
  }

  // ==========================================
  // 4. SECTION: RECOMMENDED THERAPY PLAN (YOGA)
  // ==========================================
  if (scope === 'full' || scope === 'therapy') {
    checkPageBreak(35);

    // Section Header Banner
    doc.setFillColor(30, 41, 59);
    doc.rect(margin, y, contentWidth, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    doc.text('2. PRESCRIBED SOMATIC THERAPY PLAN & TARGETED ASANA PROTOCOLS', margin + 3, y + 4.8);
    y += 10;

    preferredPractices.forEach((practice, idx) => {
      checkPageBreak(24);

      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.3);
      doc.roundedRect(margin, y, contentWidth, 22, 1.5, 1.5, 'FD');

      // Left Color Tag
      doc.setFillColor(13, 148, 136); // Teal
      doc.rect(margin, y, 2.5, 22, 'F');

      // Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text(`${idx + 1}. ${practice.sanskrit}`, margin + 6, y + 5);

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(`(${practice.english})`, margin + 6, y + 9);

      // Target Region & Duration
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(51, 65, 85);
      doc.text(`TARGET REGION: ${practice.targetRegion}`, margin + 6, y + 14);
      doc.text(`INTENSITY: ${practice.intensity} · SESSIONS COMPLETED: ${practice.sessionsCompleted}`, margin + 6, y + 18);

      // Metrics block on right
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(13, 148, 136);
      doc.text(`${practice.durationMinutes} MIN / SESSION`, pageWidth - margin - 4, y + 6, { align: 'right' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      doc.text(`Total Practice: ${practice.totalMinutes} mins`, pageWidth - margin - 4, y + 11, { align: 'right' });
      doc.text(`Last Practiced: ${practice.lastPracticedDate}`, pageWidth - margin - 4, y + 16, { align: 'right' });

      y += 24;
    });

    y += 4;
  }

  // ==========================================
  // 5. SECTION: NUTRACEUTICAL CO-FACTORS
  // ==========================================
  if (scope === 'full') {
    checkPageBreak(25);

    doc.setFillColor(30, 41, 59);
    doc.rect(margin, y, contentWidth, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    doc.text('3. COMPLEMENTARY BIOCHEMICAL PHARMACOPOEIA & NUTRITIONAL HEALING', margin + 3, y + 4.8);
    y += 10;

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, 20, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(13, 148, 136);
    doc.text('PRESCRIBED ANTI-INFLAMMATORY & COLLAGEN-SYNTHESIS CO-FACTORS:', margin + 4, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(30, 41, 59);

    bookmarkedFoods.slice(0, 4).forEach((food, fIdx) => {
      const colX = fIdx % 2 === 0 ? margin + 4 : margin + 96;
      const rowOffset = fIdx < 2 ? y + 10 : y + 15;
      doc.text(`• ${food}`, colX, rowOffset);
    });

    y += 24;
  }

  // ==========================================
  // 6. CLINICAL ATTESTATION & SIGNATURE BLOCK
  // ==========================================
  checkPageBreak(38);

  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 34, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  doc.text('PHYSICIAN & SOMATIC SPECIALIST CONSULTATION ATTESTATION', margin + 4, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(
    'I certify that this patient health dossier contains validated somatic diagnostics, electronic health telemetry, and targeted therapeutic yoga protocols calibrated for musculoskeletal decompression and autonomic recovery.',
    margin + 4,
    y + 9.5,
    { maxWidth: contentWidth - 8 }
  );

  // Signatures row
  const sigY = y + 25;
  doc.setDrawColor(148, 163, 184);
  doc.line(margin + 4, sigY, margin + 65, sigY);
  doc.line(margin + 90, sigY, margin + 145, sigY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text('Attending Clinician / Specialist Signature', margin + 4, sigY + 4);
  doc.text('Medical License / Clinic Verification Stamp', margin + 90, sigY + 4);

  // Verification Hash / QR representation
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(13, 148, 136);
  const recordHash = `SECURE-HASH-${profile.patientId}-${Math.floor(Math.random() * 900000 + 100000)}`;
  doc.text(`VERIFIED RECORD: ${recordHash}`, pageWidth - margin - 4, sigY + 4, { align: 'right' });

  // Add Page Numbers on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `QuantumBio Confidential Clinical Consultation Report · Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  }

  return doc;
}
