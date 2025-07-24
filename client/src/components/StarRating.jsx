import React from "react";

const Star = ({ filled, onClick }) => (
  <span
    style={{ cursor: onClick ? "pointer" : "default", fontSize: "20px", color: "gold" }}
    onClick={onClick}
  >
    {filled ? "★" : "☆"}
  </span>
);

const StarRating = ({ value = 0, onChange, readOnly = false }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star key={i} filled={i <= value} onClick={!readOnly ? () => onChange(i) : undefined} />
    );
  }
  return <div>{stars}</div>;
};

export default StarRating;
