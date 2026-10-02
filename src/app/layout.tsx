import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import WalletProvider from "@/contexts/WalletProvider";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Memers — Create Solana Tokens Fast",
    template: "%s | Memers",
  },
  description:
    "Create a Solana token from a simple no-code interface. Configure metadata, supply and token authorities from your own wallet.",
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="app-background" aria-hidden="true" />
        <WalletProvider>
          <Navbar />
          <main className="site-main">{children}</main>
          <footer className="site-footer">
            <div className="footer-inner">
              <div>
                <strong>Memers</strong>
                <p>Non-custodial tools for creating Solana tokens.</p>
              </div>
              <div className="footer-links">
                <a href="/#how-it-works">How It Works</a>
                <a href="/#faq">FAQ</a>
                <a href="/terms-of-use">Terms</a>
                <a href="/privacy-policy">Privacy</a>
              </div>
            </div>
            <p className="footer-disclaimer">
              Memers is a software interface. Blockchain transactions are irreversible and require approval from your wallet.
            </p>
          </footer>
          <Toaster position="bottom-right" toastOptions={{
            style:{background:"#15151d",color:"#fff",border:"1px solid rgba(255,255,255,.08)",borderRadius:"10px",fontSize:"13px"}
          }}/>
        </WalletProvider>
      </body>
    </html>
  );
}
