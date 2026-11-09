import React, { useState } from 'react';
import {
  ShoppingBag,
  Globe,
  UserCheck,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useCart } from '../../context/CartContext.js';
import { useLanguage } from '../../context/LanguageContext.js';

import { Logo } from '../brand/Logo.js';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  openAiChat: () => void;
  onGoBack?: () => void;
  canGoBack?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  openAiChat,
  onGoBack,
  canGoBack = true,
}) => {
  const { user, role, setIsDemoSwitchOpen } = useAuth();
  const { totalItemsCount, setIsCartOpen } = useCart();
  const { lang, setLang, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDashboardViewForRole = (r: string) => {
    switch (r) {
      case 'farmer':
        return 'farmer-dashboard';
      case 'consumer':
        return 'consumer-dashboard';
      case 'retailer':
        return 'retailer-dashboard';
      case 'delivery':
        return 'delivery-dashboard';
      case 'admin':
        return 'admin-dashboard';
      default:
        return 'consumer-dashboard';
    }
  };

  const navLinks = [
    { id: 'marketplace', label: t('nav_marketplace') },
    { id: 'farmers', label: t('nav_farmers') },
    { id: 'reviews', label: t('nav_reviews') },
    { id: 'map', label: t('nav_map') },
    { id: 'transparency', label: t('nav_transparency') },
    { id: 'how-it-works', label: t('nav_how_it_works') },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#F7F8F2]/95 backdrop-blur-md border-b border-[#174D35]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 sm:gap-8 h-18">
          
          {/* Zone 1: Back Button (if not on landing) + Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {currentView !== 'landing' && onGoBack && (
              <button
                onClick={onGoBack}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#174D35]/10 hover:bg-[#174D35]/20 text-[#174D35] text-xs font-bold transition-all border border-[#174D35]/20 shadow-2xs group cursor-pointer"
                title={t('btn_back')}
                aria-label={t('btn_back')}
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                <span className="font-bold">{t('btn_back')}</span>
              </button>
            )}

            <button
              onClick={() => setCurrentView('landing')}
              className="group cursor-pointer focus:outline-none"
              title="KrishiConnect Home"
            >
              <Logo size="sm" showSubtitle={true} />
            </button>
          </div>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#17251C]/80">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => setCurrentView(link.id)}
                className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#174D35] py-1 ${
                  currentView === link.id
                    ? 'text-[#174D35] font-semibold border-b-2 border-[#174D35]'
                    : ''
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: Actions - AI Assistant, Cart, Language, and Role Switcher */}
          <div className="flex items-center gap-3 shrink-0">
            
            {/* AI Assistant Quick Trigger */}
            <button
              onClick={openAiChat}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3C8D5A]/10 text-[#174D35] hover:bg-[#3C8D5A]/20 transition-colors text-xs font-semibold whitespace-nowrap"
              title="KrishiMitra AI Assistant"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#3C8D5A]" />
              <span>KrishiMitra AI</span>
            </button>

            {/* Trilingual toggle: English / Hindi / Marathi */}
            <button
              onClick={() => {
                if (lang === 'en') setLang('hi');
                else if (lang === 'hi') setLang('mr');
                else setLang('en');
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#174D35]/20 text-xs font-bold text-[#17251C] hover:bg-white transition-colors cursor-pointer shadow-2xs"
              title="Change Language (English / हिंदी / मराठी)"
            >
              <Globe className="w-3.5 h-3.5 text-[#3C8D5A]" />
              <span className="uppercase">
                {lang === 'en' ? 'EN' : lang === 'hi' ? 'हिं' : 'मरा'}
              </span>
            </button>

            {/* Shopping Cart button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-lg hover:bg-white border border-transparent hover:border-[#174D35]/10 transition-colors text-[#174D35]"
              title="View Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#174D35] text-[#B7D96B] text-[11px] font-bold flex items-center justify-center shadow">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* Demo Role Switcher Dropdown */}
            <button
              onClick={() => setIsDemoSwitchOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-[#174D35]/20 text-[#174D35] hover:bg-white transition-colors whitespace-nowrap"
              title="Switch Persona"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#3C8D5A]" />
              <span className="capitalize">{user ? user.name.split(' ')[0] : 'Persona'}</span>
              <ChevronDown className="w-3 h-3 opacity-80" />
            </button>

            {/* Stakeholder Login & KYC Gateway Action */}
            <button
              onClick={() => setCurrentView('login')}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-all shadow-sm whitespace-nowrap cursor-pointer ${
                currentView === 'login'
                  ? 'bg-[#E6A23C] text-[#17251C]'
                  : 'bg-[#174D35] text-white hover:bg-[#123B28]'
              }`}
            >
              <span className="hidden sm:inline">Stakeholder Login</span>
              <span className="sm:hidden">Login</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#B7D96B]" />
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-[#17251C] hover:bg-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#174D35]/10 bg-[#F7F8F2] px-4 py-4 space-y-3">
          {/* Mobile Language Selector */}
          <div className="flex items-center justify-between pb-2 border-b border-[#174D35]/10">
            <span className="text-xs font-semibold text-[#174D35] flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" /> Language / भाषा
            </span>
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-[#174D35]/15">
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                  lang === 'en' ? 'bg-[#174D35] text-white font-bold' : 'text-[#7C887E] hover:text-[#174D35]'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLang('hi')}
                className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                  lang === 'hi' ? 'bg-[#174D35] text-white font-bold' : 'text-[#7C887E] hover:text-[#174D35]'
                }`}
              >
                हिंदी
              </button>
              <button
                onClick={() => setLang('mr')}
                className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                  lang === 'mr' ? 'bg-[#174D35] text-white font-bold' : 'text-[#7C887E] hover:text-[#174D35]'
                }`}
              >
                मराठी
              </button>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            {currentView !== 'landing' && onGoBack && (
              <button
                onClick={() => {
                  onGoBack();
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2.5 rounded-xl text-sm font-bold bg-[#174D35]/10 text-[#174D35] hover:bg-[#174D35]/15 flex items-center gap-2 border border-[#174D35]/20 shadow-2xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('btn_back')}</span>
              </button>
            )}
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setCurrentView(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${
                  currentView === link.id
                    ? 'bg-[#174D35] text-white'
                    : 'text-[#17251C] hover:bg-white'
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => {
                setCurrentView(getDashboardViewForRole(role));
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 rounded-lg text-sm font-semibold text-[#174D35] hover:bg-white flex items-center justify-between"
            >
              <span>{t('nav_dashboard')} ({role})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                openAiChat();
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 rounded-lg text-sm font-medium text-[#3C8D5A] bg-[#3C8D5A]/10 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>KrishiMitra AI Assistant</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
