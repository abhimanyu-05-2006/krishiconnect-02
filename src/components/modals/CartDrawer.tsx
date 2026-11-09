import React from 'react';
import { X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext.js';
import { useLanguage } from '../../context/LanguageContext.js';

interface CartDrawerProps {
  setCurrentView: (view: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ setCurrentView }) => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    isCartOpen,
    setIsCartOpen,
    subtotal,
    deliveryCharge,
    platformFee,
    totalAmount,
    farmerEarnings,
  } = useCart();
  const { t } = useLanguage();

  if (!isCartOpen) return null;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setCurrentView('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#F7F8F2] shadow-2xl border-l border-[#174D35]/15 flex flex-col">
          
          {/* Header */}
          <div className="p-5 bg-[#174D35] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-base">{t('cart_title')}</span>
              <span className="text-xs bg-[#B7D96B] text-[#174D35] font-extrabold px-2 py-0.5 rounded-full">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#7C887E]">
                <div className="w-16 h-16 rounded-full bg-[#174D35]/10 flex items-center justify-center text-[#174D35] mb-4">
                  <Heart className="w-8 h-8 opacity-60" />
                </div>
                <h4 className="font-bold text-[#17251C] text-base mb-1">{t('cart_empty')}</h4>
                <p className="text-xs max-w-xs mb-6">
                  Browse farm-gate organic veggies, pulses, and grain harvested directly from certified MP farms.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setCurrentView('marketplace');
                  }}
                  className="px-5 py-2.5 rounded-lg bg-[#174D35] text-white text-xs font-semibold hover:bg-[#123b28] transition-colors"
                >
                  {t('btn_shop_produce')}
                </button>
              </div>
            ) : (
              items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="p-3.5 bg-white rounded-xl border border-[#174D35]/10 shadow-xs flex gap-3"
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-18 h-18 rounded-lg object-cover bg-neutral-100 shrink-0"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/src/assets/images/ripe_desi_tomatoes_1794193349094.jpg';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-xs text-[#17251C] line-clamp-1">{product.name}</h4>
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="text-[#7C887E] hover:text-red-600 p-0.5 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] text-[#3C8D5A] font-medium mt-0.5">
                      Farm: {product.farmerName} ({product.district})
                    </div>

                    <div className="flex items-center justify-between mt-2.5">
                      <div className="text-xs font-bold text-[#17251C] tabular-nums">
                        ₹{product.pricePerUnit * quantity}
                        <span className="text-[10px] text-[#7C887E] font-normal ml-1">
                          (₹{product.pricePerUnit}/{product.unit})
                        </span>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[#174D35]/20 rounded-md bg-[#F7F8F2] overflow-hidden">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="px-2 py-1 text-[#17251C] hover:bg-white transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-[#174D35] tabular-nums">
                          {quantity} {product.unit}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="px-2 py-1 text-[#17251C] hover:bg-white transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pricing & Transparency Breakdown */}
          {items.length > 0 && (
            <div className="p-5 bg-white border-t border-[#174D35]/15 space-y-3">
              
              {/* Direct Farmer Cut Callout */}
              <div className="p-2.5 rounded-lg bg-[#174D35]/5 border border-[#174D35]/15 text-xs flex items-center justify-between">
                <span className="font-semibold text-[#174D35] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#3C8D5A]" />
                  {t('farmer_receives')}:
                </span>
                <span className="font-bold text-[#174D35] tabular-nums">₹{farmerEarnings}</span>
              </div>

              {/* Price Details */}
              <div className="space-y-1.5 text-xs text-[#7C887E]">
                <div className="flex justify-between">
                  <span>{t('cart_subtotal')}</span>
                  <span className="text-[#17251C] font-semibold tabular-nums">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('cart_delivery')}</span>
                  <span className="text-[#17251C] font-semibold tabular-nums">
                    {deliveryCharge === 0 ? (
                      <span className="text-[#3C8D5A]">{t('cart_free_delivery')}</span>
                    ) : (
                      `₹${deliveryCharge}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{t('platform_fee')}</span>
                  <span className="text-[#17251C] font-semibold tabular-nums">₹{platformFee}</span>
                </div>
                <div className="pt-2 border-t border-[#174D35]/10 flex justify-between text-sm font-bold text-[#17251C]">
                  <span>{t('cart_total')}</span>
                  <span className="text-[#174D35] text-base tabular-nums">₹{totalAmount}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3 rounded-xl bg-[#174D35] text-white font-bold text-sm hover:bg-[#123b28] transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <span>{t('btn_checkout')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
