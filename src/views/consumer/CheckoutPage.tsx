import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  Sparkles,
  Lock
} from 'lucide-react';
import { useCart } from '../../context/CartContext.js';
import { useAuth } from '../../context/AuthContext.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { RazorpayDemoModal } from '../../components/modals/RazorpayDemoModal.js';
import { Order } from '../../types/index.js';

interface CheckoutPageProps {
  setCurrentView: (view: string) => void;
  onOrderCreated: (newOrder: Order) => void;
  onBack?: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ setCurrentView, onOrderCreated, onBack }) => {
  const { t } = useLanguage();
  const { items, subtotal, deliveryCharge, platformFee, totalAmount, farmerEarnings, clearCart } = useCart();
  const { user } = useAuth();

  const [address, setAddress] = useState({
    street: 'Flat 402, Narmada Residency, E-3 Arera Colony',
    city: 'Bhopal',
    district: 'Bhopal',
    state: 'Madhya Pradesh',
    pincode: '462016',
    landmark: 'Near Rani Kamlapati Station',
  });

  const [paymentMethod, setPaymentMethod] = useState<'Razorpay' | 'COD'>('Razorpay');
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (items.length === 0 && !completedOrder) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#17251C]">Your Farm Basket is Empty</h2>
        <p className="text-xs text-[#7C887E]">
          Explore seasonal fresh crops plucked directly from certified Sehore and Vidisha growers.
        </p>
        <button
          onClick={() => setCurrentView('marketplace')}
          className="px-6 py-3 rounded-xl bg-[#174D35] text-white text-xs font-bold hover:bg-[#123b28]"
        >
          Browse Marketplace
        </button>
      </div>
    );
  }

  const handlePlaceOrder = async (payId?: string) => {
    setIsSubmitting(true);
    try {
      const orderPayload = {
        buyerId: user?.id || 'user_consumer_1',
        buyerName: user?.name || 'Pooja Sharma',
        buyerPhone: user?.phone || '+91 94250 88219',
        buyerRole: 'consumer' as const,
        items: items.map((i) => ({
          productId: i.product.id,
          productName: i.product.name,
          farmerId: i.product.farmerId,
          farmerName: i.product.farmerName,
          quantity: i.quantity,
          unit: i.product.unit,
          unitPrice: i.product.pricePerUnit,
          totalPrice: i.product.pricePerUnit * i.quantity,
          imageUrl: i.product.imageUrl,
        })),
        farmerIds: Array.from(new Set(items.map((i) => i.product.farmerId))),
        deliveryAddress: address,
        pricingBreakdown: {
          itemsSubtotal: subtotal,
          platformFee,
          deliveryCharge,
          tax: 0,
          totalAmount,
          farmerEarningsTotal: farmerEarnings,
        },
        paymentMethod,
        paymentStatus: paymentMethod === 'Razorpay' ? ('Paid' as const) : ('Pending' as const),
        paymentId: payId,
        status: 'Confirmed' as const,
        deliveryPartnerName: 'AgriFleet Van 02',
        deliveryPartnerPhone: '+91 97555 43210',
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const savedOrder = await res.json();
      setCompletedOrder(savedOrder);
      onOrderCreated(savedOrder);
      clearCart();

      // Fire celebratory confetti!
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#174D35', '#3C8D5A', '#B7D96B', '#E6A23C'],
        });
      } catch (e) {
        // ignore
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProceedClick = () => {
    if (paymentMethod === 'Razorpay') {
      setIsRazorpayOpen(true);
    } else {
      handlePlaceOrder();
    }
  };

  // Order Confirmed State
  if (completedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8 animate-fade-in">
        <div className="p-8 bg-white rounded-3xl border border-[#174D35]/15 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#174D35] text-[#B7D96B] flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div>
            <span className="text-xs font-bold text-[#3C8D5A] uppercase tracking-wider">
              Harvest Order Confirmed
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17251C] mt-1">
              Thank You, {user?.name}!
            </h1>
            <p className="text-xs text-[#7C887E] mt-1">
              Order <strong className="text-[#174D35] font-mono">{completedOrder.orderNumber}</strong> has been routed directly to the farm cooperatives.
            </p>
          </div>

          <div className="p-4 bg-[#174D35]/5 rounded-2xl border border-[#174D35]/15 max-w-md mx-auto text-left text-xs space-y-1.5">
            <div className="flex justify-between font-bold text-[#174D35]">
              <span>Direct Farmer Payout:</span>
              <span>₹{completedOrder.pricingBreakdown.farmerEarningsTotal}</span>
            </div>
            <div className="flex justify-between text-[#7C887E]">
              <span>Estimated Delivery:</span>
              <span>Tomorrow morning before 11:30 AM</span>
            </div>
            <div className="flex justify-between text-[#7C887E]">
              <span>Assigned Vehicle:</span>
              <span>AgriFleet Insulated Dispatch</span>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setCurrentView('consumer-dashboard')}
              className="px-6 py-3 rounded-xl bg-[#174D35] text-white text-xs font-bold hover:bg-[#123b28] transition-colors"
            >
              Track Order on Dashboard
            </button>
            <button
              onClick={() => setCurrentView('marketplace')}
              className="px-6 py-3 rounded-xl bg-white border border-[#174D35]/20 text-[#174D35] text-xs font-bold hover:bg-[#F7F8F2] transition-colors"
            >
              Shop More Produce
            </button>
          </div>
        </div>
      </div>
    );
  }

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

      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-extrabold text-[#17251C]">Direct Farm Order Checkout</h1>
        <span className="text-xs bg-[#B7D96B] text-[#174D35] font-bold px-2.5 py-0.5 rounded-full">
          Transparent Billing
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Delivery Address & Payment Method */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Address Card */}
          <div className="p-6 bg-white rounded-3xl border border-[#174D35]/15 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#174D35]/10">
              <MapPin className="w-5 h-5 text-[#3C8D5A]" />
              <h3 className="font-bold text-base text-[#17251C]">1. Farm-Gate Delivery Address</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-[#17251C] mb-1">House / Flat / Street</label>
                <input
                  type="text"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F7F8F2] border border-[#174D35]/20 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#17251C] mb-1">City / Region</label>
                <input
                  type="text"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F7F8F2] border border-[#174D35]/20 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#17251C] mb-1">District</label>
                <input
                  type="text"
                  value={address.district}
                  onChange={(e) => setAddress({ ...address, district: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F7F8F2] border border-[#174D35]/20 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#17251C] mb-1">Pincode</label>
                <input
                  type="text"
                  value={address.pincode}
                  onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F7F8F2] border border-[#174D35]/20 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#17251C] mb-1">Landmark</label>
                <input
                  type="text"
                  value={address.landmark}
                  onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F7F8F2] border border-[#174D35]/20 rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="p-6 bg-white rounded-3xl border border-[#174D35]/15 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#174D35]/10">
              <CreditCard className="w-5 h-5 text-[#3C8D5A]" />
              <h3 className="font-bold text-base text-[#17251C]">2. Payment Method</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setPaymentMethod('Razorpay')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  paymentMethod === 'Razorpay'
                    ? 'border-[#174D35] bg-[#174D35]/5 ring-2 ring-[#174D35]/20'
                    : 'border-slate-200 hover:bg-neutral-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-[#17251C]">Razorpay Gateway</span>
                    <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.2 rounded">
                      UPI / Card / NetBanking
                    </span>
                  </div>
                  <p className="text-[11px] text-[#7C887E]">
                    Simulated sandboxed test payment with instant webhook verification.
                  </p>
                </div>
                <div className="text-[10px] text-[#3C8D5A] font-semibold mt-2">
                  ✓ Instant 100% credit to farmer
                </div>
              </div>

              <div
                onClick={() => setPaymentMethod('COD')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  paymentMethod === 'COD'
                    ? 'border-[#174D35] bg-[#174D35]/5 ring-2 ring-[#174D35]/20'
                    : 'border-slate-200 hover:bg-neutral-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-[#17251C]">Cash on Delivery (COD)</span>
                    <span className="text-[10px] bg-neutral-200 text-neutral-800 font-bold px-1.5 py-0.2 rounded">
                      Pay at Doorstep
                    </span>
                  </div>
                  <p className="text-[11px] text-[#7C887E]">
                    Inspect farm-fresh produce before payment to AgriFleet driver.
                  </p>
                </div>
                <div className="text-[10px] text-[#7C887E] font-semibold mt-2">
                  Zero advance deposit needed
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Order Summary & Price Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 bg-white rounded-3xl border border-[#174D35]/15 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-[#17251C] pb-3 border-b border-[#174D35]/10">
              Basket Summary ({items.length} items)
            </h3>

            {/* Produce Items */}
            <div className="divide-y divide-[#174D35]/10 text-xs max-h-56 overflow-y-auto pr-1">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-10 h-10 rounded-lg object-cover bg-neutral-100 shrink-0"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/src/assets/images/ripe_desi_tomatoes_1794193349094.jpg';
                      }}
                    />
                    <div>
                      <h4 className="font-bold text-[#17251C] line-clamp-1">{product.name}</h4>
                      <div className="text-[11px] text-[#7C887E]">
                        {quantity} {product.unit} × ₹{product.pricePerUnit} · {product.farmerName}
                      </div>
                    </div>
                  </div>
                  <span className="font-bold text-[#17251C] tabular-nums">
                    ₹{product.pricePerUnit * quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Transparency Audit Card */}
            <div className="p-3.5 bg-[#174D35]/5 rounded-2xl border border-[#174D35]/15 space-y-2 text-xs">
              <div className="flex justify-between text-[#174D35] font-bold">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-[#3C8D5A]" />
                  Direct Farmer Payout (100%):
                </span>
                <span className="tabular-nums">₹{farmerEarnings}</span>
              </div>
              <div className="flex justify-between text-[#7C887E]">
                <span>Cold Farm-Gate Delivery:</span>
                <span className="tabular-nums">
                  {deliveryCharge === 0 ? <span className="text-[#3C8D5A]">FREE</span> : `₹${deliveryCharge}`}
                </span>
              </div>
              <div className="flex justify-between text-[#7C887E]">
                <span>Platform Fee & Quality Testing:</span>
                <span className="tabular-nums">₹{platformFee}</span>
              </div>
              <div className="pt-2 border-t border-[#174D35]/15 flex justify-between font-extrabold text-sm text-[#17251C]">
                <span>Total Amount:</span>
                <span className="text-base text-[#174D35] tabular-nums">₹{totalAmount}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              onClick={handleProceedClick}
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-[#174D35] text-white font-bold text-xs hover:bg-[#123b28] disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Lock className="w-4 h-4 text-[#B7D96B]" />
              <span>
                {paymentMethod === 'Razorpay'
                  ? `Pay with Razorpay Demo (₹${totalAmount})`
                  : `Confirm Order with COD (₹${totalAmount})`}
              </span>
            </button>

            <div className="text-[10px] text-[#7C887E] text-center">
              Backed by KrishiConnect Transit Freshness Guarantee. Full refund on damaged goods.
            </div>
          </div>
        </div>

      </div>

      {/* Razorpay Test Modal */}
      <RazorpayDemoModal
        isOpen={isRazorpayOpen}
        onClose={() => setIsRazorpayOpen(false)}
        amount={totalAmount}
        orderNumber={`KC-2026-${Math.floor(1000 + Math.random() * 9000)}`}
        onSuccess={(payId) => {
          setIsRazorpayOpen(false);
          handlePlaceOrder(payId);
        }}
        onFailure={(err) => {
          alert('Simulated payment failure triggered. You can retry with another method.');
        }}
      />

    </div>
  );
};
