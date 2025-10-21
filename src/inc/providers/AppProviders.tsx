import type { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/reactQueryClient";
import { Toaster } from "sonner";
import ThemeProvider from "@/inc/theme/ThemeProvider";

interface AppProvidersProps {
  readonly children: ReactNode;
}

export default function AppProviders({ children }: Readonly<AppProvidersProps>) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>{children}</BrowserRouter>
        <Toaster position="top-right" richColors />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
