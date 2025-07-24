// client/src/App.jsx

import React from "react";
import { Routes, Route } from "react-router-dom"; // Removed BrowserRouter import
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UploadPage from "./pages/UploadPage";
import ItemDetailsPage from "./pages/ItemDetailsPage";
import RequestsDashboard from "./pages/RequestsDashboard";
import ProfilePage from "./pages/ProfilePage";
import LeaderboardPage from "./pages/LeaderboardPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
// Removed: import { AuthProvider } from './context/AuthContext'; // AuthProvider is now in main.jsx

function App() {
  return (
    // Removed <Router> wrapper as it's now in main.jsx
    // Removed <AuthProvider> wrapper as it's now in main.jsx
    <>
      <Header />
      <main className="py-3">
        <Routes>
          <Route path="/" element={<HomePage />} exact />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/items/:id" element={<ItemDetailsPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route
            path="/upload"
            element={<ProtectedRoute element={UploadPage} />}
          />
          <Route
            path="/requests"
            element={<ProtectedRoute element={RequestsDashboard} />}
          />
          <Route
            path="/profile"
            element={<ProtectedRoute element={ProfilePage} />}
          />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
