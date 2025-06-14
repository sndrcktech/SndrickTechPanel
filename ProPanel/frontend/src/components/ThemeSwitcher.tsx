import React, { useContext } from "react";
import { ThemeContext } from "./ThemeContext";

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <button
      className="p-2 bg-gray-300 rounded"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      title="Сменить тему"
    >
      {theme === "dark" ? "🌙 Тёмная" : "☀️ Светлая"}
    </button>
  );
};

export default ThemeSwitcher;
