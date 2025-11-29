import React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className }: Readonly<ThemeToggleProps>) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const isDark = (currentTheme ?? "light") === "dark";

  const handleToggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const buttonClasses = cn(
    "relative flex items-center justify-center rounded-lg p-2 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9900] focus-visible:ring-offset-2",
    isDark ? "hover:bg-gray-800 focus-visible:ring-offset-gray-900" : "hover:bg-gray-100 focus-visible:ring-offset-white",
    className,
  );

  const renderIcon = () => {
    if (!mounted) return <Moon className="h-5 w-5 text-gray-700" />;
    return isDark ? (
      <Sun className="h-5 w-5 text-[#FF9900] transition-transform duration-300" />
    ) : (
      <Moon className="h-5 w-5 text-gray-700 transition-transform duration-300" />
    );
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label="Cambiar tema"
      aria-pressed={isDark}
      className={buttonClasses}
    >
      {renderIcon()}
      <span className="sr-only">Cambiar tema</span>
    </button>
  );
}
