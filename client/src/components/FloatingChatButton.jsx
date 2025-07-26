// client/src/components/FloatingChatButton.jsx

import React from 'react';

const FloatingChatButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-emerald-600 text-white p-4 rounded-full shadow-lg
                 hover:bg-emerald-700 transition-all duration-300 ease-in-out transform hover:scale-110
                 focus:outline-none focus:ring-4 focus:ring-emerald-300 z-50" // Increased z-index
      title="Open Chat Assistant"
    >
      {/* Chat icon (SVG or Font Awesome) */}
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
        ></path>
      </svg>
    </button>
  );
};

export default FloatingChatButton;