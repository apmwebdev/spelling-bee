import { HintPanelFormat, PanelTypes } from "./hintProfilesSlice"
import { BasicHintPanel } from "./panels/BasicHintPanel"
import { LetterHintPanel } from "./panels/LetterHintPanel"
import { SearchHintPanel } from "./panels/SearchHintPanel"
import { ExcludedWordsHintPanel } from "./panels/ExcludedWordsHintPanel"
import { WordObscurityHintPanel } from "./panels/WordObscurityHintPanel"
import { DefinitionsHintPanel } from "./panels/DefinitionsHintPanel"
import { useAppSelector } from "../../app/hooks"
import { selectAnswers } from "../puzzle/puzzleSlice"
import { GeneralPanelSettings } from "./GeneralPanelSettings"
import { PanelHeader } from "./generalControls/PanelHeader"

export interface HintPanelProps {
  panel: HintPanelFormat
}

export function HintPanel({ panel }: HintPanelProps) {
  const answers = useAppSelector(selectAnswers)
  const panelContent = (panel: HintPanelFormat) => {
    if (answers.length === 0) {
      return
    }
    switch (panel.type) {
      case PanelTypes.Basic:
        return <BasicHintPanel panel={panel} />
      case PanelTypes.Letter:
        return <LetterHintPanel panel={panel} />
      case PanelTypes.Search:
        return <SearchHintPanel panel={panel} />
      case PanelTypes.ExcludedWords:
        return <ExcludedWordsHintPanel panel={panel} />
      case PanelTypes.WordObscurity:
        return <WordObscurityHintPanel panel={panel} />
      case PanelTypes.Definitions:
        return <DefinitionsHintPanel panel={panel} />
      default:
        return null
    }
  }
  if (!panel.isCollapsed) {
    return (
      <div className="sb-hint-panel">
        <PanelHeader panel={panel} />
        <GeneralPanelSettings panel={panel} />
        <div className="sb-hint-panel-content">{panelContent(panel)}</div>
      </div>
    )
  }
  return (
    <div className="sb-hint-panel">
      <PanelHeader panel={panel} />
    </div>
  )
}
