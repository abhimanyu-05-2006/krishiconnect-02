import React, { useState } from 'react';
import {
  X,
  Star,
  ShieldCheck,
  MapPin,
  Clock,
  ShoppingBag,
  Plus,
  Minus,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  MessageSquare,
  ThumbsUp
} from 'lucide-react';
import { Product, FarmerProfile, Review } from '../types/index.js';
import { useCart } from '../context/CartContext.js';
import { useLanguage } from '../context/LanguageContext.js';

interface ProductDetailPageProps {
  product: Product;
  farmer?: FarmerProfile;
  reviews?: Review[];
  onClose: () => void;
  setCurrentView: (view: string) => void;
  onSelectFarmer: (farmer: FarmerProfile) => void;
  onOpenWriteReview?: (product: Product) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  farmer,
  reviews = [],
  onClose,
  setCurrentView,
  onSelectFarmer,
  onOpenWriteReview,
}) => {
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'transparency' | 'reviews'>('details');

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    onClose();
    setCurrentView('checkout');
  };

  const productTotal = product.pricePerUnit * quantity;
  const platformFee = 15;
  const deliveryFee = productTotal >= 499 ? 0 : 35;
  const totalAmount = productTotal + platformFee + deliveryFee;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#F7F8F2] w-full max-w-4xl rounded-3xl border border-[#174D35]/20 shadow-2xl overflow-hidden my-8">
        
        {/* Modal Top Bar with prominent Back button */}
        <div className="px-5 sm:px-6 py-4 bg-[#174D35] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 cursor-pointer shadow-2xs group"
              title={t('btn_back')}
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              <span>{t('btn_back')}</span>
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs font-bold text-[#B7D96B] uppercase tracking-wider">
                Farm Provenance Direct
              </span>
              <span className="text-xs text-white/60">·</span>
              <span className="text-xs text-white/80">{product.category}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2-Column Split: Product Gallery & Purchase Module */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Column: Media & Farmer Card */}
          <div className="md:col-span-6 space-y-5">
            <div className="relative rounded-2xl overflow-hidden border border-[#174D35]/15 bg-white shadow-xs">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-72 object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/src/assets/images/ripe_desi_tomatoes_1794193349094.jpg';
                }}
              />
              {product.isOrganic && (
                <span className="absolute top-3 left-3 bg-[#174D35] text-[#B7D96B] text-xs font-bold px-3 py-1 rounded-md shadow">
                  100% NPOP Certified Organic
                </span>
              )}
            </div>

            {/* Farmer Card */}
            {farmer && (
              <div
                onClick={() => {
                  onSelectFarmer(farmer);
                  onClose();
                }}
                className="p-4 rounded-xl bg-white border border-[#174D35]/15 shadow-xs hover:border-[#174D35] cursor-pointer transition-colors flex items-center gap-4"
              >
                <img
                  src={farmer.avatar}
                  alt={farmer.farmerName}
                  className="w-13 h-13 rounded-full object-cover border-2 border-[#174D35]/20 shrink-0"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/src/assets/images/farmer_portrait_mentor_1793946353253.jpg';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-[#17251C]">{farmer.farmerName}</span>
                    <ShieldCheck className="w-4 h-4 text-[#3C8D5A]" />
                  </div>
                  <div className="text-xs text-[#7C887E]">{farmer.farmName}</div>
                  <div className="text-[11px] text-[#3C8D5A] font-medium mt-0.5">
                    {farmer.location} · {farmer.experienceYears} yrs farming experience
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#174D35] shrink-0" />
              </div>
            )}

            {/* Freshness Audit Card */}
            <div className="p-4 rounded-xl bg-[#174D35]/5 border border-[#174D35]/15 text-xs text-[#17251C] space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#174D35]">
                <Clock className="w-4 h-4 text-[#3C8D5A]" />
                <span>Farm-to-Door Freshness Timeline</span>
              </div>
              <div className="text-xs text-[#7C887E]">
                Harvested: <strong>{product.harvestDate}</strong> (Early dawn plucking)
              </div>
              <div className="text-xs text-[#7C887E]">
                Shelf Stability: <strong>{product.shelfLifeDays} days</strong> without chemical sprays.
              </div>
            </div>
          </div>

          {/* Right Column: Title, Pricing, Quantity & Buy Module */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              
              <div>
                <div className="text-xs font-semibold text-[#3C8D5A] uppercase tracking-wide">
                  {product.district} Agricultural Cluster
                </div>
                <h2 className="text-2xl font-extrabold text-[#17251C] mt-1">
                  {product.name}
                </h2>
                
                <div className="flex items-center gap-3 mt-2 text-xs">
                  <div className="flex items-center text-amber-500 font-bold">
                    <Star className="w-4 h-4 fill-current mr-1" />
                    <span>{product.rating}</span>
                  </div>
                  <span className="text-[#7C887E]">·</span>
                  <span className="text-[#7C887E]">{product.reviewsCount} verified reviews</span>
                  <span className="text-[#7C887E]">·</span>
                  <span className="text-[#3C8D5A] font-semibold">Available: {product.availableQuantity} {product.unit}</span>
                </div>
              </div>

              {/* Price Callout */}
              <div className="p-4 rounded-2xl bg-white border border-[#174D35]/20 shadow-xs flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-[#7C887E] font-medium">Direct Farm-Gate Price</span>
                  <div className="text-3xl font-black text-[#174D35] tabular-nums mt-0.5">
                    ₹{product.pricePerUnit}
                    <span className="text-sm font-normal text-[#7C887E]"> / {product.unit}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-red-600 line-through tabular-nums">
                    Mandi Retail: ₹{Math.round(product.pricePerUnit * 1.45)}
                  </span>
                  <div className="text-xs font-bold text-[#3C8D5A]">
                    You save ~31%
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="text-xs text-[#17251C]/80 leading-relaxed">
                {product.description}
              </div>

              {/* Tabs for Details vs Transparency vs Reviews */}
              <div className="flex border-b border-[#174D35]/15 text-xs font-bold">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`pb-2 mr-5 transition-colors ${
                    activeTab === 'details'
                      ? 'text-[#174D35] border-b-2 border-[#174D35]'
                      : 'text-[#7C887E] hover:text-[#174D35]'
                  }`}
                >
                  Farming Method
                </button>
                <button
                  onClick={() => setActiveTab('transparency')}
                  className={`pb-2 mr-5 transition-colors ${
                    activeTab === 'transparency'
                      ? 'text-[#174D35] border-b-2 border-[#174D35]'
                      : 'text-[#7C887E] hover:text-[#174D35]'
                  }`}
                >
                  Cost Audit
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-2 transition-colors flex items-center gap-1.5 ${
                    activeTab === 'reviews'
                      ? 'text-[#174D35] border-b-2 border-[#174D35]'
                      : 'text-[#7C887E] hover:text-[#174D35]'
                  }`}
                >
                  <Star className="w-3 h-3 text-amber-500 fill-current" />
                  <span>Customer Reviews ({reviews.filter((r) => r.category === 'crop').length})</span>
                </button>
              </div>

              {/* Tab Contents */}
              {activeTab === 'details' && (
                <div className="space-y-2 text-xs text-[#17251C]/80">
                  <div className="flex justify-between py-1 border-b border-[#174D35]/10">
                    <span className="text-[#7C887E]">Farming System:</span>
                    <span className="font-semibold">{product.isOrganic ? '100% Certified Organic (NPOP)' : 'Integrated Pest Management (IPM)'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#174D35]/10">
                    <span className="text-[#7C887E]">Origin Farm:</span>
                    <span className="font-semibold">{product.farmName}, {product.district}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#174D35]/10">
                    <span className="text-[#7C887E]">Minimum Order:</span>
                    <span className="font-semibold">{product.minOrderQuantity} {product.unit}</span>
                  </div>
                </div>
              )}

              {activeTab === 'transparency' && (
                <div className="p-3 bg-white rounded-xl border border-[#174D35]/15 text-xs space-y-1.5">
                  <div className="flex justify-between text-[#174D35] font-bold">
                    <span>Direct to Farmer (100%):</span>
                    <span className="tabular-nums">₹{product.pricePerUnit * quantity}</span>
                  </div>
                  <div className="flex justify-between text-[#7C887E]">
                    <span>AgriFleet Farm Delivery:</span>
                    <span className="tabular-nums">₹{deliveryFee}</span>
                  </div>
                  <div className="flex justify-between text-[#7C887E]">
                    <span>Platform Quality Verification:</span>
                    <span className="tabular-nums">₹{platformFee}</span>
                  </div>
                  <div className="pt-1.5 border-t border-[#174D35]/10 flex justify-between font-extrabold text-[#17251C]">
                    <span>Total Consumer Cost:</span>
                    <span className="tabular-nums">₹{totalAmount}</span>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                  {reviews
                    .filter((r) => r.category === 'crop')
                    .slice(0, 3)
                    .map((cr) => (
                      <div key={cr.id} className="p-3 bg-white rounded-xl border border-[#174D35]/10 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-amber-500 font-bold text-[11px]">
                            <Star className="w-3 h-3 fill-current" />
                            <span>{cr.rating}.0</span>
                            <span className="text-[#17251C] font-semibold ml-1">{cr.userName}</span>
                          </div>
                          <span className="text-[10px] text-[#7C887E]">{cr.date}</span>
                        </div>
                        <div className="font-bold text-[#17251C] text-[11px]">"{cr.title}"</div>
                        <p className="text-[11px] text-[#7C887E] leading-relaxed line-clamp-2">{cr.comment}</p>
                      </div>
                    ))}

                  <button
                    onClick={() => {
                      onClose();
                      setCurrentView('reviews');
                    }}
                    className="w-full py-1.5 text-center text-xs font-bold text-[#174D35] bg-[#174D35]/10 hover:bg-[#174D35]/20 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>View All 360° Reviews or Write Review</span>
                  </button>
                </div>
              )}

            </div>

            {/* Quantity Selector & Purchase CTAs */}
            <div className="pt-4 border-t border-[#174D35]/15 space-y-3">
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#17251C]">Select Quantity:</span>
                
                <div className="flex items-center border border-[#174D35]/25 rounded-xl bg-white overflow-hidden shadow-xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-[#17251C] hover:bg-[#F7F8F2] transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-xs font-bold text-[#174D35] tabular-nums">
                    {quantity} {product.unit}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.availableQuantity, quantity + 1))}
                    className="p-2 text-[#17251C] hover:bg-[#F7F8F2] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  className="py-3 px-4 rounded-xl bg-white border border-[#174D35] text-[#174D35] font-bold text-xs hover:bg-[#174D35]/5 transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <ShoppingBag className="w-4 h-4 text-[#3C8D5A]" />
                  <span>Add to Basket</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="py-3 px-4 rounded-xl bg-[#174D35] text-white font-bold text-xs hover:bg-[#123b28] transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Buy Now (₹{totalAmount})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
