import {
  PanelInitialDisplayOptions,
  setInitialDisplay,
  setTracking,
} from "@/features/hints/hintProfilesSlice";
import { useDispatch } from "react-redux";
import { ChangeEvent } from "react";
import { HintPanelData, StatusTrackingOptions } from "@/features/hints";

interface GeneralPanelSettingsProps {
  panel: HintPanelData;
}

export function GeneralPanelSettings({ panel }: GeneralPanelSettingsProps) {
  const dispatch = useDispatch();

  const handleTrackingChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const payload = {
      panelId: panel.id,
      tracking: e.target.value as StatusTrackingOptions,
    };
    dispatch(setTracking(payload));
  };

  const liveUpdateOptions = () => {
    return (
      <select value={panel.statusTracking} onChange={handleTrackingChange}>
        <option value={StatusTrackingOptions.RemainingOfTotal}>
          Remaining of total
        </option>
        <option value={StatusTrackingOptions.FoundOfTotal}>
          Found of total
        </option>
        <option value={StatusTrackingOptions.Remaining}>Remaining</option>
        <option value={StatusTrackingOptions.Found}>Found</option>
        <option value={StatusTrackingOptions.Total}>Total</option>
      </select>
    );
  };

  const handleInitialDisplayChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const payload = {
      panelId: panel.id,
      initialDisplay: e.target.value as PanelInitialDisplayOptions,
    };
    dispatch(setInitialDisplay(payload));
  };

  // const initialDisplayOptions = () => {
  //   return (
  //     <select
  //       value={panel.initialDisplay}
  //       onChange={handleInitialDisplayChange}
  //     >
  //       <option value={PanelInitialDisplayOptions.Sticky}>Sticky</option>
  //       <option value={PanelInitialDisplayOptions.Expanded}>Expanded</option>
  //       <option value={PanelInitialDisplayOptions.Blurred}>Blurred</option>
  //       <option value={PanelInitialDisplayOptions.Collapsed}>Collapsed</option>
  //       {/*<option*/}
  //       {/*  key={uniqid()}*/}
  //       {/*  value={PanelInitialDisplayOptions.CollapsedAndBlurred}*/}
  //       {/*>*/}
  //       {/*  Collapsed and blurred*/}
  //       {/*</option>*/}
  //     </select>
  //   );
  // };

  return (
    <div className="sb-general-hint-settings">
      <div className="sb-hint-display-section">
        <span>Display:</span> {liveUpdateOptions()}
      </div>
      <div className="sb-hint-load-section">
        <span>Load as:</span> TODO
      </div>
    </div>
  );
}
