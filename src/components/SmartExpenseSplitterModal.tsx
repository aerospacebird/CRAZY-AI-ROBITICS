/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FullTravelPlan } from '../types/travel';
import { 
  X, Calculator, Wallet, DollarSign, Plus, Trash2, Copy, 
  Check, PieChart, Users, ArrowRight, ShieldAlert, Sparkles 
} from 'lucide-react';

interface ExpenseItem {
  id: string;
  title: string;
  category: 'FOOD' | 'CAFE' | 'TRANSPORT' | 'ACCOMMODATION' | 'ACTIVITY' | 'OTHER';
  amount: number;
  payer: string;
  date: string;
}

interface SmartExpenseSplitterModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: FullTravelPlan;
}

export const SmartExpenseSplitterModal: React.FC<SmartExpenseSplitterModalProps> = ({
  isOpen,
  onClose,
  plan
}) => {
  const { request, costs } = plan;

  // Companion setup
  const initialCompanionsCount = Math.max(2, (request.adultCount || 2) + (request.childCount || 0));
  const [companionCount, setCompanionCount] = useState<number>(initialCompanionsCount);
  const [companionNames, setCompanionNames] = useState<string[]>(['김서연 (본인)', '동행자 1']);
  
  // Bank / Account info for transfer copy
  const [bankInfo, setBankInfo] = useState<string>('카카오뱅크 3333-01-2345678');

  // Initial expenses populated realistically from plan
  const [expenses, setExpenses] = useState<ExpenseItem[]>([
    {
      id: 'exp-1',
      title: `${plan.selectedAccommodation.name} 예약 선결제`,
      category: 'ACCOMMODATION',
      amount: costs.accommodationTotal,
      payer: '김서연 (본인)',
      date: '출발 전 사전결제'
    },
    {
      id: 'exp-2',
      title: `${plan.transportGuide.recommendedMode} 렌트 및 유류비`,
      category: 'TRANSPORT',
      amount: Math.round(costs.transportTotal * 0.7),
      payer: '김서연 (본인)',
      date: '1일차 오전'
    },
    {
      id: 'exp-3',
      title: '현지 향토식당 점심 만찬',
      category: 'FOOD',
      amount: 45000,
      payer: '김서연 (본인)',
      date: '1일차 12:30'
    },
    {
      id: 'exp-4',
      title: '바다 파노라마 오션뷰 카페 음료 & 디저트',
      category: 'CAFE',
      amount: 22000,
      payer: '동행자 1',
      date: '1일차 15:40'
    }
  ]);

  // Form for new expense
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState<'FOOD' | 'CAFE' | 'TRANSPORT' | 'ACCOMMODATION' | 'ACTIVITY' | 'OTHER'>('FOOD');
  const [newPayer, setNewPayer] = useState(companionNames[0]);
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  // Calculations
  const totalActualSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
  const totalBudget = request.budget || 1200000;
  const remainingBudget = totalBudget - totalActualSpent;
  const spentPercent = Math.min(100, Math.round((totalActualSpent / totalBudget) * 100));
  const perPersonAmount = Math.round(totalActualSpent / companionCount);

  // Category breakdown
  const categoryTotals: Record<string, number> = {};
  expenses.forEach(e => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'FOOD': return '식비 (맛집)';
      case 'CAFE': return '카페/디저트';
      case 'TRANSPORT': return '교통/주유/항공';
      case 'ACCOMMODATION': return '숙소/호텔';
      case 'ACTIVITY': return '체험/입장료';
      default: return '기타/기념품';
    }
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(newAmount.replace(/,/g, ''), 10);
    if (!newTitle.trim() || isNaN(val) || val <= 0) return;

    const newItem: ExpenseItem = {
      id: `exp-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      amount: val,
      payer: newPayer,
      date: '현장 실시간 지출'
    };

    setExpenses([newItem, ...expenses]);
    setNewTitle('');
    setNewAmount('');
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(item => item.id !== id));
  };

  // Copy Settlement message
  const handleCopySettlement = () => {
    const text = `📢 [${plan.title}] 여행 정산 안내 (1/N N빵)
━━━━━━━━━━━━━━━━━━━━
총 실지출: ${totalActualSpent.toLocaleString()}원
참여 인원: ${companionCount}인
1인당 정산 금액: ➡️ ${perPersonAmount.toLocaleString()}원 ⬅️

💳 입금 계좌: ${bankInfo}
동행자 여러분, 정산 부탁드립니다! 오늘도 행복한 여행 되세요 ✨`;

    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-stone-200">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Calculator className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold tracking-tight">
                  스마트 여행 가계부 & 1/N 실시간 정산기
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-400 text-stone-900">
                  N빵 자동 계산
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-0.5">
                {plan.request.destination} · {plan.request.clientName} 고객님 일정 실시간 경비 및 동행인 분담금 트래킹
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
          
          {/* 1. Summary Cards: Budget, Spent, Remaining, 1/N Split */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-[#faf7f2] border border-[#e8e4dc]">
              <span className="text-xs font-semibold text-stone-500 block">설정 총 여행 예산</span>
              <div className="text-xl sm:text-2xl font-bold text-stone-900 font-mono mt-1">
                {totalBudget.toLocaleString()}원
              </div>
              <span className="text-[11px] text-stone-500 mt-1 block">AI 에이전트 초기 가이드</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
              <span className="text-xs font-semibold text-emerald-800 block">현재 실제 지출 합계</span>
              <div className="text-xl sm:text-2xl font-bold text-emerald-950 font-mono mt-1">
                {totalActualSpent.toLocaleString()}원
              </div>
              <span className="text-[11px] text-emerald-700 mt-1 block">총 {expenses.length}건 기록 완료</span>
            </div>

            <div className={`p-4 rounded-2xl border ${
              remainingBudget >= 0 
                ? 'bg-blue-50/70 border-blue-200 text-blue-950' 
                : 'bg-rose-50/70 border-rose-200 text-rose-950'
            }`}>
              <span className="text-xs font-semibold block opacity-80">
                {remainingBudget >= 0 ? '남은 예산 여유금' : '예산 초과 금액'}
              </span>
              <div className="text-xl sm:text-2xl font-bold font-mono mt-1">
                {Math.abs(remainingBudget).toLocaleString()}원
              </div>
              <span className="text-[11px] opacity-80 mt-1 block">
                {remainingBudget >= 0 ? '안정적인 잔여 예산' : '경비 절약 권장'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#064e43] text-white shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-emerald-200 block">1인당 정산 분담금 (N빵)</span>
                <div className="text-xl sm:text-2xl font-extrabold text-white font-mono mt-1">
                  {perPersonAmount.toLocaleString()}원
                </div>
              </div>
              <div className="text-[11px] text-emerald-200/90 mt-1 flex items-center justify-between">
                <span>인원: {companionCount}인 기준</span>
                <span className="font-bold underline">1/N 균등 정산</span>
              </div>
            </div>
          </div>

          {/* Budget Progress Bar */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-stone-700">
              <span>예산 집행률: {spentPercent}% 소진</span>
              <span className="font-mono text-stone-500">{totalActualSpent.toLocaleString()} / {totalBudget.toLocaleString()}원</span>
            </div>
            <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  spentPercent > 90 ? 'bg-rose-500' : spentPercent > 70 ? 'bg-amber-500' : 'bg-emerald-600'
                }`}
                style={{ width: `${spentPercent}%` }}
              />
            </div>
          </div>

          {/* 2. 1/N Companion & Share Quick Toolbar */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-800" />
                <span className="text-xs font-bold text-amber-950">정산 인원 및 송금 계좌 설정</span>
              </div>
              <div className="flex items-center gap-3 pt-1">
                <span className="text-xs text-stone-600">동행 인원:</span>
                <div className="flex items-center gap-1.5">
                  {[2, 3, 4, 5, 6].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setCompanionCount(num)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                        companionCount === num
                          ? 'bg-[#064e43] text-white shadow-xs'
                          : 'bg-white text-stone-700 border border-stone-300 hover:bg-stone-100'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                  <span className="text-xs text-stone-500 ml-1">명</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
              <input
                type="text"
                value={bankInfo}
                onChange={(e) => setBankInfo(e.target.value)}
                placeholder="입금받을 계좌번호"
                className="text-xs px-3 py-2 rounded-xl bg-white border border-amber-300 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#064e43]"
              />
              <button
                type="button"
                onClick={handleCopySettlement}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
              >
                {isCopied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                <span>{isCopied ? '정산문구 복사 완료!' : '카카오톡/토스 정산문구 복사'}</span>
              </button>
            </div>
          </div>

          {/* 3. Add New Expense Form */}
          <form onSubmit={handleAddExpense} className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3">
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#064e43]" />
              <span className="text-xs font-bold text-stone-900">새로운 지출 항목 즉시 추가</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="지출처/메뉴 (예: 흑돼지 저녁, 렌터카 주유)"
                className="sm:col-span-5 text-xs px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#064e43]"
                required
              />

              <input
                type="number"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                placeholder="금액 (원)"
                className="sm:col-span-3 text-xs px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#064e43]"
                required
              />

              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="sm:col-span-2 text-xs px-2.5 py-2.5 rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#064e43]"
              >
                <option value="FOOD">식비 (맛집)</option>
                <option value="CAFE">카페/디저트</option>
                <option value="TRANSPORT">교통/주유</option>
                <option value="ACCOMMODATION">숙소/호텔</option>
                <option value="ACTIVITY">체험/입장료</option>
                <option value="OTHER">기타</option>
              </select>

              <button
                type="submit"
                className="sm:col-span-2 px-3 py-2.5 rounded-xl bg-[#064e43] hover:bg-[#053d34] text-white font-bold text-xs flex items-center justify-center gap-1 shadow-xs transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>추가</span>
              </button>
            </div>
          </form>

          {/* 4. Expense List Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-emerald-800" />
                <span>실시간 지출 영수증 내역 ({expenses.length}건)</span>
              </h4>
              <span className="text-[11px] text-stone-500">
                실시간 1인 분담: {perPersonAmount.toLocaleString()}원 / 인
              </span>
            </div>

            <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden bg-white">
              {expenses.map((item) => (
                <div key={item.id} className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-[#faf7f2] transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 shrink-0">
                      {getCategoryLabel(item.category)}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-stone-900 truncate">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-stone-500 flex items-center gap-2 mt-0.5">
                        <span>결제: {item.payer}</span>
                        <span>·</span>
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-xs sm:text-sm font-bold text-stone-900 font-mono">
                        {item.amount.toLocaleString()}원
                      </span>
                      <span className="block text-[10px] text-stone-500 font-mono">
                        1인당 {Math.round(item.amount / companionCount).toLocaleString()}원
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteExpense(item.id)}
                      className="text-stone-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                      title="항목 삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <div className="text-xs text-stone-600 hidden sm:block">
            💡 현장에서 지출이 발생할 때마다 입력하시면 실시간으로 총액과 1/N 정산액이 즉시 재계산됩니다.
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
