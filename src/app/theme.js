const THEME_STORAGE_KEY = "theme";

export const getInitialThemeMode = () => {
  if (typeof window === "undefined") {
    return false;
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

  // إذا كان المستخدم قد زار الموقع سابقاً وحدد خياره، نلتزم به
  if (storedTheme === "dark") {
    return true;
  }

  if (storedTheme === "light") {
    return false;
  }

  // 👇 إذا كانت هذه "أول مرة" يفتح فيها الموقع (storedTheme يساوي null)
  const isSystemDark = Boolean(
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  // نخزن خيار النظام فوراً في الـ localStorage ليكون الخيار الثابت مستقبلاً
  window.localStorage.setItem(
    THEME_STORAGE_KEY,
    isSystemDark ? "dark" : "light"
  );

  return isSystemDark;
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