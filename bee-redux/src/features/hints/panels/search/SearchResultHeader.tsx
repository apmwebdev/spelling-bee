import {
  removeSearch,
  SearchPanelLocations,
  SearchPanelSearch,
  StringHintDisplayOptions,
} from "../../hintProfilesSlice"
import { HeaderRemoveButton } from "../../../../utils/HeaderRemoveButton"
import { useDispatch } from "react-redux"

export function SearchResultHeader({
  panelId,
  searchObject,
}: {
  panelId: number
  searchObject: SearchPanelSearch
}) {
  const { searchId, searchString, searchLocation, offset, display } =
    searchObject
  const dispatch = useDispatch()

  const title = () => {
    const offsetString = () => {
      let returnString = ""
      for (let i = 0; i < offset; i++) {
        returnString += "-"
      }
      return returnString
    }

    let titleString = ""

    if (searchLocation === SearchPanelLocations.Anywhere) {
      titleString += `...${searchString.toUpperCase()}... `
    } else if (searchLocation === SearchPanelLocations.Beginning) {
      titleString += `${offsetString()}${searchString.toUpperCase()}... `
    } else if (searchLocation === SearchPanelLocations.End) {
      titleString += `...${searchString.toUpperCase()}${offsetString()} `
    }

    if (display === StringHintDisplayOptions.WordLengthGrid) {
      titleString += " Word Lengths"
    } else if (display === StringHintDisplayOptions.WordCountList) {
      titleString += " Word Count"
    } else {
      titleString += " Yes or No"
    }
    return titleString
  }

  const handleClickRemoveButton = () => {
    dispatch(removeSearch({ panelId, searchId }))
  }

  return (
    <header className="sb-search-hints-search-result-header">
      <HeaderRemoveButton clickHandler={handleClickRemoveButton} />
      <div className="search-result-title">{title()}</div>
    </header>
  )
}
