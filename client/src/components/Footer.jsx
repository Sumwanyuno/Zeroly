import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-brand-light text-brand-dark py-8 border-t border-brand-border font-sans">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left Side: Copyright */}
          <div className="text-gray-600 font-medium text-sm text-center md:text-left">
            © 2026 Zeroly. Reuse. Reconnect. Renew.
          </div>

          {/* Right Side: Links */}
          <div className="flex items-center gap-8 text-sm font-semibold text-gray-700">
            <Link to="/about" className="hover:text-brand-green transition">
              About
            </Link>
            <Link to="/privacy" className="hover:text-brand-green transition">
              Privacy
            </Link>
            <Link to="/contact" className="hover:text-brand-green transition">
              Contact
            </Link>
          </div>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;