import AuthLayout from "@/layouts/AuthLayout";
import Forbidden from "@/pages/Forbidden";
import NotFound from "@/pages/NotFound";
import PublicExamplePage from "@/pages/PublicExamplePage";
import Login from "@/pages/auth/Login";

export const publicRoutes = [
  {
    layout: <AuthLayout />,
    children: [
      { path: "/public-example", element: <PublicExamplePage /> },
      { path: "/login", element: <Login /> },
      /*{ path: "/login", element: <Login /> },
      { path: "/password-recovery", element: <PasswordRecovery /> },
      { path: "/reset", element: <ResetPassword /> },*/
    ],
  },
  { path: "/forbidden", element: <Forbidden /> },
  { path: "/404", element: <NotFound /> },
  { path: "*", element: <NotFound /> },
];
