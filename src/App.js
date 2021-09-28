import "./App.css";

import { LineChart, XAxis, YAxis, Line, Tooltip, ResponsiveContainer } from "recharts";

import React, { Component } from "react";

import PrefecturePage from "./component/PrefecturePage";
import CityPage from "./component/CityPage";

//Graph mode : 1 - Prefectures, 2 - Cities

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      graphMode: 1, // Display mode
      data: [], // Population data
      keyList: ["総人口", "年少人口", "生産年齢人口", "老年人口"], // Display key
      color: {
        総人口: "#6D5E9C",
        年少人口: "#2C2C2C",
        生産年齢人口: "#7D1F1A",
        老年人口: "#4E8234",
      },
      display: { // Display mode
        総人口: "",
        年少人口: "",
        生産年齢人口: "",
        老年人口: "",
      },
      currentCode: undefined,
    };

    this.loadData = this.loadData.bind(this)
    this.changeMode = this.changeMode.bind(this)
    this.createAlert = this.createAlert.bind(this)
    this.closeAlert = this.closeAlert.bind(this)
    this.turnOff = this.turnOff.bind(this)

    this.totalPopulation = this.totalPopulation.bind(this)
    this.youngPopulation = this.youngPopulation.bind(this)
    this.workingAge = this.workingAge.bind(this)
    this.oldPopulation = this.oldPopulation.bind(this)
  }

  loadData(values, key) {
    var data = [];
    for (let i = 0; i < values[0].data.length; i++)
      data.push({ year: values[0].data[i].year })
    for (let i = 0; i < values.length; i++) {
      var value = values[i].data;
      for (let j = 0; j < value.length; j++)
        for (let k = 0; k < data.length; k++)
          if (value[j].year == data[k].year)
            data[k][values[i].label] = value[j].value
    }
    this.setState({ data: data, currentCode: key })
  }

  changeMode() {
    var newMode = 1
    if (this.state.graphMode == 1) {
      newMode = 2
    }
    this.setState({
      graphMode: newMode,
      currentCode: undefined,
    })
  }

  createAlert(alert) {
    this.setState({ alert: alert })
  }

  closeAlert() {
    this.setState({ alert: undefined })
  }

  turnOff(key) {
    // Turn on and off line in graph
    var display = this.state.display
    if(display[key] == "") display[key]="none"
      else display[key]=""
    this.setState({display:display})
  }

  totalPopulation() {
    this.turnOff("総人口")
  }

  youngPopulation() {
    this.turnOff("年少人口")
  }

  workingAge() {
    this.turnOff("生産年齢人口")
  }

  oldPopulation() {
    this.turnOff("老年人口")
  }

  render() {
    return (
      <div style={{ marginLeft:"1em", width: "90%" ,height:"100%" }}>
        
        <ResponsiveContainer width = "100%" height = {window.screen.height/2} >        
          <LineChart
            data={this.state.data} 
            margin={{ top: 30, right: 30, left: 60, bottom: 0 }}
          >
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            {this.state.keyList.map((key) => (
              (this.state.display[key] == "")?
              <Line
                type="monotone"
                key={key}
                dataKey={key}
                stroke={this.state.color[key]}
              ></Line>:null
            ))}
          </LineChart>
        </ResponsiveContainer>

        <p></p>
        <div style = {{display:"grid", gridTemplateColumns: "repeat(4, 1fr)"}}>
            <div className={this.state.display["総人口"]==""?"totalPopulation":"noDisplay"} onClick={this.totalPopulation}>総人口</div>
            <div className={this.state.display["年少人口"]==""?"youngPopulation":"noDisplay"} onClick={this.youngPopulation}>年少人口</div>
            <div className={this.state.display["生産年齢人口"]==""?"workingAge":"noDisplay"} onClick={this.workingAge}>生産年齢人口</div>
            <div className={this.state.display["老年人口"]==""?"oldPopulation":"noDisplay"} onClick={this.oldPopulation}>老年人口</div>
        </div>
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
