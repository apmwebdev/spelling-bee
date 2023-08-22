import {
  getCurrentHintProfile,
  setCurrentHintProfile,
} from "@/features/userData/userDataApiSlice";
import { hintApiSlice } from "@/features/hints/hintApiSlice";
import * as Select from "@radix-ui/react-select";
import {
  SelectContentWithPortal,
  SelectItem,
  SelectTrigger,
  SelectLabel,
} from "@/components/radix-ui/react-select";
import {
  HintProfileBasicData,
  HintProfileData,
  HintProfileTypes,
} from "@/features/hints";
import { Icon } from "@iconify/react";
import uniqid from "uniqid";

export function HintProfiles() {
  const currentProfile = getCurrentHintProfile();
  const profiles =
    hintApiSlice.endpoints.getHintProfiles.useQueryState(undefined);

  const composeValueString = (profile: HintProfileBasicData): string => {
    return `${profile.type} ${profile.id}`;
  };

  const parseValueString = (valueString: string): HintProfileBasicData => {
    const splitValue = valueString.split(" ");
    return {
      type: splitValue[0] as HintProfileTypes,
      id: Number(splitValue[1]),
    };
  };

  const createSelectItem = (profile: HintProfileData) => (
    <Select.Item
      key={uniqid()}
      value={composeValueString(profile)}
      className="SelectItem"
    >
      <Select.ItemIndicator asChild>
        <Icon className="SelectItemIndicator" icon="mdi:check" />
      </Select.ItemIndicator>
      <Select.ItemText>{profile.name}</Select.ItemText>
    </Select.Item>
  );

  return (
    <div className="HintProfiles">
      <span>Hint profile:</span>
      <Select.Root
        value={composeValueString(currentProfile)}
        onValueChange={(value) =>
          setCurrentHintProfile(parseValueString(value))
        }
      >
        <SelectTrigger />
        <SelectContentWithPortal>
          <Select.Viewport>
            <Select.Group>
              <SelectLabel>My hint profiles</SelectLabel>
              {profiles.data?.userHintProfiles.length ? (
                profiles.data.userHintProfiles.map((profile) => (
                  <SelectItem
                    value={composeValueString(profile)}
                    itemText={profile.name}
                  />
                ))
              ) : (
                <SelectItem
                  value=""
                  className="SelectItem"
                  itemText="No profiles"
                  disabled
                />
              )}
            </Select.Group>
            <Select.Group>
              <SelectLabel>Default hint profiles</SelectLabel>
              {profiles.data?.defaultHintProfiles.map((profile) =>
                createSelectItem(profile),
              )}
            </Select.Group>
          </Select.Viewport>
        </SelectContentWithPortal>
      </Select.Root>
    </div>
  );
}
