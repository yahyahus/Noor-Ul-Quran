import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import roleReducer from './slices/roleSlice'; 
const store = configureStore({
  reducer: {
    auth: authReducer,
    role: roleReducer, 
  },
});

export default store;
