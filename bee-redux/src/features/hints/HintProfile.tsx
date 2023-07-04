import { useDispatch } from "react-redux"
import { useAppSelector } from "../../app/hooks"
import {
  ChangeProfilePayload,
  selectCurrentHintProfile,
  selectHintProfiles,
  setCurrentProfile,
} from "./hintProfilesSlice"

export function HintProfile() {
  const dispatch = useDispatch()
  const profiles = useAppSelector(selectHintProfiles)
  const currentProfile = useAppSelector(selectCurrentHintProfile)

  const handleChange = (e: any) => {
    const payload: ChangeProfilePayload = {
      oldCurrent: currentProfile.id,
      newCurrent: Number(e.target.value),
    }
    dispatch(setCurrentProfile(payload))
  }

  return (
    <div className="sb-hint-profile">
      Hint profile:&nbsp;
      <select value={currentProfile.id} onChange={(e) => handleChange(e)}>
        {profiles.map((profile) => {
          return <option value={profile.id}>{profile.name}</option>
        })}
      </select>
    </div>
  )
}
