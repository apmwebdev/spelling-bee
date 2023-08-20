import { StatusTrackingOptions } from "@/features/hints";

export function WordLengthGridKey({
  tracking,
}: {
  tracking: StatusTrackingOptions;
}) {
  const trackingKey = () => {
    switch (tracking) {
      case StatusTrackingOptions.FoundOfTotal:
        return "Found / Total";
      case StatusTrackingOptions.RemainingOfTotal:
        return "Remaining / Total";
      case StatusTrackingOptions.Found:
        return "Found";
      case StatusTrackingOptions.Remaining:
        return "Remaining";
      case StatusTrackingOptions.Total:
        return "Total";
    }
  };

  return (
    <div className="sb-word-length-grid-key">
      <div>Key: Showing</div>
      <div className="sb-wlg-tracking-key">{trackingKey()}</div>
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
