import React, { useState, useEffect, useRef } from 'react';
import { BodyPartData } from '../types';
import { Play, Pause, RotateCcw, Volume2, VolumeX, X, Check, Wind, Heart, Sparkles } from 'lucide-react';
import { playSingingBowlChime, speakInstructions, stopSpeaking } from '../utils/audio';

interface AsanaPracticeModalProps {
  region: BodyPartData;
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (durationMinutes: number) => void;
}

type BreathPhase = 'Inhale' | 'Hold' | 'Exhale' | 'Rest';

export const AsanaPracticeModal: React.FC<AsanaPracticeModalProps> = ({
  region,
  isOpen,
  onClose,
  onComplete,
}) => {
  const asana = region.primaryAsana;
  const totalDuration = asana.durationSeconds;

  const [timeLeft, setTimeLeft] = useState(totalDuration);
  const [isActive, setIsActive] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [checkedSteps, setCheckedSteps] = useState<boolean[]>(
    new Array(asana.steps.length).fill(false)
  );

  // Respiratory pacing cycle: 4s inhale, 2s hold, 6s exhale, 2s rest
  const [breathPhase, setBreathPhase] = useState<BreathPhase>('Inhale');
  const [breathSecondsLeft, setBreathSecondsLeft] = useState(4);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const breathTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset when region changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeLeft(totalDuration);
      setIsActive(false);
      setBreathPhase('Inhale');
      setBreathSecondsLeft(4);
      setCheckedSteps(new Array(asana.steps.length).fill(false));
    } else {
      stopSpeaking();
    }
  }, [isOpen, region]);

  // Main session timer
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            playSingingBowlChime(528, 3.0);
            setIsActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  // Breath cadence metronome
  useEffect(() => {
    if (!isActive) return;

    breathTimerRef.current = setInterval(() => {
      setBreathSecondsLeft((prev) => {
        if (prev <= 1) {
          // Transition to next breath phase
          if (breathPhase === 'Inhale') {
            setBreathPhase('Hold');
            playSingingBowlChime(432, 1.2);
            return 2;
          } else if (breathPhase === 'Hold') {
            setBreathPhase('Exhale');
            playSingingBowlChime(396, 1.5);
            return 6;
          } else if (breathPhase === 'Exhale') {
            setBreathPhase('Rest');
            playSingingBowlChime(330, 1.0);
            return 2;
          } else {
            setBreathPhase('Inhale');
            playSingingBowlChime(528, 1.5);
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (breathTimerRef.current) clearInterval(breathTimerRef.current);
    };
  }, [isActive, breathPhase]);

  const toggleTimer = () => {
    if (!isActive) {
      setIsActive(true);
      playSingingBowlChime(528, 2.0);
      if (voiceEnabled) {
        speakInstructions(`Beginning ${asana.sanskrit}. Settle into your posture.`);
      }
    } else {
      setIsActive(false);
      stopSpeaking();
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(totalDuration);
    setBreathPhase('Inhale');
    setBreathSecondsLeft(4);
    stopSpeaking();
  };

  const toggleStep = (idx: number) => {
    const next = [...checkedSteps];
    next[idx] = !next[idx];
    setCheckedSteps(next);
  };

  const handleVoiceToggle = () => {
    const next = !voiceEnabled;
    setVoiceEnabled(next);
    if (!next) {
      stopSpeaking();
    } else if (isActive) {
      speakInstructions(`Voice coach activated for ${asana.english}.`);
    }
  };

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progressPercent = ((totalDuration - timeLeft) / totalDuration) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl relative my-auto">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-xs font-mono text-teal-300 uppercase tracking-wider">
              REAL-TIME GUIDED ASANA STUDIO · {region.label.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleVoiceToggle}
              className={`p-1.5 rounded-lg transition-colors ${
                voiceEnabled
                  ? 'text-teal-300 bg-teal-500/20 border border-teal-500/30'
                  : 'text-slate-400 hover:text-white bg-slate-800'
              }`}
              title={voiceEnabled ? 'Voice Guidance Active' : 'Voice Guidance Muted'}
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={() => {
                stopSpeaking();
                onClose();
              }}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Asana Header */}
          <div className="text-center max-w-xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {asana.sanskrit}
            </h3>
            <p className="text-sm text-teal-400 font-medium mt-1">{asana.english}</p>
            <p className="text-xs text-slate-400 mt-2">{asana.clinicalRationale}</p>
          </div>

          {/* Interactive Respiratory Pacing Metronome & Timer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-slate-950/60 border border-slate-800 rounded-xl p-6">
            {/* Left: Respiratory Visualizer Circle */}
            <div className="flex flex-col items-center justify-center text-center">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-3">
                AUTONOMIC BREATH METRONOME
              </span>

              {/* Dynamic Breathing Circle */}
              <div className="relative w-40 h-40 flex items-center justify-center">
                {/* Outer Ripple */}
                <div
                  className={`absolute inset-0 rounded-full border border-teal-500/30 transition-all duration-1000 ${
                    breathPhase === 'Inhale'
                      ? 'scale-110 opacity-70 bg-teal-500/10'
                      : breathPhase === 'Exhale'
                      ? 'scale-90 opacity-30 bg-transparent'
                      : 'scale-100 opacity-50 bg-teal-500/5'
                  }`}
                />
                {/* Middle Core Ring */}
                <div
                  className={`w-28 h-28 rounded-full border-2 border-teal-400/80 flex flex-col items-center justify-center transition-all duration-1000 ${
                    breathPhase === 'Inhale'
                      ? 'scale-105 shadow-[0_0_25px_rgba(20,184,166,0.4)]'
                      : breathPhase === 'Exhale'
                      ? 'scale-95 shadow-none'
                      : 'scale-100 shadow-[0_0_12px_rgba(20,184,166,0.2)]'
                  }`}
                >
                  <Wind className="w-5 h-5 text-teal-300 mb-1" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    {breathPhase}
                  </span>
                  <span className="text-xs font-mono text-teal-300">
                    {breathSecondsLeft}s
                  </span>
                </div>
              </div>

              <span className="text-[11px] text-slate-400 mt-3 font-mono">
                {asana.breathingRatio}
              </span>
            </div>

            {/* Right: Posture Timer and Controls */}
            <div className="flex flex-col items-center justify-center text-center border-t md:border-t-0 md:border-l border-slate-800 pt-6 md:pt-0 md:pl-6">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2">
                POSTURE HOLD TIME
              </span>

              {/* Digital Monospace Readout */}
              <div className="text-5xl font-mono font-bold text-white tracking-tight my-2">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </div>

              {/* Progress Bar */}
              <div className="w-full max-w-[220px] bg-slate-800 h-1.5 rounded-full overflow-hidden my-3">
                <div
                  className="bg-teal-400 h-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={toggleTimer}
                  className={`px-5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all shadow-md ${
                    isActive
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                      : 'bg-teal-400 hover:bg-teal-300 text-slate-950'
                  }`}
                >
                  {isActive ? (
                    <>
                      <Pause className="w-4 h-4 fill-current" />
                      <span>Pause Hold</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>{timeLeft === totalDuration ? 'Begin Asana' : 'Resume'}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={resetTimer}
                  className="p-2.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                  title="Reset timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Biomechanical Checklist */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-mono text-slate-300 uppercase tracking-wider">
                BIOMECHANICAL ALIGNMENT CHECKPOINTS ({checkedSteps.filter(Boolean).length}/{asana.steps.length})
              </h4>
              <span className="text-[11px] text-slate-500">Tap to mark completed</span>
            </div>

            <div className="space-y-2">
              {asana.steps.map((step, idx) => {
                const isChecked = checkedSteps[idx];
                return (
                  <button
                    key={idx}
                    onClick={() => toggleStep(idx)}
                    className={`w-full text-left p-3 rounded-lg border text-xs flex items-start gap-3 transition-colors ${
                      isChecked
                        ? 'bg-teal-950/20 border-teal-500/40 text-slate-200'
                        : 'bg-slate-950/50 border-slate-800/80 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                        isChecked
                          ? 'bg-teal-400 border-teal-400 text-slate-950'
                          : 'border-slate-700 bg-slate-900'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className={isChecked ? 'line-through text-slate-400' : ''}>{step}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-950/70 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Clinical Somatic Protocol · Evidence-Based Mechanotransduction</span>
          <button
            onClick={() => {
              stopSpeaking();
              if (onComplete) {
                const practicedMinutes = Math.max(1, Math.ceil((totalDuration - timeLeft) / 60));
                onComplete(practicedMinutes);
              }
              onClose();
            }}
            className="px-4 py-1.5 text-xs font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded transition-colors shadow"
          >
            Complete Session & Log Record
          </button>
        </div>
      </div>
    </div>
  );
};
