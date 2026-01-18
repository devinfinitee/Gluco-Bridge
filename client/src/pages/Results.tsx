import { useEffect, useState, useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { interpretGlucose, type RiskLevel } from "@/utils/glucoseRules";
import { useChat, useAnalyzeImage } from "@/hooks/use-ai";
import { useCreateScreening } from "@/hooks/use-screenings";
import { Activity, MessageCircle, Send, ArrowRight, Info, MapPin, Camera, Upload, Loader2, Lightbulb } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { generateSuggestedQuestions } from "@/lib/geminiAPI";
import { CameraCapture } from "@/components/common/CameraCapture";
import { useToast } from "@/hooks/use-toast";
import { calculateBMI } from "@/utils/validation";

export default function Results() {
  const [data, setData] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [showScanOptions, setShowScanOptions] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const chatMutation = useChat();
  const analyzeImageMutation = useAnalyzeImage();
  const saveMutation = useCreateScreening();

  useEffect(() => {
    const stored = localStorage.getItem('screeningData');
    if (stored) {
      const parsed = JSON.parse(stored);
      setData(parsed);
      
      // Generate suggested questions based on glucose context
      const questions = generateSuggestedQuestions(
        parsed.glucoseValue,
        parsed.testType,
        parsed.riskLevel
      );
      setSuggestedQuestions(questions);
      
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

  const handleChat = async (userMessage?: string) => {
    const finalMessage = userMessage || message;
    if (!finalMessage.trim()) return;
    
    setMessage('');
    setChatHistory(prev => [...prev, { role: 'user', text: finalMessage }]);

    try {
      const res = await chatMutation.mutateAsync({
        message: finalMessage,
        context: {
          glucoseValue: data.glucoseValue,
          testType: data.testType,
          riskLevel: interpretation.level,
        }
      } as any);
      setChatHistory(prev => [...prev, { role: 'ai', text: res.response }]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg = err instanceof Error ? err.message : "I'm having trouble connecting right now.";
      setChatHistory(prev => [...prev, { role: 'ai', text: errorMsg }]);
      toast({
        title: "Chat Error",
        description: errorMsg,
        variant: "destructive",
      });
    }
  };

  const handleCameraCapture = async (imageData: string) => {
    setIsProcessing(true);
    try {
      console.log('Analyzing glucometer with serverless API...');
      
      const result = await analyzeImageMutation.mutateAsync({ image: imageData });
      
      if (result.value !== null && result.unit !== null) {
        const glucoseValue = result.value;
        const glucoseUnit = result.unit.toUpperCase() as 'mg/dL' | 'mmol/L';
        
        const updatedData = {
          ...data,
          glucoseValue: glucoseValue,
          glucoseUnit: glucoseUnit
        };
        localStorage.setItem('screeningData', JSON.stringify(updatedData));
        setData(updatedData);
        setShowCamera(false);
        
        // Regenerate suggested questions
        const interpretation = interpretGlucose(glucoseValue, glucoseUnit);
        const questions = generateSuggestedQuestions(
          glucoseValue,
          data.testType,
          interpretation.level
        );
        setSuggestedQuestions(questions);
        
        toast({
          title: "Success!",
          description: `Updated glucose value: ${glucoseValue} ${glucoseUnit}`,
        });
        return;
      }
      
      // API
      // Gemini couldn't read the image
      toast({
        title: "Detection failed",
        description: "Could not read the glucometer screen. Please try again.",
        variant: "destructive",
      });
    } catch (error) {
      console.error("Error analyzing image:", error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      toast({
        title: "Error",
        description: `Failed to process image: ${errorMsg}`,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        await handleCameraCapture(base64);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {showCamera && (
        <CameraCapture 
          onCapture={handleCameraCapture}
          isProcessing={isProcessing}
        />
      )}

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

        {/* BMI Display if available */}
        {data.bmi && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 pt-6 border-t border-slate-200"
          >
            <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wide font-semibold">BMI Assessment</p>
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <span className="text-3xl font-bold text-slate-900">{data.bmi}</span>
                <p className="text-xs text-muted-foreground mt-1">Your BMI</p>
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm text-slate-700">{data.bmiCategory}</p>
                <p className="text-xs text-muted-foreground">Category</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="px-6 -mt-8 relative z-10 max-w-md mx-auto space-y-6">
        
        {/* Rescan Option */}
        <div className="bg-white p-4 rounded-3xl shadow-lg shadow-black/5 border border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Camera className="w-5 h-5 text-primary" />
              <div>
                <p className="font-semibold text-sm">Update Reading</p>
                <p className="text-xs text-muted-foreground">Scan your monitor again</p>
              </div>
            </div>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setShowScanOptions(!showScanOptions)}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Scan"
              )}
            </Button>
          </div>
          
          <AnimatePresence>
            {showScanOptions && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3"
              >
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                />
                
                <Button
                  variant="outline"
                  className="flex flex-col items-center gap-2 h-auto py-4"
                  onClick={() => setShowCamera(true)}
                  disabled={isProcessing}
                >
                  <Camera className="w-6 h-6" />
                  <span className="text-xs">Take Photo</span>
                </Button>
                
                <Button
                  variant="outline"
                  className="flex flex-col items-center gap-2 h-auto py-4"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                >
                  <Upload className="w-6 h-6" />
                  <span className="text-xs">Upload Photo</span>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
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
          
          {/* Chat Messages */}
          <div className="p-4 h-64 overflow-y-auto space-y-4 bg-slate-50/50">
            {chatHistory.length === 0 && suggestedQuestions.length > 0 && (
              <div className="space-y-3">
                <p className="text-center text-sm text-muted-foreground font-medium flex items-center justify-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Suggested questions:
                </p>
                <div className="space-y-2">
                  {suggestedQuestions.map((question, idx) => (
                    <motion.button
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      onClick={() => handleChat(question)}
                      className="w-full text-left text-xs bg-white border border-slate-200 rounded-xl p-3 hover:bg-blue-50 hover:border-blue-300 transition-colors text-slate-700"
                    >
                      {question}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
            
            {chatHistory.length === 0 && suggestedQuestions.length === 0 && (
              <p className="text-center text-sm text-muted-foreground mt-8">
                Ask about your glucose levels, diet, exercise, or health.
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

          {/* Chat Input */}
          <div className="p-2 bg-white border-t border-slate-100 flex gap-2">
            <input
              className="flex-1 bg-slate-50 border-0 rounded-xl px-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="Type your question..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleChat()}
              disabled={chatMutation.isPending}
            />
            <Button 
              size="icon" 
              className="rounded-xl h-10 w-10" 
              onClick={() => handleChat()}
              disabled={chatMutation.isPending || !message.trim()}
            >
              {chatMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
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
