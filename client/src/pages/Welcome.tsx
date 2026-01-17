import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, HeartPulse, BrainCircuit, Heart } from "lucide-react";
import { motion } from "framer-motion";

export default function Welcome() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-background to-blue-50/50">
      
      {/* Hero Content */}
      <div className="w-full max-w-md space-y-8 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative inline-block"
        >
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
          <HeartPulse className="w-24 h-24 text-primary relative z-10 mx-auto animate-float" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Take Control of Your <br/>
              <span className="text-primary">Health Today</span>
            </h1>
            <p className="text-sm font-semibold text-primary/80 uppercase tracking-widest">
              Preventing Diabetes Before It's Too Late
            </p>
          </div>

          <div className="space-y-4 text-left">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
              <p className="text-sm font-semibold text-red-900 mb-2">🌍 The Global Crisis</p>
              <p className="text-sm text-red-800">Over 400 million people worldwide have diabetes, with 90% living in low-to-middle income countries where healthcare access is limited. In Nigeria, diagnosis rates remain critically low.</p>
            </div>

            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
              <p className="text-sm font-semibold text-orange-900 mb-2">⚠️ The Silent Problem</p>
              <p className="text-sm text-orange-800">Early-stage diabetes has NO symptoms. Many people don't know they have it until serious complications develop—kidney damage, vision loss, heart disease, and amputations.</p>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <p className="text-sm font-semibold text-blue-900 mb-2">💡 The Solution</p>
              <p className="text-sm text-blue-800">Gluco-Bridge uses AI-powered screening and instant glucose monitoring to catch diabetes early, when it's most treatable. Knowledge is prevention.</p>
            </div>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 flex flex-col items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-blue-600" />
            <span className="font-semibold text-sm text-blue-900">Early Detection</span>
            <span className="text-xs text-blue-700">Catch it early</span>
          </div>
          <div className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl border border-indigo-200 flex flex-col items-center gap-2">
            <BrainCircuit className="w-8 h-8 text-indigo-600" />
            <span className="font-semibold text-sm text-indigo-900">AI Insights</span>
            <span className="text-xs text-indigo-700">Personalized guidance</span>
          </div>
        </motion.div>

        {/* Impact Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-3 gap-3 text-center"
        >
          <div className="bg-white p-3 rounded-xl border border-slate-100">
            <p className="text-2xl font-bold text-primary">400M</p>
            <p className="text-xs text-muted-foreground">People affected</p>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-100">
            <p className="text-2xl font-bold text-primary">90%</p>
            <p className="text-xs text-muted-foreground">Undiagnosed in low-income</p>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-100">
            <p className="text-2xl font-bold text-primary">80%</p>
            <p className="text-xs text-muted-foreground">Preventable with early action</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="pt-6 space-y-4"
        >
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-4">
            <p className="text-sm font-semibold text-primary mb-1">⚡ Your potential for change</p>
            <p className="text-xs text-slate-600">Early detection and lifestyle changes can prevent or delay diabetes by up to 80%. It all starts with one step.</p>
          </div>

          <Link href="/screening">
            <Button size="lg" className="w-full text-lg shadow-blue-500/25 font-semibold">
              Start Your Health Journey <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>

          <Link href="/bmi">
            <Button variant="outline" size="lg" className="w-full text-base">
              Calculate Your BMI
            </Button>
          </Link>
          
          <Link href="/health-tips">
            <Button variant="outline" size="lg" className="w-full text-base">
              <Heart className="mr-2 w-5 h-5" />
              Learn Prevention Tips
            </Button>
          </Link>
          
          <p className="mt-4 text-xs text-muted-foreground text-center">
            ✓ Free screening • ✓ Instant insights • ✓ AI guidance • ✓ No sign-up required
          </p>
        </motion.div>
      </div>
    </div>
  );
}
