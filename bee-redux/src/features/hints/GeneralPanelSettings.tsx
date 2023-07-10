import { HintPanelFormat, setTracking, TrackingOptions } from './hintProfilesSlice';
import uniqid from 'uniqid';
import { useDispatch } from 'react-redux';
import { ChangeEvent } from 'react';

interface GeneralPanelSettingsProps {
  panel: HintPanelFormat
}

export function GeneralPanelSettings({ panel }: GeneralPanelSettingsProps) {
  const dispatch = useDispatch()

  const handleTrackingChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const payload = {
      panelId: panel.id,
      tracking: e.target.value as TrackingOptions,
    }
    dispatch(setTracking(payload))
  }

  const liveUpdateOptions = () => {
    return (
      <select value={panel.tracking} onChange={(e) => handleTrackingChange(e)}>
        <option key={uniqid()} value={TrackingOptions.RemainingOfTotal}>
          Remaining of total
        </option>
        <option key={uniqid()} value={TrackingOptions.FoundOfTotal}>
          Found of total
        </option>
        <option key={uniqid()} value={TrackingOptions.Remaining}>
          Remaining
        </option>
        <option key={uniqid()} value={TrackingOptions.Found}>
          Found
        </option>
        <option key={uniqid()} value={TrackingOptions.Total}>
          Total
        </option>
      </select>
    )
  }

  return (
    <div className="sb-general-hint-settings">
      <span>Display:</span> {liveUpdateOptions()}
    </div>
  )
}