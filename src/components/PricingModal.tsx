
import React, { useState } from 'react';
import { useStore, PLANS } from '@/contexts/Store';
import { XMarkIcon, CheckIcon, StarIcon } from '@heroicons/react/24/outline';
import { UserRole } from '@/types';

const PricingModal: React.FC = () => {
  const { isPricingOpen, togglePricingModal, role, user, upgradeSubscription } = useStore();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  if (!isPricingOpen) return null;

  // Don't show pricing for guests
  if (role === UserRole.GUEST) return null;

  const currentPlans = PLANS[role] || [];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={() => togglePricingModal(false)}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-5xl bg-surface/50 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-pulse-slow">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center p-6 border-b border-white/10 gap-6 md:gap-0">
          <div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
              Planes & Precios
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Elige la potencia adecuada para tu {role === UserRole.EMPLOYEE ? 'aventura' : role === UserRole.EMPLOYER ? 'organización' : 'negocio'}.
            </p>
          </div>

          {/* Billing Cycle Toggle */}
          <div className="flex items-center gap-3 bg-black/40 rounded-full p-1 border border-white/5">
              <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      billingCycle === 'monthly' 
                      ? 'bg-surface text-white shadow-md' 
                      : 'text-gray-400 hover:text-white'
                  }`}
              >
                  Mensual
              </button>
              <button
                  onClick={() => setBillingCycle('annual')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                      billingCycle === 'annual' 
                      ? 'bg-primary text-black shadow-md' 
                      : 'text-gray-400 hover:text-white'
                  }`}
              >
                  Anual
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                      billingCycle === 'annual' 
                      ? 'bg-black/20 border-black/10' 
                      : 'bg-primary/20 border-primary/20 text-primary'
                  }`}>
                      -17%
                  </span>
              </button>
          </div>

          <button 
            onClick={() => togglePricingModal(false)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors absolute top-4 right-4 md:static"
          >
            <XMarkIcon className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Plans Grid */}
        <div className="overflow-y-auto p-8">
          <div className={`grid gap-6 ${currentPlans.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2 max-w-4xl mx-auto'}`}>
            {currentPlans.map((plan) => {
              const isCurrent = user.subscriptionTier === plan.id;
              const isRecommended = plan.recommended;

              // Calculate Display Price
              let displayPrice = "Gratis";
              let subtext = "";

              if (plan.isCustom) {
                  displayPrice = "Custom";
                  subtext = "Cotización a medida";
              } else if (plan.priceMonthly > 0 || plan.priceAnnual > 0) {
                  if (billingCycle === 'monthly') {
                      displayPrice = `$${plan.priceMonthly}`;
                      subtext = "/ mes";
                  } else {
                      displayPrice = `$${(plan.priceAnnual / 12).toFixed(2)}`;
                      subtext = `/ mes (facturado $${plan.priceAnnual} anual)`;
                  }
              }

              return (
                <div 
                  key={plan.id}
                  className={`relative rounded-2xl p-6 flex flex-col transition-all duration-300 hover:-translate-y-2 ${
                    isRecommended 
                      ? 'bg-surface/80 border-2 border-accent shadow-[0_0_30px_rgba(250,204,21,0.15)]' 
                      : 'bg-base/60 border border-white/10 hover:border-white/30'
                  }`}
                >
                  {isRecommended && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                      <StarIcon className="w-3 h-3" /> RECOMENDADO
                    </div>
                  )}

                  {/* Plan Header */}
                  <div className="mb-6 text-center">
                    <h3 className={`text-xl font-bold ${isRecommended ? 'text-accent' : 'text-white'}`}>
                      {plan.name}
                    </h3>
                    <div className="mt-4 mb-1 flex items-end justify-center gap-1">
                      <span className="text-4xl font-bold text-white">{displayPrice}</span>
                      {!plan.isCustom && plan.priceMonthly > 0 && (
                          <span className="text-sm text-gray-400 mb-1">{plan.priceUnit || ''}</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">{subtext}</p>
                    <p className="text-xs text-gray-500 italic mt-2">{plan.slogan}</p>
                  </div>

                  {/* Divider */}
                  <div className="h-px w-full bg-white/10 mb-6" />

                  {/* Features */}
                  <ul className="space-y-3 flex-1 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm">
                        <div className={`mt-0.5 p-0.5 rounded-full flex-shrink-0 ${feature.included ? 'bg-primary/20 text-primary' : 'bg-gray-700/30 text-gray-500'}`}>
                           {feature.included ? <CheckIcon className="w-3 h-3" /> : <XMarkIcon className="w-3 h-3" />}
                        </div>
                        <span className={`${
                          !feature.included ? 'text-gray-500 line-through decoration-gray-700' : 
                          feature.highlight ? 'text-white font-medium' : 'text-gray-300'
                        }`}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    disabled={isCurrent}
                    onClick={() => upgradeSubscription(plan.id)}
                    className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                      isCurrent 
                        ? 'bg-white/5 text-gray-500 cursor-default border border-white/5'
                        : isRecommended
                          ? 'bg-accent text-black hover:bg-yellow-300 hover:shadow-[0_0_20px_rgba(250,204,21,0.4)]'
                          : 'bg-white text-black hover:bg-gray-200'
                    }`}
                  >
                    {isCurrent ? 'Plan Actual' : plan.ctaText}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;
