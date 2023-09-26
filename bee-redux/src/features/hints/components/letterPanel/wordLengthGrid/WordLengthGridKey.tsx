import {
  StatusTrackingKeys,
  StatusTrackingOptions,
} from "@/features/hintPanels/types";

export function WordLengthGridKey({
  statusTracking,
}: {
  statusTracking: StatusTrackingKeys;
}) {
  return (
    <div className="LetterPanel_WLG_Key">
      <div>Key: Showing</div>
      <div className="LetterPanel_WLG_TrackingKey">
        {StatusTrackingOptions[statusTracking].compactTitle}
      </div>
    </div>
  );
}
