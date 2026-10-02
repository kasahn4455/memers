import { Copy, Search, ArrowRight } from "lucide-react";
import Link from "next/link";
export default function CopyTrending(){
 return <section className="tool-page"><div className="tool-hero"><span>NEW</span><h1>Copy Token Setup</h1><p>Use public token details as a starting point, then create your own token with branding and settings you have the right to use.</p></div>
 <div className="tool-card"><div className="tool-icon"><Copy/></div><h2>Start from public metadata</h2><p>Paste a mint address into a public explorer to review its supply, decimals and metadata, then use those values as a reference in the creator.</p>
 <div className="tool-note"><Search size={17}/><span>Do not copy trademarks, logos or branding you do not have permission to use.</span></div>
 <Link className="tool-primary" href="/">Open Token Creator <ArrowRight size={16}/></Link></div></section>;
}