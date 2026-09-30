import React, { useState } from 'react';
import {
  Pickaxe,
  Satellite,
  Compass,
  TrendingUp,
  Cpu,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { loginUser } from '../services/api';

interface LandingLoginModalProps {
  isOpen: boolean;
  onLoginSuccess: (user: any) => void;
}

export const LandingLoginModal: React.FC<LandingLoginModalProps> = ({
  isOpen,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('admin@manganex.demo');
  const [password, setPassword] = useState('Demo@123');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await loginUser(email, password);
      if (res.success) {
        onLoginSuccess(res.user);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickEnter = async () => {
    setIsLoading(true);
    try {
      const res = await loginUser('admin@manganex.demo', 'Demo@123');
      if (res.success) {
        onLoginSuccess(res.user);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-4xl bg-neutral-950 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left: Brand & Visual Flow (55%) */}
        <div className="p-8 md:w-7/12 bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950 border-r border-neutral-800/80 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-neutral-950 font-bold shadow-lg shadow-amber-500/20">
                <Pickaxe className="w-5 h-5 text-neutral-950" />
              </div>
              <div>
                <div className="text-base font-bold text-neutral-100 tracking-tight">MANGANEX AI</div>
                <div className="text-[10px] font-mono text-amber-400">MOIL SIH26009 COMMAND CENTER</div>
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-extrabold text-neutral-100 tracking-tight leading-snug">
                Manganese Intelligence,
                <br />
                <span className="text-amber-400">From Satellite Signals to Mine Decisions.</span>
              </h1>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Transforming fragmented space-borne radar, multispectral bands, drill-hole assays, and fleet telemetry into actionable mineral prospectivity and production resilience.
              </p>
            </div>

            {/* Visual Flow Architecture */}
            <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800/80 space-y-2 text-xs">
              <div className="text-[10px] font-mono uppercase text-neutral-500 tracking-wider">
                Full-Stack Fusion Pipeline
              </div>
              <div className="flex items-center justify-between font-mono text-[10px] text-neutral-300">
                <span className="text-cyan-400 font-bold">SPACE</span>
                <span className="text-neutral-600">➔</span>
                <span className="text-emerald-400 font-bold">EARTH</span>
                <span className="text-neutral-600">➔</span>
                <span className="text-amber-400 font-bold">GEOLOGY</span>
                <span className="text-neutral-600">➔</span>
                <span className="text-purple-400 font-bold">AI</span>
                <span className="text-neutral-600">➔</span>
                <span className="text-neutral-100 font-bold">DECISION</span>
              </div>
            </div>
          </div>

          <div className="space-y-1 text-[11px] text-neutral-500 border-t border-neutral-900 pt-3">
            <div>Smart India Hackathon 2026 • Problem Statement SIH26009</div>
            <div>Organization: MOIL Limited (Min. of Steel / Min. of Mines, Govt. of India)</div>
          </div>
        </div>

        {/* Right: Login Form & Demo Credentials (45%) */}
        <div className="p-8 md:w-5/12 bg-neutral-900/60 flex flex-col justify-center space-y-5 text-xs">
          <div>
            <h2 className="text-base font-bold text-neutral-100">Authenticate Access</h2>
            <p className="text-neutral-400 text-xs mt-0.5">Enter authorized mining officer credentials</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="text-neutral-300 block mb-1 font-medium">Officer Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-neutral-200 text-xs focus:outline-none focus:border-amber-500"
                placeholder="admin@manganex.demo"
                required
              />
            </div>

            <div>
              <label className="text-neutral-300 block mb-1 font-medium">Security Credential</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-neutral-200 text-xs focus:outline-none focus:border-amber-500"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-amber-500/20"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isLoading ? 'Verifying...' : 'Sign In as Officer'}</span>
            </button>
          </form>

          {/* One-Click Quick Enter */}
          <div className="pt-2 border-t border-neutral-800 space-y-2">
            <button
              onClick={handleQuickEnter}
              disabled={isLoading}
              className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-amber-300 font-semibold rounded text-xs transition-colors flex items-center justify-center gap-2 border border-amber-500/30"
            >
              <span>Instant Evaluator Demo Access</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="p-2 rounded bg-neutral-950 border border-neutral-800 text-[10px] font-mono text-neutral-400 space-y-0.5">
              <div className="text-amber-400 font-semibold uppercase">Pre-Loaded Demo Credentials:</div>
              <div>User: admin@manganex.demo</div>
              <div>Pass: Demo@123</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
