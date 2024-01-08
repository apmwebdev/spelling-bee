/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "@/app/store";
import { hintProfilesApiSlice } from "@/features/hintProfiles";
import { capitalizeFirstLetter, devLog } from "@/util";
import { StateShape, Statuses } from "@/types/globalTypes";
import { startAppListening } from "@/app/listenerMiddleware";
import { puzzleApiSlice } from "@/features/puzzle";
import {
  CompleteHintProfile,
  HintProfileTypes,
} from "@/features/hintProfiles/types/hintProfileTypes";
import {
  hintPanelsApiSlice,
  PanelCurrentDisplayState,
  PanelCurrentDisplayStateProperties,
} from "@/features/hintPanels";
import { Uuid } from "@/features/api";

type StateData = {
  [panelUuid: Uuid]: PanelCurrentDisplayState;
};

export const initialState: StateShape<StateData> = {
  data: {},
  status: Statuses.Initial,
  error: undefined,
};

export type SetPanelDisplayStatePayload = {
  panelUuid: Uuid;
  data: PanelCurrentDisplayState;
};

export type SetPanelDisplayStatePropPayload = {
  panelUuid: Uuid;
  property: PanelCurrentDisplayStateProperties;
  value: boolean;
};

export const setPanelDisplayPropThunk =
  ({ panelUuid, property, value }: SetPanelDisplayStatePropPayload) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const panelData = state.hintPanels.data[panelUuid];
    if (panelData) {
      dispatch(setPanelDisplayStateProp({ panelUuid, property, value }));
      const currentProfile =
        hintProfilesApiSlice.endpoints.getCurrentHintProfile.select()(
          state,
        ).data;
      const panel = currentProfile?.panels.find(
        (panel) => panel.uuid === panelUuid,
      );
      if (!state.auth.user) {
        devLog("No auth");
        return;
      }
      if (currentProfile?.type !== HintProfileTypes.User) {
        devLog("Default profile");
        return;
      }
      if (
        (panel?.initialDisplayState.isSticky &&
          (property === PanelCurrentDisplayStateProperties.isExpanded ||
            property === PanelCurrentDisplayStateProperties.isBlurred)) ||
        (panel?.initialDisplayState.isSettingsSticky &&
          property === PanelCurrentDisplayStateProperties.isSettingsExpanded)
      ) {
        dispatch(
          hintPanelsApiSlice.endpoints.updateHintPanel.initiate({
            uuid: panelUuid,
            debounceField: `initDisplay${capitalizeFirstLetter(property)}`,
            initialDisplayState: {
              [property]: value,
            },
          }),
        );
      }
    }
  };

export const hintPanelsSlice = createSlice({
  name: "hintPanels",
  initialState,
  reducers: {
    setDisplayStateToPayload: (
      state,
      { payload }: PayloadAction<StateData>,
    ) => {
      state.data = payload;
      state.status = Statuses.UpToDate;
    },
    setPanelDisplayState: (
      state,
      { payload }: PayloadAction<SetPanelDisplayStatePayload>,
    ) => {
      //Only set data if panel data already exists
      if (state.data[payload.panelUuid]) {
        state.data[payload.panelUuid] = payload.data;
      }
    },
    setPanelDisplayStateProp: (
      state,
      { payload }: PayloadAction<SetPanelDisplayStatePropPayload>,
    ) => {
      if (state.data[payload.panelUuid]) {
        state.data[payload.panelUuid][payload.property] = payload.value;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      hintProfilesApiSlice.endpoints.getCurrentHintProfile.matchFulfilled,
      (state, { payload }) => {
        state.data = getStateFromProfile(payload);
        state.status = Statuses.UpToDate;
      },
    );
  },
});

export const { setDisplayStateToPayload, setPanelDisplayStateProp } =
  hintPanelsSlice.actions;

export const getStateFromProfile = (profile: CompleteHintProfile) => {
  const stateObj: StateData = {};
  for (const panelUuid in profile.panels) {
    const panel = profile.panels[panelUuid];
    stateObj[panel.uuid] = {
      isExpanded: panel.initialDisplayState.isExpanded,
      isBlurred: panel.initialDisplayState.isBlurred,
      isSettingsExpanded: panel.initialDisplayState.isSettingsExpanded,
    };
  }
  return stateObj;
};
export const selectCurrentPanelData = (state: RootState) => state.hintPanels;
// export const selectPanelsDisplayState = (state: RootState) =>
//   state.hintProfiles.data;
export const selectPanelDisplayState = (uuid: Uuid) => (state: RootState) =>
  state.hintPanels.data[uuid];

startAppListening({
  matcher: puzzleApiSlice.endpoints.getPuzzle.matchFulfilled,
  effect: (_action, api) => {
    const currentProfile =
      hintProfilesApiSlice.endpoints.getCurrentHintProfile.select()(
        api.getState(),
      ).data;
    if (currentProfile) {
      api.dispatch(
        setDisplayStateToPayload(getStateFromProfile(currentProfile)),
      );
    }
  },
});

export default hintPanelsSlice.reducer;
