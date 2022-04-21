// http://jsfiddle.net/medmunds/RpHR4/

function solar_event(date, latitude, longitude, rising, zenith) {
    
    latitude = "37.761";
    longitude = "-122.402";
    date = new Date().getDate;

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
    console.log(UT);

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

function solar_events(date, latitude, longitude) {
    return {
        'dawn': sunrise(date, latitude, longitude, 'civil'),
        'sunrise': sunrise(date, latitude, longitude, 'official'),
        'sunset': sunset(date, latitude, longitude, 'official'),
        'dusk': sunset(date, latitude, longitude, 'civil')
    };
}

function output(){

    let result = "safasfas";
    document.getElementById("sun").innerHTML = result;
}

///////////////////////////////////////////////
// Test harness
/*('form').submit(function(event) {
    event.preventDefault();
    var lat = parseFloat(('#lat').val()),
        lon = parseFloat(('#lon').val()),
        datestr = ('#date').val(),
        date = datestr ? new Date(datestr) : new Date();

    var result = lat + ", " + lon + ": " + date.toUTCString() + '<br>';

    var data = solar_events(date, lat, lon);
    let k = 0;
    for (k in data) {
        result += '<dt>' + k + '</dt><dd>';
        if (data[k]) result += data[k].toUTCString();
        else result += 'none';
        result += '</dd>\n';
    }

    console.log(result);

    ('#output').html(result);
    return false;
});*/