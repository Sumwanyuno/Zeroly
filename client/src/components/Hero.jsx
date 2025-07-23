// client/src/components/Hero.jsx
import React from "react";
import { Link } from "react-router-dom";
import heroImg from "../assets/img/hero-img.png"; // Make sure you've copied the assets

const Hero = () => {
  return (
    <section className="w-full flex items-center bg-white">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-12 md:py-24">
        <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
            Turn Unused Goods into Community Good
          </h1>
          <h2 className="text-xl text-gray-600 mt-4">
            A smart, interactive platform for local reuse and sharing.
          </h2>
          <div className="mt-8">
            <Link
              to="/upload"
              className="inline-block bg-green-500 text-white font-bold py-3 px-6 rounded-full hover:bg-green-600 transition duration-300"
            >
              Give an Item
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <img src={heroImg} alt="Hero" className="w-full max-w-md" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
