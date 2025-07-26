
// client/src/components/Footer.jsx

import React from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate

// --- IMPORTANT: Ensure these imports match your actual PNG filenames and paths ---
import facebookLogo from '../assets/img/facebook-logo.png';
import instagramLogo from '../assets/img/instagram-logo.png';
import linkedinLogo from '../assets/img/linkedin-logo.png';
import youtubeLogo from '../assets/img/youtube-logo.png';
// --------------------------------------------------------------------------------


const Footer = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  // --- UPDATED: Function to handle the click and navigate ---
  const scrollToHero = (e) => {
    e.preventDefault(); // Prevent default anchor behavior
    console.log("Footer pointer clicked. Attempting to navigate to /#hero-section");

    // Check if already on the homepage
    if (window.location.pathname === '/') {
        // If on homepage, just scroll
        const element = document.getElementById('hero-section');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            console.log("Already on homepage, scrolled directly.");
        } else {
            console.log("Already on homepage, but hero-section not found.");
        }
    } else {
        // If on a different page, navigate to homepage with hash
        navigate('/#hero-section');
        console.log("Navigating to homepage with hash.");
    }
  };

  return (
    <footer className="bg-emerald-800 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Products & Services */}
          <div>
            <h3 className="text-xl font-bold mb-4">Products & Services</h3>
            <p>
              • Item Listings<br/>
              • Community Exchange & Sharing<br/>
              • Eco-Friendly Pickup Services<br/>
              • Sustainable Living Tips<br/>
              • Verified Donor & Recipient Profiles<br/>
              • Circular Economy Projects & Events
            </p>
          </div>

          {/* Useful Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Useful Links</h4>
            <ul>
              <li className="mb-2">
                <Link to="/" className="hover:text-gray-300">
                  Home
                </Link>
              </li>
              {/* Item Listing Link */}
              <li className="mb-2">
                <Link to="/#hero-section" className="hover:text-gray-300">
                  Item Listing
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/about" className="hover:text-gray-300">
                  About us
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/terms" className="hover:text-gray-300">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="font-bold text-lg mb-4">Contact Us</h4>
            <p>
              Headquarters: Jabalpur, Madhya Pradesh, (482001)
              <br />
              India
            </p>
            <p className="mt-4">
              <strong>Phone:</strong> +91 8269XXXXXX <br/>
              +91 6260XXXXXX
            </p>
            <p>
              <strong>Email:</strong> info@zeroly.com
            </p>
          </div>

          {/* Social Media Section */}
          <div>
            <h4 className="font-bold text-lg mb-4">Join Our Community</h4>
            <p className="mb-4">Follow us on social media to stay updated.</p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                 className="inline-block" title="Facebook">
                <img src={facebookLogo} alt="Facebook" className="w-6 h-6 filter invert" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                 className="inline-block" title="Instagram">
                <img src={instagramLogo} alt="Instagram" className="w-6 h-6 filter invert" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                 className="inline-block" title="LinkedIn">
                <img src={linkedinLogo} alt="LinkedIn" className="w-6 h-6 filter invert" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"
                 className="inline-block" title="YouTube">
                <img src={youtubeLogo} alt="YouTube" className="w-6 h-6 filter invert" />
              </a>
            </div>
          </div>

        </div>

        <div className="text-center mt-10 pt-8 border-t border-emerald-700 flex flex-col sm:flex-row justify-center items-center">
          <p className="mb-2 sm:mb-0 sm:mr-4">
            © Copyright{" "}
            <strong>
              <span>Zeroly</span>
            </strong>
            . All Rights Reserved
          </p>
          <p className="text-sm sm:mr-4">
            Designed by Team Zeroly
          </p>
          {/* --- UPDATED: Back to Top Pointer with onClick handler and useNavigate --- */}
          <a
            href="/#hero-section" // Keep href for accessibility/fallback
            onClick={scrollToHero} // Use onClick to trigger our custom function
            className="text-white hover:text-gray-300 transition-colors duration-300 mt-2 sm:mt-0"
            title="Back to Top"
          >
            <svg
              className="w-6 h-6 inline-block ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              ></path>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;