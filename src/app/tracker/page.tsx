"use client";
import { useState } from "react";
import { ExternalLink, Search } from "lucide-react";
export default function Tracker(){
 const [mint,setMint]=useState("");
 const open=()=>{if(mint.trim()) window.open("https://solscan.io/token/"+mint.trim(),"_blank","noopener,noreferrer")};
 return <section className="tool-page"><div className="tool-hero"><span>LIVE</span><h1>Token Tracker</h1><p>Open a Solana token in Solscan to inspect public on-chain information.</p></div>
 <div className="tool-card"><div className="tool-icon"><Search/></div><h2>Track a token</h2>
 <label className="tool-label">Mint Address<input value={mint} onChange={e=>setMint(e.target.value)} placeholder="Paste Solana mint address"/></label>
 <button className="tool-primary" onClick={open} disabled={!mint.trim()}>View on Solscan <ExternalLink size={16}/></button></div></section>;
}