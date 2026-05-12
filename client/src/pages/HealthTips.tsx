import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';

export default function HealthTips() {
  const [, navigate] = useLocation();
  const [expandedIndex, setExpandedIndex] = useState(0);

  const healthCards = [
    {
      icon: 'favorite',
      title: 'Diabetes & Heart Disease',
      subtitle: 'The link between high sugar and vessel damage',
      description: 'High blood sugar can damage blood vessels and nerves that control your heart. People with diabetes are twice as likely to develop heart disease or stroke.',
      tips: [
        'Keep blood sugar levels in target range',
        'Monitor blood pressure regularly',
        'Maintain healthy cholesterol levels',
        'Exercise for at least 30 minutes daily'
      ]
    },
    {
      icon: 'fitness_center',
      title: 'Hypertension & Sugar',
      subtitle: 'Managing dual risks',
      description: 'High blood pressure and high blood sugar often occur together, creating a dangerous combination that increases your risk of serious health complications.',
      tips: [
        'Reduce sodium intake (less than 2,300mg daily)',
        'Limit refined carbohydrates and sugars',
        'Stay physically active',
        'Take medications as prescribed'
      ]
    },
    {
      icon: 'scale',
      title: 'Obesity & Insulin Resistance',
      subtitle: 'Breaking the cycle',
      description: 'Excess body weight, especially around the abdomen, can make your body resistant to insulin, leading to higher blood sugar levels and increased diabetes risk.',
      tips: [
        'Aim for gradual weight loss (1-2 lbs per week)',
        'Focus on whole foods and vegetables',
        'Practice portion control',
        'Get adequate sleep (7-9 hours)'
      ]
    },
    {
      icon: 'smoking_rooms',
      title: 'Smoking & Vascular Risk',
      subtitle: 'Protect your blood vessels',
      description: 'Smoking damages blood vessels, raises blood sugar levels, and significantly increases the risk of diabetes complications including heart disease and stroke.',
      tips: [
        'Seek help to quit smoking immediately',
        'Avoid secondhand smoke exposure',
        'Join a support group or counseling',
        'Consider nicotine replacement therapy'
      ]
    }
  ];

  return (
    <main className="h-screen flex flex-col bg-surface">
      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[900px] md:max-w-container-max mx-auto w-full px-margin-mobile py-stack-lg pb-32 md:pb-stack-lg">
          {/* Desktop/Web View */}
          <section className="hidden md:block">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="mb-stack-lg space-y-stack-sm"
            >
              <h2 className="font-display-xl text-display-xl text-primary">Health Tips & Wellness</h2>
              <p className="font-body-base text-body-base text-on-surface-variant max-w-2xl">
                Practical strategies that help you make better daily glucose decisions and build healthier routines over time.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {healthCards.slice(0, 3).map((card, idx) => (
                <motion.article
                  key={card.title}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.06 }}
                  className="group relative bg-surface border border-outline-variant/30 rounded-xl p-6 shadow-[0px_4px_20px_rgba(0,92,200,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0px_12px_24px_rgba(0,92,200,0.1)] hover:border-primary/20"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-lg bg-primary/5 text-primary transition-colors group-hover:bg-primary group-hover:text-on-primary">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: '22px' }}>{card.icon}</span>
                    </div>
                    <span className="font-label-caps text-label-caps px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container">Daily Guide</span>
                  </div>
                  <h3 className="font-title-md text-title-md mb-2 text-on-surface">{card.title}</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">{card.description}</p>
                  <ul className="space-y-3 opacity-85 group-hover:opacity-100 transition-opacity">
                    {card.tips.slice(0, 3).map((tip) => (
                      <li key={tip} className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                        <span className="text-body-sm text-on-surface-variant">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </motion.article>
              ))}

              <motion.article
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.2 }}
                className="group relative bg-primary-container rounded-xl p-6 shadow-[0px_4px_20px_rgba(0,92,200,0.05)] overflow-hidden"
              >
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                <div className="relative z-10">
                  <h3 className="font-title-md text-title-md mb-4 text-on-primary-container">Interactive Learning</h3>
                  <div className="aspect-video bg-surface/20 rounded-lg backdrop-blur-sm mb-4 border border-white/10 overflow-hidden">
                    <img
                      alt="Health education"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDG-iHQYXia5l1Q_xUoMpth_rl4tC2lvQR5xr-Lj2G9jfSH_bqD5B9UtfEQI5P95exm1Z6hHrTMXIk1hRJ6E-3PWVOCBtPFQKkSNyrvMB0unwniUG5TwgVxurff2Uvp-kTSkxE-EiKL6J7FP3igt-ACLpcbX8s3pR94H0fy7HdN6PQw-XPJcxVp6j7hk9-3N9AGmKK7WwZrTheaeUkTk5V2PqdNR_-8u1aKhfsyzn_SCl61fvvGMN351grAh5JNPrbnKsTQRT0g6Q"
                    />
                  </div>
                  <button className="w-full py-3 bg-white text-primary font-label-caps text-label-caps rounded-lg hover:bg-primary-fixed transition-colors">
                    Start Wellness Module
                  </button>
                </div>
              </motion.article>
            </div>

            <div className="mt-stack-lg border-t border-outline-variant/30 pt-stack-md">
              <h4 className="font-label-caps text-label-caps text-on-surface-variant mb-4">Recommended Resources</h4>
              <div className="flex flex-wrap gap-4">
                <button className="flex items-center gap-2 p-3 bg-surface border border-outline-variant/20 rounded-lg hover:border-primary transition-colors">
                  <span className="material-symbols-outlined text-primary">menu_book</span>
                  <span className="text-body-sm font-semibold">Glucose Basics Guide</span>
                </button>
                <button className="flex items-center gap-2 p-3 bg-surface border border-outline-variant/20 rounded-lg hover:border-primary transition-colors">
                  <span className="material-symbols-outlined text-primary">play_circle</span>
                  <span className="text-body-sm font-semibold">Exercise Video Plan</span>
                </button>
                <button className="flex items-center gap-2 p-3 bg-surface border border-outline-variant/20 rounded-lg hover:border-primary transition-colors">
                  <span className="material-symbols-outlined text-primary">contact_support</span>
                  <span className="text-body-sm font-semibold">Community FAQ</span>
                </button>
              </div>
            </div>
          </section>

          {/* Mobile View */}
          <section className="md:hidden">
            {/* Header */}
            <div className="mb-6 mt-6">
              <h1 className="text-2xl font-bold mb-1">Health Tips & Wellness</h1>
              <p className="text-sm text-on-surface-variant">
                Learn about diabetes prevention and management strategies
              </p>
            </div>

            {/* Hero Section - The Cost of Diabetes */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-outline-variant/30 mb-4"
            >
              <h2 className="text-xl font-bold text-primary mb-2">The Cost of Diabetes</h2>
              <p className="text-sm font-semibold text-on-surface mb-3">And How to Prevent It</p>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
                Diabetes complications affect millions—kidney failure, blindness, amputations, heart disease. But 80% of cases are preventable with early detection and lifestyle changes.
              </p>
              
              {/* Stats Section */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-red-600">1.5M</p>
                  <p className="text-xs text-on-surface-variant">Deaths annually</p>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-orange-600">50%</p>
                  <p className="text-xs text-on-surface-variant">Don't know</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-green-600">80%</p>
                  <p className="text-xs text-on-surface-variant">Preventable</p>
                </div>
              </div>
            </motion.div>

            {/* Health Cards Accordion */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="space-y-3 mb-4"
            >
              {healthCards.map((card, idx) => (
                <motion.article
                  key={card.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + idx * 0.04 }}
                  className="bg-white border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm"
                >
                  <button
                    onClick={() => setExpandedIndex(expandedIndex === idx ? -1 : idx)}
                    className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors text-left"
                    aria-expanded={expandedIndex === idx}
                    aria-controls={`health-card-${idx}`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-primary text-[20px]">{card.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-sm text-on-surface">{card.title}</h3>
                      <p className="text-xs text-on-surface-variant mt-0.5">{card.subtitle}</p>
                    </div>
                    <span
                      className="material-symbols-outlined text-outline-variant shrink-0 transition-transform duration-300"
                      style={{ transform: expandedIndex === idx ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      aria-hidden="true"
                    >
                      expand_more
                    </span>
                  </button>

                  {expandedIndex === idx && (
                    <motion.div
                      id={`health-card-${idx}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="px-4 pb-4 border-t border-outline-variant/20 pt-3 bg-slate-50"
                    >
                      <p className="text-sm text-on-surface-variant leading-relaxed mb-4">{card.description}</p>
                      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">Key Actions</p>
                      <ul className="space-y-2.5">
                        {card.tips.map((tip, tipIdx) => (
                          <li key={tipIdx} className="flex items-start gap-2.5">
                            <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5" aria-hidden="true">check_circle</span>
                            <span className="text-sm text-on-surface-variant leading-relaxed">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </motion.article>
              ))}
            </motion.div>

            {/* Good News Section */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.35 }}
              className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-4"
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="material-symbols-outlined text-green-600 text-[24px] mt-0.5" aria-hidden="true">celebration</span>
                <h3 className="font-bold text-sm text-green-900">The Good News: Prevention Works</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-green-600 text-[16px] shrink-0 mt-0.5" aria-hidden="true">check_circle</span>
                  <div>
                    <p className="text-xs font-bold text-green-900">Early Detection</p>
                    <p className="text-xs text-green-800">A simple screening can identify risk years before symptoms appear.</p>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-green-600 text-[16px] shrink-0 mt-0.5" aria-hidden="true">check_circle</span>
                  <div>
                    <p className="text-xs font-bold text-green-900">Lifestyle Changes</p>
                    <p className="text-xs text-green-800">Diet modifications and exercise can prevent or delay diabetes onset by up to 80%.</p>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-green-600 text-[16px] shrink-0 mt-0.5" aria-hidden="true">check_circle</span>
                  <div>
                    <p className="text-xs font-bold text-green-900">Affordable</p>
                    <p className="text-xs text-green-800">Prevention is far cheaper than managing complications like dialysis or amputation.</p>
                  </div>
                </li>
              </ul>
            </motion.div>

            {/* Disclaimer */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.4 }}
              className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-24"
            >
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Medical Disclaimer:</strong> These health tips are for educational purposes only. Always consult with your healthcare provider before making any changes to your diet, exercise routine, or medication regimen. Regular check-ups and professional medical advice are essential for managing your health.
              </p>
            </motion.div>

            {/* CTA Buttons - Fixed Bottom */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-outline-variant/20 p-4 max-w-md mx-auto">
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => navigate('/screening')}
                  className="w-full py-3 px-4 bg-primary text-on-primary rounded-lg font-bold text-sm hover:shadow-lg transition-all active:scale-95"
                >
                  Start Risk Screening
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="w-full py-3 px-4 border-2 border-primary text-primary rounded-lg font-bold text-sm hover:bg-primary-container transition-all active:scale-95"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Bottom Navigation removed as per request for mobile Health Tips view */}
    </main>
  );
}
