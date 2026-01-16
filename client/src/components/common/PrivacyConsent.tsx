import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, Lock, Eye, Share2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface PrivacyConsentProps {
  onConsent: (accepted: boolean) => void;
  autoHide?: boolean;
}

export function PrivacyConsent({ onConsent, autoHide = false }: PrivacyConsentProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [acceptedDataCollection, setAcceptedDataCollection] = useState(false);
  const [acceptedAnalytics, setAcceptedAnalytics] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem('glucobridge_privacy_consent');
    if (hasConsented) {
      setIsOpen(false);
    }
  }, []);

  const handleAccept = () => {
    if (acceptedDataCollection) {
      const consentData = {
        timestamp: new Date().toISOString(),
        version: '1.0',
        dataCollection: acceptedDataCollection,
        analytics: acceptedAnalytics,
      };
      localStorage.setItem('glucobridge_privacy_consent', JSON.stringify(consentData));
      setIsOpen(false);
      onConsent(true);
    }
  };

  const handleDecline = () => {
    // Allow basic app usage but no data collection
    localStorage.setItem(
      'glucobridge_privacy_consent',
      JSON.stringify({
        timestamp: new Date().toISOString(),
        version: '1.0',
        dataCollection: false,
        analytics: false,
      })
    );
    setIsOpen(false);
    onConsent(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Card className="border-2 border-blue-200 shadow-lg">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 border-b border-blue-200">
            <div className="flex items-center gap-3">
              <Lock className="w-6 h-6 text-blue-600" />
              <div>
                <h2 className="text-xl font-bold text-slate-900">Your Privacy Matters</h2>
                <p className="text-sm text-slate-600">Transparent data practices</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
            <p className="text-sm text-slate-700 leading-relaxed">
              Gluco-Bridge is committed to protecting your health data with strict
              confidentiality and transparent practices. We only collect data necessary to
              provide you with personalized health insights.
            </p>

            {/* Consent Checkboxes */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="flex items-start gap-3 cursor-pointer group">
                <Checkbox
                  checked={acceptedDataCollection}
                  onCheckedChange={(checked) => setAcceptedDataCollection(checked as boolean)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <p className="font-medium text-sm text-slate-900">
                    I agree to data collection for health analysis
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    We collect glucose readings, screening results, and health metrics to provide
                    personalized insights and AI assistance.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox
                  checked={acceptedAnalytics}
                  onCheckedChange={(checked) => setAcceptedAnalytics(checked as boolean)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <p className="font-medium text-sm text-slate-900">
                    Allow anonymized analytics
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    Help us improve the app by sharing anonymized usage patterns.
                  </p>
                </div>
              </label>
            </div>

            {/* What We Collect */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full text-left text-sm font-medium text-blue-600 hover:text-blue-700 py-2"
            >
              {showDetails ? '▼' : '▶'} What data do we collect?
            </button>

            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-2 text-xs text-slate-600 bg-blue-50 p-3 rounded-lg border border-blue-100"
              >
                <div className="flex gap-2">
                  <Eye className="w-4 h-4 shrink-0 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900">Health Data</p>
                    <p>Glucose readings, test types, health screening responses</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Share2 className="w-4 h-4 shrink-0 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900">Usage Data</p>
                    <p>App features used, timestamps, device type (anonymized)</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Lock className="w-4 h-4 shrink-0 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900">No Sharing</p>
                    <p>We never sell your data or share it with third parties</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Important Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <p className="text-xs text-amber-800">
                Gluco-Bridge is for educational purposes only. Always consult healthcare
                professionals for medical decisions.
              </p>
            </div>

            {/* Privacy Info */}
            <p className="text-xs text-slate-500 text-center">
              See our full{' '}
              <a href="#privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>{' '}
              for details
            </p>
          </div>

          {/* Actions */}
          <div className="p-6 bg-slate-50 border-t border-slate-200 flex gap-3">
            <Button
              variant="outline"
              onClick={handleDecline}
              className="flex-1"
            >
              Decline
            </Button>
            <Button
              onClick={handleAccept}
              disabled={!acceptedDataCollection}
              className="flex-1"
            >
              Accept & Continue
            </Button>
          </div>

          {/* Footer Note */}
          <div className="px-6 py-3 bg-blue-50 text-xs text-slate-600 text-center border-t border-slate-200">
            You can update your preferences anytime in settings
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

/**
 * Hook to check if user has given consent
 */
export function usePrivacyConsent() {
  const [hasConsent, setHasConsent] = useState<boolean | null>(null);

  useEffect(() => {
    const consent = localStorage.getItem('glucobridge_privacy_consent');
    if (consent) {
      try {
        const parsed = JSON.parse(consent);
        setHasConsent(parsed.dataCollection === true);
      } catch {
        setHasConsent(false);
      }
    } else {
      setHasConsent(null); // Consent not given yet
    }
  }, []);

  const revokeConsent = () => {
    localStorage.removeItem('glucobridge_privacy_consent');
    setHasConsent(null);
  };

  return { hasConsent, revokeConsent };
}
