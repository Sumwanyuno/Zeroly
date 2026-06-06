import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Trash2, MapPin, Coins } from "lucide-react";

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

    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="h-full"
    >
      <Card className="overflow-hidden h-full flex flex-col group bg-card/40 backdrop-blur-xl border border-border/40 hover:border-primary/30 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative">
        {/* Floating Glassmorphic Category Badge */}
        <span className="absolute top-3 right-3 z-10 bg-background/70 backdrop-blur-md border border-border/40 text-foreground text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm select-none">
          {item.category}
        </span>

        {/* Floating Status Badge (if not available) */}
        {item.status && item.status !== "available" && (
          <span className={`absolute ${isOwner ? "top-3 left-14" : "top-3 left-3"} z-10 text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm select-none backdrop-blur-md border ${
            item.status === "requested" 
              ? "bg-amber-500/80 text-white border-amber-400/30" 
              : "bg-blue-500/80 text-white border-blue-400/30"
          }`}>
            {item.status}
          </span>
        )}

        {/* Floating Delete Button (For Owner) */}
        {isOwner && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onDelete(item._id);
            }}
            className="mt-4 bg-red-100 text-red-600 font-semibold text-sm px-3 py-1.5 rounded-lg hover:bg-red-200 transition"
          >
            Delete Item
              e.stopPropagation();
              onDelete(item._id);
            }}
            className="absolute top-3 left-3 z-10 bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/20 hover:border-destructive/30 backdrop-blur-md w-9 h-9 rounded-full flex items-center justify-center shadow-sm cursor-pointer transition-all duration-200 hover:scale-105"
            title="Delete Listing"
          >
            <Trash2 className="w-4.5 h-4.5" />
          </button>
        )}

        {/* Image Section */}
        <Link to={`/item/${item._id}`} className="overflow-hidden block aspect-[4/3] relative group-hover:after:opacity-100 after:absolute after:inset-0 after:bg-gradient-to-t after:from-background/25 after:to-transparent after:opacity-0 after:transition-opacity after:duration-300">
          <img
            src={item.imageUrl || "/placeholder-item.png"}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Content Section */}
        <CardHeader className="p-5 pb-4 flex-grow text-left">
          <div className="flex flex-col h-full justify-between">
            <div>
              {/* Star rating */}
              <div className="flex items-center gap-1.5 mb-2.5">
                <span className="text-amber-500 text-sm font-bold">★</span>
                <span className="text-xs font-bold text-foreground">
                  {item.averageRating && item.averageRating > 0 ? item.averageRating.toFixed(1) : "New"}
                </span>
                {item.numReviews > 0 && (
                  <span className="text-xs text-muted-foreground font-semibold">
                    ({item.numReviews})
                  </span>
                )}
              </div>

              {/* Item Title */}
              <h3 className="text-lg font-extrabold text-foreground tracking-tight line-clamp-1 group-hover:text-primary transition-colors duration-200">
                <Link to={`/item/${item._id}`} className="block w-full">
                  {item.name}
                </Link>
              </h3>

              {/* Item Description */}
              <p className="text-muted-foreground text-xs leading-relaxed mt-2 line-clamp-2 h-8">
                {item.description}
              </p>
            </div>

            {/* EcoSeeds Price Section */}
            <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-border/20">
              <span className="text-xs text-muted-foreground font-semibold">Required Seeds</span>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs shadow-sm">
                <Coins className="w-3.5 h-3.5 text-emerald-500" />
                <span>{item.ecoSeeds || 10} EcoSeeds</span>
              </div>
            </div>
          </div>
        </CardHeader>

        {/* Footer Address Panel */}
        <CardContent className="p-5 pt-4 mt-auto border-t border-border/30 bg-secondary/10">
          <div className="flex items-center gap-2 text-muted-foreground/85 hover:text-foreground transition-colors duration-200">
            <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
            <span className="text-xs font-medium truncate select-none">
              {item.address || "Local Sharing"}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ItemCard;
