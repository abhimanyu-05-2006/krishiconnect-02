import React, { useState } from 'react';
import { X, ShieldCheck, QrCode, CreditCard, Building2, Smartphone, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface RazorpayDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  orderNumber: string;
  onSuccess: (paymentId: string) => void;
  onFailure: (reason: string) => void;
}

export const RazorpayDemoModal: React.FC<RazorpayDemoModalProps> = ({
  isOpen,
  onClose,
  amount,
  orderNumber,
  onSuccess,
  onFailure,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [vpa, setVpa] = useState('farmer@oksbi');
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  if (!isOpen) return null;

  const handleSimulatePayment = (forceFailure = false) => {
    setStatus('processing');
    setStatusMessage('Contacting mock banking gateway & authenticating UPI intent...');

    setTimeout(() => {
      if (forceFailure) {
        setStatus('failed');
        setStatusMessage('Payment declined by simulated bank (Insufficient funds/timeout).');
        setTimeout(() => {
          onFailure('User payment simulation failed');
          setStatus('idle');
        }, 1500);
      } else {
        const mockPayId = `pay_DEMO_${Math.floor(100000 + Math.random() * 900000)}`;
        setStatus('success');
        setStatusMessage(`Payment Authenticated! Reference ID: ${mockPayId}`);
        setTimeout(() => {
          onSuccess(mockPayId);
          setStatus('idle');
        }, 1200);
      }
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Razorpay Brand Header */}
        <div className="bg-[#0C2340] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 font-extrabold flex items-center justify-center text-sm">
              R
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-wide">Razorpay Gateway</span>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 font-semibold px-1.5 py-0.2 rounded">
                  TEST MODE
                </span>
              </div>
              <p className="text-[11px] text-slate-300">KrishiConnect Agricultural Direct Settlement</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={status === 'processing'}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount bar */}
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500">Amount Payable</span>
            <div className="text-lg font-bold text-slate-900 tabular-nums">₹{amount}</div>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500">Order ID</span>
            <div className="text-xs font-semibold text-slate-700">{orderNumber}</div>
          </div>
        </div>

        {/* Content State */}
        {status === 'processing' ? (
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-3">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            <h4 className="font-bold text-sm text-slate-800">Processing Payment...</h4>
            <p className="text-xs text-slate-500 max-w-xs">{statusMessage}</p>
            <span className="text-[11px] text-amber-600 font-medium bg-amber-50 px-2.5 py-1 rounded">
              Do not close this test window
            </span>
          </div>
        ) : status === 'success' ? (
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-600 animate-bounce" />
            <h4 className="font-bold text-base text-slate-900">Payment Successful!</h4>
            <p className="text-xs text-slate-600">{statusMessage}</p>
          </div>
        ) : status === 'failed' ? (
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-3">
            <AlertCircle className="w-12 h-12 text-rose-600" />
            <h4 className="font-bold text-base text-slate-900">Payment Failed</h4>
            <p className="text-xs text-slate-600">{statusMessage}</p>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            
            {/* Payment Mode Selector */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setSelectedMethod('upi')}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                  selectedMethod === 'upi'
                    ? 'border-blue-600 bg-blue-50/50 text-blue-900 ring-1 ring-blue-600'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Smartphone className="w-4 h-4 text-blue-600" />
                <span>UPI / QR</span>
              </button>

              <button
                onClick={() => setSelectedMethod('card')}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                  selectedMethod === 'card'
                    ? 'border-blue-600 bg-blue-50/50 text-blue-900 ring-1 ring-blue-600'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>Cards</span>
              </button>

              <button
                onClick={() => setSelectedMethod('netbanking')}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                  selectedMethod === 'netbanking'
                    ? 'border-blue-600 bg-blue-50/50 text-blue-900 ring-1 ring-blue-600'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Building2 className="w-4 h-4 text-amber-600" />
                <span>NetBanking</span>
              </button>
            </div>

            {/* UPI View */}
            {selectedMethod === 'upi' && (
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center flex flex-col items-center">
                  <div className="w-28 h-28 bg-white border border-slate-300 rounded-lg p-2 flex items-center justify-center shadow-xs mb-2">
                    <QrCode className="w-24 h-24 text-slate-800" />
                  </div>
                  <span className="text-[11px] text-slate-500">Scan mock QR using GPay / PhonePe / BHIM</span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">UPI ID / VPA</label>
                  <input
                    type="text"
                    value={vpa}
                    onChange={(e) => setVpa(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
            )}

            {/* Card View */}
            {selectedMethod === 'card' && (
              <div className="space-y-2.5 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Card Number (Demo)</label>
                  <input
                    type="text"
                    disabled
                    value="4111 •••• •••• 1111 (Test Visa)"
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Expiry</label>
                    <input
                      type="text"
                      disabled
                      value="12/28"
                      className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">CVV</label>
                    <input
                      type="password"
                      disabled
                      value="123"
                      className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Netbanking View */}
            {selectedMethod === 'netbanking' && (
              <div className="space-y-2 text-xs">
                <label className="block font-medium text-slate-700">Select Rural / Commercial Bank</label>
                <div className="grid grid-cols-2 gap-2">
                  {['State Bank of India', 'Madhyanchal Gramin Bank', 'HDFC Bank', 'ICICI Bank'].map((b) => (
                    <div
                      key={b}
                      className="p-2 border border-slate-200 rounded-lg hover:border-blue-600 hover:bg-blue-50/30 cursor-pointer font-medium text-slate-700 text-center"
                    >
                      {b}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trigger buttons */}
            <div className="pt-2 space-y-2">
              <button
                onClick={() => handleSimulatePayment(false)}
                className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Simulate Successful Payment (₹{amount})</span>
              </button>

              <button
                onClick={() => handleSimulatePayment(true)}
                className="w-full py-1.5 text-slate-500 hover:text-rose-600 text-[11px] font-medium transition-colors"
              >
                Simulate Payment Failure
              </button>
            </div>

            <div className="text-[10px] text-slate-400 text-center">
              Secured with 256-bit encryption · Sandboxed Razorpay Environment
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
