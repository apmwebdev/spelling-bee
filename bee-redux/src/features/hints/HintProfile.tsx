import { useDispatch } from "react-redux"
import { useAppSelector } from "../../app/hooks"
import {
  ChangeProfilePayload,
  selectHintProfiles,
  setCurrentProfile,
} from "./hintProfilesSlice"
import { ChangeEvent } from "react"

export function HintProfile() {
  const dispatch = useDispatch()
  const { currentProfile, profiles } = useAppSelector(selectHintProfiles)

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const payload: ChangeProfilePayload = {
      newId: Number(e.target.value),
    }
    dispatch(setCurrentProfile(payload))
  }

  return (
    <div className="sb-hint-profile">
      Hint profile:&nbsp;
      <select value={currentProfile.id} onChange={(e) => handleChange(e)}>
        {profiles.map((profile) => {
          return (
            <option key={profile.id} value={profile.id}>
              {profile.name}
            </option>
          )
        })}
      </select>
    </div>
  )
}
