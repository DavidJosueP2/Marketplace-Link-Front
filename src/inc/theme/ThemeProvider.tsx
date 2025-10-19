import type {ReactNode} from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

interface Props {
  children: ReactNode;
}

export default function Providers({ children }: Readonly<Props>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
