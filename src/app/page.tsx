"use client";

import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import toast from "react-hot-toast";
import {
  Rocket,
  Globe,
  Twitter,
  MessageCircle,
  Hash,
  Shield,
  Coins,
  Percent,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Copy,
  Check,
  AlertTriangle,
  Sparkles,
  FileText,
  Image as ImageLucide,
  Gauge,
  Wallet,
} from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import { createToken, TokenConfig } from "@/lib/token";

const STEPS = [
  { label: "Basics", icon: FileText, hint: "Name, symbol & description" },
  { label: "Branding", icon: ImageLucide, hint: "Logo, banner & socials" },
  { label: "Tokenomics", icon: Gauge, hint: "Supply, decimals & authority" },
  { label: "Tax", icon: Percent, hint: "Token-2022 transfer fees" },
  { label: "Review", icon: Rocket, hint: "Confirm & launch" },
];

export default function Home() {
  const { connection } = useConnection();
  const { publicKey, signTransaction, connected } = useWallet();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ mint: string; signature: string } | null>(null);
  const [copied, setCopied] = useState("");

  const [form, setForm] = useState<TokenConfig>({
    name: "",
    symbol: "",
    decimals: 9,
    supply: 1000000000,
    description: "",
    image: "",
    banner: "",
    website: "",
    twitter: "",
    telegram: "",
    discord: "",
    enableTax: false,
    taxBasisPoints: 500,
    maxTaxAmount: 1000000,
    taxWithdrawAuthority: "",
    revokeMintAuthority: false,
    revokeFreezeAuthority: false,
  });

  const update = (key: keyof TokenConfig, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  };

  const handleLaunch = async () => {
    if (!publicKey || !signTransaction) {
      toast.error("Connect your wallet first");
      return;
    }
    if (!form.name || !form.symbol) {
      toast.error("Name and symbol are required");
      return;
    }
    if (!form.image) {
      toast.error("Token image is required");
      return;
    }

    setLoading(true);
    try {
      const baseUrl = window.location.origin;
      const res = await createToken(
        connection,
        publicKey,
        form,
        signTransaction,
        baseUrl
      );
      setResult({ mint: res.mint, signature: res.signature });
      toast.success("Token launched successfully!");
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Token creation failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Success screen ---------- */
  if (result) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 fade-up">
        <div className="relative glass-strong glow-border rounded-3xl p-10 text-center overflow-hidden">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-radial opacity-60 pointer-events-none" />

          <div className="relative">
            <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-solana-purple via-solana-pink to-solana-green flex items-center justify-center shadow-glow-purple pulse-ring">
              <Check className="w-12 h-12 text-white" strokeWidth={3} />
            </div>
            <span className="chip bg-solana-green/10 text-solana-green border border-solana-green/20 mb-4">
              <Sparkles className="w-3 h-3" /> Deployed on Mainnet
            </span>
            <h1 className="display-font text-4xl font-bold mb-3 text-white">
              Your token is <span className="gradient-text-solana">live</span>
            </h1>
            <p className="text-white/50 mb-10">
              {form.name} (${form.symbol}) has been successfully deployed to
              the Solana blockchain.
            </p>

            <div className="space-y-3 text-left">
              <ResultRow
                label="Mint Address"
                value={result.mint}
                copied={copied === "mint"}
                onCopy={() => copyText(result.mint, "mint")}
                accent="purple"
              />
              <ResultRow
                label="Transaction Signature"
                value={result.signature}
                copied={copied === "sig"}
                onCopy={() => copyText(result.signature, "sig")}
                accent="green"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-10">
              <a
                href={`https://solscan.io/token/${result.mint}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl"
              >
                View on Solscan <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={() => {
                  setResult(null);
                  setStep(0);
                  setForm((p) => ({ ...p, name: "", symbol: "", image: "" }));
                }}
                className="btn-ghost flex-1 py-3.5 rounded-2xl font-semibold"
              >
                Launch Another
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- Wizard ---------- */
  return (
    <div className="max-w-5xl mx-auto px-4">
      {/* Hero */}
      <div className="text-center mb-12 fade-up">
        <span className="chip bg-white/5 text-white/70 border border-white/10 mb-5">
          <Sparkles className="w-3 h-3 text-solana-green" /> Deploy in minutes ·
          Token-2022 ready
        </span>
        <h1 className="display-font text-5xl md:text-6xl font-bold leading-[1.05] tracking-tight mb-4">
          Launch your token on{" "}
          <span className="gradient-text-solana">Solana</span>
        </h1>
        <p className="text-white/55 text-lg max-w-2xl mx-auto">
          A beautiful, guided studio to craft metadata, tune tokenomics and ship
          your token directly to Mainnet — with tax, authorities and full
          control in one place.
        </p>
      </div>

      {/* Stepper */}
      <div className="mb-8">
        <div className="glass rounded-2xl p-2 flex items-center gap-1 overflow-x-auto">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const active = i === step;
            const done = i < step;
            return (
              <button
                key={s.label}
                onClick={() => setStep(i)}
                className={`relative flex-1 min-w-[120px] flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "text-white bg-gradient-to-r from-solana-purple/30 to-solana-green/25 border border-white/10"
                    : done
                    ? "text-solana-green hover:bg-white/5"
                    : "text-white/40 hover:text-white/70 hover:bg-white/5"
                }`}
              >
                <span
                  className={`w-6 h-6 flex items-center justify-center rounded-lg text-[11px] font-bold ${
                    active
                      ? "bg-white text-black"
                      : done
                      ? "bg-solana-green/20 text-solana-green"
                      : "bg-white/5 text-white/50"
                  }`}
                >
                  {done ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </span>
                <span className="flex items-center gap-1.5">
                  <Icon className="w-4 h-4 hidden sm:inline" />
                  <span className="hidden sm:inline">{s.label}</span>
                  <span className="sm:hidden">{s.label}</span>
                </span>
              </button>
            );
          })}
        </div>
        <div className="flex items-center justify-center mt-3">
          <p className="text-xs text-white/40">
            Step {step + 1} of {STEPS.length} · {STEPS[step].hint}
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="glass-strong glow-border rounded-3xl p-6 md:p-10 scale-in">
        {/* Step 0: Basics */}
        {step === 0 && (
          <div className="space-y-8 fade-up">
            <SectionHeader
              icon={FileText}
              title="Token basics"
              subtitle="Give your token an identity. You can always update metadata later."
              accent="purple"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Token name" required>
                <input
                  className="field"
                  type="text"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="e.g. Sunlight Protocol"
                />
              </Field>
              <Field label="Symbol / ticker" required hint="Short, all caps">
                <input
                  className="field font-mono uppercase tracking-wider"
                  type="text"
                  value={form.symbol}
                  onChange={(e) => update("symbol", e.target.value.toUpperCase())}
                  placeholder="e.g. SUN"
                  maxLength={10}
                />
              </Field>
            </div>
            <Field label="Description" hint="What does it do? Who is it for?">
              <textarea
                className="field resize-none"
                rows={5}
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Briefly describe your token, its utility and the community behind it…"
              />
            </Field>
          </div>
        )}

        {/* Step 1: Branding */}
        {step === 1 && (
          <div className="space-y-8 fade-up">
            <SectionHeader
              icon={ImageLucide}
              title="Branding & socials"
              subtitle="Upload visuals and link the places your community lives."
              accent="green"
            />

            <div className="flex flex-col md:flex-row gap-6 md:items-start">
              <ImageUpload
                label="Token logo *"
                value={form.image}
                onChange={(v) => update("image", v)}
                aspect="square"
              />
              <div className="flex-1 min-w-0">
                <ImageUpload
                  label="Banner (optional)"
                  value={form.banner || ""}
                  onChange={(v) => update("banner", v)}
                  aspect="banner"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <IconField
                icon={Globe}
                label="Website"
                placeholder="https://yourtoken.com"
                value={form.website || ""}
                onChange={(v) => update("website", v)}
              />
              <IconField
                icon={Twitter}
                label="Twitter / X"
                placeholder="https://x.com/yourtoken"
                value={form.twitter || ""}
                onChange={(v) => update("twitter", v)}
              />
              <IconField
                icon={MessageCircle}
                label="Telegram"
                placeholder="https://t.me/yourtoken"
                value={form.telegram || ""}
                onChange={(v) => update("telegram", v)}
              />
              <IconField
                icon={Hash}
                label="Discord"
                placeholder="https://discord.gg/yourtoken"
                value={form.discord || ""}
                onChange={(v) => update("discord", v)}
              />
            </div>
          </div>
        )}

        {/* Step 2: Tokenomics */}
        {step === 2 && (
          <div className="space-y-8 fade-up">
            <SectionHeader
              icon={Gauge}
              title="Tokenomics"
              subtitle="Set total supply, decimals and lock down authorities."
              accent="purple"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field
                label="Total supply"
                required
                hint={`${Number(form.supply).toLocaleString()} tokens`}
              >
                <input
                  className="field"
                  type="number"
                  value={form.supply}
                  onChange={(e) => update("supply", Number(e.target.value))}
                  min={1}
                />
              </Field>
              <Field
                label="Decimals"
                hint={`Precision · ${form.decimals} decimal${form.decimals === 1 ? "" : "s"}`}
              >
                <div className="field !py-5">
                  <input
                    type="range"
                    min={0}
                    max={18}
                    value={form.decimals}
                    onChange={(e) => update("decimals", Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-[11px] text-white/40 mt-2">
                    <span>0</span>
                    <span className="text-solana-green font-semibold">
                      {form.decimals}
                    </span>
                    <span>18</span>
                  </div>
                </div>
              </Field>
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg bg-yellow-400/10 text-yellow-400">
                  <Shield className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-semibold">Authority settings</h3>
                <span className="ml-auto text-[10px] text-white/35 uppercase tracking-wider">
                  Immutable once revoked
                </span>
              </div>
              <div className="space-y-2">
                <ToggleRow
                  label="Revoke mint authority"
                  description="No more tokens can ever be minted after launch."
                  checked={form.revokeMintAuthority}
                  onChange={(v) => update("revokeMintAuthority", v)}
                />
                <ToggleRow
                  label="Revoke freeze authority"
                  description="Token accounts can never be frozen by you."
                  checked={form.revokeFreezeAuthority}
                  onChange={(v) => update("revokeFreezeAuthority", v)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Tax */}
        {step === 3 && (
          <div className="space-y-8 fade-up">
            <SectionHeader
              icon={Percent}
              title="Transfer fee (Token-2022)"
              subtitle="Withhold a percentage on every transfer and harvest it later."
              accent="yellow"
            />

            <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-4 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-yellow-200 mb-1">
                  This uses the Token-2022 program
                </p>
                <p className="text-yellow-200/70 leading-relaxed">
                  Enabling tax switches your token to Token-2022 with the
                  TransferFee extension. Some legacy DEXs and wallets may not
                  yet fully support it.
                </p>
              </div>
            </div>

            <button
              onClick={() => update("enableTax", !form.enableTax)}
              className={`w-full rounded-2xl border p-5 flex items-center justify-between transition-all ${
                form.enableTax
                  ? "border-solana-green/40 bg-solana-green/10"
                  : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]"
              }`}
            >
              <div className="text-left">
                <p className="text-base font-semibold text-white">
                  Enable transfer tax
                </p>
                <p className="text-xs text-white/50 mt-0.5">
                  A percentage will be withheld on every transfer
                </p>
              </div>
              <span
                className={`toggle ${form.enableTax ? "toggle-on" : ""}`}
                aria-hidden="true"
              />
            </button>

            {form.enableTax && (
              <div className="space-y-6 fade-up">
                <Field
                  label={
                    <>
                      Tax rate
                      <span className="ml-2 text-solana-green font-semibold">
                        {(form.taxBasisPoints / 100).toFixed(2)}%
                      </span>
                    </>
                  }
                >
                  <div className="field !py-5">
                    <input
                      type="range"
                      min={1}
                      max={5000}
                      value={form.taxBasisPoints}
                      onChange={(e) =>
                        update("taxBasisPoints", Number(e.target.value))
                      }
                      className="w-full"
                    />
                    <div className="flex justify-between text-[11px] text-white/40 mt-2">
                      <span>0.01%</span>
                      <span>25%</span>
                      <span>50%</span>
                    </div>
                  </div>
                </Field>

                <Field
                  label="Max tax per transfer"
                  hint="Maximum tokens withheld from a single transfer"
                >
                  <input
                    className="field"
                    type="number"
                    value={form.maxTaxAmount}
                    onChange={(e) =>
                      update("maxTaxAmount", Number(e.target.value))
                    }
                    min={1}
                  />
                </Field>

                <Field
                  label="Tax withdraw authority"
                  hint="Leave empty to use your connected wallet"
                >
                  <input
                    className="field font-mono text-sm"
                    type="text"
                    value={form.taxWithdrawAuthority}
                    onChange={(e) =>
                      update("taxWithdrawAuthority", e.target.value)
                    }
                    placeholder="Optional — defaults to your wallet"
                  />
                </Field>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="space-y-8 fade-up">
            <SectionHeader
              icon={Rocket}
              title="Review & launch"
              subtitle="A final check before your token goes live forever."
              accent="green"
            />

            {/* Preview card */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10">
              {form.banner ? (
                <div className="h-36 w-full overflow-hidden">
                  <img
                    src={form.banner}
                    alt="Banner"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-28 w-full bg-gradient-to-r from-solana-purple/30 via-solana-pink/20 to-solana-green/30" />
              )}
              <div className="p-6 bg-black/40 backdrop-blur-sm flex items-center gap-4">
                {form.image ? (
                  <img
                    src={form.image}
                    alt={form.name}
                    className="w-16 h-16 rounded-2xl border-2 border-white/10 -mt-12 shadow-xl"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl border-2 border-white/10 bg-white/5 flex items-center justify-center -mt-12">
                    <ImageLucide className="w-6 h-6 text-white/30" />
                  </div>
                )}
                <div>
                  <h3 className="display-font text-2xl font-bold leading-tight">
                    {form.name || "Unnamed token"}
                  </h3>
                  <p className="text-solana-purple font-mono text-sm">
                    ${form.symbol || "???"}
                  </p>
                </div>
                <div className="ml-auto">
                  <span
                    className={`chip ${
                      form.enableTax
                        ? "bg-solana-green/15 text-solana-green border border-solana-green/25"
                        : "bg-solana-purple/15 text-solana-purple border border-solana-purple/25"
                    }`}
                  >
                    {form.enableTax ? "Token-2022" : "SPL Token"}
                  </span>
                </div>
              </div>
            </div>

            {form.description && (
              <div className="rounded-xl bg-white/[0.02] border border-white/5 p-4">
                <label className="text-[10px] text-white/40 uppercase tracking-wider">
                  Description
                </label>
                <p className="text-sm text-white/80 mt-1 leading-relaxed">
                  {form.description}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoRow
                label="Total supply"
                value={`${Number(form.supply).toLocaleString()} ${form.symbol || ""}`}
              />
              <InfoRow label="Decimals" value={String(form.decimals)} />
              <InfoRow
                label="Mint authority"
                value={form.revokeMintAuthority ? "Revoked" : "You"}
                accent={form.revokeMintAuthority ? "green" : "purple"}
              />
              <InfoRow
                label="Freeze authority"
                value={form.revokeFreezeAuthority ? "Revoked" : "You"}
                accent={form.revokeFreezeAuthority ? "green" : "purple"}
              />
              {form.enableTax && (
                <>
                  <InfoRow
                    label="Transfer tax"
                    value={`${(form.taxBasisPoints / 100).toFixed(2)}%`}
                    accent="yellow"
                  />
                  <InfoRow
                    label="Max tax / transfer"
                    value={`${Number(form.maxTaxAmount).toLocaleString()} ${form.symbol || ""}`}
                  />
                </>
              )}
              {form.website && <InfoRow label="Website" value={form.website} />}
              {form.twitter && <InfoRow label="Twitter" value={form.twitter} />}
              {form.telegram && <InfoRow label="Telegram" value={form.telegram} />}
              {form.discord && <InfoRow label="Discord" value={form.discord} />}
            </div>

            <div className="rounded-2xl border border-solana-purple/20 bg-gradient-to-br from-solana-purple/10 via-transparent to-solana-green/10 p-5 flex gap-4">
              <div className="p-2 rounded-xl bg-white/5 h-fit">
                <Wallet className="w-5 h-5 text-solana-green" />
              </div>
              <div>
                <p className="font-semibold mb-1">Estimated cost</p>
                <p className="text-sm text-white/55">
                  ~0.05 SOL for account rent + network fees. Token-2022 tokens
                  cost a bit more due to extensions.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/5">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="btn-ghost flex items-center gap-2 px-5 py-3 rounded-xl font-medium"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
              className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl"
            >
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleLaunch}
              disabled={loading || !connected}
              className="btn-primary pulse-ring flex items-center gap-2 px-8 py-3.5 rounded-xl"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/50 border-t-transparent rounded-full animate-spin" />
                  Launching…
                </>
              ) : !connected ? (
                <>
                  <Wallet className="w-5 h-5" /> Connect wallet to launch
                </>
              ) : (
                <>
                  <Rocket className="w-5 h-5" /> Launch token
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Small UI primitives ---------- */

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  accent = "purple",
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  accent?: "purple" | "green" | "yellow";
}) {
  const accentMap = {
    purple: "from-solana-purple/25 to-solana-pink/15 text-solana-purple",
    green: "from-solana-green/25 to-solana-blue/10 text-solana-green",
    yellow: "from-yellow-400/25 to-orange-500/10 text-yellow-400",
  } as const;
  return (
    <div className="flex items-start gap-4">
      <div
        className={`p-3 rounded-2xl bg-gradient-to-br ${accentMap[accent]} border border-white/10`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h2 className="display-font text-2xl font-semibold text-white">
          {title}
        </h2>
        <p className="text-white/50 text-sm mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: React.ReactNode;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-medium text-white/60 mb-2 uppercase tracking-wider">
        {label}
        {required && <span className="text-solana-pink">*</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] text-white/40 mt-1.5">{hint}</p>}
    </div>
  );
}

function IconField({
  icon: Icon,
  label,
  placeholder,
  value,
  onChange,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-white/60 mb-2 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="field !pl-11"
        />
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-white/[0.03] transition-colors text-left"
    >
      <span className={`toggle ${checked ? "toggle-on" : ""}`} />
      <div className="flex-1">
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-xs text-white/45 mt-0.5">{description}</p>
      </div>
    </button>
  );
}

function InfoRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "green" | "purple" | "yellow";
}) {
  const colorMap = {
    green: "text-solana-green",
    purple: "text-solana-purple",
    yellow: "text-yellow-400",
  } as const;
  return (
    <div className="rounded-xl bg-white/[0.02] border border-white/5 p-3.5 hover:border-white/10 transition-colors">
      <label className="text-[10px] text-white/40 uppercase tracking-wider font-medium">
        {label}
      </label>
      <p
        className={`text-sm font-medium mt-1 break-all ${
          accent ? colorMap[accent] : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function ResultRow({
  label,
  value,
  onCopy,
  copied,
  accent,
}: {
  label: string;
  value: string;
  onCopy: () => void;
  copied: boolean;
  accent: "purple" | "green";
}) {
  const accentMap = {
    purple: "text-solana-purple",
    green: "text-solana-green",
  } as const;
  return (
    <div className="rounded-xl bg-black/30 border border-white/5 p-4">
      <label className="text-[10px] text-white/40 uppercase tracking-wider font-medium">
        {label}
      </label>
      <div className="flex items-center gap-2 mt-1.5">
        <code className={`text-xs font-mono flex-1 break-all ${accentMap[accent]}`}>
          {value}
        </code>
        <button
          onClick={onCopy}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          aria-label="Copy"
        >
          {copied ? (
            <Check className="w-4 h-4 text-solana-green" />
          ) : (
            <Copy className="w-4 h-4 text-white/50" />
          )}
        </button>
      </div>
    </div>
  );
}
