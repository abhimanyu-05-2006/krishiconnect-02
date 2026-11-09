import React, { useState } from 'react';
import {
  Truck,
  MapPin,
  Navigation,
  CheckCircle2,
  Phone,
  Clock,
  ShieldCheck,
  AlertCircle,
  Thermometer,
  ArrowRight
} from 'lucide-react';
import { Order } from '../../types/index.js';
import { useAuth } from '../../context/AuthContext.js';

interface DeliveryDashboardProps {
  orders: Order[];
  onRefreshOrders: () => void;
}

export const DeliveryDashboard: React.FC<DeliveryDashboardProps> = ({ orders, onRefreshOrders }) => {
  const { user } = useAuth();
  const [selectedTask, setSelectedTask] = useState<Order>(orders[0]);
  const [otpInput, setOtpInput] = useState('');
  const [otpModalOpen, setOtpModalOpen] = useState(false);

  // Delivery partner orders
  const assignedOrders = orders.filter((o) => o.status !== 'Cancelled');
  const activeTasks = assignedOrders.filter((o) => o.status !== 'Delivered');
  const completedTasks = assignedOrders.filter((o) => o.status === 'Delivered');

  // Total delivery earnings (₹120 per rural pickup/delivery trip)
  const earnings = completedTasks.length * 150 + 250;

  const handleUpdateStatus = async (orderId: string, nextStatus: Order['status'], desc: string) => {
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus, description: desc }),
      });
      onRefreshOrders();
      setOtpModalOpen(false);
      setOtpInput('');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-[#174D35]/15 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#174D35] text-[#B7D96B] flex items-center justify-center font-bold shadow-sm">
            <Truck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-[#17251C]">
                AgriFleet Partner: {user?.name || 'Vikram Singh Rajput'}
              </h1>
              <span className="text-[10px] bg-[#3C8D5A] text-white font-bold px-2 py-0.5 rounded">
                Active On Route
              </span>
            </div>
            <p className="text-xs text-[#7C887E] mt-0.5">
              Vehicle: Tata Ace EV Insulated (MP 04 GA 9912) · Route: Sehore Hub ➔ Arera Colony, Bhopal
            </p>
            <div className="text-xs text-[#3C8D5A] font-semibold mt-1 flex items-center gap-2">
              <Thermometer className="w-3.5 h-3.5" /> Cargo Bay Temp: 14°C (Optimal Freshness Active)
            </div>
          </div>
        </div>

        {/* Quick Earnings Stat */}
        <div className="p-4 bg-[#174D35]/5 rounded-2xl border border-[#174D35]/15 text-right w-full md:w-auto">
          <span className="text-xs text-[#7C887E]">Today's Fleet Earnings</span>
          <div className="text-2xl font-black text-[#174D35] tabular-nums">₹{earnings}</div>
          <div className="text-[11px] text-[#3C8D5A] font-semibold">4 Trips Completed Today</div>
        </div>
      </div>

      {/* Main Grid: Active Task on Route & Simulated Interactive Route Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Task List */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="font-bold text-base text-[#17251C]">
            Assigned Agri Dispatch Tasks ({activeTasks.length} Pending)
          </h3>

          <div className="space-y-3">
            {assignedOrders.map((o) => {
              const isSelected = selectedTask?.id === o.id;

              return (
                <div
                  key={o.id}
                  onClick={() => setSelectedTask(o)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white border-[#174D35] shadow-md ring-2 ring-[#174D35]/20'
                      : 'bg-white/80 hover:bg-white border-[#174D35]/15'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-bold text-xs text-[#174D35]">{o.orderNumber}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        o.status === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : o.status === 'Out for Delivery'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-[#174D35]/10 text-[#174D35]'
                      }`}
                    >
                      {o.status}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-[#17251C] mb-1">
                    To: {o.buyerName} ({o.deliveryAddress.city})
                  </div>

                  <div className="text-[11px] text-[#7C887E] flex items-center justify-between">
                    <span>{o.items.length} crate bundles</span>
                    <span className="text-[#174D35] font-bold">Fare: ₹150</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Task Dispatch Control & Simulated Route Map */}
        <div className="lg:col-span-7 space-y-6">
          {selectedTask && (
            <div className="bg-white rounded-3xl border border-[#174D35]/20 p-6 sm:p-8 shadow-xs space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#174D35]/10">
                <div>
                  <span className="text-xs font-bold text-[#3C8D5A] uppercase tracking-wider">
                    Active Dispatch Route
                  </span>
                  <h3 className="text-xl font-bold text-[#17251C] mt-0.5">
                    Order {selectedTask.orderNumber}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#7C887E]">Recipient Contact</span>
                  <div className="text-xs font-bold text-[#174D35] flex items-center gap-1 justify-end">
                    <Phone className="w-3.5 h-3.5" /> {selectedTask.buyerPhone}
                  </div>
                </div>
              </div>

              {/* Simulated Map Visual with Waypoints */}
              <div className="relative rounded-2xl overflow-hidden border border-[#174D35]/15 bg-[#E8EFE9] h-52 flex flex-col justify-between p-4">
                
                {/* Simulated Road Topology SVG Graphic */}
                <svg className="absolute inset-0 w-full h-full stroke-[#174D35]/30 fill-none" viewBox="0 0 600 200">
                  <path d="M 50 150 Q 200 40 350 120 T 550 60" strokeWidth="6" strokeLinecap="round" />
                  <path d="M 50 150 Q 200 40 350 120 T 550 60" strokeWidth="2" strokeDasharray="6 6" stroke="white" />
                </svg>

                {/* Pickup marker */}
                <div className="relative z-10 flex items-center gap-2 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-[#174D35]/20 shadow-sm max-w-xs">
                  <div className="w-6 h-6 rounded-full bg-[#174D35] text-[#B7D96B] font-bold text-xs flex items-center justify-center">
                    A
                  </div>
                  <div className="text-[11px] leading-tight">
                    <strong className="text-[#174D35] block">Farm Pickup:</strong>
                    <span>Narmada Farms, Ashta (Sehore)</span>
                  </div>
                </div>

                {/* EV Van icon moving */}
                <div className="relative z-10 self-center bg-[#174D35] text-white px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-[#B7D96B] animate-spin" />
                  <span>En Route · ETA 34 mins</span>
                </div>

                {/* Delivery destination marker */}
                <div className="relative z-10 self-end flex items-center gap-2 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-[#174D35]/20 shadow-sm max-w-xs">
                  <div className="w-6 h-6 rounded-full bg-[#3C8D5A] text-white font-bold text-xs flex items-center justify-center">
                    B
                  </div>
                  <div className="text-[11px] leading-tight">
                    <strong className="text-[#174D35] block">Drop-off:</strong>
                    <span>{selectedTask.deliveryAddress.street}, {selectedTask.deliveryAddress.city}</span>
                  </div>
                </div>

              </div>

              {/* Waypoint Details */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-[#F7F8F2] rounded-xl border border-[#174D35]/10 space-y-1">
                  <span className="font-bold text-[#174D35] block">Pick-up Verification:</span>
                  <p className="text-[#7C887E]">3 plastic returnable crates graded & sealed</p>
                  <span className="text-[11px] text-[#3C8D5A] font-semibold">Farmer Signed Off</span>
                </div>

                <div className="p-3 bg-[#F7F8F2] rounded-xl border border-[#174D35]/10 space-y-1">
                  <span className="font-bold text-[#174D35] block">Payment Collection:</span>
                  <p className="text-[#7C887E]">
                    Method: <strong>{selectedTask.paymentMethod}</strong> (
                    {selectedTask.paymentStatus === 'Paid' ? (
                      <span className="text-[#3C8D5A]">Pre-paid via Razorpay</span>
                    ) : (
                      <span className="text-amber-700">Collect ₹{selectedTask.pricingBreakdown.totalAmount} Cash</span>
                    )}
                    )
                  </p>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-end gap-3 border-t border-[#174D35]/10">
                {selectedTask.status === 'Ready for Pickup' && (
                  <button
                    onClick={() =>
                      handleUpdateStatus(
                        selectedTask.id,
                        'Picked Up',
                        'Picked up from Sehore farm collection hub by Vikram'
                      )
                    }
                    className="px-5 py-2.5 rounded-xl bg-[#174D35] text-white text-xs font-bold hover:bg-[#123b28]"
                  >
                    Confirm Farm-Gate Pickup
                  </button>
                )}

                {selectedTask.status === 'Picked Up' && (
                  <button
                    onClick={() =>
                      handleUpdateStatus(
                        selectedTask.id,
                        'Out for Delivery',
                        'Dispatched on highway route to Bhopal city destination'
                      )
                    }
                    className="px-5 py-2.5 rounded-xl bg-[#3C8D5A] text-white text-xs font-bold hover:bg-[#2e6d45]"
                  >
                    Mark Out For Final Delivery
                  </button>
                )}

                {selectedTask.status === 'Out for Delivery' && (
                  <button
                    onClick={() => setOtpModalOpen(true)}
                    className="px-5 py-2.5 rounded-xl bg-[#174D35] text-white text-xs font-bold hover:bg-[#123b28] flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#B7D96B]" />
                    <span>Complete Delivery with Customer OTP</span>
                  </button>
                )}

                {selectedTask.status === 'Delivered' && (
                  <div className="text-xs font-bold text-[#3C8D5A] flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Delivered & Settled into Partner Wallet (+₹150)
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

      </div>

      {/* OTP Delivery Completion Modal */}
      {otpModalOpen && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-[#174D35]/20 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-[#174D35] text-[#B7D96B] flex items-center justify-center mx-auto">
              <ShieldCheck className="w-7 h-7" />
            </div>

            <div>
              <h3 className="font-bold text-base text-[#17251C]">Customer Delivery OTP</h3>
              <p className="text-xs text-[#7C887E] mt-1">
                Ask customer {selectedTask.buyerName} for the 4-digit verification code. (Demo code: <strong className="text-[#174D35]">4289</strong>)
              </p>
            </div>

            <input
              type="text"
              maxLength={4}
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
              placeholder="Enter 4-digit OTP"
              className="w-full text-center tracking-widest text-lg font-bold py-2 bg-[#F7F8F2] border border-[#174D35]/20 rounded-xl"
            />

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setOtpModalOpen(false)}
                className="flex-1 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  handleUpdateStatus(
                    selectedTask.id,
                    'Delivered',
                    'Delivered fresh to customer door with OTP verification'
                  )
                }
                className="flex-1 py-2 text-xs font-bold bg-[#174D35] text-white rounded-xl hover:bg-[#123b28]"
              >
                Confirm Delivery
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
