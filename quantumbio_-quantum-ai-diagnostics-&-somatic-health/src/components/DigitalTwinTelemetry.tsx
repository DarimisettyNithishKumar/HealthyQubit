import React, { useState, useEffect, useRef } from 'react';
import { BodyPartData } from '../types';
import { ANATOMY_CATALOG } from '../data/anatomyCatalog';
import { 
  Activity, 
  Heart, 
  Wind, 
  Zap, 
  TrendingUp, 
  ShieldCheck, 
  Play, 
  Pause, 
  RotateCcw,
  Sparkles,
  Waves,
  Gauge
} from 'lucide-react';

interface DigitalTwinTelemetryProps {
  onStartPractice: (region: BodyPartData) => void;
}

export const DigitalTwinTelemetry: React.FC<DigitalTwinTelemetryProps> = ({
  onStartPractice,
}) => {
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [heartRate, setHeartRate] = useState<number>(68);
  const [hrvMs, setHrvMs] = useState<number>(54);
  const [glucose, setGlucose] = useState<number>(96);
  const [spo2, setSpo2] = useState<number>(99);
  const [systolic, setSystolic] = useState<number>(118);
  const [diastolic, setDiastolic] = useState<number>(76);
  const [isVagalPacingActive, setIsVagalPacingActive] = useState<boolean>(false);
  const [vagalToneScore, setVagalToneScore] = useState<number>(62);

  // Canvas ref for high-performance 60FPS ECG Lead-II waveform rendering
  const ecgCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ecgCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let step = 0;
    const width = canvas.width;
    const height = canvas.height;
    const points: number[] = new Array(width).fill(height / 2);

    const render = () => {
      animId = requestAnimationFrame(render);
      if (!isRunning) return;

      step++;

      // Lead-II ECG mathematical waveform generation (P-wave, QRS-complex, T-wave)
      const period = isVagalPacingActive ? 75 : 55; // slower when vagal pacing is active
      const phase = step % period;
      let yVal = height / 2;

      if (phase >= 10 && phase <= 18) {
        // P-wave (atrial depolarization)
        yVal -= Math.sin(((phase - 10) / 8) * Math.PI) * 12;
      } else if (phase === 24) {
        // Q-dip
        yVal += 8;
      } else if (phase === 26) {
        // R-peak (ventricular depolarization)
        yVal -= 65;
      } else if (phase === 28) {
        // S-dip
        yVal += 22;
      } else if (phase >= 34 && phase <= 46) {
        // T-wave (ventricular repolarization)
        yVal -= Math.sin(((phase - 34) / 12) * Math.PI) * 20;
      }

      // Add gentle baseline respiratory wander
      yVal += Math.sin(step * 0.04) * 4;

      // Shift points array
      points.push(yVal);
      points.shift();

      // Clear Canvas
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, width, height);

      // Draw Grid Lines (Medical ECG 5mm grid)
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 25) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 25) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Glowing Phosphor ECG Trace
      ctx.strokeStyle = isVagalPacingActive ? '#2dd4bf' : '#14b8a6';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#14b8a6';
      ctx.shadowBlur = 8;
      ctx.beginPath();

      for (let i = 0; i < points.length; i++) {
        if (i === 0) ctx.moveTo(i, points[i]);
        else ctx.lineTo(i, points[i]);
      }
      ctx.stroke();
      ctx.shadowBlur = 0; // reset
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isRunning, isVagalPacingActive]);

  // Vitals simulation interval
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      if (isVagalPacingActive) {
        // Vagal pacing activates parasympathetic branch: HR drops, HRV increases, BP stabilizes
        setHeartRate((prev) => Math.max(56, Math.min(64, prev + (Math.random() * 2 - 1.2))));
        setHrvMs((prev) => Math.min(88, Math.max(68, prev + (Math.random() * 2 - 0.5))));
        setVagalToneScore((prev) => Math.min(94, prev + 1));
        setSystolic(114);
        setDiastolic(72);
      } else {
        // Standard resting profile
        setHeartRate((prev) => Math.round(Math.max(62, Math.min(76, prev + (Math.random() * 4 - 2)))));
        setHrvMs((prev) => Math.round(Math.max(45, Math.min(62, prev + (Math.random() * 4 - 2)))));
        setGlucose((prev) => Math.round(Math.max(90, Math.min(108, prev + (Math.random() * 2 - 1)))));
        setSpo2(99);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isRunning, isVagalPacingActive]);

  return (
    <section id="telemetry-vitals" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-teal-400 mb-2">
            <Activity className="w-4 h-4" />
            <span>REAL-TIME PHYSIOLOGICAL DIGITAL TWIN</span>
            <span aria-hidden="true">·</span>
            <span>LIVE 60FPS ECG & AUTONOMIC TELEMETRY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            Digital Twin & Physiological Telemetry
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Stream real-time biometric telemetry including Lead-II ECG cardiac rhythm, continuous HRV parasympathetic vagal indices, interstitial glucose trajectory, and blood pressure arterial compliance.
          </p>
        </div>

        {/* Live Controls */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setIsVagalPacingActive(!isVagalPacingActive)}
            className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg border transition-all flex items-center gap-2 ${
              isVagalPacingActive
                ? 'bg-teal-400 text-slate-950 border-teal-300 shadow-lg shadow-teal-500/30'
                : 'bg-slate-900 text-teal-300 border-teal-500/50 hover:bg-teal-500/20'
            }`}
          >
            <Wind className="w-4 h-4" />
            <span>{isVagalPacingActive ? 'Vagal Pacing ACTIVE' : 'Engage Vagal Pacing'}</span>
          </button>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors"
            title={isRunning ? 'Pause Telemetry' : 'Resume Telemetry'}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Real-Time Live Lead-II ECG Display Canvas */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2 text-teal-300">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
            <span className="font-bold text-white">LEAD-II SURFACE ECG VECTOR:</span>
            <span>25 mm/s · 10 mm/mV · QTc: 412ms</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>FILTER: 0.05–150 Hz</span>
            <span>R-R REGULARITY: 99.4%</span>
            <span className="text-emerald-400 font-bold">NORMAL SINUS RHYTHM</span>
          </div>
        </div>

        {/* 60FPS High Performance Canvas */}
        <div className="w-full h-44 sm:h-52 bg-slate-950 rounded-xl overflow-hidden border border-slate-900 relative">
          <canvas
            ref={ecgCanvasRef}
            width={1100}
            height={200}
            className="w-full h-full object-cover"
          />

          {/* Real-time Heart Rate Overlay Badge */}
          <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-3.5 py-1.5 rounded-lg flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-ping" />
            <span className="text-xl font-bold font-mono text-white">{Math.round(heartRate)}</span>
            <span className="text-xs font-mono text-slate-400">BPM</span>
          </div>
        </div>
      </div>

      {/* 4 Biometric Telemetry Instrument Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. HRV & Vagal Autonomic Tone */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>HEART RATE VARIABILITY</span>
            <Activity className="w-4 h-4 text-teal-400" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-white">{Math.round(hrvMs)}</span>
              <span className="text-xs text-slate-400 font-mono">ms (RMSSD)</span>
            </div>
            <span className="text-xs text-teal-400 font-mono mt-1 block">
              Parasympathetic Reserve: {vagalToneScore}%
            </span>
          </div>
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-teal-400 rounded-full transition-all duration-500"
              style={{ width: `${vagalToneScore}%` }}
            />
          </div>
        </div>

        {/* 2. Continuous Interstitial Glucose (CGM) */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>CONTINUOUS GLUCOSE (CGM)</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-white">{glucose}</span>
              <span className="text-xs text-slate-400 font-mono">mg/dL</span>
            </div>
            <span className="text-xs text-emerald-400 font-mono mt-1 block">
              Time In Range (TIR): 98.6% · Steady
            </span>
          </div>
          <span className="text-[11px] text-slate-400 block">
            Postprandial Glycemic Stability Optimal
          </span>
        </div>

        {/* 3. SpO2 Pulse Oximetry */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>PULSE OXIMETRY (SpO2)</span>
            <Wind className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-white">{spo2}%</span>
              <span className="text-xs text-slate-400 font-mono">Saturation</span>
            </div>
            <span className="text-xs text-cyan-400 font-mono mt-1 block">
              Perfusion Index (PI): 4.8 · High
            </span>
          </div>
          <span className="text-[11px] text-slate-400 block">
            Alveolar Hemoglobin Binding Normal
          </span>
        </div>

        {/* 4. Arterial Blood Pressure & Vascular Compliance */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>BLOOD PRESSURE & STIFFNESS</span>
            <Gauge className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-white">{systolic}/{diastolic}</span>
              <span className="text-xs text-slate-400 font-mono">mmHg</span>
            </div>
            <span className="text-xs text-amber-300 font-mono mt-1 block">
              Pulse Wave Velocity: 6.8 m/s
            </span>
          </div>
          <span className="text-[11px] text-slate-400 block">
            Endothelial Shear Compliance Normal
          </span>
        </div>
      </div>

      {/* Somatic Vagal Biofeedback Integration Banner */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-mono text-teal-400 font-bold">
            <Sparkles className="w-4 h-4" />
            <span>BIOFEEDBACK AUTONOMIC SYNCHRONIZATION</span>
          </div>
          <h4 className="text-lg font-bold text-white">
            Respiratory Sinus Arrhythmia (RSA) Entrainment
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Synchronizing respiration to 5.5 to 6.0 breaths per minute activates aortic baroreceptors, increasing HRV by up to 48% within 3 minutes and downregulating sympathetic adrenal cortisol release.
          </p>
        </div>

        <button
          onClick={() => onStartPractice(ANATOMY_CATALOG[3])} // Chest & Cardiopulmonary
          className="px-6 py-3 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-sm rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-teal-500/20 whitespace-nowrap"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Launch Vagal Pranayama Practice</span>
        </button>
      </div>
    </section>
  );
};
