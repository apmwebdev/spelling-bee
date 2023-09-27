import { createSlice } from "@reduxjs/toolkit";
import { StateShape, Statuses } from "@/types";

import { HintProfilesData } from "@/features/hintProfiles";

const initialState: StateShape<HintProfilesData> = {
  data: {
    userHintProfiles: [],
    defaultHintProfiles: [],
  },
  status: Statuses.Initial,
  error: undefined,
};

export const hintProfilesSlice = createSlice({
  name: "hintProfiles",
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export const {} = hintProfilesSlice.actions;

export default hintProfilesSlice.reducer;

/**
 * Set panel current display state to initial display state when the puzzle
 * changes
 */
