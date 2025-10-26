import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api"; // ✅ Use the configured axios instance

const RegisterPage = () => {
  // ... (rest same)

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/users/register", {
        // ✅ simplified URL
        name,
        email,
        password,
      });

      if (typeof login === "function") {
        login(data);
        alert("Registration successful! Welcome to Zeroly!");
        navigate("/");
      } else {
        console.warn("AuthContext login function is not available.");
        navigate("/login");
      }
    } catch (error) {
      // ... (same error handling)
    }
  };

  // ... (return JSX same)
};

export default RegisterPage;
