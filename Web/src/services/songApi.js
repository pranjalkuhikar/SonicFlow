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
    // Artist
    createArtistPlayList: build.mutation({
      query: (formData) => ({
        url: "createArtistPlayList",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Songs"],
    }),
    getArtistPlayList: build.query({
      query: () => ({
        url: "getArtistPlayList",
        method: "GET",
      }),
      providesTags: ["Songs"],
    }),
    getArtistPlayListById: build.query({
      query: (id) => ({
        url: `getArtistPlayListById/${id}`,
        method: "GET",
      }),
      providesTags: ["Songs"],
    }),
    deleteArtistPlayList: build.mutation({
      query: (id) => ({
        url: `deleteArtistPlayList/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Songs"],
    }),
    addSongToArtistPlayList: build.mutation({
      query: ({ playListId, songId }) => ({
        url: `addSongToArtistPlayList/${playListId}`,
        method: "POST",
        params: { songId },
      }),
      invalidatesTags: ["Songs"],
    }),
    removeSongToArtistPlayList: build.mutation({
      query: ({ playListId, songId }) => ({
        url: `removeSongToArtistPlayList/${playListId}`,
        method: "POST",
        params: { songId },
      }),
      invalidatesTags: ["Songs"],
    }),

    // User
    createUserPlayList: build.mutation({
      query: (formData) => ({
        url: "createUserPlayList",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Songs"],
    }),
    getUserPlayList: build.query({
      query: () => ({
        url: "getUserPlayList",
        method: "GET",
      }),
      providesTags: ["Songs"],
    }),
    getUserPlayListById: build.query({
      query: (id) => ({
        url: `getUserPlayListById/${id}`,
        method: "GET",
      }),
      providesTags: ["Songs"],
    }),
    deleteUserPlayList: build.mutation({
      query: (id) => ({
        url: `deleteUserPlayList/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Songs"],
    }),
    addSongToUserPlayList: build.mutation({
      query: ({ playListId, songId }) => ({
        url: `addSongToUserPlayList/${playListId}`,
        method: "POST",
        params: { songId },
      }),
      invalidatesTags: ["Songs"],
    }),
    removeSongToUserPlayList: build.mutation({
      query: ({ playListId, songId }) => ({
        url: `removeSongToUserPlayList/${playListId}`,
        method: "POST",
        params: { songId },
      }),
      invalidatesTags: ["Songs"],
    }),
  }),
});

export const {
  useAddSongMutation,
  useGetSongsQuery,
  useGetSongByIdQuery,
  useDeleteSongMutation,
  useSearchSongsQuery,
  // Artist
  useCreateArtistPlayListMutation,
  useGetArtistPlayListQuery,
  useGetArtistPlayListByIdQuery,
  useDeleteArtistPlayListMutation,
  useAddSongToArtistPlayListMutation,
  useRemoveSongToArtistPlayListMutation,
  // User
  useCreateUserPlayListMutation,
  useGetUserPlayListQuery,
  useGetUserPlayListByIdQuery,
  useDeleteUserPlayListMutation,
  useAddSongToUserPlayListMutation,
  useRemoveSongToUserPlayListMutation,
} = songApi;
