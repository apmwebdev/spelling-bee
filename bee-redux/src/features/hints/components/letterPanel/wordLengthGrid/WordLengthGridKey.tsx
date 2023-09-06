import { StatusTrackingKeys, StatusTrackingOptions } from "@/features/hints";

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
      {/*<div>*/}
      {/*  <div className="sb-wlg-content-full HintCompleted">*/}
      {/*    Green = finished*/}
      {/*  </div>*/}
      {/*  <div className="sb-wlg-content-full HintInProgress">*/}
      {/*    Yellow = In progress*/}
      {/*  </div>*/}
      {/*  <div className="sb-wlg-content-full HintNotStarted">*/}
      {/*    Red = Not started*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  );
}
