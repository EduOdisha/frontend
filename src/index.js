import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice.js';
import uiSlice from './slices/uiSlice.js';
import compareSlice from './slices/compareSlice.js';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    ui: uiSlice,
    compare: compareSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});