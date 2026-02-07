import React from 'react';
import { Ping } from '../types';
import { Activity, Globe, ShieldCheck } from 'lucide-react';

interface StatsPanelProps {
  activeCount: number;
  userPing: Ping | undefined;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ activeCount, userPing }) => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-metro-card p-4 border border-metro-border relative overflow-hidden">
        <div className="flex items-center gap-3 text-metro-cyan mb-2">
          <Activity size={20} />
          <h3 className="font-semibold uppercase tracking-wider text-xs">Live Signals</h3>
        </div>
        <div className="text-4xl font-light text-white">{activeCount}</div>
        <div className="absolute -right-4 -bottom-4 opacity-10">
          <Activity size={80} />
        </div>
      </div>

      <div className="bg-metro-card p-4 border border-metro-border relative overflow-hidden">
        <div className="flex items-center gap-3 text-metro-magenta mb-2">
          <Globe size={20} />
          <h3 className="font-semibold uppercase tracking-wider text-xs">Your Status</h3>
        </div>
        <div className="text-xl font-light text-white mt-2">
          {userPing ? 'Broadcasting' : 'Silent'}
        </div>
        {userPing && <div className="text-xs text-gray-400 mt-1">TTL: Active</div>}
         <div className="absolute -right-4 -bottom-4 opacity-10">
          <Globe size={80} />
        </div>
      </div>

       <div className="bg-metro-card p-4 border border-metro-border relative overflow-hidden">
        <div className="flex items-center gap-3 text-metro-lime mb-2">
          <ShieldCheck size={20} />
          <h3 className="font-semibold uppercase tracking-wider text-xs">Privacy</h3>
        </div>
        <div className="text-sm font-light text-gray-300 mt-1 leading-snug">
          Ephemeral mode active.
        </div>
        <div className="text-xs text-gray-500 mt-1">No logs. No DB. RAM only.</div>
         <div className="absolute -right-4 -bottom-4 opacity-10">
          <ShieldCheck size={80} />
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
