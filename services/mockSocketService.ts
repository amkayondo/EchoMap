import { Ping } from '../types';
import { METRO_COLORS } from '../constants';

// In a real app, this would use socket.io-client or partykit
// to broadcast the user's ping to a server and receive others.

export const generateMockPing = (): Ping => {
  // Generate random coordinates (roughly constrained to populated areas logic omitted for simplicity)
  const lat = (Math.random() * 140) - 70; // Avoid extreme poles
  const lng = (Math.random() * 360) - 180;

  return {
    id: crypto.randomUUID(),
    coordinate: { lat, lng },
    timestamp: Date.now(),
    color: METRO_COLORS[Math.floor(Math.random() * METRO_COLORS.length)],
    isUser: false,
    city: "Anonymous User"
  };
};
