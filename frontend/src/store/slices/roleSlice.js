import { createSlice } from '@reduxjs/toolkit';

const roleSlice = createSlice({
  name: 'role',
  initialState: 'student',
  reducers: {
    setRole: (state, action) => action.payload,
    clearRole: () => '',
  },
});

export const { setRole, clearRole } = roleSlice.actions;
export default roleSlice.reducer;
