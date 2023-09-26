import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  SearchPanelSearchData,
  searchPanelSearchesApiSlice,
  SpsDeleteArgs,
} from "@/features/searchPanelSearches";
import { createInitialState, StateShape, Statuses } from "@/types";
import { RootState } from "@/app/store";
import { startAppListening } from "@/app/listenerMiddleware";

const initialState: StateShape<SearchPanelSearchData[]> = createInitialState(
  [],
);

export const searchPanelSearchesSlice = createSlice({
  name: "searchPanelSearches",
  initialState,
  reducers: {
    addSearch: (state, { payload }: PayloadAction<SearchPanelSearchData>) => {
      state.data.push(payload);
    },
    addIdToSearch: (
      state,
      { payload }: PayloadAction<{ createdAt: number; id: number }>,
    ) => {
      const searchToUpdate = state.data.find(
        (search) => search.createdAt === payload.createdAt,
      );
      if (!searchToUpdate) return;
      searchToUpdate.id = payload.id;
    },
    deleteSearch: (state, { payload }: PayloadAction<SpsDeleteArgs>) => {
      const indexToRemove = state.data.findIndex(
        (search) => search.createdAt === payload.createdAt,
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

export const { addSearch, addIdToSearch, deleteSearch } =
  searchPanelSearchesSlice.actions;

//API integrations

//Delete search from back end if the search has an ID and the user is
// authenticated
startAppListening({
  predicate: (action, _oldState, newState) =>
    action.type === "searchPanelSearches/deleteSearch" &&
    action.payload.id &&
    newState.auth.user,
  effect: (action, api) => {
    api.dispatch(
      searchPanelSearchesApiSlice.endpoints.deleteSearch.initiate(
        action.payload.id,
      ),
    );
  },
});

//Search panel searches are the only thing that guest users can create, so they
// are added to state without an ID. For authenticated users, the ID then needs
// to be added to the search after the response from the back end comes back so
// that they can later delete the search if they want to.
startAppListening({
  actionCreator: addSearch,
  effect: async (action, api) => {
    const { createdAt } = action.payload;
    const response = await api.dispatch(
      searchPanelSearchesApiSlice.endpoints.addSearch.initiate(action.payload),
    );
    //TS is worried that the data property might not exist on the response,
    //but we're checking if it exists, so it's fine.
    const trustMeBro = response as { data: SearchPanelSearchData };
    if (trustMeBro.data?.id) {
      api.dispatch(
        addIdToSearch({
          createdAt,
          id: trustMeBro.data.id,
        }),
      );
    }
  },
});

export const selectSearchPanelSearches = (state: RootState) =>
  state.searchPanelSearches.data;
export const selectSpsByPanel = (panelId: number) =>
  createSelector([selectSearchPanelSearches], (searches) =>
    searches.filter((search) => search.searchPanelId === panelId),
  );

export default searchPanelSearchesSlice.reducer;
