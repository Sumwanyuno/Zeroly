// client/src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Zeroly</h3>
            <p>
              A platform to turn unused goods into community good, promoting
              local reuse and sharing.
            </p>
          </div>

          {/* Useful Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Useful Links</h4>
            <ul>
              <li className="mb-2">
                <Link to="/" className="hover:text-blue-500">
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/about" className="hover:text-blue-500">
                  About us
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/terms" className="hover:text-blue-500">
                  Terms of service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="font-bold text-lg mb-4">Contact Us</h4>
            <p>
              Jabalpur, Madhya Pradesh
              <br />
              India
            </p>
            <p className="mt-4">
              <strong>Phone:</strong> +1 234 567 890
            </p>
            <p>
              <strong>Email:</strong> info@zeroly.com
            </p>
          </div>

          {/* Social Media (Optional) */}
          <div>
            <h4 className="font-bold text-lg mb-4">Join Our Community</h4>
            <p>Follow us on social media to stay updated.</p>
            {/* You can add social media icons here later */}
          </div>
        </div>

        <div className="text-center mt-10 pt-8 border-t border-gray-300">
          <p>
            &copy; Copyright{" "}
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
