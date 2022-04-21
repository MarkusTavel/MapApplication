import React, { useRef, useState } from 'react';
import Map from "ol/map";
import View from "ol/view";
import LayerTile from "ol/layer/tile";
import SourceOSM from "ol/source/osm";
import XYZ from 'ol/source/xyz';
import { Location } from './Location';
import MousePosition from 'ol/control/mouseposition';
import ZoomSlider from 'ol/control/zoomslider';
import ScaleLine from 'ol/control/scaleline';
import OverviewMap from 'ol/control/overviewmap';
import DefaultControls  from 'ol/control/control';

const baseLayer = new LayerTile({
  source: new XYZ ({
    url: 'http://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}',
  }),
  minZoom: 2,
})

export default class BaseMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {center: [0,0], zoom: 1, latitude: 0, longitude: 0};
    // Make OpenLayers map object
    this.olmap = new Map({
      target: 'null',
      layers: [baseLayer],
      view: new View({ 
        center: this.state.center,
        zoom: this.state.zoom,  
        minZoom: 2,
      }),
      // Gives error when importing
      /*controls: DefaultControls().extend([
        new ZoomSlider(),
        new MousePosition(),
        new ScaleLine(),
        new OverviewMap()
    ]),*/
    });
  }

  getCoordinates() {
    let location = new Location(0,0);
    // Get coordinates on map with mouseclick
    this.olmap.on('click',(evt) => {
      location.transform(evt.coordinate[1],evt.coordinate[0]);
      // locationDisplay = location;
      let locationDisplay = 
        "Latitude: " + location.latitude + "<br>" +
        "Longitude: " + location.longitude;
      document.getElementById("coord").innerHTML = locationDisplay;
      console.log(evt.coordinate[1],evt.coordinate[0]);
      console.log(location);
    });
    return location;
  }

  updateMap() {
    this.olmap.getView().setCenter(this.state.center);
    this.olmap.getView().setZoom(this.state.zoom);
  }

  componentDidMount() { 
    this.olmap.setTarget("map"); 
    // Listen to map changes
    this.olmap.on("moveend", () => {
      let center = this.olmap.getView().getCenter();
      let zoom = this.olmap.getView().getZoom();
      this.setState({ center, zoom });
    });
  }

  resetMap() {
    this.setState({ center: [0, 0], zoom: 2 });
    let locationDisplay = 
        "Latitude: 0" + "<br>" +
        "Longitude: 0";
    document.getElementById("coord").innerHTML = locationDisplay;
  }
 
  shouldComponentUpdate(nextProps, nextState) {
    let center = this.olmap.getView().getCenter();
    let zoom = this.olmap.getView().getZoom();
    if (center === nextState.center && zoom === nextState.zoom) return false;
    return true;
  }

  render() {
    this.updateMap(); // Update map on render?
    this.getCoordinates();
    // RESET button for later
    //  <button onClick = { e => this.resetMap()}>Reset Map</button>
    return (
      <div>
        <div id="map"/>    
      </div> 
    );
  }
}