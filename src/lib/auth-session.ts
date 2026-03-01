import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

export const getCurrentSession = async () => {
  const requestHeaders = await headers();

  return auth.api.getSession({
    headers: requestHeaders,
  });
};

export const requireCurrentUserSession = async () => {
  const session = await getCurrentSession();

  if (!session?.user) {
    redirect("/login");
  }

  return session;
};
