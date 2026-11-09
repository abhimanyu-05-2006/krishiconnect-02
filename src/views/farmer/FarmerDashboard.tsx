import React, { useState, useEffect } from 'react';
import {
  Wheat,
  TrendingUp,
  Package,
  ShoppingBag,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  AlertCircle,
  DollarSign,
  Scale
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { Product, Order, ProductCategory, ProductUnit } from '../../types/index.js';
import { useAuth } from '../../context/AuthContext.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { HistoricalPriceTrendsChart } from '../../components/farmer/HistoricalPriceTrendsChart.js';
import { PriceComparisonSection } from '../../components/farmer/PriceComparisonSection.js';

interface FarmerDashboardProps {
  products: Product[];
  orders: Order[];
  onRefreshData: () => void;
  openAiChat: () => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  products,
  orders,
  onRefreshData,
  openAiChat,
}) => {
  const { user } = useAuth();
  const { t, lang } = useLanguage();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'price-trends' | 'market-comparison' | 'ai-pricing' | 'forecast'>('overview');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New product form state
  const [formData, setFormData] = useState({
    name: '',
    category: 'Vegetables' as ProductCategory,
    description: '',
    pricePerUnit: 30,
    unit: 'kg' as ProductUnit,
    availableQuantity: 200,
    harvestDate: new Date().toISOString().split('T')[0],
    isOrganic: true,
    location: 'Village Ashta, Sehore',
    district: 'Sehore',
    imageUrl: '/src/assets/images/produce_basket_fresh_1793946352755.jpg',
    shelfLifeDays: 7,
    minOrderQuantity: 1,
  });

  // AI Smart Pricing Tool state
  const [pricingForm, setPricingForm] = useState({
    cropName: 'Desi Red Tomatoes',
    location: 'Sehore, MP',
    quantity: 350,
    unit: 'kg',
    currentPrice: 28,
    isOrganic: true,
  });
  const [pricingResult, setPricingResult] = useState<any>(null);
  const [isPricingLoading, setIsPricingLoading] = useState(false);

  // AI Demand Forecast state
  const [forecastResult, setForecastResult] = useState<any>(null);
  const [isForecastLoading, setIsForecastLoading] = useState(false);

  // Filter farmer specific products and orders
  const farmerId = 'fp_1'; // Rameshwar Patidar
  const farmerProducts = products.filter((p) => p.farmerId === farmerId);
  const farmerOrders = orders.filter((o) => o.farmerIds.includes(farmerId));

  // Compute metrics
  const totalEarnings = farmerOrders
    .filter((o) => o.paymentStatus === 'Paid')
    .reduce((acc, curr) => acc + curr.pricingBreakdown.farmerEarningsTotal, 0);

  const activeOrdersCount = farmerOrders.filter(
    (o) => o.status !== 'Delivered' && o.status !== 'Cancelled'
  ).length;

  const totalInventory = farmerProducts.reduce((acc, curr) => acc + curr.availableQuantity, 0);

  // Monthly Revenue Data for Chart
  const revenueData = [
    { month: 'Jun', revenue: 38000, mandiLossAvoided: 14000 },
    { month: 'Jul', revenue: 45000, mandiLossAvoided: 16500 },
    { month: 'Aug', revenue: 52000, mandiLossAvoided: 19000 },
    { month: 'Sep', revenue: 61000, mandiLossAvoided: 22000 },
    { month: 'Oct', revenue: 74000, mandiLossAvoided: 26500 },
    { month: 'Nov', revenue: 86500, mandiLossAvoided: 31000 },
  ];

  // Handle Add Product Submit
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          farmerId,
          farmerName: user?.name || 'Rameshwar Patidar',
          farmName: 'Narmada Organic Farms',
          status: 'In Stock',
        }),
      });
      if (res.ok) {
        setIsAddModalOpen(false);
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Delete Product
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to remove this crop listing?')) return;
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      onRefreshData();
    } catch (err) {
      console.error(err);
    }
  };

  // Update order status workflow
  const handleUpdateOrderStatus = async (orderId: string, nextStatus: Order['status'], desc: string) => {
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus, description: desc }),
      });
      onRefreshData();
    } catch (err) {
      console.error(err);
    }
  };

  // Trigger Gemini Smart Pricing
  const handleCalculateAiPricing = async () => {
    setIsPricingLoading(true);
    try {
      const res = await fetch('/api/ai/smart-pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pricingForm),
      });
      const data = await res.json();
      setPricingResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsPricingLoading(false);
    }
  };

  // Trigger Gemini Demand Forecast
  const handleFetchForecast = async () => {
    setIsForecastLoading(true);
    try {
      const res = await fetch('/api/ai/demand-forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: 'Vegetables', region: 'Sehore & Bhopal', timeline: '30 Days' }),
      });
      const data = await res.json();
      setForecastResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsForecastLoading(false);
    }
  };

  useEffect(() => {
    // Auto load forecast on mount
    handleFetchForecast();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Farmer Profile Header Banner */}
      <div className="bg-white rounded-3xl border border-[#174D35]/15 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src="/src/assets/images/farmer_portrait_mentor_1793946353253.jpg"
            alt="Rameshwar Patidar"
            className="w-20 h-20 rounded-2xl object-cover border-2 border-[#174D35]/20 shadow-sm"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/images/farmer_portrait_mentor_1793946353253.jpg';
            }}
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-[#17251C]">Rameshwar Patidar</h1>
              <span className="bg-[#B7D96B] text-[#174D35] text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> NPOP Verified Organic
              </span>
            </div>
            <div className="text-xs text-[#7C887E] mt-0.5">
              Narmada Organic Farms · Village Ashta, Sehore District, MP (18 Acres)
            </div>
            <div className="text-xs text-[#3C8D5A] font-medium mt-1">
              Bank UPI linked: <code className="text-[#174D35] font-mono">rameshwar@upi</code> · 100% Direct Payouts Active
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-[#174D35] text-white text-xs font-bold hover:bg-[#123b28] transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4 text-[#B7D96B]" />
            <span>List New Harvest</span>
          </button>

          <button
            onClick={openAiChat}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-[#3C8D5A]/15 text-[#174D35] hover:bg-[#3C8D5A]/25 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-[#3C8D5A]" />
            <span>KrishiMitra AI</span>
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-[#174D35]/15 text-xs font-bold overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 mr-6 whitespace-nowrap transition-colors ${
            activeTab === 'overview'
              ? 'text-[#174D35] border-b-2 border-[#174D35]'
              : 'text-[#7C887E] hover:text-[#174D35]'
          }`}
        >
          Overview & Revenue
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 mr-6 whitespace-nowrap transition-colors ${
            activeTab === 'products'
              ? 'text-[#174D35] border-b-2 border-[#174D35]'
              : 'text-[#7C887E] hover:text-[#174D35]'
          }`}
        >
          My Crop Listings ({farmerProducts.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 mr-6 whitespace-nowrap transition-colors ${
            activeTab === 'orders'
              ? 'text-[#174D35] border-b-2 border-[#174D35]'
              : 'text-[#7C887E] hover:text-[#174D35]'
          }`}
        >
          Orders & Fulfillment ({farmerOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('price-trends')}
          className={`pb-3 mr-6 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'price-trends'
              ? 'text-[#174D35] border-b-2 border-[#174D35]'
              : 'text-[#7C887E] hover:text-[#174D35]'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-[#3C8D5A]" />
          <span>Crop Price Trends (Top 3)</span>
        </button>
        <button
          onClick={() => setActiveTab('market-comparison')}
          className={`pb-3 mr-6 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'market-comparison'
              ? 'text-[#174D35] border-b-2 border-[#174D35]'
              : 'text-[#7C887E] hover:text-[#174D35]'
          }`}
        >
          <Scale className="w-3.5 h-3.5 text-[#3C8D5A]" />
          <span>Mandi vs Direct Price</span>
        </button>
        <button
          onClick={() => setActiveTab('ai-pricing')}
          className={`pb-3 mr-6 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'ai-pricing'
              ? 'text-[#174D35] border-b-2 border-[#174D35]'
              : 'text-[#7C887E] hover:text-[#174D35]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#3C8D5A]" />
          <span>AI Smart Pricing</span>
        </button>
        <button
          onClick={() => setActiveTab('forecast')}
          className={`pb-3 mr-6 whitespace-nowrap transition-colors ${
            activeTab === 'forecast'
              ? 'text-[#174D35] border-b-2 border-[#174D35]'
              : 'text-[#7C887E] hover:text-[#174D35]'
          }`}
        >
          AI Demand Forecast
        </button>
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          
          {/* Analytics KPI Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-6 rounded-2xl bg-white border border-[#174D35]/15 shadow-xs">
              <span className="text-xs font-semibold text-[#7C887E] uppercase">Total Realized Earnings</span>
              <div className="text-3xl font-black text-[#174D35] mt-1 tabular-nums">
                ₹{totalEarnings.toLocaleString()}
              </div>
              <div className="text-xs text-[#3C8D5A] font-semibold mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +32% vs Mandi Auctions
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#174D35]/15 shadow-xs">
              <span className="text-xs font-semibold text-[#7C887E] uppercase">Active Orders Pending</span>
              <div className="text-3xl font-black text-[#174D35] mt-1 tabular-nums">
                {activeOrdersCount}
              </div>
              <div className="text-xs text-[#7C887E] mt-1">Ready for dawn harvest</div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#174D35]/15 shadow-xs">
              <span className="text-xs font-semibold text-[#7C887E] uppercase">Available Harvest Stock</span>
              <div className="text-3xl font-black text-[#174D35] mt-1 tabular-nums">
                {totalInventory} units
              </div>
              <div className="text-xs text-[#3C8D5A] mt-1">Across 3 active listings</div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#174D35]/15 shadow-xs">
              <span className="text-xs font-semibold text-[#7C887E] uppercase">Farmer Rating</span>
              <div className="text-3xl font-black text-[#174D35] mt-1 tabular-nums">
                4.9 / 5.0
              </div>
              <div className="text-xs text-[#7C887E] mt-1">142 verified consumer reviews</div>
            </div>
          </div>

          {/* Side-by-Side Traditional Market vs KrishiConnect Direct Price Section */}
          <PriceComparisonSection farmerProducts={farmerProducts} />

          {/* Historical Price Trends Chart for Top 3 Crops (Recharts) */}
          <HistoricalPriceTrendsChart />

          {/* Revenue Chart with Recharts */}
          <div className="bg-white rounded-3xl border border-[#174D35]/15 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-[#17251C]">Monthly Net Revenue Growth</h3>
                <p className="text-xs text-[#7C887E]">
                  Comparing KrishiConnect direct sales against traditional mandi realization
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <div className="flex items-center gap-1.5 text-[#174D35]">
                  <span className="w-3 h-3 rounded-full bg-[#174D35]" />
                  <span>KrishiConnect Net (₹)</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#B7D96B]">
                  <span className="w-3 h-3 rounded-full bg-[#B7D96B]" />
                  <span>Middleman Commission Saved (₹)</span>
                </div>
              </div>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#174D35" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#174D35" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorSave" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#B7D96B" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#B7D96B" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#7C887E' }} axisLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#7C887E' }} axisLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                  <Tooltip
                    formatter={(val: any) => [`₹${val.toLocaleString()}`, '']}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #174D35', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#174D35" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                  <Area type="monotone" dataKey="mandiLossAvoided" stroke="#3C8D5A" strokeWidth={2} fillOpacity={1} fill="url(#colorSave)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Orders quick table */}
          <div className="bg-white rounded-3xl border border-[#174D35]/15 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#17251C]">Recent Farm Gate Orders</h3>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs font-bold text-[#174D35] hover:underline"
              >
                View All Orders
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F7F8F2] text-[#7C887E] font-semibold border-b border-[#174D35]/10">
                  <tr>
                    <th className="p-3">Order Number</th>
                    <th className="p-3">Customer / Buyer</th>
                    <th className="p-3">Produce Items</th>
                    <th className="p-3">Total Farmer Earnings</th>
                    <th className="p-3">Current Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#174D35]/10">
                  {farmerOrders.slice(0, 3).map((o) => (
                    <tr key={o.id} className="hover:bg-neutral-50/50">
                      <td className="p-3 font-mono font-bold text-[#174D35]">{o.orderNumber}</td>
                      <td className="p-3 font-semibold text-[#17251C]">
                        {o.buyerName} ({o.buyerRole})
                      </td>
                      <td className="p-3">
                        {o.items.map((i) => `${i.productName} (${i.quantity} ${i.unit})`).join(', ')}
                      </td>
                      <td className="p-3 font-bold text-[#174D35] tabular-nums">
                        ₹{o.pricingBreakdown.farmerEarningsTotal}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#174D35]/10 text-[#174D35]">
                          {o.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => setActiveTab('orders')}
                          className="text-[#174D35] font-bold hover:underline"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* 2. CROP LISTINGS MANAGEMENT TAB */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#17251C]">Active Produce Catalog</h3>
              <p className="text-xs text-[#7C887E]">
                Crops currently listed for direct consumer and bulk procurement
              </p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#174D35] text-white text-xs font-bold hover:bg-[#123b28] transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-[#B7D96B]" />
              <span>Add New Produce</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {farmerProducts.map((p) => (
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
                    <span className="absolute top-3 left-3 bg-[#174D35] text-[#B7D96B] text-[10px] font-extrabold px-2 py-0.5 rounded shadow">
                      {p.isOrganic ? 'CERTIFIED ORGANIC' : 'CONVENTIONAL'}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="text-[11px] font-semibold text-[#3C8D5A]">{p.category}</div>
                    <h4 className="font-bold text-sm text-[#17251C]">{p.name}</h4>
                    <p className="text-xs text-[#7C887E] line-clamp-2">{p.description}</p>
                    
                    <div className="pt-2 border-t border-[#174D35]/10 flex justify-between text-xs">
                      <div>
                        <span className="text-[#7C887E] text-[10px]">Price per {p.unit}:</span>
                        <div className="font-black text-[#174D35] text-base tabular-nums">₹{p.pricePerUnit}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-[#7C887E] text-[10px]">Stock Available:</span>
                        <div className="font-bold text-[#17251C] text-sm tabular-nums">
                          {p.availableQuantity} {p.unit}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-[#F7F8F2] border-t border-[#174D35]/10 flex items-center justify-between text-xs">
                  <span className="text-[#3C8D5A] font-semibold">Harvest: {p.harvestDate}</span>
                  <button
                    onClick={() => handleDeleteProduct(p.id)}
                    className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                    title="Remove listing"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. ORDER MANAGEMENT TAB */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-[#17251C]">Direct Orders & Fulfillment</h3>
            <p className="text-xs text-[#7C887E]">
              Accept incoming consumer and retailer orders, prepare harvest crates, and stage for pickup
            </p>
          </div>

          <div className="space-y-4">
            {farmerOrders.map((o) => (
              <div
                key={o.id}
                className="p-6 bg-white rounded-2xl border border-[#174D35]/15 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#174D35]/10">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-[#174D35]">{o.orderNumber}</span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded uppercase bg-[#174D35]/10 text-[#174D35]">
                        {o.status}
                      </span>
                    </div>
                    <div className="text-xs text-[#7C887E] mt-0.5">
                      Buyer: <strong className="text-[#17251C]">{o.buyerName}</strong> ({o.buyerPhone}) · Placed: {o.createdAt.split('T')[0]}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-[#7C887E]">Your Net Direct Payment</span>
                    <div className="text-xl font-black text-[#174D35] tabular-nums">
                      ₹{o.pricingBreakdown.farmerEarningsTotal}
                    </div>
                  </div>
                </div>

                {/* Items & Address */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-bold text-[#17251C] block mb-1.5">Harvest Items Required:</span>
                    <ul className="space-y-1 text-[#17251C]/80">
                      {o.items.map((i, idx) => (
                        <li key={idx} className="flex justify-between py-1 border-b border-neutral-100">
                          <span>{i.productName}</span>
                          <span className="font-bold tabular-nums">{i.quantity} {i.unit} (₹{i.totalPrice})</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="font-bold text-[#17251C] block mb-1.5">Delivery Destination:</span>
                    <p className="text-[#7C887E] leading-relaxed">
                      {o.deliveryAddress.street}, {o.deliveryAddress.city}, {o.deliveryAddress.district} ({o.deliveryAddress.pincode})
                    </p>
                    <div className="text-[11px] text-[#3C8D5A] mt-1">
                      Assigned Fleet: {o.deliveryPartnerName || 'AgriFleet Van 04'}
                    </div>
                  </div>
                </div>

                {/* Status Progression Actions */}
                <div className="pt-3 border-t border-[#174D35]/10 flex flex-wrap items-center justify-end gap-3">
                  {o.status === 'Confirmed' && (
                    <button
                      onClick={() => handleUpdateOrderStatus(o.id, 'Accepted', 'Farmer confirmed crop harvest availability')}
                      className="px-4 py-2 rounded-xl bg-[#174D35] text-white text-xs font-bold hover:bg-[#123b28]"
                    >
                      Accept Order
                    </button>
                  )}
                  {o.status === 'Accepted' && (
                    <button
                      onClick={() => handleUpdateOrderStatus(o.id, 'Preparing', 'Produce plucked and graded at farm dock')}
                      className="px-4 py-2 rounded-xl bg-[#3C8D5A] text-white text-xs font-bold hover:bg-[#2e6d45]"
                    >
                      Start Morning Plucking & Packing
                    </button>
                  )}
                  {o.status === 'Preparing' && (
                    <button
                      onClick={() => handleUpdateOrderStatus(o.id, 'Ready for Pickup', 'Staged in collection dock crates')}
                      className="px-4 py-2 rounded-xl bg-[#174D35] text-white text-xs font-bold hover:bg-[#123b28]"
                    >
                      Mark Ready for AgriFleet Pickup
                    </button>
                  )}
                  {o.status === 'Ready for Pickup' && (
                    <span className="text-xs text-[#3C8D5A] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Staged at farm dock; AgriFleet en route
                    </span>
                  )}
                  {o.status === 'Out for Delivery' && (
                    <span className="text-xs text-blue-700 font-semibold">
                      Out for city delivery to {o.buyerName}
                    </span>
                  )}
                  {o.status === 'Delivered' && (
                    <span className="text-xs text-[#3C8D5A] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Delivered & Payment Settled
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3b. CROP PRICE TRENDS TAB */}
      {activeTab === 'price-trends' && (
        <div className="space-y-6">
          <HistoricalPriceTrendsChart />
        </div>
      )}

      {/* 3c. TRADITIONAL MARKET VS KRISHICONNECT DIRECT PRICE COMPARISON TAB */}
      {activeTab === 'market-comparison' && (
        <div className="space-y-6">
          <PriceComparisonSection farmerProducts={farmerProducts} />
        </div>
      )}

      {/* 4. AI SMART PRICING ADVISOR */}
      {activeTab === 'ai-pricing' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-[#174D35]/15 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#174D35]/10 text-[#174D35] text-xs font-bold">
                <Sparkles className="w-4 h-4 text-[#3C8D5A]" />
                Powered by Google Gemini 3.8 Flash
              </div>
              <h3 className="text-xl font-extrabold text-[#17251C] mt-1">
                AI Smart Mandi Pricing Advisor
              </h3>
              <p className="text-xs text-[#7C887E] mt-1 max-w-xl">
                Get real-time fair price benchmarks before listing. Analyzes arrivals, seasonal festival demand, and retail spreads in central MP.
              </p>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-[#17251C] mb-1">Crop Name</label>
                <input
                  type="text"
                  value={pricingForm.cropName}
                  onChange={(e) => setPricingForm({ ...pricingForm, cropName: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F7F8F2] border border-[#174D35]/20 rounded-xl text-[#17251C]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#17251C] mb-1">Mandi / District Region</label>
                <input
                  type="text"
                  value={pricingForm.location}
                  onChange={(e) => setPricingForm({ ...pricingForm, location: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F7F8F2] border border-[#174D35]/20 rounded-xl text-[#17251C]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#17251C] mb-1">Current Ask (₹/unit)</label>
                <input
                  type="number"
                  value={pricingForm.currentPrice}
                  onChange={(e) => setPricingForm({ ...pricingForm, currentPrice: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-[#F7F8F2] border border-[#174D35]/20 rounded-xl text-[#17251C]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#17251C] mb-1">Quantity Available</label>
                <input
                  type="number"
                  value={pricingForm.quantity}
                  onChange={(e) => setPricingForm({ ...pricingForm, quantity: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-[#F7F8F2] border border-[#174D35]/20 rounded-xl text-[#17251C]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#17251C] mb-1">Unit</label>
                <select
                  value={pricingForm.unit}
                  onChange={(e) => setPricingForm({ ...pricingForm, unit: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F7F8F2] border border-[#174D35]/20 rounded-xl text-[#17251C]"
                >
                  <option value="kg">Kilogram (kg)</option>
                  <option value="quintal">Quintal (100 kg)</option>
                  <option value="crate">Crate (25 kg)</option>
                </select>
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-[#174D35]">
                  <input
                    type="checkbox"
                    checked={pricingForm.isOrganic}
                    onChange={(e) => setPricingForm({ ...pricingForm, isOrganic: e.target.checked })}
                    className="w-4 h-4 text-[#174D35] rounded"
                  />
                  <span>Certified Organic / Natural</span>
                </label>
              </div>
            </div>

            <button
              onClick={handleCalculateAiPricing}
              disabled={isPricingLoading}
              className="px-6 py-3 rounded-xl bg-[#174D35] text-white font-bold text-xs hover:bg-[#123b28] disabled:opacity-50 transition-colors flex items-center gap-2 shadow"
            >
              <Sparkles className="w-4 h-4 text-[#B7D96B]" />
              <span>{isPricingLoading ? 'Analyzing Central MP Mandis...' : 'Run Gemini AI Price Recommendation'}</span>
            </button>

            {/* AI Result Card */}
            {pricingResult && (
              <div className="p-6 rounded-2xl bg-[#174D35]/5 border border-[#174D35]/20 space-y-4 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#174D35]/15">
                  <div>
                    <span className="text-xs font-bold text-[#3C8D5A] uppercase tracking-wider">
                      Recommended Direct Range
                    </span>
                    <div className="text-3xl font-black text-[#174D35] mt-0.5 tabular-nums">
                      ₹{pricingResult.recommendedMinPrice} - ₹{pricingResult.recommendedMaxPrice}
                      <span className="text-sm font-normal text-[#7C887E]"> / {pricingForm.unit}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-[#7C887E]">Traditional Mandi Auction</span>
                    <div className="text-base font-bold text-slate-700 tabular-nums">
                      ₹{pricingResult.traditionalMandiPrice} / {pricingForm.unit}
                    </div>
                    <div className="text-xs font-bold text-[#3C8D5A]">
                      +{pricingResult.farmerDirectGainPercent}% Higher Realization
                    </div>
                  </div>
                </div>

                <div className="text-xs text-[#17251C] leading-relaxed">
                  <strong className="text-[#174D35]">Economic Rationale: </strong>
                  {pricingResult.rationale}
                </div>

                {pricingResult.actionableAdvice && (
                  <div>
                    <strong className="text-xs text-[#174D35] block mb-1.5">Actionable Farm Guidance:</strong>
                    <ul className="space-y-1 text-xs text-[#7C887E]">
                      {pricingResult.actionableAdvice.map((a: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#3C8D5A] shrink-0 mt-0.5" />
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. AI DEMAND FORECAST TAB */}
      {activeTab === 'forecast' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-[#174D35]/15 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-[#3C8D5A] uppercase tracking-wider">
                  Upcoming 30-Day Projections
                </span>
                <h3 className="text-xl font-bold text-[#17251C] mt-0.5">
                  Madhya Pradesh Agricultural Demand Forecasting
                </h3>
              </div>
              <button
                onClick={handleFetchForecast}
                disabled={isForecastLoading}
                className="px-4 py-2 rounded-xl bg-[#F7F8F2] border border-[#174D35]/20 text-xs font-bold text-[#174D35] hover:bg-white transition-colors"
              >
                {isForecastLoading ? 'Updating Forecast...' : 'Refresh Forecast'}
              </button>
            </div>

            {forecastResult ? (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-[#174D35]/5 border border-[#174D35]/15 text-xs flex items-center justify-between">
                  <span className="font-bold text-[#174D35]">Projected Urban Household & Horeca Demand Growth:</span>
                  <span className="text-lg font-black text-[#174D35] tabular-nums">+{forecastResult.projectedDemandGrowth}%</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {forecastResult.topHighDemandCrops?.map((c: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-xl border border-[#174D35]/15 bg-white space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-[#17251C]">{c.name}</h4>
                        <span className="text-[11px] font-bold text-[#3C8D5A]">+{c.growthPercent}%</span>
                      </div>
                      <div className="text-[11px] text-[#7C887E]">Peak Window: <strong>{c.peakWindow}</strong></div>
                      <p className="text-xs text-[#17251C]/80 leading-relaxed">{c.reason}</p>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-amber-950">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    Regional Microclimate Alert (Narmada Belt)
                  </div>
                  <p>{forecastResult.weatherRiskAlert}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-[#7C887E]">Loading forecast data...</div>
            )}
          </div>
        </div>
      )}

      {/* Add Produce Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#174D35]/20 my-8">
            <h3 className="text-xl font-bold text-[#17251C] mb-4">List New Farm Produce</h3>
            
            <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#17251C] mb-1">Produce Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fresh Desi Tomatoes, Sharbati Wheat..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F7F8F2] border border-[#174D35]/20 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#17251C] mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#F7F8F2] border border-[#174D35]/20 rounded-xl"
                  >
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Grains">Grains</option>
                    <option value="Pulses">Pulses</option>
                    <option value="Spices">Spices</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Organic Produce">Organic Produce</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#17251C] mb-1">Unit</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#F7F8F2] border border-[#174D35]/20 rounded-xl"
                  >
                    <option value="kg">kg</option>
                    <option value="quintal">quintal</option>
                    <option value="piece">piece</option>
                    <option value="litre">litre</option>
                    <option value="crate (25kg)">crate (25kg)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#17251C] mb-1">Direct Price (₹)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.pricePerUnit}
                    onChange={(e) => setFormData({ ...formData, pricePerUnit: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-[#F7F8F2] border border-[#174D35]/20 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#17251C] mb-1">Available Quantity</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.availableQuantity}
                    onChange={(e) => setFormData({ ...formData, availableQuantity: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-[#F7F8F2] border border-[#174D35]/20 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#17251C] mb-1">Description & Harvest Notes</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mention soil health, variety name, irrigation method, etc."
                  className="w-full px-3 py-2 bg-[#F7F8F2] border border-[#174D35]/20 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#17251C] mb-1">Harvest Date</label>
                  <input
                    type="date"
                    value={formData.harvestDate}
                    onChange={(e) => setFormData({ ...formData, harvestDate: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F7F8F2] border border-[#174D35]/20 rounded-xl"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-[#174D35]">
                    <input
                      type="checkbox"
                      checked={formData.isOrganic}
                      onChange={(e) => setFormData({ ...formData, isOrganic: e.target.checked })}
                      className="w-4 h-4 text-[#174D35] rounded"
                    />
                    <span>Organic Certified</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#174D35] text-white font-bold hover:bg-[#123b28]"
                >
                  Save & Publish Produce
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
