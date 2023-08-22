import * as Select from "@radix-ui/react-select";
import {
  SelectContentWithPortal,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/radix-ui/react-select";
import uniqid from "uniqid";
import {
  hintApiSlice,
  useSetCurrentHintProfileMutation,
} from "@/features/hints/hintApiSlice";
import { HintProfileBasicData, HintProfileTypes } from "@/features/hints";

export function HintProfilesSelector() {
  const currentProfile =
    hintApiSlice.endpoints.getCurrentHintProfile.useQueryState(undefined);
  const profiles =
    hintApiSlice.endpoints.getHintProfiles.useQueryState(undefined);
  const [setCurrentHintProfile] = useSetCurrentHintProfileMutation();

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

  const handleSelect = (value: string) => {
    const parsedValue = parseValueString(value);
    setCurrentHintProfile({
      current_hint_profile_type: parsedValue.type,
      current_hint_profile_id: parsedValue.id,
    });
  };

  if (!currentProfile.isSuccess || !profiles.isSuccess) {
    return <div>No data</div>;
  }

  return (
    <Select.Root
      value={composeValueString(currentProfile.data)}
      onValueChange={(value) => handleSelect(value)}
    >
      <SelectTrigger />
      <SelectContentWithPortal>
        <Select.Viewport>
          <Select.Group>
            <SelectLabel>My hint profiles</SelectLabel>
            {profiles.data?.userHintProfiles.length ? (
              profiles.data.userHintProfiles.map((profile) => (
                <SelectItem
                  key={uniqid()}
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
            {profiles.data?.defaultHintProfiles.map((profile) => (
              <SelectItem
                key={uniqid()}
                value={composeValueString(profile)}
                itemText={profile.name}
              />
            ))}
          </Select.Group>
        </Select.Viewport>
      </SelectContentWithPortal>
    </Select.Root>
  );
}
