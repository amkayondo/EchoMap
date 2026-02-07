import React, { useMemo } from 'react';
import { ComposableMap, Geographies, Geography, Graticule } from 'react-simple-maps';
import { Ping, MAP_TOPOLOGY_URL } from '../types';
import { PingMarker } from './ui/PingMarker';

interface WorldMapProps {
  pings: Ping[];
}

const WorldMap: React.FC<WorldMapProps> = ({ pings }) => {
  // Use useMemo to prevent map re-renders when only pings change
  // However, ComposableMap is generally performant.
  
  return (
    <div className="w-full h-full bg-[#050505] relative overflow-hidden rounded-sm border border-metro-border">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-metro-card/20 to-black pointer-events-none" />
      
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 140,
        }}
        className="w-full h-full"
        style={{ width: "100%", height: "100%" }}
      >
        <Graticule stroke="#1a1a1a" />
        <Geographies geography={MAP_TOPOLOGY_URL}>
          {({ geographies }) =>
            Array.isArray(geographies) && geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#151515"
                stroke="#2a2a2a"
                strokeWidth={0.5}
                style={{
                  default: { outline: "none" },
                  hover: { fill: "#1f1f1f", outline: "none" },
                  pressed: { fill: "#111", outline: "none" },
                }}
              />
            ))
          }
        </Geographies>

        {pings.map((ping) => (
          <PingMarker key={ping.id} ping={ping} />
        ))}
      </ComposableMap>
      
      {/* Aesthetic Overlay Lines (Metro Style) */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-metro-cyan via-metro-magenta to-metro-lime opacity-30" />
    </div>
  );
};

export default WorldMap;