"use client";
import { ExternalLink, Droplets, ShieldCheck } from "lucide-react";
export default function ManageLiquidity(){
 return <section className="tool-page"><div className="tool-hero"><span>LIQUIDITY</span><h1>Manage Liquidity</h1><p>Create or manage a liquidity pool using Raydium while keeping control in your own wallet.</p></div>
 <div className="tool-card"><div className="tool-icon"><Droplets/></div><h2>Raydium Liquidity</h2><p>Token creation does not automatically make a token tradable. Liquidity is a separate on-chain action.</p>
 <div className="tool-note"><ShieldCheck size={17}/><span>Non-custodial handoff. Review the transaction in Raydium and your wallet before signing.</span></div>
 <a className="tool-primary" href="https://raydium.io/liquidity/create-pool/" target="_blank" rel="noreferrer">Open Raydium <ExternalLink size={16}/></a></div></section>;
}