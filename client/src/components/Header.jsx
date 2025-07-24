// client/src/components/Header.jsx

import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Zerolylogo from "../assets/Zerolylogo.png"; // Make sure the path is correct

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md py-4 px-6 fixed w-full z-50 rounded-b-xl">
      <nav className="flex items-center justify-between max-w-7xl mx-auto">
        <Link to="/" className="flex items-center space-x-2">
          <img
            src={Zerolylogo}
            alt="Zeroly Logo"
            className="h-10 w-auto rounded-full"
          />
          <span className="text-2xl font-bold text-green-700">Zeroly</span>
        </Link>

        <div className="flex items-center space-x-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-gray-600 hover:text-green-700 transition duration-300 ease-in-out font-medium ${
                isActive ? "text-green-700 border-b-2 border-green-700" : ""
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/upload"
            className={({ isActive }) =>
              `text-gray-600 hover:text-green-700 transition duration-300 ease-in-out font-medium ${
                isActive ? "text-green-700 border-b-2 border-green-700" : ""
              }`
            }
          >
            Upload Item
          </NavLink>
          <NavLink
            to="/requests"
            className={({ isActive }) =>
              `text-gray-600 hover:text-green-700 transition duration-300 ease-in-out font-medium ${
                isActive ? "text-green-700 border-b-2 border-green-700" : ""
              }`
            }
          >
            Requests
          </NavLink>
          <NavLink
            to="/leaderboard" // New Leaderboard Link
            className={({ isActive }) =>
              `text-gray-600 hover:text-green-700 transition duration-300 ease-in-out font-medium ${
                isActive ? "text-green-700 border-b-2 border-green-700" : ""
              }`
            }
          >
            Leaderboard
          </NavLink>

          {user ? (
            <>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `text-gray-600 hover:text-green-700 transition duration-300 ease-in-out font-medium ${
                    isActive ? "text-green-700 border-b-2 border-green-700" : ""
                  }`
                }
              >
                Profile
              </NavLink>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out shadow-md"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out shadow-md"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
