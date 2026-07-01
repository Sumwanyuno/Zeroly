// client/src/components/ModeToggle.jsx
// Animated dark/light mode toggle with:
//   - Framer Motion spring animation (≤300ms)
//   - Sun/Moon icon swap with rotation + scale
//   - Reads theme from ThemeContext (next-themes backed)
//   - Persists to localStorage key "zeroly-theme" via next-themes

import * as React from "react";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

const iconVariants = {
  initial: { opacity: 0, rotate: -90, scale: 0.5 },
  animate: { opacity: 1, rotate: 0, scale: 1 },
  exit: { opacity: 0, rotate: 90, scale: 0.5 },
};

const transition = {
  type: "spring",
  stiffness: 300,
  damping: 20,
  duration: 0.25,
};

export function ModeToggle() {
  const { resolvedTheme, setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch — only render icon after mount
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  const handleToggle = () => {
    if (theme === "system" || theme === undefined) {
      // Leave system default and switch to the opposite of what's currently showing
      setTheme(isDark ? "light" : "dark");
    } else {
      setTheme(isDark ? "light" : "dark");
    }
  };

  return (
    <Button
      id="theme-toggle-btn"
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative overflow-hidden"
    >
      <AnimatePresence mode="wait" initial={false}>
        {mounted ? (
          isDark ? (
            <motion.span
              key="sun"
              variants={iconVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={transition}
              className="absolute flex items-center justify-center"
            >
              <Sun className="h-[1.2rem] w-[1.2rem]" />
            </motion.span>
          ) : (
            <motion.span
              key="moon"
              variants={iconVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={transition}
              className="absolute flex items-center justify-center"
            >
              <Moon className="h-[1.2rem] w-[1.2rem]" />
            </motion.span>
          )
        ) : (
          // SSR / pre-mount placeholder to prevent layout shift
          <span className="h-[1.2rem] w-[1.2rem]" />
        )}
      </AnimatePresence>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
