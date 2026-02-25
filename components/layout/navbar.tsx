"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { cn } from "@/lib/utils";

const links = [
  ["/dissemination", "Dissemination Performance"],
  ["/interests", "Interest & Strategy"],
  ["/geography", "Geographic Insights"],
  ["/learners", "Unified Learner Profiles"]
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
        <div>
          <h1 className="text-lg font-semibold">NUMU National Monitoring & Analytics Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          {links.map(([href, label]) => (
            <Link key={href} href={href} className={cn("rounded-md px-3 py-1.5 text-sm", pathname === href ? "bg-primary text-primary-foreground" : "hover:bg-accent")}>{label}</Link>
          ))}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
