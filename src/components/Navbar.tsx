"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { Rocket, LayoutDashboard, Sparkles } from "lucide-react";

const WalletMultiButton = dynamic(
  () => import("@solana/wallet-adapter-react-ui").then((m) => m.WalletMultiButton),
  { ssr: false }
);

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Launch", icon: Rocket },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-[#07070b]/70 backdrop-blur-xl border-b border-white/5" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-solana-purple to-solana-green rounded-xl blur-md opacity-60 group-hover:opacity-90 transition-opacity" />
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-solana-purple via-solana-pink to-solana-green flex items-center justify-center shadow-inner-light">
                <Rocket className="w-4.5 h-4.5 text-white" strokeWidth={2.4} />
              </div>
            </div>
            <div className="flex flex-col leading-none">
              <span className="display-font text-lg font-bold tracking-tight">
                Sol<span className="gradient-text-solana">Launcher</span>
              </span>
              <span className="text-[10px] text-white/40 tracking-widest uppercase mt-0.5">
                Token Studio
              </span>
            </div>
          </Link>

          {/* Desktop nav pills */}
          <div className="hidden md:flex items-center gap-1 p-1 rounded-full bg-white/[0.03] border border-white/5">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    active
                      ? "text-white"
                      : "text-white/55 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {active && (
                    <span className="absolute inset-0 rounded-full bg-gradient-to-r from-solana-purple/30 to-solana-green/30 border border-white/10" />
                  )}
                  <Icon className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">{label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <span className="hidden lg:inline-flex chip bg-solana-green/10 text-solana-green border border-solana-green/20">
              <Sparkles className="w-3 h-3" /> Mainnet
            </span>
            <WalletMultiButton />
          </div>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden flex items-center gap-1 pb-3">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "bg-white/5 text-white border border-white/10"
                    : "text-white/50 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
