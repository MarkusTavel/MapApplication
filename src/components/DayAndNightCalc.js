// https://planetcalc.com/300/

// http://jsfiddle.net/medmunds/RpHR4/

function solar_event(date, latitude, longitude, rising, zenith) {
    var year = date.getUTCFullYear(),
        month = date.getUTCMonth() + 1,
        day = date.getUTCDate();

    var floor = Math.floor,
        degtorad = function(deg) {
            return Math.PI * deg / 180;
        },
        radtodeg = function(rad) {
            return 180 * rad / Math.PI;
        },
        sin = function(deg) {
            return Math.sin(degtorad(deg));
        },
        cos = function(deg) {
            return Math.cos(degtorad(deg));
        },
        tan = function(deg) {
            return Math.tan(degtorad(deg));
        },
        asin = function(x) {
            return radtodeg(Math.asin(x));
        },
        acos = function(x) {
            return radtodeg(Math.acos(x));
        },
        atan = function(x) {
            return radtodeg(Math.atan(x));
        },
        modpos = function(x, m) {
            return ((x % m) + m) % m;
        };

    // 1. first calculate the day of the year
    var N1 = floor(275 * month / 9),
        N2 = floor((month + 9) / 12),
        N3 = (1 + floor((year - 4 * floor(year / 4) + 2) / 3)),
        N = N1 - (N2 * N3) + day - 30;

    // 2. convert the longitude to hour value and calculate an approximate time
    var lngHour = longitude / 15,
        t = N + (((rising ? 6 : 18) - lngHour) / 24);

    // 3. calculate the Sun's mean anomaly
    var M = (0.9856 * t) - 3.289;

    // 4. calculate the Sun's true longitude
    var L = M + (1.916 * sin(M)) + (0.020 * sin(2 * M)) + 282.634;
    L = modpos(L, 360); // NOTE: L potentially needs to be adjusted into the range [0,360) by adding/subtracting 360
    // 5a. calculate the Sun's right ascension
    var RA = atan(0.91764 * tan(L));
    RA = modpos(RA, 360); // NOTE: RA potentially needs to be adjusted into the range [0,360) by adding/subtracting 360
    // 5b. right ascension value needs to be in the same quadrant as L
    var Lquadrant = (floor(L / 90)) * 90,
        RAquadrant = (floor(RA / 90)) * 90;
    RA = RA + (Lquadrant - RAquadrant);

    // 5c. right ascension value needs to be converted into hours
    RA = RA / 15;

    // 6. calculate the Sun's declination
    var sinDec = 0.39782 * sin(L),
        cosDec = cos(asin(sinDec));

    // 7a. calculate the Sun's local hour angle
    var cosH = (cos(zenith) - (sinDec * sin(latitude))) / (cosDec * cos(latitude));
    var H;

    if (cosH > 1) {
        return undefined; // the sun never rises on this location (on the specified date)
    } else if (cosH < -1) {
        return undefined; // the sun never sets on this location (on the specified date)
    }

    // 7b. finish calculating H and convert into hours
    if (rising) {
        H = 360 - acos(cosH);
    } else {
        H = acos(cosH);
    }
    H = H / 15;

    // 8. calculate local mean time of rising/setting
    var T = H + RA - (0.06571 * t) - 6.622;

    // 9. adjust back to UTC
    var UT = T - lngHour;
    UT = modpos(UT, 24); // NOTE: UT potentially needs to be adjusted into the range [0,24) by adding/subtracting 24
    //console.log(UT);

    var hours = floor(UT),
        minutes = Math.round(60 * (UT - hours));
    var result = new Date(Date.UTC(year, month - 1, day, hours, minutes))
    return result;
}

var zeniths = {
    'official': 90.833333,
    // 90deg 50'
    'civil': 96,
    'nautical': 102,
    'astronomical': 108
};

function sunrise(date, latitude, longitude, type) {
    var zenith = zeniths[type] || zeniths['official'];
    return solar_event(date, latitude, longitude, true, zenith);
}

function sunset(date, latitude, longitude, type) {
    var zenith = zeniths[type] || zeniths['official'];
    return solar_event(date, latitude, longitude, false, zenith);
}

export function diff(start, end) {
    // https://stackoverflow.com/questions/10804042/calculate-time-difference-with-javascript
    start = start.split(":");
    end = end.split(":");
    if(Number(start[0]) > Number(end[0]) ) {
    var num = Number(start[0])
    var countTo = Number(end[0]);
    var count = 0;
    for (var i = 1; num != countTo;) {
        num = num + i
        if(num > 24) {
        num = 0
        }
        count++
    }
    var hours = count - 1;
    var startDate = new Date(0, 0, 0, start[0], start[1], 0);
    var endDate = new Date(0, 0, 0, end[0], end[1], 0);
    if(startDate.getMinutes() > endDate.getMinutes()) {
        var hours = count - 2;
        var diff = 60 - (startDate.getMinutes() - endDate.getMinutes());      
    } else {
        var diff = endDate.getMinutes() - startDate.getMinutes();      
    }
    var minutes = diff
    } else {
    var startDate = new Date(0, 0, 0, start[0], start[1], 0);
    var endDate = new Date(0, 0, 0, end[0], end[1], 0);
    var diff = endDate.getTime() - startDate.getTime();
    var hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * 1000 * 60 * 60;
    var minutes = Math.floor(diff / 1000 / 60);
    }
    var returnValue = (hours < 9 ? "0" : "") + hours + ":" + (minutes < 9 ? "0" : "") + minutes
    return returnValue;
}

// Tallinn example 23 april
// daylight 5.44 - 20.54, 15.12 hours
// sunrise 5.44
// sunset 20.54
// night time 00.57 - 1.40
// astronomical dawn 1.40
// astronomical twilight 1.40 - 3.49 and 22.52 - 00.57
// nautical twilight 3.49-4.56 and 21.44 - 25.52
// civil twilight 4.56 - 5.56 and 20.56 - 21.44

export function solar_events(date, latitude, longitude) {
    return {
        // calculate astronomical dawn and night time
        // astronomical twilight ending - start of night
        'twilight': sunset(date,latitude, longitude, 'astronomical'),
        'dawn': sunrise(date, latitude, longitude, 'astronomical'),
        // calculate sunrise and sunset
        'sunrise': sunrise(date, latitude, longitude, 'official'),
        'sunset': sunset(date, latitude, longitude, 'official'),
    };
}

