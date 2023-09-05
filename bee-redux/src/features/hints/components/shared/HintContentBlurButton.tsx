import { IconButton, IconButtonTypeKeys } from "@/components/IconButton";
import { useAppDispatch } from "@/app/hooks";
import {
  PanelCurrentDisplayStateProperties,
  setPanelDisplayPropThunk,
} from "@/features/hints/hintProfilesSlice";

export function HintContentBlurButton({
  panelId,
  isBlurred,
}: {
  panelId: number;
  isBlurred: boolean;
}) {
  const dispatch = useAppDispatch();
  const handleClick = () => {
    dispatch(
      setPanelDisplayPropThunk({
        panelId,
        property: PanelCurrentDisplayStateProperties.isBlurred,
        value: !isBlurred,
      }),
    );
  };

  return (
    <IconButton
      type={isBlurred ? IconButtonTypeKeys.Show : IconButtonTypeKeys.Hide}
      tooltip={isBlurred ? "Show hint content" : "Hide hint content"}
      onClick={handleClick}
      className="HintContentBlurButton"
    />
  );
}
