import { AppProviders } from "@/components/AppProviders";
import { Navbar } from "@/components/Navbar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppProviders>
      <div className="min-h-screen bg-[#090909]">
        <Navbar />
        <main className="mx-auto max-w-[1100px] px-4 py-6 sm:px-6 sm:py-10">{children}</main>
      </div>
    </AppProviders>
  );
}
