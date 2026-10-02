import { NextRequest, NextResponse } from "next/server";
type Profile = {
  chainId: string;
  tokenAddress: string;
  icon?: string;
  description?: string;
};
type Pair = {
  dexId: string;
  baseToken: { address: string; name: string; symbol: string };
  marketCap?: number;
  fdv?: number;
  liquidity?: { usd?: number };
  txns?: { h1?: { buys?: number } };
  info?: { imageUrl?: string };
  url: string;
  pairCreatedAt?: number;
};
export async function GET(req: NextRequest) {
  try {
    const isNew = req.nextUrl.searchParams.get("tab") === "new";
    const platform = req.nextUrl.searchParams.get("platform");
    const response = await fetch(
      "https://api.dexscreener.com/token-profiles/latest/v1",
      { next: { revalidate: 60 }, signal: AbortSignal.timeout(10000) },
    );
    if (!response.ok) throw new Error("Token data unavailable");
    const profiles: Profile[] = await response.json();
    const solana = profiles
      .filter(
        (p) =>
          p.chainId === "solana" &&
          /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(p.tokenAddress),
      )
      .slice(0, 30);
    if (!solana.length)
      return NextResponse.json({ tokens: [], source: "DEX Screener" });
    const pairsResponse = await fetch(
      "https://api.dexscreener.com/tokens/v1/solana/" +
        solana.map((p) => p.tokenAddress).join(","),
      { next: { revalidate: 60 }, signal: AbortSignal.timeout(10000) },
    );
    if (!pairsResponse.ok) throw new Error("Market data unavailable");
    const pairs: Pair[] = await pairsResponse.json();
    const best = new Map<string, Pair>();
    for (const p of pairs) {
      if (platform === "raydium" && p.dexId !== "raydium") continue;
      if (platform === "pumpfun" && !p.dexId.startsWith("pump")) continue;
      const old = best.get(p.baseToken.address);
      if (!old || (p.liquidity?.usd || 0) > (old.liquidity?.usd || 0))
        best.set(p.baseToken.address, p);
    }
    const tokens = Array.from(best.values())
      .sort((a, b) =>
        isNew
          ? (b.pairCreatedAt || 0) - (a.pairCreatedAt || 0)
          : (b.txns?.h1?.buys || 0) - (a.txns?.h1?.buys || 0),
      )
      .map((p) => ({
        mint: p.baseToken.address,
        name: p.baseToken.name,
        symbol: p.baseToken.symbol,
        image:
          p.info?.imageUrl ||
          solana.find((t) => t.tokenAddress === p.baseToken.address)?.icon ||
          "",
        description:
          solana.find((t) => t.tokenAddress === p.baseToken.address)
            ?.description || p.baseToken.name,
        marketCap: p.marketCap || p.fdv || 0,
        buys: p.txns?.h1?.buys || 0,
        url: p.url,
      }));
    return NextResponse.json({
      tokens,
      source: "DEX Screener",
      updatedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: "Live token data is unavailable. Please refresh shortly." },
      { status: 502 },
    );
  }
}
