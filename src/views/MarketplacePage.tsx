import React, { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, Star, ShoppingBag, MapPin, Check, Sparkles, ArrowLeft } from 'lucide-react';
import { Product, ProductCategory } from '../types/index.js';
import { useCart } from '../context/CartContext.js';
import { useLanguage } from '../context/LanguageContext.js';

interface MarketplacePageProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  openAiChat: () => void;
  onBack?: () => void;
}

export const MarketplacePage: React.FC<MarketplacePageProps> = ({
  products,
  onSelectProduct,
  openAiChat,
  onBack,
}) => {
  const { addToCart } = useCart();
  const { t } = useLanguage();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [organicOnly, setOrganicOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'popular' | 'price_low' | 'price_high' | 'freshness'>('popular');

  const categories: (ProductCategory | 'All')[] = [
    'All',
    'Vegetables',
    'Fruits',
    'Grains',
    'Pulses',
    'Spices',
    'Dairy',
    'Organic Produce',
  ];

  const districts = ['All', 'Sehore', 'Bhopal', 'Vidisha', 'Raisen', 'Hoshangabad', 'Dewas'];

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        const matchesDistrict =
          selectedDistrict === 'All' || p.district.toLowerCase() === selectedDistrict.toLowerCase();
        const matchesOrganic = !organicOnly || p.isOrganic;
        const q = search.toLowerCase().trim();
        const matchesSearch =
          !q ||
          p.name.toLowerCase().includes(q) ||
          p.farmerName.toLowerCase().includes(q) ||
          p.farmName.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q);

        return matchesCategory && matchesDistrict && matchesOrganic && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price_low') return a.pricePerUnit - b.pricePerUnit;
        if (sortBy === 'price_high') return b.pricePerUnit - a.pricePerUnit;
        if (sortBy === 'freshness') {
          return new Date(b.harvestDate).getTime() - new Date(a.harvestDate).getTime();
        }
        return b.rating - a.rating;
      });
  }, [products, search, selectedCategory, selectedDistrict, organicOnly, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
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

      {/* Top Banner with Search and AI Advisor */}
      <div className="bg-white rounded-2xl border border-[#174D35]/15 p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-xl space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#3C8D5A] uppercase tracking-wider">
              {t('brand_name')}
            </span>
            <span className="text-[10px] bg-[#B7D96B]/30 text-[#174D35] font-semibold px-2 py-0.5 rounded">
              {t('trust_farmer_share')}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17251C]">
            {t('marketplace_title')}
          </h1>
          <p className="text-xs text-[#7C887E]">
            {t('marketplace_subtitle')}
          </p>
        </div>

        {/* AI produce assistant trigger */}
        <button
          onClick={openAiChat}
          className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-[#3C8D5A]/10 border border-[#3C8D5A]/20 hover:bg-[#3C8D5A]/20 text-[#174D35] text-xs font-bold transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <Sparkles className="w-4 h-4 text-[#3C8D5A]" />
          <span>{t('ask_ai_season')}</span>
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="space-y-4">
        
        {/* Search input and Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-[#7C887E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('search_placeholder')}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-[#174D35]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#174D35] text-[#17251C]"
            />
          </div>

          <div className="md:col-span-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#3C8D5A] shrink-0" />
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full py-2.5 px-3 text-xs bg-white border border-[#174D35]/20 rounded-xl text-[#17251C] focus:outline-none focus:ring-2 focus:ring-[#174D35]"
            >
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d === 'All' ? t('filter_all_districts') : d}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#3C8D5A] shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full py-2.5 px-3 text-xs bg-white border border-[#174D35]/20 rounded-xl text-[#17251C] focus:outline-none focus:ring-2 focus:ring-[#174D35]"
            >
              <option value="popular">{t('sort_popular')}</option>
              <option value="freshness">{t('sort_freshness')}</option>
              <option value="price_low">{t('sort_price_low')}</option>
              <option value="price_high">{t('sort_price_high')}</option>
            </select>
          </div>

        </div>

        {/* Categories Bar & Organic Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
          
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
            {categories.map((cat) => {
              const catKeyMap: Record<string, string> = {
                'All': 'cat_all',
                'Vegetables': 'cat_vegetables',
                'Fruits': 'cat_fruits',
                'Grains': 'cat_grains',
                'Pulses': 'cat_pulses',
                'Spices': 'cat_spices',
                'Dairy': 'cat_dairy',
                'Organic Produce': 'cat_organic',
              };
              const label = t(catKeyMap[cat] || 'cat_all', cat);
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#174D35] text-white shadow-xs'
                      : 'bg-white text-[#17251C]/70 border border-[#174D35]/15 hover:border-[#174D35]'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Organic Only Toggle */}
          <label className="flex items-center gap-2 text-xs font-semibold text-[#174D35] cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={organicOnly}
              onChange={(e) => setOrganicOnly(e.target.checked)}
              className="w-4 h-4 text-[#174D35] rounded focus:ring-[#174D35] border-gray-300"
            />
            <span>{t('filter_show_organic')}</span>
          </label>

        </div>

      </div>

      {/* Product Results Counter */}
      <div className="text-xs text-[#7C887E] flex items-center justify-between">
        <span>
          <strong className="text-[#17251C] font-semibold">{filteredProducts.length}</strong> {t('showing_listings')}
        </span>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#174D35]/15 p-12 text-center space-y-3">
          <p className="text-base font-bold text-[#17251C]">{t('no_products_found')}</p>
          <p className="text-xs text-[#7C887E] max-w-sm mx-auto">
            {t('no_products_hint')}
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('All');
              setSelectedDistrict('All');
              setOrganicOnly(false);
            }}
            className="px-4 py-2 rounded-xl bg-[#174D35] text-white text-xs font-semibold"
          >
            {t('reset_filters')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              onClick={() => onSelectProduct(prod)}
              className="group bg-white rounded-2xl border border-[#174D35]/15 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Product Image */}
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
                  <span className="absolute bottom-3 right-3 bg-[#174D35]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                    {prod.availableQuantity} {prod.unit}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 space-y-1.5">
                  <div className="text-[11px] font-semibold text-[#3C8D5A]">
                    {prod.farmName} · {prod.district}
                  </div>
                  <h3 className="font-bold text-sm text-[#17251C] line-clamp-1 group-hover:text-[#174D35]">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-[#7C887E] line-clamp-2 leading-relaxed">
                    {prod.description}
                  </p>

                  <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold pt-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{prod.rating}</span>
                    <span className="text-[#7C887E] text-[10px] font-normal">({prod.reviewsCount})</span>
                  </div>
                </div>
              </div>

              {/* Bottom Card Action */}
              <div className="p-4 pt-0 border-t border-[#174D35]/10 mt-3 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-[#7C887E] font-medium">{t('farm_direct_price')}</div>
                  <div className="text-lg font-black text-[#174D35] tabular-nums">
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
      )}

    </div>
  );
};
