import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <p className="text-3xl font-bold text-ink">404</p>
      <p className="text-sm text-ink-muted">This screen doesn&apos;t exist.</p>
      <Link
        href="/home"
        className="rounded-card bg-brand px-4 py-2 text-sm font-medium text-white"
      >
        Back to Home
      </Link>
    </section>
  );
}
