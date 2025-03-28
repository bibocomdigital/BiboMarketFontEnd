
/**
 * User role enumeration
 */
export enum UserRole {
  CLIENT = "client",
  MERCHANT = "commercant",
  SUPPLIER = "fournisseur"
}

/**
 * User role display names
 */
export const USER_ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.CLIENT]: "Client",
  [UserRole.MERCHANT]: "Commerçant",
  [UserRole.SUPPLIER]: "Fournisseur"
};
