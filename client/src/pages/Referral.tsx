import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Calendar, ArrowLeft, ExternalLink } from "lucide-react";

export default function Referral() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-6 py-8 max-w-md">
        <Link href="/results">
          <Button variant="ghost" className="mb-6 -ml-4 text-muted-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Results
          </Button>
        </Link>

        <div className="mb-8 space-y-4">
          <h1 className="text-3xl font-bold">Your Action Plan</h1>
          <p className="text-muted-foreground">
            The next 30 days are critical. Here's what you should do.
          </p>
          
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/30 rounded-2xl p-4">
            <p className="text-sm font-bold text-primary mb-1">🎯 Your Power to Change</p>
            <p className="text-sm text-slate-700">
              What you do in the next 3 months can determine your health trajectory for years. Early action is the most effective prevention tool.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Urgent Action */}
          <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-3xl p-6 border-2 border-red-200">
            <div className="w-12 h-12 bg-red-200 rounded-2xl flex items-center justify-center mb-4 text-red-700">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-red-900">Urgent: Get Professional Testing</h3>
            <p className="text-sm text-red-800 mb-4">
              Verify your risk with a certified HbA1c test from a lab or clinic within 2 weeks. This is not a medical diagnosis—get professional confirmation.
            </p>
            <Button className="w-full bg-red-600 hover:bg-red-700">
              Find Certified Labs <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Action Card 2 */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 text-primary">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Consult a Healthcare Provider</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Locate nearby clinics or hospitals for a comprehensive evaluation and treatment plan.
            </p>
            <Button variant="outline" className="w-full justify-between group">
              Find Healthcare Facilities <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
            </Button>
          </div>

          {/* Lifestyle Changes */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mb-4 text-green-600">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Start Lifestyle Changes Today</h3>
            <p className="text-sm text-muted-foreground mb-4">
              80% of diabetes cases are preventable with diet, exercise, and weight management. Don't wait for a diagnosis.
            </p>
            <ul className="text-sm text-slate-700 space-y-2 mb-4">
              <li>✓ 150 mins moderate exercise per week</li>
              <li>✓ Reduce sugar and refined carbs</li>
              <li>✓ Lose 5-10% of body weight</li>
            </ul>
            <Link href="/health-tips">
              <Button variant="outline" className="w-full justify-between group">
                Get Prevention Tips <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
              </Button>
            </Link>
          </div>

           {/* Helplines */}
           <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center mb-4 text-orange-500">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Get Support</h3>
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="font-semibold text-sm text-slate-900">WHO Diabetes Resources</p>
                <p className="text-xs text-slate-700 mt-1">www.who.int/diabetes</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="font-semibold text-sm text-slate-900">International Diabetes Federation</p>
                <p className="text-xs text-slate-700 mt-1">www.idf.org</p>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <p className="text-xs font-bold text-blue-900 mb-2">⚕️ Medical Disclaimer</p>
            <p className="text-xs text-blue-800">
              Gluco-Bridge is an educational tool, not a medical diagnosis. Your results are estimates based on general risk factors. Always consult licensed healthcare professionals for diagnosis, treatment, and medical decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
