import React, { useState } from "react";
import api from "../api"; // 👈 your custom axios instance

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/contact", formData);
      if (res.status === 200 || res.status === 201) {
        alert("Thanks for contacting us!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        alert("Please try again later.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-100 min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
        {/* Left: Contact Info */}
        <div className="bg-white p-10 rounded-2xl shadow-lg transform transition duration-300 hover:scale-[1.015]">
          <h2 className="text-3xl font-extrabold text-green-700 mb-6">
            🌿 Let’s Connect & Build a Greener Future!
          </h2>
          <p className="text-gray-700 text-lg italic mb-8">
            “Your one message can spark a sustainable change. Reach out!”
          </p>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <span className="text-green-600 mt-1">📛</span>
              <div>
                <h4 className="font-semibold text-lg text-gray-800">
                  Team Leads
                </h4>
                <p>Sneha</p>
                <p>Samarth Khare</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-green-600 mt-1">📞</span>
              <div>
                <h4 className="font-semibold text-lg text-gray-800">Phone</h4>
                <p>8439XXXXX</p>
                <p>9174XXXXXX</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-green-600 mt-1">📬</span>
              <div>
                <h4 className="font-semibold text-lg text-gray-800">Email</h4>
                <p>teamzeroly@gmail.com</p>
              </div>
            </div>
          </div>
          <p className="text-green-600 font-medium italic mt-10 text-center">
            "Hope this helps!" 😊
          </p>
        </div>

        {/* Right: Form */}
        <div className="bg-white p-10 rounded-2xl shadow-lg transform transition duration-300 hover:scale-[1.015]">
          <h2 className="text-3xl font-extrabold text-green-700 mb-6 border-b pb-3">
            💬 Drop Us a Message
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="w-full border border-gray-300 px-5 py-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              className="w-full border border-gray-300 px-5 py-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              required
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              rows="6"
              className="w-full border border-gray-300 px-5 py-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-y"
              required
            />
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-lg transition-all duration-300"
            >
              🚀 Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
