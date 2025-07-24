// // client/src/components/ItemCard.jsx
// import React from "react";

// const ItemCard = ({ item, onDelete }) => {
//   // <-- Add onDelete prop
//   return (
//     <div className="bg-white border rounded-lg overflow-hidden shadow-lg">
//       <img
//         src={item.imageUrl}
//         alt={item.name}
//         className="w-full h-48 object-cover"
//       />
//       <div className="p-4 flex flex-col">
//         <h2 className="text-xl font-semibold text-gray-900">{item.name}</h2>
//         <p className="text-gray-600 mt-1 flex-grow">{item.category}</p>
//         <button
//           onClick={() => onDelete(item._id)}
//           className="mt-4 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
//         >
//           Delete
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ItemCard;

// client/src/components/ItemCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import StarRating from "./StarRating";


const ItemCard = ({ item, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
      {/* This Link will navigate to the details page for the specific item */}
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
      </div>
      <div className="px-4 pb-4 flex justify-end">
        <button
          onClick={() => onDelete(item._id)}
          className="text-red-500 hover:text-red-700 text-sm font-semibold"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ItemCard;
