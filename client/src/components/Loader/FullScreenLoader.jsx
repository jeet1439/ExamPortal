import React from "react";
import CircleLoader from "./CircleLoader"; // Your provided loader

const FullScreenLoader = () => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <CircleLoader/>
    </div>
  );
};

export default FullScreenLoader;