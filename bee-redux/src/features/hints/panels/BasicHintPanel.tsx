import { HintPanelProps } from "../HintPanel"
import { isBasicPanelSettings } from "../hintProfilesSlice"
import { WordCount } from "./basic/WordCount"
import { PangramCount } from "./basic/PangramCount"
import { PerfectPangramCount } from "./basic/PerfectPangramCount"
import { TotalPoints } from "./basic/TotalPoints"

export function BasicHintPanel({ panel }: HintPanelProps) {
  const content = () => {
    if (isBasicPanelSettings(panel.typeSpecificData)) {
      const {
        showWordCount,
        showTotalPoints,
        showPangramCount,
        showPerfectPangramCount,
      } = panel.typeSpecificData

      return (
        <div className="sb-basic-hints">
          <div className="sb-word-count">
            <WordCount
              panelId={panel.id}
              showWordCount={showWordCount}
              tracking={panel.tracking}
            />
          </div>
          <div className="sb-total-points">
            <TotalPoints
              panelId={panel.id}
              showTotalPoints={showTotalPoints}
              tracking={panel.tracking}
            />
          </div>
          <div className="sb-pangram-count">
            <PangramCount
              panelId={panel.id}
              showPangramCount={showPangramCount}
              tracking={panel.tracking}
            />
          </div>
          <div className="sb-perfect-pangram-count">
            <PerfectPangramCount
              panelId={panel.id}
              showPerfectPangramCount={showPerfectPangramCount}
              tracking={panel.tracking}
            />
          </div>
        </div>
      )
    }
  }

  return content()
}
