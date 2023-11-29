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
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import {
  SearchPanelSearchData,
  searchPanelSearchesApiSlice,
} from "@/features/searchPanelSearches";
import { createInitialState, StateShape, Statuses, Uuid } from "@/types";
import { RootState } from "@/app/store";
import { startAppListening } from "@/app/listenerMiddleware";
import { deleteIdbSearchPanelSearch } from "@/features/searchPanelSearches/api/searchPanelSearchesIdbApi";
import { devLog } from "@/util";

const initialState: StateShape<SearchPanelSearchData[]> = createInitialState(
  [],
);

export const searchPanelSearchesSlice = createSlice({
  name: "searchPanelSearches",
  initialState,
  reducers: {
    addSearchPanelSearch: (
      state,
      { payload }: PayloadAction<SearchPanelSearchData>,
    ) => {
      state.data.push(payload);
    },
    updateSearchPanelSearchUuid: (
      state,
      { payload }: PayloadAction<{ originalUuid: Uuid; newUuid: Uuid }>,
    ) => {
      const searchToUpdate = state.data.find(
        (search) => search.uuid === payload.originalUuid,
      );
      if (!searchToUpdate) return;
      searchToUpdate.uuid = payload.newUuid;
    },
    deleteSearchPanelSearch: (state, { payload }: PayloadAction<string>) => {
      const indexToRemove = state.data.findIndex(
        (search) => search.uuid === payload,
      );
      if (indexToRemove > -1) {
        state.data.splice(indexToRemove, 1);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      searchPanelSearchesApiSlice.endpoints.getSearches.matchFulfilled,
      (state, { payload }) => {
        state.data = payload;
        state.status = Statuses.UpToDate;
      },
    );
  },
});

export const {
  addSearchPanelSearch,
  updateSearchPanelSearchUuid,
  deleteSearchPanelSearch,
} = searchPanelSearchesSlice.actions;

//API integrations

export const deleteSearchPanelSearchThunk = createAsyncThunk(
  "searchPanelSearches/deleteSearchPanelSearchThunk",
  async (uuid: Uuid, api) => {
    //Delete from state
    api.dispatch(deleteSearchPanelSearch(uuid));
    //Delete from IndexedDB
    const idbResult = deleteIdbSearchPanelSearch(uuid).catch((err) =>
      devLog("Can't delete SPS from IndexedDB due to invalid UUID:", uuid, err),
    );
    //Delete on server if user is logged in
    let rtkqResult;
    const state = api.getState() as RootState;
    if (state.auth.user) {
      rtkqResult = api
        .dispatch(
          searchPanelSearchesApiSlice.endpoints.deleteSearch.initiate(uuid),
        )
        .unwrap()
        .catch((err) => devLog("Can't delete SPS from server:", err));
    }
    Promise.all([idbResult, rtkqResult]).then(() => devLog("SPS deleted"));
  },
);

//Search panel searches are the only thing that guest users can create, so they
// are added to state without an ID. For authenticated users, the ID then needs
// to be added to the search after the response from the back end comes back so
// that they can later delete the search if they want to.
startAppListening({
  actionCreator: addSearchPanelSearch,
  effect: async (action, api) => {
    const { uuid } = action.payload;
    const response = await api.dispatch(
      searchPanelSearchesApiSlice.endpoints.addSearch.initiate(action.payload),
    );
    //TS is worried that the data property might not exist on the response,
    //but we're checking if it exists right below here, so it's fine.
    const trustMeBro = response as { data: SearchPanelSearchData };
    if (trustMeBro.data?.uuid) {
      if (uuid !== trustMeBro.data.uuid) {
        api.dispatch(
          updateSearchPanelSearchUuid({
            originalUuid: uuid,
            newUuid: trustMeBro.data.uuid,
          }),
        );
      }
    }
  },
});

export const selectSearchPanelSearches = (state: RootState) =>
  state.searchPanelSearches.data;
export const selectSpsByPanel = (panelUuid: Uuid) =>
  createSelector([selectSearchPanelSearches], (searches) =>
    searches.filter((search) => search.searchPanelUuid === panelUuid),
  );

export default searchPanelSearchesSlice.reducer;
