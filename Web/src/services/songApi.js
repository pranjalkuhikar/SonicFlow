import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const songApi = createApi({
  reducerPath: "songApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3002/api/song/",
    credentials: "include",
  }),
  tagTypes: ["Songs"],
  endpoints: (build) => ({
    addSong: build.mutation({
      query: (formData) => ({
        url: "addSong",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Songs"],
    }),
    getSongs: build.query({
      query: () => ({
        url: "getSongs",
        method: "GET",
      }),
      providesTags: ["Songs"],
    }),
    getSongById: build.query({
      query: (id) => ({
        url: "getSongById",
        method: "GET",
        params: { id },
      }),
      providesTags: ["Songs"],
    }),
    deleteSong: build.mutation({
      query: (id) => ({
        url: `deleteSong/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Songs"],
    }),
    searchSongs: build.query({
      query: (searchTerm) => ({
        url: "search",
        method: "GET",
        params: { query: searchTerm },
      }),
      providesTags: ["Songs"],
    }),
    
  }),
});

export const {
  useAddSongMutation,
  useGetSongsQuery,
  useGetSongByIdQuery,
  useDeleteSongMutation,
  useSearchSongsQuery,
} = songApi;
