import React, { Component } from "react";
import PropTypes from "prop-types";
import { getPrefectures } from "../util/resas_api";

import PrefectureBox from "./PrefectureBox";
import CityList from "./CityList";
import "../css/cityPage.css";

export default class CityPage extends Component {
  static get propTypes() {
    return {
      currentCode: PropTypes.any,
      loadData: PropTypes.func,
      createAlert: PropTypes.func,
    };
  }
  constructor(props) {
    super(props);
    this.state = {
      prefecture_list: [],
      rendered: [],
      selected: undefined,
      count: {},
      prefName: undefined,
    };
    this.onPrefectureSelect = this.onPrefectureSelect.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    getPrefectures()
      .then((result) => {
        this.setState({ prefecture_list: result });
      })
      .catch((err) => this.createAlert(err));
  }

  onPrefectureSelect(prefCode, prefName) {
    var rendered = this.state.rendered;
    var count = this.state.count;
    if (rendered.indexOf(prefCode) == -1) {
      rendered.push(prefCode);
      count[prefCode] = 0;
    }
    this.setState({
      rendered: rendered,
      selected: prefCode,
      prefName: prefName,
    });
  }

  render() {
    return (
      <div id="city_page">
        <div id="city_page_left">
          {this.state["prefecture_list"].map((pref) => (
            <PrefectureBox
              key={"2_" + pref.prefCode}
              currentCode={this.props.currentCode}
              pref={pref}
              onPrefectureSelect={this.onPrefectureSelect}
              mode={2}
            ></PrefectureBox>
          ))}
        </div>
        <div id="city_page_right">
          {this.state.rendered.map((prefCode) => (
            <div
              key={this.state.selected + "_city_" + prefCode}
              style={{ display: this.state.selected == prefCode ? "" : "none" }}
            >
              <CityList
                prefCode={prefCode}
                loadData={this.props.loadData}
                createAlert={this.props.createAlert}
                currentCode={this.props.currentCode}
                prefName={this.state.prefName}
              ></CityList>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
