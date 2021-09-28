import React, { Component } from "react";
import { getPopulationOfCity } from "../util/resas_api";
import PropTypes from "prop-types";
import "../css/box.css";

export default class CityBox extends Component {
  static get propTypes() {
    return {
      city: PropTypes.any, // City need to display
      currentCode: PropTypes.any, // Current selected box code, change color if match
      loadData: PropTypes.func, // Load population data to graph
      createAlert: PropTypes.func, // Send alert to root if happen
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      added: false,
      color: "#A8A878",
    };
    this.show_population = this.show_population.bind(this);
  }

  show_population(evt) {
    evt.preventDefault();
    
    var currentCode = this.props.currentCode;
    var code = this.props.city.prefCode + "_" + this.props.city.cityCode;
    if (currentCode == undefined || currentCode != code) {
      getPopulationOfCity(this.props.city.prefCode, this.props.city.cityCode)
        .then((result) => {
          this.props.loadData(
            result,
            this.props.city.prefCode + "_" + this.props.city.cityCode
          );
        })
        .catch((err) => this.props.createAlert(err));
    } 
  }

  render() {
    var currentCode = this.props.currentCode;
    var code = this.props.city.prefCode + "_" + this.props.city.cityCode;
    var color =
      currentCode != undefined && currentCode == code ? "#4924A1" : "#A8A878";
    return (
      <div
        style={{
          borderRadius: "25px",
          border: "5px solid #6D6D4E",
          backgroundColor: color,
          color: "white",
        }}
      >
        <p></p>
        <div
          onClick={this.show_population}
          align="center"
          className="cityBox"
        >
          {this.props.city.cityName}
        </div>
        <p></p>
      </div>
    );
  }
}
