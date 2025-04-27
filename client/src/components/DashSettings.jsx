import React, { useEffect } from "react";

const DashSettings = ({ bgColor, setBgColor, darkMode, setDarkMode }) => {
  useEffect(() => {
    if (darkMode) {
      document.body.style.backgroundColor = "#1E293B"; // Soft dark blue
      document.body.style.color = "#E0E0E0"; // Light gray text
    } else {
      document.body.style.backgroundColor = bgColor; // Restore default
      document.body.style.color = "#000000"; // Default black text
    }
  }, [darkMode, bgColor]);

  return (
    <div className={`p-6 shadow-md rounded-lg ${darkMode ? "bg-[#1E293B] text-[#E0E0E0]" : "bg-gray-100 text-black"}`}>
      <h2 className="text-2xl font-bold mb-4">⚙️ Dashboard Settings</h2>

      {/* Dark Mode Toggle */}
      <div className="mb-4">
        <label className="block font-semibold mb-2">🌙 Eye-Friendly Mode:</label>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`px-4 py-2 rounded-md transition ${
            darkMode ? "bg-[#334155] text-[#E0E0E0]" : "bg-gray-300 text-black"
          }`}
        >
          {darkMode ? "Disable Eye-Friendly Mode" : "Enable Eye-Friendly Mode"}
        </button>
      </div>

      {/* Reset Button */}
      <button
        onClick={() => {
          setBgColor("#ffffff");
          setDarkMode(false);
          document.body.style.backgroundColor = "#ffffff"; // Reset page background
          document.body.style.color = "#000000"; // Reset text color
        }}
        className="px-4 py-2 bg-red-500 text-white rounded-md mt-4"
      >
        Reset to Default
      </button>
    </div>
  );
};

export default DashSettings;
