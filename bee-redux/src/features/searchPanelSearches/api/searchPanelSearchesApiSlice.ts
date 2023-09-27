import { apiSlice, keysToSnakeCase } from "@/features/api";
import { SearchPanelSearchData } from "@/features/searchPanelSearches";

const railsifyAddSearchData = (newSearch: SearchPanelSearchData) => {
  return {
    search_panel_search: {
      ...keysToSnakeCase(newSearch),
      user_puzzle_attempt_id: newSearch.attemptId,
      //Remove the attempt_id key so that Rails doesn't complain
      attempt_id: undefined,
    },
  };
};

export const searchPanelSearchesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSearches: builder.query<SearchPanelSearchData[], number>({
      query: (attemptId) => ({
        url: `/search_panel_search/${attemptId}`,
      }),
    }),

    addSearch: builder.mutation<SearchPanelSearchData, SearchPanelSearchData>({
      query: (formData) => ({
        url: "/search_panel_searches/",
        method: "POST",
        body: railsifyAddSearchData(formData),
      }),
    }),

    deleteSearch: builder.mutation<boolean, number>({
      query: (id) => ({
        url: `/search_panel_searches/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useLazyGetSearchesQuery,
  useAddSearchMutation,
  useDeleteSearchMutation,
} = searchPanelSearchesApiSlice;
