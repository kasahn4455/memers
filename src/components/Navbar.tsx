"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Coins } from "lucide-react";

const WalletMultiButton=dynamic(
  ()=>import("@solana/wallet-adapter-react-ui").then(m=>m.WalletMultiButton),
  {ssr:false}
);

export default function Navbar(){
  return <>
    <div className="promo-bar">
      <span>⚠️ LAST CHANCE: 0.1 SOL CREATE COIN FEE (BACK TO 0.2 SOL IN 24H)</span>
    </div>
    <nav className="launch-nav">
      <div className="nav-inner">
        <Link href="/" className="brand">
          <span className="brand-mark"><Coins size={19}/></span>
          <span>Memers</span>
        </Link>

        <div className="nav-links">
          <Link href="/">Create Coin</Link>
          <Link href="/manage-liquidity">Manage Liquidity</Link>
          <Link href="/copy-trending" className="nav-badged">Copy Trending Coins <b>NEW</b></Link>
          <Link href="/tracker" className="nav-badged">Tracker <b className="live">LIVE</b></Link>
        </div>

        <div className="nav-wallet"><WalletMultiButton/></div>
      </div>
    </nav>
  </>;
}
