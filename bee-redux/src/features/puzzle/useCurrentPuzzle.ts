import { useParams } from "react-router-dom";
import { useGetPuzzleQuery } from "./puzzleApiSlice";

export const useCurrentPuzzle = () => {
  const params = useParams();
  return useGetPuzzleQuery(params.identifier ? params.identifier : "latest", {
    refetchOnMountOrArgChange: true,
  });
};
