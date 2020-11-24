// shortcuts for easier to read formulas

const TAU = Math.PI * 2;
const rad = Math.PI / 180;

// sun calculations are based on http://aa.quae.nl/en/reken/zonpositie.html formulas
// date/time constants and conversions

const dayMs = 1000 * 60 * 60 * 24;
const J1970 = 2440588;
const J2000 = 2451545;

function toJulian (date) {
  return (date.valueOf() / dayMs) - 0.5 + J1970;
}

function fromJulian (j) {
  return new Date((j + 0.5 - J1970) * dayMs);
}

function toDays (date) {
  return toJulian(date) - J2000;
}

// General calculations for position.

const e = rad * 23.4397; // Obliquity of the Earth.

function rightAscension (l, b) {
  const { sin, cos, tan, atan2 } = Math;

  return atan2(sin(l) * cos(e) - tan(b) * sin(e), cos(l));
}
function declination (l, b) {
  const { asin, sin, cos } = Math;

  return asin(sin(b) * cos(e) + cos(b) * sin(e) * sin(l));
}

function azimuth (H, phi, dec) {
  const { atan2, sin, cos, tan } = Math;

  return atan2(sin(H), cos(H) * sin(phi) - tan(dec) * cos(phi));
}
function altitude (H, phi, dec) {
  const { asin, sin, cos } = Math;

  return asin(sin(phi) * sin(dec) + cos(phi) * cos(dec) * cos(H));
}

function siderealTime (d, lw) {
  return rad * (280.16 + 360.9856235 * d) - lw;
}

function astroRefraction (h) {
  const { tan } = Math;
  // the following formula works for positive altitudes only.

  if (h < 0) {
    h = 0;
  } // if h = -0.08901179 a div/0 would occur.

  // formula 16.4 of "Astronomical Algorithms" 2nd edition by Jean Meeus (Willmann-Bell, Richmond) 1998.
  // 1.02 / tan(h + 10.26 / (h + 5.10)) h in degrees, result in arc minutes -> converted to rad:
  return 0.0002967 / tan(h + 0.00312536 / (h + 0.08901179));
}

// general sun calculations

function solarMeanAnomaly (d) {
  return rad * (357.5291 + 0.98560028 * d);
}

function eclipticLongitude (M) {
  const { sin, PI } = Math;

  const C = rad * (1.9148 * sin(M) + 0.02 * sin(2 * M) + 0.0003 * sin(3 * M)); // equation of center
  const P = rad * 102.9372; // perihelion of the Earth

  return M + C + P + PI;
}

function sunCoords (d) {
  const M = solarMeanAnomaly(d);
  const L = eclipticLongitude(M);

  return {
    dec: declination(L, 0),
    ra: rightAscension(L, 0)
  };
}

// calculates sun position for a given date and latitude/longitude

/**
 *
 * @param {Date} date
 * @param {number} lat
 * @param {number} lng
 */
export function getPosition (date, lat, lng) {
  var lw = rad * -lng
    , phi = rad * lat
    , d = toDays(date)

    , c = sunCoords(d)
    , H = siderealTime(d, lw) - c.ra;

  return {
    azimuth: azimuth(H, phi, c.dec),
    altitude: altitude(H, phi, c.dec)
  };
}

// sun times configuration (angle, morning name, evening name)

export const times = [
  [-0.833, 'sunrise', 'sunset'],
  [-0.3, 'sunriseEnd', 'sunsetStart'],
  [-6, 'dawn', 'dusk'],
  [-12, 'nauticalDawn', 'nauticalDusk'],
  [-18, 'nightEnd', 'night'],
  [6, 'goldenHourEnd', 'goldenHour']
];

// adds a custom time to the times config
/**
 *
 * @param {number} angle
 * @param {string} riseName
 * @param {string} setName
 */
export function addTime (angle, riseName, setName) {
  times.push([angle, riseName, setName]);
}

// calculations for sun times

const J0 = 0.0009;

function julianCycle (d, lw) {
  const { round } = Math;

  return round(d - J0 - (lw / TAU));
}

function approxTransit (Ht, lw, n) {
  return J0 + (Ht + lw) / TAU + n;
}

function solarTransitJ (ds, M, L) {
  const { sin } = Math;

  return J2000 + ds + 0.0053 * sin(M) - 0.0069 * sin(2 * L);
}

function hourAngle (h, phi, d) {
  const { sin, cos, acos } = Math;

  return acos((sin(h) - sin(phi) * sin(d)) / (cos(phi) * cos(d)));
}

function observerAngle (height) {
  return -2.076 * Math.sqrt(height) / 60;
}

// returns set time for the given sun altitude
function getSetJ (h, lw, phi, dec, n, M, L) {
  var w = hourAngle(h, phi, dec)
    , a = approxTransit(w, lw, n);

  return solarTransitJ(a, M, L);
}

// calculates sun times for a given date, latitude/longitude, and, optionally,
// the observer height (in meters) relative to the horizon

export function getTimes (date, lat, lng, height) {
  height = height || 0;

  const lw = rad * -lng;
  const phi = rad * lat;

  const dh = observerAngle(height);
  const d = toDays(date);
  const n = julianCycle(d, lw);
  const ds = approxTransit(0, lw, n);
  const M = solarMeanAnomaly(ds);
  const L = eclipticLongitude(M);
  const dec = declination(L, 0);
  const Jnoon = solarTransitJ(ds, M, L);

  let time;
  let h0;
  let Jset;
  let Jrise;

  const result = {
    solarNoon: fromJulian(Jnoon),
    nadir: fromJulian(Jnoon - 0.5)
  };

  for (let i = 0, len = times.length; i < len; i += 1) {
    time = times[i];
    h0 = (time[0] + dh) * rad;

    Jset = getSetJ(h0, lw, phi, dec, n, M, L);
    Jrise = Jnoon - (Jset - Jnoon);

    result[time[1]] = fromJulian(Jrise);
    result[time[2]] = fromJulian(Jset);
  }

  return result;
}

