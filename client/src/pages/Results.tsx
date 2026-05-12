import { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '@/hooks/use-ai';
import { interpretGlucose } from '@/utils/glucoseRules';
import type { RiskLevel } from '@/utils/glucoseRules';
import { generateSuggestedQuestions } from '@/lib/geminiAPI';

interface ChatMessage {
  id: string;
  role: 'bot' | 'user';
  content: string;
  timestamp: string;
}

interface ScreeningData {
  glucoseValue?: number;
  glucoseUnit?: 'mg/dL' | 'mmol/L';
  timing?: 'before' | 'after' | 'fasting' | 'bedtime';
  feeling?: 'good' | 'neutral' | 'sick';
  familyHistory?: string;
  highBp?: string;
  symptoms?: string[];
  bmi?: number;
  bmiCategory?: string;
  weight?: string;
  height?: string;
}

function getTimestamp(): string {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function timingToTestType(timing?: string): 'fasting' | 'random' {
  return timing === 'fasting' ? 'fasting' : 'random';
}

function statusFromRiskLevel(level: RiskLevel): 'normal' | 'warning' | 'critical' {
  switch (level) {
    case 'normal': return 'normal';
    case 'prediabetes': return 'warning';
    case 'diabetes': return 'critical';
    default: return 'normal';
  }
}

function getTargetRange(testType: 'fasting' | 'random', unit: string): string {
  if (testType === 'fasting') {
    return unit === 'mmol/L' ? '3.9 – 5.5 mmol/L' : '70 – 99 mg/dL';
  }
  return unit === 'mmol/L' ? '3.9 – 7.8 mmol/L' : '70 – 140 mg/dL';
}

function getTimingLabel(timing?: string): string {
  switch (timing) {
    case 'fasting': return 'Fasting';
    case 'before': return 'Pre-Meal';
    case 'after': return 'Post-Meal';
    case 'bedtime': return 'Bedtime';
    default: return 'Random';
  }
}

export default function Results() {
  const [, navigate] = useLocation();
  const chatMutation = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load screening data from localStorage
  const screeningData = useMemo<ScreeningData>(() => {
    try {
      return JSON.parse(localStorage.getItem('screeningData') || '{}');
    } catch {
      return {};
    }
  }, []);

  const glucoseValue = screeningData.glucoseValue ?? 0;
  const glucoseUnit = screeningData.glucoseUnit ?? 'mg/dL';
  const testType = timingToTestType(screeningData.timing);

  // Interpret the glucose reading
  const interpretation = useMemo(() => {
    if (glucoseValue <= 0) return null;
    return interpretGlucose(glucoseValue, glucoseUnit, testType);
  }, [glucoseValue, glucoseUnit, testType]);

  const status = interpretation ? statusFromRiskLevel(interpretation.level) : 'normal';
  const targetRange = getTargetRange(testType, glucoseUnit);
  const timingLabel = getTimingLabel(screeningData.timing);

  // Generate context-aware suggested questions
  const suggestedQuestions = useMemo(() => {
    if (glucoseValue <= 0) {
      return ['What are normal glucose ranges?', 'How often should I test my glucose?', 'What foods affect blood sugar?'];
    }
    return generateSuggestedQuestions(
      glucoseValue,
      testType === 'fasting' ? 'fasting' : 'random',
      interpretation?.level as any
    );
  }, [glucoseValue, testType, interpretation]);

  // Build initial greeting based on actual data
  const initialGreeting = useMemo(() => {
    if (glucoseValue <= 0) {
      return "Hello! It looks like you haven't entered a glucose reading yet. Go to the Glucose Entry page to log a reading, then come back here to see your analysis and ask questions.";
    }
    const levelLabel = interpretation?.title ?? 'Unknown';
    return `Hello! I've analyzed your ${timingLabel.toLowerCase()} reading of ${glucoseValue} ${glucoseUnit}. Your result is: **${levelLabel}**. ${interpretation?.description ?? ''} Feel free to ask me any questions about your results or general health advice.`;
  }, [glucoseValue, glucoseUnit, timingLabel, interpretation]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'bot',
      content: initialGreeting,
      timestamp: getTimestamp()
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = (messageText?: string) => {
    const text = (messageText ?? inputValue).trim();
    if (!text) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: getTimestamp()
    };
    setChatMessages(prev => [...prev, newMessage]);
    setInputValue('');

    // Send message to AI chat API with actual glucose context
    chatMutation.mutate(
      {
        message: text,
        context: glucoseValue > 0 ? { glucoseValue } : undefined,
      },
      {
        onSuccess: (data) => {
          const botResponse: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'bot',
            content: data.response,
            timestamp: getTimestamp()
          };
          setChatMessages(prev => [...prev, botResponse]);
        },
        onError: (error) => {
          const errorMsg = error instanceof Error ? error.message : 'Unknown error';
          const botResponse: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'bot',
            content: `Sorry — I couldn't process that request. ${errorMsg}. Please try again.`,
            timestamp: getTimestamp()
          };
          setChatMessages(prev => [...prev, botResponse]);
        }
      }
    );
  };

  const handleSuggestedQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'normal':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-surface-container';
    }
  };

  const getStatusLabel = (s: string) => {
    switch (s) {
      case 'normal': return 'Normal';
      case 'warning': return 'Elevated';
      case 'critical': return 'High';
      default: return 'Unknown';
    }
  };

  const getInterpretationBorderColor = (s: string) => {
    switch (s) {
      case 'normal': return 'border-green-500';
      case 'warning': return 'border-orange-500';
      case 'critical': return 'border-red-500';
      default: return 'border-primary';
    }
  };

  // No data state
  if (glucoseValue <= 0) {
    return (
      <main className="h-screen flex flex-col bg-surface items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md space-y-6"
        >
          <div className="w-20 h-20 bg-primary-container rounded-full flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-primary text-4xl">monitoring</span>
          </div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">No Reading Yet</h2>
          <p className="font-body-base text-on-surface-variant">
            Enter your glucose reading first to see your personalized results and talk to the AI health assistant.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/glucose')}
              className="w-full py-3 bg-primary text-on-primary rounded-lg font-title-md font-semibold shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Enter Glucose Reading
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 border border-outline text-on-surface rounded-lg font-title-md hover:bg-surface-container transition-all"
            >
              Back to Home
            </button>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="h-screen flex flex-col bg-surface">
      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
          <div className="grid grid-cols-12 gap-8">
            {/* Left Column: Results Card */}
            <aside className="col-span-12 lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="sticky top-24 space-y-6"
              >
                {/* Current Reading Card */}
                <div className="bg-surface p-6 rounded-xl shadow-[0px_4px_20px_rgba(0,92,200,0.05)] border border-outline-variant/30">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">CURRENT READING</p>
                      <h2 className="font-headline-lg text-headline-lg text-primary">{timingLabel}</h2>
                    </div>
                    <span className={`px-3 py-1 rounded-full ${getStatusColor(status)} text-xs font-semibold`}>
                      {getStatusLabel(status)}
                    </span>
                  </div>

                  {/* Glucose Value */}
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-6xl font-bold tracking-tight text-on-surface">{glucoseValue}</span>
                    <span className="text-xl text-on-surface-variant">{glucoseUnit}</span>
                  </div>

                  {/* Interpretation */}
                  {interpretation && (
                    <div className={`p-4 bg-surface-container-low rounded-lg mb-6 border-l-4 ${getInterpretationBorderColor(status)}`}>
                      <p className="font-body-base font-semibold text-on-surface mb-1">{interpretation.title}</p>
                      <p className="font-body-base text-on-surface-variant">
                        {interpretation.description}
                      </p>
                    </div>
                  )}

                  {/* Target Range & Status */}
                  <div className="grid grid-cols-2 gap-3 pb-6 border-b border-outline-variant/20">
                    <div className="bg-surface-container-low rounded-lg p-3">
                      <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">Target Range</p>
                      <p className="font-body-base font-semibold text-on-surface">{targetRange}</p>
                    </div>
                    <div className="bg-surface-container-low rounded-lg p-3">
                      <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">Feeling</p>
                      <p className="font-body-base font-semibold text-on-surface capitalize">{screeningData.feeling ?? 'Not recorded'}</p>
                    </div>
                  </div>

                  {/* Risk Factors Summary */}
                  {(screeningData.familyHistory === 'yes' || screeningData.highBp === 'yes' || (screeningData.symptoms && screeningData.symptoms.length > 0)) && (
                    <div className="pt-4 pb-4 border-b border-outline-variant/20">
                      <p className="font-label-caps text-label-caps text-on-surface-variant mb-3">RISK FACTORS</p>
                      <div className="flex flex-wrap gap-2">
                        {screeningData.familyHistory === 'yes' && (
                          <span className="px-2 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-semibold border border-orange-200">Family History</span>
                        )}
                        {screeningData.highBp === 'yes' && (
                          <span className="px-2 py-1 bg-red-50 text-red-700 rounded-full text-xs font-semibold border border-red-200">High BP</span>
                        )}
                        {screeningData.symptoms && screeningData.symptoms.map(s => (
                          <span key={s} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-200">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* BMI Info */}
                  {screeningData.bmi && (
                    <div className="pt-4 pb-4 border-b border-outline-variant/20">
                      <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">BMI</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-on-surface">{screeningData.bmi}</span>
                        <span className="text-sm text-on-surface-variant capitalize">({screeningData.bmiCategory ?? 'Unknown'})</span>
                      </div>
                    </div>
                  )}

                  {/* Suggested Questions */}
                  <div className="pt-6">
                    <p className="font-label-caps text-label-caps text-on-surface-variant mb-3">ASK THE ASSISTANT</p>
                    <div className="flex flex-col gap-2">
                      {suggestedQuestions.map((question, idx) => (
                        <motion.button
                          key={idx}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSuggestedQuestion(question)}
                          className="px-3 py-2 bg-secondary-container/50 hover:bg-secondary-container text-on-secondary-fixed-variant text-body-sm rounded-lg transition-all text-left"
                        >
                          {question}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Trend Card */}
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-primary text-on-primary p-6 rounded-xl shadow-lg relative overflow-hidden"
                >
                  <div className="relative z-10">
                    <h3 className="font-title-md text-title-md mb-2">What's Next?</h3>
                    <p className="text-body-sm opacity-90">
                      {status === 'critical'
                        ? 'We strongly recommend consulting a healthcare provider for a professional HbA1c test to confirm these findings.'
                        : status === 'warning'
                        ? 'Consider lifestyle changes and follow up with your doctor. Regular monitoring can help you stay on track.'
                        : 'Keep monitoring regularly and maintain your healthy lifestyle. Consistency is key to long-term health.'}
                    </p>
                  </div>
                  <div className="absolute -right-4 -bottom-4 opacity-10">
                    <span className="material-symbols-outlined text-[120px]">analytics</span>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Link href="/referral">
                    <button className="w-full py-3 px-4 bg-secondary-container text-on-secondary-fixed-variant rounded-lg font-semibold text-sm hover:brightness-105 transition-all flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-lg">local_hospital</span>
                      Find Care / Get Referral
                    </button>
                  </Link>
                  <Link href="/health-tips">
                    <button className="w-full py-3 px-4 border border-outline text-on-surface rounded-lg font-semibold text-sm hover:bg-surface-container transition-all flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-lg">lightbulb</span>
                      Health Tips & Prevention
                    </button>
                  </Link>
                  <button
                    onClick={() => navigate('/glucose')}
                    className="w-full py-3 px-4 border border-outline-variant text-on-surface-variant rounded-lg text-sm hover:bg-surface-container-low transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-lg">refresh</span>
                    Log Another Reading
                  </button>
                </div>
              </motion.div>
            </aside>

            {/* Right Column: Chat Interface */}
            <section className="col-span-12 lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-surface rounded-xl shadow-[0px_4px_20px_rgba(0,92,200,0.05)] border border-outline-variant/30 flex flex-col h-[600px] md:h-[750px]"
              >
                {/* Chat Header */}
                <div className="p-4 border-b border-outline-variant/20 flex items-center justify-between bg-surface-container-low rounded-t-xl flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary">
                      <span className="material-symbols-outlined">smart_toy</span>
                    </div>
                    <div>
                      <h3 className="font-title-md text-title-md leading-tight">Health Assistant</h3>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${chatMutation.isPending ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></span>
                        <span className="text-xs text-on-surface-variant">
                          {chatMutation.isPending ? 'Thinking...' : 'Online & Ready'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-on-surface-variant bg-surface-container px-2 py-1 rounded-full">
                      {glucoseValue} {glucoseUnit}
                    </span>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <AnimatePresence>
                    {chatMessages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse justify-end' : ''}`}
                      >
                        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                          message.role === 'bot' ? 'bg-primary-container' : 'bg-secondary'
                        }`}>
                          <span className={`material-symbols-outlined text-sm ${
                            message.role === 'bot' ? 'text-primary' : 'text-on-secondary'
                          }`}>
                            {message.role === 'bot' ? 'biotech' : 'person'}
                          </span>
                        </div>
                        <div className="max-w-[75%]">
                          <div className={`p-4 rounded-2xl ${
                            message.role === 'bot'
                              ? 'bg-surface-container-low rounded-tl-none'
                              : 'bg-primary text-on-primary rounded-tr-none'
                          }`}>
                            <p className={`text-body-base ${message.role === 'user' ? 'text-on-primary' : 'text-on-surface'}`}>
                              {message.content}
                            </p>
                          </div>
                          <span className={`text-[10px] mt-1 block ${
                            message.role === 'bot' ? 'text-on-surface-variant' : 'text-on-surface-variant text-right'
                          }`}>
                            {message.timestamp}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Typing indicator */}
                  {chatMutation.isPending && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-4"
                    >
                      <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-primary-container">
                        <span className="material-symbols-outlined text-sm text-primary">biotech</span>
                      </div>
                      <div className="bg-surface-container-low rounded-2xl rounded-tl-none p-4">
                        <div className="flex gap-1.5">
                          <span className="w-2 h-2 bg-on-surface-variant/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                          <span className="w-2 h-2 bg-on-surface-variant/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                          <span className="w-2 h-2 bg-on-surface-variant/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-outline-variant/20 flex-shrink-0">
                  <div className="relative flex items-center gap-2">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                      placeholder="Ask about your glucose, diet, exercise..."
                      disabled={chatMutation.isPending}
                      className="flex-1 bg-surface-container-low border-none rounded-full py-3 px-4 focus:ring-2 focus:ring-primary text-body-base outline-none disabled:opacity-50"
                    />
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSendMessage()}
                      disabled={chatMutation.isPending || !inputValue.trim()}
                      className="p-2 bg-primary text-on-primary rounded-full hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined">send</span>
                    </motion.button>
                  </div>
                  <p className="text-[10px] text-center text-on-surface-variant mt-2">
                    AI assistant provides health information only — not medical advice. Consult a doctor for diagnosis.
                  </p>
                </div>
              </motion.div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
