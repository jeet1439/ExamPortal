import React from "react";

const DashSettings = ({ bgColor, setBgColor, darkMode, setDarkMode }) => {
  return (
    <div className={`p-6 shadow-md rounded-lg ${darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-black"}`}>
      <h2 className="text-2xl font-bold mb-4">⚙️ Dashboard Settings</h2>

      {/* Dark Mode Toggle */}
      <div className="mb-4">
        <label className="block font-semibold mb-2">🌙 Dark Mode:</label>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`px-4 py-2 rounded-md ${darkMode ? "bg-gray-700 text-white" : "bg-gray-300 text-black"}`}
        >
          {darkMode ? "Disable Dark Mode" : "Enable Dark Mode"}
        </button>
      </div>

      {/* Reset Button */}
      <button
        onClick={() => {
          setBgColor("#ffffff");
          setDarkMode(false);
        }}
        className="px-4 py-2 bg-red-500 text-white rounded-md mt-4"
      >
        Reset to Default
      </button>
    </div>
  );
};

export default DashSettings;
