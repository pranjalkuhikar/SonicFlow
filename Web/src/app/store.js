import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../services/authApi";
import { songApi } from "../services/songApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [songApi.reducerPath]: songApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, songApi.middleware),
});
