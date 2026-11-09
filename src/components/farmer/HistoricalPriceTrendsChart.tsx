import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { TrendingUp, TrendingDown, ArrowUpRight, Sparkles, Filter, Info, ShieldCheck, Scale } from 'lucide-react';

interface CropHistoryData {
  period: string;
  // All crops
  tomatoesDirect: number;
  tomatoesMandi: number;
  wheatDirect: number;
  wheatMandi: number;
  onionsDirect: number;
  onionsMandi: number;
}

const MONTHLY_DATA: CropHistoryData[] = [
  { period: 'Jun 2026', tomatoesDirect: 24, tomatoesMandi: 16, wheatDirect: 38, wheatMandi: 29, onionsDirect: 26, onionsMandi: 17 },
  { period: 'Jul 2026', tomatoesDirect: 28, tomatoesMandi: 19, wheatDirect: 39, wheatMandi: 30, onionsDirect: 29, onionsMandi: 19 },
  { period: 'Aug 2026', tomatoesDirect: 36, tomatoesMandi: 25, wheatDirect: 40, wheatMandi: 31, onionsDirect: 35, onionsMandi: 23 },
  { period: 'Sep 2026', tomatoesDirect: 26, tomatoesMandi: 18, wheatDirect: 40, wheatMandi: 31, onionsDirect: 31, onionsMandi: 20 },
  { period: 'Oct 2026', tomatoesDirect: 25, tomatoesMandi: 17, wheatDirect: 41, wheatMandi: 32, onionsDirect: 28, onionsMandi: 18 },
  { period: 'Nov 2026', tomatoesDirect: 28, tomatoesMandi: 20, wheatDirect: 42, wheatMandi: 33, onionsDirect: 32, onionsMandi: 21 },
];

const WEEKLY_DATA: CropHistoryData[] = [
  { period: 'Wk 1 Oct', tomatoesDirect: 25, tomatoesMandi: 17, wheatDirect: 41, wheatMandi: 31, onionsDirect: 28, onionsMandi: 18 },
  { period: 'Wk 2 Oct', tomatoesDirect: 24, tomatoesMandi: 16, wheatDirect: 41, wheatMandi: 32, onionsDirect: 27, onionsMandi: 17 },
  { period: 'Wk 3 Oct', tomatoesDirect: 26, tomatoesMandi: 18, wheatDirect: 41, wheatMandi: 32, onionsDirect: 29, onionsMandi: 19 },
  { period: 'Wk 4 Oct', tomatoesDirect: 27, tomatoesMandi: 19, wheatDirect: 42, wheatMandi: 32, onionsDirect: 30, onionsMandi: 20 },
  { period: 'Wk 1 Nov', tomatoesDirect: 28, tomatoesMandi: 20, wheatDirect: 42, wheatMandi: 33, onionsDirect: 32, onionsMandi: 21 },
];

