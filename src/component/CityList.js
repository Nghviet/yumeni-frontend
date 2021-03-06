import React, { Component } from "react";
import PropTypes from "prop-types";
import { getCities } from "../util/resas_api";

import CityBox from "./CityBox";

import "../css/cityPage.css";

export default class CityList extends Component {
  static get propTypes() {
    return {
      prefName: PropTypes.any, // Pref information
      prefCode: PropTypes.any,
      currentCode: PropTypes.any, // Current selected box code, change color if match
      loadData: PropTypes.func, // Load population data to graph
      createAlert: PropTypes.func, // Send alert to root if happen
    };
  }
  constructor(props) {
    super(props);
    this.state = {
      cities: [],
    };
  }

  componentDidMount() {
    this._isMounted = true;
    getCities(this.props.prefCode)
      .then((result) => {
        this.setState({ cities: result });
      })
      .catch((err) => this.props.createAlert(err));
  }

  render() {
    return (
      <div>
        <div className="header">{this.props.prefName}</div>
        <div className="cityList">
          {this.state.cities.map((city) => (
            <CityBox
              key={
                city.prefCode +
                "_" +
                city.cityCode +
                "_" +
                this.props.currentCode
              }
              city={city}
              loadData={this.props.loadData}
              createAlert={this.props.createAlert}
              currentCode={this.props.currentCode}
            ></CityBox>
          ))}
        </div>
      </div>
    );
  }
}
