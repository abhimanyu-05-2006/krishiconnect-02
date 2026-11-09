import React from 'react';
import { PriceBreakdownWidget } from '../components/common/PriceBreakdownWidget.js';
import { ShieldCheck, ArrowRight, ArrowLeft, TrendingUp, DollarSign, Scale, Percent } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.js';

interface PriceTransparencyPageProps {
  setCurrentView: (view: string) => void;
  onBack?: () => void;
}

export const PriceTransparencyPage: React.FC<PriceTransparencyPageProps> = ({ setCurrentView, onBack }) => {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
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
      <div className="bg-white rounded-2xl border border-[#174D35]/15 p-8 shadow-xs max-w-4xl mx-auto text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#174D35]/10 text-[#174D35] text-xs font-bold">
          <Scale className="w-4 h-4 text-[#3C8D5A]" />
          Audited Economic Model
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#17251C]">
          Radical Price Transparency
        </h1>
        <p className="text-sm text-[#7C887E] max-w-2xl mx-auto leading-relaxed">
          Every rupee spent on KrishiConnect is fully accounted for. Unlike opaque mandis where farmers receive less than 50% of retail rates, our direct architecture returns up to 90% directly to the soil.
        </p>
      </div>

      {/* Interactive Price Comparison Breakdown Widget */}
      <div className="max-w-5xl mx-auto">
        <PriceBreakdownWidget />
      </div>

      {/* Detailed Cost Component Anatomy */}
      <div className="max-w-5xl mx-auto space-y-6">
        <h3 className="text-xl font-bold text-[#17251C]">Anatomy of a KrishiConnect Order</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-[#174D35]/15 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#174D35] text-[#B7D96B] font-extrabold flex items-center justify-center text-sm">
              90%
            </div>
            <h4 className="font-bold text-base text-[#17251C]">Direct Farmer Earnings</h4>
            <p className="text-xs text-[#7C887E] leading-relaxed">
              100% of the listed farm gate product cost goes directly to the grower’s linked bank account or UPI within 24 hours of fulfillment.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#174D35]/15 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#3C8D5A] text-white font-extrabold flex items-center justify-center text-sm">
              7%
            </div>
            <h4 className="font-bold text-base text-[#17251C]">Farm-Gate Cold Logistics</h4>
            <p className="text-xs text-[#7C887E] leading-relaxed">
              Covers insulated transport, driver partner earnings, and farm collection crates to preserve morning moisture without chemical sprays.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#174D35]/15 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#B7D96B] text-[#174D35] font-extrabold flex items-center justify-center text-sm">
              3%
            </div>
            <h4 className="font-bold text-base text-[#17251C]">KrishiConnect Platform & QA</h4>
            <p className="text-xs text-[#7C887E] leading-relaxed">
              Funds lab residue testing, Gemini AI market models, software infrastructure, customer support, and Transit Protection Pools.
            </p>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="max-w-4xl mx-auto p-8 rounded-3xl bg-[#174D35] text-white text-center space-y-4">
        <h3 className="text-2xl font-bold">Support Direct Agriculture Today</h3>
        <p className="text-xs text-white/80 max-w-lg mx-auto">
          Start ordering freshly plucked farm produce and ensure your food expenditure goes to hardworking Indian farming families.
        </p>
        <button
          onClick={() => setCurrentView('marketplace')}
          className="px-6 py-3 rounded-xl bg-[#B7D96B] text-[#174D35] font-bold text-xs hover:bg-[#a6cb58] transition-colors inline-flex items-center gap-2 shadow"
        >
          <span>Explore Fresh Harvest</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
