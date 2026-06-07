"use client";

import { ActiveUserProvider } from "@/contexts/ActiveUserContext";

export function AppProviders({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ActiveUserProvider>{children}</ActiveUserProvider>;
}
