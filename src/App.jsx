import { Routes } from "react-router-dom";
import ErrorBoundary from "@/components/common/ErrorBoundary.jsx";
import { AuthProvider } from "@/context/AuthContext";
import AppToaster from "@/inc/ui/Toaster.jsx";
import { routes } from "@/routes/index.jsx";
import { renderRoutes } from "@/routes/route-renderer.jsx";

export default function App() {
    return (
        <ErrorBoundary>
            <AuthProvider>
                <Routes>
                    {renderRoutes(routes)}
                </Routes>
                <AppToaster />
            </AuthProvider>
        </ErrorBoundary>
    );
}
