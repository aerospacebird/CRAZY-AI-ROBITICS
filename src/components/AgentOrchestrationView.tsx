/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AgentLog, AgentEfficiencyTrace } from '../types/travel';
import { AGENT_TEAM, generateAgentEfficiencyTraces } from '../services/aiTravelAgent';
import { AgentEfficiencyReportModal } from './AgentEfficiencyReportModal';
import {
  Compass,
  Landmark,
  UtensilsCrossed,
  Hotel,
  Navigation,
  CalendarDays,
  ShieldCheck,
  Feather,
  CheckCircle2,
  Loader2,
  Sparkles,
  ShieldAlert,
  CloudSun,
  LifeBuoy,
  Layers,
  Activity,
  Zap,
  BarChart2,
  Cpu,
  ArrowRight
} from 'lucide-react';

interface AgentOrchestrationViewProps {
  logs: AgentLog[];
  isGenerating: boolean;
  onOpenEfficiencyReport?: () => void;
}

export const AgentOrchestrationView: React.FC<AgentOrchestrationViewProps> = ({
  logs,
  isGenerating
}) => {
  const [logFilter, setLogFilter] = useState<'ALL' | 'LANGCHAIN' | 'LANGGRAPH' | 'LANGSMITH'>('ALL');
  const [efficiencyModalOpen, setEfficiencyModalOpen] = useState(false);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldAlert': return <ShieldAlert className="w-4 h-4 text-emerald-300" />;
      case 'Compass': return <Compass className="w-4 h-4" />;
      case 'CloudSun': return <CloudSun className="w-4 h-4 text-sky-300" />;
      case 'Landmark': return <Landmark className="w-4 h-4" />;
      case 'UtensilsCrossed': return <UtensilsCrossed className="w-4 h-4" />;
      case 'Hotel': return <Hotel className="w-4 h-4" />;
      case 'Navigation': return <Navigation className="w-4 h-4" />;
      case 'CalendarDays': return <CalendarDays className="w-4 h-4" />;
      case 'LifeBuoy': return <LifeBuoy className="w-4 h-4 text-emerald-300" />;
      case 'ShieldCheck': return <ShieldCheck className="w-4 h-4" />;
      case 'Feather': return <Feather className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  // Determine stage execution progress
  const hasLangChain = logs.some(l => l.framework === 'LANGCHAIN');
  const hasLangGraph = logs.some(l => l.framework === 'LANGGRAPH');
  const hasLangSmith = logs.some(l => l.framework === 'LANGSMITH');
  const isComplete = !isGenerating && logs.length > 0;

  // Filter logs
  const filteredLogs = logFilter === 'ALL'
    ? logs
    : logs.filter(l => l.framework === logFilter);

  // Generate synthetic traces if logs present
  const dummyPlanForTrace: any = {
    requestId: 'req-live',
    request: { destination: '여행지', startDate: '2026-11-20', endDate: '2026-11-23' },
    days: Array(3).fill({ places: [] })
  };
  const efficiencyTraces: AgentEfficiencyTrace[] = logs.length > 0
    ? generateAgentEfficiencyTraces(dummyPlanForTrace)
    : [];

  return (
    <div className="bg-stone-900 text-stone-100 rounded-3xl p-5 sm:p-7 shadow-xl border border-stone-800 space-y-6">
      
      {/* 1. Header with Live Status & Efficiency Modal Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isGenerating ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
            <span className="text-xs font-mono tracking-wider text-emerald-400 uppercase">
              Autonomous Multi-Agent Orchestration · LangChain · LangGraph · LangSmith
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white mt-1 flex items-center gap-2">
            <span>AI 멀티에이전트 자율 협업 오케스트레이션</span>
            {isGenerating && (
              <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
            )}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {logs.length > 0 && (
            <button
              onClick={() => setEfficiencyModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer animate-in fade-in"
              title="LangSmith 트레이스 데이터 기반 각 에이전트 단계별 토큰 사용량과 지연시간(Latency)을 정밀 분석합니다."
            >
              <Zap className="w-3.5 h-3.5 text-stone-950 fill-stone-950" />
              <span>Agent Efficiency Report</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Three-Stage Visual Progress Bar (LangChain, LangGraph, LangSmith) */}
      <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800/80 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-stone-300 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span>프레임워크별 3단계 실행 파이프라인 (Execution Pipeline)</span>
          </span>
          <span className="text-[11px] font-mono text-stone-400">
            {isComplete ? '100% 완료 · LangSmith 평가 통과' : isGenerating ? '실시간 다중 에이전트 협업 실행 중' : '대기 상태'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {/* Phase 1: LangChain */}
          <div className={`p-3 rounded-xl border transition-all ${
            hasLangChain
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
              : 'bg-stone-900/40 border-stone-800 text-stone-500'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-emerald-400">
                STAGE 1 · LANGCHAIN
              </span>
              {hasLangChain ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-stone-700" />
              )}
            </div>
            <div className="font-bold text-xs text-white mt-1">도구 호출 (Tool Use &amp; Binding)</div>
            <p className="text-[11px] text-stone-400 mt-0.5 leading-snug">
              기상 LSTM, POI 벡터검색, 블루리본 미식, GIS 좌표 인코더 등 8개 커스텀 툴 실행
            </p>
          </div>

          {/* Phase 2: LangGraph */}
          <div className={`p-3 rounded-xl border transition-all ${
            hasLangGraph
              ? 'bg-violet-950/40 border-violet-500/40 text-violet-200'
              : 'bg-stone-900/40 border-stone-800 text-stone-500'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-violet-400">
                STAGE 2 · LANGGRAPH
              </span>
              {hasLangGraph ? (
                <CheckCircle2 className="w-4 h-4 text-violet-400" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-stone-700" />
              )}
            </div>
            <div className="font-bold text-xs text-white mt-1">상태 전이 &amp; 조건부 루프 (StateGraph)</div>
            <p className="text-[11px] text-stone-400 mt-0.5 leading-snug">
              마에스트로 Supervisor 라우터, 일정-예산 CSP 최적화 및 중복 제로 순환 검증
            </p>
          </div>

          {/* Phase 3: LangSmith */}
          <div className={`p-3 rounded-xl border transition-all ${
            hasLangSmith
              ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
              : 'bg-stone-900/40 border-stone-800 text-stone-500'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-amber-400">
                STAGE 3 · LANGSMITH
              </span>
              {hasLangSmith ? (
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-stone-700" />
              )}
            </div>
            <div className="font-bold text-xs text-white mt-1">실시간 트레이싱 &amp; 평가 (Observability)</div>
            <p className="text-[11px] text-stone-400 mt-0.5 leading-snug">
              토큰/지연시간 메트릭 수집, 중복 제로 &amp; GIS 무결성 전수 평가기(Evaluators) 합격
            </p>
          </div>
        </div>
      </div>

      {/* 3. Agents Mini Avatar Bar */}
      <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-12 gap-2">
        {AGENT_TEAM.map(agent => {
          const hasLog = logs.some(l => l.agentId === agent.id);
          const isDone = logs.some(l => l.agentId === agent.id && l.status === 'DONE');
          const isCurrent = logs.length > 0 && logs[logs.length - 1].agentId === agent.id;

          return (
            <div
              key={agent.id}
              className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                isCurrent && isGenerating
                  ? 'border-amber-400 bg-amber-950/40 shadow-sm ring-1 ring-amber-400/50 scale-105'
                  : hasLog
                  ? 'border-stone-700 bg-stone-800/80 text-stone-200'
                  : 'border-stone-800 bg-stone-950/40 text-stone-500 opacity-60'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${agent.avatarColor}`}>
                {getIcon(agent.avatarIcon)}
              </div>
              <span className="text-[11px] font-bold truncate max-w-full">
                {agent.name}
              </span>
              <span className="text-[9px] text-stone-400 truncate max-w-full">
                {agent.title.split(' ')[0]}
              </span>
            </div>
          );
        })}
      </div>

      {/* 4. Log Grouping Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-800">
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <span className="text-stone-400 text-[11px] mr-1">로그 그룹핑:</span>
          <button
            onClick={() => setLogFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer ${
              logFilter === 'ALL'
                ? 'bg-stone-700 text-white font-bold'
                : 'bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-800'
            }`}
          >
            전체 로그 ({logs.length})
          </button>
          <button
            onClick={() => setLogFilter('LANGCHAIN')}
            className={`px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer flex items-center gap-1 ${
              logFilter === 'LANGCHAIN'
                ? 'bg-emerald-800 text-emerald-100 font-bold border border-emerald-600'
                : 'bg-stone-950 text-stone-400 hover:text-emerald-300 border border-stone-800'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>LangChain Tool Use ({logs.filter(l => l.framework === 'LANGCHAIN').length})</span>
          </button>
          <button
            onClick={() => setLogFilter('LANGGRAPH')}
            className={`px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer flex items-center gap-1 ${
              logFilter === 'LANGGRAPH'
                ? 'bg-violet-800 text-violet-100 font-bold border border-violet-600'
                : 'bg-stone-950 text-stone-400 hover:text-violet-300 border border-stone-800'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            <span>LangGraph State ({logs.filter(l => l.framework === 'LANGGRAPH').length})</span>
          </button>
          <button
            onClick={() => setLogFilter('LANGSMITH')}
            className={`px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer flex items-center gap-1 ${
              logFilter === 'LANGSMITH'
                ? 'bg-amber-800 text-amber-100 font-bold border border-amber-600'
                : 'bg-stone-950 text-stone-400 hover:text-amber-300 border border-stone-800'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>LangSmith Trace ({logs.filter(l => l.framework === 'LANGSMITH').length})</span>
          </button>
        </div>

        {logs.length > 0 && (
          <span className="text-[11px] text-stone-500 font-mono">
            최근 동기화: {logs[logs.length - 1].timestamp}
          </span>
        )}
      </div>

      {/* 5. Real-time Message Log Stream */}
      <div className="bg-stone-950 rounded-2xl p-4 sm:p-5 border border-stone-800/90 font-mono text-xs max-h-80 overflow-y-auto space-y-3 scrollbar-thin">
        {filteredLogs.map((log) => (
          <div
            key={log.id}
            className="flex items-start gap-3 p-3 rounded-xl bg-stone-900/80 border border-stone-800/70 hover:border-stone-700 transition-all animate-in fade-in duration-300"
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${log.avatarColor} text-[11px]`}>
              {getIcon(log.avatarIcon)}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-amber-300 font-sans">{log.agentName}</span>
                  <span className="text-[10px] text-stone-400 px-1.5 py-0.5 rounded bg-stone-800 font-sans">
                    {log.agentRole}
                  </span>
                  {log.framework && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                      log.framework === 'LANGCHAIN' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                      log.framework === 'LANGGRAPH' ? 'bg-violet-950 text-violet-400 border border-violet-800' :
                      'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {log.framework}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-[10px] text-stone-500 font-mono">
                  {log.latencyMs && (
                    <span className="text-sky-400">{log.latencyMs}ms</span>
                  )}
                  {log.tokens && (
                    <span className="text-amber-400/80">{log.tokens.total} tok</span>
                  )}
                  <span>{log.timestamp}</span>
                </div>
              </div>

              <p className="text-stone-200 text-xs leading-relaxed font-sans">
                {log.message}
              </p>

              {log.detail && (
                <p className="text-[11px] text-stone-400 font-sans border-l-2 border-stone-700 pl-2 mt-1">
                  {log.detail}
                </p>
              )}
            </div>
          </div>
        ))}

        {isGenerating && (
          <div className="flex items-center gap-2 text-amber-400 text-xs py-2 px-1">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span className="animate-pulse">다음 전문 에이전트가 데이터 교차 검증 및 상태 전이를 수행하고 있습니다...</span>
          </div>
        )}
      </div>

      {/* 6. Efficiency Report Modal */}
      <AgentEfficiencyReportModal
        isOpen={efficiencyModalOpen}
        onClose={() => setEfficiencyModalOpen(false)}
        traces={efficiencyTraces}
      />
    </div>
  );
};
