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
  UuidRecord,
  UuidRecordStatus,
  UuidUpdateData,
} from "@/features/api/types";
import { Uuid } from "@/types";
import { ActionCreatorWithPayload, createAsyncThunk } from "@reduxjs/toolkit";
import { devLog } from "@/util";

export const syncRecords = async ({
  serverData,
  serverBulkSaveFn,
  idbData,
  idbBulkSaveFn,
  bulkDeleteData,
  bulkDeleteFn,
}: {
  serverData: UuidRecord[];
  serverBulkSaveFn: (serverData: UuidRecord[]) => UuidRecordStatus[];
  idbData: UuidRecord[];
  idbBulkSaveFn: (idbData: UuidRecord[]) => UuidRecordStatus[];
  bulkDeleteData: Uuid[];
  bulkDeleteFn: (bulkDeleteData: Uuid[]) => UuidRecordStatus[];
}) => {
  const serverResults = await serverBulkSaveFn(serverData);
  const deletionResults = await bulkDeleteFn(bulkDeleteData);
  const idbResults = await idbBulkSaveFn(idbData);
};

export type IdbUuidSyncFn = (
  uuidData: UuidUpdateData[],
) => Promise<UuidUpdateData[]>;

export type UuidSyncFns = {
  //TODO: Fix type here
  serverUuidUpdateFn: Function;
  idbUuidUpdateFn: IdbUuidSyncFn;
  stateUuidUpdateFn: ActionCreatorWithPayload<UuidUpdateData[]>;
};

export type UuidSyncData = {
  serverData: UuidUpdateData[];
  idbData: UuidUpdateData[];
};

//TODO: Make this recursive or a loop so it will keep trying new UUIDs until one works in both
// places
export const createUuidSyncThunk = ({
  serverUuidUpdateFn,
  idbUuidUpdateFn,
  stateUuidUpdateFn,
}: UuidSyncFns) => {
  return createAsyncThunk(
    "synchronizer/syncUuids",
    async ({ serverData, idbData }: UuidSyncData, api) => {
      const serverResults = await api.dispatch(serverUuidUpdateFn(serverData));
      const idbResults = await idbUuidUpdateFn(idbData);
      if (serverResults === idbResults) devLog("blah");
    },
  );
};
