import { useParams } from "react-router-dom";
import { useGetPuzzleQuery } from "@/features/puzzle";

export const useCurrentPuzzle = () => {
  const params = useParams();
  return useGetPuzzleQuery(params.identifier ? params.identifier : "latest", {
    refetchOnMountOrArgChange: true,
  });
};
