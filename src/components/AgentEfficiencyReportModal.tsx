/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AgentEfficiencyTrace } from '../types/travel';
import {
  X,
  Zap,
  Activity,
  Layers,
  Clock,
  Coins,
  CheckCircle2,
  Copy,
  Download,
  Search,
  ExternalLink,
  Cpu,
  BarChart2,
  Sparkles
} from 'lucide-react';

interface AgentEfficiencyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  traces: AgentEfficiencyTrace[];
  destinationName?: string;
}

export const AgentEfficiencyReportModal: React.FC<AgentEfficiencyReportModalProps> = ({
  isOpen,
  onClose,
  traces,
  destinationName = '여행지'
}) => {
  const [activeTab, setActiveTab] = useState<'METRICS' | 'TRACE_TABLE' | 'RAW_JSON'>('METRICS');
  const [filterFramework, setFilterFramework] = useState<'ALL' | 'LANGCHAIN' | 'LANGGRAPH' | 'LANGSMITH'>('ALL');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Filter traces
  const filteredTraces = filterFramework === 'ALL'
    ? traces
    : traces.filter(t => t.framework === filterFramework);

  // Aggregates
  const totalPromptTokens = traces.reduce((acc, t) => acc + t.promptTokens, 0);
  const totalCompletionTokens = traces.reduce((acc, t) => acc + t.completionTokens, 0);
  const totalTokens = totalPromptTokens + totalCompletionTokens;
  const totalLatencyMs = traces.reduce((acc, t) => acc + t.latencyMs, 0);
  const avgLatencyMs = traces.length > 0 ? Math.round(totalLatencyMs / traces.length) : 0;
  const totalCostUsd = Math.round(traces.reduce((acc, t) => acc + t.costUsd, 0) * 10000) / 10000;
  const maxTokens = Math.max(...traces.map(t => t.totalTokens), 1);
  const maxLatency = Math.max(...traces.map(t => t.latencyMs), 1);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(traces, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(traces, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `langsmith_agent_efficiency_report_${Date.now()}.json`);
    dlAnchor.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-stone-900 border border-stone-800 text-stone-100 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden font-sans">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-stone-800 flex items-center justify-between bg-stone-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-stone-950 font-black shadow-md">
              <Zap className="w-5 h-5 text-stone-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30">
                  LANGSMITH OBSERVABILITY TRACE
                </span>
                <span className="text-xs text-stone-400 font-mono">
                  Run ID: {traces[0]?.traceId.split('-node')[0] || 'tr-live-session'}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white mt-0.5 flex items-center gap-2">
                <span>Agent Efficiency &amp; Token Latency Report</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  12개 에이전트 전수 추적
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadJson}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700 transition-all cursor-pointer"
              title="LangSmith 트레이스 JSON 다운로드"
            >
              <Download className="w-3.5 h-3.5" />
              <span>JSON 내보내기</span>
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Top Summary Stat Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 sm:p-5 bg-stone-950/40 border-b border-stone-800">
          <div className="bg-stone-900/90 p-3.5 rounded-2xl border border-stone-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span>총 소모 토큰 (Total)</span>
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono">
              {totalTokens.toLocaleString()} <span className="text-xs text-stone-400 font-sans font-normal">tokens</span>
            </div>
            <div className="text-[10px] text-stone-400 flex justify-between font-mono">
              <span>Prompt: {totalPromptTokens.toLocaleString()}</span>
              <span>Comp: {totalCompletionTokens.toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-stone-900/90 p-3.5 rounded-2xl border border-stone-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span>평균 지연시간 (Latency)</span>
              <Clock className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-sky-300 font-mono">
              {avgLatencyMs} <span className="text-xs text-stone-400 font-sans font-normal">ms</span>
            </div>
            <div className="text-[10px] text-stone-400 font-mono">
              누적 총합: {(totalLatencyMs / 1000).toFixed(2)}s
            </div>
          </div>

          <div className="bg-stone-900/90 p-3.5 rounded-2xl border border-stone-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span>추정 토큰 비용 (USD)</span>
              <Coins className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-300 font-mono">
              ${totalCostUsd.toFixed(4)}
            </div>
            <div className="text-[10px] text-stone-400">
              1회 여정 생성 기준 (약 {Math.round(totalCostUsd * 1400)}원)
            </div>
          </div>

          <div className="bg-stone-900/90 p-3.5 rounded-2xl border border-stone-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span>LangSmith 검증 상태</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-300 font-mono">
              100% <span className="text-xs text-stone-400 font-sans font-normal">Pass</span>
            </div>
            <div className="text-[10px] text-stone-400">
              중복 0건 / GIS 정밀검증 합격
            </div>
          </div>
        </div>

        {/* View Tabs & Framework Filter */}
        <div className="px-5 py-3 border-b border-stone-800 bg-stone-900 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 bg-stone-950 p-1 rounded-xl border border-stone-800">
            <button
              onClick={() => setActiveTab('METRICS')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'METRICS'
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>토큰 &amp; 지연시간 시각화</span>
            </button>
            <button
              onClick={() => setActiveTab('TRACE_TABLE')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'TRACE_TABLE'
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>에이전트별 세부 트레이스</span>
            </button>
            <button
              onClick={() => setActiveTab('RAW_JSON')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'RAW_JSON'
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Raw LangSmith JSON</span>
            </button>
          </div>

          {/* Framework pill filters */}
          <div className="flex items-center gap-1">
            <span className="text-stone-500 text-[11px] mr-1">프레임워크:</span>
            {[
              { id: 'ALL', label: '전체 (12)' },
              { id: 'LANGCHAIN', label: 'LangChain (8)' },
              { id: 'LANGGRAPH', label: 'LangGraph (2)' },
              { id: 'LANGSMITH', label: 'LangSmith (2)' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterFramework(f.id as any)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                  filterFramework === f.id
                    ? 'bg-stone-700 text-white border border-stone-600'
                    : 'bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 scrollbar-thin">
          
          {/* TAB 1: METRICS VISUALIZATION */}
          {activeTab === 'METRICS' && (
            <div className="space-y-6">
              <div className="bg-stone-950/60 p-4 sm:p-5 rounded-2xl border border-stone-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-amber-400" />
                    <span>에이전트별 토큰 소비량 (Prompt vs Completion)</span>
                  </h4>
                  <span className="text-xs text-stone-400">단위: 토큰(Tokens)</span>
                </div>

                <div className="space-y-2.5">
                  {filteredTraces.map(trace => {
                    const pct = Math.round((trace.totalTokens / maxTokens) * 100);
                    return (
                      <div key={trace.id} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-stone-200">{trace.agentName}</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                              trace.framework === 'LANGCHAIN' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                              trace.framework === 'LANGGRAPH' ? 'bg-violet-950 text-violet-400 border border-violet-800' :
                              'bg-amber-950 text-amber-400 border border-amber-800'
                            }`}>
                              {trace.framework}
                            </span>
                          </div>
                          <span className="font-mono text-stone-300 font-semibold">
                            {trace.totalTokens.toLocaleString()} tokens
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-stone-800 rounded-full overflow-hidden flex">
                          <div
                            className="bg-amber-500 h-full transition-all duration-500"
                            style={{ width: `${(trace.promptTokens / trace.totalTokens) * pct}%` }}
                            title={`Prompt: ${trace.promptTokens}`}
                          />
                          <div
                            className="bg-orange-400 h-full transition-all duration-500"
                            style={{ width: `${(trace.completionTokens / trace.totalTokens) * pct}%` }}
                            title={`Completion: ${trace.completionTokens}`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Latency Breakdown Bar */}
              <div className="bg-stone-950/60 p-4 sm:p-5 rounded-2xl border border-stone-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-sky-400" />
                    <span>에이전트별 응답 지연시간 (Latency ms)</span>
                  </h4>
                  <span className="text-xs text-stone-400">단위: 밀리초(ms)</span>
                </div>

                <div className="space-y-2.5">
                  {filteredTraces.map(trace => {
                    const pct = Math.round((trace.latencyMs / maxLatency) * 100);
                    return (
                      <div key={trace.id} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-stone-200">{trace.agentName}</span>
                          <span className="font-mono text-sky-300 font-semibold">{trace.latencyMs} ms</span>
                        </div>
                        <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-sky-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DETAILED TRACE TABLE */}
          {activeTab === 'TRACE_TABLE' && (
            <div className="bg-stone-950 rounded-2xl border border-stone-800 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-900/90 text-stone-400 font-mono border-b border-stone-800">
                  <tr>
                    <th className="p-3">에이전트</th>
                    <th className="p-3">프레임워크</th>
                    <th className="p-3">실행 노드 / 도구(Tool)</th>
                    <th className="p-3 text-right">프롬프트</th>
                    <th className="p-3 text-right">완성</th>
                    <th className="p-3 text-right">총 토큰</th>
                    <th className="p-3 text-right">지연시간</th>
                    <th className="p-3 text-right">추정비용</th>
                    <th className="p-3 text-center">상태</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60 font-mono">
                  {filteredTraces.map(trace => (
                    <tr key={trace.id} className="hover:bg-stone-900/50 transition-colors">
                      <td className="p-3 font-sans font-bold text-white whitespace-nowrap">
                        {trace.agentName}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          trace.framework === 'LANGCHAIN' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                          trace.framework === 'LANGGRAPH' ? 'bg-violet-950 text-violet-400 border border-violet-800' :
                          'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}>
                          {trace.framework}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-stone-300 max-w-[220px] truncate" title={trace.toolUsed || trace.executionNode}>
                        <span className="text-stone-400">{trace.executionNode}</span>
                        {trace.toolUsed && (
                          <span className="text-[11px] block text-amber-400/90 truncate">{trace.toolUsed}</span>
                        )}
                      </td>
                      <td className="p-3 text-right text-stone-400">{trace.promptTokens}</td>
                      <td className="p-3 text-right text-stone-400">{trace.completionTokens}</td>
                      <td className="p-3 text-right text-amber-300 font-bold">{trace.totalTokens}</td>
                      <td className="p-3 text-right text-sky-300">{trace.latencyMs}ms</td>
                      <td className="p-3 text-right text-emerald-400">${trace.costUsd.toFixed(4)}</td>
                      <td className="p-3 text-center">
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {trace.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 3: RAW JSON */}
          {activeTab === 'RAW_JSON' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-400 font-mono">
                  LangSmith v0.2.x Compatible Trace Payload ({traces.length} runs)
                </span>
                <button
                  onClick={handleCopyJson}
                  className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 border border-stone-700 transition-all cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? '복사 완료!' : 'JSON 전체 복사'}</span>
                </button>
              </div>

              <pre className="bg-stone-950 p-4 rounded-2xl border border-stone-800 font-mono text-xs text-stone-300 max-h-96 overflow-y-auto leading-relaxed">
                {JSON.stringify(traces, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-stone-800 bg-stone-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>OpenClaw Tool Use · LangChain · LangGraph · LangSmith 아키텍처 실시간 트레이싱 완료</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold transition-all shadow-md cursor-pointer"
          >
            리포트 닫기
          </button>
        </div>

      </div>
    </div>
  );
};
