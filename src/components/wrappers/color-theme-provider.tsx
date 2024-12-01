"use client";

import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";

export const ColorThemeContext = createContext({
  colorTheme: "default",
  setColorTheme: (theme: string) => {
    console.log("setColorTheme", theme);
  },
});

export function ColorThemeProvider({ children }: { children: ReactNode }) {
  const [colorTheme, setColorTheme] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("color-theme") || "default";
    }
    return "default";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", colorTheme);
    localStorage.setItem("color-theme", colorTheme);
  }, [colorTheme]);

  return (
    <ColorThemeContext.Provider value={{ colorTheme, setColorTheme }}>
      {children}
    </ColorThemeContext.Provider>
  );
}

export const useColorTheme = () => useContext(ColorThemeContext);
