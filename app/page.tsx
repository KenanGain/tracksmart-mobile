import { redirect } from "next/navigation";

/**
 * Root entry point. Unauthenticated visitors land on the sign-in screen.
 * After signing in, SignInForm routes the user to /dashboard.
 */
export default function RootPage() {
  redirect("/auth/sign-in");
}
