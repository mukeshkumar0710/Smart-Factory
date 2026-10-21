import React, { useState } from 'react';
import { useFactory } from '../../context/FactoryContext';
import { User, UserRole } from '../../types';
import {
  Cpu,
  Shield,
  ShieldCheck,
  Wrench,
  Activity,
  Layers,
  ArrowRight,
  Lock,
  Mail,
  UserCheck,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { users, login } = useFactory();

  const [activeTab, setActiveTab] = useState<'cards' | 'credentials'>('cards');
  const [selectedRole, setSelectedRole] = useState<UserRole>('supervisor');
  const [email, setEmail] = useState<string>('rajesh.varma@easwari-factory.io');
  const [password, setPassword] = useState<string>('smartfactory2026');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Role metadata mapping for visual presentation
  const roleMeta: Record<
    UserRole,
    {
      title: string;
      color: string;
      borderColor: string;
      bgGradient: string;
      icon: any;
      description: string;
      keyPrivileges: string[];
    }
  > = {
    supervisor: {
      title: 'Plant Operations Supervisor',
      color: 'text-purple-400',
      borderColor: 'border-purple-500/40 hover:border-purple-400',
      bgGradient: 'from-purple-950/40 to-slate-900',
      icon: Layers,
      description: 'Overall factory floor oversight, downtime authorization, and shift management.',
      keyPrivileges: ['Authorize Line Downtime', 'Approve Scheduled Work Orders', 'Plant-Wide Safety Clearance']
    },
    maintenance: {
      title: 'Lead Maintenance Engineer',
      color: 'text-amber-400',
      borderColor: 'border-amber-500/40 hover:border-amber-400',
      bgGradient: 'from-amber-950/40 to-slate-900',
      icon: Wrench,
      description: 'Predictive vibration diagnostics, technical repairs, and mechanical overhauls.',
      keyPrivileges: ['ISO 10816 Vibration Analysis', 'Execute LOTO Padlocking', 'Certify Work Order Repairs']
    },
    safety: {
      title: 'Chief Industrial Safety Officer',
      color: 'text-emerald-400',
      borderColor: 'border-emerald-500/40 hover:border-emerald-400',
      bgGradient: 'from-emerald-950/40 to-slate-900',
      icon: ShieldCheck,
      description: 'ISO/TS 15066 collaborative robot safety, perimeter audits, and OSHA compliance.',
      keyPrivileges: ['Cobot 0.8m Safety Clearance', 'Conduct ISO Hazard Audits', 'Multi-Team LOTO Release']
    },
    operations: {
      title: 'CNC & Assembly Cell Operator',
      color: 'text-blue-400',
      borderColor: 'border-blue-500/40 hover:border-blue-400',
      bgGradient: 'from-blue-950/40 to-slate-900',
      icon: Activity,
      description: 'Real-time equipment operation, cycle monitoring, and immediate fault reporting.',
      keyPrivileges: ['Haas CNC & Mazak Operation', 'Report Live Sensor Hazards', 'Inter-Departmental Handovers']
    },
    quality: {
      title: 'QA & Compliance Lead',
      color: 'text-cyan-400',
      borderColor: 'border-cyan-500/40 hover:border-cyan-400',
      bgGradient: 'from-cyan-950/40 to-slate-900',
      icon: CheckCircle2,
      description: 'Dimensional precision audits, optical sorting verification, and final signoff.',
      keyPrivileges: ['Final Quality Signoff', 'Optical Inspection Sorting', 'Tolerance Compliance Logs']
    }
  };

  const handleSelectRolePreset = (user: User) => {
    setSelectedRole(user.role);
    setEmail(user.email);
    setPassword('smartfactory2026');
    setError(null);
  };

  const handleQuickLogin = (user: User) => {
    login(user);
  };

  const handleCredentialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser) {
      login(foundUser);
    } else {
      // Fallback matching role
      const roleMatch = users.find(u => u.role === selectedRole);
      if (roleMatch) {
        login(roleMatch);
      } else {
        setError('No active personnel found matching credentials. Select a quick role card.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background Ambient Industrial Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.15),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Top Header */}
      <header className="py-4 px-6 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md flex items-center justify-between z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/40">
            <Cpu className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-base text-white tracking-tight">Smart Factory</span>
              <span className="text-cyan-400 font-mono text-xs uppercase px-1.5 py-0.5 bg-cyan-950/80 rounded border border-cyan-800/60">
                MERN Auth Portal
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Easwari Engineering College &bull; Department of Information Technology
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-xs font-mono">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-400">IoT Broker & Node.js Engine: Online</span>
        </div>
      </header>

      {/* Main Login Workspace */}
      <main className="max-w-6xl w-full mx-auto px-4 py-8 z-10 flex-1 flex flex-col justify-center space-y-6">
        {/* Title Banner */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-800/60 text-cyan-300 text-xs font-mono">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>Role-Based Access Control (RBAC) &bull; ISO/TS 15066</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Collaborative Workspace Sign-In
          </h1>
          <p className="text-xs md:text-sm text-slate-400">
            Select your cross-functional departmental persona below or sign in with your enterprise credentials.
          </p>

          {/* Toggle between Quick Role Selection and Credential Form */}
          <div className="inline-flex rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs mt-2">
            <button
              onClick={() => setActiveTab('cards')}
              className={`px-4 py-1.5 rounded-lg font-medium transition ${
                activeTab === 'cards'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              One-Click Role Selection
            </button>
            <button
              onClick={() => setActiveTab('credentials')}
              className={`px-4 py-1.5 rounded-lg font-medium transition ${
                activeTab === 'credentials'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Enterprise Credentials
            </button>
          </div>
        </div>

        {/* Tab 1: Interactive Role Selection Cards */}
        {activeTab === 'cards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map(user => {
              const meta = roleMeta[user.role] || roleMeta.supervisor;
              const Icon = meta.icon;

              return (
                <div
                  key={user.id}
                  className={`rounded-2xl bg-gradient-to-b ${meta.bgGradient} border ${meta.borderColor} p-5 flex flex-col justify-between shadow-xl transition-all duration-300 hover:scale-[1.02] relative group`}
                >
                  <div className="space-y-4">
                    {/* Role Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-700 shadow-md"
                        />
                        <div>
                          <h3 className="font-bold text-sm text-white group-hover:text-cyan-300 transition">
                            {user.name}
                          </h3>
                          <div className={`text-xs font-semibold ${meta.color}`}>{user.title}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{user.shift}</div>
                        </div>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                        <Icon className={`w-4 h-4 ${meta.color}`} />
                      </div>
                    </div>

                    {/* Department description */}
                    <p className="text-xs text-slate-300 leading-relaxed">{meta.description}</p>

                    {/* Permissions list */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                      <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">
                        Key Authorized Privileges:
                      </div>
                      {meta.keyPrivileges.map((priv, idx) => (
                        <div key={idx} className="flex items-center space-x-1.5 text-[11px] text-slate-300">
                          <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" />
                          <span>{priv}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sign In Button */}
                  <div className="pt-4 mt-4 border-t border-slate-800/80">
                    <button
                      onClick={() => handleQuickLogin(user)}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-cyan-600 text-white font-semibold text-xs flex items-center justify-center space-x-2 border border-slate-700 hover:border-cyan-500 shadow-md transition group-hover:bg-cyan-600"
                    >
                      <span>Sign In as {user.name.split(' ')[0]}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Standard Enterprise Credentials Form */}
        {activeTab === 'credentials' && (
          <div className="max-w-md w-full mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="space-y-1">
              <h3 className="font-bold text-base text-white">Enter Industrial Credentials</h3>
              <p className="text-xs text-slate-400">
                Single sign-on access to the connected Smart Factory workspace.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Quick Demo Pre-fills Chips */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-400 font-medium">Quick Auto-Fill Role:</span>
              <div className="flex flex-wrap gap-1.5">
                {users.map(u => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleSelectRolePreset(u)}
                    className={`px-2 py-1 rounded text-[10px] font-mono transition border ${
                      email === u.email
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-700 font-bold'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {u.role.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleCredentialSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Select Department Role</label>
                <select
                  value={selectedRole}
                  onChange={e => {
                    const r = e.target.value as UserRole;
                    setSelectedRole(r);
                    const matched = users.find(u => u.role === r);
                    if (matched) setEmail(matched.email);
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="supervisor">Plant Operations Supervisor (Rajesh Varma)</option>
                  <option value="maintenance">Predictive Maintenance Engineer (Naeya Joy Christina)</option>
                  <option value="safety">Chief Safety Officer (Dr. Ananya Sharma)</option>
                  <option value="operations">CNC & Assembly Cell Operator (Vikram Sundaram)</option>
                  <option value="quality">QA & Compliance Lead (Kavita Krishnan)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Enterprise Email</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Security Passkey</label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-9 pr-9 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-0"
                  />
                  <span>Keep session active</span>
                </label>
                <span className="text-cyan-400 font-mono text-[10px]">Security: TLS 1.3 / LOTO</span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-cyan-500/20 transition"
              >
                <span>Authorize & Enter Factory Floor</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Footer Disclaimer */}
      <footer className="py-4 px-6 border-t border-slate-800/80 bg-slate-900/60 backdrop-blur-md text-center text-xs text-slate-500 z-10 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>
          Department of Information Technology &bull; Easwari Engineering College (Autonomous), Chennai – 89
        </span>
        <span className="font-mono text-[11px] text-slate-400">
          ISO/TS 15066:2016 &bull; ISO 10816-3 &bull; ISO 45001
        </span>
      </footer>
    </div>
  );
};
