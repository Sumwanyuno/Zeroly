
import React, { useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useContext(AuthContext) || {};
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/users/login", {
        email,
        password,
      });

      if (typeof login === "function") {
        login(data);
        alert("Login successful!");
        navigate("/");
      } else {
        console.warn("AuthContext login function is not available.");
        navigate("/");
      }
    } catch (error) {
      console.error("Login failed:", error);
      let errorMessage = "Invalid email or password. Please try again.";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }
      alert(errorMessage);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-green-50 font-sans antialiased">
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 space-y-6 bg-white text-green-800 rounded-xl shadow-2xl border-2 border-green-200 transform transition-all duration-300 hover:scale-105">
          <h1 className="text-3xl font-extrabold text-center mb-6 drop-shadow-sm">
            Welcome Back to Zeroly!
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold mb-1 opacity-90"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your.email@example.com"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-inner bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 ease-in-out"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold mb-1 opacity-90"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Your password"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-inner bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 ease-in-out"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-green-600 text-white font-extrabold rounded-full shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-60 disabled:cursor-not-allowed uppercase tracking-wider transform transition-all duration-150 ease-in-out hover:scale-105"
            >
              Login
            </button>
          </form>
          <p className="text-center text-sm mt-4 opacity-90">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-green-700 hover:text-green-900 underline transition duration-200"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
