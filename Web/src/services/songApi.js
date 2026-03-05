import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const songApi = createApi({
  reducerPath: "songApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3002/api/song/",
  }),
  endpoints: (build) => ({
    addSong: build.mutation({
      query: (formData) => ({
        url: "addSong",
        method: "POST",
        body: formData,
      }),
    }),
    getSongs: build.query({
      query: () => ({
        url: "getSongs",
        method: "GET",
      }),
    }),
    deleteSong: build.mutation({
      query: (id) => ({
        url: `deleteSong/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useAddSongMutation, useGetSongsQuery, useDeleteSongMutation } =
  songApi;
