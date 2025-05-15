import React, { createContext, useState, useContext, useMemo } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light"); // Pode ser 'light' ou 'dark'

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // Opcional: Aplicar o tema ao body ou a um wrapper principal
  // useEffect(() => {
  //   document.body.className = theme;
  // }, [theme]);

  // O useMemo pode ser útil aqui se os valores do contexto forem complexos
  // ou se a lógica de derivação do tema for mais elaborada.
  const value = useMemo(() => ({
    theme,
    toggleTheme
  }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};

