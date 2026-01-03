import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, HeartPulse, BrainCircuit } from "lucide-react";
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
          className="space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Understand Your <br/>
            <span className="text-primary">Blood Sugar</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            A simple, educational tool to help you screen for diabetes risk and understand your glucose levels.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-blue-500" />
            <span className="font-semibold text-sm">Risk Screening</span>
          </div>
          <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center gap-2">
            <BrainCircuit className="w-8 h-8 text-indigo-500" />
            <span className="font-semibold text-sm">AI Analysis</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="pt-8"
        >
          <Link href="/screening">
            <Button size="lg" className="w-full text-lg shadow-blue-500/25">
              Get Started <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <p className="mt-4 text-xs text-muted-foreground">
            For educational purposes only. Not medical advice.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
