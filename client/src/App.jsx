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

// client/src/App.jsx

import React from 'react';
// This is the ONLY place where Routes and Route should be imported from react-router-dom
import { Routes, Route } from "react-router-dom";

// --- Import your page components ---
import HomePage from "./pages/HomePage";
import UploadPage from "./pages/UploadPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import ItemDetailsPage from "./pages/ItemDetailsPage";
import RequestsDashboard from "./pages/RequestsDashboard";
import ChatPage from "./pages/ChatPage"; // Assuming you have a ChatPage
import LeaderboardPage from "./pages/Leaderboard"; // Corrected import name to LeaderboardPage
import FAQPage from "./pages/FAQPage"; // Assuming you have an FAQPage

// --- Import your shared components ---
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Note: AuthProvider and BrowserRouter are now exclusively in main.jsx
// So, you do NOT import AuthProvider or BrowserRouter here.

function App() {
  return (
    <div className="font-sans flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/item/:id" element={<ItemDetailsPage />} /> {/* Using /item/:id as per your code */}
          <Route path="/leaderboard" element={<LeaderboardPage />} /> {/* Using LeaderboardPage */}
          <Route path="/faq" element={<FAQPage />} />

          {/* Protected Routes - Wrap routes that require authentication */}
          {/* If a route is protected, it should ONLY appear within this block */}
          <Route element={<ProtectedRoute />}>
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            {/* These routes were duplicated; they should only be protected if that's the intent */}
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
