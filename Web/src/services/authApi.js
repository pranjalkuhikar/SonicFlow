import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001/api/auth/",
    credentials: "include",
  }),
  tagTypes: ["Profile"],
  endpoints: (build) => ({
    register: build.mutation({
      query: (credentials) => ({
        url: "register",
        method: "POST",
        body: credentials,
      }),
    }),
    googleLoginUrl: build.mutation({
      queryFn: async () => {
        return { data: "http://localhost:3001/api/auth/google" };
      },
    }),
    login: build.mutation({
      query: (credentials) => ({
        url: "login",
        method: "POST",
        body: credentials,
      }),
    }),
    profile: build.query({
      query: () => ({
        url: "profile",
        method: "GET",
      }),
      providesTags: ["Profile"],
    }),
    logout: build.mutation({
      query: () => ({
        url: "logout",
        method: "POST",
      }),
      invalidatesTags: ["Profile"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useProfileQuery,
  useLogoutMutation,
  useGoogleLoginUrlMutation,
} = authApi;
