import React, { useState, useEffect } from 'react';
import { ArrowLeft, Home } from 'lucide-react';
import { LanguageProvider, useLanguage } from './context/LanguageContext.js';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { CartProvider } from './context/CartContext.js';

import { Navbar } from './components/layout/Navbar.js';
import { Footer } from './components/layout/Footer.js';
import { DemoSwitchModal } from './components/modals/DemoSwitchModal.js';
import { CartDrawer } from './components/modals/CartDrawer.js';
import { AiAssistantModal } from './components/modals/AiAssistantModal.js';

import { LandingPage } from './views/LandingPage.js';
import { MarketplacePage } from './views/MarketplacePage.js';
import { FarmersDirectoryPage } from './views/FarmersDirectoryPage.js';
import { PriceTransparencyPage } from './views/PriceTransparencyPage.js';
import { HowItWorksPage } from './views/HowItWorksPage.js';
import { ProductDetailPage } from './views/ProductDetailPage.js';
import { CheckoutPage } from './views/consumer/CheckoutPage.js';
import { FarmerDashboard } from './views/farmer/FarmerDashboard.js';
import { ConsumerDashboard } from './views/consumer/ConsumerDashboard.js';
import { RetailerDashboard } from './views/retailer/RetailerDashboard.js';
import { DeliveryDashboard } from './views/delivery/DeliveryDashboard.js';
import { AdminDashboard } from './views/admin/AdminDashboard.js';
import { LoginPage } from './views/auth/LoginPage.js';
import { StakeholderMap } from './components/maps/StakeholderMap.js';
import { ReviewsPage } from './views/ReviewsPage.js';

import { Product, FarmerProfile, Order, User, Review } from './types/index.js';
import { PRODUCTS, FARMER_PROFILES, ORDERS, USERS, REVIEWS } from '../server/db.js';

