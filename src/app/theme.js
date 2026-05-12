const THEME_STORAGE_KEY = "theme";

export const getInitialThemeMode = () => {
  if (typeof window === "undefined") {
    return false;
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

  if (storedTheme === "dark") {
    return true;
  }

  if (storedTheme === "light") {
    return false;
  }

  return Boolean(
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches,
  );
};

export const applyThemeMode = (isDark) => {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.classList.toggle("dark", Boolean(isDark));

  if (document.body) {
    document.body.style.colorScheme = isDark ? "dark" : "light";
  }

  if (typeof window !== "undefined") {
    window.localStorage.setItem(
      THEME_STORAGE_KEY,
      isDark ? "dark" : "light",
    );
  }
};