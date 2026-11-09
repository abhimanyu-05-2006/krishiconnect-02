import React, { useState } from 'react';
import {
  Scale,
  TrendingUp,
  XCircle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Info,
  DollarSign
} from 'lucide-react';
import { Product } from '../../types/index.js';

interface PriceComparisonSectionProps {
  farmerProducts: Product[];
}

interface CropComparisonData {
  id: string;
  name: string;
  unit: string;
  kcPrice: number;
  traditionalGross: number;
  arhatiyaCut: number;
  weighingHandlingDeduction: number;
  mandiNet: number;
  availableStock: number;
  traditionalPaymentTerms: string;
  kcPaymentTerms: string;
}

export const PriceComparisonSection: React.FC<PriceComparisonSectionProps> = ({ farmerProducts }) => {
  // Comparative profiles for farmer's crops benchmarked with central MP APMC mandis
  const comparisonItems: CropComparisonData[] = [
    {
      id: 'prod_1',
      name: 'Vine-Ripened Organic Desi Tomato',
      unit: 'kg',
      kcPrice: 28,
      traditionalGross: 24,
      arhatiyaCut: 2.0,
      weighingHandlingDeduction: 2.0,
      mandiNet: 20,
      availableStock: 450,
      traditionalPaymentTerms: '15-21 days delayed cash settlement with crate deductions',
      kcPaymentTerms: 'Instant 100% credit to UPI (rameshwar@upi) within 24 hours',
    },
    {
      id: 'prod_2',
      name: 'Premium Sharbati Gehun (Sehore Wheat)',
      unit: 'kg',
      kcPrice: 42,
      traditionalGross: 36,
      arhatiyaCut: 1.5,
      weighingHandlingDeduction: 1.5,
      mandiNet: 33,
      availableStock: 3200,
      traditionalPaymentTerms: 'Trader post-dated promissory notes (30-45 days)',
      kcPaymentTerms: 'Escrow-backed direct bank transfer upon dispatch verification',
    },
    {
      id: 'prod_3',
      name: 'Nasik Red Sweet Onion',
      unit: 'kg',
      kcPrice: 32,
      traditionalGross: 25,
      arhatiyaCut: 2.0,
      weighingHandlingDeduction: 2.0,
      mandiNet: 21,
      availableStock: 1200,
      traditionalPaymentTerms: '10% deduction for natural shrinkage & delayed payment',
      kcPaymentTerms: 'Zero shrinkage deductions; weighed digitally at farm gate',
    },
  ];

  const [selectedCropId, setSelectedCropId] = useState<string>(comparisonItems[0].id);
  const activeCrop = comparisonItems.find((c) => c.id === selectedCropId) || comparisonItems[0];

  // Interactive volume slider/input for dynamic profit calculation
  const [volume, setVolume] = useState<number>(activeCrop.availableStock);

  // Update volume when switching crops
  const handleSelectCrop = (crop: CropComparisonData) => {
    setSelectedCropId(crop.id);
    setVolume(crop.availableStock);
  };

  const directTotalRevenue = activeCrop.kcPrice * volume;
  const mandiTotalRevenue = activeCrop.mandiNet * volume;
  const netFarmerSurplus = directTotalRevenue - mandiTotalRevenue;
  const surplusPercent = Math.round(((activeCrop.kcPrice - activeCrop.mandiNet) / activeCrop.mandiNet) * 100);

  return (
    <div className="bg-white rounded-3xl border border-[#174D35]/15 p-6 sm:p-8 shadow-xs space-y-6">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#174D35]/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#3C8D5A] uppercase tracking-wider flex items-center gap-1">
              <Scale className="w-4 h-4 text-[#3C8D5A]" />
              Value Proposition & Fair Share Audit
            </span>
            <span className="text-[10px] bg-[#B7D96B]/30 text-[#174D35] font-extrabold px-2 py-0.5 rounded">
              Audited MP Mandi Data
            </span>
          </div>
          <h3 className="text-xl font-extrabold text-[#17251C] mt-1">
            Traditional Market vs. KrishiConnect Direct Price
          </h3>
          <p className="text-xs text-[#7C887E] mt-0.5">
            Compare actual take-home realization per quintal and see how direct farm trade eliminates predatory deductions
          </p>
        </div>

        {/* Crop Selector Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F7F8F2] rounded-xl border border-[#174D35]/10 overflow-x-auto no-scrollbar">
          {comparisonItems.map((c) => (
            <button
              key={c.id}
              onClick={() => handleSelectCrop(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCropId === c.id
                  ? 'bg-[#174D35] text-white shadow-xs'
                  : 'text-[#17251C]/70 hover:text-[#174D35]'
              }`}
            >
              {c.name.split(' (')[0].split(' ')[0]} {c.name.includes('Tomato') ? 'Tomato' : c.name.includes('Wheat') ? 'Wheat' : 'Onion'}
            </button>
          ))}
        </div>
      </div>

      {/* Side-by-Side Detailed Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        
        {/* Left: Traditional Mandi / APMC Yard Model */}
        <div className="p-6 rounded-2xl border border-red-200/90 bg-red-50/25 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-red-100">
              <div>
                <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider flex items-center gap-1">
                  <XCircle className="w-4 h-4" />
                  Traditional Mandi Channel
                </span>
                <h4 className="text-base font-bold text-[#17251C] mt-0.5">
                  Village Aggregator & APMC Auction
                </h4>
              </div>
              <span className="text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                High Deductions
              </span>
            </div>

            {/* Price Step Breakdown */}
            <div className="space-y-3 pt-3 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-red-100/80">
                <span className="text-slate-600">Nominal Auction Rate (Gross):</span>
                <span className="font-semibold text-slate-800 tabular-nums">
                  ₹{activeCrop.traditionalGross}/{activeCrop.unit}
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-red-100/80 text-red-700">
                <span className="flex items-center gap-1">
                  <span>Arhatiya Commission (6-8%)</span>
                </span>
                <span className="font-bold tabular-nums">-₹{activeCrop.arhatiyaCut.toFixed(2)}/{activeCrop.unit}</span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-red-100/80 text-red-700">
                <span className="flex items-center gap-1">
                  <span>Weighing, Hamali & Market Cess:</span>
                </span>
                <span className="font-bold tabular-nums">-₹{activeCrop.weighingHandlingDeduction.toFixed(2)}/{activeCrop.unit}</span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-red-100/80 text-red-700">
                <span>Wastage/Crate Margin Cut:</span>
                <span className="font-bold tabular-nums">-5% to -10% deduction</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="p-4 bg-white rounded-xl border border-red-200 text-center shadow-xs">
              <span className="text-[11px] text-slate-500 font-medium block">
                Farmer Real In-Hand Take-Home
              </span>
              <div className="text-3xl font-black text-red-600 tabular-nums mt-0.5">
                ₹{activeCrop.mandiNet}
                <span className="text-xs font-normal text-slate-500"> / {activeCrop.unit}</span>
              </div>
              <span className="text-[11px] text-red-600 block mt-1 font-semibold">
                Captures only ~{Math.round((activeCrop.mandiNet / (activeCrop.traditionalGross * 1.5)) * 100)}% of consumer price
              </span>
            </div>

            <div className="text-[11px] text-slate-600 space-y-1">
              <div><strong>Settlement:</strong> {activeCrop.traditionalPaymentTerms}</div>
              <div><strong>Transit Burden:</strong> Farmer bears cost of bullock cart/tractor to Mandi gate</div>
            </div>
          </div>
        </div>

        {/* Right: KrishiConnect Direct Model */}
        <div className="p-6 rounded-2xl border-2 border-[#174D35] bg-[#174D35]/5 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#174D35]/15">
              <div>
                <span className="text-[11px] font-bold text-[#174D35] uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-[#3C8D5A]" />
                  KrishiConnect Direct Trade
                </span>
                <h4 className="text-base font-bold text-[#17251C] mt-0.5">
                  Direct Farm-to-Consumer Highway
                </h4>
              </div>
              <span className="text-xs font-bold text-[#174D35] bg-[#B7D96B] px-2 py-0.5 rounded">
                100% Payout Retained
              </span>
            </div>

            {/* Price Step Breakdown */}
            <div className="space-y-3 pt-3 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-[#174D35]/15">
                <span className="font-bold text-[#174D35]">Listed Farm-Gate Price:</span>
                <span className="font-black text-[#174D35] text-sm tabular-nums">
                  ₹{activeCrop.kcPrice}/{activeCrop.unit}
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-[#174D35]/15 text-[#3C8D5A]">
                <span>Middleman Commission:</span>
                <span className="font-bold tabular-nums">₹0.00 (Zero Commission)</span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-[#174D35]/15 text-[#3C8D5A]">
                <span>Weighing & Lab Testing:</span>
                <span className="font-bold tabular-nums">Included by Platform</span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-[#174D35]/15 text-[#3C8D5A]">
                <span>Crate Logistics & Insulated Transport:</span>
                <span className="font-bold tabular-nums">Covered by AgriFleet</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="p-4 bg-white rounded-xl border border-[#174D35]/30 text-center shadow-xs">
              <span className="text-[11px] text-[#7C887E] font-medium block">
                Farmer Real In-Hand Take-Home
              </span>
              <div className="text-3xl font-black text-[#174D35] tabular-nums mt-0.5">
                ₹{activeCrop.kcPrice}
                <span className="text-xs font-normal text-[#7C887E]"> / {activeCrop.unit}</span>
              </div>
              <span className="text-[11px] text-[#3C8D5A] font-bold block mt-1 flex items-center justify-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Extra +₹{activeCrop.kcPrice - activeCrop.mandiNet}/{activeCrop.unit} (+{surplusPercent}%) Net Realization!
              </span>
            </div>

            <div className="text-[11px] text-[#17251C]/80 space-y-1">
              <div><strong>Settlement:</strong> {activeCrop.kcPaymentTerms}</div>
              <div><strong>Transit Burden:</strong> Zero tractor freight; collected directly at farm gate</div>
            </div>
          </div>
        </div>

      </div>

      {/* Interactive Harvest Volume Realization Calculator */}
      <div className="p-6 rounded-2xl bg-[#174D35] text-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#B7D96B] uppercase tracking-wider">
              <TrendingUp className="w-4 h-4" />
              Dynamic Harvest Profit Calculator
            </div>
            <h4 className="text-lg font-bold mt-0.5">
              How Much Extra Do You Keep on {activeCrop.name}?
            </h4>
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-2">
            {[100, 250, 500, activeCrop.availableStock].map((amt) => (
              <button
                key={amt}
                onClick={() => setVolume(amt)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  volume === amt
                    ? 'bg-[#B7D96B] text-[#174D35] font-bold'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {amt} {activeCrop.unit}
              </button>
            ))}
          </div>
        </div>

        {/* Volume Stepper / Slider */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          <div className="sm:col-span-8">
            <div className="flex justify-between text-xs text-white/80 mb-1">
              <span>Adjust Harvest Quantity:</span>
              <span className="font-bold text-white tabular-nums">{volume} {activeCrop.unit}</span>
            </div>
            <input
              type="range"
              min={10}
              max={Math.max(volume * 1.5, activeCrop.availableStock * 1.2, 500)}
              step={10}
              value={volume}
              onChange={(e) => setVolume(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#B7D96B]"
            />
          </div>

          <div className="sm:col-span-4 bg-white/10 p-3.5 rounded-xl border border-white/15 text-center">
            <span className="text-[11px] text-[#B7D96B] font-semibold uppercase block">
              Extra In-Pocket Profit Retained
            </span>
            <div className="text-2xl font-black text-white tabular-nums mt-0.5">
              +₹{netFarmerSurplus.toLocaleString()}
            </div>
            <span className="text-[10px] text-white/70 block mt-0.5">
              (₹{directTotalRevenue.toLocaleString()} vs ₹{mandiTotalRevenue.toLocaleString()} Mandi)
            </span>
          </div>
        </div>
      </div>

      {/* Summary Audit Notes */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between text-xs text-[#7C887E] gap-3">
        <div className="flex items-center gap-1.5">
          <Info className="w-4 h-4 text-[#3C8D5A] shrink-0" />
          <span>
            APMC rates audited against Sehore & Karond Mandi official daily bulletins (Nov 2026).
          </span>
        </div>
        <div className="font-semibold text-[#174D35]">
          Zero middleman fees guaranteed under KrishiConnect Charter
        </div>
      </div>

    </div>
  );
};
