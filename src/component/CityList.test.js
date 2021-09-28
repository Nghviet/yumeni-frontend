/**
 * @jest-environment jsdom
 */
import React from "react"
import { render, unmountComponentAtNode } from "react-dom"
import { act } from "react-dom/test-utils"

import CityList from './CityList'
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

const city1 = {
    "prefCode": 1,
    "cityCode": "01100",
    "cityName": "札幌市",
    "bigCityFlag": "2"
}
const city2 = {
    "prefCode": 1,
    "cityCode": "01101",
    "cityName": "札幌市中央区",
    "bigCityFlag": "1"
}
const loadData = jest.fn()
const createAlert = jest.fn()
const prefCode = "1"
const prefName = "北海道"

resas.getCities.mockImplementation(()=> Promise.resolve(
    [city1, city2]
))

resas.getPopulationOfCity.mockImplementation((prefCode, cityCode) => Promise.resolve(prefCode + "__" + cityCode))


it('display correctly', async () => {
    act(() => {
        render(<CityList prefCode={prefCode} prefName={prefName} loadData={loadData} createAlert={createAlert} currentCode={undefined}></CityList>, container)
    })

    await sleep(1000)

    const header = document.querySelector(".header")
    expect(header.innerHTML).toBe("北海道")
    
    const button = document.querySelector(".cityBox")
    act(() => {
        button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    const cityList = document.querySelector(".cityList")

    await sleep(1000) // wait for function to be finished
    expect(loadData).toBeCalled()
    expect(createAlert).not.toBeCalled()
})