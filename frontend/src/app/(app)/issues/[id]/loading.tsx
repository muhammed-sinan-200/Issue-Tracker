export default function IssueDetailLoading() {
  return (
    <section>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-8">
        <header className="space-y-4 lg:col-span-8 lg:row-start-1">
          <div className="h-4 w-36 rounded bg-white/[0.06]" />
          <div className="h-8 w-3/4 max-w-lg rounded bg-white/[0.06]" />
          <div className="h-4 w-1/2 max-w-md rounded bg-white/[0.06]" />
          <p className="text-sm text-zinc-600">Loading issue...</p>
        </header>

        <section className="space-y-3 lg:col-span-8 lg:row-start-2">
          <div className="h-3 w-24 rounded bg-white/[0.06]" />
          <div className="h-16 max-w-2xl rounded bg-white/[0.04]" />
        </section>

        <div className="h-[380px] lg:col-span-4 lg:col-start-9 lg:row-span-3 lg:row-start-1 lg:border-l lg:border-white/[0.08] lg:pl-6 xl:pl-8">
          <p className="text-sm text-zinc-600">Loading discussions...</p>
        </div>

        <section className="border-t border-white/[0.08] pt-8 lg:col-span-8 lg:row-start-3">
          <div className="h-24 rounded bg-white/[0.04]" />
        </section>
      </div>
    </section>
  );
}
