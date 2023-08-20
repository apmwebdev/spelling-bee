import { apiSlice } from "../api/apiSlice";
import {
  HintPanelData,
  HintPanelCreateForm,
  HintPanelUpdateForm,
  HintProfiles,
  UserHintProfileBasic,
  UserHintProfileComplete,
  UserHintProfileForm,
} from "./types";

export const hintApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Hint Profiles
    getHintProfiles: builder.query<HintProfiles, void>({
      query: () => ({
        url: "/hint_profiles",
      }),
    }),
    getUserHintProfiles: builder.query<UserHintProfileBasic[], void>({
      query: () => ({
        url: "/user_hint_profiles",
      }),
    }),
    createUserHintProfile: builder.mutation<
      UserHintProfileComplete,
      UserHintProfileForm
    >({}),
    getUserHintProfile: builder.query<UserHintProfileComplete, number>({}),
    getUserHintProfilePanels: builder.query<HintPanelData[], number>({}),
    updateUserHintProfile: builder.mutation<
      UserHintProfileBasic,
      UserHintProfileForm
    >({}),
    deleteUserHintProfile: builder.mutation<boolean, number>({}),
    // Current Profile
    setCurrentHintProfile: builder.mutation<boolean, number>({}),
    getCurrentHintProfile: builder.query<number, void>({}),
    // Hint Panels
    createHintPanel: builder.mutation<HintPanelData, HintPanelCreateForm>({}),
    updateHintPanel: builder.mutation<HintPanelData, HintPanelUpdateForm>({}),
    deleteHintPanel: builder.mutation<boolean, number>({}),
  }),
});

export const {} = hintApiSlice;
