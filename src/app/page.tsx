"use client";

import { useMemo, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import toast from "react-hot-toast";
import { ArrowLeft, ArrowRight, Check, Copy, ExternalLink, Globe2, LockKeyhole, MessageCircle, Rocket, ShieldCheck, Sparkles, Twitter, UploadCloud } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import { createToken, TokenConfig } from "@/lib/token";

type Result = { mint: string; signature: string } | null;
const steps = [{n:1,label:"Token Details"},{n:2,label:"Supply & Description"},{n:3,label:"Socials & Authorities"}];

export default function Home() {
  const { connection } = useConnection();
  const { publicKey, signTransaction, connected } = useWallet();
  const [step,setStep]=useState(1);
  const [loading,setLoading]=useState(false);
  const [result,setResult]=useState<Result>(null);
  const [copied,setCopied]=useState(false);
  const [modifyCreator,setModifyCreator]=useState(false);
  const [creatorName,setCreatorName]=useState("");
  const [creatorWebsite,setCreatorWebsite]=useState("");
  const [form,setForm]=useState<TokenConfig>({
    name:"",symbol:"",decimals:9,supply:1000000000,description:"",image:"",banner:"",
    website:"",twitter:"",telegram:"",discord:"",enableTax:false,taxBasisPoints:0,
    maxTaxAmount:0,taxWithdrawAuthority:"",revokeMintAuthority:false,
    revokeFreezeAuthority:false,revokeUpdateAuthority:false
  });
  const update=<K extends keyof TokenConfig>(key:K,value:TokenConfig[K])=>setForm(p=>({...p,[key]:value}));
  const canNext=useMemo(()=>{
    if(step===1)return Boolean(form.name.trim()&&form.symbol.trim()&&form.image);
    if(step===2)return form.supply>0&&form.decimals>=0&&form.decimals<=9;
    return true;
  },[step,form]);

  const launch=async()=>{
    if(!publicKey||!signTransaction||!connected){toast.error("Connect your wallet first");return;}
    if(!form.name.trim()||!form.symbol.trim()||!form.image){toast.error("Complete the required token details");setStep(1);return;}
    setLoading(true);
    try{
      const finalForm:TokenConfig={...form,description:modifyCreator&&creatorName
        ? form.description+(form.description?"\n\n":"")+"Creator: "+creatorName+(creatorWebsite?" · "+creatorWebsite:"")
        : form.description};
      const res=await createToken(connection,publicKey,finalForm,signTransaction,window.location.origin);
      setResult({mint:res.mint,signature:res.signature});
      toast.success("Token created successfully");
    }catch(error){console.error(error);toast.error(error instanceof Error?error.message:"Token creation failed");}
    finally{setLoading(false);}
  };

  if(result){
    return <section className="launch-shell"><div className="success-card">
      <div className="success-icon"><Check/></div><div className="eyebrow">TOKEN CREATED</div>
      <h1>Your coin is live.</h1><p>Your Solana token has been created successfully. Save the mint address below.</p>
      <div className="result-box"><span>Mint Address</span><code>{result.mint}</code>
        <button onClick={()=>{navigator.clipboard.writeText(result.mint);setCopied(true);setTimeout(()=>setCopied(false),1500);}}>
          {copied?<Check size={16}/>:<Copy size={16}/>} {copied?"Copied":"Copy"}
        </button>
      </div>
      <div className="success-actions">
        <a href={"https://solscan.io/token/"+result.mint} target="_blank" rel="noreferrer">View on Solscan <ExternalLink size={16}/></a>
        <button onClick={()=>{setResult(null);setStep(1);}}>Create another token</button>
      </div>
    </div></section>;
  }

  return <>
    <section className="launch-shell">
      <div className="launch-hero">
        <div className="eyebrow"><Sparkles size={14}/> SOLANA TOKEN CREATOR</div>
        <h1>Launch Your Own Coin <span>FAST ⚡</span></h1>
        <p>Launch your own token on Solana in seconds. No coding required.</p>
      </div>

      <div className="stepper">
        {steps.map((item,index)=><div className={"step-wrap "+(step>=item.n?"active":"")} key={item.n}>
          <button className="step-dot" onClick={()=>item.n<=step&&setStep(item.n)}>{step>item.n?<Check size={16}/>:item.n}</button>
          <span>{item.label}</span>{index<steps.length-1&&<div className="step-line"/>}
        </div>)}
      </div>

      <div className="creator-card">
        {step===1&&<div className="panel-animate">
          <div className="card-heading"><div><span>STEP 1 OF 3</span><h2>Create your token</h2></div><div className="mini-badge"><Rocket size={15}/> Mainnet</div></div>
          <div className="form-grid two">
            <label><span>Token Name <b>*</b></span><input value={form.name} onChange={e=>update("name",e.target.value)} placeholder="Meme Coin" maxLength={32}/></label>
            <label><span>Token Symbol <b>*</b></span><input value={form.symbol} onChange={e=>update("symbol",e.target.value.toUpperCase())} placeholder="MEME" maxLength={8}/></label>
          </div>
          <div className="upload-shell"><div className="upload-title"><UploadCloud size={18}/> Token Image <b>*</b></div>
            <ImageUpload label="" value={form.image} onChange={url=>update("image",url)} aspect="banner"/><small>PNG or JPG. Max 5MB.</small>
          </div>
        </div>}

        {step===2&&<div className="panel-animate">
          <div className="card-heading"><div><span>STEP 2 OF 3</span><h2>Supply & description</h2></div><div className="mini-badge">SPL Token</div></div>
          <div className="form-grid two">
            <label><span>Token Decimals</span><input type="number" min={0} max={9} value={form.decimals} onChange={e=>update("decimals",Math.max(0,Math.min(9,Number(e.target.value))))}/><small>9 is commonly used for meme coins.</small></label>
            <label><span>Total Supply</span><input type="number" min={1} value={form.supply} onChange={e=>update("supply",Number(e.target.value))}/><small>Common supply: 1,000,000,000.</small></label>
          </div>
          <label className="full-label"><span>Token Description</span><textarea value={form.description} onChange={e=>update("description",e.target.value)} placeholder="Tell people what your token is about..." rows={5}/></label>
        </div>}

        {step===3&&<div className="panel-animate">
          <div className="card-heading"><div><span>STEP 3 OF 3</span><h2>Links & token authorities</h2></div><div className="mini-badge"><ShieldCheck size={15}/> Final step</div></div>
          <div className="social-grid">
            <SocialInput icon={<Globe2 size={17}/>} label="Website" value={form.website||""} placeholder="https://yourcoin.com" onChange={v=>update("website",v)}/>
            <SocialInput icon={<Twitter size={17}/>} label="Twitter / X" value={form.twitter||""} placeholder="https://x.com/yourcoin" onChange={v=>update("twitter",v)}/>
            <SocialInput icon={<MessageCircle size={17}/>} label="Telegram" value={form.telegram||""} placeholder="https://t.me/yourcoin" onChange={v=>update("telegram",v)}/>
            <SocialInput icon={<MessageCircle size={17}/>} label="Discord" value={form.discord||""} placeholder="https://discord.gg/yourcoin" onChange={v=>update("discord",v)}/>
          </div>
          <button className={"authority-card creator-info "+(modifyCreator?"selected":"")} onClick={()=>setModifyCreator(!modifyCreator)}>
            <div className="authority-check">{modifyCreator&&<Check size={15}/>}</div><div><strong>Modify Creator Information</strong><p>Add creator identity to the public token metadata description.</p></div>
          </button>
          {modifyCreator&&<div className="creator-fields"><input value={creatorName} onChange={e=>setCreatorName(e.target.value)} placeholder="Creator name"/><input value={creatorWebsite} onChange={e=>setCreatorWebsite(e.target.value)} placeholder="Creator website"/></div>}
          <div className="authority-title"><LockKeyhole size={18}/><div><strong>Revoke Authorities</strong><span>Optional. Revoking authority is permanent.</span></div></div>
          <div className="authority-grid">
            <AuthorityCard title="Revoke Freeze" description="Prevents the freeze authority from freezing token accounts." checked={form.revokeFreezeAuthority} onClick={()=>update("revokeFreezeAuthority",!form.revokeFreezeAuthority)}/>
            <AuthorityCard title="Revoke Mint" description="Locks the supply by preventing any additional token minting." checked={form.revokeMintAuthority} onClick={()=>update("revokeMintAuthority",!form.revokeMintAuthority)}/>
            <AuthorityCard title="Revoke Update" description="Makes the token metadata immutable after creation." checked={Boolean(form.revokeUpdateAuthority)} onClick={()=>update("revokeUpdateAuthority",!form.revokeUpdateAuthority)}/>
          </div>
          <div className="launch-summary"><div><span>Ready to create</span><strong>{form.name||"Your token"} <em>{"$"+(form.symbol||"TOKEN")}</em></strong></div><span className="network-pill">Solana Mainnet</span></div>
        </div>}

        <div className="wizard-actions">
          <button className="secondary-action" disabled={step===1||loading} onClick={()=>setStep(s=>Math.max(1,s-1))}><ArrowLeft size={17}/> Previous</button>
          {step<3
            ? <button className="primary-action" disabled={!canNext} onClick={()=>setStep(s=>Math.min(3,s+1))}>Next <ArrowRight size={17}/></button>
            : <button className="primary-action launch-button" disabled={loading} onClick={launch}>{loading?"Creating Token...":connected?"Create Token":"Connect Wallet to Create"} {!loading&&<Rocket size={17}/>}</button>}
        </div>
      </div>
    </section>

    <section className="how-section" id="how-it-works">
      <div className="section-head"><span>NO CODE. NO COMPLEXITY.</span><h2>How to use Solana Token Creator</h2><p>Three short steps from an idea to an on-chain token.</p></div>
      <div className="how-grid">{[["01","Connect your wallet","Connect a supported Solana wallet and make sure it has enough SOL for network costs."],["02","Configure your token","Choose the name, symbol, image, supply, decimals and optional social links."],["03","Create on-chain","Review your settings, approve the transaction in your wallet and wait for confirmation."]].map(([n,t,d])=><div className="how-card" key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></div>)}</div>
    </section>

    <section className="faq-section" id="faq">
      <div className="section-head"><span>FAQ</span><h2>Frequently Asked Questions</h2></div>
      <div className="faq-list">
        <details open><summary>What is Memers?</summary><p>Memers is a non-custodial interface for creating Solana tokens without writing code. Transactions are approved from your connected wallet.</p></details>
        <details><summary>Do you hold my wallet or private keys?</summary><p>No. Your wallet signs blockchain transactions directly. Never share your seed phrase with anyone.</p></details>
        <details><summary>Can I revoke token authorities?</summary><p>Yes. Freeze, mint and metadata update settings can be made permanent during creation. Review them carefully because revocation cannot be undone.</p></details>
        <details><summary>Does creating a token make it tradable?</summary><p>No. Token creation and liquidity/trading are separate actions. A token needs liquidity or another market mechanism before it can be traded.</p></details>
      </div>
    </section>
  </>;
}

function SocialInput({icon,label,value,placeholder,onChange}:{icon:React.ReactNode;label:string;value:string;placeholder:string;onChange:(v:string)=>void}){
  return <label className="social-input"><span>{icon}{label}</span><input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/></label>;
}
function AuthorityCard({title,description,checked,onClick}:{title:string;description:string;checked:boolean;onClick:()=>void}){
  return <button className={"authority-card "+(checked?"selected":"")} onClick={onClick}><div className="authority-check">{checked&&<Check size={15}/>}</div><div><strong>{title}</strong><p>{description}</p></div></button>;
}
