import {
  HintPanelFormat,
  PanelInitialDisplayOptions,
  setInitialDisplay,
  setTracking,
  TrackingOptions,
} from "./hintProfilesSlice";
import uniqid from "uniqid";
import { useDispatch } from "react-redux";
import { ChangeEvent } from "react";

interface GeneralPanelSettingsProps {
  panel: HintPanelFormat;
}

export function GeneralPanelSettings({ panel }: GeneralPanelSettingsProps) {
  const dispatch = useDispatch();

  const handleTrackingChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const payload = {
      panelId: panel.id,
      tracking: e.target.value as TrackingOptions,
    };
    dispatch(setTracking(payload));
  };

  const liveUpdateOptions = () => {
    return (
      <select value={panel.tracking} onChange={handleTrackingChange}>
        <option value={TrackingOptions.RemainingOfTotal}>
          Remaining of total
        </option>
        <option value={TrackingOptions.FoundOfTotal}>Found of total</option>
        <option value={TrackingOptions.Remaining}>Remaining</option>
        <option value={TrackingOptions.Found}>Found</option>
        <option value={TrackingOptions.Total}>Total</option>
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

  const initialDisplayOptions = () => {
    return (
      <select
        value={panel.initialDisplay}
        onChange={handleInitialDisplayChange}
      >
        <option value={PanelInitialDisplayOptions.Sticky}>Sticky</option>
        <option value={PanelInitialDisplayOptions.Expanded}>Expanded</option>
        <option value={PanelInitialDisplayOptions.Blurred}>Blurred</option>
        <option value={PanelInitialDisplayOptions.Collapsed}>Collapsed</option>
        {/*<option*/}
        {/*  key={uniqid()}*/}
        {/*  value={PanelInitialDisplayOptions.CollapsedAndBlurred}*/}
        {/*>*/}
        {/*  Collapsed and blurred*/}
        {/*</option>*/}
      </select>
    );
  };

  return (
    <div className="sb-general-hint-settings">
      <div className="sb-hint-display-section">
        <span>Display:</span> {liveUpdateOptions()}
      </div>
      <div className="sb-hint-load-section">
        <span>Load as:</span> {initialDisplayOptions()}
      </div>
    </div>
  );
}
