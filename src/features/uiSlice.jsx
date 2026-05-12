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
  },
});

export const {
  toggleCollapse,
  toggleMobileMenu,
  closeMobileMenu,
  toggleDarkMode,
  setSearchQuery,
  clearSearchQuery,
} = uiSlice.actions;
export default uiSlice.reducer;
