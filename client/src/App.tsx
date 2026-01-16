import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PrivacyConsent } from "@/components/common/PrivacyConsent";
import NotFound from "@/pages/not-found";
import Welcome from "@/pages/Welcome";
import RiskScreening from "@/pages/RiskScreening";
import GlucoseEntry from "@/pages/GlucoseEntry";
import Results from "@/pages/Results";
import Referral from "@/pages/Referral";
import HealthTips from "@/pages/HealthTips";
import { Header } from "@/components/common/Header";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Welcome} />
      <Route path="/screening" component={RiskScreening} />
      <Route path="/glucose" component={GlucoseEntry} />
      <Route path="/results" component={Results} />
      <Route path="/referral" component={Referral} />
      <Route path="/health-tips" component={HealthTips} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <PrivacyConsent onConsent={(accepted) => {
          console.log('Privacy consent:', accepted);
        }} />
        <div className="min-h-screen bg-background">
          <Header />
          <main className="pt-4">
            <Router />
          </main>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
