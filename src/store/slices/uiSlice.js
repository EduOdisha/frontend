import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: localStorage.getItem('theme') || 'light',
  language: localStorage.getItem('language') || 'en',
  isSidebarOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
      localStorage.setItem('language', state.language);
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
  },
});

export const { toggleTheme, setLanguage, toggleSidebar } = uiSlice.actions;
export default uiSlice.reducer;