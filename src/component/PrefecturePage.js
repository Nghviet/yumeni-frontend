import React, { Component } from "react";
import PropTypes from "prop-types";
import PrefectureBox from "./PrefectureBox";
import { getPrefectures } from "../util/resas_api";

import "../App.css";
export default class PrefecturePage extends Component {
  static get propTypes() {
    return {
      pref: PropTypes.any, // Pref info
      currentCode: PropTypes.any, // Current selected box code, change color if match
      loadData: PropTypes.func, // Load population data to graph
      createAlert: PropTypes.func, // Send alert to root if happen
    };
  }
  constructor(props) {
    super(props);
    this.state = {
      prefecture_list: [],
    };
  }

  componentDidMount() {
    this._isMounted = true;
    getPrefectures()
      .then((result) => {
        this.setState({ prefecture_list: result });
      })
      .catch((err) => this.createAlert(err));
  }

  render() {
    return (
      <div className="prefecture_list">
        {this.state["prefecture_list"].map((pref) => (
          <PrefectureBox
            key={pref.prefCode + "_" + this.props.currentCode}
            pref={pref}
            loadData={this.props.loadData}
            createAlert={this.props.createAlert}
            currentCode={this.props.currentCode}
          ></PrefectureBox>
        ))}
      </div>
    );
  }
}
