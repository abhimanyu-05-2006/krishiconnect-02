import React, { useState } from 'react';
import { X, Star, Sparkles, ShieldCheck, CheckCircle2, Wheat, Truck, Store, UserCheck } from 'lucide-react';
import { Review, ReviewCategory, Product, Role } from '../../types/index.js';
import { useAuth } from '../../context/AuthContext.js';
import { useLanguage } from '../../context/LanguageContext.js';

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onReviewSubmitted: (newReview: Review) => void;
  initialCategory?: ReviewCategory;
  initialProductId?: string;
}

export const WriteReviewModal: React.FC<WriteReviewModalProps> = ({
  isOpen,
  onClose,
  products,
  onReviewSubmitted,
  initialCategory = 'crop',
  initialProductId,
}) => {
  const { user, role } = useAuth();
  const { t, lang } = useLanguage();

  const [category, setCategory] = useState<ReviewCategory>(initialCategory);
  const [selectedProductId, setSelectedProductId] = useState<string>(
    initialProductId || (products[0] ? products[0].id : '')
  );
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['Farm Fresh', '100% Transparent']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sub-ratings (1-5)
  const [freshnessRating, setFreshnessRating] = useState(5);
  const [timelinessRating, setTimelinessRating] = useState(5);
  const [valueRating, setValueRating] = useState(5);
  const [serviceRating, setServiceRating] = useState(5);

  if (!isOpen) return null;

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !comment.trim()) {
      setErrorMsg(
        lang === 'hi'
          ? 'कृपया समीक्षा शीर्षक और विस्तृत विवरण दोनों दर्ज करें।'
          : lang === 'mr'
          ? 'कृपया शीर्षक आणि सविस्तर समीक्षा दोन्ही प्रविष्ट करा.'
          : 'Please provide both a review headline and detailed comments.'
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const chosenProduct = products.find((p) => p.id === selectedProductId);

    const reviewPayload = {
      category,
      productId: category === 'crop' ? chosenProduct?.id : undefined,
      productName: category === 'crop' ? chosenProduct?.name : undefined,
      farmerId: category === 'crop' ? chosenProduct?.farmerId : undefined,
      farmerName: category === 'crop' ? chosenProduct?.farmerName : undefined,
      userId: user?.id || `user_guest_${Date.now()}`,
      userName: user?.name || (role === 'farmer' ? 'Rameshwar Patidar' : 'Pooja Sharma'),
      userRole: (user?.role || role) as Role,
      userLocation: user?.location || 'Madhya Pradesh Agricultural Belt',
      rating,
      subRatings: {
        freshnessOrQuality: freshnessRating,
        deliveryOrTimeliness: timelinessRating,
        valueOrFairPrice: valueRating,
        serviceOrHandling: serviceRating,
      },
      title,
      comment,
      tags: tags.length > 0 ? tags : ['Verified Stakeholder', 'Direct Agri'],
      verifiedPurchase: true,
    };

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewPayload),
      });

      if (!res.ok) throw new Error('Failed to submit review');
      const savedReview = await res.json();
      onReviewSubmitted(savedReview);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error submitting review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#F7F8F2] w-full max-w-2xl rounded-3xl border border-[#174D35]/20 shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#174D35] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#B7D96B] text-[#174D35] flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">
                {lang === 'hi'
                  ? 'सत्यापित हितधारक समीक्षा दर्ज करें'
                  : lang === 'mr'
                  ? 'प्रमाणित हितधारक समीक्षा नोंदवा'
                  : 'Submit Verified Stakeholder Review'}
              </h3>
              <p className="text-[11px] text-[#B7D96B]/80">
                KrishiConnect 360° Quality & Service Audit
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* 1. Category Switcher Pills */}
          <div>
            <label className="block text-xs font-bold text-[#17251C] mb-2">
              {lang === 'hi'
                ? 'समीक्षा का प्रकार चुनें:'
                : lang === 'mr'
                ? 'समीक्षेचा प्रकार निवडा:'
                : 'Select Review Category:'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setCategory('crop')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  category === 'crop'
                    ? 'bg-[#174D35] text-white border-[#174D35] shadow-xs'
                    : 'bg-white text-[#17251C] border-[#174D35]/15 hover:border-[#174D35]'
                }`}
              >
                <Wheat className="w-4 h-4 text-[#B7D96B]" />
                <span className="text-[11px]">
                  {lang === 'hi' ? 'फसल/उपज' : lang === 'mr' ? 'शेतमाल/पीक' : 'Crop Produce'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setCategory('platform_service')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  category === 'platform_service'
                    ? 'bg-[#174D35] text-white border-[#174D35] shadow-xs'
                    : 'bg-white text-[#17251C] border-[#174D35]/15 hover:border-[#174D35]'
                }`}
              >
                <UserCheck className="w-4 h-4 text-[#3C8D5A]" />
                <span className="text-[11px]">
                  {lang === 'hi' ? 'किसान सेवा' : lang === 'mr' ? 'शेतकरी सेवा' : 'Farmer Service'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setCategory('delivery')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  category === 'delivery'
                    ? 'bg-[#174D35] text-white border-[#174D35] shadow-xs'
                    : 'bg-white text-[#17251C] border-[#174D35]/15 hover:border-[#174D35]'
                }`}
              >
                <Truck className="w-4 h-4 text-blue-500" />
                <span className="text-[11px]">
                  {lang === 'hi' ? 'डिलीवरी' : lang === 'mr' ? 'वाहतूक' : 'Delivery Fleet'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setCategory('retail')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  category === 'retail'
                    ? 'bg-[#174D35] text-white border-[#174D35] shadow-xs'
                    : 'bg-white text-[#17251C] border-[#174D35]/15 hover:border-[#174D35]'
                }`}
              >
                <Store className="w-4 h-4 text-amber-500" />
                <span className="text-[11px]">
                  {lang === 'hi' ? 'थोक/व्यापारी' : lang === 'mr' ? 'घाऊक/व्यापारी' : 'Retail / Bulk'}
                </span>
              </button>
            </div>
          </div>

          {/* If Crop Category: Select which Crop */}
          {category === 'crop' && (
            <div>
              <label className="block text-xs font-bold text-[#17251C] mb-1">
                {lang === 'hi' ? 'फसल चुनें:' : lang === 'mr' ? 'शेतमाल निवडा:' : 'Select Produce:'}
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full py-2.5 px-3 text-xs bg-white border border-[#174D35]/20 rounded-xl text-[#17251C] focus:outline-none focus:ring-2 focus:ring-[#174D35]"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {p.farmName} ({p.district})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* 2. Star Rating */}
          <div className="p-4 bg-white rounded-2xl border border-[#174D35]/15 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-[#17251C]">
                {lang === 'hi' ? 'कुल संतुष्टि रेटिंग:' : lang === 'mr' ? 'एकूण समाधान रेटिंग:' : 'Overall Rating:'}
              </div>
              <div className="text-[11px] text-[#7C887E]">
                {rating === 5
                  ? '5 Stars – Outstanding Quality & Service'
                  : `${rating} Stars`}
              </div>
            </div>

            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 text-amber-400 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${
                      (hoverRating || rating) >= star ? 'fill-amber-400' : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Sub-ratings sliders */}
          <div className="grid grid-cols-2 gap-3 p-4 bg-white rounded-2xl border border-[#174D35]/15 text-xs">
            <div>
              <div className="flex justify-between font-semibold text-[#17251C] mb-1">
                <span>{category === 'crop' ? 'Freshness & Taste' : 'Quality of Service'}</span>
                <span className="font-bold text-[#174D35]">{freshnessRating}/5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={freshnessRating}
                onChange={(e) => setFreshnessRating(parseInt(e.target.value, 10))}
                className="w-full accent-[#174D35]"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold text-[#17251C] mb-1">
                <span>{category === 'delivery' ? 'Transit Speed' : 'Punctuality / Timing'}</span>
                <span className="font-bold text-[#174D35]">{timelinessRating}/5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={timelinessRating}
                onChange={(e) => setTimelinessRating(parseInt(e.target.value, 10))}
                className="w-full accent-[#174D35]"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold text-[#17251C] mb-1">
                <span>Value / Fair Price</span>
                <span className="font-bold text-[#174D35]">{valueRating}/5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={valueRating}
                onChange={(e) => setValueRating(parseInt(e.target.value, 10))}
                className="w-full accent-[#174D35]"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold text-[#17251C] mb-1">
                <span>Packaging & Handling</span>
                <span className="font-bold text-[#174D35]">{serviceRating}/5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={serviceRating}
                onChange={(e) => setServiceRating(parseInt(e.target.value, 10))}
                className="w-full accent-[#174D35]"
              />
            </div>
          </div>

          {/* 3. Headline */}
          <div>
            <label className="block text-xs font-bold text-[#17251C] mb-1">
              {lang === 'hi' ? 'समीक्षा शीर्षक (Headline):' : lang === 'mr' ? 'समीक्षेचे शीर्षक:' : 'Review Headline:'}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                category === 'crop'
                  ? 'e.g. Incredibly sweet tomatoes with morning plucking dew!'
                  : category === 'platform_service'
                  ? 'e.g. Direct UPI bank credit within 3 hours, saved ₹15,000 mandi commission!'
                  : category === 'delivery'
                  ? 'e.g. Punctual 7:00 AM delivery, chilled crate in perfect condition'
                  : 'e.g. Grade-A uniform lot with 22% lower cost than APMC Mandi'
              }
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#174D35]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#174D35] text-[#17251C]"
              required
            />
          </div>

          {/* 4. Detailed Comments */}
          <div>
            <label className="block text-xs font-bold text-[#17251C] mb-1">
              {lang === 'hi' ? 'विस्तृत अनुभव:' : lang === 'mr' ? 'सविस्तर अनुभव:' : 'Detailed Experience:'}
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={
                lang === 'hi'
                  ? 'अपनी फसल, किसान सेवा, डिलीवरी वाहन या थोक खरीद के अनुभव के बारे में बताएं...'
                  : lang === 'mr'
                  ? 'शेतमाल, शेतकरी सेवा, वाहतूक किंवा घाऊक खरेदीच्या अनुभवाबद्दल लिहा...'
                  : 'Describe your direct farm experience, taste, weighing accuracy, or delivery transit...'
              }
              className="w-full p-3.5 text-xs bg-white border border-[#174D35]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#174D35] text-[#17251C] leading-relaxed"
              required
            />
          </div>

          {/* 5. Tags */}
          <div>
            <label className="block text-xs font-bold text-[#17251C] mb-1">
              {lang === 'hi' ? 'हाइलाइट टैग्स:' : lang === 'mr' ? 'महत्वाचे टॅग्ज:' : 'Highlight Tags:'}
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="e.g. Dawn Plucked, Zero Commission, Chilled Transit"
                className="flex-1 px-3 py-1.5 text-xs bg-white border border-[#174D35]/20 rounded-lg text-[#17251C] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-1.5 bg-[#174D35]/10 hover:bg-[#174D35]/20 text-[#174D35] text-xs font-bold rounded-lg transition-colors"
              >
                + Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((t, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#174D35]/10 text-[#174D35] text-[10px] font-semibold"
                >
                  {t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="hover:text-red-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
              {errorMsg}
            </div>
          )}

          {/* Action CTAs */}
          <div className="pt-2 flex items-center justify-between">
            <div className="text-[11px] text-[#7C887E] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#3C8D5A]" />
              Verified by KrishiConnect Blockchain Ledger
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-[#7C887E] hover:text-[#17251C]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-[#174D35] text-white font-bold text-xs hover:bg-[#123b28] disabled:opacity-50 transition-colors shadow-sm flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-[#B7D96B]" />
                <span>{isSubmitting ? 'Publishing...' : 'Publish Review'}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
