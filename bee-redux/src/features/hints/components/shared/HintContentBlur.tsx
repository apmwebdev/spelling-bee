export function HintContentBlur({ isBlurred }: { isBlurred: boolean }) {
  if (isBlurred) {
    return (
      <div className="HintContentBlur">Content hidden</div>
    );
  }
}
