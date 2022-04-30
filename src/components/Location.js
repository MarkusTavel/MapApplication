// https://stackoverflow.com/questions/37523872/converting-coordinates-from-epsg-3857-to-4326

var e = 2.7182818284;
var X = 20037508.34;

export class Location {
    constructor(latitude, longitude){
        this.latitude = latitude;
        this.longitude = longitude;
    }
      
    transform(latitude3857, longitude3857){
        // Transform longitude ESPG:3857 to ESPG 4326
        longitude3857 = (longitude3857 * 180) /X;
        this.longitude = longitude3857;

        // Transform latitude ESPG:3857 to ESPG 4326
        var latitude4326 = latitude3857 / (X/180);
        const exponent = (Math.PI /180) * latitude4326;    
        latitude4326 = Math.atan(Math.pow(e, exponent));
        latitude4326 = latitude4326 / (Math.PI / 360);
        this.latitude = latitude4326 - 90;
    }

    getLatitude(){
        return this.latitude;
    }

    getLongitude(){
        return this.longitude;
    }
}