// moon calculations, based on http://aa.quae.nl/en/reken/hemelpositie.html formulas

function moonCoords (d) { // geocentric ecliptic coordinates of the moon
  const { sin, cos } = Math;

  var L = rad * (218.316 + 13.176396 * d) // ecliptic longitude
    , M = rad * (134.963 + 13.064993 * d) // mean anomaly
    , F = rad * (93.272 + 13.229350 * d) // mean distance

    , l = L + rad * 6.289 * sin(M) // longitude
    , b = rad * 5.128 * sin(F) // latitude
    , dt = 385001 - 20905 * cos(M); // distance to the moon in km

  return {
    ra: rightAscension(l, b),
    dec: declination(l, b),
    dist: dt
  };
}

/**
 *
 * @param {Date} date
 * @param {number} lat
 * @param {number} lng
 */
export function getMoonPosition (date, lat, lng) {
  const { atan2, sin, tan, cos } = Math;

  const lw = rad * -lng;
  const phi = rad * lat;
  const d = toDays(date);

  const c = moonCoords(d);
  const H = siderealTime(d, lw) - c.ra;
  // formula 14.1 of "Astronomical Algorithms" 2nd edition by Jean Meeus (Willmann-Bell, Richmond) 1998.
  const pa = atan2(sin(H), tan(phi) * cos(c.dec) - sin(c.dec) * cos(H));

  let h = altitude(H, phi, c.dec);

  h += astroRefraction(h); // altitude correction for refraction

  return {
    azimuth: azimuth(H, phi, c.dec),
    altitude: h,
    distance: c.dist,
    parallacticAngle: pa
  };
}

// calculations for illumination parameters of the moon,
// based on http://idlastro.gsfc.nasa.gov/ftp/pro/astro/mphase.pro formulas and
// Chapter 48 of "Astronomical Algorithms" 2nd edition by Jean Meeus (Willmann-Bell, Richmond) 1998.

export function getMoonIllumination (date) {
  const { acos, sin, cos, atan2 } = Math;

  var d = toDays(date || new Date())
    , s = sunCoords(d)
    , m = moonCoords(d)

    , sdist = 149598000 // distance from Earth to Sun in km

    , phi = acos(sin(s.dec) * sin(m.dec) + cos(s.dec) * cos(m.dec) * cos(s.ra - m.ra))
    , inc = atan2(sdist * sin(phi), m.dist - sdist * cos(phi))
    , angle = atan2(cos(s.dec) * sin(s.ra - m.ra), sin(s.dec) * cos(m.dec) -
                cos(s.dec) * sin(m.dec) * cos(s.ra - m.ra));

  return {
    fraction: (1 + cos(inc)) / 2,
    phase: 0.5 + 0.5 * inc * (angle < 0 ? -1 : 1) / Math.PI,
    angle: angle
  };
}

function hoursLater (date, h) {
  return new Date(date.valueOf() + h * dayMs / 24);
}

// calculations for moon rise/set times are based on http://www.stargazing.net/kepler/moonrise.html article

export function getMoonTimes (date, lat, lng, inUTC) {
  const { sqrt, abs } = Math;
  const t = new Date(date);

  if (inUTC) {
    t.setUTCHours(0, 0, 0, 0);
  } else {
    t.setHours(0, 0, 0, 0);
  }

  const hc = 0.133 * rad;

  let h0 = getMoonPosition(t, lat, lng).altitude - hc;
  let h1;
  let h2;
  let rise;
  let set;
  let a;
  let b;
  let xe;
  let ye;
  let d;
  let roots;
  let x1;
  let x2;
  let dx;

  // go in 2-hour chunks, each time seeing if a 3-point quadratic curve crosses zero (which means rise or set)
  for (let i = 1; i <= 24; i += 2) {
    h1 = getMoonPosition(hoursLater(t, i), lat, lng).altitude - hc;
    h2 = getMoonPosition(hoursLater(t, i + 1), lat, lng).altitude - hc;

    a = (h0 + h2) / 2 - h1;
    b = (h2 - h0) / 2;
    xe = -b / (2 * a);
    ye = (a * xe + b) * xe + h1;
    d = b * b - 4 * a * h1;
    roots = 0;

    if (d >= 0) {
      dx = sqrt(d) / (abs(a) * 2);
      x1 = xe - dx;
      x2 = xe + dx;
      if (abs(x1) <= 1) {
        roots++;
      }
      if (abs(x2) <= 1) {
        roots++;
      }
      if (x1 < -1) {
        x1 = x2;
      }
    }

    if (roots === 1) {
      if (h0 < 0) {
        rise = i + x1;
      } else {
        set = i + x1;
      }
    } else if (roots === 2) {
      rise = i + (ye < 0 ? x2 : x1);
      set = i + (ye < 0 ? x1 : x2);
    }

    if (rise && set) {
      break;
    }

    h0 = h2;
  }

  const result = {};

  if (rise) {
    result.rise = hoursLater(t, rise);
  }
  if (set) {
    result.set = hoursLater(t, set);
  }

  if (!rise && !set) {
    result[ye > 0 ? 'alwaysUp' : 'alwaysDown'] = true;
  }

  return result;
}
