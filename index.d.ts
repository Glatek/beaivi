interface SunTimes {
  solarNoon: Date;
  nadir: Date;
}

interface MoonTimes {
  rise: Date;
  set: Date;
}

interface MoonPosition {
  azimuth: number;
  altitude: number;
  distance: number;
  parallacticAngle: number;
}

interface MoonIllumination {
  fraction: number;
  phase: number;
  angle: number;
}

export function addTime (angle: number, riseName: string, setName: string): void;
export function getTimes (date: Date, lat: number, lng: number, height: number): Times;

export function getMoonPosition (date: Date, lat: number, lng: number): MoonPosition;
export function getMoonIllumination (date: Date): MoonIllumination;
export function getMoonTimes (date: Date, lat: number, lng: number, inUTC: boolean): MoonTimes;

