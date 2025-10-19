export default function Feedback({ showBanner, message, status }) {
  if (!showBanner || !message) return null;

  const isSuccess = status === "success";
  const isError = status === "invalid" || status === "expired" || status === "error";

  return (
    <div
      className={`mb-4 flex items-center justify-center gap-2 text-sm font-medium px-4 py-2 rounded-lg text-center ${
        isSuccess
          ? "bg-green-100/40 text-green-700 dark:bg-green-900/20 dark:text-green-400"
          : isError
            ? "bg-red-100/40 text-red-700 dark:bg-red-900/20 dark:text-red-400"
            : "text-muted-foreground"
      }`}
    >
      <span
        className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-white ${
          isSuccess ? "bg-green-600" : isError ? "bg-red-600" : "bg-gray-400"
        }`}
      >
        {isSuccess ? "✓" : isError ? "✕" : "•"}
      </span>
      <span>{message}</span>
    </div>
  );
}

