import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import WalletProvider from "@/contexts/WalletProvider";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://github.com/mrtomdev/solana-token-launcher"),
  title: {
    default: "Solana Token Launcher — Create SPL & Token-2022 Tokens (Free, No Code)",
    template: "%s · Solana Token Launcher",
  },
  description:
    "Free, open-source, non-custodial Solana token launcher. Create SPL & Token-2022 tokens in 60 seconds — with on-chain Metaplex metadata, IPFS-hosted images, transfer fees, one-click authority revocation, and a full management dashboard. No CLI, no Rust, no custody.",
  keywords: [
    "solana",
    "solana token",
    "solana token creator",
    "spl token",
    "token-2022",
    "create solana token",
    "solana memecoin launcher",
    "solana token generator",
    "metaplex metadata",
    "phantom wallet",
    "solflare",
    "solana dapp",
    "no-code crypto",
    "web3 token launcher",
    "solana defi",
    "free token creator",
    "non-custodial",
    "ipfs",
    "next.js solana",
    "open source",
  ],
  authors: [{ name: "mrtomdev", url: "https://github.com/mrtomdev" }],
  creator: "mrtomdev",
  openGraph: {
    type: "website",
    title: "Solana Token Launcher — Create SPL & Token-2022 Tokens in 60 seconds",
    description:
      "Free, open-source, non-custodial Solana token launcher. Mint SPL & Token-2022 tokens with metadata, transfer fees, authority revocation, and a full dashboard.",
    siteName: "Solana Token Launcher",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Solana Token Launcher — Free, Open Source, Non-Custodial",
    description:
      "Launch your own Solana SPL or Token-2022 token in 60 seconds. No code. No CLI. No custody.",
  },
  robots: { index: true, follow: true },
  category: "blockchain",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen text-white antialiased">
        {/* Ambient animated background (fixed behind the app) */}
        <div className="app-background" aria-hidden="true">
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="blob blob-3" />
        </div>

        <WalletProvider>
          <Navbar />
          <main className="relative pt-24 pb-16">{children}</main>

          <footer className="relative border-t border-white/5 py-8 mt-16">
            <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
              <p className="flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-solana-green animate-pulse" />
                Connected to Solana Mainnet
              </p>
              <p>
                Built with <span className="gradient-text-solana font-semibold">Solana</span> · Token-2022 ready
              </p>
            </div>
          </footer>

          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "rgba(17, 17, 29, 0.9)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(12px)",
                borderRadius: "12px",
                fontSize: "14px",
                padding: "10px 14px",
              },
              success: {
                iconTheme: { primary: "#14F195", secondary: "#07070B" },
              },
              error: {
                iconTheme: { primary: "#FF4D6D", secondary: "#07070B" },
              },
            }}
          />
        </WalletProvider>
      </body>
    </html>
  );
}
