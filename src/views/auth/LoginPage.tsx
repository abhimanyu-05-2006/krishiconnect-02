import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  FileText,
  Building2,
  Truck,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Phone,
  Lock,
  RefreshCw,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { Role, User } from '../../types/index.js';
import { useAuth } from '../../context/AuthContext.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { Logo } from '../../components/brand/Logo.js';

interface LoginPageProps {
  setCurrentView: (view: string) => void;
  onBack?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ setCurrentView, onBack }) => {
  const { t } = useLanguage();
  const { loginAsRole, loginWithPhone, loginWithEmail, allDemoUsers, updateUserKyc } = useAuth();

  // Active Stakeholder Tab
  const [selectedRole, setSelectedRole] = useState<Role>('farmer');

  // Auth Mode: 'otp' | 'password' | 'kyc'
  const [authMode, setAuthMode] = useState<'otp' | 'password' | 'kyc'>('otp');

  // Phone & OTP state
  const [phoneNumber, setPhoneNumber] = useState('9826145890');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [simulatedIncomingOtp, setSimulatedIncomingOtp] = useState<string | null>(null);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Email/Password state
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('krishi@2025');

  // KYC Verification Form States
  // Farmer KYC
  const [aadhaarNumber, setAadhaarNumber] = useState('4812 9021 3345');
  const [khasraNumber, setKhasraNumber] = useState('142/2');
  const [landArea, setLandArea] = useState('18');
  const [farmerDistrict, setFarmerDistrict] = useState('Sehore');

  // Retailer KYC
  const [businessName, setBusinessName] = useState('GreenLeaf Supermart & Wholesale');
  const [gstinNumber, setGstinNumber] = useState('23AABCG1234F1Z8');
  const [fssaiLicense, setFssaiLicense] = useState('11421850000342');

  // Delivery KYC
  const [drivingLicense, setDrivingLicense] = useState('MP-04-2021-0089234');
  const [vehicleRc, setVehicleRc] = useState('MP-04-GB-9821');
  const [vehicleType, setVehicleType] = useState<'Two-Wheeler' | 'Three-Wheeler / Auto' | 'Tata Ace / Mini Truck'>('Tata Ace / Mini Truck');

  const [isSubmittingKyc, setIsSubmittingKyc] = useState(false);

  // Switch stakeholder tab
  const handleRoleChange = (role: Role) => {
    setSelectedRole(role);
    setErrorMsg(null);
    setOtpSent(false);
    setSimulatedIncomingOtp(null);

    // Seed realistic phone number per role
    const persona = allDemoUsers.find((u) => u.role === role);
    if (persona) {
      setPhoneNumber(persona.phone.replace(/[^0-9]/g, '').slice(-10));
      setEmailInput(persona.email);
    }
  };

  // Trigger Mock OTP
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
    if (cleanPhone.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    // Generate deterministic or realistic 6-digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setSimulatedIncomingOtp(generatedOtp);
    setOtpSent(true);

    // Show simulated SMS alert toast
    setSuccessToast(`SMS Sent: OTP for KrishiConnect verification is ${generatedOtp}`);
    setTimeout(() => {
      setSuccessToast(null);
    }, 6000);
  };

  // Handle OTP digit entry
  const handleOtpDigitChange = (index: number, val: string) => {
    if (val.length > 1) {
      val = val.slice(-1);
    }
    const next = [...otpCode];
    next[index] = val;
    setOtpCode(next);

    // Auto advance focus to next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Auto fill OTP helper
  const handleAutofillOtp = () => {
    if (simulatedIncomingOtp) {
      setOtpCode(simulatedIncomingOtp.split(''));
    }
  };

  // Verify OTP and route
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otpCode.join('');
    if (entered.length < 6) {
      setErrorMsg('Please enter all 6 digits of the OTP.');
      return;
    }

    setIsVerifyingOtp(true);
    setTimeout(() => {
      setIsVerifyingOtp(false);
      // Log in user with phone
      const loggedUser = loginWithPhone(phoneNumber, selectedRole);

      // Route to destination
      redirectToDashboard(selectedRole);
    }, 600);
  };

  // Handle Password Login
  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      setErrorMsg('Please enter your registered email address.');
      return;
    }

    loginWithEmail(emailInput);
    redirectToDashboard(selectedRole);
  };

  // Handle 1-Click Demo Login
  const handleQuickDemoLogin = (role: Role) => {
    loginAsRole(role);
    redirectToDashboard(role);
  };

  // Submit KYC Verification
  const handleSubmitKyc = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingKyc(true);

    setTimeout(() => {
      setIsSubmittingKyc(false);

      if (selectedRole === 'farmer') {
        updateUserKyc({
          aadhaarNumber: `XXXX-XXXX-${aadhaarNumber.slice(-4)}`,
          khasraNumber,
          landAreaAcres: Number(landArea) || 12,
        });
      } else if (selectedRole === 'retailer') {
        updateUserKyc({
          businessName,
          gstin: gstinNumber,
          fssaiLicense,
        });
      } else if (selectedRole === 'delivery') {
        updateUserKyc({
          drivingLicense,
          vehicleRc,
          vehicleType,
        });
      }

      setSuccessToast('KYC Verification Approved! Direct agri trade permissions activated.');
      setTimeout(() => {
        redirectToDashboard(selectedRole);
      }, 1000);
    }, 800);
  };

  const redirectToDashboard = (role: Role) => {
    switch (role) {
      case 'farmer':
        setCurrentView('farmer-dashboard');
        break;
      case 'consumer':
        setCurrentView('marketplace');
        break;
      case 'retailer':
        setCurrentView('retailer-dashboard');
        break;
      case 'delivery':
        setCurrentView('delivery-dashboard');
        break;
      case 'admin':
        setCurrentView('admin-dashboard');
        break;
      default:
        setCurrentView('marketplace');
    }
  };

  // Current persona metadata
  const currentPersona = allDemoUsers.find((u) => u.role === selectedRole);

  const stakeholderDescriptions: Record<Role, { title: string; subtitle: string; icon: any; kycTitle: string; perks: string[] }> = {
    farmer: {
      title: 'Kisan / Farmer Portal',
      subtitle: 'Sovereign farm-gate trade, direct mandi price discovery, zero commission.',
      icon: Sparkles,
      kycTitle: 'Farmer Land & Aadhaar Registry (MP Bhulekh)',
      perks: [
        'Direct 90% payout to linked bank account / UPI',
        'Daily MSP & market trend analytics for MP mandis',
        'KrishiMitra AI crop advisory & smart listing pricing'
      ],
    },
    consumer: {
      title: 'Consumer Marketplace',
      subtitle: 'Direct farm-to-table fresh harvests, chemical-free, transparent harvest logs.',
      icon: CheckCircle2,
      kycTitle: 'Instant Consumer Mobile Verification',
      perks: [
        'Guaranteed zero middleman price markup',
        '18-hour dawn harvest to door transit guarantee',
        'Complete farmer identity & farm location transparency'
      ],
    },
    retailer: {
      title: 'Retailer & Bulk Buyer',
      subtitle: 'Wholesale procurement in quintals, B2B tax invoices, bulk delivery logistics.',
      icon: Building2,
      kycTitle: 'Business GSTIN & FSSAI Verification',
      perks: [
        'Verified wholesale quintal rates direct from growers',
        'Consolidated GST tax invoices for commercial credit',
        'Scheduled recurring mandi dock deliveries'
      ],
    },
    delivery: {
      title: 'AgriFleet Delivery Partner',
      subtitle: 'Fair-mile agricultural transit, farm pickup batches, route optimization.',
      icon: Truck,
      kycTitle: 'Driver License & Vehicle RC Verification',
      perks: [
        'Real-time farm-to-hub pickup dispatch orders',
        'Transparent per-kilometer payout + transit bonus',
        'Direct OTP delivery confirmation handoffs'
      ],
    },
    admin: {
      title: 'Platform Operations Admin',
      subtitle: 'Supervisory oversight, KYC moderation, GMV monitoring, dispute arbitration.',
      icon: ShieldCheck,
      kycTitle: 'Executive Administrative Access',
      perks: [
        'Full KYC document review & approvals dashboard',
        'Marketplace moderation and product listing audits',
        'Real-time trade dispute arbitration tools'
      ],
    },
  };

  const currentMeta = stakeholderDescriptions[selectedRole];

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-[#F7F8F2] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      
      {/* Simulated SMS OTP Toast Notification */}
      {simulatedIncomingOtp && (
        <div className="fixed top-20 right-4 z-50 max-w-md w-full bg-[#17251C] text-white p-4 rounded-xl shadow-2xl border border-[#B7D96B]/40 animate-slide-in">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#174D35] flex items-center justify-center text-[#B7D96B] shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-[#B7D96B] uppercase tracking-wider">
                  Govt SMS Gateway · KrishiConnect
                </div>
                <div className="text-sm font-medium mt-0.5">
                  Your verification code is{' '}
                  <span className="font-mono text-base font-bold text-white tracking-widest bg-white/10 px-1.5 py-0.5 rounded">
                    {simulatedIncomingOtp}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleAutofillOtp}
              className="text-xs font-bold text-[#17251C] bg-[#B7D96B] hover:bg-[#a6cb55] px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-colors"
            >
              Autofill OTP
            </button>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#174D35] text-white px-4 py-3 rounded-xl shadow-lg border border-[#B7D96B]/30 flex items-center gap-3 text-sm">
          <CheckCircle2 className="w-5 h-5 text-[#B7D96B] shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      <div className="max-w-5xl mx-auto w-full">
        
        {/* Back button row */}
        {onBack && (
          <div className="mb-4">
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

        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex justify-center mb-3">
            <Logo size="lg" showSubtitle={false} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17251C] tracking-tight">
            Stakeholder Gateway & Verification
          </h1>
          <p className="text-sm text-[#7C887E] mt-1 max-w-lg mx-auto">
            Direct farmer-to-consumer agricultural infrastructure. Select your stakeholder role to access your verified dashboard.
          </p>
        </div>

        {/* Stakeholder Role Selector Tabs */}
        <div className="bg-white rounded-2xl p-1.5 border border-[#174D35]/15 shadow-sm mb-6 max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
            {(['farmer', 'consumer', 'retailer', 'delivery', 'admin'] as Role[]).map((r) => {
              const isActive = selectedRole === r;
              const meta = stakeholderDescriptions[r];
              const Icon = meta.icon;

              return (
                <button
                  key={r}
                  onClick={() => handleRoleChange(r)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#174D35] text-white shadow-md'
                      : 'text-[#17251C]/80 hover:bg-[#F7F8F2] hover:text-[#17251C]'
                  }`}
                >
                  <Icon className={`w-5 h-5 mb-1.5 ${isActive ? 'text-[#B7D96B]' : 'text-[#3C8D5A]'}`} />
                  <span className="text-xs font-bold tracking-tight capitalize whitespace-nowrap">
                    {r === 'farmer' ? 'Kisan / Farmer' : r}
                  </span>
                  <span className={`text-[10px] mt-0.5 truncate max-w-[120px] ${isActive ? 'text-white/80' : 'text-[#7C887E]'}`}>
                    {r === 'farmer' ? 'अन्नदाता' : r === 'consumer' ? 'Direct Buyer' : r === 'retailer' ? 'Bulk Trader' : r === 'delivery' ? 'Fleet Transit' : 'Supervisor'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Dual-Column Authentication & KYC Card */}
        <div className="bg-white rounded-3xl border border-[#174D35]/15 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Column: Stakeholder Context & Quick Persona Preview (5 Cols) */}
          <div className="lg:col-span-5 bg-[#174D35] text-white p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10">
            <div>
              {/* Stakeholder Title */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#B7D96B]">
                  Role Verification
                </span>
                <span className="text-white/40">·</span>
                <span className="text-xs text-white/80 font-medium">Madhya Pradesh</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
                {currentMeta.title}
              </h2>
              <p className="text-xs text-white/80 leading-relaxed mb-6">
                {currentMeta.subtitle}
              </p>

              {/* Active Verified Indian Persona Spotlight */}
              {currentPersona && (
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 mb-6">
                  <div className="text-[11px] font-semibold text-[#B7D96B] uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Verified Active Persona</span>
                    <span className="flex items-center gap-1 text-[10px] bg-[#B7D96B]/20 px-2 py-0.5 rounded text-[#B7D96B]">
                      <ShieldCheck className="w-3 h-3" /> KYC Verified
                    </span>
                  </div>
                  <div className="flex items-center gap-3.5">
                    <img
                      src={currentPersona.avatar}
                      alt={currentPersona.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-[#B7D96B] shrink-0"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/src/assets/images/farmer_portrait_mentor_1793946353253.jpg';
                      }}
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-white text-sm truncate">
                        {currentPersona.name}
                      </div>
                      <div className="text-xs text-white/70 truncate mt-0.5">
                        {currentPersona.location}
                      </div>
                      <div className="text-[11px] font-mono text-[#B7D96B] mt-1">
                        {currentPersona.phone}
                      </div>
                    </div>
                  </div>

                  {/* 1-Click Persona Sign-In Button */}
                  <button
                    onClick={() => handleQuickDemoLogin(selectedRole)}
                    className="w-full mt-3.5 py-2 px-3 bg-[#B7D96B] hover:bg-[#a6cb55] text-[#17251C] rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
                  >
                    <span>Instant Login as {currentPersona.name.split(' ')[0]}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Role Perks & Protocol */}
              <div className="space-y-2.5">
                <div className="text-xs font-semibold text-white/90">
                  Direct Mandi Protocol Guarantees:
                </div>
                {currentMeta.perks.map((perk, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-white/80 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-[#B7D96B] shrink-0 mt-0.5" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Guest / Marketplace bypass */}
            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-white/70">
              <span>Just want to inspect produce?</span>
              <button
                onClick={() => setCurrentView('marketplace')}
                className="text-[#B7D96B] hover:text-white font-semibold underline flex items-center gap-1 transition-colors"
              >
                <span>Browse Marketplace</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Login & KYC Forms (7 Cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Form Mode Selector: OTP vs Password vs KYC */}
              <div className="flex items-center justify-between border-b border-[#174D35]/10 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAuthMode('otp')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      authMode === 'otp'
                        ? 'bg-[#174D35] text-white shadow-sm'
                        : 'text-[#7C887E] hover:text-[#17251C]'
                    }`}
                  >
                    Phone OTP Login
                  </button>
                  <button
                    onClick={() => setAuthMode('password')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      authMode === 'password'
                        ? 'bg-[#174D35] text-white shadow-sm'
                        : 'text-[#7C887E] hover:text-[#17251C]'
                    }`}
                  >
                    Email & Password
                  </button>
                  {selectedRole !== 'admin' && (
                    <button
                      onClick={() => setAuthMode('kyc')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                        authMode === 'kyc'
                          ? 'bg-[#E6A23C] text-[#17251C] shadow-sm'
                          : 'text-[#7C887E] hover:text-[#17251C]'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Stakeholder KYC</span>
                    </button>
                  )}
                </div>

                <span className="text-[11px] font-medium text-[#7C887E] hidden sm:inline">
                  Step {authMode === 'kyc' ? '2 of 2' : '1 of 2'}
                </span>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* ---------------- MODE 1: INDIAN MOBILE OTP AUTH ---------------- */}
              {authMode === 'otp' && (
                <div>
                  <div className="mb-5">
                    <h3 className="text-lg font-bold text-[#17251C]">
                      Fast Mobile Authentication
                    </h3>
                    <p className="text-xs text-[#7C887E] mt-0.5">
                      Enter your 10-digit Indian mobile number. We will send a 6-digit OTP code.
                    </p>
                  </div>

                  {!otpSent ? (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#17251C] mb-1.5">
                          Indian Mobile Number (फोन नंबर)
                        </label>
                        <div className="flex rounded-xl border border-[#174D35]/20 focus-within:border-[#174D35] focus-within:ring-2 focus-within:ring-[#174D35]/10 overflow-hidden bg-white shadow-sm">
                          <span className="inline-flex items-center px-3.5 text-xs font-semibold text-[#7C887E] bg-[#F7F8F2] border-r border-[#174D35]/15 select-none">
                            +91
                          </span>
                          <input
                            type="tel"
                            maxLength={10}
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="98261 45890"
                            className="flex-1 py-2.5 px-3 text-sm font-mono tracking-wider text-[#17251C] focus:outline-none"
                            required
                          />
                        </div>
                        <span className="text-[11px] text-[#7C887E] mt-1 inline-block">
                          Standard SMS rates apply · Supported for Airtel, Jio, VI, BSNL
                        </span>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-[#174D35] hover:bg-[#123B28] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Send 6-Digit Verification OTP</span>
                        <ArrowRight className="w-4 h-4 text-[#B7D96B]" />
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-xs font-semibold text-[#17251C]">
                            Enter 6-Digit OTP sent to +91 {phoneNumber}
                          </label>
                          <button
                            type="button"
                            onClick={() => setOtpSent(false)}
                            className="text-xs text-[#3C8D5A] hover:underline font-semibold"
                          >
                            Change Number
                          </button>
                        </div>

                        {/* 6-box OTP entry */}
                        <div className="flex items-center gap-2 sm:gap-3 justify-center py-2">
                          {otpCode.map((digit, idx) => (
                            <input
                              key={idx}
                              id={`otp-${idx}`}
                              type="text"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                              className="w-10 sm:w-12 h-12 text-center text-lg font-mono font-bold border-2 rounded-xl focus:border-[#174D35] focus:outline-none bg-white shadow-sm"
                            />
                          ))}
                        </div>

                        {simulatedIncomingOtp && (
                          <div className="mt-2 text-center">
                            <button
                              type="button"
                              onClick={handleAutofillOtp}
                              className="text-xs font-semibold text-[#174D35] bg-[#3C8D5A]/10 hover:bg-[#3C8D5A]/20 px-3 py-1 rounded-lg transition-colors"
                            >
                              Click to Autofill Code: {simulatedIncomingOtp}
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs text-[#7C887E]">
                        <span>Didn't receive SMS?</span>
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          className="font-semibold text-[#174D35] hover:underline flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" /> Resend OTP
                        </button>
                      </div>

                      <button
                        type="submit"
                        disabled={isVerifyingOtp}
                        className="w-full py-3 bg-[#174D35] hover:bg-[#123B28] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {isVerifyingOtp ? (
                          <span>Verifying Credentials...</span>
                        ) : (
                          <>
                            <span>Verify OTP & Enter {selectedRole.toUpperCase()}</span>
                            <ArrowRight className="w-4 h-4 text-[#B7D96B]" />
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* ---------------- MODE 2: EMAIL & PASSWORD AUTH ---------------- */}
              {authMode === 'password' && (
                <div>
                  <div className="mb-5">
                    <h3 className="text-lg font-bold text-[#17251C]">
                      Standard Account Login
                    </h3>
                    <p className="text-xs text-[#7C887E] mt-0.5">
                      Login using your registered email and KrishiConnect security password.
                    </p>
                  </div>

                  <form onSubmit={handlePasswordLogin} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#17251C] mb-1.5">
                        Registered Email Address
                      </label>
                      <input
                        type="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="you@krishiconnect.in"
                        className="w-full py-2.5 px-3 text-sm text-[#17251C] rounded-xl border border-[#174D35]/20 focus:border-[#174D35] focus:outline-none bg-white shadow-sm"
                        required
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-semibold text-[#17251C]">
                          Security Password
                        </label>
                        <a href="#forgot" onClick={(e) => { e.preventDefault(); setSuccessToast('Password reset link sent to registered email.'); }} className="text-xs text-[#3C8D5A] hover:underline font-medium">
                          Forgot password?
                        </a>
                      </div>
                      <input
                        type="password"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className="w-full py-2.5 px-3 text-sm text-[#17251C] rounded-xl border border-[#174D35]/20 focus:border-[#174D35] focus:outline-none bg-white shadow-sm font-mono"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-[#174D35] hover:bg-[#123B28] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Sign In & Continue</span>
                      <ArrowRight className="w-4 h-4 text-[#B7D96B]" />
                    </button>
                  </form>
                </div>
              )}

              {/* ---------------- MODE 3: STAKEHOLDER KYC VERIFICATION ---------------- */}
              {authMode === 'kyc' && (
                <div>
                  <div className="mb-4">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded-md bg-[#E6A23C]/20 text-[#17251C]">
                        <ShieldCheck className="w-4 h-4 text-[#E6A23C]" />
                      </span>
                      <h3 className="text-base font-bold text-[#17251C]">
                        {currentMeta.kycTitle}
                      </h3>
                    </div>
                    <p className="text-xs text-[#7C887E] mt-1">
                      Verify legal documentation to unlock direct farm-gate pricing, bulk trade, or dispatch routes.
                    </p>
                  </div>

                  <form onSubmit={handleSubmitKyc} className="space-y-3.5">
                    {/* FARMER KYC: Aadhaar & Khasra / Khatauni */}
                    {selectedRole === 'farmer' && (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-[#17251C] mb-1">
                              Aadhaar Number (12 Digits)
                            </label>
                            <input
                              type="text"
                              value={aadhaarNumber}
                              onChange={(e) => setAadhaarNumber(e.target.value)}
                              placeholder="4812 9021 3345"
                              className="w-full py-2 px-3 text-xs font-mono text-[#17251C] rounded-xl border border-[#174D35]/20 focus:border-[#174D35] focus:outline-none"
                              required
                            />
                            <span className="text-[10px] text-[#7C887E]">UIDAI e-KYC masked encryption</span>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-[#17251C] mb-1">
                              MP Bhulekh Khasra / Khatauni #
                            </label>
                            <input
                              type="text"
                              value={khasraNumber}
                              onChange={(e) => setKhasraNumber(e.target.value)}
                              placeholder="142/2"
                              className="w-full py-2 px-3 text-xs font-mono text-[#17251C] rounded-xl border border-[#174D35]/20 focus:border-[#174D35] focus:outline-none"
                              required
                            />
                            <span className="text-[10px] text-[#7C887E]">Land parcel title deed reference</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-[#17251C] mb-1">
                              Cultivated Area (Acres)
                            </label>
                            <input
                              type="number"
                              value={landArea}
                              onChange={(e) => setLandArea(e.target.value)}
                              className="w-full py-2 px-3 text-xs text-[#17251C] rounded-xl border border-[#174D35]/20 focus:border-[#174D35] focus:outline-none"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-[#17251C] mb-1">
                              Home District / Mandi
                            </label>
                            <select
                              value={farmerDistrict}
                              onChange={(e) => setFarmerDistrict(e.target.value)}
                              className="w-full py-2 px-3 text-xs text-[#17251C] rounded-xl border border-[#174D35]/20 focus:border-[#174D35] focus:outline-none bg-white"
                            >
                              <option value="Sehore">Sehore Mandi</option>
                              <option value="Vidisha">Vidisha Mandi</option>
                              <option value="Bhopal">Bhopal Karond</option>
                              <option value="Raisen">Raisen Mandi</option>
                              <option value="Hoshangabad">Hoshangabad Mandi</option>
                            </select>
                          </div>
                        </div>
                      </>
                    )}

                    {/* RETAILER KYC: GSTIN & FSSAI */}
                    {selectedRole === 'retailer' && (
                      <>
                        <div>
                          <label className="block text-xs font-semibold text-[#17251C] mb-1">
                            Registered Enterprise / Firm Name
                          </label>
                          <input
                            type="text"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            className="w-full py-2 px-3 text-xs text-[#17251C] rounded-xl border border-[#174D35]/20 focus:border-[#174D35] focus:outline-none"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-[#17251C] mb-1">
                              GSTIN (15 Alphanumeric Characters)
                            </label>
                            <input
                              type="text"
                              value={gstinNumber}
                              onChange={(e) => setGstinNumber(e.target.value)}
                              placeholder="23AABCG1234F1Z8"
                              className="w-full py-2 px-3 text-xs font-mono uppercase text-[#17251C] rounded-xl border border-[#174D35]/20 focus:border-[#174D35] focus:outline-none"
                              required
                            />
                            <span className="text-[10px] text-[#7C887E]">State code 23 = Madhya Pradesh</span>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-[#17251C] mb-1">
                              FSSAI Food License Number (14 Digits)
                            </label>
                            <input
                              type="text"
                              value={fssaiLicense}
                              onChange={(e) => setFssaiLicense(e.target.value)}
                              placeholder="11421850000342"
                              className="w-full py-2 px-3 text-xs font-mono text-[#17251C] rounded-xl border border-[#174D35]/20 focus:border-[#174D35] focus:outline-none"
                              required
                            />
                            <span className="text-[10px] text-[#7C887E]">Food safety & hygiene compliance</span>
                          </div>
                        </div>
                      </>
                    )}

                    {/* DELIVERY KYC: DL & Vehicle RC */}
                    {selectedRole === 'delivery' && (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-[#17251C] mb-1">
                              Commercial Driving License (DL)
                            </label>
                            <input
                              type="text"
                              value={drivingLicense}
                              onChange={(e) => setDrivingLicense(e.target.value)}
                              placeholder="MP-04-2021-0089234"
                              className="w-full py-2 px-3 text-xs font-mono text-[#17251C] rounded-xl border border-[#174D35]/20 focus:border-[#174D35] focus:outline-none"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-[#17251C] mb-1">
                              Vehicle Registration Certificate (RC)
                            </label>
                            <input
                              type="text"
                              value={vehicleRc}
                              onChange={(e) => setVehicleRc(e.target.value)}
                              placeholder="MP-04-GB-9821"
                              className="w-full py-2 px-3 text-xs font-mono uppercase text-[#17251C] rounded-xl border border-[#174D35]/20 focus:border-[#174D35] focus:outline-none"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#17251C] mb-1">
                            Transit Vehicle Fleet Category
                          </label>
                          <select
                            value={vehicleType}
                            onChange={(e: any) => setVehicleType(e.target.value)}
                            className="w-full py-2 px-3 text-xs text-[#17251C] rounded-xl border border-[#174D35]/20 focus:border-[#174D35] focus:outline-none bg-white"
                          >
                            <option value="Tata Ace / Mini Truck">Tata Ace / Chhota Hathi / Mini Truck (1.5 Tonne)</option>
                            <option value="Three-Wheeler / Auto">Cargo Three-Wheeler / Electric Auto (500 Kg)</option>
                            <option value="Two-Wheeler">Motorcycle with AgriCarrier Boxes (60 Kg)</option>
                          </select>
                        </div>
                      </>
                    )}

                    {/* Consumer KYC: Quick address & notification verification */}
                    {selectedRole === 'consumer' && (
                      <div className="p-4 rounded-xl bg-[#F7F8F2] border border-[#174D35]/15 text-xs text-[#17251C]">
                        <div className="flex items-center gap-2 font-bold mb-1">
                          <CheckCircle2 className="w-4 h-4 text-[#3C8D5A]" />
                          <span>Instant Consumer KYC Enabled</span>
                        </div>
                        <p className="text-[#7C887E] leading-relaxed">
                          Consumers on KrishiConnect do not require land or GST documents. Phone OTP verification grants immediate access to live farmer produce listings.
                        </p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmittingKyc}
                      className="w-full py-3 bg-[#E6A23C] hover:bg-[#d49433] text-[#17251C] rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
                    >
                      {isSubmittingKyc ? (
                        <span>Validating Registry Records...</span>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>Submit KYC & Authorize Account</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Quick All-Stakeholders Footnote Switcher */}
            <div className="mt-6 pt-4 border-t border-[#174D35]/10 flex flex-wrap items-center justify-between gap-3 text-xs text-[#7C887E]">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-[#17251C]">Quick Stakeholder Demos:</span>
                <span className="text-[#3C8D5A] font-medium">Authentic Indian Personas Ready</span>
              </div>
              <div className="flex items-center gap-2">
                {allDemoUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => handleQuickDemoLogin(u.role)}
                    className="p-1 rounded-full border border-[#174D35]/20 hover:border-[#174D35] transition-all hover:scale-110"
                    title={`1-Click Login: ${u.name} (${u.role})`}
                  >
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-6 h-6 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/src/assets/images/farmer_portrait_mentor_1793946353253.jpg';
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
