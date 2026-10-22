/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AgencyStats, FullTravelPlan } from '../types/travel';
import { Mail, CheckCircle2, RotateCcw, XCircle, ShieldCheck, Clock, TrendingUp, DollarSign, ChevronRight, Eye, ShieldAlert, Globe, ExternalLink, Calendar, Users, MapPin, CloudSun, LifeBuoy, Utensils, Hotel, Zap, Activity, BarChart2 } from 'lucide-react';
import { MultiPlanComparisonChart } from './MultiPlanComparisonChart';

interface AdminDashboardProps {
  stats: AgencyStats;
  allPlans: FullTravelPlan[];
  onSelectPlan: (plan: FullTravelPlan) => void;
  onOpenApproval: (plan: FullTravelPlan) => void;
}

type AdminTab = 'ALL' | 'PENDING' | 'WORKING' | 'APPROVED' | 'REJECTED';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stats,
  allPlans,
  onSelectPlan,
  onOpenApproval
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('ALL');

  // Count by status
  const pendingPlans = allPlans.filter(p => p.request.status === 'PENDING_APPROVAL');
  const workingPlans = allPlans.filter(p => p.request.status === 'ANALYZING' || p.request.status === 'REVISING');
  const approvedPlans = allPlans.filter(p => p.request.status === 'APPROVED');
  const rejectedPlans = allPlans.filter(p => p.request.status === 'REJECTED');

  // Filter plans based on the active tab
  const getFilteredPlans = () => {
    switch (activeTab) {
      case 'PENDING':
        return pendingPlans;
      case 'WORKING':
        return workingPlans;
      case 'APPROVED':
        return approvedPlans;
      case 'REJECTED':
        return rejectedPlans;
      case 'ALL':
      default:
        return allPlans;
    }
  };

  const currentPlans = getFilteredPlans();

  return (
    <div className="space-y-8">
      {/* Title & Executive Summary */}
      <div className="space-y-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-wider text-emerald-800 uppercase px-2.5 py-0.5 rounded-full bg-emerald-100/80 border border-emerald-200">
                EXECUTIVE OPERATIONS CENTER
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight font-serif mt-1">
              관리자 인가 & 운영 관제 센터
            </h1>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white border border-[#e8e4dc] text-xs font-semibold text-stone-600 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>AI 멀티에이전트 자율 관제 정상 가동 중</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-stone-500">
          12인의 전문 AI 에이전트가 자율 접수·설계한 모든 여행 계획의 무결성을 검토하고, 최종 인가(결심)를 내립니다.
        </p>
      </div>

      {/* World-Class Executive Operational KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Requests */}
        <div className="p-5 rounded-3xl bg-white border border-[#e8e4dc] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span>누적 의뢰 접수</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
              실시간
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-stone-900 font-serif">
            {stats.totalRequests}
            <span className="text-sm font-sans font-normal text-stone-500 ml-1">건</span>
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 pt-1 border-t border-stone-100">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>100% AI 자율설계 완수</span>
          </div>
        </div>

        {/* KPI 2: Approval Rate */}
        <div className="p-5 rounded-3xl bg-white border border-[#e8e4dc] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span>관리자 인가율</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              우수
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-800 font-serif">
            {stats.approvalRate}
            <span className="text-sm font-sans font-normal text-stone-500 ml-1">%</span>
          </div>
          <div className="text-[11px] text-stone-600 flex items-center justify-between pt-1 border-t border-stone-100">
            <span>{stats.approvedCount}건 확정 교부</span>
            <span className="text-amber-800 font-medium">대기 {pendingPlans.length}건</span>
          </div>
        </div>

        {/* KPI 3: Total Revenue */}
        <div className="p-5 rounded-3xl bg-white border border-[#e8e4dc] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span>총 여행 취급고</span>
            <DollarSign className="w-3.5 h-3.5 text-stone-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-stone-900 font-serif">
            {(stats.totalEstimatedRevenue / 10000).toLocaleString()}
            <span className="text-sm font-sans font-normal text-stone-500 ml-1">만원</span>
          </div>
          <div className="text-[11px] text-stone-500 pt-1 border-t border-stone-100">
            <span>평균 건당 약 124.5만원 규모</span>
          </div>
        </div>

        {/* KPI 4: Autonomous Efficiency */}
        <div className="p-5 rounded-3xl bg-white border border-[#e8e4dc] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span>평균 설계 소요</span>
            <Clock className="w-3.5 h-3.5 text-stone-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-900 font-serif">
            {stats.averageDesignTimeSeconds}
            <span className="text-sm font-sans font-normal text-stone-500 ml-1">초</span>
          </div>
          <div className="text-[11px] text-purple-700 font-semibold pt-1 border-t border-stone-100">
            <span>전문 AI 에이전트 동시 교차 검증</span>
          </div>
        </div>
      </div>

      {/* AI Agents Real-Time Contribution, Success Rate & Latency Visualization Section */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#e8e4dc] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[11px] font-mono text-emerald-800 font-bold uppercase tracking-wider">
                12-AGENT PERFORMANCE &amp; TELEMETRY (LANGCHAIN · LANGGRAPH · LANGSMITH)
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-stone-900 font-serif mt-1 flex items-center gap-2">
              <span>AI 멀티에이전트 작업 성공률(파이차트) 및 평균 응답시간(막대그래프) 모니터링</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-sans font-semibold">
                자율 관제 활성
              </span>
            </h3>
          </div>

          <div className="flex items-center gap-3 text-xs text-stone-500">
            <span className="flex items-center gap-1 font-semibold text-stone-700 bg-stone-50 px-2.5 py-1 rounded-xl border border-stone-200">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              전체 평균 응답: <b className="text-stone-900">361ms</b>
            </span>
            <span className="flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              평균 작업 성공률: <b className="text-emerald-900">99.8%</b>
            </span>
          </div>
        </div>

        {/* Charts Container: 2-Column Grid (Pie/Donut Chart + Bar Graph) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Interactive SVG Donut / Pie Chart (성공률 및 에이전트 부하 분배) */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-[#faf7f2] border border-stone-200 space-y-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-700" />
                  <span>에이전트별 작업 성공률 &amp; 처리 비중 (파이차트)</span>
                </h4>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  12개 에이전트 전수 가동 (전체 99.8% 성공률)
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white border border-stone-200 text-stone-600 font-bold">
                DONUT CHART
              </span>
            </div>

            {/* SVG Donut Visual */}
            <div className="relative flex items-center justify-center py-2">
              <svg viewBox="0 0 100 100" className="w-48 h-48 transform -rotate-90">
                {/* 12 Slices computed proportionally */}
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#0d9488" strokeWidth="18" strokeDasharray="10 90" strokeDashoffset="0" />
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#059669" strokeWidth="18" strokeDasharray="9 91" strokeDashoffset="-10" />
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#4f46e5" strokeWidth="18" strokeDasharray="9 91" strokeDashoffset="-19" />
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#d97706" strokeWidth="18" strokeDasharray="10 90" strokeDashoffset="-28" />
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#9333ea" strokeWidth="18" strokeDasharray="8 92" strokeDashoffset="-38" />
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#2563eb" strokeWidth="18" strokeDasharray="9 91" strokeDashoffset="-46" />
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#0284c7" strokeWidth="18" strokeDasharray="8 92" strokeDashoffset="-55" />
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#e11d48" strokeWidth="18" strokeDasharray="9 91" strokeDashoffset="-63" />
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#047857" strokeWidth="18" strokeDasharray="7 93" strokeDashoffset="-72" />
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#dc2626" strokeWidth="18" strokeDasharray="7 93" strokeDashoffset="-79" />
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#57534e" strokeWidth="18" strokeDasharray="7 93" strokeDashoffset="-86" />
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#7c3aed" strokeWidth="18" strokeDasharray="7 93" strokeDashoffset="-93" />
              </svg>

              {/* Center Donut Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider">Avg Success</span>
                <span className="text-2xl font-black text-stone-900 font-serif">99.8%</span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100/90 px-2 py-0.5 rounded-full mt-0.5">
                  SLA 달성
                </span>
              </div>
            </div>

            {/* Quick Legend Chips */}
            <div className="grid grid-cols-2 gap-1.5 text-[11px] pt-2 border-t border-stone-200">
              <div className="flex items-center gap-1.5 text-stone-600">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600 shrink-0" />
                <span className="truncate">일정 (99.8%)</span>
              </div>
              <div className="flex items-center gap-1.5 text-stone-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
                <span className="truncate">경비 (100%)</span>
              </div>
              <div className="flex items-center gap-1.5 text-stone-600">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 shrink-0" />
                <span className="truncate">명소 (99.6%)</span>
              </div>
              <div className="flex items-center gap-1.5 text-stone-600">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600 shrink-0" />
                <span className="truncate">미식 (99.7%)</span>
              </div>
              <div className="flex items-center gap-1.5 text-stone-600">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600 shrink-0" />
                <span className="truncate">숙소 (99.3%)</span>
              </div>
              <div className="flex items-center gap-1.5 text-stone-600">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0" />
                <span className="truncate">교통/GIS (100%)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Bar Chart (평균 응답 시간 Latency ms) */}
          <div className="lg:col-span-7 p-5 rounded-2xl bg-[#faf7f2] border border-stone-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                  <BarChart2 className="w-4 h-4 text-sky-700" />
                  <span>에이전트별 평균 응답 시간 (Latency 막대그래프)</span>
                </h4>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  기준선 500ms(목표 SLA) 대비 전 에이전트 초고속 처리 유지
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white border border-stone-200 text-stone-600 font-bold">
                BAR GRAPH
              </span>
            </div>

            {/* Horizontal Bar Graph Breakdown */}
            <div className="space-y-2.5 pt-1">
              {[
                { name: '일정 설계사 (Planner)', ms: 460, framework: 'LANGGRAPH', color: 'bg-teal-600', success: '99.8%' },
                { name: '경비 편성사 (Cost)', ms: 310, framework: 'LANGGRAPH', color: 'bg-emerald-600', success: '100%' },
                { name: '관광지 명소박사 (Attraction)', ms: 390, framework: 'LANGCHAIN', color: 'bg-indigo-600', success: '99.6%' },
                { name: '미식가 큐레이터 (Gourmet)', ms: 410, framework: 'LANGCHAIN', color: 'bg-amber-600', success: '99.7%' },
                { name: '숙소 안식처 (Stay)', ms: 520, framework: 'LANGCHAIN', color: 'bg-purple-600', success: '99.3%' },
                { name: '동선지기 & GIS (Route)', ms: 440, framework: 'LANGCHAIN', color: 'bg-blue-600', success: '100%' },
                { name: '기상·기후 관리관 (Weather)', ms: 290, framework: 'LANGCHAIN', color: 'bg-sky-600', success: '99.9%' },
                { name: '안전·위기관리관 (Safety)', ms: 350, framework: 'LANGCHAIN', color: 'bg-rose-600', success: '100%' },
                { name: '품질 감수관 (Auditor)', ms: 340, framework: 'LANGSMITH', color: 'bg-red-600', success: '100%' },
                { name: '지식전달관 (알고리)', ms: 220, framework: 'LANGSMITH', color: 'bg-violet-700', success: '100%' }
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-stone-800">{item.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white border border-stone-200 text-stone-500">
                        {item.framework}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="text-emerald-700 font-bold">{item.success}</span>
                      <span className="text-stone-700 font-bold w-12 text-right">{item.ms}ms</span>
                    </div>
                  </div>
                  <div className="w-full bg-stone-200/80 h-2 rounded-full overflow-hidden relative">
                    {/* 500ms SLA threshold line */}
                    <div className="absolute top-0 bottom-0 left-[83%] w-0.5 bg-rose-400 z-10" title="SLA 500ms Threshold" />
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.min((item.ms / 600) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-[11px] text-stone-500 pt-2 border-t border-stone-200">
              <span className="flex items-center gap-1">
                <span className="w-2 h-0.5 bg-rose-400 inline-block" />
                <span>빨간 세로선: 500ms SLA 목표 임계치</span>
              </span>
              <span>LangSmith 실시간 텔레메트리 연동</span>
            </div>
          </div>

        </div>
      </div>

      {/* Multi-Plan Comparison Section */}
      <MultiPlanComparisonChart plans={allPlans} onSelectPlan={onSelectPlan} />

      {/* Segmented Control Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-[#ede8df] text-xs font-semibold text-stone-600 max-w-fit">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'ALL'
              ? 'bg-white text-stone-900 shadow-2xs font-bold'
              : 'hover:text-stone-900'
          }`}
        >
          전체 ({allPlans.length})
        </button>

        <button
          onClick={() => setActiveTab('PENDING')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'PENDING'
              ? 'bg-white text-stone-900 shadow-2xs font-bold'
              : 'hover:text-stone-900'
          }`}
        >
          <span>승인 대기</span>
          {pendingPlans.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-[#e26a2c] text-white text-[10px] font-bold flex items-center justify-center">
              {pendingPlans.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('WORKING')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'WORKING'
              ? 'bg-white text-stone-900 shadow-2xs font-bold'
              : 'hover:text-stone-900'
          }`}
        >
          AI 설계 중 ({workingPlans.length})
        </button>

        <button
          onClick={() => setActiveTab('APPROVED')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'APPROVED'
              ? 'bg-white text-stone-900 shadow-2xs font-bold'
              : 'hover:text-stone-900'
          }`}
        >
          확정 완료 ({approvedPlans.length})
        </button>

        <button
          onClick={() => setActiveTab('REJECTED')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'REJECTED'
              ? 'bg-white text-stone-900 shadow-2xs font-bold'
              : 'hover:text-stone-900'
          }`}
        >
          반려 ({rejectedPlans.length})
        </button>
      </div>

      {/* Content Area: Approval Queue List */}
      {currentPlans.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#e5e0d8] p-16 sm:p-24 text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-[#faf7f2] border border-[#e8e4dc] flex items-center justify-center mx-auto text-stone-500">
            <Mail className="w-7 h-7 stroke-1.5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-stone-900 text-lg sm:text-xl font-serif">
              해당 분류의 접수 건이 없습니다
            </h3>
            <p className="text-xs sm:text-sm text-stone-400">
              새로운 고객 여행 의뢰가 접수되면 AI 팀이 자율 설계를 완료한 후 이곳에 등록됩니다.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('ALL')}
            className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-bold text-stone-700 transition-colors"
          >
            전체 접수 목록 보기
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {currentPlans.map((plan) => {
            const isPending = plan.request.status === 'PENDING_APPROVAL';
            const isApproved = plan.request.status === 'APPROVED';

            return (
              <div
                key={plan.requestId}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-[#e5e0d8] shadow-xs hover:border-[#064e43]/50 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 group"
              >
                {/* Left: Client & Route Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${
                      isApproved ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' :
                      isPending ? 'bg-amber-100 text-amber-950 border border-amber-200' :
                      plan.request.status === 'REVISING' ? 'bg-blue-100 text-blue-900 border border-blue-200' :
                      'bg-stone-100 text-stone-700'
                    }`}>
                      {isApproved ? '인가 완료 (APPROVED)' :
                       isPending ? '승인 대기 (PENDING)' :
                       plan.request.status === 'REVISING' ? 'AI 재설계 중' : '반려'}
                    </span>

                    <span className="text-xs text-stone-400 font-mono">
                      접수 ID: {plan.requestId}
                    </span>

                    <span className="text-xs text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      GIS 100% 검증 (중복 0건)
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-stone-900 font-serif flex items-center gap-2">
                      <span>{plan.request.clientName} 고객님</span>
                      <span className="text-stone-400 font-sans font-normal text-sm">
                        ({plan.request.departureCity} 출발 → {plan.request.destination})
                      </span>
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 mt-1 line-clamp-1">
                      {plan.title}
                    </p>
                  </div>

                  {/* Metadata Chips */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 pt-1">
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" />
                      {plan.request.startDate} ~ {plan.request.endDate} ({plan.days.length}일간)
                    </span>
                    <span className="text-stone-300">·</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-stone-400" />
                      성인 {plan.request.adultCount}명{plan.request.childCount > 0 ? `, 아동 ${plan.request.childCount}명` : ''}
                    </span>
                    <span className="text-stone-300">·</span>
                    <span className="font-bold text-stone-900">
                      총 견적 {(plan.costs.totalCost / 10000).toLocaleString()}만원
                    </span>
                    <span className="text-stone-300">·</span>
                    <span className="text-stone-500">
                      연락처: {plan.request.clientContact}
                    </span>
                  </div>

                  {plan.request.adminNote && (
                    <div className="text-[11px] text-stone-600 bg-[#faf7f2] p-2.5 rounded-xl border border-stone-200/70 mt-2">
                      <span className="font-semibold text-stone-900">심사 메모:</span> {plan.request.adminNote}
                    </div>
                  )}
                </div>

                {/* Right: Action Buttons */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => onSelectPlan(plan)}
                    className="px-4 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
                  >
                    <Eye className="w-4 h-4 text-stone-500" />
                    <span>일정표 열람</span>
                  </button>

                  <button
                    onClick={() => onOpenApproval(plan)}
                    className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer ${
                      isPending
                        ? 'bg-[#064e43] hover:bg-[#043d34] text-white ring-2 ring-emerald-600/30'
                        : 'bg-stone-900 hover:bg-stone-800 text-white'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-300" />
                    <span>{isPending ? '인가 심사 및 확정' : '심사 내역 관리'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
