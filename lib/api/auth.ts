/**
 * Auth service — the API/service layer the frontend talks to.
 *
 * Frontend ⇄ this file ⇄ lib/data/users.ts (mock backend)
 *
 * Today it resolves against the mock data file. When the real TrackSmart
 * backend is ready, only this file changes — the sign-in screen keeps
 * calling `signIn()` / `listDemoUsers()` unchanged.
 */
import { demoUsers, DEMO_PASSWORD, type DemoUser } from "@/lib/data/users";

export type SignInResult =
  | { ok: true; user: DemoUser }
  | { ok: false; error: string };

/**
 * Mock sign-in. No real authentication is performed (prototype build).
 * Succeeds when the email matches a demo account and the password is the
 * shared demo password.
 */
export async function signIn(
  email: string,
  password: string,
): Promise<SignInResult> {
  // Simulate network latency so the UI exercises its loading state.
  await new Promise((resolve) => setTimeout(resolve, 600));

  const user = demoUsers.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
  );

  if (!user || password !== DEMO_PASSWORD) {
    return { ok: false, error: "Invalid email or password." };
  }

  return { ok: true, user };
}

/** Demo accounts offered in the "Quick demo login" picker. */
export function listDemoUsers(): DemoUser[] {
  return demoUsers;
}
