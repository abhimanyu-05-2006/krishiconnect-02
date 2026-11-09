import React from 'react';
import {
  Wheat,
  ShoppingBag,
  Truck,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.js';

interface HowItWorksPageProps {
  setCurrentView: (view: string) => void;
  openAiChat: () => void;
  onBack?: () => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ setCurrentView, openAiChat, onBack }) => {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Back button row */}
      {onBack && (
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-[#174D35]/15 text-xs font-bold text-[#174D35] hover:bg-[#174D35]/10 transition-all shadow-2xs group cursor-pointer"
            title={t('btn_back')}
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>{t('btn_back')}</span>
          </button>
        </div>
      )}

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-[#3C8D5A] uppercase tracking-wider">
          Transparent Agri-Commerce
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#17251C]">
          The Direct Farm-to-Consumer Highway
        </h1>
        <p className="text-sm text-[#7C887E] leading-relaxed">
          How KrishiConnect replaces 5 stages of traditional mandi intermediaries with real-time AI pricing, farm-gate quality grading, and direct 18-hour logistics.
        </p>
      </div>

      {/* Comparison Grid: Traditional vs KrishiConnect */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Old System */}
        <div className="p-8 rounded-3xl bg-white border border-red-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-red-100">
            <div>
              <span className="text-xs font-bold text-red-600 uppercase tracking-wider">The Legacy Model</span>
              <h3 className="text-xl font-bold text-[#17251C]">Traditional Mandi System</h3>
            </div>
            <span className="text-xs bg-red-100 text-red-800 font-bold px-2.5 py-1 rounded-full">
              48 - 72 Hours Old
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-red-100 text-red-700 font-bold flex items-center justify-center shrink-0">1</span>
              <div>
                <strong className="text-slate-800">Village Middleman (Kachha Arhatiya):</strong>
                <p className="text-slate-600 mt-0.5">Under-weighs harvest, deducts 10-15% handling loss, charges high interest on crop loans.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-red-100 text-red-700 font-bold flex items-center justify-center shrink-0">2</span>
              <div>
                <strong className="text-slate-800">APMC Commission Agent (Pakka Arhatiya):</strong>
                <p className="text-slate-600 mt-0.5">Auction cartels depress auction rates; farmer pays market fees, unloading charges, and crate rentals.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-red-100 text-red-700 font-bold flex items-center justify-center shrink-0">3</span>
              <div>
                <strong className="text-slate-800">Secondary Wholesale Speculators:</strong>
                <p className="text-slate-600 mt-0.5">Hold goods in non-refrigerated sheds, artificially creating scarcity to boost consumer prices.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-red-100 text-red-700 font-bold flex items-center justify-center shrink-0">4</span>
              <div>
                <strong className="text-slate-800">City Retail Vendors & Pushcarts:</strong>
                <p className="text-slate-600 mt-0.5">Add 30-40% margin to cover high rotting loss (25% post-harvest spoilage).</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-red-50 text-red-800 text-xs font-semibold text-center">
            Outcome: Farmer receives ₹30/kg; Consumer pays ₹60/kg for wilted, multi-day-old produce.
          </div>
        </div>

        {/* KrishiConnect Direct */}
        <div className="p-8 rounded-3xl bg-[#174D35] text-white shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <span className="text-xs font-bold text-[#B7D96B] uppercase tracking-wider">KrishiConnect Architecture</span>
              <h3 className="text-xl font-bold text-white">Direct Sovereign Trade</h3>
            </div>
            <span className="text-xs bg-[#B7D96B] text-[#174D35] font-extrabold px-2.5 py-1 rounded-full">
              &lt; 18 Hours Fresh
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-[#B7D96B] text-[#174D35] font-bold flex items-center justify-center shrink-0">1</span>
              <div>
                <strong className="text-white">AI-Powered Fair Price Discovery:</strong>
                <p className="text-white/80 mt-0.5">Gemini AI analyzes central MP market trends so farmers price transparently without exploitation.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-[#B7D96B] text-[#174D35] font-bold flex items-center justify-center shrink-0">2</span>
              <div>
                <strong className="text-white">Harvest-On-Demand Ordering:</strong>
                <p className="text-white/80 mt-0.5">Buyers order directly from the farmer's listing; crop is only harvested once confirmed.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-[#B7D96B] text-[#174D35] font-bold flex items-center justify-center shrink-0">3</span>
              <div>
                <strong className="text-white">Farm-Gate QA & Cold AgriFleet:</strong>
                <p className="text-white/80 mt-0.5">Insulated vehicles pick up crates directly at farm hubs in Sehore, Vidisha and Raisen.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-[#B7D96B] text-[#174D35] font-bold flex items-center justify-center shrink-0">4</span>
              <div>
                <strong className="text-white">Instant UPI Settlement:</strong>
                <p className="text-white/80 mt-0.5">Farmer receives full 100% produce cost within 24 hours of successful delivery.</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/10 text-[#B7D96B] text-xs font-semibold text-center border border-white/15">
            Outcome: Farmer receives ₹40/kg (+33% extra income); Consumer pays ₹45/kg (25% saving).
          </div>
        </div>

      </div>

      {/* Logistics & Cold-Chain Feature Spotlight */}
      <div className="rounded-3xl bg-white border border-[#174D35]/15 overflow-hidden shadow-xs grid grid-cols-1 md:grid-cols-2 items-center">
        <img
          src="/src/assets/images/logistics_farm_delivery_1793946354440.jpg"
          alt="AgriFleet logistics loading farm fresh produce in rural collection center"
          className="w-full h-80 object-cover"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/assets/images/logistics_farm_delivery_1793946354440.jpg';
          }}
        />
        <div className="p-8 space-y-4">
          <span className="text-xs font-bold text-[#3C8D5A] uppercase tracking-wider">
            Cold-Chain AgriFleet
          </span>
          <h3 className="text-2xl font-bold text-[#17251C]">
            From Rural Soil to City Table within 18 Hours
          </h3>
          <p className="text-xs text-[#7C887E] leading-relaxed">
            Our refrigerated vehicles operate daily routes across Madhya Pradesh. Vegetables picked at dawn in Sehore are delivered to Arera Colony and MP Nagar kitchens before dinner.
          </p>
          <div className="pt-2 flex items-center gap-4">
            <button
              onClick={() => setCurrentView('marketplace')}
              className="px-5 py-2.5 rounded-xl bg-[#174D35] text-white font-bold text-xs hover:bg-[#123b28] transition-colors"
            >
              Order Farm Produce
            </button>
            <button
              onClick={openAiChat}
              className="px-5 py-2.5 rounded-xl bg-[#F7F8F2] text-[#174D35] font-bold text-xs border border-[#174D35]/20 hover:bg-white transition-colors"
            >
              Ask AI Assistant
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
