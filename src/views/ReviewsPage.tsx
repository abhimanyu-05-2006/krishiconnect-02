import React, { useState, useMemo } from 'react';
import {
  Star,
  ShieldCheck,
  CheckCircle2,
  Wheat,
  Truck,
  Store,
  UserCheck,
  Filter,
  Search,
  ThumbsUp,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  MessageSquare,
  Award,
  TrendingUp,
  Clock,
  MapPin,
  Heart
} from 'lucide-react';
import { Review, ReviewCategory, Product, Role } from '../types/index.js';
import { useLanguage } from '../context/LanguageContext.js';
import { WriteReviewModal } from '../components/modals/WriteReviewModal.js';

interface ReviewsPageProps {
  reviews: Review[];
  products: Product[];
  onAddReview: (review: Review) => void;
  onSelectProduct?: (product: Product) => void;
  onBack?: () => void;
}

export const ReviewsPage: React.FC<ReviewsPageProps> = ({
  reviews,
  products,
  onAddReview,
  onSelectProduct,
  onBack,
}) => {
  const { t, lang } = useLanguage();

  const [selectedCategory, setSelectedCategory] = useState<ReviewCategory | 'all'>('all');
  const [selectedRating, setSelectedRating] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [modalCategory, setModalCategory] = useState<ReviewCategory>('crop');
  const [helpfulCounts, setHelpfulCounts] = useState<Record<string, number>>({});

  const handleHelpfulClick = (reviewId: string) => {
    setHelpfulCounts((prev) => ({
      ...prev,
      [reviewId]: (prev[reviewId] || 0) + 1,
    }));
  };

  const openWriteModal = (cat: ReviewCategory = 'crop') => {
    setModalCategory(cat);
    setIsWriteModalOpen(true);
  };

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const matchesCategory = selectedCategory === 'all' || r.category === selectedCategory;
      const matchesRating = selectedRating === 'all' || r.rating === selectedRating;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q) ||
        r.userName.toLowerCase().includes(q) ||
        (r.productName && r.productName.toLowerCase().includes(q)) ||
        (r.farmerName && r.farmerName.toLowerCase().includes(q)) ||
        (r.tags && r.tags.some((tag) => tag.toLowerCase().includes(q)));

      return matchesCategory && matchesRating && matchesSearch;
    });
  }, [reviews, selectedCategory, selectedRating, searchQuery]);

  // Sector counts
  const cropCount = reviews.filter((r) => r.category === 'crop').length;
  const serviceCount = reviews.filter((r) => r.category === 'platform_service').length;
  const deliveryCount = reviews.filter((r) => r.category === 'delivery').length;
  const retailCount = reviews.filter((r) => r.category === 'retail').length;

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

      {/* 1. HERO HEADER */}
      <div className="bg-[#174D35] text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-xl">
        <div className="max-w-3xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B7D96B]/20 text-[#B7D96B] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {lang === 'hi'
                ? '360° सत्यापित हितधारक ऑडिट'
                : lang === 'mr'
                ? '३६०° प्रमाणित हितधारक गुणवत्ता ऑडिट'
                : '360° Verified Stakeholder Audit'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            {lang === 'hi'
              ? 'फसल, किसान सेवा, डिलीवरी और थोक व्यापार समीक्षा'
              : lang === 'mr'
              ? 'शेतमाल, शेतकरी सेवा, वाहतूक आणि घाऊक व्यापार समीक्षा'
              : 'Direct Agri Reviews: Crops, Farmer Services, Delivery & Retail'}
          </h1>

          <p className="text-sm text-white/80 leading-relaxed max-w-2xl">
            {lang === 'hi'
              ? 'उपभोक्ताओं, जैविक उत्पादकों, एग्री-फ्लीट चालकों और थोक खरीदारों द्वारा दर्ज वास्तविक, पारदर्शी अनुभव। बिचौलिया-मुक्त और प्रामाणिक।'
              : lang === 'mr'
              ? 'ग्राहक, सेंद्रिय शेतकरी, वाहतूकदार आणि किरकोळ व्यापाऱ्यांचे प्रत्यक्ष व पारदर्शक अनुभव. मध्यस्थांशिवाय थेट आणि विश्वासार्ह.'
              : 'Unfiltered, audited experiences from independent family farms, organic shoppers, AgriFleet logistics captains, and commercial supermarkets across Madhya Pradesh.'}
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              onClick={() => openWriteModal('crop')}
              className="px-5 py-2.5 rounded-xl bg-[#B7D96B] text-[#174D35] font-bold text-xs hover:bg-[#a6cb58] transition-all flex items-center gap-2 shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>
                {lang === 'hi'
                  ? 'अपनी समीक्षा दर्ज करें'
                  : lang === 'mr'
                  ? 'आपली समीक्षा नोंदवा'
                  : 'Write a Review'}
              </span>
            </button>

            <div className="flex items-center gap-2 text-xs text-white/80 bg-white/10 px-3.5 py-2 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-[#B7D96B]" />
              <span>100% Verified Farm-Gate & Order Proofs</span>
            </div>
          </div>
        </div>

        {/* Decorative Watermark Leaf */}
        <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
      </div>

      {/* 2. FOUR AUDIT PILLARS METRICS STRIP */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Pillar 1: Crop Freshness */}
        <div
          onClick={() => setSelectedCategory('crop')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            selectedCategory === 'crop'
              ? 'bg-[#174D35] text-white border-[#174D35] shadow-md ring-2 ring-[#B7D96B]'
              : 'bg-white text-[#17251C] border-[#174D35]/15 hover:border-[#174D35]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <Wheat className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>4.96</span>
            </div>
          </div>
          <div className="text-xs font-bold">
            {lang === 'hi' ? 'फसल व स्वाद संतुष्टि' : lang === 'mr' ? 'शेतमाल व चव समाधान' : 'Crop Produce & Taste'}
          </div>
          <div className={`text-[11px] mt-1 ${selectedCategory === 'crop' ? 'text-white/80' : 'text-[#7C887E]'}`}>
            99.4% Dew-Fresh Harvest Score ({cropCount} Reviews)
          </div>
        </div>

        {/* Pillar 2: Farmer Service */}
        <div
          onClick={() => setSelectedCategory('platform_service')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            selectedCategory === 'platform_service'
              ? 'bg-[#174D35] text-white border-[#174D35] shadow-md ring-2 ring-[#B7D96B]'
              : 'bg-white text-[#17251C] border-[#174D35]/15 hover:border-[#174D35]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#3C8D5A]/10 flex items-center justify-center text-[#3C8D5A]">
              <UserCheck className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>4.98</span>
            </div>
          </div>
          <div className="text-xs font-bold">
            {lang === 'hi' ? 'किसान सेवा व UPI भुगतान' : lang === 'mr' ? 'शेतकरी सेवा व UPI मोबदला' : 'Farmer Platform Services'}
          </div>
          <div className={`text-[11px] mt-1 ${selectedCategory === 'platform_service' ? 'text-white/80' : 'text-[#7C887E]'}`}>
            Direct UPI Payout under 3 hrs ({serviceCount} Reviews)
          </div>
        </div>

        {/* Pillar 3: Delivery */}
        <div
          onClick={() => setSelectedCategory('delivery')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            selectedCategory === 'delivery'
              ? 'bg-[#174D35] text-white border-[#174D35] shadow-md ring-2 ring-[#B7D96B]'
              : 'bg-white text-[#17251C] border-[#174D35]/15 hover:border-[#174D35]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600">
              <Truck className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>4.92</span>
            </div>
          </div>
          <div className="text-xs font-bold">
            {lang === 'hi' ? 'एग्री-फ्लीट डिलीवरी व वाहन' : lang === 'mr' ? 'वाहतूक व एग्री-फ्लीट सेवा' : 'AgriFleet Cold Logistics'}
          </div>
          <div className={`text-[11px] mt-1 ${selectedCategory === 'delivery' ? 'text-white/80' : 'text-[#7C887E]'}`}>
            99.1% Under 18h Farm-to-Door ({deliveryCount} Reviews)
          </div>
        </div>

        {/* Pillar 4: Retail */}
        <div
          onClick={() => setSelectedCategory('retail')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            selectedCategory === 'retail'
              ? 'bg-[#174D35] text-white border-[#174D35] shadow-md ring-2 ring-[#B7D96B]'
              : 'bg-white text-[#17251C] border-[#174D35]/15 hover:border-[#174D35]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600">
              <Store className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>4.95</span>
            </div>
          </div>
          <div className="text-xs font-bold">
            {lang === 'hi' ? 'थोक व व्यापारी गुणवत्ता' : lang === 'mr' ? 'घाऊक व किरकोळ व्यापार' : 'Retailer & Bulk Purchases'}
          </div>
          <div className={`text-[11px] mt-1 ${selectedCategory === 'retail' ? 'text-white/80' : 'text-[#7C887E]'}`}>
            Grade-A Sorting & 22% Mandi Savings ({retailCount} Reviews)
          </div>
        </div>

      </div>

      {/* 3. CATEGORY TABS & SEARCH CONTROLS */}
      <div className="space-y-4">
        
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#174D35] text-white shadow-xs'
                : 'bg-white text-[#17251C]/70 border border-[#174D35]/15 hover:border-[#174D35]'
            }`}
          >
            {lang === 'hi' ? 'सभी समीक्षाएं' : lang === 'mr' ? 'सर्व समीक्षा' : 'All Reviews'} ({reviews.length})
          </button>

          <button
            onClick={() => setSelectedCategory('crop')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'crop'
                ? 'bg-[#174D35] text-white shadow-xs'
                : 'bg-white text-[#17251C]/70 border border-[#174D35]/15 hover:border-[#174D35]'
            }`}
          >
            <Wheat className="w-3.5 h-3.5 text-[#B7D96B]" />
            <span>{lang === 'hi' ? 'फसल ग्राहक समीक्षा' : lang === 'mr' ? 'शेतमाल ग्राहक समीक्षा' : 'Customer Crop Reviews'} ({cropCount})</span>
          </button>

          <button
            onClick={() => setSelectedCategory('platform_service')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'platform_service'
                ? 'bg-[#174D35] text-white shadow-xs'
                : 'bg-white text-[#17251C]/70 border border-[#174D35]/15 hover:border-[#174D35]'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-[#3C8D5A]" />
            <span>{lang === 'hi' ? 'किसान सेवा समीक्षा' : lang === 'mr' ? 'शेतकरी सेवा समीक्षा' : 'Farmer Service Reviews'} ({serviceCount})</span>
          </button>

          <button
            onClick={() => setSelectedCategory('delivery')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'delivery'
                ? 'bg-[#174D35] text-white shadow-xs'
                : 'bg-white text-[#17251C]/70 border border-[#174D35]/15 hover:border-[#174D35]'
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-blue-500" />
            <span>{lang === 'hi' ? 'डिलीवरी समीक्षा' : lang === 'mr' ? 'वाहतूक समीक्षा' : 'Delivery Reviews'} ({deliveryCount})</span>
          </button>

          <button
            onClick={() => setSelectedCategory('retail')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'retail'
                ? 'bg-[#174D35] text-white shadow-xs'
                : 'bg-white text-[#17251C]/70 border border-[#174D35]/15 hover:border-[#174D35]'
            }`}
          >
            <Store className="w-3.5 h-3.5 text-amber-500" />
            <span>{lang === 'hi' ? 'थोक व व्यापारी समीक्षा' : lang === 'mr' ? 'घाऊक व व्यापारी समीक्षा' : 'Retailer Reviews'} ({retailCount})</span>
          </button>
        </div>

        {/* Search & Rating Filter Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-white p-3.5 rounded-2xl border border-[#174D35]/15">
          
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 text-[#7C887E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === 'hi'
                  ? 'फसल नाम, किसान, सीहोर, स्वाद, या सेवा के अनुसार खोजें...'
                  : lang === 'mr'
                  ? 'शेतमाल, शेतकरी, सिहोर, चव किंवा सेवेनुसार शोधा...'
                  : 'Search by crop name, farmer, village, freshness, or keywords...'
              }
              className="w-full pl-10 pr-4 py-2 text-xs bg-[#F7F8F2] border border-[#174D35]/15 rounded-xl text-[#17251C] focus:outline-none focus:ring-2 focus:ring-[#174D35]"
            />
          </div>

          <div className="md:col-span-4 flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#3C8D5A] shrink-0" />
            <select
              value={selectedRating}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedRating(val === 'all' ? 'all' : parseInt(val, 10));
              }}
              className="w-full py-2 px-3 text-xs bg-[#F7F8F2] border border-[#174D35]/15 rounded-xl text-[#17251C] focus:outline-none focus:ring-2 focus:ring-[#174D35]"
            >
              <option value="all">
                {lang === 'hi' ? 'सभी रेटिंग्स (1-5 सितारे)' : lang === 'mr' ? 'सर्व रेटिंग्ज (१-५ स्टार)' : 'All Ratings (1-5 Stars)'}
              </option>
              <option value="5">
                {lang === 'hi' ? 'केवल 5 सितारे' : lang === 'mr' ? 'फक्त ५ स्टार' : '5 Stars Only'}
              </option>
              <option value="4">
                {lang === 'hi' ? '4 सितारे और ऊपर' : lang === 'mr' ? '४ स्टार व अधिक' : '4 Stars & Above'}
              </option>
            </select>
          </div>

        </div>

      </div>

      {/* 4. REVIEWS GRID */}
      {filteredReviews.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#174D35]/15 space-y-3">
          <MessageSquare className="w-10 h-10 text-[#7C887E] mx-auto opacity-50" />
          <h4 className="font-bold text-base text-[#17251C]">
            {lang === 'hi' ? 'कोई समीक्षा नहीं मिली' : lang === 'mr' ? 'कोणतीही समीक्षा सापडली नाही' : 'No matching reviews found'}
          </h4>
          <p className="text-xs text-[#7C887E] max-w-sm mx-auto">
            {lang === 'hi'
              ? 'कृपया खोज शब्द या फ़िल्टर बदलें।'
              : lang === 'mr'
              ? 'कृपया शोध शब्द किंवा फिल्टर तपासा.'
              : 'Try clearing your search query or selecting a different category.'}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedRating('all');
            }}
            className="px-4 py-2 rounded-xl bg-[#174D35] text-white text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReviews.map((rev) => {
            const upvotes = (helpfulCounts[rev.id] || 0) + (rev.rating === 5 ? 12 : 6);
            const matchingProduct = products.find((p) => p.id === rev.productId || p.name === rev.productName);

            const categoryLabels: Record<ReviewCategory, { label: string; bg: string; text: string; icon: any }> = {
              crop: {
                label: lang === 'hi' ? 'फसल ग्राहक समीक्षा' : lang === 'mr' ? 'शेतमाल ग्राहक समीक्षा' : 'Customer Crop Review',
                bg: 'bg-emerald-500/10',
                text: 'text-emerald-800',
                icon: Wheat,
              },
              platform_service: {
                label: lang === 'hi' ? 'किसान सेवा व भुगतान' : lang === 'mr' ? 'शेतकरी सेवा व मोबदला' : 'Farmer Platform Service',
                bg: 'bg-[#174D35]/10',
                text: 'text-[#174D35]',
                icon: UserCheck,
              },
              delivery: {
                label: lang === 'hi' ? 'एग्री-फ्लीट डिलीवरी' : lang === 'mr' ? 'वाहतूक व पोहोच' : 'AgriFleet Delivery',
                bg: 'bg-blue-500/10',
                text: 'text-blue-800',
                icon: Truck,
              },
              retail: {
                label: lang === 'hi' ? 'थोक व व्यापारी खरीद' : lang === 'mr' ? 'घाऊक व किरकोळ खरेदी' : 'Retailer Wholesale Purchase',
                bg: 'bg-amber-500/10',
                text: 'text-amber-800',
                icon: Store,
              },
            };

            const catConfig = categoryLabels[rev.category] || categoryLabels.crop;
            const CatIcon = catConfig.icon;

            const getReviewerAvatar = (role?: string) => {
              switch (role) {
                case 'farmer':
                  return '/src/assets/images/farmer_portrait_mentor_1793946353253.jpg';
                case 'consumer':
                  return '/src/assets/images/avatar_consumer_pooja_1793947866234.jpg';
                case 'retailer':
                  return '/src/assets/images/avatar_retailer_rajesh_1793947866819.jpg';
                case 'delivery':
                  return '/src/assets/images/avatar_delivery_vikram_1793947867664.jpg';
                default:
                  return '/src/assets/images/avatar_consumer_pooja_1793947866234.jpg';
              }
            };

            return (
              <div
                key={rev.id}
                className="bg-white rounded-3xl border border-[#174D35]/15 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  
                  {/* Category Pill & Verification Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold ${catConfig.bg} ${catConfig.text}`}>
                      <CatIcon className="w-3.5 h-3.5" />
                      <span>{catConfig.label}</span>
                    </span>

                    {rev.verifiedPurchase && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Verified Transaction
                      </span>
                    )}
                  </div>

                  {/* Associated Crop Info with Image (if crop review) */}
                  {rev.category === 'crop' && rev.productName && (
                    <div className="p-3 rounded-2xl bg-[#F7F8F2] border border-[#174D35]/10 flex items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {matchingProduct?.imageUrl && (
                          <img
                            src={matchingProduct.imageUrl}
                            alt={rev.productName}
                            className="w-12 h-12 rounded-xl object-cover border border-[#174D35]/15 shrink-0 bg-white"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/src/assets/images/ripe_desi_tomatoes_1794193349094.jpg';
                            }}
                          />
                        )}
                        <div className="min-w-0">
                          <div className="text-[10px] text-[#7C887E] font-medium">Reviewed Crop:</div>
                          <div className="text-xs font-bold text-[#17251C] truncate">{rev.productName}</div>
                        </div>
                      </div>
                      {rev.farmerName && (
                        <div className="text-right shrink-0">
                          <div className="text-[10px] text-[#7C887E]">Grown by:</div>
                          <div className="text-[11px] font-semibold text-[#174D35]">{rev.farmerName}</div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Rating Stars & Date */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${
                            s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'
                          }`}
                        />
                      ))}
                      <span className="text-xs font-bold text-[#17251C] ml-1.5">{rev.rating}.0</span>
                    </div>

                    <span className="text-[11px] text-[#7C887E]">{rev.date}</span>
                  </div>

                  {/* Headline */}
                  <h4 className="font-extrabold text-sm sm:text-base text-[#17251C] leading-snug mb-2">
                    "{rev.title}"
                  </h4>

                  {/* Review Text */}
                  <p className="text-xs text-[#17251C]/85 leading-relaxed mb-3">
                    {rev.comment}
                  </p>

                  {/* Sub-ratings Breakdown (if available) */}
                  {rev.subRatings && (
                    <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-[#F7F8F2] text-[10px] text-[#7C887E] mb-3">
                      <div className="flex justify-between">
                        <span>Quality / Freshness:</span>
                        <span className="font-bold text-[#174D35]">{rev.subRatings.freshnessOrQuality}/5</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Punctuality / Speed:</span>
                        <span className="font-bold text-[#174D35]">{rev.subRatings.deliveryOrTimeliness}/5</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fair Price / Value:</span>
                        <span className="font-bold text-[#174D35]">{rev.subRatings.valueOrFairPrice}/5</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Packaging & Safety:</span>
                        <span className="font-bold text-[#174D35]">{rev.subRatings.serviceOrHandling}/5</span>
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {rev.tags && rev.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {rev.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded-md bg-[#174D35]/5 border border-[#174D35]/10 text-[10px] font-semibold text-[#174D35]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                </div>

                {/* Footer: Reviewer Info & Helpful Button */}
                <div className="pt-3 border-t border-[#174D35]/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={getReviewerAvatar(rev.userRole)}
                      alt={rev.userName}
                      className="w-8 h-8 rounded-full object-cover border border-[#174D35]/20 shrink-0"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/src/assets/images/avatar_consumer_pooja_1793947866234.jpg';
                      }}
                    />
                    <div>
                      <div className="font-bold text-[#17251C] text-xs leading-none">
                        {rev.userName}
                      </div>
                      <div className="text-[10px] text-[#7C887E] mt-0.5 flex items-center gap-1">
                        <span className="capitalize font-medium text-[#3C8D5A]">{rev.userRole}</span>
                        {rev.userLocation && <span>· {rev.userLocation}</span>}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleHelpfulClick(rev.id)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#174D35]/15 hover:border-[#174D35] text-xs font-semibold text-[#174D35] bg-white transition-colors"
                    title="Mark this review as helpful"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Helpful ({upvotes})</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* 5. WRITE REVIEW MODAL */}
      <WriteReviewModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        products={products}
        initialCategory={modalCategory}
        onReviewSubmitted={onAddReview}
      />

    </div>
  );
};
