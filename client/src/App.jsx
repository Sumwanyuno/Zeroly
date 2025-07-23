// client/src/App.jsx
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import UploadPage from "./pages/UploadPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
import ItemDetailsPage from "./pages/ItemDetailsPage";
import RequestsDashboard from "./pages/RequestsDashboard";

function App() {
  return (
    <div className="font-sans">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/item/:id" element={<ItemDetailsPage />} />
          <Route path="/requests" element={<RequestsDashboard />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