export const HistoricalPriceTrendsChart: React.FC = () => {
  const [viewMode, setViewMode] = useState<'comparison' | 'spread'>('comparison');
  const [selectedCrop, setSelectedCrop] = useState<'tomatoes' | 'wheat' | 'onions'>('tomatoes');
  const [timeframe, setTimeframe] = useState<'monthly' | 'weekly'>('monthly');

  const chartData = timeframe === 'monthly' ? MONTHLY_DATA : WEEKLY_DATA;

  // Crop metadata
  const cropsMeta = {
    tomatoes: {
      name: 'Desi Organic Tomatoes',
      unit: 'kg',
      currentPrice: 28,
      mandiPrice: 20,
      diff: 8,
      trend: '+12.0% this month',
      isRising: true,
      directColor: '#174D35',
      mandiColor: '#E65100',
      high6m: '₹36',
      low6m: '₹24',
      recommendation: 'High urban wedding demand in Bhopal. Maintain listing price at ₹28–₹30/kg.',
    },
    wheat: {
      name: 'Sharbati Sehore Wheat',
      unit: 'kg',
      currentPrice: 42,
      mandiPrice: 33,
      diff: 9,
      trend: '+7.6% this quarter',
      isRising: true,
      directColor: '#D97706',
      mandiColor: '#9A3412',
      high6m: '₹42',
      low6m: '₹38',
      recommendation: 'Stable, strong institutional premium. Great time for bulk multi-quintal contracts.',
    },
    onions: {
      name: 'Nasik Red Sweet Onion',
      unit: 'kg',
      currentPrice: 32,
      mandiPrice: 21,
      diff: 11,
      trend: '+14.2% post-monsoon',
      isRising: true,
      directColor: '#059669',
      mandiColor: '#B45309',
      high6m: '₹35',
      low6m: '₹26',
      recommendation: 'Arrivals tightening in local mandis. Target ₹32–₹34/kg for cured stock.',
    },
  };

  const activeCropMeta = cropsMeta[selectedCrop];

  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3.5 rounded-xl border border-[#174D35]/20 shadow-lg text-xs space-y-1.5 min-w-[200px]">
          <div className="font-bold text-[#17251C] border-b border-neutral-100 pb-1 flex items-center justify-between">
            <span>{label}</span>
            <span className="text-[10px] text-[#7C887E] font-normal">Historical Benchmark</span>
          </div>

          {viewMode === 'comparison' ? (
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between text-[#174D35]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#174D35]" />
                  Desi Tomatoes:
                </span>
                <span className="font-bold tabular-nums">₹{payload.find((p: any) => p.dataKey === 'tomatoesDirect')?.value}/kg</span>
              </div>
              <div className="flex items-center justify-between text-[#D97706]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
                  Sharbati Wheat:
                </span>
                <span className="font-bold tabular-nums">₹{payload.find((p: any) => p.dataKey === 'wheatDirect')?.value}/kg</span>
              </div>
              <div className="flex items-center justify-between text-[#059669]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#059669]" />
                  Red Onions:
                </span>
                <span className="font-bold tabular-nums">₹{payload.find((p: any) => p.dataKey === 'onionsDirect')?.value}/kg</span>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[#174D35] font-bold">
                <span>KrishiConnect Direct:</span>
                <span className="tabular-nums">
                  ₹{payload.find((p: any) => p.dataKey === `${selectedCrop}Direct`)?.value}/kg
                </span>
              </div>
              <div className="flex items-center justify-between text-[#E65100]">
                <span>Mandi Wholesale Auction:</span>
                <span className="tabular-nums">
                  ₹{payload.find((p: any) => p.dataKey === `${selectedCrop}Mandi`)?.value}/kg
                </span>
              </div>
              <div className="pt-1 border-t border-neutral-100 flex items-center justify-between text-[#3C8D5A] font-semibold text-[11px]">
                <span>Your Direct Extra Margin:</span>
                <span className="tabular-nums">
                  +₹{Number(payload.find((p: any) => p.dataKey === `${selectedCrop}Direct`)?.value || 0) -
                    Number(payload.find((p: any) => p.dataKey === `${selectedCrop}Mandi`)?.value || 0)}/kg
                </span>
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-3xl border border-[#174D35]/15 p-6 sm:p-8 shadow-xs space-y-6">
      
      {/* Header with Title and Mode Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#174D35]/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#3C8D5A] uppercase tracking-wider">
              Market Intelligence & Price Analytics
            </span>
            <span className="text-[10px] bg-[#B7D96B]/30 text-[#174D35] font-bold px-2 py-0.5 rounded">
              Top 3 Produce Trends
            </span>
          </div>
          <h3 className="text-xl font-extrabold text-[#17251C] mt-1">
            Historical Crop Price Realization
          </h3>
          <p className="text-xs text-[#7C887E] mt-0.5">
            Compare price trajectory across your primary harvest crops to identify optimal selling and harvesting windows
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Mode Switcher */}
          <div className="flex items-center p-1 bg-[#F7F8F2] rounded-xl border border-[#174D35]/10 text-xs font-semibold">
            <button
              onClick={() => setViewMode('comparison')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'comparison'
                  ? 'bg-[#174D35] text-white shadow-xs'
                  : 'text-[#17251C]/70 hover:text-[#174D35]'
              }`}
            >
              All 3 Crops Comparison
            </button>
            <button
              onClick={() => setViewMode('spread')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'spread'
                  ? 'bg-[#174D35] text-white shadow-xs'
                  : 'text-[#17251C]/70 hover:text-[#174D35]'
              }`}
            >
              Direct vs Mandi Spread
            </button>
          </div>

          {/* Timeframe Switcher */}
          <div className="flex items-center p-1 bg-[#F7F8F2] rounded-xl border border-[#174D35]/10 text-xs font-semibold">
            <button
              onClick={() => setTimeframe('monthly')}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                timeframe === 'monthly'
                  ? 'bg-white text-[#174D35] shadow-xs'
                  : 'text-[#7C887E] hover:text-[#174D35]'
              }`}
            >
              6 Months
            </button>
            <button
              onClick={() => setTimeframe('weekly')}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                timeframe === 'weekly'
                  ? 'bg-white text-[#174D35] shadow-xs'
                  : 'text-[#7C887E] hover:text-[#174D35]'
              }`}
            >
              Recent 5 Weeks
            </button>
          </div>

        </div>
      </div>

      {/* Top 3 Crops KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Crop 1: Desi Tomatoes */}
        <div
          onClick={() => {
            setSelectedCrop('tomatoes');
            if (viewMode === 'comparison') setViewMode('spread');
          }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
            selectedCrop === 'tomatoes' && viewMode === 'spread'
              ? 'bg-[#174D35]/5 border-[#174D35] ring-2 ring-[#174D35]/20 shadow-xs'
              : 'bg-white hover:bg-neutral-50/70 border-[#174D35]/15'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-sm text-[#17251C]">Desi Tomatoes</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +12%
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#174D35] tabular-nums">₹28</span>
              <span className="text-xs text-[#7C887E]">/kg (Direct)</span>
              <span className="text-xs text-orange-700 font-semibold ml-auto tabular-nums">
                Mandi: ₹20/kg
              </span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-[#7C887E]">
            <span>Spread Gain: <strong className="text-[#3C8D5A] font-bold">+₹8/kg (+40%)</strong></span>
            <span className="text-[#174D35] font-semibold flex items-center gap-0.5">
              Analyze <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Crop 2: Sharbati Wheat */}
        <div
          onClick={() => {
            setSelectedCrop('wheat');
            if (viewMode === 'comparison') setViewMode('spread');
          }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
            selectedCrop === 'wheat' && viewMode === 'spread'
              ? 'bg-[#174D35]/5 border-[#174D35] ring-2 ring-[#174D35]/20 shadow-xs'
              : 'bg-white hover:bg-neutral-50/70 border-[#174D35]/15'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-sm text-[#17251C]">Sharbati Wheat</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +7.6%
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#D97706] tabular-nums">₹42</span>
              <span className="text-xs text-[#7C887E]">/kg (Direct)</span>
              <span className="text-xs text-orange-700 font-semibold ml-auto tabular-nums">
                Mandi: ₹33/kg
              </span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-[#7C887E]">
            <span>Spread Gain: <strong className="text-[#3C8D5A] font-bold">+₹9/kg (+27%)</strong></span>
            <span className="text-[#174D35] font-semibold flex items-center gap-0.5">
              Analyze <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Crop 3: Red Onions */}
        <div
          onClick={() => {
            setSelectedCrop('onions');
            if (viewMode === 'comparison') setViewMode('spread');
          }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
            selectedCrop === 'onions' && viewMode === 'spread'
              ? 'bg-[#174D35]/5 border-[#174D35] ring-2 ring-[#174D35]/20 shadow-xs'
              : 'bg-white hover:bg-neutral-50/70 border-[#174D35]/15'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-sm text-[#17251C]">Red Sweet Onions</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +14.2%
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#059669] tabular-nums">₹32</span>
              <span className="text-xs text-[#7C887E]">/kg (Direct)</span>
              <span className="text-xs text-orange-700 font-semibold ml-auto tabular-nums">
                Mandi: ₹21/kg
              </span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-[#7C887E]">
            <span>Spread Gain: <strong className="text-[#3C8D5A] font-bold">+₹11/kg (+52%)</strong></span>
            <span className="text-[#174D35] font-semibold flex items-center gap-0.5">
              Analyze <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>

      </div>

      {/* Recharts Visualization Canvas */}
      <div className="pt-2">
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {viewMode === 'comparison' ? (
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="period" tick={{ fontSize: 12, fill: '#7C887E' }} axisLine={false} />
                <YAxis
                  tick={{ fontSize: 12, fill: '#7C887E' }}
                  axisLine={false}
                  domain={[15, 48]}
                  tickFormatter={(v) => `₹${v}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ paddingBottom: '16px', fontSize: '12px' }}
                />
                <Line
                  type="monotone"
                  name="Desi Tomatoes (Direct ₹/kg)"
                  dataKey="tomatoesDirect"
                  stroke="#174D35"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#174D35' }}
                  activeDot={{ r: 7 }}
                />
                <Line
                  type="monotone"
                  name="Sharbati Wheat (Direct ₹/kg)"
                  dataKey="wheatDirect"
                  stroke="#D97706"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#D97706' }}
                  activeDot={{ r: 7 }}
                />
                <Line
                  type="monotone"
                  name="Red Onions (Direct ₹/kg)"
                  dataKey="onionsDirect"
                  stroke="#059669"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#059669' }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            ) : (
              <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="cropDirectGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={activeCropMeta.directColor} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={activeCropMeta.directColor} stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="cropMandiGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={activeCropMeta.mandiColor} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={activeCropMeta.mandiColor} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="period" tick={{ fontSize: 12, fill: '#7C887E' }} axisLine={false} />
                <YAxis
                  tick={{ fontSize: 12, fill: '#7C887E' }}
                  axisLine={false}
                  domain={[10, 50]}
                  tickFormatter={(v) => `₹${v}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ paddingBottom: '16px', fontSize: '12px' }}
                />
                <Area
                  type="monotone"
                  name={`KrishiConnect Direct (${activeCropMeta.name})`}
                  dataKey={`${selectedCrop}Direct`}
                  stroke={activeCropMeta.directColor}
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#cropDirectGradient)"
                />
                <Area
                  type="monotone"
                  name={`APMC Mandi Auction (${activeCropMeta.name})`}
                  dataKey={`${selectedCrop}Mandi`}
                  stroke={activeCropMeta.mandiColor}
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#cropMandiGradient)"
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Pricing Advice Banner based on Trends */}
      <div className="p-4 rounded-2xl bg-[#174D35]/5 border border-[#174D35]/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#174D35] text-[#B7D96B] flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-[#174D35] flex items-center gap-1.5">
              <span>AI Harvest Timing & Pricing Advice:</span>
              <span className="text-[11px] font-normal text-[#7C887E]">({activeCropMeta.name})</span>
            </div>
            <p className="text-[#17251C]/90 mt-0.5 leading-relaxed">
              {activeCropMeta.recommendation}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 text-right self-end sm:self-center">
          <div className="text-[11px] text-[#7C887E]">
            6-Month High: <strong className="text-[#17251C]">{activeCropMeta.high6m}</strong> · Low: <strong className="text-[#17251C]">{activeCropMeta.low6m}</strong>
          </div>
        </div>
      </div>

    </div>
  );
};
