import { createSlice } from "@reduxjs/toolkit";
import { getInitialThemeMode } from "../app/theme";

const initialDarkMode = getInitialThemeMode();

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    isCollapsed: false,
    isMobileOpen: false,
    darkMode: initialDarkMode,
    searchQuery: "",
    snackbar: {
      open: false,
      message: "",
      variant: "success",
      duration: 2000,
    },
  },
  reducers: {
    toggleCollapse: (state) => {
      state.isCollapsed = !state.isCollapsed;
    },
    toggleMobileMenu: (state) => {
      state.isMobileOpen = !state.isMobileOpen;
    },
    closeMobileMenu: (state) => {
      state.isMobileOpen = false;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearSearchQuery: (state) => {
      state.searchQuery = "";
    },
    showSnackbar: (state, action) => {
      const { message, variant = "success", duration = 2000 } = action.payload;
      state.snackbar = {
        open: true,
        message,
        variant,
        duration,
      };
    },
    hideSnackbar: (state) => {
      state.snackbar.open = false;
    },
  },
});

export const {
  toggleCollapse,
  toggleMobileMenu,
  closeMobileMenu,
  toggleDarkMode,
  setSearchQuery,
  clearSearchQuery,
  showSnackbar,
  hideSnackbar,
} = uiSlice.actions;
export default uiSlice.reducer;
