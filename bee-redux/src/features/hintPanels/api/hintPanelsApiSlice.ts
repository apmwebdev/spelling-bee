/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { addDebouncer, apiSlice, keysToSnakeCase } from "@/features/api";
import { RootState } from "@/app/store";
import { createSelector } from "@reduxjs/toolkit";
import { arrayMove } from "@dnd-kit/sortable";
import {
  hintProfilesApiSlice,
  selectCurrentHintProfile,
} from "@/features/hintProfiles/api/hintProfilesApiSlice";
import {
  HintPanelUpdateForm,
  MoveHintPanelData,
  RailsHintPanelUpdateForm,
} from "@/features/hintPanels/types";
import { HintProfileTypes } from "@/features/hintProfiles/types";
import { devLog } from "@/util";

const railsifyUpdatePanelData = (formData: HintPanelUpdateForm) => {
  const railsData: RailsHintPanelUpdateForm = {
    hint_panel: {
      uuid: formData.uuid,
      name: formData.name,
      display_index: formData.displayIndex,
      status_tracking: formData.statusTracking,
      initial_display_state_attributes: keysToSnakeCase(
        formData.initialDisplayState,
      ),
      current_display_state_attributes: keysToSnakeCase(
        formData.currentDisplayState,
      ),
      panel_subtype_attributes: keysToSnakeCase(formData.typeData),
    },
  };
  return railsData;
};

export const hintPanelsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ⚠️
    // createHintPanel: builder.mutation<t.HintPanelData, t.HintPanelCreateForm>({}),

    /**
     * ✅
     * Can debounce
     * Uses optimistic updates
     * Manually updates getCurrentHintProfile endpoint data
     * Guest users + modifications to default panels save only to local storage
     */
    updateHintPanel: builder.mutation<boolean, HintPanelUpdateForm>({
      queryFn: async (formData, api, _opts, baseQuery) => {
        //Optimistically update getCurrentHintProfile with panel mutations
        api.dispatch(
          hintProfilesApiSlice.util.updateQueryData(
            "getCurrentHintProfile",
            undefined,
            (draftState) => {
              if (!draftState) return;
              const panel = draftState.panels.find(
                (hintPanel) => hintPanel.uuid === formData.uuid,
              );
              if (!panel) return;
              if (formData.name) panel.name = formData.name;
              if (formData.statusTracking)
                panel.statusTracking = formData.statusTracking;
              Object.assign(
                panel.initialDisplayState,
                formData.initialDisplayState,
              );
              Object.assign(
                panel.currentDisplayState,
                formData.currentDisplayState,
              );
              Object.assign(panel.typeData, formData.typeData);
            },
          ),
        );
        //Return early if user is guest user or current profile is a default profile
        //Otherwise, run the actual query
        const state = api.getState() as RootState;
        if (
          state.auth.isGuest ||
          selectCurrentHintProfile(state)?.type === HintProfileTypes.Default
        ) {
          return { data: true };
        }
        const query = async () => {
          try {
            const response = await baseQuery({
              url: `/hint_panels/${formData.uuid}`,
              method: "PATCH",
              body: railsifyUpdatePanelData(formData),
            });
            devLog("Response:", response);
          } catch (err) {
            devLog("Couldn't update DB with updated panel data:", err);
          }
        };
        //Debounce query if applicable. Otherwise, just run it.
        if (formData.debounceField) {
          addDebouncer({
            key: `${formData.debounceField}Panel${formData.uuid}`,
            delay: 1000,
            callback: query,
          });
        } else {
          await query();
        }
        return { data: true };
      },
    }),

    // ⚠️
    deleteHintPanel: builder.mutation<boolean, number>({
      queryFn: (id, api, _opts, baseQuery) => {
        return { data: true };
      },
    }),

    /**
     * ✅
     * Does not debounce
     * Uses optimistic updates
     * Manually updates getCurrentHintProfile endpoint data
     * Guest users + modifications to default profile panls save only to local
     *   storage
     */
    changeHintPanelOrder: builder.mutation<boolean, MoveHintPanelData>({
      queryFn: async (formData, api, _opts, baseQuery) => {
        const state = api.getState() as RootState;
        let shouldPersist =
          !state.auth.isGuest &&
          selectCurrentHintProfile(state)?.type !== HintProfileTypes.Default;
        //Optimistically update getCurrentHintProfile
        api.dispatch(
          hintProfilesApiSlice.util.updateQueryData(
            "getCurrentHintProfile",
            undefined,
            (draftState) => {
              if (!draftState) {
                shouldPersist = false;
                return;
              }
              if (
                draftState.panels.at(formData.oldIndex)?.uuid !== formData.uuid
              ) {
                shouldPersist = false;
                return;
              }
              draftState.panels = arrayMove(
                draftState.panels,
                formData.oldIndex,
                formData.newIndex,
              );
              const modifiedPanels = draftState.panels.slice(
                formData.oldIndex,
                formData.newIndex,
              );
              for (const [index, panel] of modifiedPanels.entries()) {
                panel.displayIndex = index;
              }
            },
          ),
        );
        // If user is logged in and the profile is not a default profile,
        // run the actual query. Otherwise, just return.
        if (shouldPersist) {
          try {
            await baseQuery({
              url: "/hint_panels/move",
              method: "PUT",
              body: keysToSnakeCase(formData),
            });
          } catch (err) {
            devLog("Couldn't update panel order:", err);
            return { data: false };
          }
        }
        return { data: true };
      },
    }),
  }),
});

export const { useUpdateHintPanelMutation, useChangeHintPanelOrderMutation } =
  hintPanelsApiSlice;

export const selectPanels = createSelector(
  [selectCurrentHintProfile],
  (profile) => profile?.panels ?? [],
);

export const selectPanelIds = createSelector([selectPanels], (panels) => {
  if (!panels) return [];
  return panels.map((panel) => panel.uuid);
});
