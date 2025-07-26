
import React from 'react';

import { Routes, Route } from "react-router-dom";

// --- Import components ---
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop"; // Ensure this file exists

// --- Import pages ---
import HomePage from "./pages/HomePage";
import UploadPage from "./pages/UploadPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import ItemDetailsPage from "./pages/ItemDetailsPage";
import RequestsDashboard from "./pages/RequestsDashboard";
import ChatPage from "./pages/ChatPage";
import FAQPage from "./pages/FAQPage"; // Ensure this file exists
import ContactPage from "./pages/ContactPage"; // Ensure this file exists
import LeaderboardPage from "./pages/LeaderboardPage"; // Ensure this file exists

// --- Import Context Providers ---
import { AuthProvider } from './context/AuthContext'; // AuthProvider is used in main.jsx, so it wraps the App component


function App() {
  return (
    // AuthProvider and BrowserRouter are in main.jsx, wrapping this App component
    // The div helps with sticky footer layout
    <div className="font-sans flex flex-col min-h-screen">
      <Header />

      {/* ScrollToTop component is placed here to handle scrolling on route changes */}
      <ScrollToTop />

      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/item/:id" element={<ItemDetailsPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} /> {/* Added Leaderboard route */}

          {/* Protected Routes - Wrap routes that require authentication */}
          <Route element={<ProtectedRoute />}>
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/requests" element={<RequestsDashboard />} />
            <Route path="/chat/:chatId" element={<ChatPage />} />
          </Route>

          {/* Catch-all for 404 Not Found pages */}
          <Route path="*" element={<h1 className="text-center text-3xl mt-20">404 - Page Not Found</h1>} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;