// client/src/App.jsx

import React, { useEffect, useContext } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";


import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop"; 
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import BackToTop from "./components/BackToTop";

import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import UploadPage from "./pages/UploadPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import ItemDetailsPage from "./pages/ItemDetailsPage";
import RequestsDashboard from "./pages/RequestsDashboard";
import ChatPage from "./pages/ChatPage";
import MessagesPage from "./pages/MessagesPage";
import FAQPage from "./pages/FAQPage"; 
import ContactPage from "./pages/ContactPage"; 
import LeaderboardPage from "./pages/LeaderboardPage"; 
import WalletPage from "./pages/WalletPage";
import NotFound from "./pages/NotFound";


import { AuthProvider, AuthContext } from "./context/AuthContext"; 

function App() {
  const { socket } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (data) => {
      if (location.pathname === `/chat/${data.chatId}`) return;
      
      toast.success(`New Message from ${data.senderName}`, {
        description: data.text.length > 30 ? data.text.slice(0, 30) + '...' : data.text,
        action: {
          label: "View",
          onClick: () => navigate(`/chat/${data.chatId}`)
        },
        duration: 5000,
        className: '!bg-emerald-600 !text-white !border-emerald-700'
      });
    };

    const handleNewRequest = (data) => {
      toast.success(`New Request!`, {
        description: `${data.requesterName} requested your item: ${data.itemName}`,
        action: {
          label: "View",
          onClick: () => navigate(`/requests`)
        },
        duration: 5000,
        className: '!bg-emerald-600 !text-white !border-emerald-700'
      });
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("new_request", handleNewRequest);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("new_request", handleNewRequest);
    };
  }, [socket, location.pathname, navigate]);

  return (
    
    <div className="font-sans flex flex-col min-h-screen bg-background text-foreground">
      <Header />

     
      <ScrollToTop />

      <main className="flex-grow">
        <Routes>
        
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/item/:id" element={<ItemDetailsPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />{" "}
         
          <Route element={<ProtectedRoute />}>
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/requests" element={<RequestsDashboard />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/chat/:chatId" element={<ChatPage />} />
            <Route path="/wallet" element={<WalletPage />} />
          </Route>
       
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
      <Toaster />
      <BackToTop />
    </div>
  );
}

export default App;
