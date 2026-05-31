import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  colleges: [], // List of college objects being compared
};

const compareSlice = createSlice({
  name: 'compare',
  initialState,
  reducers: {
    addToCompare: (state, action) => {
      if (state.colleges.length >= 4) return;
      if (!state.colleges.find(c => c._id === action.payload._id)) {
        state.colleges.push(action.payload);
      }
    },
    removeFromCompare: (state, action) => {
      state.colleges = state.colleges.filter(c => c._id !== action.payload);
    },
    clearCompare: (state) => {
      state.colleges = [];
    }
  }
});

export const { addToCompare, removeFromCompare, clearCompare } = compareSlice.actions;
export default compareSlice.reducer;