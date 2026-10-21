import React, { useState } from 'react';
import { useFactory } from '../../context/FactoryContext';
import {
  MessagesSquare,
  Send,
  Users,
  Shield,
  Wrench,
  Activity,
  AlertTriangle,
  Clock,
  Tag
} from 'lucide-react';

export const CollaborationHubView: React.FC = () => {
  const { messages, currentUser, sendMessage, machines } = useFactory();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [messageInput, setMessageInput] = useState<string>('');
  const [taggedMachine, setTaggedMachine] = useState<string>('');
  const [priority, setPriority] = useState<'routine' | 'urgent' | 'alert'>('routine');

  const filteredMessages = messages.filter(m => {
    if (selectedFilter === 'all') return true;
    return m.team === selectedFilter;
  });

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    await sendMessage(
      messageInput.trim(),
      taggedMachine || undefined,
      priority
    );
    setMessageInput('');
    setTaggedMachine('');
    setPriority('routine');
  };

  const teamColors: Record<string, string> = {
    operations: 'bg-blue-950 text-blue-300 border-blue-800',
    maintenance: 'bg-amber-950 text-amber-300 border-amber-800',
    safety: 'bg-emerald-950 text-emerald-300 border-emerald-800',
    management: 'bg-purple-950 text-purple-300 border-purple-800'
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <MessagesSquare className="w-5 h-5 text-cyan-400" />
              Cross-Functional Team Collaboration Hub
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800">
              Operations &bull; Maintenance &bull; Safety
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Inter-departmental shift handover logs, incident coordinating discussions, and real-time maintenance requests.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center space-x-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1 rounded-md transition ${
              selectedFilter === 'all' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Updates
          </button>
          <button
            onClick={() => setSelectedFilter('operations')}
            className={`px-3 py-1 rounded-md transition ${
              selectedFilter === 'operations' ? 'bg-blue-950 text-blue-300 border border-blue-800' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Operations
          </button>
          <button
            onClick={() => setSelectedFilter('maintenance')}
            className={`px-3 py-1 rounded-md transition ${
              selectedFilter === 'maintenance' ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Maintenance
          </button>
          <button
            onClick={() => setSelectedFilter('safety')}
            className={`px-3 py-1 rounded-md transition ${
              selectedFilter === 'safety' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Safety
          </button>
        </div>
      </div>

      {/* Grid: Messages Stream & Live Team Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages Stream (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Post Message Composer */}
          <form onSubmit={handleSend} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-5 h-5 rounded-full object-cover"
                />
                Posting as <strong>{currentUser.name}</strong> ({currentUser.title})
              </span>
              <span className="font-mono text-[11px] text-cyan-400">{currentUser.department}</span>
            </div>

            <textarea
              rows={2}
              placeholder="Post a shift handover update, machine observation, or downtime request..."
              value={messageInput}
              onChange={e => setMessageInput(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex items-center space-x-2">
                {/* Tag Machine Dropdown */}
                <select
                  value={taggedMachine}
                  onChange={e => setTaggedMachine(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
                >
                  <option value="">Tag Machine (Optional)</option>
                  {machines.map(m => (
                    <option key={m.id} value={m.code}>
                      {m.code} - {m.name}
                    </option>
                  ))}
                </select>

                {/* Priority Selector */}
                <select
                  value={priority}
                  onChange={e => setPriority(e.target.value as any)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
                >
                  <option value="routine">Routine</option>
                  <option value="urgent">Urgent</option>
                  <option value="alert">Safety Alert</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={!messageInput.trim()}
                className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center space-x-1.5 transition shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Transmit Update</span>
              </button>
            </div>
          </form>

          {/* Feed List */}
          <div className="space-y-3">
            {filteredMessages.map(msg => {
              const isUrgent = msg.priority === 'urgent' || msg.priority === 'alert';
              return (
                <div
                  key={msg.id}
                  className={`p-4 rounded-xl border transition shadow-sm space-y-2.5 ${
                    isUrgent ? 'bg-amber-950/20 border-amber-800/80' : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={msg.senderAvatar}
                        alt={msg.senderName}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-700"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-xs text-white">{msg.senderName}</span>
                          <span
                            className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded border ${
                              teamColors[msg.team] || 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {msg.team}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400">{msg.department}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {msg.machineCode && (
                        <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800 flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {msg.machineCode}
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-slate-500">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed pl-11">{msg.content}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Info: Shift Personnel on Duty */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              On-Duty Cross-Functional Contacts
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-850 flex items-center space-x-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                  alt="Rajesh"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <div className="font-bold text-white">Rajesh Varma</div>
                  <div className="text-[10px] text-blue-300 font-semibold">Operations Supervisor</div>
                  <div className="text-[10px] text-slate-400">Shift A &bull; Ext: 104</div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-850 flex items-center space-x-3">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80"
                  alt="Dr. Ananya Sharma"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <div className="font-bold text-white">Dr. Ananya Sharma</div>
                  <div className="text-[10px] text-emerald-300 font-semibold">Lead Safety Officer (ISO/TS 15066)</div>
                  <div className="text-[10px] text-slate-400">General Shift &bull; Ext: 112</div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-850 flex items-center space-x-3">
                <img
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80"
                  alt="Naeya"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <div className="font-bold text-white">Naeya Joy Christina</div>
                  <div className="text-[10px] text-amber-300 font-semibold">Lead Maintenance Engineer</div>
                  <div className="text-[10px] text-slate-400">Shift A &bull; Ext: 201</div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-850 flex items-center space-x-3">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80"
                  alt="Vikram"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <div className="font-bold text-white">Vikram Sundaram</div>
                  <div className="text-[10px] text-blue-300 font-semibold">CNC & Assembly Cell Operator</div>
                  <div className="text-[10px] text-slate-400">Shift A &bull; Ext: 305</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
