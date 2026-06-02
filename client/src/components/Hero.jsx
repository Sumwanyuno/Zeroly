import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="w-full flex items-center bg-brand-light py-16 md:py-24 relative overflow-hidden font-sans">
      {/* Abstract Background element */}
      <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-gradient-to-tr from-brand-pill to-transparent rounded-full opacity-60 blur-3xl -z-10 pointer-events-none"></div>

      <div className="container mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10 max-w-7xl">
        
        {/* Left Column */}
        <div className="lg:w-1/2 text-center lg:text-left">
          {/* Live Platform Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-border bg-transparent text-brand-green font-semibold text-xs tracking-wider mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse"></span>
            LIVE PLATFORM
          </div>

          <h1 className="text-5xl md:text-7xl font-serif font-extrabold text-brand-dark leading-[1.1] mb-6 tracking-tight">
            Giving <br className="hidden md:block" />
            things a <br className="hidden md:block" />
            <span className="italic text-brand-green font-medium">second life</span> <br className="hidden md:block" />
            greens the <br className="hidden md:block" />
            planet.
          </h1>

          <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-md mx-auto lg:mx-0 leading-relaxed font-sans">
            A smart, community-powered platform for local reuse and sharing. Reduce waste, find treasures, and join the circular economy movement.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-12">
            <Link
              to="/upload"
              className="px-10 py-4 bg-transparent border border-brand-border text-gray-800 font-semibold rounded-2xl hover:bg-white transition shadow-sm w-full sm:w-auto text-center"
            >
              Give an<br/>Item
            </Link>
            <Link
              to="/"
              className="px-10 py-4 bg-transparent border border-brand-border text-gray-800 font-semibold rounded-2xl hover:bg-white transition shadow-sm w-full sm:w-auto text-center"
            >
              Browse<br/>Listings
            </Link>
          </div>


        </div>

        {/* Right Column */}
        <div className="lg:w-1/2 relative mt-16 lg:mt-0 flex justify-center lg:justify-end pr-0 lg:pr-8">
          
          <div className="relative w-full max-w-md">
            {/* Floating pill 1 */}
            <div className="absolute -top-5 -left-4 md:-left-12 bg-white px-4 py-2 rounded-xl shadow-md border border-gray-100 flex items-center gap-2 z-20 text-sm font-semibold text-gray-700 animate-bounce">
              <span className="w-2 h-2 rounded-full bg-brand-green"></span>
              1,240 items given away
            </div>
            
            {/* Main Impact Card */}
            <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-50 relative z-10 w-full">
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 rounded-full bg-[#ebf3ea] flex items-center justify-center relative">
                  {/* Recycle Icon using CSS arrows to mimic the design */}
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 4L12 11" stroke="#377d3f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 4L8 8" stroke="#377d3f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 4L16 8" stroke="#377d3f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      
                      <path d="M7.5 17L11 11" stroke="#377d3f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M7.5 17L12.5 18.5" stroke="#377d3f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M7.5 17L4.5 12" stroke="#377d3f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>

                      <path d="M16.5 17L13 11" stroke="#377d3f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16.5 17L11.5 18.5" stroke="#377d3f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16.5 17L19.5 12" stroke="#377d3f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
              
              <h3 className="text-[1.35rem] font-serif font-bold text-brand-dark text-center mb-2">Community Impact</h3>
              <p className="text-[#64748b] text-sm text-center mb-8 px-2">Every item shared is a step toward a greener neighbourhood</p>
              
              <div className="border-t border-gray-100 pt-6 grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-2xl font-bold text-brand-green mb-1 font-serif">4.2k</div>
                  <div className="text-[0.65rem] text-gray-500 font-semibold uppercase tracking-wider">Items listed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-brand-green mb-1 font-serif">890</div>
                  <div className="text-[0.65rem] text-gray-500 font-semibold uppercase tracking-wider">Members</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-brand-green mb-1 font-serif">98%</div>
                  <div className="text-[0.65rem] text-gray-500 font-semibold uppercase tracking-wider">Happy givers</div>
                </div>
              </div>
            </div>

            {/* Floating pill 2 */}
            <div className="absolute -bottom-5 left-0 md:-left-10 bg-white px-4 py-2 rounded-xl shadow-md border border-gray-100 flex items-center gap-2 z-20 text-sm font-semibold text-gray-700 animate-bounce" style={{ animationDelay: '0.5s' }}>
              <span className="w-2 h-2 rounded-full bg-brand-green"></span>
              320 kg waste saved
            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default Hero;