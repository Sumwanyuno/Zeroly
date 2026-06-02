// client/src/components/ChatModal.jsx

import React from 'react';
import ChatPage from '../pages/ChatPage'; 

const ChatModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-4 w-11/12 max-w-lg h-3/4 max-h-[600px] flex flex-col relative">
  
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold focus:outline-none"
          title="Close Chat"
        >
          &times;
        </button>

       
        <div className="text-center pb-3 border-b border-gray-200 mb-4">
          <h2 className="text-xl font-semibold text-emerald-700">Zeroly Chat Assistant</h2>
        </div>

        <div className="flex-1 overflow-hidden">
         
          <ChatPage inModal={true} />
        </div>
      </div>
    </div>
  );
};

export default ChatModal;