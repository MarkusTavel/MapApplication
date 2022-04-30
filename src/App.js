import React from 'react';
import {
  interaction,layer,custom,control,
  Interactions,Overlays,Controls,
  Layers,Overlay,Util
} from "react-openlayers";
import './App.css';
import  {Location} from './components/Location';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import * as DayAndNightCalc from './components/DayAndNightCalc';
import Map from "ol/map";
import View from "ol/view";
import LayerTile from "ol/layer/tile";
import XYZ from 'ol/source/xyz';

import VectorLayer from 'ol/layer/vectortile';
import VectorSource from 'ol/source/vector';
import GeoJSON from 'ol/format/geojson'
//import ol_source_DayNight, * as DayNight from './components/DayNight'

import Circle from 'ol/style/circle';
import Fill from 'ol/style/fill';
import Stroke from 'ol/style/stroke';
import Style from 'ol/style/style';
import Interaction from 'ol/interaction/interaction';

const baseLayer = new LayerTile({
  source: new XYZ ({ 
    url: 'http://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}',
  }),
  minZoom: 3,
});

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state =  {
      startDate: new Date(),
      center: [0,0],
      zoom: 3,
      latitude: 0,
      longitude: 0,
    };
    // Create new map object
    this.olmap = new Map({
      target: 'null',
      layers: [baseLayer],
      view: new View({ 
        center: this.state.center,
        zoom: this.state.zoom,  
        minZoom: 3,
      }),
      // Gives error when importing
      // interactions: interaction,
      /*controls: DefaultControls().extend([
        new ZoomSlider(),
        new MousePosition(),
        new ScaleLine(),
        new OverviewMap()
    ]),*/
    });
    // Event binding
    this.handleChange = this.handleChange.bind(this);
    this.calculation = this.calculation.bind(this);
    this.resetMap = this.resetMap.bind(this);
    this.toggleNight = this.toggleNight.bind(this);
    this.handleLatitude = this.handleLatitude.bind(this);
    this.handleLongitude = this.handleLongitude.bind(this);
  }

  getCoordsOnClick() {
    // Location variable for coordinates
    let location = new Location(0,0);
    let lat = document.getElementById('lat');
    let lon = document.getElementById('lon');
    // Get coordinates on map with mouseclick
    this.olmap.on('click',(evt) => {
      location.transform(evt.coordinate[1],evt.coordinate[0]);
      //locationDisplay = location;
      this.setState({latitude: location.latitude, longitude: location.longitude});
      lat.value = location.latitude;
      lon.value = location.longitude;
    });
  }

  componentDidMount() { 
    this.olmap.setTarget("map"); 
    // Listen to map changes
    this.olmap.on("moveend", () => {
      let center = this.olmap.getView().getCenter();
      let zoom = this.olmap.getView().getZoom();
      this.setState({ center, zoom });
    });
    this.getCoordsOnClick();
  }

  shouldComponentUpdate(nextProps, nextState) {
    let center = this.olmap.getView().getCenter();
    let zoom = this.olmap.getView().getZoom();
    if (center === nextState.center && zoom === nextState.zoom) return false;
    return true;
  }

  handleChange = async(date) =>{
    // https://reactdatepicker.com/
    // Set date
    this.setState({
      startDate: date
    })
    await this.setState();
  }

  handleLatitude = async (latitude) => {
    // Set latitude
    //console.log(latitude);
    //console.log(latitude.target.value);
    this.setState({
      latitude: latitude.target.value
    })
    await this.setState();
  }

  handleLongitude = async (longitude) => {
    // Set longitude
    //console.log(longitude);
    //console.log(longitude.target.value);
    this.setState({
      longitude: longitude.target.value,
    })
    await this.setState();
  }

  toggleNight() {
    // Display night layer
    // https://viglino.github.io/ol-ext/examples/layer/map.daynight.html
    
    const nightLayer = new VectorLayer({
      style: null,
      source: new VectorSource({
        format: new GeoJSON(),
        minZoom: 3,
      }),
    });

    /*
    this.olmap.addLayer(new layer.Vector({
      source: nightLayer,
      style: new Style({
        image: new Circle({
          radius: 5,
          fill: new Fill({ color: 'red' })
        }),
        fill: new Fill({
          color: [0,0,50,.5]
        })
      })
    }));
    */
  }

  resetMap = async () => {
    // Set map to original state
    this.setState({ 
      center: [0, 0], 
      zoom: 2,
      latitude: 0,
      longitude: 0,
      });
    await this.setState();
    // Set result to original state
    // TODO refactor
    document.getElementById("lat").value = this.state.latitude;
    document.getElementById("lon").value =this.state.longitude;
    document.getElementById("twilight").innerHTML = "Astronomical twilight:";
    document.getElementById("dawn").innerHTML = "Astronomical dawn:";
    document.getElementById("night").innerHTML = "Night duration: ";
    document.getElementById("sunrise").innerHTML = "Sunrise:";
    document.getElementById("sunset").innerHTML = "Sunset:";
    document.getElementById("day").innerHTML = "Day duration: ";
  }

  calculation() {
    let date = this.state.startDate;
    let result = DayAndNightCalc.solar_events(date,this.state.latitude, this.state.longitude);
    // display results
    // TODO: better options for display
    let twilight,dawn, sunrise, sunset;
    let nightTime = "-", dayTime = "-";
    // https://www.timeanddate.com/astronomy/different-types-twilight.html

    // Calculate astronomical twilight and astronomical dawn if possible
    if(result.twilight != undefined) {
      twilight = "Astronomical twilight: " + result.twilight.toLocaleTimeString();
    } else {
      twilight = "Astronomical twilight: -";
      nightTime = "-"
    }
    if(result.dawn != undefined) {
      dawn = "Astronomical dawn: " + result.dawn.toLocaleTimeString();
    } else {
      dawn = "Astronomical dawn: -";
      nightTime = "-"
    }
    // Calculate night duration if possible
    if(result.dawn != undefined && result.twilight != undefined){
      nightTime = DayAndNightCalc.diff(result.twilight.toLocaleTimeString(), result.dawn.toLocaleTimeString());
    }
    // Calculate sunrise and sunset if possible
    if(result.sunrise != undefined) {
      sunrise = "Sunrise: " + result.sunrise.toLocaleTimeString();
    } else {
      sunrise = "Sunrise: -";
      dayTime = "-"
    }
    if(result.sunset != undefined) {
      sunset = "Sunset: " + result.sunset.toLocaleTimeString()
    } else {
      sunset = "Sunrise: -";
      dayTime = "-"
    }
    // Calculate day duration if possible
    if(result.sunrise != undefined && result.sunset != undefined) {
      dayTime = DayAndNightCalc.diff(result.sunrise.toLocaleTimeString(), result.sunset.toLocaleTimeString());
    }
    // Display results
    // TODO: refactor
    document.getElementById("twilight").innerHTML = twilight;
    document.getElementById("dawn").innerHTML = dawn;
    document.getElementById("night").innerHTML = "Night duration: " + nightTime;
    document.getElementById("sunrise").innerHTML = sunrise;
    document.getElementById("sunset").innerHTML = sunset;
    document.getElementById("day").innerHTML = "Day duration: " + dayTime;
  }

  updateMap() {
    this.olmap.getView().setCenter(this.state.center);
    this.olmap.getView().setZoom(this.state.zoom);
  }

  render() {
    this.updateMap();
    return (
      <div className='App'>
        <header className='headline'>
          <h1>Day and night calculator</h1>
        </header>
        <div id="map" className='map'/>
      
        <div className='container'>
          <label>Latitude: <input id='lat' onChange={this.handleLatitude} value ='0' /></label>
          <label>Longitude: <input id='lon' onChange={this.handleLongitude} value='0'/></label>
          <button type='button' onClick={this.calculation}>Calculate</button>
          <button onClick={this.toggleNight}>Toggle night mode</button>
          <button onClick={this.resetMap}>Reset Map</button>
        </div>
        <div><br></br></div>
        <div className='display'>
          <div className='info'>
            <p>* Select coordinates from map or enter manually</p>
            <p>* Select date from calendar</p>
            <p>* "Calculate" to display results</p>
            <p>* "Toggle night mode" to display night layer</p>
            <p>* "Reset Map" to set map in original state</p>
          </div>
          <DatePicker
            inline={true}
            onChange={ this.handleChange }
            name="startDate"
            dateFormat="MM/dd/yyyy"
          />
          <div id='result' className='result'>
            <p id="twilight" >Astronomical twilight: <br/></p>
            <p id="dawn">Astronomical dawn: <br/></p>
            <p id="night" >Night duration: <br/></p>
            <p id="sunrise">Sunrise: <br/></p>
            <p id="sunset">Sunset: <br/></p>
            <p id="day" >Day duration: <br/></p>
          </div>  
        </div> 
      </div>
    )
  }
}