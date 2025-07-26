import React from "react";
import { Link } from "react-router-dom";
import StarRating from "./StarRating";

const ItemCard = ({ item, userId, onDelete }) => {
  const isOwner = userId === item.user; 

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
      <Link to={`/item/${item._id}`}>
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-48 object-cover"
        />
      </Link>
      <div className="p-4">
        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mb-2 px-2.5 py-0.5 rounded-full">
          {item.category}
        </span>
        <h3 className="text-lg font-bold text-gray-800 mb-2 truncate">
          <Link to={`/item/${item._id}`} className="hover:text-blue-500">
            {item.name}
          </Link>
        </h3>
        <div className="flex items-center gap-1 mt-1">
          <StarRating value={item.averageRating || 0} readOnly size={16} />
          <span className="text-sm text-gray-500">({item.numReviews || 0})</span>
        </div>
        <p className="text-gray-600 text-sm h-10 overflow-hidden">
          {item.description}
        </p>

      
        {isOwner && (
          <button
            onClick={() => onDelete(item._id)}
            className="mt-3 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default ItemCard;
