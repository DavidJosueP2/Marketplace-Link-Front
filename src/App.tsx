import { Routes } from "react-router-dom";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { AuthProvider } from "@/context/AuthContext";
import AppToaster from "@/inc/ui/Toaster";
import { routes } from "@/routes/index";
import { renderRoutes } from "@/routes/route-renderer";

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Routes>{renderRoutes(routes)}</Routes>
        <AppToaster />
      </AuthProvider>
    </ErrorBoundary>
  );
}
