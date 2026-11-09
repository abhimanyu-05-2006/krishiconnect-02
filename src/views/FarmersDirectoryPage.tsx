import React, { useState } from 'react';
import { ShieldCheck, MapPin, Star, Phone, ArrowRight, ArrowLeft, Award, Wheat, Check } from 'lucide-react';
import { FarmerProfile, Product } from '../types/index.js';
import { useLanguage } from '../context/LanguageContext.js';

interface FarmersDirectoryPageProps {
  farmers: FarmerProfile[];
  products: Product[];
  onSelectFarmer: (farmer: FarmerProfile) => void;
  onSelectProduct: (product: Product) => void;
  onBack?: () => void;
}

export const FarmersDirectoryPage: React.FC<FarmersDirectoryPageProps> = ({
  farmers,
  products,
  onSelectFarmer,
  onSelectProduct,
  onBack,
}) => {
  const { t } = useLanguage();
  const [districtFilter, setDistrictFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  const filteredFarmers = farmers.filter((f) => {
    const matchesDistrict = districtFilter === 'All' || f.district.toLowerCase() === districtFilter.toLowerCase();
    const matchesType = typeFilter === 'All' || f.farmingType === typeFilter;
    return matchesDistrict && matchesType;
  });

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

      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#174D35]/15 p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-[#3C8D5A] uppercase tracking-wider">
            Verified Growers Network
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17251C] mt-1">
            Our Progressive Farmers
          </h1>
          <p className="text-xs text-[#7C887E] mt-1">
            Meet the sovereign agricultural producers who grow, nurture, and harvest your family’s food in Madhya Pradesh.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="py-2 px-3 text-xs bg-[#F7F8F2] border border-[#174D35]/20 rounded-xl text-[#17251C]"
          >
            <option value="All">All Districts</option>
            <option value="Sehore">Sehore</option>
            <option value="Bhopal">Bhopal</option>
            <option value="Vidisha">Vidisha</option>
            <option value="Raisen">Raisen</option>
            <option value="Hoshangabad">Hoshangabad</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="py-2 px-3 text-xs bg-[#F7F8F2] border border-[#174D35]/20 rounded-xl text-[#17251C]"
          >
            <option value="All">All Farming Systems</option>
            <option value="Organic">Organic (NPOP)</option>
            <option value="Natural/ZBNF">Natural / ZBNF</option>
            <option value="Conventional">Conventional / IPM</option>
          </select>
        </div>
      </div>

      {/* Farmers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFarmers.map((f) => {
          const farmerProducts = products.filter((p) => p.farmerId === f.id);

          return (
            <div
              key={f.id}
              className="bg-white rounded-2xl border border-[#174D35]/15 overflow-hidden shadow-xs hover:border-[#174D35] transition-all flex flex-col justify-between"
            >
              <div className="p-6 space-y-4">
                
                <div className="flex items-start gap-4">
                  <img
                    src={f.avatar}
                    alt={f.farmerName}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-[#174D35]/20 shrink-0"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/src/assets/images/farmer_portrait_mentor_1793946353253.jpg';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-base text-[#17251C]">{f.farmerName}</h3>
                      {f.isVerified && <ShieldCheck className="w-4 h-4 text-[#3C8D5A]" />}
                    </div>
                    <div className="text-xs font-semibold text-[#174D35]">{f.farmName}</div>
                    <div className="text-[11px] text-[#7C887E] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#3C8D5A]" />
                      <span>{f.location}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-[#17251C]">
                  <span className="font-semibold bg-[#174D35]/5 px-2 py-0.5 rounded text-[#174D35]">
                    {f.farmingType}
                  </span>
                  <span>·</span>
                  <span className="text-[#7C887E]">{f.totalAcres} Acres</span>
                  <span>·</span>
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{f.rating}</span>
                  </div>
                </div>

                <p className="text-xs text-[#17251C]/80 line-clamp-3 leading-relaxed">
                  {f.bio}
                </p>

                {/* Specialties */}
                <div>
                  <div className="text-[11px] font-bold text-[#7C887E] uppercase mb-1.5">Crop Specialties</div>
                  <div className="flex flex-wrap gap-1.5">
                    {f.specialties.map((s) => (
                      <span
                        key={s}
                        className="text-[11px] font-medium bg-[#F7F8F2] border border-[#174D35]/15 px-2 py-0.5 rounded-md text-[#174D35]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Bottom bar with active produce count */}
              <div className="p-4 bg-[#F7F8F2] border-t border-[#174D35]/10 flex items-center justify-between text-xs">
                <span className="font-semibold text-[#17251C]">
                  {farmerProducts.length} Active Listings
                </span>
                <button
                  onClick={() => onSelectFarmer(f)}
                  className="px-3 py-1.5 rounded-lg bg-[#174D35] text-white font-bold hover:bg-[#123b28] transition-colors flex items-center gap-1 text-xs"
                >
                  <span>View Farm Shop</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
