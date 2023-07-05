import { HintPanelProps } from "../HintPanel"
import { isBasicPanelSettings } from "../hintProfilesSlice"
import { WordCount } from "./basic/WordCount"
import { PangramCount } from "./basic/PangramCount"
import { PerfectPangramCount } from "./basic/PerfectPangramCount"
import { TotalPoints } from "./basic/TotalPoints"

export function BasicHintPanel({ panel }: HintPanelProps) {
  const content = () => {
    if (isBasicPanelSettings(panel.typeOptions)) {
      const {
        showWordCount,
        showTotalPoints,
        showPangramCount,
        showPerfectPangramCount,
      } = panel.typeOptions

      return (
        <div className="sb-basic-hints">
          <div>{panel.name}</div>
          <div className="sb-word-count">
            <WordCount
              showWordCount={showWordCount}
              tracking={panel.tracking}
            />
          </div>
          <div className="sb-pangram-count">
            <PangramCount
              showPangramCount={showPangramCount}
              tracking={panel.tracking}
            />
          </div>
          <div className="sb-perfect-pangram-count">
            <PerfectPangramCount
              showPerfectPangramCount={showPerfectPangramCount}
              tracking={panel.tracking}
            />
          </div>
          <div className="sb-total-points">
            <TotalPoints
              showTotalPoints={showTotalPoints}
              tracking={panel.tracking}
            />
          </div>
        </div>
      )
    }
  }

  return <div>{content()}</div>
}
