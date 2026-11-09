import { ShieldCheck, HeartHandshake, Leaf, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.js';
import { Logo } from '../brand/Logo.js';

interface FooterProps {
  setCurrentView: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentView }) => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#17251C] text-[#F7F8F2] pt-16 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-white/10">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#174D35] text-[#B7D96B] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">{t('footer_guarantee_title')}</h4>
              <p className="text-xs text-[#7C887E] mt-1 leading-relaxed">
                {t('footer_guarantee_desc')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#174D35] text-[#B7D96B] flex items-center justify-center shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">{t('footer_payout_title')}</h4>
              <p className="text-xs text-[#7C887E] mt-1 leading-relaxed">
                {t('footer_payout_desc')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#174D35] text-[#B7D96B] flex items-center justify-center shrink-0">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">{t('footer_transit_title')}</h4>
              <p className="text-xs text-[#7C887E] mt-1 leading-relaxed">
                {t('footer_transit_desc')}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-12 border-b border-white/10 text-xs text-[#7C887E]">
          
          <div className="col-span-2">
            <div
              className="mb-3 cursor-pointer inline-flex items-center bg-white/95 px-3 py-1.5 rounded-xl border border-white/20 shadow-sm"
              onClick={() => setCurrentView('landing')}
              title="KrishiConnect Home"
            >
              <Logo size="xs" theme="light" />
            </div>
            <p className="text-xs leading-relaxed max-w-sm mb-4 text-[#7C887E]">
              {t('footer_about_text')}
            </p>
            <div className="text-[11px] text-white/50">
              Operational Hubs: Sehore · Bhopal · Raisen · Vidisha · Hoshangabad · Dewas
            </div>
          </div>

          <div>
            <h5 className="font-semibold text-white mb-3 uppercase tracking-wider text-[11px]">Marketplace</h5>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setCurrentView('marketplace')} className="hover:text-white transition-colors">
                  Fresh Vegetables
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('marketplace')} className="hover:text-white transition-colors">
                  Sharbati Wheat & Grains
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('marketplace')} className="hover:text-white transition-colors">
                  Desi Cow Dairy & A2 Milk
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('marketplace')} className="hover:text-white transition-colors">
                  Certified Organic Produce
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-white mb-3 uppercase tracking-wider text-[11px]">Platform</h5>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setCurrentView('farmers')} className="hover:text-white transition-colors">
                  Verified Farmer Directory
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('reviews')} className="hover:text-white transition-colors">
                  360° Stakeholder Reviews
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('transparency')} className="hover:text-white transition-colors">
                  Price Transparency Audit
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('how-it-works')} className="hover:text-white transition-colors">
                  Supply Chain Architecture
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('farmer-dashboard')} className="hover:text-white transition-colors">
                  Farmer Portal
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-white mb-3 uppercase tracking-wider text-[11px]">Institutional</h5>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setCurrentView('retailer-dashboard')} className="hover:text-white transition-colors">
                  Bulk Purchasing for Retailers
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('delivery-dashboard')} className="hover:text-white transition-colors">
                  AgriFleet Partner Portal
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('admin-dashboard')} className="hover:text-white transition-colors">
                  Admin Oversight & Moderation
                </button>
              </li>
              <li className="flex items-center gap-1 text-[#B7D96B]">
                <span>NPOP Organic Standard</span>
                <ArrowUpRight className="w-3 h-3" />
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright & Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#7C887E] gap-4">
          <p>© {new Date().getFullYear()} KrishiConnect AgriTech Private Limited. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Illustrative comparison figures based on central Indian agricultural APMC indices.</span>
            <span>Bhopal, MP</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
