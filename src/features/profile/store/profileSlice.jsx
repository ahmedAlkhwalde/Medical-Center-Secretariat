import { createSlice } from '@reduxjs/toolkit';

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    isEditing: false,
  },
  reducers: {
    startEditing: (state) => { state.isEditing = true; },
    cancelEditing: (state) => { state.isEditing = false; },
  },
});

export const { startEditing, cancelEditing } = profileSlice.actions;
export default profileSlice.reducer;