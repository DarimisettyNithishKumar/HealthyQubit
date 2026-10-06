import React, { useState } from 'react';
import { MNC_PRESENTATION_SLIDES } from '../data/presentationSlides';
import { PresentationSlide } from '../types';
import { ChevronLeft, ChevronRight, MessageSquare, Play, Sparkles, Building2, Check, ArrowRight } from 'lucide-react';

interface MncPresentationDeckProps {
  onJumpToDemo: () => void;
}

export const MncPresentationDeck: React.FC<MncPresentationDeckProps> = ({ onJumpToDemo }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState<boolean>(true);

  const slide: PresentationSlide = MNC_PRESENTATION_SLIDES[currentSlideIndex];
  const totalSlides = MNC_PRESENTATION_SLIDES.length;

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : totalSlides - 1));
  };

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev < totalSlides - 1 ? prev + 1 : 0));
  };

  return (
    <section id="mnc-presentation" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-slate-800 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-teal-400 mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>MNC EXECUTIVE BRIEFING DECK</span>
            <span aria-hidden="true">·</span>
            <span>BOARD-LEVEL STRATEGY & CLINICAL ROI</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            MNC Corporate Presentation Suite
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Executive pitch deck designed for enterprise healthcare leadership, Chief Medical Officers, and Fortune 500 occupational health buyers.
          </p>
        </div>

        {/* Slide navigation controls */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            onClick={() => setShowSpeakerNotes(!showSpeakerNotes)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 border ${
              showSpeakerNotes
                ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Speaker Notes {showSpeakerNotes ? 'ON' : 'OFF'}</span>
          </button>

          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
            <button
              onClick={prevSlide}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono px-2 text-slate-300 tabular-nums">
              {String(currentSlideIndex + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
            </span>
            <button
              onClick={nextSlide}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Presentation Stage */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
        {/* Slide Ribbon */}
        <div className="px-6 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-teal-400">
            <span className="w-2 h-2 rounded-full bg-teal-400" />
            <span>SLIDE {slide.number}</span>
            <span aria-hidden="true" className="text-slate-600">|</span>
            <span className="text-slate-300">{slide.category}</span>
          </div>
          <span className="text-slate-400">EXECUTIVE ENTERPRISE PROPOSAL</span>
        </div>

        {/* Slide Content Body */}
        <div className="p-6 sm:p-10 space-y-8">
          {/* Slide Heading & Subheading */}
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight max-w-4xl">
              {slide.title}
            </h3>
            <p className="text-sm sm:text-base text-teal-400 font-medium mt-2">
              {slide.subtitle}
            </p>
          </div>

          {/* Grid: Metric Spotlight + Executive Narrative */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left Metric Spotlight (4 cols) */}
            <div className="lg:col-span-4 bg-slate-950/80 border border-teal-500/30 rounded-xl p-6 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono text-teal-400 uppercase tracking-wider block mb-2">
                  KEY IMPACT METRIC
                </span>
                <div className="text-5xl sm:text-6xl font-mono font-bold text-white tracking-tight tabular-nums">
                  {slide.keyMetric.value}
                </div>
                <div className="text-sm font-semibold text-teal-300 mt-2">
                  {slide.keyMetric.label}
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-4 pt-4 border-t border-slate-850 leading-relaxed">
                {slide.keyMetric.context}
              </p>
            </div>

            {/* Right Strategic Breakdown (8 cols) */}
            <div className="lg:col-span-8 bg-slate-950/40 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  EXECUTIVE SUMMARY
                </h4>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-5">
                  {slide.executiveSummary}
                </p>

                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
                  STRATEGIC HIGHLIGHTS
                </h4>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  {slide.bulletPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Collapsible Presenter Speaker Notes Drawer */}
          {showSpeakerNotes && (
            <div className="p-4 bg-teal-950/20 border border-teal-500/30 rounded-xl text-xs">
              <div className="flex items-center gap-1.5 text-teal-300 font-semibold mb-1 font-mono uppercase">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>SPEAKER NOTES / PRESENTATION TALKING POINTS:</span>
              </div>
              <p className="text-slate-300 italic leading-relaxed">
                "{slide.speakerNotes}"
              </p>
            </div>
          )}

          {/* Slide Navigation Footbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-slate-800">
            {/* Slide thumbnails / indicators */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {MNC_PRESENTATION_SLIDES.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`px-3 py-1.5 text-xs font-mono rounded transition-colors whitespace-nowrap ${
                    currentSlideIndex === idx
                      ? 'bg-teal-400 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {s.number} · {s.category.split(' ')[0]}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={onJumpToDemo}
                className="px-4 py-2 bg-teal-400 hover:bg-teal-300 text-slate-950 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow"
              >
                <span>Launch Interactive MNC Demo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
