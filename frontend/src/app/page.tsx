import Link from "next/link";

const features = [
  {
    title: "Track Issues",
    description:
      "Create, filter, and manage issues by category, priority, and status in one dashboard.",
  },
  {
    title: "Team Discussions",
    description:
      "Collaborate on each issue with threaded comments from your team.",
  },
  {
    title: "AI Analysis",
    description:
      "Generate structured summaries, severity ratings, and suggested fixes with one click.",
  },
] as const;



export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#090909] text-white">
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[72px_72px]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.04),transparent_50%)]" aria-hidden />

      <div className="relative mx-auto max-w-[1100px] px-4 sm:px-6">
        
        <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 py-5 sm:py-6">
          <Link
            href="/"
            className="text-sm font-medium tracking-tight text-white transition-colors hover:text-zinc-200"
          >
            Issue Tracker
          </Link>
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-5">
            <Link
              href="/dashboard"
              className="inline-block py-0.5 text-sm text-zinc-500 transition-colors hover:text-white"
            >
              Dashboard
            </Link>
            <Link
              href="/issues/new"
              className="inline-flex items-center rounded-md border border-white/[0.08] px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:border-white/[0.15] hover:text-white"
            >
              Raise Issue
            </Link>
          </nav>
        </header>

        <main>
          
          <section className="pb-16 pt-12 text-center sm:pb-20 sm:pt-16 md:pt-24">
            <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
              Minimal issue management
            </p>
            <h1 className="mx-auto mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
              Issue Management Platform
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-zinc-400 sm:text-base">
              Track school and facility issues, collaborate through discussions,
              and get AI-powered analysis — all in one focused workspace.
            </p>
            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:mt-10 sm:flex-row sm:items-center">
              <Link
                href="/dashboard"
                className="inline-flex w-full items-center justify-center rounded-md bg-white px-6 py-2.5 text-sm font-medium text-black transition-colors hover:bg-zinc-200 sm:w-auto"
              >
                Open Dashboard
              </Link>
              <Link
                href="/issues/new"
                className="inline-flex w-full items-center justify-center rounded-md border border-white/[0.08] px-6 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:border-white/[0.15] hover:text-white sm:w-auto"
              >
                Raise Issue
              </Link>
            </div>
          </section>


          <section className="border-white/[0.06] py-14 sm:py-20">
            <h2 className="text-center text-xs font-medium uppercase tracking-widest text-zinc-500">
              Features
            </h2>
            <div className="mt-8 grid gap-4 sm:mt-10 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <article
                  key={feature.title}
                  className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-6"
                >
                  <h3 className="text-sm font-medium text-white">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                    {feature.description}
                  </p>
                </article>
              ))}
            </div>
          </section>
          
        </main>

        <footer className="border-t border-white/[0.06] py-10">
          <p className="text-center text-xs text-zinc-600">
            All Rights Reserved
          </p>
          <p className="mt-2 text-center text-xs text-zinc-700">
            Issue Management Platform 
          </p>
        </footer>
      </div>
    </div>
  );
}
