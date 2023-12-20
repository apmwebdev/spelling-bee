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
  serverData: Array<UuidRecord>;
  serverBulkSaveFn: (serverData: Array<UuidRecord>) => Array<UuidRecordStatus>;
  idbData: Array<UuidRecord>;
  idbBulkSaveFn: (idbData: Array<UuidRecord>) => Array<UuidRecordStatus>;
  bulkDeleteData: Array<Uuid>;
  bulkDeleteFn: (bulkDeleteData: Array<Uuid>) => Array<UuidRecordStatus>;
}) => {
  const serverResults = await serverBulkSaveFn(serverData);
  const deletionResults = await bulkDeleteFn(bulkDeleteData);
  const idbResults = await idbBulkSaveFn(idbData);
};

export type IdbUuidSyncFn = (
  uuidData: Array<UuidUpdateData>,
) => Promise<Array<UuidUpdateData>>;

export type UuidSyncFns = {
  //TODO: Fix type here
  serverUuidUpdateFn: Function;
  idbUuidUpdateFn: IdbUuidSyncFn;
  stateUuidUpdateFn: ActionCreatorWithPayload<Array<UuidUpdateData>>;
};

export type UuidSyncData = {
  serverData: Array<UuidUpdateData>;
  idbData: Array<UuidUpdateData>;
};

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
