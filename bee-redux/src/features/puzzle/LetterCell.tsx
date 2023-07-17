
interface LetterCellProps {
  letter: string
  isCenter: boolean
}

export default function LetterCell({ letter, isCenter }: LetterCellProps) {
  return (
    <svg
      className={isCenter ? "hexagon center-letter" : "hexagon"}
      viewBox="0 0 140 121.2435565"
    >
      <polygon
        points="0,60.62177826 35,0 105,0 140,60.62177826 105,121.2435565 35,121.2435565"
        stroke="#242424"
        strokeWidth="8.75"
      ></polygon>
      <text x="50%" y="50%" dy="0.35em">
        {letter.toUpperCase()}
      </text>
    </svg>
  )
}
