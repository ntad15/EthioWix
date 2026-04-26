import Link from "next/link";
import { CATEGORIES } from "@/lib/templates";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Top nav */}
      <nav className="border-b border-gray-100 bg-white/80 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span className="text-xl font-bold">
            Fetan<span className="text-blue-600">Sites</span>
          </span>
          <div className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Create your site
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            A website for your business,{" "}
            <span className="text-blue-600">in minutes.</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600 sm:text-xl">
            Pick a template, drop in your logo and photos, hit publish. Built for
            restaurants, hotels, spas, salons, and photographers — no code required.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/sign-up"
              className="rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700"
            >
              Create your site — it&apos;s free to start
            </Link>
            <Link
              href="/sign-in"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 sm:px-3"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-t border-gray-100 bg-gray-50 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Designed for hospitality
            </h2>
            <p className="mt-3 text-gray-600">
              Templates tuned for the businesses people actually run.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-5 text-center"
              >
                <span className="text-3xl">{cat.emoji}</span>
                <span className="mt-3 text-sm font-semibold text-gray-900">
                  {cat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-6 py-20 text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">
          Ready to get yours online?
        </h2>
        <p className="mt-3 text-gray-600">
          Sign up, pick a template, publish. That&apos;s it.
        </p>
        <Link
          href="/sign-up"
          className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700"
        >
          Create your site
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} FetanSites
      </footer>
    </div>
  );
}
