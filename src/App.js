import "./App.css";

import { LineChart, XAxis, YAxis, Line, Tooltip } from "recharts";

import React, { Component } from "react";

import PrefecturePage from "./component/PrefecturePage";
import CityPage from "./component/CityPage";

//Graph mode : 1 - Prefectures, 2 - Cities

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      graphMode: 1,
      data: [],
      keyList: ["総人口", "年少人口", "生産年齢人口", "老年人口"],
      color: {
        総人口: "#6D5E9C",
        年少人口: "#2C2C2C",
        生産年齢人口: "#C03028",
        老年人口: "#4E8234",
      },
      currentCode: undefined,
    };

    this.loadData = this.loadData.bind(this);
    this.changeMode = this.changeMode.bind(this);
    this.createAlert = this.createAlert.bind(this);
    this.closeAlert = this.closeAlert.bind(this);
  }

  loadData(values, key) {
    var data = [];
    for (let i = 0; i < values[0].data.length; i++)
      data.push({ year: values[0].data[i].year });
    for (let i = 0; i < values.length; i++) {
      var value = values[i].data;
      for (let j = 0; j < value.length; j++)
        for (let k = 0; k < data.length; k++)
          if (value[j].year == data[k].year)
            data[k][values[i].label] = value[j].value;
    }
    this.setState({ data: data, currentCode: key });
  }

  changeMode() {
    var newMode = 1;
    if (this.state.graphMode == 1) {
      newMode = 2;
    }
    this.setState({
      graphMode: newMode,
      currentCode: undefined,
    });
  }

  createAlert(alert) {
    this.setState({ alert: alert });
  }

  closeAlert() {
    this.setState({ alert: undefined });
  }

  render() {
    return (
      <div style={{ marginLeft: "1em", width: "80%" }}>
        {this.state.alert == undefined ? <div></div> : <></>}
        <LineChart
          width={1200}
          height={600}
          data={this.state.data}
          margin={{ top: 30, right: 30, left: 60, bottom: 0 }}
        >
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          {this.state.keyList.map((key) => (
            <Line
              type="monotone"
              key={key}
              dataKey={key}
              stroke={this.state.color[key]}
            ></Line>
          ))}
        </LineChart>
        <p></p>
        <div className="switch" onClick={this.changeMode}>
          {this.state.graphMode == 1 ? "Prefecture" : "City"}
        </div>
        <p></p>
        {this.state.graphMode == 1 ? (
          <PrefecturePage
            mode={this.state.graphMode}
            loadData={this.loadData}
            createAlert={this.createAlert}
            currentCode={this.state.currentCode}
          ></PrefecturePage>
        ) : (
          <CityPage
            loadData={this.loadData}
            createAlert={this.createAlert}
            currentCode={this.state.currentCode}
          ></CityPage>
        )}
      </div>
    );
  }
}
