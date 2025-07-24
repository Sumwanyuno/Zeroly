// // client/src/components/Hero.jsx
// import React from "react";
// import { Link } from "react-router-dom";
// import heroImg from "../assets/img/hero-img.png"; // Make sure you've copied the assets

// const Hero = () => {
//   return (
//     <section className="w-full flex items-center bg-white">
// //       <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-12 md:py-24">
// //         <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
// //           <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
// //             Turn Unused Goods into Community Good
// //           </h1>
// //           <h2 className="text-xl text-gray-600 mt-4">
// //             A smart, interactive platform for local reuse and sharing.
// //           </h2>
// //           <div className="mt-8">
// //             <Link
// //               to="/upload"
// //               className="inline-block bg-green-500 text-white font-bold py-3 px-6 rounded-full hover:bg-green-600 transition duration-300"
// //             >
// //               Give an Item
// //             </Link>
// //           </div>
// //         </div>
// //         <div className="md:w-1/2 flex justify-center">
// //           <img src={heroImg} alt="Hero" className="w-full max-w-md" />
// //         </div>
// //       </div>
// //     </section>
// //   );
// // };

// // export default Hero;
// import React from "react";
// import { Link } from "react-router-dom";

// // Import Swiper React components
// import { Swiper, SwiperSlide } from 'swiper/react';

// // Import Swiper styles
// import 'swiper/css';
// import 'swiper/css/pagination';
// import 'swiper/css/navigation';

// // import required Swiper modules
// import { Autoplay, Pagination, Navigation } from 'swiper/modules';

// // --- IMAGE IMPORTS ---
// import recycleImgMain from "../assets/img/recycle.png";
// import recycleImg1 from "../assets/img/recycle1.png";
// import recycleImg2 from "../assets/img/recycle2.png";
// import recycleImg3 from "../assets/img/recycle3.png";
// import recycleImg4 from "../assets/img/recycle4.png";

// // --- ARRAY OF IMAGE PATHS ---
// const recycleImages = [
//   recycleImg1,
//   recycleImgMain,
//   recycleImg2,
//   recycleImg3,
//   recycleImg4,
// ];

// const Hero = () => {
//   return (
//     <section className="w-full flex items-center bg-green-100">
//       <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-12 md:py-24">
//         <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
//           {/* --- CHANGED H1 STYLING HERE (font-semibold and text-gray-800) --- */}
//           <h1 className="text-4xl md:text-5xl font-semibold text-gray-800 leading-tight">
//             Because Giving Things a Second Life is the First Step to a Greener Planet.
//           </h1>
//           <h2 className="text-xl text-gray-600 mt-4">
//             A smart, interactive platform for local reuse and sharing.<br/>
//             Join the Movement with Zeroly!
//           </h2>
//           <div className="mt-8">
//             <Link
//               to="/upload"
//               className="inline-block bg-green-500 text-white font-bold py-3 px-6 rounded-full hover:bg-green-600 transition duration-300"
//               >
//               Give an Item
//             </Link>
//           </div>
//         </div>
//         <div className="md:w-1/2 flex justify-center">
//           {/* Swiper Component with glowing-border class */}
//           <Swiper
//             spaceBetween={30}
//             centeredSlides={true}
//             autoplay={{
//               delay: 3000,
//               disableOnInteraction: false,
//             }}
//             pagination={{
//               clickable: true,
//             }}
//             navigation={true}
//             modules={[Autoplay, Pagination, Navigation]}
//             className="mySwiper w-full max-w-md glowing-border"
//           >
//             {/* Map over your recycleImages array to create slides */}
//             {recycleImages.map((image, index) => (
//               <SwiperSlide key={index}>
//                 <img
//                   src={image}
//                   alt={Recycling and reuse illustration ${index + 1}}
//                   className="w-full h-auto object-cover"
//                 />
//               </SwiperSlide>
//             ))}
//           </Swiper>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Hero;

import React from "react";
import { Link } from "react-router-dom";

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required Swiper modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

// --- IMAGE IMPORTS ---
import recycleImgMain from "../assets/img/recycle.png";
import recycleImg1 from "../assets/img/recycle1.png";
import recycleImg2 from "../assets/img/recycle2.png";
import recycleImg3 from "../assets/img/recycle3.png";
import recycleImg4 from "../assets/img/recycle4.png";

// --- ARRAY OF IMAGE PATHS ---
const recycleImages = [
  recycleImg1,
  recycleImgMain,
  recycleImg2,
  recycleImg3,
  recycleImg4,
];

const Hero = () => {
  return (
    <section className="w-full flex items-center bg-green-100">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-12 md:py-24">
        <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
          {/* --- CHANGED H1 STYLING HERE (font-semibold and text-gray-800) --- */}
          <h1 className="text-4xl md:text-5xl font-semibold text-gray-800 leading-tight">
            Because Giving Things a Second Life is the First Step to a Greener Planet.
          </h1>
          <h2 className="text-xl text-gray-600 mt-4">
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
          {/* Swiper Component with glowing-border class */}
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
            {/* Map over your recycleImages array to create slides */}
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
};

  export default Hero;