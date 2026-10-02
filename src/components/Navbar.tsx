"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Coins } from "lucide-react";
const WalletMultiButton=dynamic(()=>import("@solana/wallet-adapter-react-ui").then(m=>m.WalletMultiButton),{ssr:false});
export default function Navbar(){
  return <>
    <div className="promo-bar"><span>⚡ Create your Solana token in minutes — no code required</span></div>
    <nav className="launch-nav"><div className="nav-inner">
      <Link href="/" className="brand"><span className="brand-mark"><Coins size={20}/></span><span>Memers</span></Link>
      <div className="nav-links"><Link href="/">Create Coin</Link><Link href="#how-it-works">How It Works</Link><Link href="#faq">FAQ</Link><a href="https://raydium.io/liquidity/create-pool/" target="_blank" rel="noreferrer">Manage Liquidity</a></div>
      <div className="nav-wallet"><WalletMultiButton/></div>
    </div></nav>
  </>;
}
