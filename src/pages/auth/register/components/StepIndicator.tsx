import { STEPS } from "../constants";

interface StepIndicatorProps {
  currentStepIndex: number;
}

const baseStepClass =
  "h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium border";

const getStepStateClass = (i: number, current: number): string => {
  if (i < current) return "bg-primary text-primary-foreground border-primary";
  if (i === current) return "bg-foreground/5 border-foreground/20";
  return "bg-muted border-muted-foreground/20 text-muted-foreground";
};

export default function StepIndicator({ currentStepIndex }: StepIndicatorProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {STEPS.map((s, i) => {
          const stepClass = `${baseStepClass} ${getStepStateClass(i, currentStepIndex)}`;
          const connectorClass = `mx-2 h-[2px] w-10 sm:w-16 ${
            i < currentStepIndex ? "bg-primary" : "bg-muted"
          }`;

          return (
            <div key={s.key} className="flex items-center">
              <div className={stepClass}>{i + 1}</div>
              {i < STEPS.length - 1 && <div className={connectorClass} />}
            </div>
          );
        })}
      </div>
      <div className="text-sm opacity-0 select-none">placeholder</div>
    </div>
  );
}
