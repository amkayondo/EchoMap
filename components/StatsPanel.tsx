import React from 'react';
import { Ping } from '../types';
import { Radio, MapPin, Clock, Users } from 'lucide-react';
import { Button } from './ui/Button';

interface StatsPanelProps {
  activeCount: number;
  userPing: Ping | undefined;
  onPing: () => void;
  isLoading: boolean;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ activeCount, userPing, onPing, isLoading }) => {
  return (
    <div className="relative w-full bg-[#121212] rounded-[32px] overflow-hidden border border-white/5 shadow-2xl mb-8 group">
      {/* Background Image Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-purple-900/20 opacity-50 group-hover:opacity-70 transition-opacity duration-1000" />
      
      <div className="relative p-6 pt-8 pb-20">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Global Network</h2>
            <div className="flex items-center gap-2 mt-1 text-gray-400 text-sm font-medium">
              <MapPin size={14} />
              <span>{userPing ? 'Transmitting Signal' : 'Location Hidden'}</span>
            </div>
          </div>
          
          {/* Live Badge */}
          <div className="bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2">
             <div className={`w-2 h-2 rounded-full ${userPing ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
             <span className="text-xs font-mono font-bold">{userPing ? 'LIVE' : 'OFFLINE'}</span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-6 mt-8">
          <div className="flex -space-x-3">
            {[...Array(Math.min(4, activeCount + 1))].map((_, i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-[#121212] bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-[10px] font-bold text-white/50">
                 {i === 0 && userPing ? 'ME' : ''}
              </div>
            ))}
            {activeCount > 3 && (
               <div className="w-8 h-8 rounded-full border-2 border-[#121212] bg-gray-800 flex items-center justify-center text-[10px] text-white">
                 +{activeCount - 3}
               </div>
            )}
          </div>

          <div className="h-8 w-px bg-white/10" />

          <div className="flex items-center gap-2 text-white/80">
            <Radio size={16} />
            <span className="text-sm font-semibold">{activeCount} signals</span>
          </div>

           <div className="h-8 w-px bg-white/10" />

           <div className="flex items-center gap-2 text-white/80">
            <Clock size={16} />
            <span className="text-sm font-semibold">8s TTL</span>
          </div>
        </div>
      </div>

      {/* Floating Action Button area (mimicking the "Open Skipass" overlay) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%]">
        <Button 
          variant="primary" 
          fullWidth 
          onClick={onPing}
          disabled={isLoading}
          className="text-base py-4 rounded-[24px]"
        >
          {isLoading ? 'Acquiring...' : userPing ? 'Broadcast Again' : 'Broadcast Location'}
        </Button>
      </div>
    </div>
  );
};

export default StatsPanel;