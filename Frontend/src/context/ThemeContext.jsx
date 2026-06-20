// src/context/ThemeContext.jsx
import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // الوضع الافتراضي من localStorage أو light
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  // كل مرة يتغير فيها theme نخزن في localStorage
  useEffect(() => {
    localStorage.setItem("theme", theme);
    // نغير class على body عشان Tailwind أو CSS يستخدم theme
    document.documentElement.className = theme;
  }, [theme]);

  // toggle بين light و dark
  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}