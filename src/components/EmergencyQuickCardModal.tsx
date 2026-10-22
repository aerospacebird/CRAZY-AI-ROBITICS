/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FullTravelPlan } from '../types/travel';
import { 
  X, PhoneCall, ShieldAlert, Car, MapPin, AlertTriangle, 
  Copy, Check, Building, HeartPulse, LifeBuoy 
} from 'lucide-react';

interface EmergencyQuickCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: FullTravelPlan;
}

export const EmergencyQuickCardModal: React.FC<EmergencyQuickCardModalProps> = ({
  isOpen,
  onClose,
  plan
}) => {
  const [copiedTarget, setCopiedTarget] = useState<string | null>(null);

  if (!isOpen) return null;

  const isJeju = plan.request.destination.includes('제주');
  const hospitalName = isJeju ? '제주대학교병원 권역응급의료센터' : '동국대학교 경주병원 권역응급센터';
  const hospitalPhone = isJeju ? '064-717-1114' : '054-770-8114';
  const hospitalAddress = isJeju ? '제주 제주시 아란13길 15' : '경북 경주시 동대로 87';

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTarget(label);
    setTimeout(() => setCopiedTarget(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-stone-200">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-rose-900 via-red-950 to-stone-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <LifeBuoy className="w-5 h-5 text-rose-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold tracking-tight">
                  비상 안심 포켓 & 택시 기사용 퀵카드
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-400 text-stone-950">
                  SOS SAFE
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-0.5">
                현장 이동 시 택시 기사님께 바로 보여주거나 긴급 상황 시 원터치로 연결하세요.
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
          
          {/* 1. Big Taxi Driver Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-amber-50 border-2 border-amber-300 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5 uppercase">
                <Car className="w-4 h-4 text-amber-700" />
                <span>🚕 택시 기사님께 보여드리는 화면 (숙소 / 목적지)</span>
              </span>
              <button
                onClick={() => copyToClipboard(
                  `기사님, ${plan.selectedAccommodation.name} (${plan.selectedAccommodation.address})로 가주세요.`,
                  'taxi'
                )}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-amber-950 hover:bg-amber-100 flex items-center gap-1 cursor-pointer"
              >
                {copiedTarget === 'taxi' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedTarget === 'taxi' ? '복사됨' : '문구 복사'}</span>
              </button>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-amber-200/80 space-y-1">
              <span className="text-xs text-stone-500 font-medium">목적지 (숙소):</span>
              <h4 className="text-xl sm:text-2xl font-black text-stone-900 leading-snug">
                {plan.selectedAccommodation.name}
              </h4>
              <p className="text-sm sm:text-base font-bold text-emerald-800 mt-1">
                📍 {plan.selectedAccommodation.address}
              </p>
              <div className="text-xs text-stone-600 pt-1 font-mono">
                유형: {plan.selectedAccommodation.type}
              </div>
            </div>

            <p className="text-[11px] text-amber-800 font-medium">
              💡 목적지 주소가 크게 적혀 있어, 스마트폰을 기사님께 그대로 보여주시면 내비게이션에 즉시 입력하실 수 있습니다.
            </p>
          </div>

          {/* 2. One-Touch Emergency Dial Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-rose-700" />
              <span>원터치 긴급 비상 연락망 (국번 없이 즉시 통화)</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <a
                href="tel:119"
                className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-950 flex flex-col items-center justify-center text-center transition-all group shadow-2xs"
              >
                <span className="text-xs font-bold text-rose-700">119 응급구조</span>
                <span className="text-lg font-black font-mono mt-0.5 group-hover:scale-105 transition-transform">119</span>
                <span className="text-[10px] text-stone-500 mt-0.5">화재·응급환자</span>
              </a>

              <a
                href="tel:112"
                className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-950 flex flex-col items-center justify-center text-center transition-all group shadow-2xs"
              >
                <span className="text-xs font-bold text-blue-700">112 경찰청</span>
                <span className="text-lg font-black font-mono mt-0.5 group-hover:scale-105 transition-transform">112</span>
                <span className="text-[10px] text-stone-500 mt-0.5">범죄·사건사고</span>
              </a>

              <a
                href="tel:1330"
                className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-950 flex flex-col items-center justify-center text-center transition-all group shadow-2xs"
              >
                <span className="text-xs font-bold text-emerald-700">1330 관광안내</span>
                <span className="text-lg font-black font-mono mt-0.5 group-hover:scale-105 transition-transform">1330</span>
                <span className="text-[10px] text-stone-500 mt-0.5">24시간 다국어통역</span>
              </a>

              <a
                href="tel:1339"
                className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 hover:bg-purple-100 text-purple-950 flex flex-col items-center justify-center text-center transition-all group shadow-2xs"
              >
                <span className="text-xs font-bold text-purple-700">1339 질병관리청</span>
                <span className="text-lg font-black font-mono mt-0.5 group-hover:scale-105 transition-transform">1339</span>
                <span className="text-[10px] text-stone-500 mt-0.5">야간의료상담</span>
              </a>
            </div>
          </div>

          {/* 3. Regional Emergency Medical Center Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <HeartPulse className="w-4 h-4 text-rose-600" />
                <span>현지 관할 권역응급의료센터 (24시 야간진료)</span>
              </span>
              <a
                href={`tel:${hospitalPhone}`}
                className="text-xs font-bold px-3 py-1 rounded-xl bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-1 shadow-2xs"
              >
                <PhoneCall className="w-3 h-3" />
                <span>병원 전화걸기</span>
              </a>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-stone-200">
              <div className="font-bold text-stone-900 text-sm">
                {hospitalName}
              </div>
              <div className="text-xs text-stone-600 mt-0.5">
                주소: {hospitalAddress}
              </div>
              <div className="text-xs text-emerald-800 font-mono mt-0.5 font-bold">
                대표전화: {hospitalPhone}
              </div>
            </div>
          </div>

          {/* 4. Client Travel Information Memo */}
          <div className="p-4 rounded-2xl bg-[#faf7f2] border border-[#e8e4dc] flex items-center justify-between text-xs">
            <div>
              <span className="text-stone-500">여행자:</span> <span className="font-bold text-stone-900">{plan.request.clientName}</span>
              <span className="mx-2 text-stone-300">|</span>
              <span className="text-stone-500">연락처:</span> <span className="font-mono text-stone-800">{plan.request.clientContact}</span>
            </div>
            <span className="font-bold text-emerald-800">
              상해보험 1억원 보장 자동 가입
            </span>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <div className="text-xs text-stone-500">
            데이터나 와이파이가 없어도 이 카드는 언제든 오프라인으로 열람 가능합니다.
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition-all ml-auto cursor-pointer"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
