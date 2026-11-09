import React from 'react';
import { X, Check, Shield, User, Store, Truck, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { Role } from '../../types/index.js';

interface DemoSwitchModalProps {
  setCurrentView: (view: string) => void;
}

export const DemoSwitchModal: React.FC<DemoSwitchModalProps> = ({ setCurrentView }) => {
  const { user, allDemoUsers, loginAsRole, isDemoSwitchOpen, setIsDemoSwitchOpen } = useAuth();

  if (!isDemoSwitchOpen) return null;

  const roleMeta: Record<Role, { title: string; subtitle: string; icon: React.ReactNode; view: string }> = {
    farmer: {
      title: 'Farmer Portal',
      subtitle: 'Rameshwar Patidar (18 acres organic farm in Sehore) – List crops, accept orders, manage earnings & AI advice',
      icon: <Sparkles className="w-5 h-5 text-[#3C8D5A]" />,
      view: 'farmer-dashboard',
    },
    consumer: {
      title: 'Consumer Marketplace',
      subtitle: 'Pooja Sharma (Bhopal) – Shop fresh harvest directly, view price audit, track farm-to-door delivery',
      icon: <User className="w-5 h-5 text-blue-600" />,
      view: 'marketplace',
    },
    retailer: {
      title: 'Retailer / Bulk Buyer',
      subtitle: 'Rajesh Agrawal (GreenLeaf Supermart) – Procure quintals directly, request bulk quotes, tax invoices',
      icon: <Store className="w-5 h-5 text-amber-600" />,
      view: 'retailer-dashboard',
    },
    delivery: {
      title: 'Delivery Partner',
      subtitle: 'Vikram Singh Rajput (AgriFleet Express) – Route tasks, farm pickup staging, delivery with OTP',
      icon: <Truck className="w-5 h-5 text-indigo-600" />,
      view: 'delivery-dashboard',
    },
    admin: {
      title: 'Platform Operations Admin',
      subtitle: 'Ananya Deshmukh – Real-time GMV, KYC farmer verification, product moderation, dispute resolution',
      icon: <Shield className="w-5 h-5 text-emerald-700" />,
      view: 'admin-dashboard',
    },
  };

  const handleSelectRole = (r: Role) => {
    loginAsRole(r);
    setIsDemoSwitchOpen(false);
    setCurrentView(roleMeta[r].view);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#F7F8F2] w-full max-w-2xl rounded-2xl border border-[#174D35]/20 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 bg-[#174D35] text-white flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Select Active Demo Persona</h3>
            <p className="text-xs text-[#B7D96B] mt-0.5">
              Instant evaluation of all 5 KrishiConnect multi-role workflows
            </p>
          </div>
          <button
            onClick={() => setIsDemoSwitchOpen(false)}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Persona List */}
        <div className="p-6 overflow-y-auto space-y-3">
          {allDemoUsers.map((u) => {
            const meta = roleMeta[u.role];
            const isCurrent = user?.id === u.id;

            return (
              <div
                key={u.id}
                onClick={() => handleSelectRole(u.role)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-4 ${
                  isCurrent
                    ? 'bg-white border-[#174D35] shadow-md ring-2 ring-[#174D35]/20'
                    : 'bg-white/70 hover:bg-white border-[#174D35]/15 hover:border-[#174D35]/40'
                }`}
              >
                <img
                  src={u.avatar}
                  alt={u.name}
                  className="w-13 h-13 rounded-full object-cover border-2 border-[#174D35]/20 shrink-0"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/src/assets/images/avatar_consumer_pooja_1793947866234.jpg';
                  }}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#17251C]">{u.name}</span>
                    <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded bg-[#174D35]/10 text-[#174D35]">
                      {u.role}
                    </span>
                    {isCurrent && (
                      <span className="text-xs font-semibold text-[#3C8D5A] flex items-center gap-1 ml-auto">
                        <Check className="w-4 h-4" /> Current Active
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-[#17251C]/80 mt-1">{meta.subtitle}</div>
                  <div className="text-[11px] text-[#7C887E] mt-1 flex items-center gap-2">
                    <span>Location: {u.location}</span>
                    <span>·</span>
                    <span>Phone: {u.phone}</span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectRole(u.role);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                    isCurrent
                      ? 'bg-[#174D35] text-white'
                      : 'bg-[#174D35]/10 text-[#174D35] hover:bg-[#174D35] hover:text-white'
                  }`}
                >
                  {isCurrent ? 'Open View' : 'Switch Role'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3.5 bg-white border-t border-[#174D35]/10 text-[11px] text-[#7C887E] flex items-center justify-between">
          <span>Switching roles reloads active permissions, pending orders, and specific analytics.</span>
          <button
            onClick={() => setIsDemoSwitchOpen(false)}
            className="font-medium text-[#174D35] hover:underline"
          >
            Dismiss
          </button>
        </div>

      </div>
    </div>
  );
};
