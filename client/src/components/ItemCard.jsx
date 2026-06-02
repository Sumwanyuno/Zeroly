import React from "react";
import { Link } from "react-router-dom";

const ItemCard = ({ item, userId, onDelete }) => {
  const isOwner = userId === item.user;

  return (
    <div className="bg-[#f0f6f0] rounded-[1.5rem] shadow-sm border border-brand-border overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 flex flex-col">
      <Link to={`/item/${item._id}`} className="block relative w-full pt-[80%] bg-[#e6f0e6]">
        {/* We use pt-[80%] trick for aspect ratio, and absolute positioning for image to maintain layout if images vary */}
        <img
          src={item.imageUrl}
          alt={item.name}
          className="absolute inset-0 w-full h-full object-contain p-6 mix-blend-multiply"
        />
      </Link>
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-3">
          <span className="inline-block bg-[#d4e6d4] text-[#2c6e33] text-[0.65rem] font-bold tracking-wider px-3 py-1 rounded-full uppercase">
            {item.category || "General"}
          </span>
        </div>
        <h3 className="text-[1.15rem] leading-tight font-bold text-gray-800 mb-3 line-clamp-2">
          <Link to={`/item/${item._id}`} className="hover:text-brand-green">
            {item.name}
          </Link>
        </h3>
        
        <div className="flex items-center text-gray-500 text-sm mt-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-brand-green opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate text-sm font-medium">{item.address || "Local, MP"}</span>
        </div>

        {isOwner && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onDelete(item._id);
            }}
            className="mt-4 bg-red-100 text-red-600 font-semibold text-sm px-3 py-1.5 rounded-lg hover:bg-red-200 transition"
          >
            Delete Item
          </button>
        )}
      </div>
    </div>
  );
};

export default ItemCard;
