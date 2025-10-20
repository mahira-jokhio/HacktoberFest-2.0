import React, { useEffect, useState } from "react";
import { FiSun } from "react-icons/fi";
import { MdModeNight } from "react-icons/md";

const ToggleTheme = () => {
  const [isDark, setIsDark] = useState(false);

  // On mount, set theme based on device or saved preference
  useEffect(() => {
    const darkPref =
      window.matchMedia("(prefers-color-scheme: dark)").matches ||
      localStorage.theme === "dark";
    setIsDark(darkPref);
    document.documentElement.classList.toggle("dark", darkPref);
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const newTheme = !prev;
      document.documentElement.classList.toggle("dark", newTheme);
      localStorage.theme = newTheme ? "dark" : "light";
      return newTheme;
    });
  };

  return (
    <button
      onClick={toggleTheme}
      className="px-4 py-3 cursor-pointer rounded text-xl hover:scale-110"
    >
      {isDark ? <FiSun /> : <MdModeNight />}
    </button>
  );
};

export default ToggleTheme;
