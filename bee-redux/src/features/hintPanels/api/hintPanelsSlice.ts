import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "@/app/store";
import { hintProfilesApiSlice } from "@/features/hintProfiles";
import { capitalizeFirstLetter, devLog } from "@/util";
import { StateShape, Statuses } from "@/types";
import { startAppListening } from "@/app/listenerMiddleware";
import { puzzleApiSlice } from "@/features/puzzle";
import {
  CompleteHintProfile,
  HintProfileTypes,
} from "@/features/hintProfiles/types";
import {
  hintPanelsApiSlice,
  PanelCurrentDisplayState,
  PanelCurrentDisplayStateProperties,
} from "@/features/hintPanels";

type StateData = {
  [panelId: number]: PanelCurrentDisplayState;
};

export const initialState: StateShape<StateData> = {
  data: {},
  status: Statuses.Initial,
  error: undefined,
};

export type SetPanelDisplayStatePayload = {
  panelId: number;
  data: PanelCurrentDisplayState;
};

export type SetPanelDisplayStatePropPayload = {
  panelId: number;
  property: PanelCurrentDisplayStateProperties;
  value: boolean;
};

export const setPanelDisplayPropThunk =
  ({ panelId, property, value }: SetPanelDisplayStatePropPayload) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const panelData = state.hintPanels.data[panelId];
    if (panelData) {
      dispatch(setPanelDisplayStateProp({ panelId, property, value }));
      const currentProfile =
        hintProfilesApiSlice.endpoints.getCurrentHintProfile.select()(
          state,
        ).data;
      const panel = currentProfile?.panels.find(
        (panel) => panel.id === panelId,
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
export const selectCurrentPanelData = (state: RootState) => state.hintPanels;
// export const selectPanelsDisplayState = (state: RootState) =>
//   state.hintProfiles.data;
export const selectPanelDisplayState = (id: number) => (state: RootState) =>
  state.hintPanels.data[id];

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
