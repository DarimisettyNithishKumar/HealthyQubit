import React, { useState } from 'react';
import { 
  Search, 
  Globe, 
  ExternalLink, 
  Sparkles, 
  BookOpen, 
  ShieldCheck, 
  Activity, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Save,
  ArrowRight,
  Database
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

interface GroundingChunk {
  web?: {
    title: string;
    uri: string;
  };
}

interface GroundingResult {
  text: string;
  source: string;
  webSearchQueries: string[];
  groundingChunks: GroundingChunk[];
}

export const BiomedicalSearchGrounding: React.FC<{ initialQuery?: string }> = ({ initialQuery = '' }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const [query, setQuery] = useState<string>(initialQuery || 'Cervical spine decompression and vagal tone in therapeutic yoga asanas');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<GroundingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedAlert, setSavedAlert] = useState<boolean>(false);

  const handleSearch = async (targetQuery?: string) => {
    const searchQuery = (targetQuery || query).trim();
    if (!searchQuery) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/search-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });

      const data = await res.json();
      if (!res.ok && data.error) {
        throw new Error(data.error);
      }

      setResult({
        text: data.text || 'Grounded research completed.',
        source: data.source || 'gemini-3.5-flash-grounded',
        webSearchQueries: data.webSearchQueries || [],
        groundingChunks: data.groundingChunks || [],
      });
    } catch (err: any) {
      console.error('Search grounding error:', err);
      setError(err.message || 'Failed to perform search grounding');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToCloud = async () => {
    if (!currentUser || !result) return;
    try {
      const recordId = `search-${Date.now()}`;
      await setDoc(doc(db, 'users', currentUser.uid, 'searches', recordId), {
        recordId,
        userId: currentUser.uid,
        query,
        summary: result.text,
        webSearchQueries: result.webSearchQueries,
        sources: result.groundingChunks.map(c => c.web?.title || 'Web Citation'),
        timestamp: new Date().toISOString(),
        model: 'gemini-3.5-flash',
      });
      setSavedAlert(true);
      setTimeout(() => setSavedAlert(false), 3000);
    } catch (err) {
      console.error('Failed to save search to Firestore:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-teal-400 mb-2">
            <Globe className="w-3.5 h-3.5 animate-pulse" />
            <span>MODEL: GEMINI-3.5-FLASH</span>
            <span aria-hidden="true">·</span>
            <span>GOOGLE SEARCH GROUNDING TOOL ENABLED</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <span>Biomedical Search Grounding & Clinical Citations</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Query real-time medical databases, PubMed clinical trials, and FDA updates using Gemini 3.5 Flash equipped with Google Search data grounding.
          </p>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search clinical topic, drug interaction, yoga biomechanics, or quantum biophysics..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
            />
          </div>
          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 bg-teal-400 hover:bg-teal-300 disabled:opacity-50 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-teal-500/20 flex items-center justify-center gap-2 shrink-0"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Grounding via Google Search...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Ground with Google Search</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-mono text-slate-500 mr-1">QUICK QUERIES:</span>
          {[
            'Cervical radiculopathy & yoga asana safety',
            'Curcumin vs NSAIDs in myofascial trigger points',
            'Hartree energy quantum biology DNA coherence',
            'Pranayama 1:1.5 ratio on vagal baroreflex power',
            'Meniscus tears: surgical repair vs targeted conservative therapy'
          ].map((pill, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(pill);
                handleSearch(pill);
              }}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
            >
              {pill}
            </button>
          ))}
        </div>
      </div>

      {savedAlert && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Search query and grounded citations saved to your Firestore profile!</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-500/50 rounded-xl text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Results Display */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Synthesized Analysis (8 cols) */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-400" />
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Grounded Biomedical Synthesis & Evidence Analysis
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/40">
                GEMINI-3.5-FLASH
              </span>
            </div>

            <div className="prose prose-invert prose-xs max-w-none text-slate-200 leading-relaxed space-y-3">
              {result.text.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="text-xs leading-relaxed text-slate-300">
                  {paragraph}
                </p>
              ))}
            </div>

            {isAuthenticated && (
              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  onClick={handleSaveToCloud}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <Save className="w-3.5 h-3.5 text-teal-400" />
                  <span>Save Record to Firestore</span>
                </button>
              </div>
            )}
          </div>

          {/* Grounding Metadata & Web Sources (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Executed Web Search Queries */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold uppercase">
                <Search className="w-3.5 h-3.5" />
                <span>GOOGLE SEARCH QUERIES EXECUTED:</span>
              </div>
              <div className="space-y-1.5">
                {result.webSearchQueries.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-2 bg-slate-950 rounded-lg border border-slate-800/80 text-[11px] font-mono text-slate-300 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>{q}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Citations & Source Web Links */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
              <div className="flex items-center gap-2 text-xs font-mono text-teal-400 font-semibold uppercase">
                <Globe className="w-3.5 h-3.5" />
                <span>GROUNDED WEB SOURCES & CITATIONS:</span>
              </div>
              <div className="space-y-2">
                {result.groundingChunks.length > 0 ? (
                  result.groundingChunks.map((chunk, idx) => {
                    const title = chunk.web?.title || `Clinical Web Reference #${idx + 1}`;
                    const uri = chunk.web?.uri || '#';
                    return (
                      <a
                        key={idx}
                        href={uri}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 bg-slate-950 hover:bg-slate-800/80 rounded-xl border border-slate-800 text-xs block transition-all group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-semibold text-slate-200 group-hover:text-teal-300 leading-snug">
                            {title}
                          </span>
                          <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-teal-400 shrink-0 mt-0.5" />
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 truncate block mt-1">
                          {uri}
                        </span>
                      </a>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-500 italic">No web links extracted.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
