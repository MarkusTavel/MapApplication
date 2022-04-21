import React from 'react';
import {
  interaction,layer,custom,control,
  Interactions,Overlays,Controls,
  Map,Layers,Overlay,Util
} from "react-openlayers";
import './App.css';
import BaseMap from "./components/BaseMap";
//import DatePick from './components/DatePicker';
import './components/SunriseSunset';
import './components/Location';
import $ from 'jquery';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import './components/DatePicker';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state =  {
      startDate: new Date(),
    };
    this.handleChange = this.handleChange.bind(this);
    this.calculation = this.calculation.bind(this);
  }

  handleChange(date) {
    this.setState({
      startDate: date
    })
  }

  calculation(e) {
    const value = this.state.startDate;
    document.getElementById("date").innerHTML = value;
  }

  render() {
    return (
      <div className='App'>
        <h1>Upper Tab</h1>  
        <div id="map" className='map'>
         <BaseMap />
        </div>
        <p id="coord">Latitude: 0<br/>Longitude: 0</p>
        <DatePicker
          selected={ this.state.startDate }
          onChange={ this.handleChange }
          name="DatePicker"
          dateFormat="MM/dd/yyyy"
        /> 
        <button onClick={this.calculation}>Calculate</button>
        <p id="date"><br/></p>
      </div>
    )
  }
}