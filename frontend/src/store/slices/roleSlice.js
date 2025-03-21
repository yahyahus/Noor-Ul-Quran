import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  role: 'student', // Keep state as an object
};

const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    setRole: (state, action) => {
      state.role = action.payload; // Update role inside the object
    },
    clearRole: (state) => {
      state.role = ''; // Reset role
    },
  },
});

export const { setRole, clearRole } = roleSlice.actions;
export default roleSlice.reducer;
