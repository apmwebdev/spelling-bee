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
