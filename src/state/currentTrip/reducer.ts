import { createSlice } from "@reduxjs/toolkit";

const initialState = "";

export const CurrentTripIdReducer = createSlice({
  name: "currentTripId",
  initialState,
  reducers: {
    setCurrentTrip: (_, action) => {
      return action.payload;
    }
  }
});

export default CurrentTripIdReducer.reducer;

export const actions = CurrentTripIdReducer.actions;
