import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../app/hooks";
import {
  selectGuessListSettingsCollapsed,
  toggleSettingsCollapsed,
} from "./guessListSettingsSlice";
import * as Collapsible from "@radix-ui/react-collapsible";
import { SettingsHeader } from "../../hints/generalControls/SettingsHeader";
import { HeaderDisclosureWidget } from "../../../utils/HeaderDisclosureWidget";
import { GuessListSettingsContent } from "./GuessListSettingsContent";

export function GuessListSettings() {
  const dispatch = useDispatch();
  const settingsCollapsed = useAppSelector(selectGuessListSettingsCollapsed);

  return (
    <Collapsible.Root
      className="sb-guess-list-settings collapsible-settings"
      open={!settingsCollapsed}
    >
      <SettingsHeader>
        <Collapsible.Trigger asChild>
          <button
            className="sb-hint-panel-settings-header-button collapsible-settings-header-button"
            onClick={() => dispatch(toggleSettingsCollapsed())}
          >
            <HeaderDisclosureWidget title="Settings" />
          </button>
        </Collapsible.Trigger>
      </SettingsHeader>
      <Collapsible.Content className="sb-guess-list-settings-controls">
        <GuessListSettingsContent />
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
