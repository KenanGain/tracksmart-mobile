"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { signIn, listDemoUsers } from "@/lib/api/auth";
import { DEMO_PASSWORD } from "@/lib/data/users";

const demoUsers = listDemoUsers();

/**
 * SignInForm — the interactive sign-in card.
 *
 * Frontend only: all auth logic lives behind `lib/api/auth.ts`. This
 * component just collects input and renders the result.
 */
export function SignInForm() {
  const router = useRouter();

  const [demoId, setDemoId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleDemoSelect(id: string) {
    setDemoId(id);
    setError(null);
    const user = demoUsers.find((u) => u.id === id);
    if (user) {
      setEmail(user.email);
      setPassword(DEMO_PASSWORD);
    }
  }

  /**
   * Manual edits to email/password break the link to the picked demo user,
   * so reset the dropdown — the form must never show a demo user whose
   * credentials no longer match the fields.
   */
  function handleEmailChange(value: string) {
    setEmail(value);
    setDemoId("");
    setError(null);
  }

  function handlePasswordChange(value: string) {
    setPassword(value);
    setDemoId("");
    setError(null);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn(email, password);
    if (result.ok) {
      router.push("/home");
    } else {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-2xl border border-ink/10 bg-surface shadow-card"
    >
      {/* Header */}
      <div className="border-b border-ink/5 px-5 py-4">
        <h2 className="text-base font-semibold text-ink">
          Sign in to your account
        </h2>
        <p className="mt-0.5 text-sm text-ink-muted">
          Pick a demo user or enter credentials manually.
        </p>
      </div>

      {/* Body */}
      <div className="space-y-4 px-5 py-5">
        {/* Quick demo login */}
        <div className="space-y-1.5">
          <label
            htmlFor="demo-user"
            className="text-xs font-semibold uppercase tracking-wider text-brand"
          >
            Quick demo login
          </label>
          <div className="relative">
            <select
              id="demo-user"
              value={demoId}
              onChange={(e) => handleDemoSelect(e.target.value)}
              disabled={loading}
              className="h-11 w-full appearance-none rounded-lg border border-ink/10 bg-surface px-3 pr-9 text-sm text-ink disabled:opacity-60"
            >
              <option value="">Select a user…</option>
              {demoUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} · {u.jobTitle}
                </option>
              ))}
            </select>
            <Icon
              name="chevron-down"
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
            />
          </div>
        </div>

        {/* OR divider */}
        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-ink/10" />
          <span className="text-xs font-medium text-ink-muted">OR</span>
          <span className="h-px flex-1 bg-ink/10" />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-ink">
            Email
          </label>
          <div className="relative">
            <Icon
              name="mail"
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
            />
            <input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder="you@example.com"
              disabled={loading}
              className="h-11 w-full rounded-lg border border-ink/10 bg-surface pl-9 pr-3 text-sm text-ink placeholder:text-ink-muted/70 disabled:opacity-60"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium text-ink">
            Password
          </label>
          <div className="relative">
            <Icon
              name="lock"
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
            />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              className="h-11 w-full rounded-lg border border-ink/10 bg-surface pl-9 pr-10 text-sm text-ink placeholder:text-ink-muted/70 disabled:opacity-60"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-ink-muted"
            >
              <Icon name={showPassword ? "eye-off" : "eye"} className="h-4 w-4" />
            </button>
          </div>
          <p className="text-xs text-ink-muted">
            Demo password:{" "}
            <code className="rounded bg-surface-muted px-1.5 py-0.5 font-mono text-[11px] text-ink">
              {DEMO_PASSWORD}
            </code>
          </p>
        </div>

        {/* Error */}
        {error && (
          <p className="rounded-lg bg-danger/10 px-3 py-2 text-xs font-medium text-danger">
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand text-sm font-semibold text-white transition-opacity disabled:opacity-60"
        >
          <Icon name="log-in" className="h-4 w-4" />
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </div>
    </form>
  );
}
