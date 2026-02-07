import { Ping } from './types';

export const PING_TTL_MS = 8000; // Pings disappear after 8 seconds
export const CLEANUP_INTERVAL_MS = 1000;
export const MOCK_PING_INTERVAL_MS = 2500; // Simulate global activity every 2.5s

export const METRO_COLORS = [
  '#00BCF2', // Cyan
  '#D13438', // Magenta
  '#A4C400', // Lime
  '#00B294', // Teal
  '#881798', // Purple
  '#FFB900', // Gold
  '#FF4343', // Red
];

export const MAX_PINGS_ON_SCREEN = 50; // Performance cap

export const INITIAL_PING_STATE: Ping[] = [];
