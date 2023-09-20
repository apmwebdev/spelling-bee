interface LetterCellProps {
  letter: string;
  isCenter: boolean;
}

export default function LetterCell({ letter, isCenter }: LetterCellProps) {
  const handleClick = () => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: letter }));
  };
  // TODO: Make these fully accessible buttons
  return (
    <svg
      className={isCenter ? "LetterCell centerLetter" : "LetterCell"}
      viewBox="0 0 140 121.2435565"
      onClick={handleClick}
      role="button"
    >
      <polygon
        points="0,60.62177826 35,0 105,0 140,60.62177826 105,121.2435565 35,121.2435565"
        strokeWidth="8.75"
      ></polygon>
      <text x="50%" y="50%" dy="0.35em">
        {letter.toUpperCase()}
      </text>
    </svg>
  );
}
