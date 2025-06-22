import React from "react";

const CircleLoader = ({
  size = "64px",
  color = "#6366F1",
  className = "",
}) => {
  const loaderStyle = {
    width: size,
    height: size,
    border: `4px solid`,
    borderColor: `${color} transparent ${color} transparent`,
    borderRadius: "50%",
    display: "inline-block",
    animation: "spin 0.4s linear infinite",
  };

  const keyframes = `
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <div className={`simple-spinner ${className}`} style={loaderStyle}></div>
    </>
  );
};

export default CircleLoader;
