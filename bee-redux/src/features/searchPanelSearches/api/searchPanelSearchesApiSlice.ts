import { apiSlice, keysToSnakeCase } from "@/features/api";
import {
  SearchPanelSearchData,
  SearchPanelSearchDeleteArgs,
} from "@/features/hints";
import { RootState } from "@/app/store";
import { selectCurrentHintProfile } from "@/features/hintProfiles";
import { HintProfileTypes } from "@/features/hintProfiles/types";
import { QueryReturnValue } from "@reduxjs/toolkit/dist/query/baseQueryTypes";
import {
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query";
import { selectCurrentAttemptId } from "@/features/guesses";

const railsifyAddSearchData = (newSearch: SearchPanelSearchData) => {
  return {
    search_panel_search: {
      ...keysToSnakeCase(newSearch),
      user_puzzle_attempt_id: newSearch.attemptId,
      attempt_id: undefined,
    },
  };
};

export const searchPanelSearchesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * ✅
     * Updated from getUserPuzzleData, addSearch, and deleteSearch
     */
    getSearches: builder.query<SearchPanelSearchData[], number>({
      query: (attemptId) => ({
        url: `/search_panel_search/${attemptId}`,
      }),
    }),

    /**
     * ✅
     * Does NOT debounce. This must be handled in the component
     * Uses optimistic updates
     * Updates getSearches endpoint data
     * Guest users save only to local storage
     */
    addSearch: builder.mutation<SearchPanelSearchData, SearchPanelSearchData>({
      queryFn: async (newSearch, api, _opts, baseQuery) => {
        //Optimistically update getSearches with new search
        api.dispatch(
          searchPanelSearchesApiSlice.util.updateQueryData(
            "getSearches",
            newSearch.attemptId,
            (searches) => {
              searches.unshift(newSearch);
            },
          ),
        );
        const state = api.getState() as RootState;
        if (
          state.auth.isGuest ||
          selectCurrentHintProfile(api.getState() as RootState)?.type ===
            HintProfileTypes.Default
        ) {
          return { data: newSearch };
        }
        const response = (await baseQuery({
          url: "/search_panel_searches",
          method: "POST",
          body: railsifyAddSearchData(newSearch),
        })) as QueryReturnValue<
          SearchPanelSearchData,
          FetchBaseQueryError,
          FetchBaseQueryMeta
        >;
        //Update the new search with the ID from the back end
        api.dispatch(
          searchPanelSearchesApiSlice.util.updateQueryData(
            "getSearches",
            newSearch.attemptId,
            (searches) => {
              const searchToUpdate = searches.find(
                (spsData) => spsData.createdAt === newSearch.createdAt,
              );
              if (!searchToUpdate) return;
              searchToUpdate.id = response.data?.id;
            },
          ),
        );

        return response;
      },
    }),

    // ✅
    deleteSearch: builder.mutation<boolean, SearchPanelSearchDeleteArgs>({
      queryFn: async (arg, api, _opts, baseQuery) => {
        const state = api.getState() as RootState;
        api.dispatch(
          searchPanelSearchesApiSlice.util.updateQueryData(
            "getSearches",
            selectCurrentAttemptId(state),
            (draftState) => {
              if (draftState.length === 0) return;
              const indexToRemove = draftState.findIndex(
                (search) => search.createdAt === arg.createdAt,
              );
              if (indexToRemove > -1) {
                draftState.splice(indexToRemove, 1);
              }
            },
          ),
        );
        if (state.auth.isGuest || !arg.id) {
          return { data: true };
        }
        try {
          await baseQuery({
            url: `/search_panel_searches/${arg.id}`,
            method: "DELETE",
          });
        } catch (err) {
          console.log("Couldn't delete search on back end:", err);
        }
        return { data: true };
      },
    }),
  }),
});

export const {
  useLazyGetSearchesQuery,
  useAddSearchMutation,
  useDeleteSearchMutation,
} = searchPanelSearchesApiSlice;
