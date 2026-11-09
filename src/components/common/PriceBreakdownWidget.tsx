import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, XCircle, TrendingUp, Sparkles } from 'lucide-react';

interface PriceBreakdownWidgetProps {
  productName?: string;
  farmerPrice?: number;
  unit?: string;
}

export const PriceBreakdownWidget: React.FC<PriceBreakdownWidgetProps> = ({
  productName = 'Organic Vine Tomatoes',
  farmerPrice = 28,
  unit = 'kg',
}) => {
  const [selectedCrop, setSelectedCrop] = useState('tomatoes');

  // Pre-configured comparison profiles based on MP mandis
  const cropData: Record<string, { name: string; tradConsumer: number; tradFarmer: number; kcFarmer: number; kcFee: number; kcLogistics: number; unit: string }> = {
    tomatoes: {
      name: 'Desi Tomatoes',
      tradConsumer: 60,
      tradFarmer: 30,
      kcFarmer: 40,
      kcFee: 2,
      kcLogistics: 3,
      unit: 'kg',
    },
    wheat: {
      name: 'Sharbati Wheat',
      tradConsumer: 58,
      tradFarmer: 32,
      kcFarmer: 44,
      kcFee: 1.5,
      kcLogistics: 2.5,
      unit: 'kg',
    },
    onions: {
      name: 'Red Onions',
      tradConsumer: 45,
      tradFarmer: 18,
      kcFarmer: 30,
      kcFee: 1.5,
      kcLogistics: 2.5,
      unit: 'kg',
    },
    peas: {
      name: 'Green Peas (Matar)',
      tradConsumer: 80,
      tradFarmer: 42,
      kcFarmer: 60,
      kcFee: 3,
      kcLogistics: 5,
      unit: 'kg',
    },
  };

  const current = cropData[selectedCrop] || cropData.tomatoes;
  const kcConsumerTotal = current.kcFarmer + current.kcFee + current.kcLogistics;
  const consumerSavingsPercent = Math.round(((current.tradConsumer - kcConsumerTotal) / current.tradConsumer) * 100);
  const farmerExtraPercent = Math.round(((current.kcFarmer - current.tradFarmer) / current.tradFarmer) * 100);

  return (
    <div className="bg-white rounded-2xl border border-[#174D35]/15 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#174D35]/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#3C8D5A] uppercase tracking-wider">
              Transparent Economic Model
            </span>
            <span className="text-[10px] bg-[#B7D96B]/30 text-[#174D35] font-semibold px-2 py-0.5 rounded">
              Audited Direct Spread
            </span>
          </div>
          <h3 className="text-lg font-bold text-[#17251C] mt-1">
            Where Does Every Rupee Go?
          </h3>
        </div>

        {/* Crop Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F7F8F2] rounded-xl border border-[#174D35]/10">
          {Object.entries(cropData).map(([key, item]) => (
            <button
              key={key}
              onClick={() => setSelectedCrop(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCrop === key
                  ? 'bg-[#174D35] text-white shadow-xs'
                  : 'text-[#17251C]/70 hover:text-[#174D35]'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      {/* Side-by-Side Comparison Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        
        {/* Traditional Mandi Model */}
        <div className="p-5 rounded-xl border border-red-200/80 bg-red-50/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-red-900 uppercase tracking-wider flex items-center gap-1">
                <XCircle className="w-4 h-4 text-red-600" />
                Traditional Multi-Tier Mandi
              </span>
              <span className="text-[11px] text-red-700 font-semibold bg-red-100 px-2 py-0.5 rounded">
                4-5 Intermediaries
              </span>
            </div>

            <div className="space-y-3 text-xs mb-5">
              <div className="flex justify-between items-center py-1.5 border-b border-red-100">
                <span className="text-slate-600">Farmer Sells to Village Aggregator</span>
                <span className="font-bold text-slate-800 tabular-nums">₹{current.tradFarmer}/{current.unit}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-red-100">
                <span className="text-slate-600">APMC Mandi Commission & Cess</span>
                <span className="font-medium text-slate-600 tabular-nums">+₹7/{current.unit}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-red-100">
                <span className="text-slate-600">Wholesale Trader Speculation Margin</span>
                <span className="font-medium text-slate-600 tabular-nums">+₹11/{current.unit}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-red-100">
                <span className="text-slate-600">Retail City Pushcart & Wastage Buffer</span>
                <span className="font-medium text-slate-600 tabular-nums">+₹12/{current.unit}</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-lg border border-red-200 text-center">
            <div className="text-[11px] text-slate-500 font-medium">Consumer Final Price Paid</div>
            <div className="text-xl font-bold text-red-700 tabular-nums">₹{current.tradConsumer}/{current.unit}</div>
            <div className="text-[10px] text-red-600 mt-1">
              Farmer only captures {Math.round((current.tradFarmer / current.tradConsumer) * 100)}% of consumer rupee.
            </div>
          </div>
        </div>

        {/* KrishiConnect Direct Model */}
        <div className="p-5 rounded-xl border-2 border-[#174D35] bg-[#174D35]/5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#174D35] uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-[#3C8D5A]" />
                KrishiConnect Direct Trade
              </span>
              <span className="text-[11px] text-[#174D35] font-bold bg-[#B7D96B] px-2 py-0.5 rounded">
                Direct Farm-to-Consumer
              </span>
            </div>

            <div className="space-y-3 text-xs mb-5">
              <div className="flex justify-between items-center py-1.5 border-b border-[#174D35]/15">
                <span className="text-[#174D35] font-bold">Farmer Net Take-Home</span>
                <span className="font-extrabold text-[#174D35] text-sm tabular-nums">₹{current.kcFarmer}/{current.unit}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-[#174D35]/15">
                <span className="text-slate-600">Refrigerated Farm-Gate Logistics</span>
                <span className="font-medium text-slate-700 tabular-nums">₹{current.kcLogistics}/{current.unit}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-[#174D35]/15">
                <span className="text-slate-600">KrishiConnect QA, Lab Testing & Platform</span>
                <span className="font-medium text-slate-700 tabular-nums">₹{current.kcFee}/{current.unit}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-[#174D35]/15">
                <span className="text-slate-500 italic">Middleman Brokerage & Commissions</span>
                <span className="font-bold text-[#3C8D5A] tabular-nums">₹0 (Eliminated)</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-lg border border-[#174D35]/30 text-center shadow-xs">
            <div className="text-[11px] text-[#7C887E] font-medium">Consumer Direct Price Paid</div>
            <div className="text-2xl font-black text-[#174D35] tabular-nums">₹{kcConsumerTotal}/{current.unit}</div>
            <div className="text-[11px] text-[#3C8D5A] font-bold mt-1 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Farmer receives {Math.round((current.kcFarmer / kcConsumerTotal) * 100)}% of consumer rupee!
            </div>
          </div>
        </div>

      </div>

      {/* Outcome KPI highlights */}
      <div className="mt-6 p-4 rounded-xl bg-[#174D35] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#B7D96B] text-[#174D35] flex items-center justify-center font-bold shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-[#B7D96B] font-semibold uppercase">Win-Win Impact Calculation</div>
            <div className="text-sm font-bold">
              Consumer saves {consumerSavingsPercent}% while Farmer earns +{farmerExtraPercent}% more
            </div>
          </div>
        </div>

        <div className="text-right text-[11px] text-white/70">
          Illustrative economics benchmarked against APMC Bhopal wholesale averages (Nov 2026).
        </div>
      </div>

    </div>
  );
};
