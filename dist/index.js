const k = Math.PI * 2, d = Math.PI / 180, L = 1e3 * 60 * 60 * 24, z = 2440588, E = 2451545;
function V(t) {
  return t.valueOf() / L - 0.5 + z;
}
function y(t) {
  return new Date((t + 0.5 - z) * L);
}
function A(t) {
  return V(t) - E;
}
const x = d * 23.4397;
function U(t, n) {
  const { sin: e, cos: s, tan: o, atan2: c } = Math;
  return c(e(t) * s(x) - o(n) * e(x), s(t));
}
function b(t, n) {
  const { asin: e, sin: s, cos: o } = Math;
  return e(s(n) * o(x) + o(n) * s(x) * s(t));
}
function q(t, n, e) {
  const { atan2: s, sin: o, cos: c, tan: a } = Math;
  return s(o(t), c(t) * o(n) - a(e) * c(n));
}
function O(t, n, e) {
  const { asin: s, sin: o, cos: c } = Math;
  return s(o(n) * o(e) + c(n) * c(e) * c(t));
}
function S(t, n) {
  return d * (280.16 + 360.9856235 * t) - n;
}
function W(t) {
  const { tan: n } = Math;
  return t < 0 && (t = 0), 2967e-7 / n(t + 312536e-8 / (t + 0.08901179));
}
function j(t) {
  return d * (357.5291 + 0.98560028 * t);
}
function F(t) {
  const { sin: n, PI: e } = Math, s = d * (1.9148 * n(t) + 0.02 * n(2 * t) + 3e-4 * n(3 * t)), o = d * 102.9372;
  return t + s + o + e;
}
function R(t) {
  const n = j(t), e = F(n);
  return {
    dec: b(e, 0),
    ra: U(e, 0)
  };
}
function $(t, n, e) {
  var s = d * -e, o = d * n, c = A(t), a = R(c), r = S(c, s) - a.ra;
  return {
    azimuth: q(r, o, a.dec),
    altitude: O(r, o, a.dec)
  };
}
const I = [
  { angle: -0.833, riseName: "sunrise", setName: "sunset" },
  { angle: -0.3, riseName: "sunriseEnd", setName: "sunsetStart" },
  { angle: -6, riseName: "dawn", setName: "dusk" },
  { angle: -12, riseName: "nauticalDawn", setName: "nauticalDusk" },
  { angle: -18, riseName: "nightEnd", setName: "night" },
  { angle: 6, riseName: "goldenHourEnd", setName: "goldenHour" }
];
function tt(t, n, e) {
  I.push({ angle: t, riseName: n, setName: e });
}
const B = 9e-4;
function X(t, n) {
  const { round: e } = Math;
  return e(t - B - n / k);
}
function G(t, n, e) {
  return B + (t + n) / k + e;
}
function K(t, n, e) {
  const { sin: s } = Math;
  return E + t + 53e-4 * s(n) - 69e-4 * s(2 * e);
}
function Y(t, n, e) {
  const { sin: s, cos: o, acos: c } = Math;
  return c((s(t) - s(n) * s(e)) / (o(n) * o(e)));
}
function Z(t) {
  return -2.076 * Math.sqrt(t) / 60;
}
function _(t, n, e, s, o, c, a) {
  var r = Y(t, e, s), i = G(r, n, o);
  return K(i, c, a);
}
function nt(t, n, e, s) {
  s = s || 0;
  const o = d * -e, c = d * n, a = Z(s), r = A(t), i = X(r, o), h = G(0, o, i), u = j(h), l = F(u), M = b(l, 0), f = K(h, u, l);
  let g, w, p, T;
  const N = {
    solarNoon: y(f),
    nadir: y(f - 0.5)
  };
  for (let m = 0, D = I.length; m < D; m += 1)
    g = I[m], w = (g.angle + a) * d, p = _(w, o, c, M, i, u, l), T = f - (p - f), N[g.riseName] = y(T), N[g.setName] = y(p);
  return N;
}
function Q(t) {
  const { sin: n, cos: e } = Math;
  var s = d * (218.316 + 13.176396 * t), o = d * (134.963 + 13.064993 * t), c = d * (93.272 + 13.22935 * t), a = s + d * 6.289 * n(o), r = d * 5.128 * n(c), i = 385001 - 20905 * e(o);
  return {
    ra: U(a, r),
    dec: b(a, r),
    dist: i
  };
}
function H(t, n, e) {
  const { atan2: s, sin: o, tan: c, cos: a } = Math, r = d * -e, i = d * n, h = A(t), u = Q(h), l = S(h, r) - u.ra, M = s(o(l), c(i) * a(u.dec) - o(u.dec) * a(l));
  let f = O(l, i, u.dec);
  return f += W(f), {
    azimuth: q(l, i, u.dec),
    altitude: f,
    distance: u.dist,
    parallacticAngle: M
  };
}
function et(t) {
  const { acos: n, sin: e, cos: s, atan2: o } = Math;
  var c = A(t || /* @__PURE__ */ new Date()), a = R(c), r = Q(c), i = 149598e3, h = n(
    e(a.dec) * e(r.dec) + s(a.dec) * s(r.dec) * s(a.ra - r.ra)
  ), u = o(i * e(h), r.dist - i * s(h)), l = o(
    s(a.dec) * e(a.ra - r.ra),
    e(a.dec) * s(r.dec) - s(a.dec) * e(r.dec) * s(a.ra - r.ra)
  );
  return {
    fraction: (1 + s(u)) / 2,
    phase: 0.5 + 0.5 * u * (l < 0 ? -1 : 1) / Math.PI,
    angle: l
  };
}
function P(t, n) {
  return new Date(t.valueOf() + n * L / 24);
}
function st(t, n, e, s) {
  const { sqrt: o, abs: c } = Math, a = new Date(t);
  s ? a.setUTCHours(0, 0, 0, 0) : a.setHours(0, 0, 0, 0);
  const r = 0.133 * d;
  let i = H(a, n, e).altitude - r, h, u, l, M, f, g, w, p, T, N, m, D, C;
  for (let J = 1; J <= 24 && (h = H(P(a, J), n, e).altitude - r, u = H(P(a, J + 1), n, e).altitude - r, f = (i + u) / 2 - h, g = (u - i) / 2, w = -g / (2 * f), p = (f * w + g) * w + h, T = g * g - 4 * f * h, N = 0, T >= 0 && (C = o(T) / (c(f) * 2), m = w - C, D = w + C, c(m) <= 1 && N++, c(D) <= 1 && N++, m < -1 && (m = D)), N === 1 ? i < 0 ? l = J + m : M = J + m : N === 2 && (l = J + (p < 0 ? D : m), M = J + (p < 0 ? m : D)), !(l && M)); J += 2)
    i = u;
  const v = {};
  return l && (v.rise = P(a, l)), M && (v.set = P(a, M)), !l && !M && (v[p > 0 ? "alwaysUp" : "alwaysDown"] = !0), v;
}
export {
  tt as addTime,
  et as getMoonIllumination,
  H as getMoonPosition,
  st as getMoonTimes,
  $ as getPosition,
  nt as getTimes,
  I as times
};
