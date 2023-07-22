import { TrackingOptions } from "../../hintProfilesSlice";
import uniqid from "uniqid";

export function WordLengthGridKey({ tracking }: { tracking: TrackingOptions }) {
  const trackingKey = () => {
    switch (tracking) {
      case TrackingOptions.RemainingOfTotal:
        return "Remaining / Total";
      case TrackingOptions.FoundOfTotal:
        return "Found / Total";
      case TrackingOptions.Remaining:
        return "Remaining";
      case TrackingOptions.Found:
        return "Found";
      case TrackingOptions.Total:
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
