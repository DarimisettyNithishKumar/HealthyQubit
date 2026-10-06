import React, { useState, useRef } from 'react';
import { 
  Video, 
  Upload, 
  Sparkles, 
  Play, 
  Download, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  Film, 
  Maximize2, 
  RotateCw, 
  Image as ImageIcon,
  Clock,
  Save,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

interface VideoHistoryItem {
  id: string;
  videoUrl: string;
  prompt: string;
  aspectRatio: '16:9' | '9:16';
  date: string;
}

export const VeoAnatomicalVideoStudio: React.FC = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const [selectedImage, setSelectedImage] = useState<string | null>(
    '/src/assets/images/inner_neck_cervical_1791267517154.jpg'
  );
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [prompt, setPrompt] = useState<string>(
    'Cinematic 3D camera orbital rotation showcasing cervical spine decompression, intervertebral disc imbibition, and muscle fiber relaxation in slow motion.'
  );
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationPhase, setGenerationPhase] = useState<string>('');
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [videoHistory, setVideoHistory] = useState<VideoHistoryItem[]>([]);
  const [isSavedToCloud, setIsSavedToCloud] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Preset medical anatomical sample images for immediate convenience
  const PRESET_IMAGES = [
    {
      name: 'Cervical Spine C1-C7',
      url: '/src/assets/images/inner_neck_cervical_1791267517154.jpg',
      suggestedPrompt: 'Slow cinematic orbital 360 rotation around cervical vertebrae C1-C7 with subtle spinal decompression animation.'
    },
    {
      name: 'Thoracic Ribcage & Heart',
      url: '/src/assets/images/inner_chest_thoracic_1791267533816.jpg',
      suggestedPrompt: 'Animate pulmonary diaphragmatic expansion during 4-second therapeutic yogic inhalation.'
    },
    {
      name: 'Knee Meniscus & Ligaments',
      url: '/src/assets/images/inner_knee_meniscus_1791267610058.jpg',
      suggestedPrompt: 'Smooth flexion of the knee joint with fibrocartilage meniscal cushion load distribution in clinical 3D lighting.'
    },
    {
      name: 'Foot Plantar Fascia & Arch',
      url: '/src/assets/images/inner_foot_plantar_1791267623608.jpg',
      suggestedPrompt: 'Dynamic Windlass mechanism tension wave propagating along the plantar aponeurosis and Achilles tendon.'
    }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPEG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateVideo = async () => {
    if (!selectedImage) {
      setError('Please upload or select an anatomical photo first.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedVideoUrl(null);

    try {
      setGenerationPhase('Submitting image to Veo (veo-3.1-fast-generate-preview)...');

      // 1. Start generation operation
      const startRes = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImage,
          aspectRatio, // strictly '16:9' or '9:16'
          prompt,
          mimeType: selectedImage.startsWith('data:image/png') ? 'image/png' : 'image/jpeg',
        }),
      });

      const startData = await startRes.json();
      if (!startRes.ok || !startData.operationName) {
        throw new Error(startData.error || 'Failed to initialize video generation');
      }

      const operationName = startData.operationName;
      setGenerationPhase('Veo 3.1 synthesizing 3D optical vectors and physiological motion...');

      // 2. Poll for completion
      let isDone = false;
      let attempts = 0;
      const maxAttempts = 60; // 5 minutes max

      while (!isDone && attempts < maxAttempts) {
        attempts++;
        await new Promise((r) => setTimeout(r, 5000)); // poll every 5s

        if (attempts === 2) {
          setGenerationPhase('Analyzing somatic contours & deep myofascial layers...');
        } else if (attempts === 5) {
          setGenerationPhase('Rendering 720p HD frame sequence with Veo video generator...');
        } else if (attempts === 9) {
          setGenerationPhase('Finalizing temporal smoothing and H.264 compression...');
        }

        const pollRes = await fetch('/api/video-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operationName }),
        });

        const pollData = await pollRes.json();
        if (pollData.error) {
          throw new Error(pollData.error.message || 'Video generation failed on backend');
        }

        if (pollData.done) {
          isDone = true;
        }
      }

      if (!isDone) {
        throw new Error('Video generation timed out. Please try again.');
      }

      // 3. Download generated video stream
      setGenerationPhase('Streaming final MP4 video from server...');
      const downloadRes = await fetch('/api/video-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operationName }),
      });

      if (!downloadRes.ok) {
        throw new Error('Failed to retrieve finalized video stream');
      }

      const blob = await downloadRes.blob();
      const videoObjectUrl = URL.createObjectURL(blob);
      setGeneratedVideoUrl(videoObjectUrl);

      const newItem: VideoHistoryItem = {
        id: `vid-${Date.now()}`,
        videoUrl: videoObjectUrl,
        prompt,
        aspectRatio,
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setVideoHistory((prev) => [newItem, ...prev]);

      // Persist to Firestore if authenticated
      if (currentUser) {
        await setDoc(doc(db, 'users', currentUser.uid, 'videos', newItem.id), {
          videoId: newItem.id,
          userId: currentUser.uid,
          prompt,
          aspectRatio,
          createdAt: new Date().toISOString(),
          model: 'veo-3.1-fast-generate-preview'
        });
        setIsSavedToCloud(true);
        setTimeout(() => setIsSavedToCloud(false), 3000);
      }
    } catch (err: any) {
      console.error('Veo video generation error:', err);
      setError(err.message || 'Video generation encountered an error.');
    } finally {
      setIsGenerating(false);
      setGenerationPhase('');
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-teal-400 mb-2">
            <Film className="w-3.5 h-3.5 animate-pulse" />
            <span>MODEL: VEO-3.1-FAST-GENERATE-PREVIEW</span>
            <span aria-hidden="true">·</span>
            <span>IMAGE-TO-VIDEO CINEMATIC SYNTHESIS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <span>Animate Anatomical Photos with Veo</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Upload any medical photograph, cross-section, or clinical posture scan to generate high-definition animated biomedical videos using Veo 3.1 Fast with 16:9 landscape or 9:16 portrait aspect ratios.
          </p>
        </div>
      </div>

      {isSavedToCloud && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Veo video record synchronized to your Firestore user profile!</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-500/50 rounded-xl text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Source & Config Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Image Upload & Preview Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-teal-400 font-semibold uppercase">
                SOURCE ANATOMICAL IMAGE:
              </span>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-teal-400" />
                <span>Upload Custom Photo</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Selected Photo Frame */}
            <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-[16/9] flex items-center justify-center group shadow-inner">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Anatomical source"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-6 text-slate-500">
                  <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">Select or upload an image to animate</p>
                </div>
              )}
            </div>

            {/* Clinical Preset Pickers */}
            <div>
              <span className="text-[11px] font-mono text-slate-400 block mb-2">
                OR CHOOSE CLINICAL PRESET PLATE:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {PRESET_IMAGES.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedImage(preset.url);
                      setPrompt(preset.suggestedPrompt);
                    }}
                    className={`p-2 rounded-lg text-left border transition-all text-xs flex flex-col justify-between ${
                      selectedImage === preset.url
                        ? 'bg-teal-500/20 text-teal-300 border-teal-500/60 font-semibold shadow-sm'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span>{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Video Configuration Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <span className="text-xs font-mono text-slate-300 font-semibold uppercase block">
              VEO GENERATION SETTINGS:
            </span>

            {/* Aspect Ratio Switcher (Required: 16:9 or 9:16) */}
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1.5">
                ASPECT RATIO (MANDATORY):
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAspectRatio('16:9')}
                  className={`py-2 px-3 rounded-xl border text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-all ${
                    aspectRatio === '16:9'
                      ? 'bg-teal-400 text-slate-950 border-teal-300 shadow-md font-bold'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <span className="w-4 h-2.5 border border-current rounded-xs inline-block" />
                  <span>16:9 (Landscape)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAspectRatio('9:16')}
                  className={`py-2 px-3 rounded-xl border text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-all ${
                    aspectRatio === '9:16'
                      ? 'bg-teal-400 text-slate-950 border-teal-300 shadow-md font-bold'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <span className="w-2.5 h-4 border border-current rounded-xs inline-block" />
                  <span>9:16 (Portrait)</span>
                </button>
              </div>
            </div>

            {/* Animation Prompt */}
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1.5">
                ANIMATION MOTION PROMPT:
              </label>
              <textarea
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 resize-none leading-relaxed"
                placeholder="Describe camera motion, anatomical action, or tissue expansion..."
              />
            </div>

            {/* Launch Button */}
            <button
              onClick={handleGenerateVideo}
              disabled={isGenerating || !selectedImage}
              className="w-full py-3 bg-teal-400 hover:bg-teal-300 disabled:opacity-50 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Synthesizing Video with Veo...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Video with Veo 3.1</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Player & Generation Output (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-teal-400" />
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Veo 3.1 Video Player
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/40">
                VEO-3.1-FAST-GENERATE-PREVIEW
              </span>
            </div>

            {/* Video Canvas Container */}
            <div className={`relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center ${
              aspectRatio === '9:16' ? 'aspect-[9/16] max-h-[520px] mx-auto' : 'aspect-[16/9]'
            }`}>
              {isGenerating ? (
                <div className="p-8 text-center space-y-4">
                  <div className="relative w-16 h-16 mx-auto">
                    <span className="absolute inset-0 rounded-full border-4 border-teal-500/20 animate-ping" />
                    <span className="w-16 h-16 border-4 border-teal-400 border-t-transparent rounded-full animate-spin inline-block" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">
                      Veo Neural Synthesis in Progress
                    </h4>
                    <p className="text-xs text-teal-300 font-mono animate-pulse">
                      {generationPhase}
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Veo transforms static medical plates into cinematic 3D simulations. Video generation may take approximately 1-2 minutes.
                  </p>
                </div>
              ) : generatedVideoUrl ? (
                <video
                  src={generatedVideoUrl}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="p-12 text-center text-slate-500 space-y-2">
                  <Film className="w-10 h-10 mx-auto opacity-40 text-teal-400" />
                  <h4 className="text-xs font-semibold text-slate-400">
                    No Video Generated Yet
                  </h4>
                  <p className="text-[11px] max-w-sm mx-auto">
                    Configure your source image and aspect ratio on the left, then click "Generate Video with Veo 3.1" to render motion.
                  </p>
                </div>
              )}
            </div>

            {/* Player Toolbar */}
            {generatedVideoUrl && (
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800">
                <div className="text-xs text-slate-400 font-mono">
                  <span>FORMAT: 720p HD MP4 ({aspectRatio})</span>
                </div>
                <a
                  href={generatedVideoUrl}
                  download={`veo-anatomical-${Date.now()}.mp4`}
                  className="px-4 py-2 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download MP4 Video</span>
                </a>
              </div>
            )}
          </div>

          {/* History of Recent Videos */}
          {videoHistory.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block font-semibold">
                RECENT VEO ANIMATIONS ({videoHistory.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {videoHistory.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setGeneratedVideoUrl(item.videoUrl)}
                    className="p-3 bg-slate-950 hover:bg-slate-800/80 rounded-xl border border-slate-800 cursor-pointer transition-all space-y-2 group"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span className="text-teal-400 font-bold">{item.aspectRatio}</span>
                      <span>{item.date}</span>
                    </div>
                    <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed group-hover:text-teal-300">
                      {item.prompt}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
                      <Play className="w-3 h-3 text-teal-400" />
                      <span>Click to load in player</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
