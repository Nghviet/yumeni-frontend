import React, { Component } from "react";
import PropTypes from "prop-types";
import { getPopulationOfPrefecture } from "../util/resas_api";

import "../css/box.css";

export default class PrefectureBox extends Component {
  static get propTypes() {
    return {
      pref: PropTypes.any, // Prefecture info
      mode: PropTypes.any, // Mode 1 : pref population - 2 : city population
      currentCode: PropTypes.any, // Current selected box code, change color if match
      loadData: PropTypes.func, // Load population data to graph
      createAlert: PropTypes.func, // Send alert to root if happen
      onPrefectureSelect: PropTypes.func // Load cities list when this box is selected in mode 2
    };
  }
  constructor(props) {
    super(props);
    this.state = {
      added: false,
      color: "#A8A878",
      count: 0,
    };
    this.pref = this.props.pref;
    this.mode = props.mode;
    this.loadData = props.loadData;

    this.change_display = this.change_display.bind(this);
    this.show_population = this.show_population.bind(this);
  }

  change_display(evt) {
    //Change display city
    evt.preventDefault();
    this.props.onPrefectureSelect(this.pref.prefCode, this.pref.prefName);
  }

  show_population(evt) {
    evt.preventDefault();
    // load prefecture's population data to the graph
    var currentCode = this.props.currentCode;
    if (currentCode == undefined || !currentCode.toString().startsWith(this.pref.prefCode + "_")) {

      getPopulationOfPrefecture(this.pref.prefCode)
        .then((result) => {
          this.props.loadData(result, this.pref.prefCode + "_");
        })
        .catch((err) => this.props.createAlert(err));
    } 
  }

  render() {
    var currentCode = this.props.currentCode;
    var color =
      currentCode != undefined &&
      currentCode.toString().startsWith(this.pref.prefCode + "_")
        ? "#4924A1"
        : "#A8A878";
    return (
      <div className="prefBox" style={{
        backgroundColor: color
        }}
        onClick={
            this.mode == 2
              ? this.change_display
              : this.show_population
        }>
        
        {this.pref.prefName}
      </div>
    );
  }
}
