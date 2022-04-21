import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
 
import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import './DatePicker.css';

class DatePick extends Component {
  constructor (props) {
    super(props)
    this.state =  {
      startDate: new Date(),
    };
    this.handleChange = this.handleChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }
  handleChange(date) {
    this.setState({
      startDate: date
    })
    document.getElementById("date").innerHTML = this.state.startDate;
  }
  onFormSubmit(e) {
    e.preventDefault();
    console.log(this.state.startDate);
    
  }
 
  render() {
    return (
      <form onSubmit={ this.onFormSubmit }>
        <h2></h2>
        <div className="form-group">
          <DatePicker
              selected={ this.state.startDate }
              onChange={ this.handleChange }
              name="startDate"
              dateFormat="MM/dd/yyyy"
          /> 
        </div>
      </form>
    );
  }
  
}
export default DatePick;

/*
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './DatePicker.css';

function Datepicker() {
    const [startDate, setStartDate] = useState(new Date());

    return (
        <div>
            <h4 className="datepicker__title" > From </h4>
            <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
            />
        </div>
    );
}

export default Datepicker;

*/

/*

import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
 
import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import './DatePicker.css';

class Date extends Component {
  constructor (props) {
    super(props)
    this.state = {
      
    };
    this.handleChange = this.handleChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }
  handleChange(date) {
    this.setState({
      startDate: date
    })
  }
  onFormSubmit(e) {
    e.preventDefault();
    console.log(this.state.startDate)
  }
 
  render() {
    return (
      <form onSubmit={ this.onFormSubmit }>
        <h2></h2>
        <div className="form-group">
          <DatePicker
              selected={ this.state.startDate }
              onChange={ this.handleChange }
              name="startDate"
              dateFormat="MM/dd/yyyy"
          />
          
        </div>
      </form>
    );
  }
  
}
export default Date;

*/