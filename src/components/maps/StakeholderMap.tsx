import React, { useState, useEffect } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from '@vis.gl/react-google-maps';
import {
  MapPin,
  Sparkles,
  Users,
  Store,
  Truck,
  ShieldCheck,
  ChevronRight,
  Filter,
  Navigation,
  ExternalLink,
  Layers,
  Info,
  Phone,
  Compass,
  ArrowLeft
} from 'lucide-react';
import { FarmerProfile, User, Product, Role } from '../../types/index.js';
import { useLanguage } from '../../context/LanguageContext.js';

interface StakeholderMapProps {
  farmers: FarmerProfile[];
  users: User[];
  products: Product[];
  onSelectFarmer?: (farmer: FarmerProfile) => void;
  onSelectProduct?: (product: Product) => void;
  onBack?: () => void;
}

export const StakeholderMap: React.FC<StakeholderMapProps> = ({
  farmers,
  users,
  products,
  onSelectFarmer,
  onSelectProduct,
  onBack,
}) => {
  const { t } = useLanguage();
  // Google Maps API key loaded from environment or server config
  const [apiKey, setApiKey] = useState<string>(
    (import.meta as any).env.VITE_GOOGLE_MAPS_API_KEY || ''
  );

  // Active filter for stakeholder roles
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<'all' | 'farmer' | 'consumer' | 'retailer' | 'delivery'>('all');
  
  // District filter
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');

  // Selected marker for InfoWindow details
  const [selectedEntity, setSelectedEntity] = useState<{
    type: 'farmer' | 'user';
    data: any;
    position: { lat: number; lng: number };
  } | null>(null);

  // Central default coordinates: Central Madhya Pradesh (Bhopal-Sehore corridor)
  const defaultCenter = { lat: 23.2599, lng: 77.4126 };

  // Fetch API key from server if not already in client env
  useEffect(() => {
    if (!apiKey) {
      fetch('/api/config/maps')
        .then((r) => r.json())
        .then((d) => {
          if (d.apiKey) setApiKey(d.apiKey);
        })
        .catch(() => {});
    }
  }, [apiKey]);

  // Stakeholder metadata styling
  const roleStyles: Record<string, { bg: string; text: string; pinBg: string; border: string; label: string; icon: any }> = {
    farmer: {
      bg: 'bg-[#174D35]',
      text: 'text-[#B7D96B]',
      pinBg: '#174D35',
      border: 'border-[#B7D96B]',
      label: 'Organic Farmers & Mandi Growers',
      icon: Sparkles,
    },
    consumer: {
      bg: 'bg-emerald-700',
      text: 'text-white',
      pinBg: '#059669',
      border: 'border-white',
      label: 'Consumers & Resident Hubs',
      icon: Users,
    },
    retailer: {
      bg: 'bg-amber-600',
      text: 'text-white',
      pinBg: '#d97706',
      border: 'border-white',
      label: 'Retailers & Supermarkets (Bulk)',
      icon: Store,
    },
    delivery: {
      bg: 'bg-blue-600',
      text: 'text-white',
      pinBg: '#2563eb',
      border: 'border-white',
      label: 'AgriFleet Delivery Transit Hubs',
      icon: Truck,
    },
  };

  // Filtered farmers
  const filteredFarmers = farmers.filter((f) => {
    if (selectedRoleFilter !== 'all' && selectedRoleFilter !== 'farmer') return false;
    if (selectedDistrict !== 'all' && f.district.toLowerCase() !== selectedDistrict.toLowerCase()) return false;
    return Boolean(f.coordinates && f.coordinates.lat && f.coordinates.lng);
  });

  // Filtered users (consumers, retailers, delivery partners)
  const filteredUsers = users.filter((u) => {
    if (u.role === 'admin') return false;
    if (selectedRoleFilter !== 'all' && u.role !== selectedRoleFilter) return false;
    return Boolean(u.coordinates && u.coordinates.lat && u.coordinates.lng);
  });

  // Calculate quick summary metrics
  const totalFarmingAcres = filteredFarmers.reduce((acc, f) => acc + (f.totalAcres || 0), 0);

  return (
    <div className="w-full bg-white rounded-3xl border border-[#174D35]/15 shadow-xl overflow-hidden flex flex-col">
      
      {/* Top Header & Interactive Filter Bar */}
      <div className="p-4 sm:p-6 bg-[#174D35] text-white flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10">
        <div>
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 shadow-2xs group cursor-pointer mb-2.5"
              title={t('btn_back')}
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              <span>{t('btn_back')}</span>
            </button>
          )}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#B7D96B] bg-white/10 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Navigation className="w-3 h-3 text-[#B7D96B]" /> {t('map_tag')}
            </span>
            <span className="text-white/40 text-xs">·</span>
            <span className="text-xs text-white/80 font-medium">Madhya Pradesh Hubs</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <span>{t('map_title')}</span>
          </h2>
          <p className="text-xs text-white/80 mt-1 max-w-xl leading-relaxed">
            {t('map_desc')}
          </p>
        </div>

        {/* Quick Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Role Segmented Filter */}
          <div className="flex items-center p-1 bg-white/10 rounded-xl border border-white/15">
            <button
              onClick={() => setSelectedRoleFilter('all')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                selectedRoleFilter === 'all'
                  ? 'bg-white text-[#17251C] shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {t('map_filter_all')}
            </button>
            <button
              onClick={() => setSelectedRoleFilter('farmer')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                selectedRoleFilter === 'farmer'
                  ? 'bg-[#B7D96B] text-[#17251C] shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <Sparkles className="w-3 h-3 text-emerald-800" />
              <span>{t('map_filter_farmers')} ({farmers.length})</span>
            </button>
            <button
              onClick={() => setSelectedRoleFilter('retailer')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                selectedRoleFilter === 'retailer'
                  ? 'bg-amber-400 text-[#17251C] shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {t('map_filter_retailers')}
            </button>
            <button
              onClick={() => setSelectedRoleFilter('delivery')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                selectedRoleFilter === 'delivery'
                  ? 'bg-blue-400 text-[#17251C] shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {t('map_filter_delivery')}
            </button>
            <button
              onClick={() => setSelectedRoleFilter('consumer')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                selectedRoleFilter === 'consumer'
                  ? 'bg-emerald-300 text-[#17251C] shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {t('map_filter_consumers')}
            </button>
          </div>

          {/* District Selector */}
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="py-1.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-semibold text-white focus:outline-none cursor-pointer"
          >
            <option value="all" className="text-[#17251C]">{t('map_district_all')}</option>
            <option value="sehore" className="text-[#17251C]">Sehore</option>
            <option value="vidisha" className="text-[#17251C]">Vidisha</option>
            <option value="bhopal" className="text-[#17251C]">Bhopal</option>
            <option value="raisen" className="text-[#17251C]">Raisen</option>
            <option value="hoshangabad" className="text-[#17251C]">Hoshangabad</option>
            <option value="dewas" className="text-[#17251C]">Dewas</option>
          </select>
        </div>
      </div>

      {/* Main Map Viewport & Sidebar Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px] h-[650px] relative">
        
        {/* Left Interactive Map Container (8 Cols) */}
        <div className="lg:col-span-8 h-full w-full relative bg-[#F7F8F2]">
          {apiKey ? (
            <APIProvider apiKey={apiKey} libraries={['marker']}>
              <Map
                mapId="DEMO_MAP_ID"
                defaultZoom={9}
                defaultCenter={defaultCenter}
                gestureHandling="greedy"
                disableDefaultUI={false}
                className="w-full h-full min-h-[420px]"
                internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              >
                {/* 1. Farmer Markers */}
                {filteredFarmers.map((f) => (
                  <AdvancedMarker
                    key={f.id}
                    position={f.coordinates}
                    title={`${f.farmerName} - ${f.farmName}`}
                    onClick={() =>
                      setSelectedEntity({
                        type: 'farmer',
                        data: f,
                        position: f.coordinates,
                      })
                    }
                  >
                    <div className="cursor-pointer group flex flex-col items-center">
                      <div className="px-2 py-0.5 rounded-full bg-[#174D35] text-[#B7D96B] text-[10px] font-bold shadow-md border border-[#B7D96B]/40 whitespace-nowrap mb-1">
                        🌾 {f.farmerName.split(' ')[0]} ({f.totalAcres} ac)
                      </div>
                      <div className="w-9 h-9 rounded-full bg-[#174D35] p-0.5 border-2 border-[#B7D96B] shadow-lg overflow-hidden group-hover:scale-110 transition-transform">
                        <img
                          src={f.avatar}
                          alt={f.farmerName}
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                    </div>
                  </AdvancedMarker>
                ))}

                {/* 2. Stakeholder User Markers (Consumer, Retailer, Delivery) */}
                {filteredUsers.map((u) => {
                  const style = roleStyles[u.role] || roleStyles.consumer;
                  const Icon = style.icon;

                  return (
                    <AdvancedMarker
                      key={u.id}
                      position={u.coordinates!}
                      title={`${u.name} (${u.role})`}
                      onClick={() =>
                        setSelectedEntity({
                          type: 'user',
                          data: u,
                          position: u.coordinates!,
                        })
                      }
                    >
                      <div className="cursor-pointer group flex flex-col items-center">
                        <div
                          className={`px-1.5 py-0.5 rounded-full ${style.bg} ${style.text} text-[9px] font-bold shadow border ${style.border} whitespace-nowrap mb-0.5 capitalize`}
                        >
                          {u.role === 'retailer' ? '🏪 Supermart' : u.role === 'delivery' ? '🚚 Fleet Hub' : '🏠 Buyer'}
                        </div>
                        <div
                          className={`w-7 h-7 rounded-full ${style.bg} p-1 border-2 ${style.border} shadow-md flex items-center justify-center text-white group-hover:scale-110 transition-transform`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </AdvancedMarker>
                  );
                })}

                {/* InfoWindow for Clicked Entity */}
                {selectedEntity && (
                  <InfoWindow
                    position={selectedEntity.position}
                    onCloseClick={() => setSelectedEntity(null)}
                    headerContent={
                      <div className="text-xs font-bold text-[#17251C]">
                        {selectedEntity.type === 'farmer'
                          ? selectedEntity.data.farmName
                          : selectedEntity.data.name}
                      </div>
                    }
                  >
                    <div className="p-1 max-w-[260px] text-xs space-y-2">
                      {selectedEntity.type === 'farmer' ? (
                        <>
                          <div className="flex items-center gap-2">
                            <img
                              src={selectedEntity.data.avatar}
                              alt={selectedEntity.data.farmerName}
                              className="w-10 h-10 rounded-full object-cover border border-[#174D35]/30 shrink-0"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/src/assets/images/farmer_portrait_mentor_1793946353253.jpg';
                              }}
                            />
                            <div>
                              <div className="font-bold text-[#17251C] text-xs">
                                {selectedEntity.data.farmerName}
                              </div>
                              <div className="text-[10px] text-[#3C8D5A] font-semibold">
                                {selectedEntity.data.farmingType} · {selectedEntity.data.totalAcres} Acres
                              </div>
                              <div className="text-[10px] text-[#7C887E]">
                                {selectedEntity.data.location}
                              </div>
                            </div>
                          </div>

                          <div className="text-[11px] text-[#17251C]/80 line-clamp-2">
                            {selectedEntity.data.bio}
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {selectedEntity.data.specialties?.map((s: string, idx: number) => (
                              <span
                                key={idx}
                                className="text-[9px] px-1.5 py-0.5 rounded bg-[#174D35]/10 text-[#174D35] font-semibold"
                              >
                                {s}
                              </span>
                            ))}
                          </div>

                          <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                            <span className="text-[10px] font-bold text-[#174D35]">
                              ★ {selectedEntity.data.rating} ({selectedEntity.data.totalRatingsCount})
                            </span>
                            {onSelectFarmer && (
                              <button
                                onClick={() => onSelectFarmer(selectedEntity.data)}
                                className="px-2.5 py-1 bg-[#174D35] hover:bg-[#123B28] text-white rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                              >
                                View Farm Produce
                              </button>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-2">
                            <img
                              src={selectedEntity.data.avatar}
                              alt={selectedEntity.data.name}
                              className="w-10 h-10 rounded-full object-cover border border-[#174D35]/30 shrink-0"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/src/assets/images/avatar_consumer_pooja_1793947866234.jpg';
                              }}
                            />
                            <div>
                              <div className="font-bold text-[#17251C] text-xs">
                                {selectedEntity.data.name}
                              </div>
                              <div className="text-[10px] text-[#174D35] font-bold uppercase">
                                {selectedEntity.data.role}
                              </div>
                              <div className="text-[10px] text-[#7C887E]">
                                {selectedEntity.data.location}
                              </div>
                            </div>
                          </div>

                          <div className="text-[11px] text-[#7C887E]">
                            Phone: <span className="font-mono text-[#17251C]">{selectedEntity.data.phone}</span>
                          </div>

                          <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> KrishiConnect Verified Stakeholder
                          </div>
                        </>
                      )}
                    </div>
                  </InfoWindow>
                )}
              </Map>
            </APIProvider>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#F7F8F2]">
              <Compass className="w-12 h-12 text-[#3C8D5A] mb-3 animate-pulse" />
              <h4 className="font-bold text-sm text-[#17251C]">Loading Agricultural Coordinates</h4>
              <p className="text-xs text-[#7C887E] max-w-sm mt-1">
                Connecting to Google Maps Platform services for live Sehore, Vidisha, Bhopal, and Raisen farm location mapping.
              </p>
            </div>
          )}

          {/* Map Overlay Quick Legend */}
          <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-[#174D35]/15 shadow-md hidden sm:flex items-center gap-3 text-[11px] text-[#17251C]">
            <div className="flex items-center gap-1.5 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-[#174D35]" />
              <span>Farmers ({filteredFarmers.length})</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Retailers</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>AgriFleet Hubs</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <span>Consumers</span>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Stakeholder Location & Produce Explorer (4 Cols) */}
        <div className="lg:col-span-4 h-full border-t lg:border-t-0 lg:border-l border-[#174D35]/10 bg-white flex flex-col justify-between overflow-hidden">
          
          {/* Summary Strip */}
          <div className="p-4 bg-[#F7F8F2] border-b border-[#174D35]/10">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-[#17251C]">Hyperlocal Agricultural Scope</span>
              <span className="text-[10px] font-bold text-[#174D35] bg-[#174D35]/10 px-2 py-0.5 rounded">
                {filteredFarmers.length} Farms Active
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="bg-white p-2 rounded-xl border border-[#174D35]/10">
                <div className="text-[10px] text-[#7C887E]">Total Mapped Land</div>
                <div className="font-extrabold text-[#174D35] text-sm tabular-nums mt-0.5">
                  {totalFarmingAcres} Acres
                </div>
              </div>
              <div className="bg-white p-2 rounded-xl border border-[#174D35]/10">
                <div className="text-[10px] text-[#7C887E]">Mandi Proximity</div>
                <div className="font-extrabold text-[#3C8D5A] text-sm tabular-nums mt-0.5">
                  &lt; 35 km Radius
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable Farmer List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="text-[11px] font-bold text-[#7C887E] uppercase tracking-wider mb-1">
              Active Regional Farms in MP
            </div>

            {filteredFarmers.map((f) => {
              const isSelected = selectedEntity?.data?.id === f.id;

              return (
                <div
                  key={f.id}
                  onClick={() => {
                    setSelectedEntity({
                      type: 'farmer',
                      data: f,
                      position: f.coordinates,
                    });
                  }}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#F7F8F2] border-[#174D35] ring-2 ring-[#174D35]/20 shadow-sm'
                      : 'bg-white border-[#174D35]/15 hover:border-[#174D35]/40 hover:bg-[#F7F8F2]/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={f.avatar}
                      alt={f.farmerName}
                      className="w-12 h-12 rounded-xl object-cover border border-[#174D35]/20 shrink-0"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/src/assets/images/farmer_portrait_mentor_1793946353253.jpg';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs text-[#17251C] truncate">{f.farmerName}</h4>
                        <span className="text-[10px] font-bold text-[#174D35] bg-[#B7D96B]/30 px-1.5 py-0.2 rounded">
                          {f.totalAcres} ac
                        </span>
                      </div>
                      <div className="text-[11px] font-semibold text-[#3C8D5A] truncate mt-0.5">
                        {f.farmName}
                      </div>
                      <div className="text-[10px] text-[#7C887E] flex items-center gap-1 mt-0.5 truncate">
                        <MapPin className="w-3 h-3 shrink-0 text-[#174D35]" />
                        <span>{f.location}</span>
                      </div>

                      {/* Specialties tags */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {f.specialties.slice(0, 2).map((s, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] px-1.5 py-0.5 rounded bg-[#174D35]/10 text-[#174D35] font-semibold"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Footer */}
          <div className="p-4 bg-[#F7F8F2] border-t border-[#174D35]/10 text-xs text-[#7C887E] flex items-center justify-between">
            <span>Click any pin to inspect farm provenance</span>
            <div className="flex items-center gap-1 text-[#174D35] font-bold">
              <Compass className="w-3.5 h-3.5 text-[#3C8D5A]" />
              <span>Madhya Pradesh Zone</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
