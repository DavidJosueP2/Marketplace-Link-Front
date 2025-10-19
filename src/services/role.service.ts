export type Role =
  | "ROLE_ADMIN"
  | "ROLE_MODERATOR"
  | "ROLE_SELLER"
  | "ROLE_BUYER";

const roleService = {
  getRoleAdmin: (): Role => "ROLE_ADMIN",
  getRoleModerator: (): Role => "ROLE_MODERATOR",
  getRoleSeller: (): Role => "ROLE_SELLER",
  getRoleBuyer: (): Role => "ROLE_BUYER",
  getAllRoles: (): Role[] => [
    "ROLE_ADMIN",
    "ROLE_MODERATOR",
    "ROLE_SELLER",
    "ROLE_BUYER",
  ],
};

export default roleService;
