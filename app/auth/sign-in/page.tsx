import type { Metadata } from "next";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";
import { Icon } from "@/components/ui/Icon";
import { SignInForm } from "@/components/auth/SignInForm";

export const metadata: Metadata = { title: "Sign in" };

export default function SignInPage() {
  return (
    <div className="flex flex-1 flex-col justify-center py-10">
      {/* Brand */}
      <header className="flex flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink">
          <Icon name="truck" className="h-7 w-7 text-white" />
        </div>
        <h1 className="mt-3 text-xl font-bold text-ink">{APP_NAME}</h1>
        <p className="text-sm text-ink-muted">{APP_TAGLINE}</p>
      </header>

      {/* Sign-in card */}
      <div className="mt-6">
        <SignInForm />
      </div>

      <p className="mt-6 text-center text-xs text-ink-muted">
        Prototype build · No real authentication is performed.
      </p>
    </div>
  );
}
