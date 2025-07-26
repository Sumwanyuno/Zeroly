
// client/src/components/Hero.jsx

import React, { forwardRef } from "react"; 
import { Link } from "react-router-dom";


import { Swiper, SwiperSlide } from 'swiper/react';


import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';


import { Autoplay, Pagination, Navigation } from 'swiper/modules';


import myNewBackground from "../assets/img/my-new-background.png";


import recycleImgMain from "../assets/img/recycle.png";
import recycleImg1 from "../assets/img/recycle1.png";
import recycleImg2 from "../assets/img/recycle2.png";
import recycleImg3 from "../assets/img/recycle3.png";
import recycleImg4 from "../assets/img/recycle4.png";



const recycleImages = [
  recycleImg1,
  recycleImgMain,
  recycleImg2,
  recycleImg3,
  recycleImg4,
];


const Hero = forwardRef((props, ref) => { 
  return (
    <section
      ref={ref} 
      id="hero-section" 
      className="w-full flex items-center bg-no-repeat bg-center"
      style={{
        backgroundImage: `url(${myNewBackground})`,
        backgroundSize: '100% auto'
      }}
    >
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-12 md:py-24 relative z-10">
        <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-semibold text-white leading-tight drop-shadow-lg">
            Because Giving Things a Second Life is the First Step to a Greener Planet.
          </h1>
          <h2 className="text-xl text-white mt-4 drop-shadow">
            A smart, interactive platform for local reuse and sharing.<br/>
            Join the Movement with Zeroly!
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
          <Swiper
            spaceBetween={30}
            centeredSlides={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            navigation={true}
            modules={[Autoplay, Pagination, Navigation]}
            className="mySwiper w-full max-w-md glowing-border"
          >
            {recycleImages.map((image, index) => (
              <SwiperSlide key={index}>
                <img
                  src={image}
                  alt={`Recycling and reuse illustration ${index + 1}`}
                  className="w-full h-auto object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}); 

export default Hero;