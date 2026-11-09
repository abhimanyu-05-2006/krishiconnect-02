import React, { useState } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  MapPin,
  Clock,
  ChevronRight,
  TrendingUp,
  Award,
  Users,
  Wheat,
  ShoppingBag,
  Star,
  CheckCircle,
  Smartphone,
  Store,
  UserCheck,
  MessageSquare
} from 'lucide-react';
import { Farm3DVisual } from '../components/3d/Farm3DVisual.js';
import { PriceBreakdownWidget } from '../components/common/PriceBreakdownWidget.js';
import { Product, FarmerProfile, User } from '../types/index.js';
import { useCart } from '../context/CartContext.js';
import { useLanguage } from '../context/LanguageContext.js';
import { StakeholderMap } from '../components/maps/StakeholderMap.js';

interface LandingPageProps {
  setCurrentView: (view: string) => void;
  products: Product[];
  farmers: FarmerProfile[];
  users?: User[];
  onSelectProduct: (product: Product) => void;
  onSelectFarmer: (farmer: FarmerProfile) => void;
  openAiChat: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  setCurrentView,
  products,
  farmers,
  users = [],
  onSelectProduct,
  onSelectFarmer,
  openAiChat,
}) => {
  const { addToCart } = useCart();
  const { t, lang } = useLanguage();
  const [selectedHub, setSelectedHub] = useState('All');

  const hubs = ['All', 'Sehore', 'Bhopal', 'Vidisha', 'Raisen', 'Hoshangabad'];

  const filteredFeaturedProducts = products
    .filter((p) => selectedHub === 'All' || p.district.toLowerCase() === selectedHub.toLowerCase())
    .slice(0, 4);

  return (
    <div className="space-y-20 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-6 pb-12 sm:pt-10 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Main 2-column Hero Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Region Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#174D35]/10 border border-[#174D35]/15 text-xs font-semibold text-[#174D35]">
                <MapPin className="w-3.5 h-3.5 text-[#3C8D5A]" />
                <span>{t('hero_region_pill')}</span>
              </div>

              {/* Display Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#17251C] leading-[1.12] text-balance">
                {t('hero_headline_1')} <br />
                <span className="text-[#174D35]">{t('hero_headline_2')}</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-[#17251C]/80 leading-relaxed max-w-xl">
                {t('hero_subtitle')}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => setCurrentView('marketplace')}
                  className="px-6 py-3.5 rounded-xl bg-[#174D35] text-white font-bold text-sm hover:bg-[#123b28] transition-all flex items-center gap-2 shadow-sm group"
                >
                  <ShoppingBag className="w-4 h-4 text-[#B7D96B]" />
                  <span>{t('btn_shop_produce')}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => setCurrentView('farmer-dashboard')}
                  className="px-6 py-3.5 rounded-xl bg-white border border-[#174D35]/25 text-[#174D35] font-bold text-sm hover:bg-[#F7F8F2] transition-colors flex items-center gap-2"
                >
                  <Wheat className="w-4 h-4 text-[#3C8D5A]" />
                  <span>{t('btn_become_farmer')}</span>
                </button>
              </div>

              {/* Trust Badges Bar */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-[#174D35]/15 text-xs text-[#17251C]/80">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#3C8D5A] shrink-0" />
                  <span className="font-semibold">{t('trust_npop')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#3C8D5A] shrink-0" />
                  <span className="font-semibold">{t('trust_farmer_share')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#3C8D5A] shrink-0" />
                  <span className="font-semibold">{t('trust_under_18h')}</span>
                </div>
              </div>

            </div>

            {/* Right Media Column: Real Generated Editorial Photography with Selective 3D Overlay */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-white/80 bg-white">
                <img
                  src="/src/assets/images/hero_farmer_harvest_1793946351765.jpg"
                  alt="Proud farmer harvesting fresh organic produce in Madhya Pradesh"
                  className="w-full h-[420px] object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/images/hero_farmer_harvest_1793946351765.jpg';
                  }}
                />

                {/* Scrim overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

                {/* Selective 3D Floating Produce Visual in Top Right */}
                <div className="absolute top-3 right-3 w-32 h-32 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 overflow-hidden shadow-lg pointer-events-auto">
                  <Farm3DVisual />
                  <span className="absolute bottom-1.5 left-2 text-[9px] font-bold text-white/80 uppercase tracking-widest pointer-events-none">
                    3D Harvest Hub
                  </span>
                </div>

                {/* Editorial Caption Tag */}
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#174D35] text-[#B7D96B] text-[11px] font-bold mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    Verified Farmer · Sehore Hub
                  </div>
                  <h4 className="text-base font-bold leading-snug">
                    Rameshwar Patidar harvesting grade-A vine tomatoes
                  </h4>
                  <p className="text-xs text-white/80 mt-1">
                    Direct harvest price: ₹28/kg (Supermarkets sell at ₹55/kg)
                  </p>
                </div>
              </div>

              {/* Floating Stat Card */}
              <div className="absolute -bottom-6 -left-4 sm:left-4 bg-white p-3.5 rounded-2xl border border-[#174D35]/15 shadow-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#3C8D5A] text-white flex items-center justify-center font-black">
                  ₹
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-[#7C887E]">{t('stat_farmer_realization')}</div>
                  <div className="text-sm font-black text-[#174D35] tabular-nums">{t('stat_vs_mandi')}</div>
                </div>
              </div>

            </div>

          </div>

          {/* Location Selector Bar */}
          <div className="mt-14 p-4 rounded-2xl bg-white border border-[#174D35]/15 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#174D35]/10 text-[#174D35] flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#17251C]">{t('hub_filter_title')}</span>
                <p className="text-[11px] text-[#7C887E]">{t('hub_filter_subtitle')}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              {hubs.map((hub) => (
                <button
                  key={hub}
                  onClick={() => setSelectedHub(hub)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedHub === hub
                      ? 'bg-[#174D35] text-white shadow-xs'
                      : 'bg-[#F7F8F2] text-[#17251C]/70 hover:bg-neutral-200/60'
                  }`}
                >
                  {hub === 'All' ? t('cat_all') : hub}
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 2. ANIMATED AGRICULTURAL METRICS STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-6 rounded-2xl bg-white border border-[#174D35]/15 shadow-xs">
            <div className="text-xs font-semibold text-[#7C887E] uppercase">{t('stats_farmers')}</div>
            <div className="text-3xl font-extrabold text-[#174D35] mt-1.5 tabular-nums">1,240+</div>
            <div className="text-xs text-[#3C8D5A] mt-1 font-medium">{t('metrics_farmers_sub')}</div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#174D35]/15 shadow-xs">
            <div className="text-xs font-semibold text-[#7C887E] uppercase">{t('stats_traded')}</div>
            <div className="text-3xl font-extrabold text-[#174D35] mt-1.5 tabular-nums">48,500+ Qtl</div>
            <div className="text-xs text-[#3C8D5A] mt-1 font-medium">{t('metrics_traded_sub')}</div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#174D35]/15 shadow-xs">
            <div className="text-xs font-semibold text-[#7C887E] uppercase">{t('stats_farmer_profit')}</div>
            <div className="text-3xl font-extrabold text-[#3C8D5A] mt-1.5 tabular-nums">₹1.84 Cr</div>
            <div className="text-xs text-[#17251C]/70 mt-1 font-medium">{t('metrics_profit_sub')}</div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#174D35]/15 shadow-xs">
            <div className="text-xs font-semibold text-[#7C887E] uppercase">{t('stats_freshness')}</div>
            <div className="text-3xl font-extrabold text-[#174D35] mt-1.5 tabular-nums">&lt; 18 Hours</div>
            <div className="text-xs text-[#3C8D5A] mt-1 font-medium">{t('metrics_freshness_sub')}</div>
          </div>
        </div>
      </section>

      {/* 2.5 LIVE AGRI-ECOSYSTEM MAP: FARMERS, CONSUMERS, RETAILERS & TRANSIT SCOPE */}
      <section id="agri-map" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StakeholderMap
          farmers={farmers}
          users={users}
          products={products}
          onSelectFarmer={onSelectFarmer}
          onSelectProduct={onSelectProduct}
        />
      </section>

      {/* 3. HOW KRISHICONNECT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#3C8D5A] uppercase tracking-wider">{t('how_tag')}</span>
          <h2 className="text-3xl font-extrabold text-[#17251C] mt-1">{t('how_title')}</h2>
          <p className="text-sm text-[#7C887E] mt-2">
            {t('how_subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          <div className="p-6 rounded-2xl bg-white border border-[#174D35]/15 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-[#174D35] text-[#B7D96B] font-extrabold flex items-center justify-center text-sm mb-4">
              01
            </div>
            <h4 className="font-bold text-base text-[#17251C] mb-2">{t('step1_title')}</h4>
            <p className="text-xs text-[#7C887E] leading-relaxed">
              {t('step1_desc')}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#174D35]/15 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-[#174D35] text-[#B7D96B] font-extrabold flex items-center justify-center text-sm mb-4">
              02
            </div>
            <h4 className="font-bold text-base text-[#17251C] mb-2">{t('step2_title')}</h4>
            <p className="text-xs text-[#7C887E] leading-relaxed">
              {t('step2_desc')}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#174D35]/15 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-[#174D35] text-[#B7D96B] font-extrabold flex items-center justify-center text-sm mb-4">
              03
            </div>
            <h4 className="font-bold text-base text-[#17251C] mb-2">{t('step3_title')}</h4>
            <p className="text-xs text-[#7C887E] leading-relaxed">
              {t('step3_desc')}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#174D35]/15 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-[#174D35] text-[#B7D96B] font-extrabold flex items-center justify-center text-sm mb-4">
              04
            </div>
            <h4 className="font-bold text-base text-[#17251C] mb-2">{t('step4_title')}</h4>
            <p className="text-xs text-[#7C887E] leading-relaxed">
              {t('step4_desc')}
            </p>
          </div>

        </div>
      </section>

      {/* 4. PRICE TRANSPARENCY COMPARISON MODULE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PriceBreakdownWidget />
      </section>

      {/* 5. POPULAR FRESH HARVEST PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-[#3C8D5A] uppercase tracking-wider">{t('popular_tag')}</span>
            <h2 className="text-3xl font-extrabold text-[#17251C] mt-1">{t('popular_title')}</h2>
            <p className="text-sm text-[#7C887E] mt-1">{t('popular_subtitle')}</p>
          </div>
          <button
            onClick={() => setCurrentView('marketplace')}
            className="flex items-center gap-1.5 text-xs font-bold text-[#174D35] hover:text-[#3C8D5A] transition-colors"
          >
            <span>{t('view_all_products')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredFeaturedProducts.map((prod) => (
            <div
              key={prod.id}
              onClick={() => onSelectProduct(prod)}
              className="group bg-white rounded-2xl border border-[#174D35]/15 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-neutral-100">
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/src/assets/images/ripe_desi_tomatoes_1794193349094.jpg';
                    }}
                  />
                  {prod.isOrganic && (
                    <span className="absolute top-3 left-3 bg-[#174D35] text-[#B7D96B] text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow">
                      {t('cat_organic')}
                    </span>
                  )}
                  <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs text-[#17251C] text-[10px] font-bold px-2 py-0.5 rounded shadow">
                    {prod.harvestDate}
                  </span>
                </div>

                <div className="p-4 space-y-1.5">
                  <div className="text-[11px] font-semibold text-[#3C8D5A]">
                    {prod.farmName} · {prod.district}
                  </div>
                  <h4 className="font-bold text-sm text-[#17251C] line-clamp-1 group-hover:text-[#174D35]">
                    {prod.name}
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{prod.rating}</span>
                    <span className="text-[#7C887E] text-[10px] font-normal">({prod.reviewsCount})</span>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-[#174D35]/10 mt-2 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-[#7C887E] font-medium">{t('farm_direct_price')}</div>
                  <div className="text-base font-black text-[#174D35] tabular-nums">
                    ₹{prod.pricePerUnit}
                    <span className="text-xs font-normal text-[#7C887E]">/{prod.unit}</span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(prod, 1);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#174D35] text-white text-xs font-bold hover:bg-[#123b28] transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-[#B7D96B]" />
                  <span>{t('btn_add')}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FEATURED VERIFIED FARMERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-[#3C8D5A] uppercase tracking-wider">{t('farmers_tag')}</span>
            <h2 className="text-3xl font-extrabold text-[#17251C] mt-1">{t('farmers_title')}</h2>
          </div>
          <button
            onClick={() => setCurrentView('farmers')}
            className="text-xs font-bold text-[#174D35] hover:underline"
          >
            {t('see_all_farmers')}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {farmers.slice(0, 3).map((f) => (
            <div
              key={f.id}
              onClick={() => onSelectFarmer(f)}
              className="p-5 bg-white rounded-2xl border border-[#174D35]/15 shadow-xs hover:border-[#174D35] transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3.5 mb-3">
                  <img
                    src={f.avatar}
                    alt={f.farmerName}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#174D35]/20 shrink-0"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/src/assets/images/farmer_portrait_mentor_1793946353253.jpg';
                    }}
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-sm text-[#17251C]">{f.farmerName}</h4>
                      {f.isVerified && (
                        <span title="NPOP Verified Farmer">
                          <CheckCircle className="w-4 h-4 text-[#3C8D5A]" />
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#7C887E]">{f.farmName}</div>
                    <div className="text-[11px] text-[#3C8D5A] font-semibold mt-0.5">
                      {f.location} ({f.totalAcres} Acres · {f.farmingType})
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#17251C]/80 line-clamp-3 leading-relaxed mb-4">
                  {f.bio}
                </p>
              </div>

              <div className="pt-3 border-t border-[#174D35]/10 flex items-center justify-between text-xs">
                <span className="text-[#7C887E] font-medium">{f.experienceYears} {t('years_farming')}</span>
                <span className="font-bold text-[#174D35] flex items-center gap-1">
                  {t('view_farm_produce')} <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6.5. 360° STAKEHOLDER REVIEWS: CROPS, FARMER SERVICES, DELIVERY & RETAIL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-[#174D35]/15 p-6 sm:p-10 shadow-xs space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-[#3C8D5A] uppercase tracking-wider">
                  {lang === 'hi' ? 'प्रमाणित हितधारक समीक्षाएं' : lang === 'mr' ? 'प्रमाणित हितधारक अनुभव' : 'Verified 360° Reviews'}
                </span>
                <span className="text-[10px] bg-[#B7D96B]/30 text-[#174D35] font-semibold px-2 py-0.5 rounded">
                  4.95 / 5.0 Rating
                </span>
              </div>
              <h2 className="text-3xl font-extrabold text-[#17251C]">
                {lang === 'hi'
                  ? 'फसल, किसान सेवा, डिलीवरी और थोक व्यापार समीक्षा'
                  : lang === 'mr'
                  ? 'शेतमाल, शेतकरी सेवा, वाहतूक आणि घाऊक व्यापार समीक्षा'
                  : 'Real Reviews Across the Food Chain'}
              </h2>
              <p className="text-xs text-[#7C887E] mt-1 max-w-xl">
                {lang === 'hi'
                  ? 'जानें उपभोक्ता फसलों, किसान हमारी सेवा, डिलीवरी पार्टनर वाहन और खुदरा व्यापारी थोक खरीद के बारे में क्या कहते हैं।'
                  : lang === 'mr'
                  ? 'ग्राहक शेतमालाबद्दल, शेतकरी आमच्या सेवेबद्दल, वाहतूकदार आणि व्यापारी घाऊक खरेदीबद्दल काय अनुभव सांगतात ते पहा.'
                  : 'Hear direct feedback from consumers on crop taste, farmers on instant payouts, drivers on transit, and retailers on wholesale margins.'}
              </p>
            </div>

            <button
              onClick={() => setCurrentView('reviews')}
              className="px-5 py-2.5 rounded-xl bg-[#174D35] text-white font-bold text-xs hover:bg-[#123b28] transition-colors flex items-center gap-2 shadow-xs shrink-0 self-start sm:self-auto"
            >
              <MessageSquare className="w-4 h-4 text-[#B7D96B]" />
              <span>
                {lang === 'hi' ? 'सभी 360° समीक्षाएं देखें' : lang === 'mr' ? 'सर्व ३६०° समीक्षा पहा' : 'Explore All 360° Reviews'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 4 Cards Grid representing 4 Review Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* 1. Customer Crop Review */}
            <div
              onClick={() => setCurrentView('reviews')}
              className="p-5 rounded-2xl bg-[#F7F8F2] border border-[#174D35]/10 hover:border-[#174D35] transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-800">
                    <Wheat className="w-3 h-3" />
                    Crop Review
                  </span>
                  <div className="flex items-center text-amber-500 text-xs">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="font-bold ml-1">5.0</span>
                  </div>
                </div>
                <h4 className="font-bold text-xs text-[#17251C] mb-1.5 leading-snug line-clamp-2">
                  "Authentic desi sweetness and morning dew freshness!"
                </h4>
                <p className="text-[11px] text-[#7C887E] line-clamp-3 leading-relaxed mb-3">
                  Real tomato aroma that supermarket produce lost years ago. Plucked at dawn in Sehore, arrived within 18 hours.
                </p>
              </div>
              <div className="pt-2.5 border-t border-[#174D35]/10 flex items-center justify-between text-[10px]">
                <span className="font-semibold text-[#17251C]">Dr. Vivek Saxena</span>
                <span className="text-[#3C8D5A] font-bold">Consumer</span>
              </div>
            </div>

            {/* 2. Farmer Service Review */}
            <div
              onClick={() => setCurrentView('reviews')}
              className="p-5 rounded-2xl bg-[#F7F8F2] border border-[#174D35]/10 hover:border-[#174D35] transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-[#174D35]/10 text-[#174D35]">
                    <UserCheck className="w-3 h-3" />
                    Farmer Service
                  </span>
                  <div className="flex items-center text-amber-500 text-xs">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="font-bold ml-1">5.0</span>
                  </div>
                </div>
                <h4 className="font-bold text-xs text-[#17251C] mb-1.5 leading-snug line-clamp-2">
                  "Paid ₹28/kg direct via UPI within 3 hours of dispatch!"
                </h4>
                <p className="text-[11px] text-[#7C887E] line-clamp-3 leading-relaxed mb-3">
                  Zero commission agent cuts. The digital weighing scale gave exact weight and money hit my bank account same day.
                </p>
              </div>
              <div className="pt-2.5 border-t border-[#174D35]/10 flex items-center justify-between text-[10px]">
                <span className="font-semibold text-[#17251C]">Rameshwar Patidar</span>
                <span className="text-[#174D35] font-bold">Farmer (Sehore)</span>
              </div>
            </div>

            {/* 3. Delivery Partner Review */}
            <div
              onClick={() => setCurrentView('reviews')}
              className="p-5 rounded-2xl bg-[#F7F8F2] border border-[#174D35]/10 hover:border-[#174D35] transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-800">
                    <Truck className="w-3 h-3" />
                    AgriFleet Transit
                  </span>
                  <div className="flex items-center text-amber-500 text-xs">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="font-bold ml-1">5.0</span>
                  </div>
                </div>
                <h4 className="font-bold text-xs text-[#17251C] mb-1.5 leading-snug line-clamp-2">
                  "Arrived at 7:15 AM before morning tea, cold-pack intact"
                </h4>
                <p className="text-[11px] text-[#7C887E] line-clamp-3 leading-relaxed mb-3">
                  Sealed ventilated crate preserved morning crispness. Polite driver verified OTP seamlessly at our door.
                </p>
              </div>
              <div className="pt-2.5 border-t border-[#174D35]/10 flex items-center justify-between text-[10px]">
                <span className="font-semibold text-[#17251C]">Anita Deshmukh</span>
                <span className="text-blue-700 font-bold">Bhopal Resident</span>
              </div>
            </div>

            {/* 4. Retailer Wholesale Review */}
            <div
              onClick={() => setCurrentView('reviews')}
              className="p-5 rounded-2xl bg-[#F7F8F2] border border-[#174D35]/10 hover:border-[#174D35] transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-800">
                    <Store className="w-3 h-3" />
                    Retail / Bulk
                  </span>
                  <div className="flex items-center text-amber-500 text-xs">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="font-bold ml-1">5.0</span>
                  </div>
                </div>
                <h4 className="font-bold text-xs text-[#17251C] mb-1.5 leading-snug line-clamp-2">
                  "Grade-A sorting, saved 22% vs APMC Karond Mandi"
                </h4>
                <p className="text-[11px] text-[#7C887E] line-clamp-3 leading-relaxed mb-3">
                  Procured 8 quintals Sharbati wheat & 250 kg tomatoes. Uniform lot, zero sorting spoilage, 100% tax compliant.
                </p>
              </div>
              <div className="pt-2.5 border-t border-[#174D35]/10 flex items-center justify-between text-[10px]">
                <span className="font-semibold text-[#17251C]">Rajesh Agrawal</span>
                <span className="text-amber-700 font-bold">Supermarket Owner</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 7. APP DOWNLOAD & KRISHIMITRA AI PROMOTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#174D35] text-white p-8 sm:p-12 relative overflow-hidden">
          <div className="max-w-2xl relative z-10 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B7D96B]/20 text-[#B7D96B] text-xs font-bold">
              <Sparkles className="w-4 h-4" />
              {t('ai_banner_tag')}
            </div>

            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {t('ai_banner_title')}
            </h3>

            <p className="text-sm text-white/80 leading-relaxed">
              {t('ai_banner_desc')}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={openAiChat}
                className="px-6 py-3 rounded-xl bg-[#B7D96B] text-[#174D35] font-bold text-xs hover:bg-[#a6cb58] transition-colors flex items-center gap-2 shadow"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t('ai_banner_btn')}</span>
              </button>

              <button
                onClick={() => setCurrentView('marketplace')}
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
              >
                {t('browse_marketplace')}
              </button>
            </div>
          </div>

          {/* Decorative Leaf Graphic */}
          <div className="absolute -bottom-12 -right-12 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
        </div>
      </section>

    </div>
  );
};
