/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { createSlice } from "@reduxjs/toolkit";
import { StateShape, Statuses } from "@/types/globalTypes";

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
