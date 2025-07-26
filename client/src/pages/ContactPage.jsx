

// client/src/pages/ContactPage.jsx

import React, { useState } from 'react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', message: '' }); // Clear form
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 min-h-screen font-sans py-16 flex items-center justify-center">
      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        {/* Main Heading Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-green-800 leading-tight mb-4 drop-shadow-lg">
            <span role="img" aria-label="handshake" className="mr-3 text-5xl md:text-6xl">🤝</span>
            Let’s Connect. Share. Build a sustainable future with Zeroly!!
          </h1>
          <p className="text-xl text-gray-600 italic font-medium">
            "Every shared item is a step toward a cleaner, greener world. With Zeroly, let’s turn opportunities into sustainable actions!"
          </p>
        </div>

        {/* Contact Cards Section */}
        <div className="flex flex-col md:flex-row gap-10 justify-center items-stretch">
          {/* Contact Me Card */}
          <div className="bg-white rounded-xl shadow-2xl p-10 flex flex-col justify-between w-full md:w-1/2 lg:w-2/5
                          transform transition-all duration-300 ease-in-out hover:scale-102 hover:shadow-3xl">
            <div>
              <h2 className="text-3xl font-bold text-green-700 mb-6 border-b-2 border-green-200 pb-3">Contact Us</h2>
              <div className="space-y-4">
                <p className="text-gray-700 text-lg flex items-center">
                  <span className="mr-3 text-green-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </span> {/* <--- CORRECTED: Closing span tag for the icon */}
                  <strong>Name:</strong> <br/> Sneha <br/>
                  Samarth khare<br/>
                
                </p>
                <p className="text-gray-700 text-lg flex items-center">
                  <span className="mr-3 text-green-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                  </span> {/* <--- CORRECTED: Closing span tag for the icon */}
                  <strong>Phone:</strong> <br/>8439XXXXX<br/>
                  9174XXXXXX
                </p>
              </div>
            </div>
            <p className="text-green-600 font-medium italic mt-8 text-center">
              "Hope this would have helped you!" 😊
            </p>
          </div>

          {/* Drop Us a Message Form */}
          <div className="bg-white rounded-xl shadow-2xl p-10 w-full md:w-1/2 lg:w-3/5
                          transform transition-all duration-300 ease-in-out hover:scale-102 hover:shadow-3xl">
            <h2 className="text-3xl font-bold text-green-700 mb-6 border-b-2 border-green-200 pb-3">Drop Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                  required
                />
              </div>
              <div>
                <textarea
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-y transition duration-200"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white font-bold py-3.5 rounded-lg hover:bg-green-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform hover:scale-100"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;