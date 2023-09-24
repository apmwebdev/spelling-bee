import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CompleteHintProfile,
  hintApiSlice,
  HintProfileTypes,
} from "@/features/hints";
import { puzzleApiSlice } from "@/features/puzzle";
import { AppDispatch, RootState } from "@/app/store";
import { startAppListening } from "@/app/listenerMiddleware";
import { capitalizeFirstLetter } from "@/util";
import { Statuses } from "@/types";

export type PanelCurrentDisplayState = {
  isExpanded: boolean;
  isBlurred: boolean;
  isSettingsExpanded: boolean;
};

interface StateData {
  [panelId: number]: PanelCurrentDisplayState;
}

interface HintProfilesStateData {
  data: StateData;
  status: Statuses;
}

const initialState: HintProfilesStateData = {
  data: {},
  status: Statuses.Initial,
};

export enum PanelCurrentDisplayStateProperties {
  isExpanded = "isExpanded",
  isBlurred = "isBlurred",
  isSettingsExpanded = "isSettingsExpanded",
}

type SetPanelDisplayStatePayload = {
  panelId: number;
  data: PanelCurrentDisplayState;
};

type SetPanelDisplayStatePropPayload = {
  panelId: number;
  property: PanelCurrentDisplayStateProperties;
  value: boolean;
};

export interface SetDisplayStateThunkPayload {
  panelId: number;
  value: boolean;
}

export const setPanelDisplayPropThunk =
  ({ panelId, property, value }: SetPanelDisplayStatePropPayload) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const panelData = state.hintProfiles.data[panelId];
    if (panelData) {
      dispatch(setPanelDisplayStateProp({ panelId, property, value }));
      const currentProfile =
        hintApiSlice.endpoints.getCurrentHintProfile.select()(state).data;
      const panel = currentProfile?.panels.find(
        (panel) => panel.id === panelId,
      );
      if (!state.auth.user) {
        console.log("No auth");
        return;
      }
      if (currentProfile?.type !== HintProfileTypes.User) {
        console.log("Default profile");
        return;
      }
      if (
        (panel?.initialDisplayState.isSticky &&
          (property === PanelCurrentDisplayStateProperties.isExpanded ||
            property === PanelCurrentDisplayStateProperties.isBlurred)) ||
        (panel?.initialDisplayState.isSettingsSticky &&
          property === PanelCurrentDisplayStateProperties.isSettingsExpanded)
      ) {
        console.log("All checks passed. Should update");
        dispatch(
          hintApiSlice.endpoints.updateHintPanel.initiate({
            id: panelId,
            debounceField: `initDisplay${capitalizeFirstLetter(property)}`,
            initialDisplayState: {
              [property]: value,
            },
          }),
        );
      }
    }
  };

const getStateFromProfile = (profile: CompleteHintProfile) => {
  const stateObj: StateData = {};
  for (const panelId in profile.panels) {
    const panel = profile.panels[panelId];
    stateObj[panel.id] = {
      isExpanded: panel.initialDisplayState.isExpanded,
      isBlurred: panel.initialDisplayState.isBlurred,
      isSettingsExpanded: panel.initialDisplayState.isSettingsExpanded,
    };
  }
  return stateObj;
};

export const hintProfilesSlice = createSlice({
  name: "hintProfiles",
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
      if (state.data[payload.panelId]) {
        state.data[payload.panelId] = payload.data;
      }
    },
    setPanelDisplayStateProp: (
      state,
      { payload }: PayloadAction<SetPanelDisplayStatePropPayload>,
    ) => {
      if (state.data[payload.panelId]) {
        state.data[payload.panelId][payload.property] = payload.value;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      hintApiSlice.endpoints.getCurrentHintProfile.matchFulfilled,
      (state, { payload }) => {
        state.data = getStateFromProfile(payload);
        state.status = Statuses.UpToDate;
      },
    );
  },
});

export const { setDisplayStateToPayload, setPanelDisplayStateProp } =
  hintProfilesSlice.actions;

export const selectCurrentPanelData = (state: RootState) => state.hintProfiles;
// export const selectPanelsDisplayState = (state: RootState) =>
//   state.hintProfiles.data;
export const selectPanelDisplayState = (id: number) => (state: RootState) =>
  state.hintProfiles.data[id];

export default hintProfilesSlice.reducer;

/**
 * Set panel current display state to initial display state when the puzzle
 * changes
 */
startAppListening({
  matcher: puzzleApiSlice.endpoints.getPuzzle.matchFulfilled,
  effect: (_action, api) => {
    const currentProfile =
      hintApiSlice.endpoints.getCurrentHintProfile.select()(
        api.getState(),
      ).data;
    if (currentProfile) {
      api.dispatch(
        setDisplayStateToPayload(getStateFromProfile(currentProfile)),
      );
    }
  },
});
