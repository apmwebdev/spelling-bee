import { useParams } from "react-router-dom";
import {
  BlankPuzzle,
  PuzzleWithQueryStatusFormat,
  useGetPuzzleQuery,
} from "./puzzleApiSlice";

export const useCurrentPuzzle = (): PuzzleWithQueryStatusFormat => {
  const params = useParams();
  const { data, error, isLoading, isFetching, isSuccess, isError } =
    useGetPuzzleQuery(params.identifier ? params.identifier : "latest", {
      refetchOnMountOrArgChange: true,
    });

  const status = {
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
  };

  if (isSuccess) return { ...data, status };
  return { ...BlankPuzzle, status };
};
