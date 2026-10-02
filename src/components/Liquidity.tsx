"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { RefreshCw, ExternalLink } from "lucide-react";
type Token = { mint: string; balance: string };
export default function Liquidity({ meteora = false }: { meteora?: boolean }) {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    setError("");
    setTokens([]);
    setSelected("");
    if (!publicKey) return;
    setLoading(true);
    try {
      const responses = await Promise.all(
        [TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID].map((programId) =>
          connection.getParsedTokenAccountsByOwner(publicKey, { programId }),
        ),
      );
      setTokens(
        responses
          .flatMap((r) => r.value.map((a) => a.account.data.parsed.info))
          .filter((t) => BigInt(t.tokenAmount.amount) > 0n)
          .map((t) => ({
            mint: t.mint,
            balance: t.tokenAmount.uiAmountString,
          })),
      );
    } catch {
      setError(
        "Could not load wallet tokens. Check your RPC connection and refresh.",
      );
    } finally {
      setLoading(false);
    }
  }, [connection, publicKey]);
  useEffect(() => {
    void load();
  }, [load]);
  return (
    <section className="liquidity-page">
      <h1>Create {meteora ? "Meteora" : "Raydium"} Liquidity Pool</h1>
      <div className="dex-tabs" role="tablist" aria-label="Select DEX">
        <div>
          <Link
            role="tab"
            aria-selected={!meteora}
            className={!meteora ? "active" : ""}
            href="/liquidity"
          >
            Raydium
          </Link>
          <Link
            role="tab"
            aria-selected={meteora}
            className={"meteora " + (meteora ? "active" : "")}
            href="/liquidity-meteora"
          >
            Meteora
          </Link>
        </div>
      </div>
      <div className="pool-card">
        <label htmlFor="token-select-pool">
          For which token would you like to create {meteora ? "a Meteora" : "a"}{" "}
          pool?
        </label>
        <select
          id="token-select-pool"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          disabled={loading}
        >
          <option value="">
            {loading ? "Loading tokens..." : "Choose your token"}
          </option>
          {tokens.map((t) => (
            <option key={t.mint} value={t.mint}>
              {t.mint.slice(0, 8)}…{t.mint.slice(-6)} ({t.balance})
            </option>
          ))}
        </select>
        {error && (
          <p className="pools-error" role="alert">
            {error}
          </p>
        )}
        {selected && (
          <div className="pool-details">
            <p>Token: {selected}</p>
            <p>
              Pool transactions are completed in the selected DEX. Review
              deposits and fees there before signing.
            </p>
            <a
              className="primary-action"
              target="_blank"
              rel="noopener noreferrer"
              href={
                meteora
                  ? "https://app.meteora.ag/"
                  : "https://raydium.io/liquidity/create-pool/"
              }
            >
              Continue to {meteora ? "Meteora" : "Raydium"}
              <ExternalLink size={16} />
            </a>
          </div>
        )}
      </div>
      <div className="pools-section">
        <div className="pools-heading">
          <h2>Your {meteora ? "Meteora " : ""}Pools</h2>
          <button
            className="refresh-button"
            onClick={load}
            disabled={loading}
            aria-label="Refresh Pools"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
        <div className="pools-empty">
          {!publicKey
            ? meteora
              ? "No Meteora pools found for this wallet."
              : "No pools found with LP tokens."
            : "View and manage your liquidity positions in the DEX portfolio."}
          {publicKey && (
            <p>
              <a
                className="primary-action"
                href={
                  meteora
                    ? "https://app.meteora.ag/"
                    : "https://raydium.io/portfolio/"
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                Open portfolio <ExternalLink size={16} />
              </a>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
