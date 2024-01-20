/**
 * @param {Date} date
 * @param {number} lat
 * @param {number} lng
 */
export function getPosition(date: Date, lat: number, lng: number): {
    azimuth: number;
    altitude: number;
};
/**
 *
 * @param {number} angle
 * @param {string} riseName
 * @param {string} setName
 */
export function addTime(angle: number, riseName: string, setName: string): void;
/**
 *  @typedef Times
 *  @prop {Date} solarNoon
 *  @prop {Date} nadir
 */
/**
 *
 * @param {Date} date
 * @param {number} lat
 * @param {number} lng
 * @param {number} [height]
 * @returns {Times}
 */
export function getTimes(date: Date, lat: number, lng: number, height?: number): Times;
/**
 *  @typedef MoonPosition
 *  @prop {number} azimuth
 *  @prop {number} altitude
 *  @prop {number} distance
 *  @prop {number} parallacticAngle
 */
/**
 *
 * @param {Date} date
 * @param {number} lat
 * @param {number} lng
 * @returns {MoonPosition}
 */
export function getMoonPosition(date: Date, lat: number, lng: number): MoonPosition;
/**
 *  @typedef MoonIllumination
 *  @prop {number} fraction
 *  @prop {number} phase
 *  @prop {number} angle
 */
/**
 * @param {Date} date
 * @returns {MoonIllumination}
 */
export function getMoonIllumination(date: Date): MoonIllumination;
/**
 *  @typedef MoonTimes
 *  @prop {Date} rise
 *  @prop {Date} set
 */
/**
 *
 * @param {Date} date
 * @param {number} lat
 * @param {number} lng
 * @param {boolean} inUTC
 * @returns {MoonTimes}
 */
export function getMoonTimes(date: Date, lat: number, lng: number, inUTC: boolean): MoonTimes;
/** @typedef SunTime
 * @prop {string} riseName
 * @prop {string} setName
 * @prop {number} angle
 */
export const times: {
    angle: number;
    riseName: string;
    setName: string;
}[];
export type Times = {
    solarNoon: Date;
    nadir: Date;
};
export type MoonPosition = {
    azimuth: number;
    altitude: number;
    distance: number;
    parallacticAngle: number;
};
export type MoonIllumination = {
    fraction: number;
    phase: number;
    angle: number;
};
export type MoonTimes = {
    rise: Date;
    set: Date;
};
export type SunTime = {
    riseName: string;
    setName: string;
    angle: number;
};
