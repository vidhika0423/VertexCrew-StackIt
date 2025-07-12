export function getUserRole(user) {
    return user?.publicMetadata?.role || "guest";
  }
  