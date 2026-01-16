import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Activity, Scale, Cigarette, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function HealthTips() {
  const healthCards = [
    {
      icon: Heart,
      title: "Diabetes & Heart Disease",
      subtitle: "The link between high sugar and vessel damage",
      description: "High blood sugar can damage blood vessels and nerves that control your heart. People with diabetes are twice as likely to develop heart disease or stroke.",
      tips: [
        "Keep blood sugar levels in target range",
        "Monitor blood pressure regularly",
        "Maintain healthy cholesterol levels",
        "Exercise for at least 30 minutes daily"
      ],
      gradient: "from-red-500 to-pink-500"
    },
    {
      icon: Activity,
      title: "Hypertension & Sugar",
      subtitle: "Managing dual risks",
      description: "High blood pressure and high blood sugar often occur together, creating a dangerous combination that increases your risk of serious health complications.",
      tips: [
        "Reduce sodium intake (less than 2,300mg daily)",
        "Limit refined carbohydrates and sugars",
        "Stay physically active",
        "Take medications as prescribed"
      ],
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Scale,
      title: "Obesity & Insulin Resistance",
      subtitle: "Breaking the cycle",
      description: "Excess body weight, especially around the abdomen, can make your body resistant to insulin, leading to higher blood sugar levels and increased diabetes risk.",
      tips: [
        "Aim for gradual weight loss (1-2 lbs per week)",
        "Focus on whole foods and vegetables",
        "Practice portion control",
        "Get adequate sleep (7-9 hours)"
      ],
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Cigarette,
      title: "Smoking & Vascular Risk",
      subtitle: "Protect your blood vessels",
      description: "Smoking damages blood vessels, raises blood sugar levels, and significantly increases the risk of diabetes complications including heart disease and stroke.",
      tips: [
        "Seek help to quit smoking immediately",
        "Avoid secondhand smoke exposure",
        "Join a support group or counseling",
        "Consider nicotine replacement therapy"
      ],
      gradient: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-blue-50/30">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-3 bg-red-50 rounded-2xl mb-6">
            <Heart className="w-8 h-8 text-red-500" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            The <span className="text-primary">Cost of Diabetes</span><br/>
            <span className="text-2xl md:text-3xl font-semibold text-slate-600">And How to Prevent It</span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Diabetes complications affect millions—kidney failure, blindness, amputations, heart disease. But 80% of cases are preventable with early detection and lifestyle changes.
          </p>

          <div className="grid grid-cols-3 gap-3 max-w-2xl mx-auto">
            <div className="bg-red-50 p-3 rounded-xl border border-red-200">
              <p className="text-xl font-bold text-red-600">1.5M</p>
              <p className="text-xs text-red-700">Deaths annually</p>
            </div>
            <div className="bg-orange-50 p-3 rounded-xl border border-orange-200">
              <p className="text-xl font-bold text-orange-600">50%</p>
              <p className="text-xs text-orange-700">Don't know they have it</p>
            </div>
            <div className="bg-green-50 p-3 rounded-xl border border-green-200">
              <p className="text-xl font-bold text-green-600">80%</p>
              <p className="text-xs text-green-700">Preventable risk</p>
            </div>
          </div>
        </motion.div>

        {/* Health Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {healthCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 bg-white">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-4`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-1">{card.title}</h3>
                  <p className="text-sm text-primary font-semibold mb-3">{card.subtitle}</p>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {card.description}
                  </p>
                  
                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-600">Key Actions:</p>
                    <ul className="space-y-1.5">
                      {card.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start gap-2 text-sm">
                          <span className="text-primary mt-1">•</span>
                          <span className="text-slate-700">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-6 mb-8"
        >
          <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2 text-lg">
            <Activity className="w-5 h-5" />
            ✨ The Good News: Prevention Works
          </h3>
          <div className="space-y-2 text-sm text-green-800 leading-relaxed">
            <p>
              <span className="font-bold">• Early Detection:</span> A simple screening can identify risk years before symptoms appear.
            </p>
            <p>
              <span className="font-bold">• Lifestyle Changes:</span> Diet modifications and exercise can prevent or delay diabetes onset by up to 80%.
            </p>
            <p>
              <span className="font-bold">• Affordable:</span> Prevention is far cheaper than managing complications like dialysis or amputation.
            </p>
            <p className="mt-4 pt-4 border-t border-green-300">
              <span className="italic">These health tips are for educational purposes only. Always consult with your healthcare provider before making any changes to your diet, exercise routine, or medication regimen. Regular check-ups and professional medical advice are essential for managing your health.</span>
            </p>
          </div>
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/" className="flex-1">
            <Button variant="outline" size="lg" className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          
          <Link href="/screening" className="flex-1">
            <Button size="lg" className="w-full shadow-lg shadow-blue-500/20">
              Start Risk Screening
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
