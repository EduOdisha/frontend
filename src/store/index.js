import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import compareReducer from './slices/compareSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    compare: compareReducer,
  },
});

export default store;