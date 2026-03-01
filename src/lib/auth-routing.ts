export const AUTH_GUEST_ONLY_ROUTES = ["/login", "/register"] as const;
export const AUTH_PROTECTED_ROUTES = [
  "/profile",
  "/dashboard",
  "/watchlist",
  "/my-listings",
  "/listings/new",
] as const;

export const getAuthRouteRedirect = (
  pathname: string,
  isAuthenticated: boolean,
) => {
  const isProtected = AUTH_PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (!isAuthenticated && isProtected) {
    return "/login";
  }

  const isGuestOnly = AUTH_GUEST_ONLY_ROUTES.some(
    (route) => pathname === route,
  );

  if (isAuthenticated && isGuestOnly) {
    return "/profile";
  }

  return null;
};
