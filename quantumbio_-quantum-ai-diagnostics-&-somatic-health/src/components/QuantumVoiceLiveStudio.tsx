import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Radio, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Activity, 
  Square, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare, 
  Clock, 
  ShieldCheck, 
  Send,
  Save,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

interface MessageTurn {
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const QuantumVoiceLiveStudio: React.FC = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('Ready to start Live Voice session');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [conversation, setConversation] = useState<MessageTurn[]>([
    {
      sender: 'assistant',
      text: 'Hello, I am QuantumBio AI Doctor powered by Gemini 3.8 Live. Click "Start Live Conversation" and speak into your microphone to consult on somatic posture, clinical anatomy, yoga therapy, and biomedical recovery in real-time.',
      timestamp: '00:00'
    }
  ]);
  const [textInput, setTextInput] = useState<string>('');
  const [activeAudioVisual, setActiveAudioVisual] = useState<number>(0);
  const [sessionDuration, setSessionDuration] = useState<number>(0);
  const [isSavedToCloud, setIsSavedToCloud] = useState<boolean>(false);

  // Audio Context & WebSocket references
  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const timerRef = useRef<any>(null);

  // Timer loop for active session
  useEffect(() => {
    if (isConnected) {
      timerRef.current = setInterval(() => {
        setSessionDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setSessionDuration(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isConnected]);

  // Audio helper: convert Float32 PCM to 16-bit linear PCM base64
  const pcmToBase64 = (float32Array: Float32Array): string => {
    const int16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    const bytes = new Uint8Array(int16Array.buffer);
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  // Play audio chunk at 24kHz (Gemini Live output rate)
  const playAudioChunk = (audioCtx: AudioContext, base64Audio: string) => {
    try {
      const binaryString = atob(base64Audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const int16 = new Int16Array(bytes.buffer);
      const float32 = new Float32Array(int16.length);
      for (let i = 0; i < int16.length; i++) {
        float32[i] = int16[i] / 32768.0;
      }

      const audioBuffer = audioCtx.createBuffer(1, float32.length, 24000);
      audioBuffer.getChannelData(0).set(float32);

      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtx.destination);
      source.start();

      setActiveAudioVisual(Math.floor(Math.random() * 80) + 20);
      setTimeout(() => setActiveAudioVisual(0), 400);
    } catch (e) {
      console.error('Audio decode error:', e);
    }
  };

  const startVoiceSession = async () => {
    setErrorMessage(null);
    setStatusMessage('Connecting to Gemini 3.8 Live API via WebSocket...');

    try {
      // 1. Setup audio output context (24kHz)
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      outputAudioCtxRef.current = new AudioCtx({ sampleRate: 24000 });
      if (outputAudioCtxRef.current.state === 'suspended') {
        await outputAudioCtxRef.current.resume();
      }

      // 2. Connect WebSocket to backend /live bridge
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/live`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = async () => {
        setIsConnected(true);
        setStatusMessage('Connected to Gemini 3.8 Live. Requesting microphone stream...');

        // 3. Request user microphone (16kHz)
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            audio: {
              channelCount: 1,
              sampleRate: 16000,
              echoCancellation: true,
              noiseSuppression: true,
            } 
          });
          streamRef.current = stream;

          inputAudioCtxRef.current = new AudioCtx({ sampleRate: 16000 });
          const source = inputAudioCtxRef.current.createMediaStreamSource(stream);
          const processor = inputAudioCtxRef.current.createScriptProcessor(4096, 1, 1);
          scriptProcessorRef.current = processor;

          processor.onaudioprocess = (e) => {
            if (isMuted) return;
            const inputData = e.inputBuffer.getChannelData(0);
            
            // Check speech energy for visualizer
            let sum = 0;
            for (let i = 0; i < inputData.length; i++) {
              sum += inputData[i] * inputData[i];
            }
            const rms = Math.sqrt(sum / inputData.length);
            if (rms > 0.01) {
              setActiveAudioVisual(Math.min(100, Math.floor(rms * 400)));
            }

            const base64Pcm = pcmToBase64(inputData);
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ audio: base64Pcm }));
            }
          };

          source.connect(processor);
          processor.connect(inputAudioCtxRef.current.destination);

          setIsRecording(true);
          setStatusMessage('Live Audio Streaming Active · Speak freely with Gemini 3.8 Live');
        } catch (micErr: any) {
          console.error('Microphone error:', micErr);
          setStatusMessage('Microphone access unavailable. You can still type prompts via text input.');
          setErrorMessage(`Microphone access denied: ${micErr.message || 'Check permissions'}`);
        }
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.error) {
            setErrorMessage(msg.error);
            setStatusMessage('Error received from Live API');
          }

          if (msg.audio && outputAudioCtxRef.current) {
            playAudioChunk(outputAudioCtxRef.current, msg.audio);
          }

          if (msg.text) {
            setConversation((prev) => {
              const last = prev[prev.length - 1];
              if (last && last.sender === 'assistant' && prev.length > 1) {
                return [
                  ...prev.slice(0, -1),
                  { ...last, text: last.text + ' ' + msg.text }
                ];
              } else {
                return [
                  ...prev,
                  {
                    sender: 'assistant',
                    text: msg.text,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  }
                ];
              }
            });
          }

          if (msg.interrupted) {
            // User spoke over AI
            setStatusMessage('Interruption detected: Listening to your voice...');
          }
        } catch (err) {
          console.error('WS message parse error:', err);
        }
      };

      ws.onerror = (e) => {
        console.error('WebSocket error:', e);
        setErrorMessage('WebSocket connection error with Live API server.');
      };

      ws.onclose = () => {
        setIsConnected(false);
        setIsRecording(false);
        setStatusMessage('Live session ended.');
      };
    } catch (err: any) {
      console.error('Failed to initiate live session:', err);
      setErrorMessage(err.message || 'Session start failed');
      setIsConnected(false);
    }
  };

  const stopVoiceSession = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current = null;
    }
    if (inputAudioCtxRef.current) {
      inputAudioCtxRef.current.close();
      inputAudioCtxRef.current = null;
    }
    if (outputAudioCtxRef.current) {
      outputAudioCtxRef.current.close();
      outputAudioCtxRef.current = null;
    }

    setIsConnected(false);
    setIsRecording(false);
    setActiveAudioVisual(0);
    setStatusMessage('Voice session stopped.');
  };

  const handleSendTextMessage = () => {
    if (!textInput.trim()) return;
    const userText = textInput.trim();
    setTextInput('');

    // Append to conversation
    setConversation((prev) => [
      ...prev,
      {
        sender: 'user',
        text: userText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    // Send through WebSocket if open, else instruct to start session
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ text: userText }));
    } else {
      // Simulate direct reply if websocket not currently active
      setTimeout(() => {
        setConversation((prev) => [
          ...prev,
          {
            sender: 'assistant',
            text: `[Gemini 3.8 Live]: Regarding "${userText}" - Please connect the live session using "Start Live Conversation" above to stream voice bidirectionally. Therapeutic alignment requires progressive cervical extension and diaphragmatic pacing.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }, 500);
    }
  };

  // Save session to Firestore under user profile
  const handleSaveToFirestore = async () => {
    if (!currentUser) return;
    try {
      const sessionId = `live-${Date.now()}`;
      await setDoc(doc(db, 'users', currentUser.uid, 'voiceSessions', sessionId), {
        sessionId,
        userId: currentUser.uid,
        startedAt: new Date().toISOString(),
        durationSeconds: sessionDuration,
        messageCount: conversation.length,
        transcriptSummary: conversation.map(c => `${c.sender}: ${c.text}`).join('\n'),
        modelUsed: 'gemini-3.8-live'
      });
      setIsSavedToCloud(true);
      setTimeout(() => setIsSavedToCloud(false), 3000);
    } catch (err) {
      console.error('Firestore save error:', err);
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-teal-400 mb-2">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>MODEL: GEMINI-3.8-LIVE (LIVE API)</span>
            <span aria-hidden="true">·</span>
            <span>BIDIRECTIONAL LOW-LATENCY AUDIO</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <span>Voice Conversations with Gemini 3.8 Live</span>
            {isConnected && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                LIVE CONNECTED
              </span>
            )}
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Have natural, low-latency spoken conversations with Gemini 3.8 Live. Discuss your somatic pain points, get real-time posture adjustments, and receive therapeutic guidance in audio.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {!isConnected ? (
            <button
              onClick={startVoiceSession}
              className="px-5 py-2.5 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-teal-500/20 flex items-center gap-2"
            >
              <Mic className="w-4 h-4" />
              <span>Start Live Conversation</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-2.5 rounded-xl border text-sm font-medium transition-colors ${
                  isMuted 
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/50' 
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
                title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
              >
                {isMuted ? <MicOff className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4 text-teal-400" />}
              </button>

              <button
                onClick={stopVoiceSession}
                className="px-4 py-2.5 bg-rose-500 hover:bg-rose-400 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-rose-500/20 flex items-center gap-2"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>Disconnect Call</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Status & Error Alerts */}
      {errorMessage && (
        <div className="p-3.5 bg-rose-950/40 border border-rose-500/50 rounded-xl text-xs text-rose-300 flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {isSavedToCloud && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Session transcript and metadata saved to Firestore user profile!</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Voice Radar & Soundwave Visualizer (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden flex flex-col items-center text-center shadow-xl">
            {/* Visualizer Aura Rings */}
            <div className="relative my-8 flex items-center justify-center w-48 h-48">
              <div 
                className={`absolute inset-0 rounded-full transition-all duration-300 ${
                  isConnected 
                    ? 'bg-teal-500/20 border border-teal-500/40' 
                    : 'bg-slate-800/40 border border-slate-800'
                }`}
                style={{
                  transform: `scale(${1 + activeAudioVisual / 120})`,
                }}
              />
              <div 
                className={`absolute w-36 h-36 rounded-full transition-all duration-200 ${
                  isConnected 
                    ? 'bg-cyan-500/30 border border-cyan-400/50' 
                    : 'bg-slate-800/60'
                }`}
                style={{
                  transform: `scale(${1 + activeAudioVisual / 200})`,
                }}
              />
              <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all z-10 ${
                isConnected 
                  ? 'bg-teal-400 text-slate-950 shadow-2xl shadow-teal-500/50' 
                  : 'bg-slate-800 text-slate-500 border border-slate-700'
              }`}>
                {isConnected ? (
                  <Activity className="w-10 h-10 animate-pulse" />
                ) : (
                  <MicOff className="w-8 h-8" />
                )}
              </div>
            </div>

            {/* Status Readouts */}
            <h3 className="text-lg font-bold text-white mb-1">
              {isConnected ? 'Gemini 3.8 Live Active' : 'Voice Agent Offline'}
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mb-4">
              {statusMessage}
            </p>

            {/* Session Stats */}
            <div className="w-full grid grid-cols-3 gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-500 block">CALL TIME</span>
                <span className="text-teal-400 font-bold">{formatSeconds(sessionDuration)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">MODEL</span>
                <span className="text-slate-300">gemini-3.8-live</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">INPUT RATE</span>
                <span className="text-slate-300">16kHz PCM</span>
              </div>
            </div>

            {/* Cloud Archival Action */}
            {isAuthenticated && (
              <button
                onClick={handleSaveToFirestore}
                disabled={conversation.length <= 1}
                className="mt-4 w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Save className="w-3.5 h-3.5 text-teal-400" />
                <span>Save Consultation to Firestore Profile</span>
              </button>
            )}
          </div>

          {/* Quick Voice Prompt Suggestions */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block font-semibold">
              SAMPLE SPOKEN QUERIES:
            </span>
            <div className="space-y-2">
              {[
                'Doctor, I have cervical stiffness after sitting for 6 hours. What yoga decompresses C5-C7?',
                'Explain how Bhramari humming breath raises vagal tone and lowers cytokine inflammation.',
                'What is the Hartree ground-state energy of my lumbar spine, and which foods replenish disc collagen?',
                'Guide me through a 3-minute breath protocol for acute tension headache relief.'
              ].map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setTextInput(sample);
                  }}
                  className="w-full text-left p-2.5 bg-slate-950/60 hover:bg-slate-800/80 rounded-lg text-xs text-slate-300 hover:text-white border border-slate-800 transition-colors flex items-start gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{sample}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Transcript & Interaction Log (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col h-[650px] shadow-xl">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-teal-400" />
              <h3 className="text-sm font-bold text-white tracking-tight">
                Live Voice Dialogue & Transcript Stream
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              {conversation.length} TURNS RECORDED
            </span>
          </div>

          {/* Transcript Feed */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {conversation.map((turn, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${turn.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 mb-1 px-1">
                  <span>{turn.sender === 'user' ? 'Patient' : 'Gemini 3.8 Live Doctor'}</span>
                  <span>·</span>
                  <span>{turn.timestamp}</span>
                </div>
                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                    turn.sender === 'user'
                      ? 'bg-teal-500 text-slate-950 font-medium rounded-tr-none shadow-md shadow-teal-500/20'
                      : 'bg-slate-950/90 text-slate-200 border border-slate-800 rounded-tl-none shadow-inner'
                  }`}
                >
                  {turn.text}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Hybrid Text Box */}
          <div className="pt-4 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendTextMessage()}
              placeholder="Or type a question to send directly to Gemini 3.8 Live..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
            />
            <button
              onClick={handleSendTextMessage}
              className="p-2.5 bg-teal-400 hover:bg-teal-300 text-slate-950 rounded-xl font-bold transition-colors"
              title="Send to Live session"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
