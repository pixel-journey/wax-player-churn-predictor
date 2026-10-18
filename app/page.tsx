'use client';

import React, { useCallback, useMemo, useState } from 'react';
import {
  demoActiveProfile,
  demoAtRiskProfile,
  scoreChurnRisk,
} from '../examples/engines';
import { fetchPlayerActivityProfile } from '../examples/live/hyperion';
import type { ChurnRiskResult } from '../examples/types';

type Mode = 'live' | 'risk' | 'active';

export default function PlayerChurnPredictor() {
  const [mode, setMode] = useState<Mode>('live');
  const [account, setAccount] = useState('eosio');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [liveResult, setLiveResult] = useState<ChurnRiskResult | null>(null);
  const [meta, setMeta] = useState<string | null>(null);

  const demoResult = useMemo(() => {
    if (mode === 'risk') return scoreChurnRisk(demoAtRiskProfile());
    if (mode === 'active') return scoreChurnRisk(demoActiveProfile());
    return null;
  }, [mode]);

  const result = mode === 'live' ? liveResult : demoResult;

  const runLive = useCallback(async () => {
    setLoading(true);
    setError(null);
    setMeta(null);
    try {
      const { profile, source, rawCount, sampleNote } =
        await fetchPlayerActivityProfile(account, { limit: 200 });
      setLiveResult(scoreChurnRisk(profile));
      setMeta(`${rawCount} actions · ${sampleNote} · ${source}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Live fetch failed');
      setLiveResult(null);
    } finally {
      setLoading(false);
    }
  }, [account]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-2xl tracking-widest text-emerald-400 mb-2 font-bold">
          PLAYER CHURN PREDICTOR
        </div>
        <div className="text-xs opacity-60 mb-6">
          Pixel Journey · Live Hyperion sample or demo · Not a guaranteed forecast
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            type="button"
            onClick={() => setMode('live')}
            className={`px-4 py-2 rounded-xl text-sm ${
              mode === 'live' ? 'bg-sky-600' : 'bg-white/10'
            }`}
          >
            Live Hyperion
          </button>
          <button
            type="button"
            onClick={() => setMode('risk')}
            className={`px-4 py-2 rounded-xl text-sm ${
              mode === 'risk' ? 'bg-amber-600' : 'bg-white/10'
            }`}
          >
            Demo at-risk
          </button>
          <button
            type="button"
            onClick={() => setMode('active')}
            className={`px-4 py-2 rounded-xl text-sm ${
              mode === 'active' ? 'bg-emerald-600' : 'bg-white/10'
            }`}
          >
            Demo active
          </button>
        </div>

        {mode === 'live' && (
          <div className="border border-white/10 bg-black/40 p-4 rounded-2xl mb-6 flex flex-col sm:flex-row gap-3">
            <input
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              className="flex-1 bg-black/60 border border-white/10 px-4 py-3 rounded-xl font-mono text-sm"
              placeholder="WAX account"
            />
            <button
              type="button"
              onClick={runLive}
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-sky-600 text-sm font-medium disabled:opacity-50"
            >
              {loading ? 'Fetching…' : 'Score live'}
            </button>
          </div>
        )}

        {error && (
          <div className="mb-4 text-sm text-red-400 border border-red-500/30 rounded-xl p-3">
            {error}
          </div>
        )}
        {meta && (
          <div className="mb-4 text-xs opacity-50 break-all">{meta}</div>
        )}

        {result && (
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
        )}

        {!result && mode === 'live' && !loading && !error && (
          <p className="text-sm opacity-50 mb-6">
            Enter a WAX account to build a soft activity profile from recent Hyperion
            actions.
          </p>
        )}

        <p className="text-xs opacity-60">
          Live: Hyperion page → profile →{' '}
          <code className="text-emerald-400/80">scoreChurnRisk</code>. Sample is not a
          full 30-day archive.
        </p>
      </div>
    </div>
  );
}
