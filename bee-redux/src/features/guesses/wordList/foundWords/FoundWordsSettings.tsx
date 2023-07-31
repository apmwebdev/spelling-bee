import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../../app/hooks";
import {
  selectWordListFoundSettingsCollapsed,
  toggleFoundSettingsCollapsed,
} from "../wordListSettingsSlice";
import * as Collapsible from "@radix-ui/react-collapsible";
import { SettingsHeader } from "../../../hints/generalControls/SettingsHeader";
import { HeaderDisclosureWidget } from "../../../../utils/HeaderDisclosureWidget";
import { FoundWordsSettingsContent } from "./FoundWordsSettingsContent";

export function FoundWordsSettings() {
  const dispatch = useDispatch();
  const settingsCollapsed = useAppSelector(
    selectWordListFoundSettingsCollapsed,
  );

  return (
    <Collapsible.Root
      className="sb-guess-list-settings collapsible-settings"
      open={!settingsCollapsed}
    >
      <SettingsHeader>
        <Collapsible.Trigger asChild>
          <button
            className="sb-hint-panel-settings-header-button collapsible-settings-header-button"
            onClick={() => dispatch(toggleFoundSettingsCollapsed())}
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
