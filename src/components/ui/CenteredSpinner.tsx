import { Loader2 } from "lucide-react";

export default function CenteredSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/40 backdrop-blur-sm z-[9999]">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  );
}
