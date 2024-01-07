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
import { searchPanelSearchesApiSlice } from "@/features/searchPanelSearches";
import {
  isSearchPanelSearch,
  SearchPanelSearchData,
} from "@/features/searchPanelSearches/types/searchPanelSearchTypes";
import { createInitialState, Statuses } from "@/types/globalTypes";
import { RootState } from "@/app/store";
import {
  addIdbSearchPanelSearch,
  bulkAddIdbSearchPanelSearches,
  deleteIdbSearchPanelSearch,
  getIdbAttemptSearches,
  updateIdbSearchPanelSearchUuids,
} from "@/features/searchPanelSearches/api/searchPanelSearchesIdbApi";
import { devLog, errLog } from "@/util";
import {
  createAddItemThunk,
  createDataResolverThunk,
  createSetDataFromIdbThunk,
  createUuidSyncThunk,
  createUuidUpdateReducer,
} from "@/features/api/util/synchronizer";
import { DataSourceKeys, Uuid } from "@/features/api/types/apiTypes";

const modelDisplayName = "search";

const initialState = createInitialState<SearchPanelSearchData[]>([]);

const updateSpsUuidsReducer = createUuidUpdateReducer<SearchPanelSearchData[]>({
  modelDisplayName,
});
export const searchPanelSearchesSlice = createSlice({
  name: "searchPanelSearches",
  initialState,
  reducers: {
    setSearchPanelSearches: (
      state,
      { payload }: PayloadAction<SearchPanelSearchData[]>,
    ) => {
      state.data = payload;
      state.status = Statuses.UpToDate;
    },
    addSearchPanelSearch: (
      state,
      { payload }: PayloadAction<SearchPanelSearchData>,
    ) => {
      state.data.push(payload);
    },
    deleteSearchPanelSearch: (state, { payload }: PayloadAction<Uuid>) => {
      const indexToRemove = state.data.findIndex(
        (search) => search.uuid === payload,
      );
      if (indexToRemove > -1) {
        state.data.splice(indexToRemove, 1);
      }
    },
    updateSearchPanelSearchUuids: updateSpsUuidsReducer,
  },
  extraReducers: (builder) => {},
});

export const {
  setSearchPanelSearches,
  addSearchPanelSearch,
  updateSearchPanelSearchUuids,
  deleteSearchPanelSearch,
} = searchPanelSearchesSlice.actions;

//API integrations

export const addSearchPanelSearchThunk =
  createAddItemThunk<SearchPanelSearchData>({
    itemDisplayType: "search",
    actionType: "searchPanelSearches/addSearchPanelSearchThunk",
    validationFn: isSearchPanelSearch,
    addItemReducer: addSearchPanelSearch,
    deleteItemReducer: deleteSearchPanelSearch,
    addIdbItemFn: addIdbSearchPanelSearch,
    addServerItemEndpoint: searchPanelSearchesApiSlice.endpoints.addSearch,
  });

export const syncSearchPanelSearchUuids = createUuidSyncThunk({
  serverUuidUpdateFn:
    searchPanelSearchesApiSlice.endpoints.updateSearchPanelSearchUuids.initiate,
  idbUuidUpdateFn: updateIdbSearchPanelSearchUuids,
  stateUuidUpdateFn: updateSearchPanelSearchUuids,
});

export const resolveSearchPanelSearchData =
  createDataResolverThunk<SearchPanelSearchData>({
    modelDisplayName: "search",
    actionType: "searchPanelSearches/resolveSearchPanelSearchData",
    primaryDataKey: DataSourceKeys.serverData,
    setDataReducer: setSearchPanelSearches,
    addBulkServerDataEndpoint:
      searchPanelSearchesApiSlice.endpoints.addBulkSearchPanelSearches,
    addBulkIdbData: bulkAddIdbSearchPanelSearches,
    syncUuidFn: syncSearchPanelSearchUuids,
  });

export const setSearchPanelSearchesFromIdbThunk = createSetDataFromIdbThunk<
  SearchPanelSearchData,
  Uuid
>({
  modelDisplayName,
  actionType: "searchPanelSearches/setSearchPanelSearchesFromIdbThunk",
  getIdbDataFn: getIdbAttemptSearches,
  validationFn: Array.isArray,
  setDataReducer: setSearchPanelSearches,
});

export const deleteSearchPanelSearchThunk = createAsyncThunk(
  "searchPanelSearches/deleteSearchPanelSearchThunk",
  async (uuid: Uuid, api) => {
    //Delete from state
    api.dispatch(deleteSearchPanelSearch(uuid));
    //Delete from IndexedDB
    const idbResult = await deleteIdbSearchPanelSearch(uuid).catch((err) =>
      errLog("Can't delete SPS from IndexedDB due to invalid UUID:", uuid, err),
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
        .catch((err) => errLog("Can't delete SPS from server:", err));
    }
    Promise.all([idbResult, rtkqResult]).then(() => devLog("SPS deleted"));
  },
);

export const selectSearchPanelSearches = (state: RootState) =>
  state.searchPanelSearches.data;
export const selectSpsByPanel = (panelUuid: Uuid) =>
  createSelector([selectSearchPanelSearches], (searches) =>
    searches.filter((search) => search.searchPanelUuid === panelUuid),
  );

export default searchPanelSearchesSlice.reducer;
