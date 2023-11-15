import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export interface OfflineProps {
  trips: any;
}

const initialState: OfflineProps = {
  trips: {}
};

export const OfflineReducer = createSlice({
  name: "offline",
  initialState,
  reducers: {
    setOfflineTrips: (state, action) => {
      const data = action.payload;

      return {
        ...state,
        trips: { ...data }
      };
    }
  }
});

export const selectOffline = (state: RootState) => state;

export const actions = OfflineReducer.actions;

export default OfflineReducer.reducer;
