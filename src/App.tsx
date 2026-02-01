import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";

// Pages
import Index from "./pages/Index";
import Inscription from "./pages/Inscription";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// App pages
import CandidatDashboard from "./pages/app/CandidatDashboard";
import AssistantDashboard from "./pages/app/AssistantDashboard";
import RecruteurDashboard from "./pages/app/RecruteurDashboard";
import AdminDashboard from "./pages/app/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/inscription" element={<Inscription />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* App routes - accessible sans auth pour dev/demo */}
            <Route path="/app" element={
              <ProtectedRoute requireAuth={false}>
                <AppLayout />
              </ProtectedRoute>
            }>
              {/* Candidat routes */}
              <Route index element={<CandidatDashboard />} />
              <Route path="offres" element={<CandidatDashboard />} />
              <Route path="candidatures" element={<CandidatDashboard />} />
              <Route path="messages" element={<CandidatDashboard />} />
              <Route path="training" element={<CandidatDashboard />} />
              <Route path="profil" element={<CandidatDashboard />} />
              <Route path="settings" element={<CandidatDashboard />} />
              
              {/* Assistant routes */}
              <Route path="assistant" element={<AssistantDashboard />} />
              <Route path="assistant/*" element={<AssistantDashboard />} />
              
              {/* Recruteur routes */}
              <Route path="recruteur" element={<RecruteurDashboard />} />
              <Route path="recruteur/*" element={<RecruteurDashboard />} />
              
              {/* Admin routes */}
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="admin/*" element={<AdminDashboard />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
