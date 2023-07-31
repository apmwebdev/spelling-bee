import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../app/hooks";
import {
  selectWordListSettingsCollapsed,
  toggleSettingsCollapsed,
} from "./wordListSettingsSlice";
import * as Collapsible from "@radix-ui/react-collapsible";
import { SettingsHeader } from "../../hints/generalControls/SettingsHeader";
import { HeaderDisclosureWidget } from "../../../utils/HeaderDisclosureWidget";
import { FoundWordsSettingsContent } from "./FoundWordsSettingsContent";

export function FoundWordsSettings() {
  const dispatch = useDispatch();
  const settingsCollapsed = useAppSelector(selectWordListSettingsCollapsed);

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
        <FoundWordsSettingsContent />
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
