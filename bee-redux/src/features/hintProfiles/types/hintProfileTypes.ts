/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import {
  HintPanelData,
  PanelDisplayState,
  StatusTrackingKeys,
} from "@/features/hintPanels";
import { BLANK_UUID, Uuid } from "@/features/api";

export enum HintProfileTypes {
  Default = "DefaultHintProfile",
  User = "UserHintProfile",
}

export type HintProfileBasicData = {
  type: HintProfileTypes;
  uuid: Uuid;
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
  uuid: Uuid;
  name: string;
  default_panel_tracking: StatusTrackingKeys;
  default_panel_display_state: PanelDisplayState;
  panels: HintPanelData[];
};

export type CurrentHintProfileFormData = {
  current_hint_profile_type: HintProfileTypes;
  current_hint_profile_uuid: Uuid;
};

export const defaultCurrentHintProfile: HintProfileBasicData = {
  type: HintProfileTypes.Default,
  uuid: BLANK_UUID,
};
