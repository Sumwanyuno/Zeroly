// client/src/pages/FAQPage.jsx

import React, { useState } from 'react'; 
import { Link } from 'react-router-dom';

const FAQPage = () => {
 
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is Zeroly's main mission?",
      answer: "Zeroly is a sustainable sharing platform where people can donate or request unused items to reduce waste and promote reuse in their local community."
    },
    {
      question: "How does Zeroly work?",
      answer: "List an item you no longer need, Browse available items listed by others, Request or contact the owner through the built-in messaging system, Exchange items locally and leave a review."
    },

    {
      question: "Can I request an item if I don't have anything to donate?",
      answer: "Yes, absolutely! Zeroly is for both donors and recipients. You can browse available items and request those you need, even if you don't have items to give away at the moment."
    },
    
    {
      question: "What is the Leaderboard for?",
      answer: "The Leaderboard is a dynamic feature that highlights top contributors in the Zeroly community. It recognizes users who donate or receive the most items, encouraging active participation and friendly competition in our mission."
    },
    {
      question: "How do I earn a rank on the leaderboard?",
      answer: "Users gain points by donating or requesting items. The leaderboard highlights top contributors to motivate sustainable actions."
    },
    {
      question: "Is Zeroly available in all cities?",
      answer: "Zeroly is continuously expanding. Please check our 'Contact Us' or 'About Us' section for information on current service areas and future expansion plans."
    },
    {
      question: "Why should I use Zeroly?",
      answer: "Because every item shared reduces waste, helps someone in need, and contributes to a circular economy."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index); 
  };

  return (
    <div className="bg-green-50 min-h-screen font-sans py-12">
      <div className="container mx-auto px-4 md:px-8">
        <div className="bg-white rounded-xl shadow-2xl p-6 md:p-12"> 
          <h1 className="text-4xl md:text-5xl font-extrabold text-green-800 text-center mb-10">
            Frequently Asked Questions
          </h1>

          <div className="space-y-6"> 
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-green-200 rounded-lg overflow-hidden
                           transition-all duration-300 ease-in-out
                           hover:border-green-400 hover:shadow-md"
              >
                <button
                  className="w-full text-left p-5 flex justify-between items-center
                             bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2
                             focus:ring-green-500 focus:ring-offset-2 text-green-800
                             font-semibold text-xl cursor-pointer"
                  onClick={() => toggleFAQ(index)}
                >
                  {faq.question}
                  <svg
                    className={`w-6 h-6 transform transition-transform duration-300 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </button>
                {openIndex === index && (
                  <div className="p-5 bg-white text-gray-700 text-lg leading-relaxed border-t border-green-100">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12 pt-8 border-t border-gray-200"> 
            <p className="text-gray-600 text-lg">
              Still have questions? Feel free to{" "}
              <Link to="/contact" className="text-green-600 hover:underline font-medium">
                contact us
              </Link>
              !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;