import { Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { HomeScreen } from "@/pages/HomeScreen";
import { RegistrationScreen } from "@/pages/RegistrationScreen";
import { ContestMobileScreen } from "@/pages/ContestMobileScreen";
import { HostAdminScreen } from "@/pages/HostAdminScreen";
import { PublicLeaderboardScreen } from "@/pages/PublicLeaderboardScreen";
import NotFound from "@/pages/NotFound";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomeScreen} />
      <Route path="/register" component={RegistrationScreen} />
      <Route path="/contest" component={ContestMobileScreen} />
      <Route path="/join" component={ContestMobileScreen} />
      <Route path="/admin" component={HostAdminScreen} />
      <Route path="/host" component={HostAdminScreen} />
      <Route path="/leaderboard" component={PublicLeaderboardScreen} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <Router />
      <Toaster position="top-center" richColors theme="dark" />
    </ThemeProvider>
  );
}