function MainAppContent() {
  const { role, user, allDemoUsers } = useAuth();
  const { t } = useLanguage();

  const [currentView, setCurrentView] = useState<string>('landing');
  const [viewHistory, setViewHistory] = useState<string[]>(['landing']);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [farmers, setFarmers] = useState<FarmerProfile[]>(FARMER_PROFILES);
  const [orders, setOrders] = useState<Order[]>(ORDERS);
  const [reviews, setReviews] = useState<Review[]>(REVIEWS);
  const [mapsQuotaExceeded, setMapsQuotaExceeded] = useState(false);

  // Selected entities for modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedFarmer, setSelectedFarmer] = useState<FarmerProfile | null>(null);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);

  // Navigation handlers with history tracking & browser popstate synchronization
  const navigateToView = (newView: string) => {
    if (newView === currentView) return;
    setViewHistory((prev) => [...prev, currentView]);
    setCurrentView(newView);
    try {
      window.history.pushState({ view: newView }, '', '#' + newView);
    } catch {
      // Ignore in sandboxed environments
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoBack = () => {
    if (selectedProduct) {
      setSelectedProduct(null);
      return;
    }
    if (viewHistory.length > 0) {
      const prev = viewHistory[viewHistory.length - 1];
      setViewHistory((old) => old.slice(0, -1));
      setCurrentView(prev);
      try {
        window.history.replaceState({ view: prev }, '', '#' + prev);
      } catch {
        // Ignore
      }
    } else {
      setCurrentView('landing');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Browser physical back button & hash listener
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (e.state && e.state.view) {
        setCurrentView(e.state.view);
      } else if (window.location.hash) {
        const hash = window.location.hash.replace('#', '');
        if (hash) setCurrentView(hash);
      } else {
        setCurrentView('landing');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Listen for Google Maps quota exceeded event (Tier 1 & Tier 2 Quota Defense)
  useEffect(() => {
    const handleQuota = () => setMapsQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  // Fetch initial data from server APIs
  const refreshData = async () => {
    try {
      const [pRes, fRes, oRes, rRes] = await Promise.all([
        fetch('/api/products').then((r) => (r.ok ? r.json() : PRODUCTS)),
        fetch('/api/farmers').then((r) => (r.ok ? r.json() : FARMER_PROFILES)),
        fetch('/api/orders').then((r) => (r.ok ? r.json() : ORDERS)),
        fetch('/api/reviews').then((r) => (r.ok ? r.json() : REVIEWS)),
      ]);
      setProducts(pRes);
      setFarmers(fRes);
      setOrders(oRes);
      setReviews(rRes);
    } catch (err) {
      console.warn('Using seeded in-memory data:', err);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    const matchedFarmer = farmers.find((f) => f.id === product.farmerId);
    setSelectedFarmer(matchedFarmer || null);
  };

  const handleSelectFarmer = (farmer: FarmerProfile) => {
    setSelectedFarmer(farmer);
    navigateToView('marketplace');
  };

  const handleOrderCreated = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    refreshData();
  };

  const handleAddReview = (newReview: Review) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  const getViewTitle = (view: string): string => {
    switch (view) {
      case 'marketplace':
        return t('view_name_marketplace', 'Marketplace');
      case 'farmers':
        return t('view_name_farmers', 'Farmers');
      case 'reviews':
        return t('view_name_reviews', '360° Reviews');
      case 'map':
        return t('view_name_map', 'Agri Map');
      case 'transparency':
        return t('view_name_transparency', 'Price Transparency');
      case 'how-it-works':
        return t('view_name_how_it_works', 'How It Works');
      case 'checkout':
        return t('view_name_checkout', 'Checkout');
      case 'login':
        return t('view_name_login', 'Stakeholder Login');
      case 'farmer-dashboard':
        return `${t('view_name_dashboard', 'Dashboard')} (${t('role_farmer', 'Farmer')})`;
      case 'consumer-dashboard':
        return `${t('view_name_dashboard', 'Dashboard')} (${t('role_consumer', 'Consumer')})`;
      case 'retailer-dashboard':
        return `${t('view_name_dashboard', 'Dashboard')} (${t('role_retailer', 'Retailer')})`;
      case 'delivery-dashboard':
        return `${t('view_name_dashboard', 'Dashboard')} (${t('role_delivery', 'Delivery')})`;
      case 'admin-dashboard':
        return `${t('view_name_dashboard', 'Dashboard')} (${t('role_admin', 'Admin')})`;
      default:
        return view;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8F2] text-[#17251C] font-sans selection:bg-[#B7D96B]/30 selection:text-[#174D35]">
      
      {/* Google Maps Quota Defense Banner (Section 8 Case A) */}
      {mapsQuotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Top Navbar adhering to Top Bar Contract with responsive Back Button */}
      <Navbar
        currentView={currentView}
        setCurrentView={navigateToView}
        openAiChat={() => setIsAiChatOpen(true)}
        onGoBack={handleGoBack}
        canGoBack={currentView !== 'landing'}
      />

      {/* Secondary Sticky Breadcrumbs & Back Navigation Bar (when not on landing page) */}
      {currentView !== 'landing' && (
        <div className="bg-white/90 backdrop-blur-md border-b border-[#174D35]/10 px-4 sm:px-6 lg:px-8 py-2 sticky top-[72px] z-30 shadow-2xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={handleGoBack}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#174D35]/10 hover:bg-[#174D35]/20 text-[#174D35] font-bold transition-all border border-[#174D35]/20 shadow-2xs group cursor-pointer"
                title={t('btn_back')}
                aria-label={t('btn_back')}
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                <span>{t('btn_back')}</span>
              </button>
              <span className="text-[#174D35]/30">/</span>
              <button
                onClick={() => navigateToView('landing')}
                className="text-[#7C887E] hover:text-[#174D35] transition-colors font-medium flex items-center gap-1 cursor-pointer"
              >
                <Home className="w-3 h-3 text-[#3C8D5A]" />
                <span>{t('brand_name')}</span>
              </button>
              <span className="text-[#174D35]/30">/</span>
              <span className="font-bold text-[#174D35] capitalize">
                {getViewTitle(currentView)}
              </span>
            </div>

            <button
              onClick={() => navigateToView('landing')}
              className="text-[11px] font-semibold text-[#3C8D5A] hover:text-[#174D35] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('btn_back_home')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'login' && (
          <LoginPage
            setCurrentView={navigateToView}
            onBack={handleGoBack}
          />
        )}

        {currentView === 'landing' && (
          <LandingPage
            setCurrentView={navigateToView}
            products={products}
            farmers={farmers}
            users={allDemoUsers}
            onSelectProduct={handleSelectProduct}
            onSelectFarmer={handleSelectFarmer}
            openAiChat={() => setIsAiChatOpen(true)}
          />
        )}

        {/* Dedicated Fullscreen Agri Map View */}
        {currentView === 'map' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <StakeholderMap
              farmers={farmers}
              users={allDemoUsers}
              products={products}
              onSelectFarmer={handleSelectFarmer}
              onSelectProduct={handleSelectProduct}
              onBack={handleGoBack}
            />
          </div>
        )}

        {currentView === 'marketplace' && (
          <MarketplacePage
            products={products}
            onSelectProduct={handleSelectProduct}
            openAiChat={() => setIsAiChatOpen(true)}
            onBack={handleGoBack}
          />
        )}

        {currentView === 'farmers' && (
          <FarmersDirectoryPage
            farmers={farmers}
            products={products}
            onSelectFarmer={handleSelectFarmer}
            onSelectProduct={handleSelectProduct}
            onBack={handleGoBack}
          />
        )}

        {currentView === 'reviews' && (
          <ReviewsPage
            reviews={reviews}
            products={products}
            onAddReview={handleAddReview}
            onSelectProduct={handleSelectProduct}
            onBack={handleGoBack}
          />
        )}

        {currentView === 'transparency' && (
          <PriceTransparencyPage
            setCurrentView={navigateToView}
            onBack={handleGoBack}
          />
        )}

        {currentView === 'how-it-works' && (
          <HowItWorksPage
            setCurrentView={navigateToView}
            openAiChat={() => setIsAiChatOpen(true)}
            onBack={handleGoBack}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutPage
            setCurrentView={navigateToView}
            onOrderCreated={handleOrderCreated}
            onBack={handleGoBack}
          />
        )}

        {/* Dashboards */}
        {currentView === 'farmer-dashboard' && (
          <FarmerDashboard
            products={products}
            orders={orders}
            onRefreshData={refreshData}
            openAiChat={() => setIsAiChatOpen(true)}
          />
        )}

        {currentView === 'consumer-dashboard' && (
          <ConsumerDashboard
            orders={orders}
            products={products}
            setCurrentView={navigateToView}
            openAiChat={() => setIsAiChatOpen(true)}
            onRefreshOrders={refreshData}
          />
        )}

        {currentView === 'retailer-dashboard' && (
          <RetailerDashboard
            products={products}
            orders={orders}
            onRefreshData={refreshData}
          />
        )}

        {currentView === 'delivery-dashboard' && (
          <DeliveryDashboard
            orders={orders}
            onRefreshOrders={refreshData}
          />
        )}

        {currentView === 'admin-dashboard' && (
          <AdminDashboard
            users={[]}
            farmers={farmers}
            products={products}
            orders={orders}
            onRefreshData={refreshData}
            openAiChat={() => setIsAiChatOpen(true)}
          />
        )}
      </main>

      {/* Floating Quick Back Button (on non-landing views) */}
      {currentView !== 'landing' && !selectedProduct && (
        <aside aria-label="Quick back navigation" className="fixed bottom-6 left-6 z-40">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#174D35] text-white hover:bg-[#123B28] shadow-lg border border-[#B7D96B]/30 text-xs font-bold transition-all hover:scale-105 active:scale-95 group cursor-pointer"
            title={t('btn_back')}
            aria-label={t('btn_back')}
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-[#B7D96B]" />
            <span>{t('btn_back')}</span>
          </button>
        </aside>
      )}

      {/* Footer */}
      <Footer setCurrentView={navigateToView} />

      {/* Persistent Modals */}
      <DemoSwitchModal setCurrentView={navigateToView} />
      <CartDrawer setCurrentView={navigateToView} />
      <AiAssistantModal
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
      />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailPage
          product={selectedProduct}
          farmer={selectedFarmer || undefined}
          reviews={reviews}
          onClose={() => setSelectedProduct(null)}
          setCurrentView={navigateToView}
          onSelectFarmer={handleSelectFarmer}
        />
      )}

    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <MainAppContent />
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
