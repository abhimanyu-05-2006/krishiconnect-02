import React, { useState } from 'react';
import {
  Store,
  FileText,
  Plus,
  TrendingDown,
  Building2,
  CheckCircle2,
  Printer,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Scale
} from 'lucide-react';
import { Product, BulkPurchaseRequest, Order } from '../../types/index.js';
import { useAuth } from '../../context/AuthContext.js';

interface RetailerDashboardProps {
  products: Product[];
  orders: Order[];
  onRefreshData: () => void;
}

export const RetailerDashboard: React.FC<RetailerDashboardProps> = ({
  products,
  orders,
  onRefreshData,
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'catalog' | 'rfq' | 'invoices'>('catalog');
  const [isRfqModalOpen, setIsRfqModalOpen] = useState(false);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(orders[1] || orders[0]);

  // RFQ Form state
  const [rfqForm, setRfqForm] = useState({
    productName: 'Organic Desi Tomatoes (Grade A)',
    category: 'Vegetables' as const,
    requiredQuantity: 20,
    unit: 'quintal' as const,
    targetPricePerUnit: 2200,
    requiredByDate: '2026-11-18',
    destinationCity: 'Bhopal Central Warehouse',
  });

  const [rfqs, setRfqs] = useState<BulkPurchaseRequest[]>([
    {
      id: 'bulk_1',
      retailerId: 'user_retailer_1',
      retailerName: 'Rajesh Agrawal',
      businessName: 'GreenLeaf Supermart & Fresh Hub',
      businessType: 'Supermarket',
      productName: 'Organic Red Tomatoes',
      category: 'Vegetables',
      requiredQuantity: 10,
      unit: 'quintal',
      targetPricePerUnit: 2200,
      requiredByDate: '2026-11-15',
      destinationCity: 'Bhopal (MP Nagar)',
      status: 'Bids Received',
      matchedFarmersCount: 3,
      bids: [
        {
          farmerId: 'fp_1',
          farmerName: 'Rameshwar Patidar (Sehore)',
          offeredPrice: 2250,
          deliveryAvailable: true,
          note: 'Vine-ripened tomatoes in 25kg plastic crates. Plucked morning of delivery.',
        },
        {
          farmerId: 'fp_10',
          farmerName: 'Sunita Bai (Vidisha)',
          offeredPrice: 2300,
          deliveryAvailable: false,
          note: 'Direct polyhouse harvest at Kurwai farm-gate.',
        },
      ],
      createdAt: '2026-11-03T11:00:00Z',
    },
  ]);

  const handleCreateRfq = (e: React.FormEvent) => {
    e.preventDefault();
    const newRfq: BulkPurchaseRequest = {
      id: `bulk_${Date.now()}`,
      retailerId: user?.id || 'user_retailer_1',
      retailerName: user?.name || 'Rajesh Agrawal',
      businessName: 'GreenLeaf Supermart & Fresh Hub',
      businessType: 'Supermarket',
      ...rfqForm,
      status: 'Open',
      matchedFarmersCount: 4,
      createdAt: new Date().toISOString(),
    };
    setRfqs([newRfq, ...rfqs]);
    setIsRfqModalOpen(false);
  };

  const wholesaleProducts = products.filter((p) => p.wholesaleDiscountPercent);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-[#174D35]/15 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#3C8D5A] uppercase tracking-wider">
              B2B Institutional Procurement
            </span>
            <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
              Verified Wholesale Buyer
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17251C] mt-1">
            GreenLeaf Supermart & Restaurant Supply
          </h1>
          <p className="text-xs text-[#7C887E] mt-0.5">
            Registered GSTIN: 23AABCG1234F1Z8 · Direct Sourcing from 40+ Certified MP Farmer Cooperatives
          </p>
        </div>

        <button
          onClick={() => setIsRfqModalOpen(true)}
          className="px-5 py-3 rounded-xl bg-[#174D35] text-white text-xs font-bold hover:bg-[#123b28] transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4 text-[#B7D96B]" />
          <span>Post Bulk RFQ Request</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#174D35]/15 text-xs font-bold">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`pb-3 mr-6 transition-colors ${
            activeTab === 'catalog'
              ? 'text-[#174D35] border-b-2 border-[#174D35]'
              : 'text-[#7C887E] hover:text-[#174D35]'
          }`}
        >
          Wholesale Farm Catalog ({wholesaleProducts.length})
        </button>
        <button
          onClick={() => setActiveTab('rfq')}
          className={`pb-3 mr-6 transition-colors ${
            activeTab === 'rfq'
              ? 'text-[#174D35] border-b-2 border-[#174D35]'
              : 'text-[#7C887E] hover:text-[#174D35]'
          }`}
        >
          Bulk Purchase Requests ({rfqs.length})
        </button>
        <button
          onClick={() => setActiveTab('invoices')}
          className={`pb-3 mr-6 transition-colors ${
            activeTab === 'invoices'
              ? 'text-[#174D35] border-b-2 border-[#174D35]'
              : 'text-[#7C887E] hover:text-[#174D35]'
          }`}
        >
          Commercial Tax Invoices
        </button>
      </div>

      {/* 1. WHOLESALE CATALOG */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#17251C]">Direct Farm Wholesale Deals</h3>
              <p className="text-xs text-[#7C887E]">
                Crops with bulk tier discounts for orders above 50 kg or 1 quintal
              </p>
            </div>
            <span className="text-xs text-[#3C8D5A] font-semibold">
              Zero APMC Cess · 100% Origin Traceable
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {wholesaleProducts.map((p) => {
              const discountedPrice = Math.round(p.pricePerUnit * (1 - (p.wholesaleDiscountPercent || 0) / 100));

              return (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl border border-[#174D35]/15 overflow-hidden shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 overflow-hidden bg-neutral-100">
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/src/assets/images/ripe_desi_tomatoes_1794193349094.jpg';
                        }}
                      />
                      <span className="absolute top-3 left-3 bg-[#174D35] text-[#B7D96B] text-[10px] font-extrabold px-2.5 py-1 rounded shadow">
                        {p.wholesaleDiscountPercent}% WHOLESALE CONCESSION
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="text-[11px] font-semibold text-[#3C8D5A]">
                        {p.farmerName} · {p.district}
                      </div>
                      <h4 className="font-bold text-sm text-[#17251C]">{p.name}</h4>
                      <p className="text-xs text-[#7C887E] line-clamp-2">{p.description}</p>

                      <div className="pt-2 border-t border-[#174D35]/10 space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-[#7C887E]">Retail Consumer Rate:</span>
                          <span className="line-through text-slate-500 tabular-nums">₹{p.pricePerUnit}/{p.unit}</span>
                        </div>
                        <div className="flex justify-between text-[#174D35] font-black text-sm">
                          <span>Bulk Tier (≥{p.wholesaleMinQuantity} {p.unit}):</span>
                          <span className="tabular-nums">₹{discountedPrice}/{p.unit}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-[#F7F8F2] border-t border-[#174D35]/10 flex items-center justify-between text-xs">
                    <span className="text-[#7C887E]">Stock: {p.availableQuantity} {p.unit}</span>
                    <button
                      onClick={() => {
                        alert(`Wholesale procurement order for ${p.wholesaleMinQuantity} ${p.unit} of ${p.name} sent to farmer ${p.farmerName}.`);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#174D35] text-white font-bold hover:bg-[#123b28] transition-colors"
                    >
                      Procure Bulk
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. RFQ TAB */}
      {activeTab === 'rfq' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#17251C]">Active Bulk Procurement Tenders</h3>
              <p className="text-xs text-[#7C887E]">
                Direct requests for quotes sent to regional farmer producer organizations (FPOs)
              </p>
            </div>
            <button
              onClick={() => setIsRfqModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#174D35] text-white text-xs font-bold hover:bg-[#123b28]"
            >
              + Create New RFQ
            </button>
          </div>

          <div className="space-y-4">
            {rfqs.map((rfq) => (
              <div
                key={rfq.id}
                className="p-6 bg-white rounded-2xl border border-[#174D35]/15 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#174D35]/10">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-base text-[#17251C]">{rfq.productName}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-amber-100 text-amber-800">
                        {rfq.status}
                      </span>
                    </div>
                    <div className="text-xs text-[#7C887E] mt-0.5">
                      Required Quantity: <strong className="text-[#17251C]">{rfq.requiredQuantity} {rfq.unit}</strong> · Target Price: ₹{rfq.targetPricePerUnit}/{rfq.unit} · Deliver to: {rfq.destinationCity}
                    </div>
                  </div>

                  <span className="text-xs font-bold text-[#3C8D5A]">
                    {rfq.matchedFarmersCount} Nearby Farmers Notified
                  </span>
                </div>

                {/* Farmer Bids */}
                {rfq.bids && rfq.bids.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-[#17251C] block">Direct Farmer Quotes Received:</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {rfq.bids.map((b, idx) => (
                        <div key={idx} className="p-3.5 bg-[#F7F8F2] rounded-xl border border-[#174D35]/10 text-xs space-y-1">
                          <div className="flex justify-between items-center font-bold">
                            <span className="text-[#174D35]">{b.farmerName}</span>
                            <span className="text-sm font-black tabular-nums">₹{b.offeredPrice}/{rfq.unit}</span>
                          </div>
                          <p className="text-[#7C887E] leading-relaxed">{b.note}</p>
                          <div className="pt-2 flex justify-end">
                            <button
                              onClick={() => alert(`Bid of ₹${b.offeredPrice} from ${b.farmerName} accepted! Contract generated.`)}
                              className="px-3 py-1 bg-[#174D35] text-white font-bold rounded-lg hover:bg-[#123b28]"
                            >
                              Accept Quote
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. TAX INVOICE GENERATOR UI */}
      {activeTab === 'invoices' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#17251C]">Automated Commercial Tax Invoices</h3>
              <p className="text-xs text-[#7C887E]">
                GST compliant B2B invoices with direct agricultural origin certification
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-white border border-[#174D35]/25 text-[#174D35] text-xs font-bold hover:bg-neutral-50 flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice</span>
            </button>
          </div>

          {/* Printable Invoice Card */}
          {selectedInvoiceOrder && (
            <div className="bg-white rounded-3xl border border-[#174D35]/20 p-8 shadow-sm space-y-6 max-w-4xl mx-auto">
              
              <div className="flex items-start justify-between pb-6 border-b border-[#174D35]/15">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-extrabold text-[#174D35]">KrishiConnect AgriTech</span>
                    <span className="text-[10px] bg-[#174D35]/10 text-[#174D35] font-bold px-2 py-0.5 rounded">
                      TAX INVOICE
                    </span>
                  </div>
                  <p className="text-xs text-[#7C887E] mt-1">
                    Direct Agricultural Trade Infrastructure Platform<br />
                    Bhopal Technology Park, MP 462023 · GSTIN: 23AAACK1122M1ZX
                  </p>
                </div>

                <div className="text-right text-xs space-y-0.5">
                  <div className="font-bold text-[#17251C]">Invoice #: INV-2026-9041</div>
                  <div className="text-[#7C887E]">Order Ref: {selectedInvoiceOrder.orderNumber}</div>
                  <div className="text-[#7C887E]">Date: {selectedInvoiceOrder.createdAt.split('T')[0]}</div>
                </div>
              </div>

              {/* Bill To & Source */}
              <div className="grid grid-cols-2 gap-8 text-xs pb-6 border-b border-[#174D35]/15">
                <div>
                  <span className="font-bold text-[#7C887E] uppercase block mb-1">Billed To (Retailer)</span>
                  <div className="font-bold text-[#17251C] text-sm">GreenLeaf Supermart & Fresh Hub</div>
                  <div className="text-[#7C887E] mt-0.5">
                    Warehouse 12, Transport Nagar, Kokta, Bhopal, MP<br />
                    GSTIN: 23AABCG1234F1Z8 · Contact: +91 98930 11420
                  </div>
                </div>

                <div>
                  <span className="font-bold text-[#7C887E] uppercase block mb-1">Harvest Origin Hub</span>
                  <div className="font-bold text-[#174D35] text-sm">Narmada Organic Farms Cooperative</div>
                  <div className="text-[#7C887E] mt-0.5">
                    Grower: Rameshwar Patidar (Village Ashta, Sehore)<br />
                    APMC Exempted Direct Agriculture Category
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#F7F8F2] text-[#7C887E] font-bold border-b border-[#174D35]/15">
                    <tr>
                      <th className="p-3">Produce Description</th>
                      <th className="p-3">HSN Code</th>
                      <th className="p-3">Quantity</th>
                      <th className="p-3">Unit Price</th>
                      <th className="p-3 text-right">Taxable Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#174D35]/10">
                    {selectedInvoiceOrder.items.map((i, idx) => (
                      <tr key={idx}>
                        <td className="p-3 font-semibold text-[#17251C]">{i.productName}</td>
                        <td className="p-3 text-slate-500 font-mono">07020000</td>
                        <td className="p-3 font-bold tabular-nums">{i.quantity} {i.unit}</td>
                        <td className="p-3 tabular-nums">₹{i.unitPrice}</td>
                        <td className="p-3 text-right font-bold tabular-nums">₹{i.totalPrice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financial Totals */}
              <div className="flex justify-end pt-4">
                <div className="w-64 space-y-2 text-xs">
                  <div className="flex justify-between text-[#7C887E]">
                    <span>Produce Subtotal:</span>
                    <span className="font-semibold text-[#17251C] tabular-nums">
                      ₹{selectedInvoiceOrder.pricingBreakdown.itemsSubtotal}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#7C887E]">
                    <span>AgriFleet Logistics:</span>
                    <span className="font-semibold text-[#17251C] tabular-nums">
                      ₹{selectedInvoiceOrder.pricingBreakdown.deliveryCharge}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#7C887E]">
                    <span>Platform Verification Fee:</span>
                    <span className="font-semibold text-[#17251C] tabular-nums">
                      ₹{selectedInvoiceOrder.pricingBreakdown.platformFee}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-[#174D35]/20 flex justify-between font-black text-sm text-[#174D35]">
                    <span>Total Amount Paid:</span>
                    <span className="tabular-nums">₹{selectedInvoiceOrder.pricingBreakdown.totalAmount}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F7F8F2] text-[11px] text-[#7C887E] flex items-center justify-between">
                <span>Direct agricultural produce is exempted from Central GST under Section 11 of CGST Act.</span>
                <span className="font-semibold text-[#174D35]">Digitally Signed & Validated</span>
              </div>

            </div>
          )}
        </div>
      )}

      {/* RFQ Creation Modal */}
      {isRfqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-[#174D35]/20 space-y-4">
            <h3 className="text-xl font-bold text-[#17251C]">Create Bulk Procurement Tender</h3>
            
            <form onSubmit={handleCreateRfq} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Produce Name</label>
                <input
                  type="text"
                  required
                  value={rfqForm.productName}
                  onChange={(e) => setRfqForm({ ...rfqForm, productName: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F7F8F2] border border-[#174D35]/20 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Required Quantity</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={rfqForm.requiredQuantity}
                    onChange={(e) => setRfqForm({ ...rfqForm, requiredQuantity: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-[#F7F8F2] border border-[#174D35]/20 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Unit</label>
                  <select
                    value={rfqForm.unit}
                    onChange={(e) => setRfqForm({ ...rfqForm, unit: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#F7F8F2] border border-[#174D35]/20 rounded-xl"
                  >
                    <option value="quintal">quintal (100 kg)</option>
                    <option value="kg">kg</option>
                    <option value="crate (25kg)">crate (25kg)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Target Price (₹ per unit)</label>
                  <input
                    type="number"
                    required
                    value={rfqForm.targetPricePerUnit}
                    onChange={(e) => setRfqForm({ ...rfqForm, targetPricePerUnit: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-[#F7F8F2] border border-[#174D35]/20 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Required By Date</label>
                  <input
                    type="date"
                    required
                    value={rfqForm.requiredByDate}
                    onChange={(e) => setRfqForm({ ...rfqForm, requiredByDate: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F7F8F2] border border-[#174D35]/20 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsRfqModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#174D35] text-white font-bold rounded-xl hover:bg-[#123b28]"
                >
                  Broadcast to Farmers
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
