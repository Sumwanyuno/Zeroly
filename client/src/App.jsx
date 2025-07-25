
// client/src/App.jsx

import React from 'react';
import { Routes, Route } from "react-router-dom";

// --- Import components ---
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop"; // <--- Ensure this is imported

// --- Import pages ---
import HomePage from "./pages/HomePage";
import UploadPage from "./pages/UploadPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import ItemDetailsPage from "./pages/ItemDetailsPage";
import RequestsDashboard from "./pages/RequestsDashboard";
import ChatPage from "./pages/ChatPage";
import FAQPage from "./pages/FAQPage";
import ContactPage from "./pages/ContactPage"; // <--- Ensure ContactPage is imported

// --- Import Context Providers ---
import { AuthProvider } from './context/AuthContext'; // AuthProvider is used in main.jsx now


function App() {
  return (
    // The BrowserRouter is in main.jsx, wrapping this App component
    <AuthProvider>
      <div className="font-sans flex flex-col min-h-screen">
        <Header />

        {/* --- ScrollToTop component is placed here --- */}
        <ScrollToTop /> {/* This will ensure page scrolls to top on route change */}

        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/item/:id" element={<ItemDetailsPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contact" element={<ContactPage />} /> {/* <--- Ensure ContactPage route is here */}

            {/* Protected Routes */}
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
    </AuthProvider>
  );
}

export default App;