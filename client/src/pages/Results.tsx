import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { interpretGlucose, type RiskLevel } from "@/utils/glucoseRules";
import { useChat } from "@/hooks/use-ai";
import { useCreateScreening } from "@/hooks/use-screenings";
import { Activity, MessageCircle, Send, ArrowRight, Info, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function Results() {
  const [data, setData] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  
  const chatMutation = useChat();
  const saveMutation = useCreateScreening();

  useEffect(() => {
    const stored = localStorage.getItem('screeningData');
    if (stored) {
      const parsed = JSON.parse(stored);
      setData(parsed);
      
      // Save to backend silently
      if (parsed.glucoseValue) {
        saveMutation.mutate(parsed);
      }
    }
  }, []);

  if (!data) return null;

  const interpretation = interpretGlucose(
    data.glucoseValue, 
    data.glucoseUnit, 
    data.testType
  );

  const handleChat = async () => {
    if (!message.trim()) return;
    
    const userMsg = message;
    setMessage('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);

    try {
      const res = await chatMutation.mutateAsync({
        message: userMsg,
        context: {
          glucoseValue: data.glucoseValue,
          screeningId: undefined // Would come from saved response
        }
      });
      setChatHistory(prev => [...prev, { role: 'ai', text: res.response }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'ai', text: "I'm having trouble connecting right now." }]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="bg-white rounded-b-[2.5rem] shadow-sm border-b border-slate-100 p-8 pb-12 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-indigo-500" />
        
        <div className="inline-flex items-center justify-center p-3 bg-slate-50 rounded-2xl mb-6">
          <Activity className="w-6 h-6 text-primary" />
        </div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-2"
        >
          <span className="text-6xl font-display font-bold tracking-tighter text-slate-900">
            {data.glucoseValue}
          </span>
          <span className="text-lg text-muted-foreground font-medium ml-2">
            {data.glucoseUnit}
          </span>
        </motion.div>

        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`inline-block px-4 py-2 rounded-full text-sm font-bold tracking-wide uppercase ${interpretation.color}`}
        >
          {interpretation.title}
        </motion.div>

        <p className="mt-6 text-muted-foreground leading-relaxed max-w-xs mx-auto text-sm">
          {interpretation.description}
        </p>
      </div>

      <div className="px-6 -mt-8 relative z-10 max-w-md mx-auto space-y-6">
        
        {/* Interpretation Card */}
        <div className="bg-white p-6 rounded-3xl shadow-lg shadow-black/5 border border-slate-100">
          <div className="flex items-start gap-4">
            <Info className="w-6 h-6 text-primary shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg mb-2">What this means</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {interpretation.level === 'normal' 
                  ? "Your levels are in a healthy range. Keep up the good work with regular exercise and a balanced diet."
                  : interpretation.level === 'prediabetes'
                  ? "This indicates your blood sugar is higher than normal but not high enough to be diagnosed as diabetes."
                  : "Your reading suggests high blood sugar. It is important to confirm this with a healthcare professional."}
              </p>
            </div>
          </div>
        </div>

        {/* AI Chat */}
        <div className="bg-white rounded-3xl shadow-lg shadow-black/5 border border-slate-100 overflow-hidden">
          <div className="p-4 bg-blue-50/50 border-b border-blue-100 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            <span className="font-bold text-sm text-primary">Ask AI Assistant</span>
          </div>
          
          <div className="p-4 h-64 overflow-y-auto space-y-4 bg-slate-50/50">
            {chatHistory.length === 0 && (
              <p className="text-center text-sm text-muted-foreground mt-8">
                Ask about diet, exercise, or what your results mean.
              </p>
            )}
            {chatHistory.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white rounded-tr-none' 
                    : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-2 bg-white border-t border-slate-100 flex gap-2">
            <input
              className="flex-1 bg-slate-50 border-0 rounded-xl px-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="Type your question..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleChat()}
            />
            <Button size="icon" className="rounded-xl h-10 w-10" onClick={handleChat} disabled={chatMutation.isPending}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Link href="/referral">
          <Button className="w-full text-lg h-14 shadow-lg shadow-blue-500/20" size="lg">
            Find Next Steps <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
        
        <p className="text-center text-xs text-muted-foreground px-4">
          Disclaimer: This is an educational tool, not a medical device. Always consult a doctor.
        </p>

      </div>
    </div>
  );
}
