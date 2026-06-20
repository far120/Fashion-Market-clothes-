import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import Button from "../ui/Button"; // لو عندك Button Component جاهز
import Icon from "../ui/Icon"; // لو حابب تضيف أيقونة 

export default function ThemeToggleButton() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <Button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-all duration-200 shadow-md" onClick={toggleTheme}>
      {theme === "light" ? (
        <>
          <Icon name="moon" size={20} />
        </>
      ) : (
        <>
          <Icon name="sun" size={20} />
        </>
      )}
    </Button>
  );
}