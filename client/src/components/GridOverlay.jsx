import React from "react";

const GridOverlay = ({ dark = false }) => {
  const opacityClass = dark ? "opacity-[0.03]" : "opacity-10";

  return (
    <div className={`absolute inset-0 -z-10 h-full w-full bg-grid-pattern pointer-events-none ${opacityClass}`} />
  );
};

export default GridOverlay;
