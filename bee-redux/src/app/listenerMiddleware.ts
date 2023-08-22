import { ApiSliceAction } from "@/features/api/types";
import { userDataApiSlice } from "@/features/userData/userDataApiSlice";
import { hintApiSlice } from "@/features/hints/hintApiSlice";
import {
  createListenerMiddleware,
  TypedStartListening,
} from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "@/app/store";

/**
 * This listener middleware allows for fetching multiple query endpoints worth of
 * data at once (e.g. on initial page load) and updating the query endpoint
 * caches for those individual endpoints as if they had each gone out and made a
 * query separately. It does this by breaking up the response data and upserting
 * it into the individual endpoint caches using 'upsertQueryData'.
 */
export const listenerMiddleware = createListenerMiddleware();
export type AppStartListening = TypedStartListening<RootState, AppDispatch>;
export const startAppListening =
  listenerMiddleware.startListening as AppStartListening;

startAppListening({
  type: "api/executeQuery/fulfilled",
  effect: async (action: ApiSliceAction, listenerApi) => {
    const endpoint = action.meta.arg.endpointName;
    const data = action.payload;

    /**
     * getUserBaseData query
     * Fetches the data from:
     * - getUserPrefs
     * - getHintProfiles
     * - getUserHintProfile with the current profile ID if the current profile--
     *   as determined in the user preferences--is a user profile (as opposed to
     *   a default profile)
     * Those 3 endpoints need to be updated accordingly
     * */
    if (endpoint === "getUserBaseData") {
      listenerApi.dispatch(
        userDataApiSlice.util.upsertQueryData(
          "getUserPrefs",
          undefined,
          data.prefs,
        ),
      );
      listenerApi.dispatch(
        hintApiSlice.util.upsertQueryData(
          "getHintProfiles",
          undefined,
          data.hintProfiles,
        ),
      );
      if (data.currentUserHintProfile) {
        listenerApi.dispatch(
          hintApiSlice.util.upsertQueryData(
            "getUserHintProfile",
            data.prefs.currentHintProfile.id,
            data.currentUserHintProfile,
          ),
        );
      }
      return;
    }

    /**
     * createUserHintProfile mutation
     * Creates a new profile, which is returned in the response. Then:
     * 1. getHintProfiles is updated to include the new profile
     * 2. getUserHintProfile is updated to be the new profile
     * 3. getPrefs is updated to make the new profile the current profile
     * */
    if (endpoint === "createUserHintProfile") {
      return;
    }

    /**
     * updateUserPrefs
     * Needs to update getUserPrefs endpoint
     */
    if (endpoint === "updateUserPrefs") {
      console.log("here");
      listenerApi.dispatch(
        userDataApiSlice.util.upsertQueryData("getUserPrefs", undefined, data),
      );
      return;
    }
  },
});

startAppListening({
  type: "api/executeMutation/fulfilled",
  effect: async (action: ApiSliceAction, listenerApi) => {
    const endpoint = action.meta.arg.endpointName;
    const data = action.payload;

    /**
     * createUserHintProfile mutation
     * Creates a new profile, which is returned in the response. Then:
     * 1. getHintProfiles is updated to include the new profile
     * 2. getUserHintProfile is updated to be the new profile
     * 3. getPrefs is updated to make the new profile the current profile
     * */
    if (endpoint === "createUserHintProfile") {
      return;
    }

    /**
     * updateUserPrefs
     * Needs to update getUserPrefs endpoint
     */
    if (endpoint === "updateUserPrefs") {
      listenerApi.dispatch(
        userDataApiSlice.util.upsertQueryData("getUserPrefs", undefined, data),
      );
      return;
    }
  },
});
