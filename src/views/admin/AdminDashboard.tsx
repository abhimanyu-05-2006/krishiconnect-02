import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  Wheat,
  ShoppingBag,
  TrendingUp,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  DollarSign,
  Scale,
  RefreshCw
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { User, FarmerProfile, Product, Order, Dispute } from '../../types/index.js';
import { useAuth } from '../../context/AuthContext.js';

interface AdminDashboardProps {
  users: User[];
  farmers: FarmerProfile[];
  products: Product[];
  orders: Order[];
  onRefreshData: () => void;
  openAiChat: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  users,
  farmers,
  products,
  orders,
  onRefreshData,
  openAiChat,
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'analytics' | 'farmers' | 'moderation' | 'disputes' | 'ai-insights'>('analytics');
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Calculate platform aggregate numbers
  const totalGmv = orders.reduce((acc, curr) => acc + curr.pricingBreakdown.totalAmount, 0);
  const platformRevenue = orders.reduce((acc, curr) => acc + curr.pricingBreakdown.platformFee, 0);
  const farmerPayouts = orders.reduce((acc, curr) => acc + curr.pricingBreakdown.farmerEarningsTotal, 0);

  // Recharts data
  const monthlyGmvData = [
    { month: 'Jul', gmv: 340000, orders: 120 },
    { month: 'Aug', gmv: 420000, orders: 155 },
    { month: 'Sep', gmv: 580000, orders: 210 },
    { month: 'Oct', gmv: 710000, orders: 280 },
    { month: 'Nov', gmv: 890000, orders: 360 },
  ];

  const regionalData = [
    { name: 'Sehore', value: 42, color: '#174D35' },
    { name: 'Bhopal', value: 28, color: '#3C8D5A' },
    { name: 'Vidisha', value: 16, color: '#B7D96B' },
    { name: 'Raisen', value: 14, color: '#E6A23C' },
  ];

