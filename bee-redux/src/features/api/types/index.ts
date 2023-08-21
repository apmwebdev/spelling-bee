import { AnyAction } from "@reduxjs/toolkit";

export interface ApiSliceAction extends AnyAction {
  type: string;
  payload: any;
  meta: {
    fulfilledTimestamp: number;
    RTK_autobatch: boolean;
    arg: {
      type: "query" | "mutation";
      subscribe: boolean;
      forceRefetch: boolean;
      subscriptionOptions: {
        pollingInterval: number;
      };
      endpointName: string;
      queryCacheKey: string;
    };
    requestId: string;
    requestStatus: string;
  };
}

/**
 * QueryResultSelectorResult
 * QueryActionCreatorResult
 * FulfilledMeta
 * arg might be ThunkArg
 */
