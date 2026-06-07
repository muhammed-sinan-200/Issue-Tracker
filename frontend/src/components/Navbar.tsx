"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserSwitcher } from "@/components/UserSwitcher";

type NavLink = {
  href: string;
  label: string;
  isActive: (pathname: string) => boolean;
};

const navLinks: NavLink[] = [
  {
    href: "/",
    label: "Home",
    isActive: (pathname) => pathname === "/",
  },
  {
    href: "/dashboard",
    label: "Dashboard",
    isActive: (pathname) =>
      pathname === "/dashboard" ||
      (pathname.startsWith("/issues/") && pathname !== "/issues/new"),
  },
  {
    href: "/issues/new",
    label: "Raise Issue",
    isActive: (pathname) => pathname === "/issues/new",
  },
];

function getVisibleNavLinks(pathname: string): NavLink[] {
  if (pathname === "/dashboard") {
    return navLinks.filter((link) => link.href !== "/issues/new");
  }

  return navLinks;
}

function navLinkClassName(isActive: boolean) {
  return [
    "inline-flex shrink-0 items-center rounded-md px-2.5 py-1.5 text-sm transition-colors sm:px-0 sm:py-0.5",
    isActive
      ? "bg-white/[0.08] font-medium text-white sm:bg-transparent"
      : "text-zinc-500 hover:bg-white/[0.04] hover:text-white sm:hover:bg-transparent",
  ].join(" ");
}

export function Navbar() {
  const pathname = usePathname();
  const visibleLinks = getVisibleNavLinks(pathname);

  return (
    <nav className="border-b border-white/[0.06] bg-[#090909]">
      <div className="mx-auto flex max-w-[1100px] flex-col gap-2 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:gap-6 lg:py-4">
        <div className="flex min-w-0 items-center justify-between gap-3 lg:shrink-0 lg:justify-start">
          <Link
            href="/"
            className="text-sm font-medium tracking-tight text-white transition-colors hover:text-zinc-200"
          >
            Issue Tracker
          </Link>

          <div className="lg:hidden">
            <UserSwitcher />
          </div>
        </div>

        <ul className="flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto border-t border-white/[0.06] pt-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-4 lg:border-t-0 lg:pt-0 [&::-webkit-scrollbar]:hidden">
          {visibleLinks.map(({ href, label, isActive }) => {
            const active = isActive(pathname);

            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={navLinkClassName(active)}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden shrink-0 lg:block">
          <UserSwitcher />
        </div>
      </div>
    </nav>
  );
}