  const fetchDisputes = async () => {
    try {
      const res = await fetch('/api/disputes');
      const data = await res.json();
      setDisputes(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAiInsights = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai/insights');
      const data = await res.json();
      setAiInsights(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  useEffect(() => {
    fetchDisputes();
    fetchAiInsights();
  }, []);

  const handleVerifyFarmer = async (farmerId: string, isVerified: boolean) => {
    try {
      await fetch(`/api/farmers/${farmerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVerified }),
      });
      onRefreshData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleResolveDispute = async (id: string) => {
    try {
      await fetch(`/api/disputes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Resolved', resolutionNotes: 'Full refund credited; transit insurance settled.' }),
      });
      fetchDisputes();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-[#174D35]/15 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#174D35] uppercase tracking-wider flex items-center gap-1">
              <Shield className="w-4 h-4 text-[#3C8D5A]" />
              KrishiConnect Master Console
            </span>
            <span className="text-[10px] bg-[#174D35] text-[#B7D96B] font-extrabold px-2 py-0.5 rounded">
              Super Admin
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17251C] mt-1">
            Platform Operations & Transparency Audit
          </h1>
          <p className="text-xs text-[#7C887E] mt-0.5">
            Real-time oversight over 1,240+ registered MP farmers, B2C transactions, and cold-chain dispatches
          </p>
        </div>

        <button
          onClick={openAiChat}
          className="px-4 py-2.5 rounded-xl bg-[#3C8D5A]/15 text-[#174D35] hover:bg-[#3C8D5A]/25 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <Sparkles className="w-4 h-4 text-[#3C8D5A]" />
          <span>Launch AI Agri Insights</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#174D35]/15 text-xs font-bold overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-3 mr-6 whitespace-nowrap transition-colors ${
            activeTab === 'analytics'
              ? 'text-[#174D35] border-b-2 border-[#174D35]'
              : 'text-[#7C887E] hover:text-[#174D35]'
          }`}
        >
          Macro GMV & Revenue
        </button>
        <button
          onClick={() => setActiveTab('farmers')}
          className={`pb-3 mr-6 whitespace-nowrap transition-colors ${
            activeTab === 'farmers'
              ? 'text-[#174D35] border-b-2 border-[#174D35]'
              : 'text-[#7C887E] hover:text-[#174D35]'
          }`}
        >
          Farmer KYC Verification ({farmers.filter((f) => !f.isVerified).length} Pending)
        </button>
        <button
          onClick={() => setActiveTab('moderation')}
          className={`pb-3 mr-6 whitespace-nowrap transition-colors ${
            activeTab === 'moderation'
              ? 'text-[#174D35] border-b-2 border-[#174D35]'
              : 'text-[#7C887E] hover:text-[#174D35]'
          }`}
        >
          Produce Moderation ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('disputes')}
          className={`pb-3 mr-6 whitespace-nowrap transition-colors ${
            activeTab === 'disputes'
              ? 'text-[#174D35] border-b-2 border-[#174D35]'
              : 'text-[#7C887E] hover:text-[#174D35]'
          }`}
        >
          Transit Disputes ({disputes.filter((d) => d.status === 'Open').length})
        </button>
        <button
          onClick={() => setActiveTab('ai-insights')}
          className={`pb-3 mr-6 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'ai-insights'
              ? 'text-[#174D35] border-b-2 border-[#174D35]'
              : 'text-[#7C887E] hover:text-[#174D35]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#3C8D5A]" />
          <span>AI Supply Gap Insights</span>
        </button>
      </div>

      {/* 1. MACRO GMV & ANALYTICS TAB */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          
          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-6 rounded-2xl bg-white border border-[#174D35]/15 shadow-xs">
              <span className="text-xs font-semibold text-[#7C887E] uppercase">Gross Merchandise Value</span>
              <div className="text-3xl font-black text-[#174D35] mt-1 tabular-nums">
                ₹{totalGmv.toLocaleString()}
              </div>
              <div className="text-xs text-[#3C8D5A] font-semibold mt-1">+18.4% monthly trade pace</div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#174D35]/15 shadow-xs">
              <span className="text-xs font-semibold text-[#7C887E] uppercase">Direct Farmer Payouts</span>
              <div className="text-3xl font-black text-[#3C8D5A] mt-1 tabular-nums">
                ₹{farmerPayouts.toLocaleString()}
              </div>
              <div className="text-xs text-[#17251C]/70 mt-1">91.2% effective payout ratio</div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#174D35]/15 shadow-xs">
              <span className="text-xs font-semibold text-[#7C887E] uppercase">Registered Farmers</span>
              <div className="text-3xl font-black text-[#174D35] mt-1 tabular-nums">
                {farmers.length} Growers
              </div>
              <div className="text-xs text-[#3C8D5A] mt-1">100% Geo-tagged fields</div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#174D35]/15 shadow-xs">
              <span className="text-xs font-semibold text-[#7C887E] uppercase">Active Produce Listings</span>
              <div className="text-3xl font-black text-[#174D35] mt-1 tabular-nums">
                {products.length} Items
              </div>
              <div className="text-xs text-[#7C887E] mt-1">Ready for dawn dispatch</div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Monthly GMV Growth */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-[#174D35]/15 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-[#17251C]">Monthly Agricultural GMV (₹)</h3>
                  <p className="text-xs text-[#7C887E]">Consolidated central MP agricultural trade volume</p>
                </div>
                <span className="text-xs font-bold text-[#3C8D5A]">Target: ₹1.2 Cr by Q1 2027</span>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyGmvData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#7C887E' }} axisLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#7C887E' }} axisLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                    <Tooltip
                      formatter={(val: any) => [`₹${val.toLocaleString()}`, 'GMV']}
                      contentStyle={{ borderRadius: '12px', border: '1px solid #174D35', fontSize: '12px' }}
                    />
                    <Bar dataKey="gmv" fill="#174D35" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Regional Sourcing Share */}
            <div className="lg:col-span-4 bg-white rounded-3xl border border-[#174D35]/15 p-6 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-base text-[#17251C]">Regional Sourcing Share</h3>
                <p className="text-xs text-[#7C887E]">Harvest origin breakdown</p>

                <div className="h-44 w-full my-3 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={regionalData}
                        innerRadius={45}
                        outerRadius={70}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {regionalData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                {regionalData.map((r) => (
                  <div key={r.name} className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-slate-700">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                      {r.name} Belt
                    </span>
                    <span className="font-bold tabular-nums">{r.value}%</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 2. FARMER KYC VERIFICATION TAB */}
      {activeTab === 'farmers' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#17251C]">Farmer NPOP Verification Queue</h3>
              <p className="text-xs text-[#7C887E]">
                Review land records, NPOP organic certificates, and soil testing audit logs
              </p>
            </div>
            <button
              onClick={onRefreshData}
              className="px-3.5 py-1.5 rounded-xl border border-[#174D35]/20 text-xs font-bold text-[#174D35] hover:bg-white"
            >
              Refresh Queue
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-[#174D35]/15 overflow-hidden shadow-xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#F7F8F2] text-[#7C887E] font-bold border-b border-[#174D35]/10">
                <tr>
                  <th className="p-3">Farmer & Farm</th>
                  <th className="p-3">District Hub</th>
                  <th className="p-3">Acreage & System</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">KYC Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#174D35]/10">
                {farmers.map((f) => (
                  <tr key={f.id} className="hover:bg-neutral-50/50">
                    <td className="p-3">
                      <div className="font-bold text-[#17251C]">{f.farmerName}</div>
                      <div className="text-[#7C887E] text-[11px]">{f.farmName}</div>
                    </td>
                    <td className="p-3 text-[#174D35] font-semibold">{f.location}</td>
                    <td className="p-3">
                      {f.totalAcres} Acres · <strong className="text-[#3C8D5A]">{f.farmingType}</strong>
                    </td>
                    <td className="p-3">
                      {f.isVerified ? (
                        <span className="text-[11px] font-bold bg-[#B7D96B]/30 text-[#174D35] px-2 py-0.5 rounded flex items-center gap-1 w-max">
                          <CheckCircle2 className="w-3.5 h-3.5" /> NPOP Verified
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded w-max block">
                          Pending Audit
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right space-x-2">
                      {!f.isVerified ? (
                        <button
                          onClick={() => handleVerifyFarmer(f.id, true)}
                          className="px-3 py-1 bg-[#174D35] text-white font-bold rounded-lg hover:bg-[#123b28]"
                        >
                          Approve KYC
                        </button>
                      ) : (
                        <button
                          onClick={() => handleVerifyFarmer(f.id, false)}
                          className="px-3 py-1 border border-slate-300 text-slate-600 rounded-lg hover:bg-neutral-100"
                        >
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. PRODUCE MODERATION TAB */}
      {activeTab === 'moderation' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-[#17251C]">Live Produce Listings Moderation</h3>
            <p className="text-xs text-[#7C887E]">Verify fair pricing ceilings and stock accuracy</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#174D35]/15 overflow-hidden shadow-xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#F7F8F2] text-[#7C887E] font-bold border-b border-[#174D35]/10">
                <tr>
                  <th className="p-3">Crop Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Grower</th>
                  <th className="p-3">Price / Unit</th>
                  <th className="p-3">Available Stock</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#174D35]/10">
                {products.map((p) => (
                  <tr key={p.id}>
                    <td className="p-3 font-bold text-[#17251C]">{p.name}</td>
                    <td className="p-3 text-[#3C8D5A] font-medium">{p.category}</td>
                    <td className="p-3 text-[#7C887E]">{p.farmerName}</td>
                    <td className="p-3 font-black text-[#174D35] tabular-nums">₹{p.pricePerUnit}/{p.unit}</td>
                    <td className="p-3 tabular-nums">{p.availableQuantity} {p.unit}</td>
                    <td className="p-3">
                      <span className="text-[11px] font-bold text-[#174D35] bg-[#174D35]/10 px-2 py-0.5 rounded">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. DISPUTE MANAGEMENT TAB */}
      {activeTab === 'disputes' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-[#17251C]">Customer & Retailer Transit Disputes</h3>
            <p className="text-xs text-[#7C887E]">
              Protected by KrishiConnect Transit Insurance Pool (Farmers never penalized for road vibration)
            </p>
          </div>

          <div className="space-y-4">
            {disputes.map((d) => (
              <div
                key={d.id}
                className="p-5 bg-white rounded-2xl border border-[#174D35]/15 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#17251C]">{d.reason}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        d.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {d.status}
                    </span>
                  </div>
                  <span className="text-xs text-[#7C887E]">Raised by: {d.raisedByName} ({d.raisedByRole})</span>
                </div>

                <p className="text-xs text-[#17251C]/80 leading-relaxed bg-[#F7F8F2] p-3 rounded-xl border border-neutral-100">
                  {d.details}
                </p>

                {d.resolutionNotes && (
                  <div className="text-xs text-[#3C8D5A] font-semibold">
                    Resolution: {d.resolutionNotes}
                  </div>
                )}

                {d.status !== 'Resolved' && (
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => handleResolveDispute(d.id)}
                      className="px-4 py-1.5 rounded-xl bg-[#174D35] text-white text-xs font-bold hover:bg-[#123b28]"
                    >
                      Approve Wallet Refund & Settle
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. AI SUPPLY GAP INSIGHTS TAB */}
      {activeTab === 'ai-insights' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-[#174D35]/15 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#174D35]/10 text-[#174D35] text-xs font-bold">
                  <Sparkles className="w-4 h-4 text-[#3C8D5A]" />
                  Gemini Agricultural Market Intelligence
                </div>
                <h3 className="text-xl font-bold text-[#17251C] mt-1">
                  Central MP Supply-Demand Matrix
                </h3>
              </div>
              <button
                onClick={fetchAiInsights}
                disabled={isAiLoading}
                className="px-3.5 py-1.5 rounded-xl border border-[#174D35]/20 text-xs font-bold text-[#174D35] hover:bg-neutral-50"
              >
                {isAiLoading ? 'Analyzing...' : 'Refresh AI Gap Analysis'}
              </button>
            </div>

            {aiInsights && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#174D35]/5 border border-[#174D35]/15 text-xs flex justify-between font-bold text-[#174D35]">
                  <span>Farmer Surplus Value Retained: {aiInsights.farmerSurplusKept}</span>
                  <span>Weekly Trade Growth: {aiInsights.weeklyGmvGrowth}</span>
                </div>

                <div className="space-y-3">
                  <span className="text-xs font-bold text-[#17251C] block">Critical Supply Bottlenecks & Action Items:</span>
                  {aiInsights.gapAnalysis?.map((item: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-xl border border-[#174D35]/15 bg-white text-xs space-y-1">
                      <div className="flex justify-between items-center font-bold">
                        <span className="text-[#174D35] text-sm">{item.crop}</span>
                        <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded text-[11px] font-semibold">
                          {item.status}
                        </span>
                      </div>
                      <p className="text-[#7C887E] leading-relaxed">
                        <strong>Recommended Platform Action: </strong>{item.recommendedAction}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
