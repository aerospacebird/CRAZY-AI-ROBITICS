/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { TravelPlace } from '../types/travel';
import { getAudioDocentForPlace, DocentScript } from '../services/audioDocentData';
import { 
  X, Volume2, Play, Pause, Square, Headphones, Camera, 
  Sparkles, RotateCcw, FastForward, CheckCircle2 
} from 'lucide-react';

interface AudioDocentPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  places: TravelPlace[];
  initialPlaceName?: string;
}

export const AudioDocentPlayerModal: React.FC<AudioDocentPlayerModalProps> = ({
  isOpen,
  onClose,
  places,
  initialPlaceName
}) => {
  // Candidate places that have good docent stories (attractions, natural spots, cultural sites)
  const availablePlaces = places.length > 0 ? places : [
    { id: 'p-1', name: '성산일출봉' } as TravelPlace,
    { id: 'p-2', name: '사려니숲길 (붉은오름 입구 코스)' } as TravelPlace,
    { id: 'p-3', name: '한담해안산책로' } as TravelPlace
  ];

  const [selectedPlaceName, setSelectedPlaceName] = useState<string>(
    initialPlaceName || availablePlaces[0]?.name || '성산일출봉'
  );

  const [currentDocent, setCurrentDocent] = useState<DocentScript>(
    getAudioDocentForPlace(selectedPlaceName)
  );

  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Check speech synthesis support on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    } else {
      setSpeechSupported(false);
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // When selected place changes, update docent & stop previous speech
  useEffect(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentDocent(getAudioDocentForPlace(selectedPlaceName));
  }, [selectedPlaceName]);

  // When modal closes, cancel speech
  useEffect(() => {
    if (!isOpen && synthRef.current) {
      synthRef.current.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Speech handlers
  const handlePlay = () => {
    if (!synthRef.current) return;

    if (isPaused) {
      synthRef.current.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(currentDocent.fullScript);
    utterance.lang = 'ko-KR';
    utterance.rate = playbackRate;
    utterance.pitch = 1.0;

    // Try finding Korean voice
    const voices = synthRef.current.getVoices();
    const koVoice = voices.find(v => v.lang.includes('ko') || v.lang.includes('KR'));
    if (koVoice) {
      utterance.voice = koVoice;
    }

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    if (synthRef.current && isPlaying) {
      synthRef.current.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackRate(speed);
    if (isPlaying && synthRef.current) {
      handleStop();
      setTimeout(handlePlay, 100);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-stone-200">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#064e43] via-teal-900 to-stone-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Headphones className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold tracking-tight">
                  스마트 명소 AI 음성 오디오 도슨트
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-400 text-stone-900">
                  현장 해설 가이드
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-0.5">
                현장 방문 시 이어폰을 꽂고 AI 도슨트의 생생한 역사·감성 해설을 들어보세요.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-stone-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Place Selector Pills */}
        <div className="px-5 py-3 bg-[#faf7f2] border-b border-[#e8e4dc] flex items-center gap-2 overflow-x-auto shrink-0">
          <span className="text-xs font-bold text-stone-500 shrink-0">명소 선택:</span>
          {availablePlaces.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedPlaceName(p.name)}
              className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 cursor-pointer ${
                selectedPlaceName === p.name
                  ? 'bg-[#064e43] text-white shadow-xs'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          
          {/* Audio Player Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950 via-stone-900 to-teal-950 text-white shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-emerald-300 tracking-wide uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{currentDocent.narratorName} · {currentDocent.voiceTone}</span>
                </span>
                <h4 className="text-xl sm:text-2xl font-bold font-serif mt-1">
                  {currentDocent.placeName}
                </h4>
                <p className="text-xs text-stone-300 mt-1">
                  {currentDocent.theme}
                </p>
              </div>

              <span className="text-xs font-mono px-3 py-1 rounded-full bg-white/10 border border-white/20 self-start sm:self-center">
                ⏱️ 소요시간: {currentDocent.durationText}
              </span>
            </div>

            {/* Audio Wave Visualizer Animation */}
            <div className="py-2 flex items-center justify-center gap-1.5 h-12 bg-black/20 rounded-2xl border border-white/10">
              {[40, 70, 30, 90, 60, 100, 45, 80, 55, 95, 35, 75, 50, 85, 65, 45, 90, 60].map((h, idx) => (
                <div
                  key={idx}
                  className={`w-1 rounded-full transition-all duration-300 ${
                    isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-stone-600'
                  }`}
                  style={{
                    height: isPlaying ? `${Math.max(15, (h * (idx % 2 === 0 ? 1 : 0.7)))}%` : '15%',
                    animationDelay: `${idx * 70}ms`
                  }}
                />
              ))}
            </div>

            {/* Control Bar: Play / Pause / Stop / Speed */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
              <div className="flex items-center gap-3">
                {!isPlaying ? (
                  <button
                    onClick={handlePlay}
                    className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer active:scale-95"
                  >
                    <Play className="w-4 h-4 fill-stone-950" />
                    <span>{isPaused ? '계속 듣기' : '오디오 도슨트 재생'}</span>
                  </button>
                ) : (
                  <button
                    onClick={handlePause}
                    className="px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer active:scale-95"
                  >
                    <Pause className="w-4 h-4 fill-stone-950" />
                    <span>일시 정지</span>
                  </button>
                )}

                <button
                  onClick={handleStop}
                  disabled={!isPlaying && !isPaused}
                  className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 disabled:opacity-40 text-white transition-all cursor-pointer"
                  title="처음부터 다시 정지"
                >
                  <Square className="w-4 h-4 fill-white" />
                </button>
              </div>

              {/* Playback speed selector */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-stone-400">재생 배속:</span>
                {[0.8, 1.0, 1.2].map(speed => (
                  <button
                    key={speed}
                    onClick={() => handleSpeedChange(speed)}
                    className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-all ${
                      playbackRate === speed
                        ? 'bg-white text-stone-900 shadow-xs'
                        : 'bg-white/10 text-stone-300 hover:bg-white/20'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Key Points & Photo Tip */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <h5 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>도슨트가 짚어주는 핵심 관전 포인트</span>
              </h5>
              <ul className="space-y-1.5 pt-1">
                {currentDocent.keyPoints.map((pt, idx) => (
                  <li key={idx} className="text-xs text-stone-700 flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-200 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
              <h5 className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-amber-700" />
                <span>도슨트 추천 인생 사진 앵글</span>
              </h5>
              <p className="text-xs text-stone-700 leading-relaxed pt-1">
                {currentDocent.photoTip}
              </p>
              <div className="text-[11px] text-amber-800 font-semibold bg-white/70 p-2 rounded-xl border border-amber-200/60 mt-2">
                📸 햇빛의 방향(순광/역광)과 주변 지형의 여백을 고려하여 촬영하시면 더욱 입체적인 사진을 얻으실 수 있습니다.
              </div>
            </div>
          </div>

          {/* Full Narration Script */}
          <div className="p-5 rounded-2xl bg-[#faf7f2] border border-[#e8e4dc] space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-[#064e43]" />
                <span>도슨트 음성 해설 전체 대본</span>
              </h5>
              <span className="text-[11px] text-stone-500 font-mono">
                {currentDocent.narratorName} 낭독
              </span>
            </div>

            <div className="text-xs text-stone-700 whitespace-pre-line leading-relaxed font-sans bg-white p-4 rounded-xl border border-stone-200/70 shadow-2xs">
              {currentDocent.fullScript}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <div className="text-xs text-stone-500 flex items-center gap-1.5">
            <Headphones className="w-4 h-4 text-emerald-700" />
            <span>현장에서 이어폰을 착용하시면 주변 소음 없이 또렷하게 감상하실 수 있습니다.</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition-all ml-auto cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
