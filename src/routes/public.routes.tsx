import AuthLayout from "@/layouts/AuthLayout";
import Forbidden from "@/pages/Forbidden";
import NotFound from "@/pages/NotFound";
import PublicExamplePage from "@/pages/PublicExamplePage";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import PasswordRecovery from "@/pages/auth/PasswordRecovery";
import ResetPassword from "@/pages/auth/ResetPassword";
import VerifyEmail from "@/pages/auth/VerifyEmail";

export const publicRoutes = [
  {
    layout: <AuthLayout />,
    children: [
      { path: "/public-example", element: <PublicExamplePage /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/password-recovery", element: <PasswordRecovery /> },
      { path: "/reset-password", element: <ResetPassword /> },
      { path: "/verify-email", element: <VerifyEmail /> },
    ],
  },
  { path: "/forbidden", element: <Forbidden /> },
  { path: "/404", element: <NotFound /> },
  { path: "*", element: <NotFound /> },
];
