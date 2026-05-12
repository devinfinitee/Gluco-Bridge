import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Welcome() {
  return (
    <main className="max-w-[900px] mx-auto px-4 md:px-8 pt-16 pb-32">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Column: Hero Content */}
        <div className="flex flex-col gap-8">
          <div className="space-y-4">
            {/* Badge */}
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-block px-3 py-1 rounded-full bg-secondary-container text-on-secondary-fixed-variant font-label-caps text-[10px] tracking-widest uppercase"
            >
              Precision Health Monitoring
            </motion.span>

            {/* Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display-xl text-display-xl text-on-surface"
            >
              Take Control of Your Health Today
            </motion.h1>

            {/* Description */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-body-base text-body-base text-on-surface-variant max-w-md"
            >
              Bridge the gap between data and action. Our AI-powered screening provides real-time insights into your glucose levels, risk factors, and metabolic health.
            </motion.p>
          </div>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href="/screening">
              <Button 
                className="bg-primary text-on-primary font-label-caps text-label-caps px-8 py-4 rounded-xl shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/bmi">
              <Button 
                variant="outline"
                className="border border-outline text-primary font-label-caps text-label-caps px-8 py-4 rounded-xl hover:bg-surface-container transition-all flex items-center justify-center"
              >
                Calculate BMI
              </Button>
            </Link>
          </motion.div>

          {/* Trust Metrics */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center gap-4 py-4 border-t border-outline-variant/30"
          >
            <div className="flex -space-x-3">
              <div className="w-8 h-8 rounded-full border-2 border-background bg-surface-container overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-primary/30 to-secondary/30"></div>
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-background bg-surface-container overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-secondary/30 to-primary/30"></div>
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-background bg-surface-container-high flex items-center justify-center text-[10px] font-bold text-primary">
                +2k
              </div>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Trusted by thousands managing diabetes.</p>
          </motion.div>
        </div>

        {/* Right Column: Bento Grid (Desktop Only) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="relative hidden lg:block"
        >
          {/* Floating Heart Icon */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-20">
            <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center transition-transform hover:scale-110">
              <span className="text-4xl">❤️</span>
            </div>
          </div>

          {/* 2x2 Bento Grid */}
          <div className="grid grid-cols-2 gap-4 pt-12">
            {/* High Risk Alert Card */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="glass-card p-5 rounded-2xl health-shadow flex flex-col gap-2 transition-all hover:bg-white"
            >
              <div className="flex items-center justify-between">
                <span className="text-error text-xl">⚠️</span>
                <span className="text-[10px] font-bold text-error bg-error-container px-2 py-0.5 rounded-full uppercase">High Risk</span>
              </div>
              <p className="font-body-sm text-on-surface-variant text-[12px] leading-tight mt-2">
                HbA1c levels showing upward trend over 30 days.
              </p>
            </motion.div>

            {/* Avg Glucose Card */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="glass-card p-5 rounded-2xl health-shadow flex flex-col justify-between bg-primary/5 transition-all hover:bg-white"
            >
              <div className="flex items-center gap-2">
                <span className="text-primary text-sm">🩸</span>
                <span className="font-label-caps text-[10px] text-on-surface-variant">Avg Glucose</span>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold text-primary">104</span>
                <span className="text-xs text-on-surface-variant ml-1">mg/dL</span>
              </div>
            </motion.div>

            {/* Activity Card */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="glass-card p-5 rounded-2xl health-shadow flex flex-col justify-between transition-all hover:bg-white"
            >
              <div className="flex items-center gap-2">
                <span className="text-secondary text-sm">🏃</span>
                <span className="font-label-caps text-[10px] text-on-surface-variant">Activity</span>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold text-on-surface">8.4k</span>
                <span className="text-xs text-on-surface-variant ml-1">steps</span>
              </div>
            </motion.div>

            {/* Caution Card */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="glass-card p-5 rounded-2xl health-shadow flex flex-col gap-2 bg-surface-container-high/40 transition-all hover:bg-white border-dashed border-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-on-secondary-fixed-variant text-xl">ℹ️</span>
                <span className="text-[10px] font-bold text-on-secondary-fixed-variant bg-secondary-container px-2 py-0.5 rounded-full uppercase">Caution</span>
              </div>
              <p className="font-body-sm text-on-surface-variant text-[12px] leading-tight mt-2">
                Irregular sleep patterns detected yesterday.
              </p>
            </motion.div>
          </div>

          {/* Background Decoration */}
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-primary/5 to-transparent rounded-full blur-3xl"></div>
        </motion.div>
      </div>

      {/* Mobile Alert Cards (Visible only on mobile) */}
      <div className="lg:hidden mt-8 space-y-4">
        <h3 className="font-label-caps text-label-caps text-on-surface-variant px-1">SYSTEM STATUS</h3>
        
        {/* High Risk Alert */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-error-container border-l-4 border-error p-4 rounded-xl flex items-start gap-4 shadow-[0px_4px_20px_rgba(186,26,26,0.1)]"
        >
          <span className="text-error text-xl">⚠️</span>
          <div className="flex flex-col">
            <span className="font-title-md text-on-error-container text-[16px]">High Risk</span>
            <span className="text-body-sm text-on-error-container/80">Glucose levels exceeded threshold (180 mg/dL).</span>
          </div>
        </motion.div>

        {/* Caution Alert */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-[#FFECCF] border-l-4 border-[#8B5000] p-4 rounded-xl flex items-start gap-4 shadow-[0px_4px_20px_rgba(139,80,0,0.05)]"
        >
          <span className="text-[#8B5000] text-xl">⚠️</span>
          <div className="flex flex-col">
            <span className="font-title-md text-[#2A1700] text-[16px]">Caution</span>
            <span className="text-body-sm text-[#2A1700]/80">Missed afternoon activity goal.</span>
          </div>
        </motion.div>

        {/* Normal Alert */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-primary-container/10 border-l-4 border-primary p-4 rounded-xl flex items-start gap-4 shadow-[0px_4px_20px_rgba(0,92,200,0.05)]"
        >
          <span className="text-primary text-xl">✓</span>
          <div className="flex flex-col">
            <span className="font-title-md text-primary text-[16px]">Normal</span>
            <span className="text-body-sm text-on-surface-variant">System sync successful. Data is up to date.</span>
          </div>
        </motion.div>
      </div>

      {/* Mobile Stats Grid */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="lg:hidden grid grid-cols-3 gap-2 mt-8"
      >
        <div className="bg-surface border border-outline-variant/30 p-3 rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
          <span className="text-label-caps font-label-caps text-on-surface-variant">Avg Glucose</span>
          <span className="font-title-md text-primary mt-1">112</span>
          <span className="text-[10px] font-bold text-on-surface-variant">mg/dL</span>
        </div>
        <div className="bg-surface border border-outline-variant/30 p-3 rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
          <span className="text-label-caps font-label-caps text-on-surface-variant">Last Scan</span>
          <span className="font-title-md text-primary mt-1">2m</span>
          <span className="text-[10px] font-bold text-on-surface-variant">ago</span>
        </div>
        <div className="bg-surface border border-outline-variant/30 p-3 rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
          <span className="text-label-caps font-label-caps text-on-surface-variant">Activity</span>
          <span className="font-title-md text-primary mt-1">72%</span>
          <span className="text-[10px] font-bold text-on-surface-variant">Goal</span>
        </div>
      </motion.div>
    </main>
  );
}
