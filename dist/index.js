const v = Math.PI * 2, d = Math.PI / 180, b = 1e3 * 60 * 60 * 24, z = 2440588, E = 2451545;
function V(t) {
  return t.valueOf() / b - 0.5 + z;
}
function P(t) {
  return new Date((t + 0.5 - z) * b);
}
function C(t) {
  return V(t) - E;
}
const A = d * 23.4397;
function U(t, n) {
  const { sin: e, cos: s, tan: o, atan2: a } = Math;
  return a(e(t) * s(A) - o(n) * e(A), s(t));
}
function k(t, n) {
  const { asin: e, sin: s, cos: o } = Math;
  return e(s(n) * o(A) + o(n) * s(A) * s(t));
}
function q(t, n, e) {
  const { atan2: s, sin: o, cos: a, tan: c } = Math;
  return s(o(t), a(t) * o(n) - c(e) * a(n));
}
function O(t, n, e) {
  const { asin: s, sin: o, cos: a } = Math;
  return s(o(n) * o(e) + a(n) * a(e) * a(t));
}
function S(t, n) {
  return d * (280.16 + 360.9856235 * t) - n;
}
function W(t) {
  let n = t;
  const { tan: e } = Math;
  return n < 0 && (n = 0), 2967e-7 / e(n + 312536e-8 / (n + 0.08901179));
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
    dec: k(e, 0),
    ra: U(e, 0)
  };
}
function $(t, n, e) {
  const s = d * -e, o = d * n, a = C(t), c = R(a), i = S(a, s) - c.ra;
  return {
    azimuth: q(i, o, c.dec),
    altitude: O(i, o, c.dec)
  };
}
const L = [
  { angle: -0.833, riseName: "sunrise", setName: "sunset" },
  { angle: -0.3, riseName: "sunriseEnd", setName: "sunsetStart" },
  { angle: -6, riseName: "dawn", setName: "dusk" },
  { angle: -12, riseName: "nauticalDawn", setName: "nauticalDusk" },
  { angle: -18, riseName: "nightEnd", setName: "night" },
  { angle: 6, riseName: "goldenHourEnd", setName: "goldenHour" }
];
function tt(t, n, e) {
  L.push({ angle: t, riseName: n, setName: e });
}
const B = 9e-4;
function X(t, n) {
  const { round: e } = Math;
  return e(t - B - n / v);
}
function G(t, n, e) {
  return B + (t + n) / v + e;
}
function K(t, n, e) {
  const { sin: s } = Math;
  return E + t + 53e-4 * s(n) - 69e-4 * s(2 * e);
}
function Y(t, n, e) {
  const { sin: s, cos: o, acos: a } = Math;
  return a((s(t) - s(n) * s(e)) / (o(n) * o(e)));
}
function Z(t) {
  return -2.076 * Math.sqrt(t) / 60;
}
function _(t, n, e, s, o, a, c) {
  const i = Y(t, e, s), r = G(i, n, o);
  return K(r, a, c);
}
function nt(t, n, e, s = 0) {
  const o = d * -e, a = d * n, c = Z(s), i = C(t), r = X(i, o), h = G(0, o, r), u = j(h), l = F(u), g = k(l, 0), f = K(h, u, l);
  let M, w, p, T;
  const N = {
    solarNoon: P(f),
    nadir: P(f - 0.5)
  };
  for (let m = 0, D = L.length; m < D; m += 1)
    M = L[m], w = (M.angle + c) * d, p = _(w, o, a, g, r, u, l), T = f - (p - f), N[M.riseName] = P(T), N[M.setName] = P(p);
  return N;
}
function Q(t) {
  const { sin: n, cos: e } = Math, s = d * (218.316 + 13.176396 * t), o = d * (134.963 + 13.064993 * t), a = d * (93.272 + 13.22935 * t), c = s + d * 6.289 * n(o), i = d * 5.128 * n(a), r = 385001 - 20905 * e(o);
  return {
    ra: U(c, i),
    dec: k(c, i),
    dist: r
  };
}
function I(t, n, e) {
  const { atan2: s, sin: o, tan: a, cos: c } = Math, i = d * -e, r = d * n, h = C(t), u = Q(h), l = S(h, i) - u.ra, g = s(o(l), a(r) * c(u.dec) - o(u.dec) * c(l));
  let f = O(l, r, u.dec);
  return f += W(f), {
    azimuth: q(l, r, u.dec),
    altitude: f,
    distance: u.dist,
    parallacticAngle: g
  };
}
function et(t) {
  const { acos: n, sin: e, cos: s, atan2: o } = Math, a = C(t || /* @__PURE__ */ new Date()), c = R(a), i = Q(a), r = 149598e3, h = n(
    e(c.dec) * e(i.dec) + s(c.dec) * s(i.dec) * s(c.ra - i.ra)
  ), u = o(r * e(h), i.dist - r * s(h)), l = o(
    s(c.dec) * e(c.ra - i.ra),
    e(c.dec) * s(i.dec) - s(c.dec) * e(i.dec) * s(c.ra - i.ra)
  );
  return {
    fraction: (1 + s(u)) / 2,
    phase: 0.5 + 0.5 * u * (l < 0 ? -1 : 1) / Math.PI,
    angle: l
  };
}
function x(t, n) {
  return new Date(t.valueOf() + n * b / 24);
}
function st(t, n, e, s) {
  const { sqrt: o, abs: a } = Math, c = new Date(t);
  s ? c.setUTCHours(0, 0, 0, 0) : c.setHours(0, 0, 0, 0);
  const i = 0.133 * d;
  let r = I(c, n, e).altitude - i, h, u, l, g, f, M, w, p, T, N, m, D, H;
  for (let J = 1; J <= 24 && (h = I(x(c, J), n, e).altitude - i, u = I(x(c, J + 1), n, e).altitude - i, f = (r + u) / 2 - h, M = (u - r) / 2, w = -M / (2 * f), p = (f * w + M) * w + h, T = M * M - 4 * f * h, N = 0, T >= 0 && (H = o(T) / (a(f) * 2), m = w - H, D = w + H, a(m) <= 1 && N++, a(D) <= 1 && N++, m < -1 && (m = D)), N === 1 ? r < 0 ? l = J + m : g = J + m : N === 2 && (l = J + (p < 0 ? D : m), g = J + (p < 0 ? m : D)), !(l && g)); J += 2)
    r = u;
  const y = {};
  return l && (y.rise = x(c, l)), g && (y.set = x(c, g)), !l && !g && (y[p > 0 ? "alwaysUp" : "alwaysDown"] = !0), y;
}
export {
  tt as addTime,
  et as getMoonIllumination,
  I as getMoonPosition,
  st as getMoonTimes,
  $ as getPosition,
  nt as getTimes,
  L as times
};
