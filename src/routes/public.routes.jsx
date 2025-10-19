import AuthLayout from "@/layouts/AuthLayout.jsx";
import Forbidden from "@/pages/Forbidden.jsx";
import NotFound from "@/pages/NotFound.jsx";
import Login from "@/pages/auth/Login.jsx";
import Register from "@/pages/auth/Register.jsx";
import VerifyEmail from "@/pages/auth/VerifyEmail.jsx";
import PasswordRecovery from "@/pages/auth/PasswordRecovery.jsx";
import ResetPassword from "@/pages/auth/ResetPassword.jsx";

export const publicRoutes = [
  {
    layout: <AuthLayout/>,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/verify-email", element: <VerifyEmail /> },
      { path: "/password-recovery", element: <PasswordRecovery /> },
      { path: "/reset-password", element: <ResetPassword /> },
    ],
  },
  {path: "/forbidden", element: <Forbidden/>},
  {path: "/404", element: <NotFound/>},
  {path: "*", element: <NotFound/>},
];
