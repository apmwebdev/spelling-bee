import * as Select from "@/components/radix-ui/radix-select";
import uniqid from "uniqid";
import {
  hintProfilesApiSlice,
  useSetCurrentHintProfileMutation,
} from "@/features/hintProfiles";
import {
  HintProfileBasicData,
  HintProfileTypes,
} from "@/features/hintProfiles/types";

export function HintProfilesSelector() {
  const currentProfile =
    hintProfilesApiSlice.endpoints.getCurrentHintProfile.useQueryState(
      undefined,
    );
  const profiles =
    hintProfilesApiSlice.endpoints.getHintProfiles.useQueryState(undefined);
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
      <Select.Trigger />
      <Select.ContentWithPortal>
        <Select.Viewport>
          <Select.Group>
            <Select.Label>My hint profiles</Select.Label>
            {profiles.data?.userHintProfiles.length ? (
              profiles.data.userHintProfiles.map((profile) => (
                <Select.Item
                  key={uniqid()}
                  value={composeValueString(profile)}
                  itemText={profile.name}
                />
              ))
            ) : (
              <Select.Item
                value=""
                className="SelectItem"
                itemText="No profiles"
                disabled
              />
            )}
          </Select.Group>
          <Select.Group>
            <Select.Label>Default hint profiles</Select.Label>
            {profiles.data?.defaultHintProfiles.map((profile) => (
              <Select.Item
                key={uniqid()}
                value={composeValueString(profile)}
                itemText={profile.name}
              />
            ))}
          </Select.Group>
        </Select.Viewport>
      </Select.ContentWithPortal>
    </Select.Root>
  );
}
