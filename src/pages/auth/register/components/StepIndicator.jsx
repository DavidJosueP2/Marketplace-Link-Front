import { STEPS } from "../constants";

export default function StepIndicator({ currentStepIndex }) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {STEPS.map((s, i) => (
          <div key={s.key} className="flex items-center">
            <div
              className={[
                "h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium border",
                i < currentStepIndex
                  ? "bg-primary text-primary-foreground border-primary"
                  : i === currentStepIndex
                    ? "bg-foreground/5 border-foreground/20"
                    : "bg-muted border-muted-foreground/20 text-muted-foreground",
              ].join(" ")}
            >
              {i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={[
                  "mx-2 h-[2px] w-10 sm:w-16",
                  i < currentStepIndex ? "bg-primary" : "bg-muted",
                ].join(" ")}
              />
            )}
          </div>
        ))}
      </div>
      <div className="text-sm opacity-0 select-none">placeholder</div>
    </div>
  );
}