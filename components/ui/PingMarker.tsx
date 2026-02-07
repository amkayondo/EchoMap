import React from 'react';
import { Marker } from 'react-simple-maps';
import { motion } from 'framer-motion';
import { Ping } from '../../types';

interface PingMarkerProps {
  ping: Ping;
}

export const PingMarker: React.FC<PingMarkerProps> = ({ ping }) => {
  return (
    <Marker coordinates={[ping.coordinate.lng, ping.coordinate.lat]}>
      <g>
        {/* Pulsing Ripple Effect */}
        <motion.circle
          r={4}
          fill="none"
          stroke={ping.color}
          strokeWidth={2}
          initial={{ r: 4, opacity: 1, strokeWidth: 2 }}
          animate={{
            r: 25,
            opacity: 0,
            strokeWidth: 0,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
        
        {/* Secondary Ripple for User */}
        {ping.isUser && (
           <motion.circle
           r={4}
           fill="none"
           stroke={ping.color}
           strokeWidth={1}
           initial={{ r: 4, opacity: 0.8 }}
           animate={{
             r: 15,
             opacity: 0,
           }}
           transition={{
             duration: 1.5,
             repeat: Infinity,
             ease: "easeOut",
             delay: 0.5
           }}
         />
        )}

        {/* Core Dot */}
        <motion.circle
          r={3}
          fill={ping.color}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
        
        {/* Label (Only for user for clarity) */}
        {ping.isUser && (
          <text
            textAnchor="middle"
            y={-15}
            style={{
              fontFamily: "Segoe UI, sans-serif",
              fontSize: "10px",
              fill: "#fff",
              fontWeight: 600,
              textShadow: "0px 1px 3px rgba(0,0,0,0.8)"
            }}
          >
            YOU
          </text>
        )}
      </g>
    </Marker>
  );
};
