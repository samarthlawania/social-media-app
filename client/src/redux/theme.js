import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: JSON.parse(window?.localStorage.getItem("theme")) ?? "light", // 'light' or 'dark'
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem("theme", JSON.stringify(action.payload));
    },
  },
});

export default themeSlice.reducer;

export function setTheme(theme) {
  return (dispatch) => {
    dispatch(themeSlice.actions.setTheme(theme));
  };
}
