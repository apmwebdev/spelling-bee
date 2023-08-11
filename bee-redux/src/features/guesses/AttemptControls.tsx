import { AttemptSelector } from "./attemptControls/AttemptSelector";

export function AttemptControls() {
  return (
    <div className="sb-attempt-controls">
      <span>Attempt:</span>
      <AttemptSelector />
      <button type="button" className="small-button">
        New
      </button>
      <button type="button" className="small-button">
        Delete
      </button>
    </div>
  );
}
