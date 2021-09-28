/**
 * @jest-environment jsdom
 */
import React from "react"
import { render, unmountComponentAtNode } from "react-dom"
import { act } from "react-dom/test-utils"

import CityPage from './CityPage'
import * as resas from '../util/resas_api'
jest.mock("../util/resas_api")
let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div")
  document.body.appendChild(container)
})

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container)
  container.remove()
  container = null
})

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
var localStorageMock = (function() {
    var store = {};
    return {
        getItem: function(key) {
            return store[key];
        },
        setItem: function(key, value) {
            store[key] = value.toString();
        },
        clear: function() {
                store = {};
        },
        removeItem: function(key) {
            delete store[key];
        }
    };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

const loadData = jest.fn()
const createAlert = jest.fn()

resas.getPrefectures.mockImplementation(() => Promise.resolve([
    {
        "prefCode": 1,
        "prefName": "北海道"
    },
    {
        "prefCode": 2,
        "prefName": "青森県"
    }
]))

resas.getCities.mockImplementation(prefCode => {
    var result = [{
            "prefCode": 2,
            "cityCode": "02201",
            "cityName": "青森市",
            "bigCityFlag": "0"
        },
        {
            "prefCode": 2,
            "cityCode": "02202",
            "cityName": "弘前市",
            "bigCityFlag": "0"
        }]
    if(prefCode == 1) result = [{
            "prefCode": 1,
            "cityCode": "01100",
            "cityName": "札幌市",
            "bigCityFlag": "2"
        },
        {
            "prefCode": 1,
            "cityCode": "01101",
            "cityName": "札幌市中央区",
            "bigCityFlag": "1"
        }]

    return Promise.resolve(result)
})

resas.getPopulationOfCity.mockImplementation((prefCode, cityCode) => Promise.resolve(0))

it('city display when change prefecture', async () => {
    act(() => {
        render(<CityPage currentCode = {undefined} loadData={loadData} createAlert={createAlert}></CityPage>, container)
    })

    await sleep(100) // Wait to rerender after API call

    var prefectures = document.querySelector("#city_page_left")
    
    var children = prefectures.children
    var prefectureName = []
    for(let i=0;i<children.length;i++) prefectureName.push(children[i].innerHTML)
    await sleep(1)
    expect(prefectureName[0]).toMatch("北海道")
    expect(prefectureName[1]).toMatch("青森県")


    var pref = document.querySelector(".prefBox")
    act(()=>{
        pref.dispatchEvent(new MouseEvent("click", { bubbles: true }))
    })

    await sleep(100)
    var cities = document.querySelector(".cityList")
    var cityName = []
    children = cities.children
    for(let i=0;i<children.length;i++) cityName.push(children[i].children[1].innerHTML)
    expect(cityName[0]).toMatch("札幌市")
    expect(cityName[1]).toMatch("札幌市中央区")

    var pref = prefectures.lastChild
    act(()=>{
        pref.dispatchEvent(new MouseEvent("click", { bubbles: true }))
    })

    await sleep(100)
    var cities = document.querySelector(".cityList")
    var cityName = []
    children = cities.children
    for(let i=0;i<children.length;i++) cityName.push(children[i].children[1].innerHTML)
    expect(cityName[0]).toMatch("青森市")
    expect(cityName[1]).toMatch("弘前市")

    const button = document.querySelector(".cityBox")
    act(() => {
        button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    await sleep(1000)
    expect(loadData).toBeCalled()
    expect(createAlert).not.toBeCalled()
})