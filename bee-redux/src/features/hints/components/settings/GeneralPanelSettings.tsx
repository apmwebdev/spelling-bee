import {
  PanelInitialDisplayOptions,
  setInitialDisplay,
  setTracking,
} from "@/features/hints/hintProfilesSlice";
import { useDispatch } from "react-redux";
import { ChangeEvent } from "react";
import { HintPanelData, StatusTrackingKeys } from "@/features/hints";
import { PanelStatusTrackingControl } from "@/features/hints/components/settings/PanelStatusTrackingControl";
import { PanelInitialDisplayControls } from "@/features/hints/components/settings/PanelInitialDisplayControls";
import { PanelNameInputForm } from "@/features/hints/components/settings/PanelNameInputForm";
import uniqid from "uniqid";

export function GeneralPanelSettings({ panel }: { panel: HintPanelData }) {
  const dispatch = useDispatch();

  const handleTrackingChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const payload = {
      panelId: panel.id,
      tracking: e.target.value as StatusTrackingKeys,
    };
    dispatch(setTracking(payload));
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
    <div className="GeneralPanelSettings">
      <div className="GeneralPanelSettingsStatusTracking">
        <span>Display:</span> <PanelStatusTrackingControl panel={panel} />
      </div>
      <PanelNameInputForm panel={panel} inputId={`PanelNameInput${uniqid()}`} />
      <PanelInitialDisplayControls panel={panel} />
    </div>
  );
}
