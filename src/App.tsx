
import React from 'react';
import { Toaster as SonnerToaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
import ApiNotFound from "./pages/ApiNotFound";
import ShopProfile from './components/StoreProfile';
import DashboardMessages from './pages/DashboardMessages';
import BoutiquesPage from './pages/BoutiquesPage';
import CartPage from './components/CartPage';
import WhatsAppLinksPage from './components/WhatsAppLinksPage';
import MessagePage from './components/MessagePage';
import WhatsAppClone from './components/ WhatsAppClone';
import OrderDetailsPage from './pages/OrderDetailsPage';
import MerchantOrdersPage from './pages/MerchantOrdersPage';
import ShopsListingPage from './pages/ShopsListingPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SonnerToaster />
      <BrowserRouter>
        <Routes>
          {/* API routes - must be handled first */}
          <Route path="/api/auth/google/callback" element={<ApiNotFound />} />
          <Route path="/api/auth/google" element={<ApiNotFound />} />
          <Route path="/api/*" element={<ApiNotFound />} />
          
          {/* Redirector for authentication flows */}
          <Route path="/redirect" element={<Redirector />} />
          
          {/* Normal application routes */}
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
          <Route path="/boutique/:shopId" element={<ShopProfile />} />
          <Route path="/whatsapp-links" element={<WhatsAppLinksPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/dashboard/messages" element={<DashboardMessages />} />
          <Route path="/boutiques" element={<BoutiquesPage />} />
          <Route path="/messages/:userId" element={<MessagePage />} />
          <Route path="/whatsapp" element={<WhatsAppClone />} />
          <Route path="/commandes/:orderId" element={<OrderDetailsPage />} />
          <Route path="/commandes-recues" element={<MerchantOrdersPage />} />
          <Route path="/boutique" element={<ShopsListingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
      
          
          {/* Catch-all for any other routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
