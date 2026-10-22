/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TravelPlace } from '../types/travel';
import { getAlternativeSpotsForDestination, AlternativeOption } from '../services/alternativeSpotsData';
import { generateMapPushLinks } from '../services/mapIntegrationService';
import { 
  X, RefreshCw, ShieldCheck, MapPin, Sparkles, Check, 
  ExternalLink, AlertCircle, ArrowRight 
} from 'lucide-react';

interface InstantSpotSwapperModalProps {
  isOpen: boolean;
  onClose: () => void;
  destination: string;
  originalPlace: TravelPlace | null;
  dayNumber: number;
  onSwapPlace: (dayNumber: number, oldPlaceId: string, newPlace: TravelPlace) => void;
}

export const InstantSpotSwapperModal: React.FC<InstantSpotSwapperModalProps> = ({
  isOpen,
  onClose,
  destination,
  originalPlace,
  dayNumber,
  onSwapPlace
}) => {
  const [selectedOption, setSelectedOption] = useState<AlternativeOption | null>(null);

  if (!isOpen || !originalPlace) return null;

  const alternatives = getAlternativeSpotsForDestination(destination);

  const handleConfirmSwap = (option: AlternativeOption) => {
    // Preserve time slot of original place
    const updatedPlace: TravelPlace = {
      ...option.place,
      timeSlot: originalPlace.timeSlot,
      id: `swapped-${Date.now()}`
    };

    onSwapPlace(dayNumber, originalPlace.id, updatedPlace);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-stone-200">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <RefreshCw className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold tracking-tight">
                  돌발상황 대비 스마트 대체 장소 (Plan B) 교체기
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-400 text-stone-900">
                  즉시 스왑
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-0.5">
                우천, 긴 대기줄, 휴무일 등 돌발상황 시 검증된 대체 명소로 즉시 일정을 업데이트합니다.
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

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          
          {/* Current Target Place to be replaced */}
          <div className="p-4 sm:p-5 rounded-2xl bg-stone-100 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wide">
                현재 일정표 상의 교체 대상 장소 ({dayNumber}일차)
              </span>
              <h4 className="text-base sm:text-lg font-bold text-stone-900 mt-0.5 flex items-center gap-2">
                <span>{originalPlace.name}</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-stone-200 text-stone-700 font-mono">
                  {originalPlace.timeSlot}
                </span>
              </h4>
              <p className="text-xs text-stone-600 mt-1 line-clamp-1">
                {originalPlace.address} · {originalPlace.description}
              </p>
            </div>

            <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white border border-stone-300 text-stone-700 shrink-0 self-start sm:self-center">
              대체 후보지 중 하나를 선택하세요 ⬇️
            </div>
          </div>

          {/* Alternative Candidates */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>AI 추천 검증 대체 명소 3선 (지리적 동선 최적화)</span>
            </h4>

            <div className="grid grid-cols-1 gap-3.5">
              {alternatives.map((opt, idx) => {
                const pushLinks = generateMapPushLinks(
                  opt.place.name, 
                  opt.place.address, 
                  opt.place.lat, 
                  opt.place.lng
                );

                return (
                  <div
                    key={opt.place.id}
                    className="p-5 rounded-2xl border border-stone-200 hover:border-emerald-600 bg-white hover:bg-emerald-50/20 shadow-2xs transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${opt.reasonBadgeColor}`}>
                          {opt.reasonLabel}
                        </span>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                          {opt.place.categoryLabel}
                        </span>
                        <span className="text-xs text-emerald-800 font-semibold flex items-center gap-0.5">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          GIS 검증
                        </span>
                      </div>

                      <span className="text-xs font-mono font-bold text-stone-700">
                        예상 비용: {opt.place.estimatedCost.toLocaleString()}원
                      </span>
                    </div>

                    <div>
                      <h5 className="text-base font-bold text-stone-900 flex items-center gap-1.5">
                        <span>{opt.place.name}</span>
                      </h5>
                      <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                        {opt.place.description}
                      </p>
                      {opt.place.specialTip && (
                        <p className="text-xs text-emerald-900 bg-emerald-50/70 p-2 rounded-xl border border-emerald-200/60 mt-2">
                          💡 <span className="font-semibold">에이전트 팁:</span> {opt.place.specialTip}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-stone-100">
                      <div className="flex items-center gap-2">
                        <a
                          href={pushLinks.naverSearchUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[#03C75A] text-white hover:bg-[#02b350] transition-colors flex items-center gap-1"
                        >
                          <span>네이버 지도</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <a
                          href={pushLinks.googleSearchUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[#1a73e8] text-white hover:bg-[#1558b0] transition-colors flex items-center gap-1"
                        >
                          <span>구글 MAP</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleConfirmSwap(opt)}
                        className="px-4 py-2 rounded-xl bg-[#064e43] hover:bg-[#043d34] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>이 장소로 일정표 즉시 교체</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <div className="text-xs text-stone-500">
            교체 시 지도 PUSH 링크와 타임라인이 자동으로 즉각 갱신됩니다.
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition-all ml-auto cursor-pointer"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};
