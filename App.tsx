import React, { useState, useEffect, useCallback, useRef } from 'react';
import WorldMap from './components/WorldMap';
import StatsPanel from './components/StatsPanel';
import { getLocation } from './services/geolocationService';
import { generateMockPing } from './services/mockSocketService';
import { Ping, Coordinate } from './types';
import { METRO_COLORS, PING_TTL_MS, CLEANUP_INTERVAL_MS, MOCK_PING_INTERVAL_MS, MAX_PINGS_ON_SCREEN } from './constants';
import { AlertTriangle, ChevronRight, Activity } from 'lucide-react';

const App: React.FC = () => {
  const [pings, setPings] = useState<Ping[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const userPingRef = useRef<string | null>(null); 

  const addPing = useCallback((newPing: Ping) => {
    setPings(prev => {
      const next = [newPing, ...prev].slice(0, MAX_PINGS_ON_SCREEN);
      return next;
    });
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = Date.now();
      setPings(prev => prev.filter(p => now - p.timestamp < PING_TTL_MS));
    }, CLEANUP_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [pings]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const mockPing = generateMockPing();
      addPing(mockPing);
    }, MOCK_PING_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [addPing]);

  const handlePing = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const coords: Coordinate = await getLocation();
      const newPing: Ping = {
        id: crypto.randomUUID(),
        coordinate: coords,
        timestamp: Date.now(),
        color: METRO_COLORS[0],
        isUser: true,
        city: 'Current Location'
      };
      userPingRef.current = newPing.id;
      addPing(newPing);
    } catch (err: any) {
      setError(err.message || 'Failed to get location');
    } finally {
      setIsLoading(false);
    }
  };

  const activeUserPing = pings.find(p => p.id === userPingRef.current);

  // Helper to format coordinate
  const formatCoord = (n: number) => n.toFixed(2);

  return (
    <div className="h-screen w-screen bg-app-bg text-white font-sans overflow-hidden flex flex-col lg:flex-row">
        
      {/* LEFT COLUMN: Sidebar */}
      <div className="w-full lg:w-[480px] flex-shrink-0 flex flex-col h-full p-6 lg:p-8 z-20 bg-app-bg shadow-[10px_0_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
        
        {/* Header */}
        <div className="mb-8 pl-2">
            <h1 className="text-xl font-semibold tracking-wide flex items-center gap-2">
              <span className="w-1 h-6 bg-white rounded-full"></span>
              EchoMap
            </h1>
        </div>

        {/* Hero Card */}
        <StatsPanel 
          activeCount={pings.length} 
          userPing={activeUserPing} 
          onPing={handlePing}
          isLoading={isLoading}
        />

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl mb-6 text-sm flex gap-3">
            <AlertTriangle className="shrink-0" size={18} />
            {error}
          </div>
        )}

        {/* Signal Log (Timeline) */}
        <div className="flex-1 overflow-hidden flex flex-col mt-4">
          <div className="flex justify-between items-end mb-6 px-2">
            <h3 className="text-xl font-bold">Signal Log</h3>
            <div className="flex items-center gap-2 text-app-subtext text-xs font-medium">
                <Activity size={14} />
                <span>{pings.length} places active</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 relative no-scrollbar">
              {/* Timeline Line */}
              {pings.length > 0 && (
                <div className="absolute left-[19px] top-6 bottom-6 w-[2px] bg-[#1A1A1A] z-0" />
              )}

            <div className="pb-8 space-y-8">
              {pings.map((ping, idx) => (
                <div key={ping.id} className="relative z-10 flex gap-5 items-start group animate-in slide-in-from-bottom-2 duration-500">
                  {/* Timeline Node */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#121212] border border-[#2A2A2A] flex items-center justify-center text-xs font-bold shadow-lg group-hover:border-white/20 transition-colors mt-1">
                      {idx + 1}
                  </div>
                  
                  {/* Card */}
                  <div className="flex-1 bg-[#121212] hover:bg-[#1A1A1A] rounded-[24px] p-5 transition-all duration-300 border border-transparent hover:border-white/5 cursor-default group-hover:translate-x-1 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4">
                          {/* Mini Map Thumbnail */}
                          <div 
                            className="w-14 h-14 rounded-2xl bg-cover bg-center opacity-80 shadow-inner"
                            style={{ 
                              backgroundColor: ping.color,
                              backgroundImage: 'linear-gradient(to bottom right, rgba(255,255,255,0.1), rgba(0,0,0,0.4))' 
                            }} 
                          />
                          <div>
                            <h4 className="font-bold text-white text-base">
                              {ping.isUser ? 'My Signal' : 'Anonymous Signal'}
                            </h4>
                            <p className="text-xs text-app-subtext mt-1 font-mono tracking-wide">
                              {formatCoord(ping.coordinate.lat)}, {formatCoord(ping.coordinate.lng)}
                            </p>
                            {/* Status Indicator */}
                            <div className="flex items-center gap-2 mt-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                              <span className="text-[10px] uppercase font-semibold text-gray-500">Live Tracking</span>
                            </div>
                          </div>
                      </div>
                      
                      {ping.isUser && (
                        <div className="bg-white/10 px-2 py-1 rounded-md text-[10px] font-bold text-white">YOU</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {pings.length === 0 && (
              <div className="text-center py-20 text-gray-600">
                  <p>No active signals nearby.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Map */}
      <div className="hidden lg:block flex-1 h-full bg-[#050505] relative z-0">
          <WorldMap pings={pings} />
      </div>

    </div>
  );
};

export default App;