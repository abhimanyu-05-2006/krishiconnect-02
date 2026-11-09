import React, { useState } from 'react';
import {
  ShoppingBag,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Star,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { Order, Product } from '../../types/index.js';
import { useAuth } from '../../context/AuthContext.js';
import { useCart } from '../../context/CartContext.js';

interface ConsumerDashboardProps {
  orders: Order[];
  products: Product[];
  setCurrentView: (view: string) => void;
  openAiChat: () => void;
  onRefreshOrders: () => void;
}

export const ConsumerDashboard: React.FC<ConsumerDashboardProps> = ({
  orders,
  products,
  setCurrentView,
  openAiChat,
  onRefreshOrders,
}) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState<'active' | 'history' | 'favorites'>('active');

  // Filter orders for current consumer
  const consumerOrders = orders.filter((o) => o.buyerRole === 'consumer');
  const activeOrders = consumerOrders.filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled');
  const deliveredOrders = consumerOrders.filter((o) => o.status === 'Delivered');

  const orderStepIndex: Record<string, number> = {
    Confirmed: 0,
    Accepted: 1,
    Preparing: 2,
    'Ready for Pickup': 3,
    'Picked Up': 4,
    'Out for Delivery': 5,
    Delivered: 6,
  };

  const steps = [
    'Confirmed',
    'Accepted',
    'Harvesting',
    'Ready',
    'Picked Up',
    'On The Way',
    'Delivered',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Consumer Header */}
      <div className="bg-white rounded-3xl border border-[#174D35]/15 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#3C8D5A] uppercase tracking-wider">
              Consumer Account
            </span>
            <span className="text-[10px] bg-[#174D35]/10 text-[#174D35] font-semibold px-2 py-0.5 rounded">
              Direct Supporter
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17251C] mt-1">
            Namaste, {user?.name || 'Pooja Sharma'}
          </h1>
          <p className="text-xs text-[#7C887E] mt-0.5">
            Your home kitchen is directly connected with Sehore and Vidisha organic farmers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('marketplace')}
            className="px-4 py-2.5 rounded-xl bg-[#174D35] text-white text-xs font-bold hover:bg-[#123b28] transition-colors flex items-center gap-2 shadow-xs"
          >
            <ShoppingBag className="w-4 h-4 text-[#B7D96B]" />
            <span>Order Fresh Produce</span>
          </button>

          <button
            onClick={openAiChat}
            className="px-4 py-2.5 rounded-xl bg-[#3C8D5A]/15 text-[#174D35] hover:bg-[#3C8D5A]/25 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-[#3C8D5A]" />
            <span>Ask KrishiMitra AI</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#174D35]/15 text-xs font-bold">
        <button
          onClick={() => setActiveTab('active')}
          className={`pb-3 mr-6 transition-colors ${
            activeTab === 'active'
              ? 'text-[#174D35] border-b-2 border-[#174D35]'
              : 'text-[#7C887E] hover:text-[#174D35]'
          }`}
        >
          Active Deliveries ({activeOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 mr-6 transition-colors ${
            activeTab === 'history'
              ? 'text-[#174D35] border-b-2 border-[#174D35]'
              : 'text-[#7C887E] hover:text-[#174D35]'
          }`}
        >
          Past Orders ({deliveredOrders.length})
        </button>
      </div>

      {/* ACTIVE ORDERS VIEW */}
      {activeTab === 'active' && (
        <div className="space-y-6">
          {activeOrders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#174D35]/15 p-12 text-center space-y-3">
              <Truck className="w-12 h-12 text-[#3C8D5A] mx-auto opacity-70" />
              <h3 className="font-bold text-base text-[#17251C]">No Active Deliveries Right Now</h3>
              <p className="text-xs text-[#7C887E] max-w-sm mx-auto">
                All previous orders have arrived safely. Browse today’s harvest from Sehore growers!
              </p>
              <button
                onClick={() => setCurrentView('marketplace')}
                className="px-5 py-2.5 rounded-xl bg-[#174D35] text-white text-xs font-bold hover:bg-[#123b28]"
              >
                Explore Marketplace
              </button>
            </div>
          ) : (
            activeOrders.map((o) => {
              const currentStep = orderStepIndex[o.status] || 0;

              return (
                <div
                  key={o.id}
                  className="p-6 bg-white rounded-3xl border border-[#174D35]/15 shadow-xs space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#174D35]/10">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-base text-[#174D35]">{o.orderNumber}</span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded uppercase bg-[#B7D96B]/30 text-[#174D35]">
                          {o.status}
                        </span>
                      </div>
                      <div className="text-xs text-[#7C887E] mt-0.5">
                        Plucked to order from rural farm hubs · {o.estimatedDeliveryTime || 'Today'}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-[#7C887E]">Total Paid</span>
                      <div className="text-xl font-black text-[#174D35] tabular-nums">
                        ₹{o.pricingBreakdown.totalAmount}
                      </div>
                    </div>
                  </div>

                  {/* Visual Delivery Stepper */}
                  <div className="py-2">
                    <div className="grid grid-cols-7 gap-1 text-center">
                      {steps.map((st, idx) => {
                        const isPastOrCurrent = idx <= currentStep;
                        const isCurrent = idx === currentStep;

                        return (
                          <div key={st} className="flex flex-col items-center">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1.5 transition-all ${
                                isCurrent
                                  ? 'bg-[#174D35] text-white ring-4 ring-[#174D35]/20'
                                  : isPastOrCurrent
                                  ? 'bg-[#3C8D5A] text-white'
                                  : 'bg-neutral-100 text-[#7C887E]'
                              }`}
                            >
                              {idx + 1}
                            </div>
                            <span
                              className={`text-[10px] font-semibold leading-tight line-clamp-1 ${
                                isCurrent
                                  ? 'text-[#174D35]'
                                  : isPastOrCurrent
                                  ? 'text-[#3C8D5A]'
                                  : 'text-[#7C887E]'
                              }`}
                            >
                              {st}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Items and Destination */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
                    <div className="p-3.5 bg-[#F7F8F2] rounded-xl border border-[#174D35]/10 space-y-2">
                      <span className="font-bold text-[#17251C] block">Crops in this Delivery:</span>
                      {o.items.map((i, idx) => (
                        <div key={idx} className="flex justify-between py-0.5 text-neutral-700">
                          <span>{i.productName} ({i.farmerName})</span>
                          <span className="font-bold tabular-nums">{i.quantity} {i.unit}</span>
                        </div>
                      ))}
                    </div>

                    <div className="p-3.5 bg-[#F7F8F2] rounded-xl border border-[#174D35]/10 space-y-1">
                      <span className="font-bold text-[#17251C] block">Direct Delivery Destination:</span>
                      <p className="text-[#7C887E] leading-relaxed">
                        {o.deliveryAddress.street}, {o.deliveryAddress.city}
                      </p>
                      <div className="text-[11px] text-[#3C8D5A] font-semibold pt-1">
                        AgriFleet Partner: {o.deliveryPartnerName} ({o.deliveryPartnerPhone})
                      </div>
                    </div>
                  </div>

                  {/* Audit Footer */}
                  <div className="text-[11px] text-[#7C887E] flex items-center justify-between pt-2 border-t border-[#174D35]/10">
                    <span>Farmer Take-Home: <strong>₹{o.pricingBreakdown.farmerEarningsTotal}</strong> (Zero middleman fee deducted)</span>
                    <button
                      onClick={onRefreshOrders}
                      className="text-[#174D35] font-semibold hover:underline flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" /> Refresh GPS Status
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* DELIVERED ORDERS HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {deliveredOrders.map((o) => (
            <div
              key={o.id}
              className="p-5 bg-white rounded-2xl border border-[#174D35]/15 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-[#174D35]">{o.orderNumber}</span>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    Delivered
                  </span>
                </div>
                <div className="text-xs text-[#7C887E] mt-1">
                  {o.items.map((i) => `${i.productName} (${i.quantity} ${i.unit})`).join(', ')}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-xs text-[#7C887E]">Total</span>
                  <div className="font-bold text-sm text-[#17251C] tabular-nums">
                    ₹{o.pricingBreakdown.totalAmount}
                  </div>
                </div>

                <button
                  onClick={() => {
                    // Reorder items
                    for (const item of o.items) {
                      const prod = products.find((p) => p.id === item.productId);
                      if (prod) addToCart(prod, item.quantity);
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-[#174D35] text-white text-xs font-bold hover:bg-[#123b28] transition-colors"
                >
                  Reorder Produce
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
