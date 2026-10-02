"use client";
import { useMemo, useState } from "react";
import { ExternalLink, Droplets, CircleDollarSign, ArrowRight, Info } from "lucide-react";

const providers = [
  {
    id:"raydium",
    name:"Raydium",
    subtitle:"Create a liquidity pool on Raydium",
    href:"https://raydium.io/liquidity/create-pool/",
    note:"Best for standard Solana liquidity pools and broad ecosystem support."
  },
  {
    id:"meteora",
    name:"Meteora",
    subtitle:"Create a liquidity pool on Meteora",
    href:"https://app.meteora.ag/",
    note:"Useful for Meteora pool types including DLMM and dynamic liquidity products."
  }
];

export default function CreatePool(){
  const [provider,setProvider]=useState("raydium");
  const [token,setToken]=useState("");
  const active=useMemo(()=>providers.find(p=>p.id===provider)!,[provider]);

  return <section className="pool-page">
    <div className="pool-hero">
      <span>LIQUIDITY</span>
      <h1>Create Pool</h1>
      <p>Create liquidity for your Solana token using Raydium or Meteora.</p>
    </div>

    <div className="pool-card">
      <div className="pool-title-row">
        <div>
          <span>STEP 1</span>
          <h2>Select a platform</h2>
        </div>
        <Droplets size={20}/>
      </div>

      <div className="provider-grid">
        {providers.map(p=><button key={p.id} onClick={()=>setProvider(p.id)} className={"provider-card "+(provider===p.id?"selected":"")}>
          <div className="provider-radio">{provider===p.id&&<span/>}</div>
          <div><strong>{p.name}</strong><p>{p.subtitle}</p></div>
        </button>)}
      </div>

      <div className="pool-divider"/>

      <div className="pool-title-row compact">
        <div>
          <span>STEP 2</span>
          <h2>Token</h2>
        </div>
        <CircleDollarSign size={20}/>
      </div>

      <label className="pool-label">
        <span>Token Mint Address</span>
        <input value={token} onChange={e=>setToken(e.target.value)} placeholder="Paste your token mint address"/>
      </label>

      <div className="pool-info">
        <Info size={16}/>
        <p>{active.note} Creating a pool is a separate on-chain action from creating a token.</p>
      </div>

      <a className="pool-cta" href={active.href} target="_blank" rel="noreferrer">
        Continue to {active.name} <ArrowRight size={16}/><ExternalLink size={14}/>
      </a>
    </div>
  </section>
}
