export interface Coordinate {
  lat: number;
  lng: number;
}

export interface Ping {
  id: string;
  coordinate: Coordinate;
  timestamp: number;
  color: string; // Metro color code
  isUser: boolean; // True if it's the current user
  city?: string; // Optional city name for display
}

export enum MapViewMode {
  GLOBAL = 'GLOBAL',
  FOCUSED = 'FOCUSED'
}

export interface SocketMessage {
  type: 'PING' | 'SYNC';
  payload: Ping;
}

export const MAP_TOPOLOGY_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";