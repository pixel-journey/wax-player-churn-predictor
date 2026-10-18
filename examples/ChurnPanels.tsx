"use client";

import type { ChurnRiskResult, FlagLevel } from "./types";

const levelClass: Record<FlagLevel, string> = {
  info: "border-white/10 bg-white/5 text-white/80",
  warn: "border-amber-500/30 bg-amber-500/10 text-amber-100",
  alert: "border-red-500/30 bg-red-500/10 text-red-100",
};

export function ChurnRiskCard({
  result,
  className = "",
}: {
  result: ChurnRiskResult;
  className?: string;
}) {
  return (
    <article
      className={`rounded-2xl border border-white/10 bg-black/30 p-6 ${className}`}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-mono text-lg">{result.account}</h3>
        <span
          className={`px-3 py-1 rounded-full text-sm font-mono ${
            result.riskScore >= 60
              ? "bg-red-500/20 text-red-400"
              : result.riskScore >= 40
                ? "bg-amber-500/20 text-amber-400"
                : "bg-emerald-500/20 text-emerald-400"
          }`}
        >
          {result.riskScore} · {result.level}
        </span>
      </div>
      <dl className="grid grid-cols-2 gap-2 text-sm mb-4">
        {Object.entries(result.components).map(([k, v]) => (
          <div key={k} className="flex justify-between border-b border-white/5 pb-1">
            <dt className="text-white/50 capitalize">{k}</dt>
            <dd className="font-mono">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="text-xs text-white/40 mb-3">{result.methodologyNote}</p>
      <ul className="space-y-2">
        {result.flags.map((f) => (
          <li key={f.id} className={`rounded-xl border p-2 text-sm ${levelClass[f.level]}`}>
            {f.message}
          </li>
        ))}
      </ul>
    </article>
  );
}
