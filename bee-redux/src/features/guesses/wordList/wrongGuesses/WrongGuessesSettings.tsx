import * as Collapsible from "@radix-ui/react-collapsible";
import { SettingsHeader } from "../../../hints/generalControls/SettingsHeader";
import {
  selectWrongGuessesListSettings,
  toggleWrongGuessesSettingsCollapsed,
} from "../wordListSettingsSlice";
import { HeaderDisclosureWidget } from "../../../../utils/HeaderDisclosureWidget";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";

export function WrongGuessesSettings() {
  const dispatch = useAppDispatch();
  const { wrongGuessesSettingsCollapsed } = useAppSelector(selectWrongGuessesListSettings);
  return (
    <Collapsible.Root
      className="collapsible-settings"
      open={!wrongGuessesSettingsCollapsed}
    >
      <SettingsHeader>
        <Collapsible.Trigger asChild>
          <button
            className="collapsible-settings-header-button"
            onClick={() => dispatch(toggleWrongGuessesSettingsCollapsed())}
          >
            <HeaderDisclosureWidget title="Settings" />
          </button>
        </Collapsible.Trigger>
      </SettingsHeader>
      <Collapsible.Content>
        blah
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
