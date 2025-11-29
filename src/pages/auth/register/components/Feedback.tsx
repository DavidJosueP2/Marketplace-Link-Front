interface FeedbackProps {
  showBanner: boolean;
  message: string;
  status: string;
}

export default function Feedback({ showBanner, message, status }: FeedbackProps) {
  if (!showBanner || !message) return null;

  const isSuccess = status === "success";
  const isError = status === "invalid" || status === "expired" || status === "error";

  let containerClass =
    "text-muted-foreground";
  if (isSuccess) {
    containerClass =
      "bg-green-100/40 text-green-700 dark:bg-green-900/20 dark:text-green-400";
  } else if (isError) {
    containerClass =
      "bg-red-100/40 text-red-700 dark:bg-red-900/20 dark:text-red-400";
  }

  let iconClass = "bg-gray-400";
  let iconSymbol = "•";
  if (isSuccess) {
    iconClass = "bg-green-600";
    iconSymbol = "✓";
  } else if (isError) {
    iconClass = "bg-red-600";
    iconSymbol = "✕";
  }

  return (
    <div
      className={`mb-4 flex items-center justify-center gap-2 text-sm font-medium px-4 py-2 rounded-lg text-center ${containerClass}`}
    >
      <span
        className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-white ${iconClass}`}
      >
        {iconSymbol}
      </span>
      <span>{message}</span>
    </div>
  );
}
