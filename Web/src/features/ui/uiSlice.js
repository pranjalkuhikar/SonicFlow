import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  avatarColor: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setAvatarColor(state, action) {
      state.avatarColor = action.payload;
    },
    resetAvatarColor(state) {
      state.avatarColor = null;
    },
  },
});

export const { setAvatarColor, resetAvatarColor } = uiSlice.actions;
export const selectAvatarColor = (state) => state.ui.avatarColor;
export default uiSlice.reducer;
