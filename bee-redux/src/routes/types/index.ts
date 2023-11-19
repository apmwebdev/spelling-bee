/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

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
