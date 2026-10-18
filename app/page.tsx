'use client';

import React, { useMemo, useState } from 'react';
import {
  demoActiveProfile,
  demoAtRiskProfile,
  scoreChurnRisk,
} from '../examples/engines';

type Mode = 'risk' | 'active';

export default function PlayerChurnPredictor() {
  const [mode, setMode] = useState<Mode>('risk');
  const result = useMemo(
    () =>
      scoreChurnRisk(
        mode === 'risk' ? demoAtRiskProfile() : demoActiveProfile()
      ),
    [mode]
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-2xl tracking-widest text-emerald-400 mb-2 font-bold">
          PLAYER CHURN PREDICTOR
        </div>
        <div className="text-xs opacity-60 mb-6">
          Pixel Journey · Retention risk heuristics · Not a guaranteed forecast
        </div>

        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => setMode('risk')}
            className={`px-4 py-2 rounded-xl text-sm ${
              mode === 'risk' ? 'bg-amber-600' : 'bg-white/10'
            }`}
          >
            Demo at-risk profile
          </button>
          <button
            type="button"
            onClick={() => setMode('active')}
            className={`px-4 py-2 rounded-xl text-sm ${
              mode === 'active' ? 'bg-emerald-600' : 'bg-white/10'
            }`}
          >
            Demo active profile
          </button>
        </div>

        <div className="border border-white/10 bg-black/40 p-6 rounded-2xl mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="font-mono text-lg">{result.account}</div>
            <div
              className={`px-3 py-1 rounded-full text-sm font-mono ${
                result.riskScore >= 60
                  ? 'bg-red-500/20 text-red-400'
                  : result.riskScore >= 40
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-emerald-500/20 text-emerald-400'
              }`}
            >
              {result.riskScore} · {result.level}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm mb-4">
            {Object.entries(result.components).map(([k, v]) => (
              <div
                key={k}
                className="flex justify-between border-b border-white/10 pb-1"
              >
                <span className="opacity-70 capitalize">{k}</span>
                <span className="font-mono">{v}</span>
              </div>
            ))}
          </div>

          <p className="text-xs opacity-60 mb-3">{result.methodologyNote}</p>

          <ul className="space-y-1 text-xs opacity-80">
            {result.flags.map((f) => (
              <li key={f.id}>
                [{f.level}] {f.message}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs opacity-60">
          Build <code className="text-emerald-400/80">PlayerActivityProfile</code> from
          Hyperion aggregates, then call{' '}
          <code className="text-emerald-400/80">scoreChurnRisk</code> or{' '}
          <code className="text-emerald-400/80">scoreCohort</code>.
        </p>
      </div>
    </div>
  );
}
