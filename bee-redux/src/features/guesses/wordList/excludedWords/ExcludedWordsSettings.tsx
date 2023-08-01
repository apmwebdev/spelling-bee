import * as Collapsible from "@radix-ui/react-collapsible";
import { SettingsHeader } from "../../../hints/generalControls/SettingsHeader";
import {
  selectExcludedWordsListSettings,
  toggleExcludedWordsSettingsCollapsed,
} from "../wordListSettingsSlice";
import { HeaderDisclosureWidget } from "../../../../utils/HeaderDisclosureWidget";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";

export function ExcludedWordsSettings() {
  const dispatch = useAppDispatch();
  const { settingsCollapsed } = useAppSelector(selectExcludedWordsListSettings);
  return (
    <Collapsible.Root
      className="collapsible-settings"
      open={!settingsCollapsed}
    >
      <SettingsHeader>
        <Collapsible.Trigger asChild>
          <button
            className="collapsible-settings-header-button"
            onClick={() => dispatch(toggleExcludedWordsSettingsCollapsed())}
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
