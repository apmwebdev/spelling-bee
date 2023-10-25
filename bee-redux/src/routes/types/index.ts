export type TRoutingError = {
  data: string;
  error?: {
    columnNumber: number;
    fileName: string;
    lineNumber: number;
    message: string;
    stack: string;
  };
  internal?: boolean;
  status: number;
  statusText: string;
};

export const isRoutingError = (a: any): a is TRoutingError => {
  return "data" in a && "status" in a && "statusText" in a;
};
