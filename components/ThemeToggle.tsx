"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";
import { Button } from "react-bootstrap";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <Button
        variant="outline-secondary"
        className="rounded-circle"
        style={{ width: "40px", height: "40px" }}
        aria-label="Toggle theme"
        disabled
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <Button
      variant="outline-secondary"
      className="rounded-circle"
      style={{ width: "40px", height: "40px", position: "relative" }}
      onClick={() => (isDark ? setTheme("light") : setTheme("dark"))}
      aria-label="Toggle theme"
    >
      <Sun
        size={20}
        className={`position-absolute top-50 start-50 translate-middle transition-all ${
          isDark ? "rotate-90 scale-0" : "rotate-0 scale-100"
        }`}
      />
      <Moon
        size={20}
        className={`position-absolute top-50 start-50 translate-middle transition-all ${
          isDark ? "rotate-0 scale-100" : "-rotate-90 scale-0"
        }`}
      />
      <span className="visually-hidden">Toggle theme</span>
    </Button>
  );
}
