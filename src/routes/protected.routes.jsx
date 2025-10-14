import AuthLayout from "@/layouts/AuthLayout.jsx";
import RoleBasedHome from "@/routes/role-based-home.jsx";

export const protectedRoutes = [
  {
    protected: true,
    allowedRoles: ["ADMIN"],
    layout: <AuthLayout/>,
    children: [
      // { path: "/admin/dashboard", element: <DashboardPage /> },
      // Ejemplo: esta ruta puede ser accedida tanto por ADMIN como por MODERATOR
      // { path: "/admin/users", element: <UsersPage />, allowedRoles: ["ADMIN", "MODERATOR"] },
    ],
  },
  {
    protected: true,
    allowedRoles: ["MODERATOR"],
    layout: <AuthLayout/>,
    children: [
      // { path: "/moderator/panel", element: <ModeratorPanel /> },
    ],
  },
  {
    protected: true,
    allowedRoles: ["BUYER"],
    layout: <AuthLayout/>,
    children: [
      // { path: "/shop", element: <ShopPage /> },
    ],
  },
  {
    protected: true,
    allowedRoles: ["SELLER"],
    layout: <AuthLayout/>,
    children: [
      // { path: "/sales", element: <SalesPage /> },
    ],
  },
  {
    protected: true,
    layout: <AuthLayout/>,
    children: [
      {index: true, element: <RoleBasedHome/>},
      // { path: "/profile", element: <ProfilePage /> },
    ],
  },
];
