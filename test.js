import test from 'ava';
import * as Beaivi from './index.js';

function near (val1, val2, margin) {
  return Math.abs(val1 - val2) < (margin || 1E-15);
}

const date = new Date('2013-03-05UTC');
const lat = 50.5;
const lng = 30.5;
const height = 2000;

const testTimes = {
  solarNoon: '2013-03-05T10:10:57Z',
  nadir: '2013-03-04T22:10:57Z',
  sunrise: '2013-03-05T04:34:56Z',
  sunset: '2013-03-05T15:46:57Z',
  sunriseEnd: '2013-03-05T04:38:19Z',
  sunsetStart: '2013-03-05T15:43:34Z',
  dawn: '2013-03-05T04:02:17Z',
  dusk: '2013-03-05T16:19:36Z',
  nauticalDawn: '2013-03-05T03:24:31Z',
  nauticalDusk: '2013-03-05T16:57:22Z',
  nightEnd: '2013-03-05T02:46:17Z',
  night: '2013-03-05T17:35:36Z',
  goldenHourEnd: '2013-03-05T05:19:01Z',
  goldenHour: '2013-03-05T15:02:52Z'
};

const heightTestTimes = {
  solarNoon: '2013-03-05T10:10:57Z',
  nadir: '2013-03-04T22:10:57Z',
  sunrise: '2013-03-05T04:25:07Z',
  sunset: '2013-03-05T15:56:46Z'
};

test('getPosition returns azimuth and altitude for the given time and location', t => {
  var sunPos = Beaivi.getPosition(date, lat, lng);

  t.truthy(near(sunPos.azimuth, -2.5003175907168385), 'azimuth');
  t.truthy(near(sunPos.altitude, -0.7000406838781611), 'altitude');
});

test('getTimes returns sun phases for the given date and location', t => {
  const times = Beaivi.getTimes(date, lat, lng);

  Object.keys(testTimes).forEach(testTime => {
    t.is(new Date(testTimes[testTime]).toUTCString(), times[testTime].toUTCString(), testTime);
  });
});

test('getTimes adjusts sun phases when additionally given the observer height', t => {
  const times = Beaivi.getTimes(date, lat, lng, height);

  Object.keys(heightTestTimes).forEach(testTime => {
    t.is(new Date(heightTestTimes[testTime]).toUTCString(), times[testTime].toUTCString(), testTime);
  });
});

test('getMoonPosition returns moon position data given time and location', t => {
  const moonPos = Beaivi.getMoonPosition(date, lat, lng);

  t.truthy(near(moonPos.azimuth, -0.9783999522438226), 'azimuth');
  t.truthy(near(moonPos.altitude, 0.014551482243892251), 'altitude');
  t.truthy(near(moonPos.distance, 364121.37256256194), 'distance');
});

test('getMoonIllumination returns fraction and angle of moon\'s illuminated limb and phase', t => {
  const moonIllum = Beaivi.getMoonIllumination(date);

  t.truthy(near(moonIllum.fraction, 0.4848068202456373), 'fraction');
  t.truthy(near(moonIllum.phase, 0.7548368838538762), 'phase');
  t.truthy(near(moonIllum.angle, 1.6732942678578346), 'angle');
});

test('getMoonTimes returns moon rise and set times', t => {
  const moonTimes = Beaivi.getMoonTimes(new Date('2013-03-04UTC'), lat, lng, true);

  t.is(moonTimes.rise.toUTCString(), 'Mon, 04 Mar 2013 23:54:29 GMT');
  t.is(moonTimes.set.toUTCString(), 'Mon, 04 Mar 2013 07:47:58 GMT');
});
