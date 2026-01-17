import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Phone, Calendar, ArrowLeft, ExternalLink, Loader2, MessageCircle } from "lucide-react";

export default function Referral() {
  const [finding, setFinding] = useState<"labs" | "clinics" | null>(null);
  const [doctorPhone, setDoctorPhone] = useState('');
  const [showWhatsAppInput, setShowWhatsAppInput] = useState(false);

  // Open Google Maps search, using geolocation when available
  const openMapsSearch = (query: string, kind: "labs" | "clinics") => {
    setFinding(kind);

    const launch = (coords?: GeolocationCoordinates) => {
      const queryText = coords
        ? `${query} near ${coords.latitude},${coords.longitude}`
        : `${query} near me`;
      const url = `https://www.google.com/maps/search/${encodeURIComponent(queryText)}`;
      window.open(url, "_blank", "noopener,noreferrer");
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

  // Open WhatsApp chat
  const openWhatsApp = () => {
    if (!doctorPhone) {
      alert('Please enter the doctor\'s phone number (without +, with country code)');
      return;
    }
    // Format: https://wa.me/PHONENUMBER
    const url = `https://wa.me/${doctorPhone}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setShowWhatsAppInput(false);
    setDoctorPhone('');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-6 max-w-md pb-20">
        <Link href="/results">
          <Button variant="ghost" className="mb-4 -ml-2 text-muted-foreground h-9">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Results
          </Button>
        </Link>

        <div className="mb-6 space-y-2">
          <h1 className="text-2xl font-bold">Your Action Plan</h1>
          <p className="text-sm text-muted-foreground">
            Next steps to confirm your status and start prevention.
          </p>
          
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/30 rounded-lg p-3">
            <p className="text-xs font-bold text-primary mb-1">🎯 Your Power to Change</p>
            <p className="text-xs text-slate-700">
              Early action in the next 3 months can change your health trajectory for years.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Urgent Action */}
          <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-2xl p-4 border-2 border-red-200">
            <div className="w-10 h-10 bg-red-200 rounded-lg flex items-center justify-center mb-3 text-red-700">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="font-bold mb-1 text-red-900">Get Professional Testing</h3>
            <p className="text-xs text-red-800 mb-3">
              Verify your risk with a certified HbA1c test within 2 weeks. This is not a diagnosis—get professional confirmation.
            </p>
            <Button
              className="w-full bg-red-600 hover:bg-red-700 h-10 text-sm"
              onClick={() => openMapsSearch("HbA1c testing laboratory", "labs")}
              disabled={finding === "labs"}
            >
              {finding === "labs" ? (
                <>
                  <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                  Finding labs...
                </>
              ) : (
                <>
                  Find Labs <ExternalLink className="w-3 h-3 ml-2" />
                </>
              )}
            </Button>
          </div>

          {/* Healthcare Provider */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-3 text-primary">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-bold mb-1">Find Healthcare Provider</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Locate clinics or hospitals nearby for evaluation.
            </p>
            <Button
              variant="outline"
              className="w-full justify-center h-10 text-sm"
              onClick={() => openMapsSearch("doctor or clinic", "clinics")}
              disabled={finding === "clinics"}
            >
              {finding === "clinics" ? (
                <>
                  <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                  Finding...
                </>
              ) : (
                <>
                  Find Clinics <ExternalLink className="w-3 h-3 ml-2" />
                </>
              )}
            </Button>
          </div>

          {/* WhatsApp Consultation */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-3 text-green-600">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h3 className="font-bold mb-1">Chat with Doctor on WhatsApp</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Directly message your healthcare provider for quick consultations.
            </p>
            {!showWhatsAppInput ? (
              <Button
                variant="outline"
                className="w-full justify-center h-10 text-sm"
                onClick={() => setShowWhatsAppInput(true)}
              >
                <MessageCircle className="w-3 h-3 mr-2" />
                Start WhatsApp Chat
              </Button>
            ) : (
              <div className="space-y-2">
                <Input
                  type="tel"
                  placeholder="e.g., 2348012345678 (with country code)"
                  value={doctorPhone}
                  onChange={(e) => setDoctorPhone(e.target.value)}
                  className="text-xs h-9"
                />
                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700 h-9 text-xs"
                    onClick={openWhatsApp}
                  >
                    Open Chat
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 h-9 text-xs"
                    onClick={() => setShowWhatsAppInput(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Lifestyle Changes */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-3 text-green-600">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="font-bold mb-1">Start Lifestyle Changes Today</h3>
            <p className="text-xs text-muted-foreground mb-2">
              80% of diabetes cases are preventable.
            </p>
            <ul className="text-xs text-slate-700 space-y-1 mb-3">
              <li>✓ 150 mins moderate exercise weekly</li>
              <li>✓ Reduce sugar and refined carbs</li>
              <li>✓ Lose 5-10% of body weight</li>
            </ul>
            <Link href="/health-tips">
              <Button variant="outline" className="w-full justify-center h-10 text-sm">
                Get Prevention Tips <ExternalLink className="w-3 h-3 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Helplines */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center mb-3 text-orange-500">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-bold mb-3">Support Resources</h3>
            <div className="space-y-2 text-xs">
              <div className="p-2 bg-slate-50 rounded-lg">
                <p className="font-semibold text-slate-900">Diabetes Association of Nigeria</p>
                <p className="text-slate-700">diabetesnigeria.org</p>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg">
                <p className="font-semibold text-slate-900">NCDC Connect Centre</p>
                <p className="text-slate-700">Dial 6232 (24/7)</p>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg">
                <p className="font-semibold text-slate-900">Emergency Line</p>
                <p className="text-slate-700">Dial 112</p>
              </div>
            </div>
          </div>

          {/* Medical Disclaimer */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs font-bold text-blue-900 mb-1">⚕️ Medical Disclaimer</p>
            <p className="text-xs text-blue-800">
              Gluco-Bridge is educational only, not medical diagnosis. Consult licensed healthcare professionals for diagnosis and treatment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
