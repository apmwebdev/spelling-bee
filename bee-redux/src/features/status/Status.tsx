import { Progress } from "./Progress";
import { HintSection } from "../hints/HintSection";

export function Status() {
  return (
    <div className="sb-status">
      <Progress />
      <HintSection />
    </div>
  );
}
