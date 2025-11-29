import { lazy } from "react";
import AuthLayout from "@/layouts/AuthLayout";
import Forbidden from "@/pages/Forbidden";
import NotFound from "@/pages/NotFound";
import PublicExamplePage from "@/pages/PublicExamplePage";


const Login = lazy(() => import("@/pages/auth/Login"));
const Register = lazy(() => import("@/pages/auth/Register"));
const PasswordRecovery = lazy(() => import("@/pages/auth/PasswordRecovery"));
const ResetPassword = lazy(() => import("@/pages/auth/ResetPassword"));
const VerifyEmail = lazy(() => import("@/pages/auth/VerifyEmail"));

export const publicRoutes = [
  {
    layout: <AuthLayout />,
    children: [
      { index: true, element: <Login /> },
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
