import {
  HintPanelData,
  PanelDisplayState,
  StatusTrackingKeys,
} from "@/features/hintPanels/types";

export enum HintProfileTypes {
  Default = "DefaultHintProfile",
  User = "UserHintProfile",
}

export type HintProfileBasicData = {
  type: HintProfileTypes;
  id: number;
};
export type HintProfileData = HintProfileBasicData & {
  name: string;
};
/**
 * A user-created hint profile, as opposed to a default hint profile.
 */
export type UserHintProfileBasic = HintProfileData & {
  type: HintProfileTypes.User;
};
export type UserHintProfileComplete = UserHintProfileBasic & {
  /** The status tracking that newly created panels come in with */
  defaultPanelTracking: StatusTrackingKeys;
  /** The display state that newly created panels come in with */
  defaultPanelDisplayState: PanelDisplayState;
  panels: HintPanelData[];
};
export type DefaultHintProfileBasic = HintProfileData & {
  type: HintProfileTypes.Default;
};
export type DefaultHintProfileComplete = DefaultHintProfileBasic & {
  panels: HintPanelData[];
};
export type CompleteHintProfile =
  | UserHintProfileComplete
  | DefaultHintProfileComplete;

export type HintProfilesData = {
  userHintProfiles: UserHintProfileBasic[];
  defaultHintProfiles: DefaultHintProfileBasic[];
};

export type UserHintProfileForm = {
  name: string;
  default_panel_tracking: StatusTrackingKeys;
  default_panel_display_state: PanelDisplayState;
  panels: HintPanelData[];
};

export type CurrentHintProfileFormData = {
  current_hint_profile_type: HintProfileTypes;
  current_hint_profile_id: number;
};

export const defaultCurrentHintProfile: HintProfileBasicData = {
  type: HintProfileTypes.Default,
  id: 1,
};
