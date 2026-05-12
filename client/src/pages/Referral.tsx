import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

export default function Referral() {
  const [, navigate] = useLocation();
  const [finding, setFinding] = useState<"labs" | "clinics" | null>(null);
  const [doctorPhone, setDoctorPhone] = useState('');
  const [showWhatsAppInput, setShowWhatsAppInput] = useState(false);

  const openMapsSearch = (query: string, kind: "labs" | "clinics") => {
    setFinding(kind);
    const launch = (coords?: GeolocationCoordinates) => {
      const queryText = coords
        ? `${query} near ${coords.latitude},${coords.longitude}`
        : `${query} near me`;
      window.open(`https://www.google.com/maps/search/${encodeURIComponent(queryText)}`, "_blank", "noopener,noreferrer");
      setFinding(null);
    };
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => launch(pos.coords),
        () => launch(),
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      launch();
    }
  };

  const openWhatsApp = () => {
    if (!doctorPhone) return;
    window.open(`https://wa.me/${doctorPhone}`, "_blank", "noopener,noreferrer");
    setShowWhatsAppInput(false);
    setDoctorPhone('');
  };

  const actionCards = [
    {
      icon: 'science',
      iconBg: 'bg-error-container',
      iconColor: 'text-error',
      badge: 'Urgent',
      badgeClass: 'bg-error-container text-on-error-container',
      title: 'Get Professional Testing',
      description: 'Verify your risk with a certified HbA1c test within 2 weeks. This is not a diagnosis — get professional confirmation.',
      buttonLabel: 'Find Labs Nearby',
      buttonIcon: 'open_in_new',
      buttonClass: 'bg-error text-on-error hover:brightness-110',
      loading: finding === 'labs',
      onClick: () => openMapsSearch("HbA1c testing laboratory", "labs"),
    },
    {
      icon: 'local_hospital',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      badge: 'Recommended',
      badgeClass: 'bg-secondary-container text-on-secondary-container',
      title: 'Find Healthcare Provider',
      description: 'Locate clinics or hospitals nearby for a professional evaluation and follow-up consultation.',
      buttonLabel: 'Find Clinics',
      buttonIcon: 'open_in_new',
      buttonClass: 'border border-primary text-primary bg-surface hover:bg-primary/5',
      loading: finding === 'clinics',
      onClick: () => openMapsSearch("doctor or clinic", "clinics"),
    },
  ];

  const resources = [
    { name: 'Diabetes Association of Nigeria', detail: 'diabetesnigeria.org', icon: 'language' },
    { name: 'NCDC Connect Centre', detail: 'Dial 6232 (24/7)', icon: 'call' },
    { name: 'Emergency Line', detail: 'Dial 112', icon: 'emergency' },
  ];

  return (
    <main className="min-h-screen flex flex-col bg-surface">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[900px] md:max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-lg pb-32 md:pb-stack-lg">

          {/* Back Button */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
            <button
              onClick={() => navigate('/results')}
              className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-6 group"
            >
              <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
              <span className="font-body-sm">Back to Results</span>
            </button>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mb-8 space-y-4"
          >
            <div>
              <h1 className="font-display-xl text-display-xl text-on-surface md:text-primary">Your Action Plan</h1>
              <p className="font-body-base text-on-surface-variant max-w-xl mt-2">
                Next steps to confirm your status and start prevention. Early action makes all the difference.
              </p>
            </div>

            {/* Motivational Banner */}
            <div className="bg-primary text-on-primary p-5 rounded-xl shadow-lg relative overflow-hidden">
              <div className="relative z-10 flex items-start gap-4">
                <div className="w-12 h-12 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-2xl">target</span>
                </div>
                <div>
                  <p className="font-title-md text-title-md mb-1">Your Power to Change</p>
                  <p className="text-body-sm opacity-90">
                    Early action in the next 3 months can change your health trajectory for years. 80% of diabetes cases are preventable.
                  </p>
                </div>
              </div>
              <div className="absolute -right-6 -bottom-6 opacity-10">
                <span className="material-symbols-outlined text-[100px]">trending_up</span>
              </div>
            </div>
          </motion.div>

          {/* Desktop: 2-column grid / Mobile: stacked */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {actionCards.map((card, idx) => (
              <motion.article
                key={card.title}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1 + idx * 0.08 }}
                className="group bg-surface border border-outline-variant/30 rounded-xl p-6 shadow-[0px_4px_20px_rgba(0,92,200,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0px_12px_24px_rgba(0,92,200,0.1)] hover:border-primary/20"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${card.iconBg} ${card.iconColor} transition-colors`}>
                    <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>{card.icon}</span>
                  </div>
                  <span className={`font-label-caps text-label-caps px-3 py-1 rounded-full ${card.badgeClass}`}>
                    {card.badge}
                  </span>
                </div>
                <h3 className="font-title-md text-title-md mb-2 text-on-surface">{card.title}</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">{card.description}</p>
                <button
                  onClick={card.onClick}
                  disabled={card.loading}
                  className={`w-full py-3 rounded-lg font-label-caps text-label-caps flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60 ${card.buttonClass}`}
                >
                  {card.loading ? (
                    <>
                      <span className="material-symbols-outlined text-lg animate-spin">sync</span>
                      Finding...
                    </>
                  ) : (
                    <>
                      {card.buttonLabel}
                      <span className="material-symbols-outlined text-lg">{card.buttonIcon}</span>
                    </>
                  )}
                </button>
              </motion.article>
            ))}
          </div>

          {/* WhatsApp + Lifestyle row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* WhatsApp Card */}
            <motion.article
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.3 }}
              className="bg-surface border border-outline-variant/30 rounded-xl p-6 shadow-[0px_4px_20px_rgba(0,92,200,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0px_12px_24px_rgba(0,92,200,0.1)]"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-green-100 text-green-700">
                  <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>chat</span>
                </div>
                <span className="font-label-caps text-label-caps px-3 py-1 rounded-full bg-green-100 text-green-800">Quick Access</span>
              </div>
              <h3 className="font-title-md text-title-md mb-2 text-on-surface">Chat with Doctor</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">
                Directly message your healthcare provider on WhatsApp for quick consultations.
              </p>

              <AnimatePresence mode="wait">
                {!showWhatsAppInput ? (
                  <motion.button
                    key="trigger"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowWhatsAppInput(true)}
                    className="w-full py-3 rounded-lg font-label-caps text-label-caps border border-green-600 text-green-700 bg-surface hover:bg-green-50 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
                    <span className="material-symbols-outlined text-lg">chat</span>
                    Start WhatsApp Chat
                  </motion.button>
                ) : (
                  <motion.div
                    key="input"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
                    <input
                      type="tel"
                      placeholder="e.g., 2348012345678 (with country code)"
                      value={doctorPhone}
                      onChange={(e) => setDoctorPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-outline focus:ring-2 focus:ring-green-500 focus:border-transparent bg-surface-container-lowest text-on-surface text-body-sm outline-none transition-all"
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={openWhatsApp}
                        disabled={!doctorPhone}
                        className="flex-1 py-2.5 rounded-lg font-label-caps text-label-caps bg-green-600 text-white hover:bg-green-700 transition-all active:scale-[0.98] disabled:opacity-50"
                      >
                        Open Chat
                      </button>
                      <button
                        onClick={() => setShowWhatsAppInput(false)}
                        className="flex-1 py-2.5 rounded-lg font-label-caps text-label-caps border border-outline text-on-surface hover:bg-surface-container transition-all active:scale-[0.98]"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.article>

            {/* Lifestyle Changes Card */}
            <motion.article
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.38 }}
              className="group bg-surface border border-outline-variant/30 rounded-xl p-6 shadow-[0px_4px_20px_rgba(0,92,200,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0px_12px_24px_rgba(0,92,200,0.1)]"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-primary/5 text-primary transition-colors group-hover:bg-primary group-hover:text-on-primary">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: '22px' }}>fitness_center</span>
                </div>
                <span className="font-label-caps text-label-caps px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container">Prevention</span>
              </div>
              <h3 className="font-title-md text-title-md mb-2 text-on-surface">Lifestyle Changes</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
                80% of diabetes cases are preventable with the right habits.
              </p>
              <ul className="space-y-2.5 mb-6 opacity-85 group-hover:opacity-100 transition-opacity">
                {['150 mins moderate exercise weekly', 'Reduce sugar and refined carbs', 'Lose 5-10% of body weight'].map(tip => (
                  <li key={tip} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                    <span className="text-body-sm text-on-surface-variant">{tip}</span>
                  </li>
                ))}
              </ul>
              <Link href="/health-tips">
                <button className="w-full py-3 rounded-lg font-label-caps text-label-caps border border-primary text-primary bg-surface hover:bg-primary/5 flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
                  Get Prevention Tips
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </button>
              </Link>
            </motion.article>
          </div>

          {/* Support Resources */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.45 }}
            className="mb-8"
          >
            <h4 className="font-label-caps text-label-caps text-on-surface-variant mb-4">SUPPORT RESOURCES</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {resources.map((r) => (
                <div
                  key={r.name}
                  className="bg-surface border border-outline-variant/30 rounded-xl p-4 flex items-center gap-4 shadow-[0px_4px_20px_rgba(0,92,200,0.03)] hover:border-primary/20 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center text-on-secondary-container flex-shrink-0">
                    <span className="material-symbols-outlined text-lg">{r.icon}</span>
                  </div>
                  <div>
                    <p className="font-body-sm font-semibold text-on-surface">{r.name}</p>
                    <p className="text-body-sm text-on-surface-variant">{r.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, delay: 0.5 }}
            className="bg-primary-container/10 border border-primary/10 rounded-xl p-4 flex items-start gap-4 mb-8"
          >
            <span className="material-symbols-outlined text-primary text-xl mt-0.5 flex-shrink-0">info</span>
            <p className="text-body-sm text-on-surface-variant">
              <strong className="text-on-surface">Medical Disclaimer:</strong> Gluco-Bridge is for educational purposes only, not medical diagnosis. Always consult licensed healthcare professionals for diagnosis and treatment.
            </p>
          </motion.div>

          {/* Bottom CTA — Back to Results */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.55 }}
            className="md:hidden fixed bottom-0 left-0 right-0 bg-surface/80 backdrop-blur-sm border-t border-outline-variant/30 p-4"
          >
            <button
              onClick={() => navigate('/results')}
              className="w-full py-3 bg-primary text-on-primary rounded-lg font-title-md font-semibold shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Back to Results
            </button>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
