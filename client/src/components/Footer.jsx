// client/src/components/Footer.jsx

import React from "react";
import { Link } from "react-router-dom";

// --- IMPORTANT: Ensure these imports match your actual PNG filenames and paths ---
// You MUST place your monochrome social media logo PNG files
// into your client/src/assets/img/ folder for these imports to work.
import facebookLogo from '../assets/img/facebook-logo.png';
import instagramLogo from '../assets/img/instagram-logo.png';
import linkedinLogo from '../assets/img/linkedin-logo.png';
import youtubeLogo from '../assets/img/youtube-logo.png';
// --------------------------------------------------------------------------------


const Footer = () => {
  return (
    <footer className="bg-emerald-800 text-white py-12"> {/* --- UPDATED: Dark Green background, White text --- */}
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section (now "Products & Services") */}
          <div>
            <h3 className="text-xl font-bold mb-4">Products & Services</h3> {/* Removed text-gray-800, now inherits white */}
            <p>
              • Item Listings<br/>
              • Community Exchange & Sharing<br/>
              • Eco-Friendly Pickup Services<br/>
              • Sustainable Living Tips<br/>
              • Verified Donor & Recipient Profiles<br/>
              • Circular Economy Projects & Events
            </p>
          </div>

          {/* Useful Links - FULLY UPDATED with Item Listing link */}
          <div>
            <h4 className="font-bold text-lg mb-4">Useful Links</h4>
            <ul>
              <li className="mb-2">
                <Link to="/" className="hover:text-gray-300"> {/* Changed hover color for dark background */}
                  Home
                </Link>
              </li>
              {/* --- Item Listing Link --- */}
              <li className="mb-2">
                <Link to="/" className="hover:text-gray-300"> {/* Changed hover color for dark background */}
                  Item Listing
                </Link>
              </li>
              {/* --- END LINK --- */}
              <li className="mb-2">
                <Link to="/about" className="hover:text-gray-300"> {/* Changed hover color for dark background */}
                  About us
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/terms" className="hover:text-gray-300"> {/* Changed hover color for dark background */}
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

          {/* Social Media Section - FULLY UPDATED with PNGs and filter invert */}
          <div>
            <h4 className="font-bold text-lg mb-4">Join Our Community</h4>
            <p className="mb-4">Follow us on social media to stay updated.</p> {/* Added mb-4 for spacing */}
            <div className="flex space-x-4"> {/* Flex container for icons */}
              {/* Facebook Icon */}
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                 className="inline-block" title="Facebook">
                {/* --- ADDED filter invert: will turn black/dark logos white --- */}
                <img src={facebookLogo} alt="Facebook" className="w-6 h-6 filter invert" /> 
              </a>
              {/* Instagram Icon */}
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                 className="inline-block" title="Instagram">
                {/* --- ADDED filter invert: will turn black/dark logos white --- */}
                <img src={instagramLogo} alt="Instagram" className="w-6 h-6 filter invert" />
              </a>
              {/* LinkedIn Icon */}
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                 className="inline-block" title="LinkedIn">
                {/* --- ADDED filter invert: will turn black/dark logos white --- */}
                <img src={linkedinLogo} alt="LinkedIn" className="w-6 h-6 filter invert" />
              </a>
              {/* YouTube Icon */}
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"
                 className="inline-block" title="YouTube">
                {/* --- ADDED filter invert: will turn black/dark logos white --- */}
                <img src={youtubeLogo} alt="YouTube" className="w-6 h-6 filter invert" />
              </a>
            </div>
          </div>
          {/* --- END: Social Media Section --- */}

        </div>

        <div className="text-center mt-10 pt-8 border-t border-emerald-700"> {/* Changed border color for dark background */}
          <p>
            © Copyright{" "}
            <strong>
              <span>Zeroly</span>
            </strong>
            . All Rights Reserved
          </p>
          <p className="text-sm mt-2">
            Designed by Team Zeroly
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;