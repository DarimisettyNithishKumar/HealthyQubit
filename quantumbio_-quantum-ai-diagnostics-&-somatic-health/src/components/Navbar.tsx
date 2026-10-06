import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePatientHealth } from '../context/PatientHealthContext';
import { 
  Radio, 
  Globe, 
  Film, 
  Cloud, 
  CloudCheck, 
  LogOut, 
  LogIn, 
  User as UserIcon,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  FileText
} from 'lucide-react';

export type NavTab = 
  | 'textbook'
  | 'voice'
  | 'search'
  | 'video'
  | 'biomarkers'
  | 'radiology'
  | 'genomics'
  | 'telemetry'
  | 'diagnostics'
  | 'simulation'
  | 'energy'
  | 'profile';

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenQuickDiagnostic: () => void;
  onOpenConsultationReport?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onOpenQuickDiagnostic,
  onOpenConsultationReport,
}) => {
  const { currentUser, signIn, signOut, isAuthenticated } = useAuth();
  const { isCloudSynced } = usePatientHealth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignInClick = async () => {
    setIsSigningIn(true);
    try {
      await signIn();
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-3">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              onTabChange('textbook');
            }}
            className="text-lg font-bold tracking-tight text-white hover:text-teal-400 transition-colors whitespace-nowrap flex items-center gap-2"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
            <span>QuantumBio</span>
          </a>
          <span className="hidden xl:inline text-[10px] font-mono px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-teal-300">
            ENTERPRISE BIOMEDICAL SUITE
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-3 xl:gap-4 text-xs font-medium overflow-x-auto py-2">
          <button
            onClick={() => onTabChange('textbook')}
            className={`transition-colors hover:text-white whitespace-nowrap px-2 py-1 rounded ${
              activeTab === 'textbook' ? 'text-teal-400 font-bold bg-teal-950/40' : 'text-slate-400'
            }`}
          >
            3D Anatomy & Yogas
          </button>

          {/* Feature: Gemini 3.8 Live Voice */}
          <button
            onClick={() => onTabChange('voice')}
            className={`transition-colors hover:text-white whitespace-nowrap px-2.5 py-1 rounded flex items-center gap-1.5 ${
              activeTab === 'voice' 
                ? 'bg-teal-400 text-slate-950 font-bold shadow-sm' 
                : 'text-teal-300 bg-teal-950/40 hover:bg-teal-900/50 border border-teal-500/30'
            }`}
          >
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Live Voice AI</span>
          </button>

          {/* Feature: Google Search Grounding */}
          <button
            onClick={() => onTabChange('search')}
            className={`transition-colors hover:text-white whitespace-nowrap px-2.5 py-1 rounded flex items-center gap-1.5 ${
              activeTab === 'search' 
                ? 'bg-cyan-400 text-slate-950 font-bold shadow-sm' 
                : 'text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Search Grounding</span>
          </button>

          {/* Feature: Veo Video Generations */}
          <button
            onClick={() => onTabChange('video')}
            className={`transition-colors hover:text-white whitespace-nowrap px-2.5 py-1 rounded flex items-center gap-1.5 ${
              activeTab === 'video' 
                ? 'bg-rose-400 text-slate-950 font-bold shadow-sm' 
                : 'text-rose-300 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/30'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Veo Video Studio</span>
          </button>

          <button
            onClick={() => onTabChange('biomarkers')}
            className={`transition-colors hover:text-white whitespace-nowrap px-2 py-1 rounded ${
              activeTab === 'biomarkers' ? 'text-teal-400 font-bold bg-teal-950/40' : 'text-slate-400'
            }`}
          >
            Biomarkers
          </button>
          <button
            onClick={() => onTabChange('radiology')}
            className={`transition-colors hover:text-white whitespace-nowrap px-2 py-1 rounded ${
              activeTab === 'radiology' ? 'text-teal-400 font-bold bg-teal-950/40' : 'text-slate-400'
            }`}
          >
            Radiology
          </button>
          <button
            onClick={() => onTabChange('genomics')}
            className={`transition-colors hover:text-white whitespace-nowrap px-2 py-1 rounded ${
              activeTab === 'genomics' ? 'text-teal-400 font-bold bg-teal-950/40' : 'text-slate-400'
            }`}
          >
            Genomics
          </button>
          <button
            onClick={() => onTabChange('diagnostics')}
            className={`transition-colors hover:text-white whitespace-nowrap px-2 py-1 rounded ${
              activeTab === 'diagnostics' ? 'text-teal-400 font-bold bg-teal-950/40' : 'text-slate-400'
            }`}
          >
            Diagnostics
          </button>
          <button
            onClick={() => onTabChange('energy')}
            className={`transition-colors hover:text-white whitespace-nowrap px-2 py-1 rounded ${
              activeTab === 'energy' ? 'text-teal-400 font-bold bg-teal-950/40' : 'text-slate-400'
            }`}
          >
            Hartree
          </button>
          <button
            onClick={() => onTabChange('profile')}
            className={`transition-colors hover:text-white whitespace-nowrap px-2 py-1 rounded ${
              activeTab === 'profile' ? 'text-teal-400 font-bold bg-teal-950/40' : 'text-slate-400'
            }`}
          >
            Health Profile
          </button>
        </nav>

        {/* Zone 3: Firebase Auth & Cloud Status */}
        <div className="flex items-center gap-2.5">
          {isAuthenticated && currentUser ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors text-xs"
              >
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'User'}
                    className="w-6 h-6 rounded-full object-cover border border-teal-400"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-teal-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">
                    {currentUser.displayName?.[0] || 'U'}
                  </div>
                )}
                <span className="text-slate-200 font-medium max-w-[90px] truncate hidden sm:inline">
                  {currentUser.displayName?.split(' ')[0] || 'Patient'}
                </span>
                <span 
                  className={`w-2 h-2 rounded-full shrink-0 ${isCloudSynced ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-amber-400'}`} 
                  title={isCloudSynced ? 'Firestore Cloud Synced' : 'Syncing with Firestore'}
                />
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-3 space-y-2 z-50 text-xs animate-fadeIn">
                  <div className="pb-2 border-b border-slate-800">
                    <span className="font-semibold text-white block truncate">
                      {currentUser.displayName || 'Authenticated Patient'}
                    </span>
                    <span className="text-[11px] text-slate-400 truncate block">
                      {currentUser.email}
                    </span>
                    <div className="mt-1 flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>Firestore Cloud Active</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onTabChange('profile');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white flex items-center gap-2"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-teal-400" />
                    <span>View Health Records</span>
                  </button>

                  {onOpenConsultationReport && (
                    <button
                      onClick={() => {
                        onOpenConsultationReport();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-800 text-teal-300 hover:text-teal-200 flex items-center gap-2"
                    >
                      <FileText className="w-3.5 h-3.5 text-teal-400" />
                      <span>Download Consultation PDF</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      signOut();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-rose-950/40 text-rose-300 hover:text-rose-200 flex items-center gap-2 border-t border-slate-800 pt-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleSignInClick}
              disabled={isSigningIn}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-teal-400/60 rounded-xl text-xs font-medium flex items-center gap-2 transition-all shadow-sm"
              title="Sign in with Google using Firebase Authentication"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span className="hidden sm:inline">Google Sign-in</span>
              <span className="sm:hidden">Login</span>
            </button>
          )}

          {onOpenConsultationReport && (
            <button
              onClick={onOpenConsultationReport}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-teal-300 hover:text-white border border-teal-500/30 rounded-xl text-xs font-medium transition-colors"
              title="Download consultation PDF report of diagnostic history and therapy plan"
            >
              <FileText className="w-3.5 h-3.5 text-teal-400" />
              <span>Report PDF</span>
            </button>
          )}

          <button
            onClick={onOpenQuickDiagnostic}
            className="px-3 py-1.5 text-xs font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-xl transition-colors whitespace-nowrap shadow-sm font-mono"
          >
            Triage
          </button>
        </div>
      </div>

      {/* Mobile Horizontal Sub-Navigation Bar */}
      <div className="lg:hidden flex items-center gap-2 px-4 py-2 border-t border-slate-800 overflow-x-auto text-xs font-medium bg-slate-950/95 scrollbar-none">
        <button
          onClick={() => onTabChange('textbook')}
          className={`whitespace-nowrap px-2.5 py-1 rounded ${activeTab === 'textbook' ? 'bg-teal-400 text-slate-950 font-bold' : 'text-slate-400'}`}
        >
          3D Anatomy
        </button>
        <button
          onClick={() => onTabChange('voice')}
          className={`whitespace-nowrap px-2.5 py-1 rounded flex items-center gap-1 ${activeTab === 'voice' ? 'bg-teal-400 text-slate-950 font-bold' : 'text-teal-300 bg-teal-950/40'}`}
        >
          <Radio className="w-3 h-3" />
          <span>Live Voice</span>
        </button>
        <button
          onClick={() => onTabChange('search')}
          className={`whitespace-nowrap px-2.5 py-1 rounded flex items-center gap-1 ${activeTab === 'search' ? 'bg-cyan-400 text-slate-950 font-bold' : 'text-cyan-300 bg-cyan-950/40'}`}
        >
          <Globe className="w-3 h-3" />
          <span>Search Grounding</span>
        </button>
        <button
          onClick={() => onTabChange('video')}
          className={`whitespace-nowrap px-2.5 py-1 rounded flex items-center gap-1 ${activeTab === 'video' ? 'bg-rose-400 text-slate-950 font-bold' : 'text-rose-300 bg-rose-950/40'}`}
        >
          <Film className="w-3 h-3" />
          <span>Veo Video</span>
        </button>
        <button
          onClick={() => onTabChange('biomarkers')}
          className={`whitespace-nowrap px-2.5 py-1 rounded ${activeTab === 'biomarkers' ? 'bg-teal-400 text-slate-950 font-bold' : 'text-slate-400'}`}
        >
          Biomarkers
        </button>
        <button
          onClick={() => onTabChange('radiology')}
          className={`whitespace-nowrap px-2.5 py-1 rounded ${activeTab === 'radiology' ? 'bg-teal-400 text-slate-950 font-bold' : 'text-slate-400'}`}
        >
          Radiology
        </button>
        <button
          onClick={() => onTabChange('diagnostics')}
          className={`whitespace-nowrap px-2.5 py-1 rounded ${activeTab === 'diagnostics' ? 'bg-teal-400 text-slate-950 font-bold' : 'text-slate-400'}`}
        >
          Diagnostics
        </button>
        <button
          onClick={() => onTabChange('profile')}
          className={`whitespace-nowrap px-2.5 py-1 rounded ${activeTab === 'profile' ? 'bg-teal-400 text-slate-950 font-bold' : 'text-slate-400'}`}
        >
          Profile
        </button>
      </div>
    </header>
  );
};
