import React from 'react';
import { ComposableMap, Geographies, Geography, Graticule } from 'react-simple-maps';
import { Ping, MAP_TOPOLOGY_URL } from '../types';
import { PingMarker } from './ui/PingMarker';

interface WorldMapProps {
  pings: Ping[];
}

const WorldMap: React.FC<WorldMapProps> = ({ pings }) => {
  return (
    <div className="w-full h-full bg-[#050505] relative">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 130, // Slightly zoomed out for aesthetic
        }}
        className="w-full h-full"
        style={{ width: "100%", height: "100%" }}
      >
        <Graticule stroke="#FFFFFF" strokeOpacity={0.03} />
        <Geographies geography={MAP_TOPOLOGY_URL}>
          {({ geographies }) =>
            Array.isArray(geographies) && geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#121212"
                stroke="#000000"
                strokeWidth={0.5}
                style={{
                  default: { outline: "none" },
                  hover: { fill: "#1A1A1A", outline: "none" },
                  pressed: { fill: "#000", outline: "none" },
                }}
              />
            ))
          }
        </Geographies>

        {pings.map((ping) => (
          <PingMarker key={ping.id} ping={ping} />
        ))}
      </ComposableMap>
      
      {/* Decorative Gradient Overlay from Left (blending sidebar) */}
      <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-[#050505] to-transparent pointer-events-none" />
    </div>
  );
};

export default WorldMap;