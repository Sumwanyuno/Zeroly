// // client/src/App.jsx
// import { Routes, Route } from "react-router-dom";
// import Header from "./components/Header";
// import Footer from "./components/Footer";
// import HomePage from "./pages/HomePage";
// import UploadPage from "./pages/UploadPage";
// import LoginPage from "./pages/LoginPage";
// import RegisterPage from "./pages/RegisterPage";
// import ProfilePage from "./pages/ProfilePage";
// import ProtectedRoute from "./components/ProtectedRoute";
// import ItemDetailsPage from "./pages/ItemDetailsPage";
// import RequestsDashboard from "./pages/RequestsDashboard";
// import ChatPage from "./pages/ChatPage";

// function App() {
//   return (
//     <div className="font-sans">
//       <Header />
//       <main>
//         <Routes>
//           <Route path="/" element={<HomePage />} />
//           <Route path="/upload" element={<UploadPage />} />
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/register" element={<RegisterPage />} />
//           <Route path="/profile" element={<ProfilePage />} />
//           <Route path="/item/:id" element={<ItemDetailsPage />} />
//           <Route path="/requests" element={<RequestsDashboard />} />
//           <Route path="/chat/:chatId" element={<ChatPage />} />
//         </Routes>
//       </main>
//       <Footer />
//     </div>
//   );
// }

// export default App;

// client/src/App.jsx

import React from 'react';
import { Routes, Route } from "react-router-dom"; // CORRECTED: Removed BrowserRouter from import

// --- Import your components ---
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// --- Import your pages ---
import HomePage from "./pages/HomePage";
import UploadPage from "./pages/UploadPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import ItemDetailsPage from "./pages/ItemDetailsPage";
import RequestsDashboard from "./pages/RequestsDashboard";
import ChatPage from "./pages/ChatPage";
import FAQPage from "./pages/FAQPage";

// --- Import your Context Providers (AuthProvider is used in main.jsx now) ---
// You no longer need to import AuthProvider here if it's only used in main.jsx
// import { AuthProvider } from './context/AuthContext'; // <--- REMOVE THIS IMPORT if AuthProvider is only in main.jsx


function App() {
  return (
    // --- CORRECTED: REMOVED <Router> AND <AuthProvider> WRAPPER FROM HERE ---
    // The AuthProvider and BrowserRouter are now exclusively in main.jsx
    <div className="font-sans flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/item/:id" element={<ItemDetailsPage />} />
          <Route path="/faq" element={<FAQPage />} />

          {/* Protected Routes - Wrap routes that require authentication */}
          <Route element={<ProtectedRoute />}>
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/requests" element={<RequestsDashboard />} />
            <Route path="/chat/:chatId" element={<ChatPage />} />
          </Route>

          {/* Catch-all for 404 Not Found pages (optional but good practice) */}
          <Route path="*" element={<h1 className="text-center text-3xl mt-20">404 - Page Not Found</h1>} />
        </Routes>
      </main>

      <Footer />
    </div>
    // --- END CORRECTED ---
  );
}

export default App;