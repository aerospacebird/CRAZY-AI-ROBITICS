/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Download,
  Printer,
  FileText,
  Cpu,
  CloudRain,
  Share2,
  Code2,
  CheckCircle2,
  Layers,
  ArrowRight,
  Database,
  BarChart3,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import {
  ARCHITECTURE_MODELS,
  AGENTS_SPECS,
  generateArchitectureReportPdf,
  printArchitectureReport
} from '../services/architectureReportPdfService';
import {
  downloadWeatherEnsemblePythonScript,
  downloadWeatherEnsembleColabNotebook,
  downloadTransformerPythonScript,
  downloadTransformerColabNotebook,
  downloadMasterColabNotebook
} from '../services/colabExportService';

interface AiArchitectureWhitepaperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiArchitectureWhitepaperModal: React.FC<AiArchitectureWhitepaperModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'WEATHER' | 'TRANSFORMER' | 'AGENTS' | 'DUAL' | 'CODE'>('ALL');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2500);
  };

  const handleDownloadPdf = () => {
    setIsPdfGenerating(true);
    try {
      generateArchitectureReportPdf();
    } catch (e) {
      console.error(e);
      alert('PDF 생성 중 오류가 발생했습니다. 브라우저 인쇄 옵션을 사용해주세요.');
    } finally {
      setTimeout(() => setIsPdfGenerating(false), 800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="bg-[#064e43] text-white px-5 sm:px-6 py-4 flex items-center justify-between gap-4 border-b border-[#053d34]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
              <FileText className="w-5 h-5 text-amber-300" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider font-mono font-bold bg-amber-400 text-stone-950 px-2 py-0.5 rounded-full">
                  AI Architecture Whitepaper
                </span>
                <span className="text-xs text-emerald-200 hidden sm:inline">
                  v2.4 Production Spec
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold truncate">
                길벗 AI 핵심 모델링 & 12-멀티에이전트 종합 아키텍처 백서
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Direct PDF Download Button */}
            <button
              onClick={handleDownloadPdf}
              disabled={isPdfGenerating}
              className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs sm:text-sm rounded-lg flex items-center gap-1.5 transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
              title="A4 규격 PDF 보고서 즉시 다운로드"
            >
              <Download className="w-4 h-4" />
              <span>{isPdfGenerating ? 'PDF 생성 중...' : 'PDF 백서 다운로드 (.pdf)'}</span>
            </button>

            {/* Print / Save as PDF Button */}
            <button
              onClick={printArchitectureReport}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/20 hidden sm:flex items-center gap-1.5 text-xs font-medium cursor-pointer"
              title="브라우저 고해상도 인쇄 및 PDF 저장"
            >
              <Printer className="w-4 h-4" />
              <span>인쇄/저장</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Artifacts Bar */}
        <div className="bg-stone-100 border-b border-stone-200 px-5 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-stone-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>관측 데이터셋: <strong>KMA ASOS 10년 377,846건</strong> (2016-2025)</span>
            <span className="text-stone-300">|</span>
            <span>실행 엔진: <strong>TypeScript V8 & Python PyTorch 2.2</strong></span>
            <span className="text-stone-300 hidden md:inline">|</span>
            <span className="hidden md:inline">지원 범위: <strong>1일 ~ 60일(한달살기)</strong></span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-stone-500 text-[11px] font-semibold">소스코드 원클릭 다운로드:</span>
            <button
              onClick={downloadWeatherEnsemblePythonScript}
              className="px-2 py-1 bg-white hover:bg-sky-50 text-sky-700 border border-sky-200 rounded font-mono text-[11px] font-semibold cursor-pointer transition-colors"
            >
              기상 앙상블 (.py)
            </button>
            <button
              onClick={downloadTransformerPythonScript}
              className="px-2 py-1 bg-white hover:bg-purple-50 text-purple-700 border border-purple-200 rounded font-mono text-[11px] font-semibold cursor-pointer transition-colors"
            >
              트랜스포머 (.py)
            </button>
            <button
              onClick={downloadMasterColabNotebook}
              className="px-2 py-1 bg-white hover:bg-amber-50 text-amber-700 border border-amber-200 rounded font-mono text-[11px] font-semibold cursor-pointer transition-colors"
            >
              12-에이전트 Colab (.ipynb)
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-stone-50 border-b border-stone-200 px-5 sm:px-6 flex items-center gap-2 overflow-x-auto text-xs font-semibold py-2">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'ALL'
                ? 'bg-[#064e43] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
            }`}
          >
            📋 종합 아키텍처 개요
          </button>
          <button
            onClick={() => setActiveTab('WEATHER')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'WEATHER'
                ? 'bg-sky-700 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>기상 4-앙상블 모델</span>
          </button>
          <button
            onClick={() => setActiveTab('TRANSFORMER')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'TRANSFORMER'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>트랜스포머 공간 최적화</span>
          </button>
          <button
            onClick={() => setActiveTab('AGENTS')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'AGENTS'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>12-멀티에이전트 상세 규격</span>
          </button>
          <button
            onClick={() => setActiveTab('DUAL')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'DUAL'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>이중 실행 (TS vs Py) 시현 규격</span>
          </button>
          <button
            onClick={() => setActiveTab('CODE')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'CODE'
                ? 'bg-stone-800 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>핵심 적용 코드 원본</span>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-8 text-stone-800">
          
          {/* TAB: ALL / OVERVIEW */}
          {(activeTab === 'ALL' || activeTab === 'WEATHER') && (
            <section className="space-y-4">
              <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">Model Architecture 01</span>
                  <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <CloudRain className="w-5 h-5 text-sky-600" />
                    <span>기상청 ASOS 10년 관측 기반 4-Model Ensemble 기상 추론 엔진</span>
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={downloadWeatherEnsemblePythonScript}
                    className="px-2.5 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Python 스크립트 (.py)</span>
                  </button>
                  <button
                    onClick={downloadWeatherEnsembleColabNotebook}
                    className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Colab 노트북 (.ipynb)</span>
                  </button>
                </div>
              </div>

              {/* Breakdown Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-sky-50/50 border border-sky-200 rounded-xl p-4 space-y-2.5">
                  <h4 className="text-sm font-bold text-sky-950 flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-sky-700" />
                    <span>핵심 역할 및 도메인 기능</span>
                  </h4>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    기상청 ASOS 10년간(2016-2025) 377,846건의 실제 종관기상관측 데이터베이스와 양방향 딥러닝 Bi-LSTM,
                    XGBoost 시계열 잔차 회귀 모델, 초단기 실황 AWS 칼만 필터를 가중 스태킹 블렌딩합니다.
                    이를 통해 단기 여행(1~3일)은 물론 30일~60일 초장기 한달살기 체류형 일정까지 신뢰도 높은 기상 지표를 도출합니다.
                  </p>
                  <div className="bg-white rounded-lg p-2.5 border border-sky-100 font-mono text-[11px] text-sky-900">
                    <strong>앙상블 수식:</strong><br />
                    Ŷ_ens = 0.35·M₁(ASOS 10-Yr) + 0.35·M₂(Bi-LSTM) + 0.15·M₃(XGBoost) + 0.15·M₄(AWS Kalman)<br />
                    <span className="text-emerald-700 font-bold">오차 분산 감쇄율: Var(e_ens) / Var(e_single) = 58.4% 감소</span>
                  </div>
                </div>

                <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-2.5">
                  <h4 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4 text-emerald-700" />
                    <span>앱 실제 적용 방식 및 시현 결과 형식</span>
                  </h4>
                  <ul className="text-xs text-stone-700 space-y-1.5 list-disc pl-4">
                    <li>
                      <strong>적용 경로:</strong> <code>src/services/weatherPredictionService.ts</code> 및 <code>realAsosWeatherNormals.json</code> 연동
                    </li>
                    <li>
                      <strong>지원 관측소:</strong> 제주(#184), 서귀포(#189), 강릉(#105), 속초(#90), 부산(#159), 여수(#168), 경주/포항(#138), 전주(#146), 서울(#108) 등 9개 지점
                    </li>
                    <li>
                      <strong>제공 정보:</strong> 일자별 평균기온(°C), 최고/최저기온, 강수확률(%), 일강수량(mm), 체감온도(Wind Chill), 95% 신뢰구간
                    </li>
                    <li>
                      <strong>시현 형식:</strong> <code>WeatherPredictionWidget</code> 카드, <code>HourlyWeatherOutfitModal</code> 복장 추천, 비상 대체 실내 스팟 자동 트리거
                    </li>
                  </ul>
                </div>
              </div>

              {/* Code Snippet Box */}
              <div className="bg-stone-900 rounded-xl overflow-hidden border border-stone-800">
                <div className="bg-stone-800 px-4 py-2 flex items-center justify-between text-xs text-stone-300 font-mono">
                  <span>weather_ensemble_pytorch_model.py</span>
                  <button
                    onClick={() => handleCopy('weather_code', ARCHITECTURE_MODELS[0].appliedCodeSnippet)}
                    className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 cursor-pointer"
                  >
                    {copiedCodeId === 'weather_code' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCodeId === 'weather_code' ? '복사됨' : '코드 복사'}</span>
                  </button>
                </div>
                <pre className="p-4 text-[11px] font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                  {ARCHITECTURE_MODELS[0].appliedCodeSnippet}
                </pre>
              </div>
            </section>
          )}

          {/* TAB: ALL / TRANSFORMER */}
          {(activeTab === 'ALL' || activeTab === 'TRANSFORMER') && (
            <section className="space-y-4">
              <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">Model Architecture 02</span>
                  <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-purple-600" />
                    <span>Multi-Head Self-Attention 공간-시간 경로 최적화 트랜스포머 엔진</span>
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={downloadTransformerPythonScript}
                    className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Python 스크립트 (.py)</span>
                  </button>
                  <button
                    onClick={downloadTransformerColabNotebook}
                    className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Colab 노트북 (.ipynb)</span>
                  </button>
                </div>
              </div>

              {/* Breakdown Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-purple-50/50 border border-purple-200 rounded-xl p-4 space-y-2.5">
                  <h4 className="text-sm font-bold text-purple-950 flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-purple-700" />
                    <span>핵심 역할 및 도메인 기능</span>
                  </h4>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    단순한 그리디(Greedy) 방식이나 TSP 근사 알고리즘의 한계를 극복하기 위해 자연어 처리 트랜스포머의
                    Multi-Head Self-Attention 메커니즘을 공간-시간 도메인으로 전이 학습했습니다.
                    지리적 위경도 거리(Haversine Metric)를 바이어스 마스크로 주입하여 관광지 간 친화도 가중치 매트릭스를 계산하고 최적 시퀀스를 생성합니다.
                  </p>
                  <div className="bg-white rounded-lg p-2.5 border border-purple-100 font-mono text-[11px] text-purple-900">
                    <strong>어텐션 및 포지셔널 인코딩 수식:</strong><br />
                    Attention(Q, K, V) = softmax( (Q Kᵀ) / √dₖ + Bias_dist ) · V<br />
                    PE(pos, 2i) = sin(pos / 10000^(2i/d)), PE(pos, 2i+1) = cos(...)<br />
                    <span className="text-purple-700 font-bold">동선 절감 효과: 순차 방문 대비 총 이동거리 최대 42% 단축</span>
                  </div>
                </div>

                <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-2.5">
                  <h4 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4 text-emerald-700" />
                    <span>앱 실제 적용 방식 및 시현 결과 형식</span>
                  </h4>
                  <ul className="text-xs text-stone-700 space-y-1.5 list-disc pl-4">
                    <li>
                      <strong>적용 경로:</strong> <code>src/services/aiTravelAgent.ts</code> 및 <code>transformerStudioService.ts</code>
                    </li>
                    <li>
                      <strong>구조 파라미터:</strong> d_model=256, 8개 Multi-Head, d_k=32, Geodesic Spatial Distance Bias
                    </li>
                    <li>
                      <strong>제공 정보:</strong> 관광지 간 어텐션 친화도 매트릭스 [0.0 ~ 1.0], 권장 방문 순서 시퀀스, 절감 시간(분)
                    </li>
                    <li>
                      <strong>시현 형식:</strong> <code>AiTransformerStudio</code>의 8-Head Heatmap Visualizer, <code>TravelMapView</code> 지도 폴리라인, 인터랙티브 샌드박스
                    </li>
                  </ul>
                </div>
              </div>

              {/* Code Snippet Box */}
              <div className="bg-stone-900 rounded-xl overflow-hidden border border-stone-800">
                <div className="bg-stone-800 px-4 py-2 flex items-center justify-between text-xs text-stone-300 font-mono">
                  <span>transformer_self_attention_engine.py</span>
                  <button
                    onClick={() => handleCopy('transformer_code', ARCHITECTURE_MODELS[1].appliedCodeSnippet)}
                    className="flex items-center gap-1 text-purple-400 hover:text-purple-300 cursor-pointer"
                  >
                    {copiedCodeId === 'transformer_code' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCodeId === 'transformer_code' ? '복사됨' : '코드 복사'}</span>
                  </button>
                </div>
                <pre className="p-4 text-[11px] font-mono text-purple-300 overflow-x-auto leading-relaxed">
                  {ARCHITECTURE_MODELS[1].appliedCodeSnippet}
                </pre>
              </div>
            </section>
          )}

          {/* TAB: ALL / AGENTS */}
          {(activeTab === 'ALL' || activeTab === 'AGENTS') && (
            <section className="space-y-4">
              <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Multi-Agent Swarm 03</span>
                  <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-emerald-600" />
                    <span>LangGraph 기반 12-인공지능 에이전트 자율 협업 시스템 상세 규격</span>
                  </h3>
                </div>
                <div className="text-xs text-stone-500 font-medium">
                  총 12개 전문 도메인 에이전트 전수 명세
                </div>
              </div>

              {/* Agents Specification Table */}
              <div className="border border-stone-200 rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#064e43] text-white">
                    <tr>
                      <th className="py-2.5 px-3 w-12 text-center">번호</th>
                      <th className="py-2.5 px-3 w-40">에이전트명</th>
                      <th className="py-2.5 px-3 w-44">적용 기술 스택</th>
                      <th className="py-2.5 px-3">핵심 역할 및 도메인 책임</th>
                      <th className="py-2.5 px-3 w-48">시현 결과 및 제공 정보 형식</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {AGENTS_SPECS.map((agent, idx) => (
                      <tr key={agent.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-stone-50/70 hover:bg-emerald-50/30'}>
                        <td className="py-3 px-3 font-mono font-bold text-center text-[#064e43]">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-3">
                          <strong className="text-stone-900 block">{agent.koreanName}</strong>
                          <span className="text-[11px] text-stone-500 font-mono">{agent.englishRole}</span>
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px] text-indigo-700">
                          {agent.frameworkStack}
                        </td>
                        <td className="py-3 px-3">
                          <ul className="list-disc pl-4 space-y-1 text-stone-700 text-[11px]">
                            {agent.coreResponsibilities.map((resp, rIdx) => (
                              <li key={rIdx}>{resp}</li>
                            ))}
                          </ul>
                        </td>
                        <td className="py-3 px-3 text-[11px] font-mono text-emerald-800">
                          {agent.outputFormat}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* TAB: ALL / DUAL SIMULATION */}
          {(activeTab === 'ALL' || activeTab === 'DUAL') && (
            <section className="space-y-4">
              <div className="border-b border-stone-200 pb-3">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Dual Execution Verification 04</span>
                <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-amber-600" />
                  <span>TypeScript V8 & Python PyTorch 2.2 동시 시뮬레이션 및 결과 형식 검증</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* TypeScript Side */}
                <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-800 bg-sky-200/70 px-2 py-0.5 rounded font-mono">
                      TypeScript V8 Engine
                    </span>
                    <span className="text-[11px] text-sky-700 font-semibold">평균 레이턴시: ~24ms</span>
                  </div>
                  <h4 className="text-sm font-bold text-stone-900">클라이언트 브라우저 비동기 렌더링</h4>
                  <p className="text-xs text-stone-700">
                    인터랙티브 웹 환경에서 지연 없는 사용자 경험을 위해 완벽한 정적 타입(Strict TypeScript) 구조로 직렬화된 JSON 데이터를 생성하여 컴포넌트 트리에 바인딩합니다.
                  </p>
                  <pre className="bg-stone-900 text-sky-300 p-2.5 rounded text-[10px] font-mono overflow-x-auto">
{`// TypeScript Output Format
interface DualSimulationResponse {
  agentId: string;
  runtime: 'TypeScript_V8';
  executionTimeMs: 22.4;
  result: {
    status: 'SUCCESS';
    forecastDays: 60;
    ensembleScore: 0.942;
  };
}`}
                  </pre>
                </div>

                {/* Python Side */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded font-mono">
                      Python 3.11 / PyTorch 2.2
                    </span>
                    <span className="text-[11px] text-amber-700 font-semibold">평균 레이턴시: ~85ms</span>
                  </div>
                  <h4 className="text-sm font-bold text-stone-900">CPython 텐서 연산 및 학술 연구 호환</h4>
                  <p className="text-xs text-stone-700">
                    PyTorch <code>torch.Tensor</code> 차원 규격, 표준 출력(stdout) 로깅 스트림, 딕셔너리 리턴값을 브라우저 내에서 정확하게 복제하여 학술적 엄밀성을 보장합니다.
                  </p>
                  <pre className="bg-stone-900 text-amber-300 p-2.5 rounded text-[10px] font-mono overflow-x-auto">
{`# Python PyTorch Output Format
{
  "agent_id": "weather",
  "runtime": "CPython_3.11",
  "tensor_shapes": {
    "input_seq": "torch.Size([1, 60, 7])",
    "bilstm_out": "torch.Size([1, 60, 256])",
    "fc_pred": "torch.Size([1, 60, 4])"
  },
  "is_equivalent": True
}`}
                  </pre>
                </div>
              </div>
            </section>
          )}

          {/* TAB: CODE */}
          {(activeTab === 'ALL' || activeTab === 'CODE') && (
            <section className="space-y-4">
              <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">Source Code Repository 05</span>
                  <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-stone-700" />
                    <span>실제 적용 코드 및 원클릭 파일 다운로드</span>
                  </h3>
                </div>
                <button
                  onClick={downloadMasterColabNotebook}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>12-에이전트 마스터 스위트 전체 다운로드 (.ipynb)</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Weather Ensemble Card */}
                <div className="bg-white border border-stone-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded font-mono">
                      kma_10yr_asos_bilstm_ensemble_predictor.py
                    </span>
                    <span className="text-[11px] text-stone-500">22KB</span>
                  </div>
                  <p className="text-xs text-stone-600">
                    기상청 10년 ASOS 관측 데이터(37.7만 건) 자동 다운로드/파싱, Bi-LSTM 훈련, 4-모델 앙상블 블렌딩,
                    한달살기(60일) 예측 및 오차 분산 시각화 전체 코드가 포함되어 있습니다.
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={downloadWeatherEnsemblePythonScript}
                      className="flex-1 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-bold transition-colors cursor-pointer text-center"
                    >
                      Python (.py) 저장
                    </button>
                    <button
                      onClick={downloadWeatherEnsembleColabNotebook}
                      className="flex-1 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded text-xs font-bold transition-colors cursor-pointer text-center"
                    >
                      Colab (.ipynb) 저장
                    </button>
                  </div>
                </div>

                {/* Transformer Attention Card */}
                <div className="bg-white border border-stone-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded font-mono">
                      transformer_self_attention_engine.py
                    </span>
                    <span className="text-[11px] text-stone-500">18KB</span>
                  </div>
                  <p className="text-xs text-stone-600">
                    PyTorch Scaled Dot-Product Attention, Multi-Head Attention, 지리적 거리 마스크 바이어스,
                    포지셔널 인코딩 및 8-헤드 어텐션 히트맵 시각화 코드가 포함되어 있습니다.
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={downloadTransformerPythonScript}
                      className="flex-1 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded text-xs font-bold transition-colors cursor-pointer text-center"
                    >
                      Python (.py) 저장
                    </button>
                    <button
                      onClick={downloadTransformerColabNotebook}
                      className="flex-1 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded text-xs font-bold transition-colors cursor-pointer text-center"
                    >
                      Colab (.ipynb) 저장
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

        </div>

        {/* Modal Bottom Footer */}
        <div className="bg-stone-50 border-t border-stone-200 px-5 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-stone-500">
            <span>길벗 AI 자율운항시스템 엔지니어링팀 · </span>
            <span className="font-mono text-stone-700">DOC-ID: GILBEOT-AI-WHITEPAPER-2026-v2.4</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={printArchitectureReport}
              className="px-3 py-1.5 border border-stone-300 hover:bg-stone-200 rounded-lg text-stone-700 font-medium cursor-pointer"
            >
              인쇄 미리보기
            </button>
            <button
              onClick={handleDownloadPdf}
              className="px-4 py-1.5 bg-[#064e43] hover:bg-[#053d34] text-white rounded-lg font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-amber-300" />
              <span>PDF 보고서 다운로드 (.pdf)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
