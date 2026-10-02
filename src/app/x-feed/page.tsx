"use client";
import dynamic from "next/dynamic";
import { useWallet } from "@solana/wallet-adapter-react";
import { Wallet } from "lucide-react";
const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then((m) => m.WalletMultiButton),
  { ssr: false },
);
export default function Tracker() {
  const { connected } = useWallet();
  return (
    <section className="tracker-page">
      <h1>
        <span className="x-icon">𝕏</span> Tracker - Real Time
      </h1>
      <div className="wallet-gate">
        <div className="gate-icon">
          <Wallet size={28} />
        </div>
        <h2>
          {connected ? "Tracker feed unavailable" : "Connect your wallet"}
        </h2>
        <p>
          {connected
            ? "The real-time tweet provider has not been configured for this deployment."
            : "Connect your Solana wallet to access the real-time tweet tracker and create tokens directly from tweets."}
        </p>
        <WalletMultiButton />
      </div>
    </section>
  );
}
