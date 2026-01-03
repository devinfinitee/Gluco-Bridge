import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/common/Header";
import { MapPin, Phone, Calendar, ArrowLeft, ExternalLink } from "lucide-react";

export default function Referral() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="container mx-auto px-6 py-8 max-w-md">
        <Link href="/results">
          <Button variant="ghost" className="mb-6 -ml-4 text-muted-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Results
          </Button>
        </Link>

        <h1 className="text-2xl font-bold mb-2">Recommended Next Steps</h1>
        <p className="text-muted-foreground mb-8">
          Based on your screening, here are some actions you can take.
        </p>

        <div className="space-y-6">
          {/* Action Card 1 */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mb-4 text-green-600">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Schedule a Check-up</h3>
            <p className="text-sm text-muted-foreground mb-4">
              It's always good to verify self-tests with a professional lab test (HbA1c).
            </p>
            <Button variant="outline" className="w-full justify-between group">
              Find Doctors <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
            </Button>
          </div>

          {/* Action Card 2 */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 text-primary">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Find a Local Clinic</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Locate nearby health centers for a comprehensive diabetes screening.
            </p>
            <Button variant="outline" className="w-full justify-between group">
              Search Maps <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
            </Button>
          </div>

           {/* Helplines */}
           <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center mb-4 text-orange-500">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Helplines</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <span className="font-medium text-sm">Diabetes Association</span>
                <span className="text-primary font-bold">1-800-DIABETES</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
