const roleService = {
  getRoleAdmin: () => "ROLE_ADMIN",
  getRoleModerator: () => "ROLE_MODERATOR",
  getRoleSeller: () => "ROLE_SELLER",
  getRoleBuyer: () => "ROLE_BUYER",
  getAllRoles: () => [
    "ROLE_ADMIN",
    "ROLE_MODERATOR",
    "ROLE_SELLER",
    "ROLE_BUYER"
  ]
};

export default roleService;