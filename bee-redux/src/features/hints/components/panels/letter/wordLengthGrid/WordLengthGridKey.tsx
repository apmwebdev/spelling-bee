import { StatusTrackingKeys, StatusTrackingOptions } from "@/features/hints";

export function WordLengthGridKey({
  statusTracking,
}: {
  statusTracking: StatusTrackingKeys;
}) {
  return (
    <div className="sb-word-length-grid-key">
      <div>Key: Showing</div>
      <div className="sb-wlg-tracking-key">
        {StatusTrackingOptions[statusTracking].compactTitle}
      </div>
      {/*<div>*/}
      {/*  <div className="sb-wlg-content-full hint-completed">*/}
      {/*    Green = finished*/}
      {/*  </div>*/}
      {/*  <div className="sb-wlg-content-full hint-in-progress">*/}
      {/*    Yellow = In progress*/}
      {/*  </div>*/}
      {/*  <div className="sb-wlg-content-full hint-not-started">*/}
      {/*    Red = Not started*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  );
}
