import React, { useState, useEffect, useCallback, useRef } from 'react';
import WorldMap from './components/WorldMap';
import StatsPanel from './components/StatsPanel';
import { Button } from './components/ui/Button';
import { getLocation } from './services/geolocationService';
import { generateMockPing } from './services/mockSocketService';
import { Ping, Coordinate } from './types';
import { METRO_COLORS, PING_TTL_MS, CLEANUP_INTERVAL_MS, MOCK_PING_INTERVAL_MS, MAX_PINGS_ON_SCREEN } from './constants';
import { Radar, AlertTriangle, Info } from 'lucide-react';

const App: React.FC = () => {
  const [pings, setPings] = useState<Ping[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const userPingRef = useRef<string | null>(null); // Store ID of user's current ping

  // 1. Core Logic: Add a ping to the state
  const addPing = useCallback((newPing: Ping) => {
    setPings(prev => {
      // Performance limiter
      const next = [newPing, ...prev].slice(0, MAX_PINGS_ON_SCREEN);
      return next;
    });
  }, []);

  // 2. Effect: Cleanup old pings (TTL)
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = Date.now();
      setPings(prev => prev.filter(p => now - p.timestamp < PING_TTL_MS));
      
      // If user's ping expired, clear the ref
      if (userPingRef.current) {
        const userStillActive = pings.some(p => p.id === userPingRef.current);
        if (!userStillActive) {
          // It might be cleared in the next render, but ref update is safe here
        }
      }
    }, CLEANUP_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [pings]);

  // 3. Effect: Simulate global activity (Mock Socket)
  useEffect(() => {
    const intervalId = setInterval(() => {
      // In a real app, this is where socket.on('ping', ...) would trigger
      const mockPing = generateMockPing();
      addPing(mockPing);
    }, MOCK_PING_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [addPing]);

  // 4. Handler: User clicks Ping
  const handlePing = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const coords: Coordinate = await getLocation();
      
      const newPing: Ping = {
        id: crypto.randomUUID(),
        coordinate: coords,
        timestamp: Date.now(),
        color: METRO_COLORS[0], // Cyan for user
        isUser: true,
        city: 'You'
      };

      userPingRef.current = newPing.id;
      
      // Add local ping immediately
      addPing(newPing);

      // In a real app: socket.emit('ping', newPing);

    } catch (err: any) {
      setError(err.message || 'Failed to get location');
    } finally {
      setIsLoading(false);
    }
  };

  const activeUserPing = pings.find(p => p.id === userPingRef.current);

  return (
    <div className="min-h-screen bg-metro-bg text-white font-sans selection:bg-metro-cyan selection:text-black flex flex-col">
      
      {/* Header */}
      <header className="p-6 border-b border-metro-border flex justify-between items-center bg-black/50 backdrop-blur-md sticky top-0 z-10">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white">
            Echo<span className="font-semibold text-metro-cyan">Map</span>
          </h1>
          <p className="text-gray-400 text-xs tracking-wider uppercase mt-1">Global Ephemeral Signal Network</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 border border-metro-border px-3 py-1 rounded-full">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          LIVE SOCKET CONNECTED
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-88px)]">
        
        {/* Left Control Panel */}
        <aside className="w-full lg:w-96 p-6 flex flex-col border-r border-metro-border bg-metro-bg z-0 overflow-y-auto">
          
          <div className="mb-8">
            <h2 className="text-xl font-normal mb-4 text-white">Broadcast Signal</h2>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Tap below to broadcast your location. Your coordinates are sent to the swarm and will exist for <strong>8 seconds</strong> before vanishing forever.
            </p>

            {error && (
              <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-4 mb-4 flex items-start gap-3 text-sm">
                <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <Button 
              onClick={handlePing} 
              disabled={isLoading}
              fullWidth
              className="h-16 text-lg shadow-[0_0_20px_rgba(0,188,242,0.3)] hover:shadow-[0_0_30px_rgba(0,188,242,0.5)]"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                  Acquiring Satellites...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Radar className="animate-pulse-fast" />
                  PING LOCATION
                </span>
              )}
            </Button>
          </div>

          <StatsPanel activeCount={pings.length} userPing={activeUserPing} />

          <div className="mt-auto pt-6 border-t border-metro-border">
            <div className="flex items-center gap-2 text-gray-400 mb-4">
              <Info size={16} />
              <span className="text-xs uppercase font-bold tracking-widest">Recent Activity</span>
            </div>
            
            <div className="space-y-3">
              {pings.slice(0, 5).map(ping => (
                <div key={ping.id} className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-300">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ping.color }}></div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-200">
                      {ping.isUser ? 'You' : 'Anonymous Signal'}
                    </div>
                    <div className="text-xs text-gray-600 font-mono">
                      {ping.coordinate.lat.toFixed(2)}, {ping.coordinate.lng.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">Just now</div>
                </div>
              ))}
              {pings.length === 0 && (
                <div className="text-gray-600 text-sm italic">Waiting for signals...</div>
              )}
            </div>
          </div>

        </aside>

        {/* Right Map Area */}
        <section className="flex-1 bg-black p-4 relative">
          <WorldMap pings={pings} />
          
          {/* Overlay Info */}
          <div className="absolute bottom-8 right-8 text-right pointer-events-none hidden md:block">
            <h3 className="text-4xl font-thin text-metro-border">WORLD VIEW</h3>
            <p className="text-metro-border text-sm">PROJECTION: MERCATOR</p>
          </div>
        </section>

      </main>
    </div>
  );
};

export default App;
