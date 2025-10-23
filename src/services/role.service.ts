export type Role =
  | "ROLE_ADMIN"
  | "ROLE_MODERATOR"
  | "ROLE_SELLER"
  | "ROLE_BUYER"
  | "ROLE_SUPER_ADMIN";

const roleService = {
  getRoleAdmin: (): Role => "ROLE_ADMIN",
  getRoleModerator: (): Role => "ROLE_MODERATOR",
  getRoleSeller: (): Role => "ROLE_SELLER",
  getRoleBuyer: (): Role => "ROLE_BUYER",
  getRoleSuperAdmin: (): Role => "ROLE_SUPER_ADMIN",
  getAllRoles: (): Role[] => [
    "ROLE_ADMIN",
    "ROLE_MODERATOR",
    "ROLE_SELLER",
    "ROLE_BUYER",
  ],
};

export default roleService;
