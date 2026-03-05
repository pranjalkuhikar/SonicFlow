import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../services/authApi";
import { songApi } from "../services/songApi";
import uiReducer from "../features/ui/uiSlice";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    [authApi.reducerPath]: authApi.reducer,
    [songApi.reducerPath]: songApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, songApi.middleware),
});
