
import React from 'react';
import { Toaster as SonnerToaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyCode from "./pages/VerifyCode";
import VerificationPending from "./pages/VerificationPending";
import ClientDashboard from "./pages/ClientDashboard";
import MerchantDashboard from "./pages/MerchantDashboard";
import SupplierDashboard from "./pages/SupplierDashboard";
import CompleteProfile from "./pages/CompleteProfile";
import Redirector from "./pages/Redirector";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SonnerToaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-code" element={<VerifyCode />} />
          <Route path="/verification-pending" element={<VerificationPending />} />
          <Route path="/client-dashboard" element={<ClientDashboard />} />
          <Route path="/merchant-dashboard" element={<MerchantDashboard />} />
          <Route path="/supplier-dashboard" element={<SupplierDashboard />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          {/* Routes pour la redirection après authentification */}
          <Route path="/redirect" element={<Redirector />} />
          <Route path="/api/auth/google/callback" element={<Redirector />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
