import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Welcome from "@/pages/Welcome";
import RiskScreening from "@/pages/RiskScreening";
import GlucoseEntry from "@/pages/GlucoseEntry";
import Results from "@/pages/Results";
import Referral from "@/pages/Referral";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Welcome} />
      <Route path="/screening" component={RiskScreening} />
      <Route path="/glucose" component={GlucoseEntry} />
      <Route path="/results" component={Results} />
      <Route path="/referral" component={Referral} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
