/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { apiSlice, keysToSnakeCase } from "@/features/api";
import { SearchPanelSearchData } from "@/features/searchPanelSearches";
import { devLog } from "@/util";
import {
  UuidRecordStatus,
  UuidUpdateData,
} from "@/features/api/types/apiTypes";

const railsifyAddSearchData = (newSearch: SearchPanelSearchData) => {
  return {
    search_panel_search: {
      ...keysToSnakeCase(newSearch),
      user_puzzle_attempt_uuid: newSearch.attemptUuid,
      //Remove the attempt_id key so that Rails doesn't complain
      attempt_uuid: undefined,
    },
  };
};

export const searchPanelSearchesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSearches: builder.query<SearchPanelSearchData[], string>({
      query: (attemptUuid) => ({
        url: `/search_panel_search/${attemptUuid}`,
      }),
    }),

    addSearch: builder.mutation<SearchPanelSearchData, SearchPanelSearchData>({
      query: (formData) => ({
        url: "/search_panel_searches",
        method: "POST",
        body: railsifyAddSearchData(formData),
      }),
    }),

    deleteSearch: builder.mutation<boolean, string>({
      query: (uuid) => ({
        url: `/search_panel_searches/${uuid}`,
        method: "DELETE",
      }),
    }),

    addBulkSearchPanelSearches: builder.mutation<
      UuidRecordStatus[],
      SearchPanelSearchData[]
    >({
      query: (searchData) => ({
        url: "/search_panel_searches/bulk_add",
        method: "POST",
        body: searchData.map((search) => railsifyAddSearchData(search)),
      }),
    }),

    updateSearchPanelSearchUuids: builder.mutation<
      UuidUpdateData[],
      UuidUpdateData[]
    >({
      queryFn: (uuids, api) => {
        devLog("This endpoint hasn't been implemented yet.");
        return { data: [] };
      },
    }),
  }),
});

export const {
  useLazyGetSearchesQuery,
  useAddSearchMutation,
  useDeleteSearchMutation,
} = searchPanelSearchesApiSlice;
