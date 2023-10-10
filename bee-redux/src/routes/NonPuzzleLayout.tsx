import { Outlet } from "react-router-dom";

export function NonPuzzleLayout() {
  return (
    <div className="NonPuzzleLayout">
      <div className="NonPuzzleMain">
        <Outlet />
      </div>
    </div>
  );
}
