import { FC } from "react"

interface LetterCellProps {
  letter: string
  isCenter: boolean
}

const LetterCell: FC<LetterCellProps> = (props) => {
  return (
    <svg
      className={props.isCenter ? "hexagon center-letter" : "hexagon"}
      viewBox="0 0 120 103.92304845413263"
    >
      <polygon
        points="0,51.96152422706631 30,0 90,0 120,51.96152422706631 90,103.92304845413263 30,103.92304845413263"
        stroke="#242424"
        strokeWidth="7.5"
      ></polygon>
      <text x="50%" y="50%" dy="0.35em">
        {props.letter}
      </text>
    </svg>
  )
}

export default LetterCell
