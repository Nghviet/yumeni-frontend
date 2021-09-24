import React, { Component } from "react";
import PropTypes from "prop-types";
import { getPopulationOfPrefecture } from "../util/resas_api";

import "../css/box.css";

export default class PrefectureBox extends Component {
  static get propTypes() {
    return {
      pref: PropTypes.any,
      mode: PropTypes.any,
      currentCode: PropTypes.any,
      loadData: PropTypes.func,
      createAlert: PropTypes.func,
      onPrefectureSelect: PropTypes.func,
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
    evt.preventDefault();
    this.props.onPrefectureSelect(this.pref.prefCode, this.pref.prefName);
  }

  show_population(evt) {
    evt.preventDefault();
    if (this.state.added == false) {
      getPopulationOfPrefecture(this.pref.prefCode)
        .then((result) => {
          this.props.loadData(result, this.pref.prefCode + "_");
          this.setState({ added: true });
        })
        .catch((err) => this.props.createAlert(err));
    } else {
      this.setState({ added: false });
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
      <div>
        <table
          style={{
            width: "100%",
            color: "white",
            backgroundColor: color,
            borderRadius: "25px",
            border: "5px solid #6D6D4E",
          }}
        >
          <tbody>
            <tr>
              <td
                align="center"
                onClick={
                  this.mode == 2
                    ? this.change_display.bind(this)
                    : this.show_population.bind(this)
                }
                style={{ borderRadius: "25px" }}
                className="prefBox"
              >
                {this.pref.prefName}
              </td>
            </tr>
          </tbody>
        </table>
        <p></p>
      </div>
    );
  }
}
