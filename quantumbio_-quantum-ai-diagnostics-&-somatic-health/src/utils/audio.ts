// Web Audio API Synthesizer for meditation & breathwork chimes
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playSingingBowlChime(freq = 432, duration = 2.5) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    // Subtle harmonic overtone
    const overtone = ctx.createOscillator();
    const overtoneGain = ctx.createGain();
    overtone.type = 'sine';
    overtone.frequency.setValueAtTime(freq * 2.76, ctx.currentTime);

    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    overtoneGain.gain.setValueAtTime(0, now);
    overtoneGain.gain.linearRampToValueAtTime(0.08, now + 0.05);
    overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + (duration * 0.7));

    osc.connect(gain);
    overtone.connect(overtoneGain);
    gain.connect(ctx.destination);
    overtoneGain.connect(ctx.destination);

    osc.start(now);
    overtone.start(now);
    osc.stop(now + duration);
    overtone.stop(now + duration);
  } catch (e) {
    // Gracefully handle browser auto-play policy
    console.debug('Audio play skipped', e);
  }
}

export function speakInstructions(text: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.92;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.debug('Speech synthesis unavailable', e);
  }
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}
