import AuthLayout from "@/layouts/AuthLayout.jsx";
import Forbidden from "@/pages/Forbidden.jsx";
import NotFound from "@/pages/NotFound.jsx";
import PublicExamplePage from "@/pages/PublicExamplePage.jsx";
import Login from "@/pages/auth/Login.jsx";

export const publicRoutes = [
  {
    layout: <AuthLayout/>,
    children: [
      { path: "/public-example", element: <PublicExamplePage/> },
      { path: "/login", element: <Login /> },
      /*{ path: "/login", element: <Login /> },
      { path: "/password-recovery", element: <PasswordRecovery /> },
      { path: "/reset", element: <ResetPassword /> },*/
    ],
  },
  {path: "/forbidden", element: <Forbidden/>},
  {path: "/404", element: <NotFound/>},
  {path: "*", element: <NotFound/>},
];
