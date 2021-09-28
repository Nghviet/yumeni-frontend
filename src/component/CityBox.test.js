/**
 * @jest-environment jsdom
 */
import React from "react"
import { render, unmountComponentAtNode } from "react-dom"
import { act } from "react-dom/test-utils"

import CityBox from './CityBox'
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

resas.getPopulationOfCity.mockImplementation(()=> Promise.resolve({}))

const city = {
    "prefCode": 1,
    "cityCode": "01100",
    "cityName": "札幌市",
    "bigCityFlag": "2"
}
const loadData = jest.fn()
const createAlert = jest.fn()
// Main test : check displayed color, functions call
it('undefined currentCode and basic Data', async () => {
    act(() => {
        render(<CityBox city={city} loadData={loadData} createAlert={createAlert} currentCode={undefined}></CityBox>, container)
    })

    const button = document.querySelector(".cityBox");
    expect(button.innerHTML).toBe("札幌市")
    expect(button.parentNode.style.backgroundColor).toBe("rgb(168, 168, 120)")

    act(() => {
        button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    
    await sleep(100) // wait for function to be finished
    expect(loadData).toBeCalled()
    expect(createAlert).not.toBeCalled()
})

// Check displayed color when city got choosen
it('correct currentCode', async() => {
    act(() => {
        render(<CityBox city={city} loadData={loadData} createAlert={createAlert} currentCode="1_01100"></CityBox>, container)
    })

    const button = document.querySelector(".cityBox");
    expect(button.parentNode.style.backgroundColor).toBe("rgb(73, 36, 161)")
})

// Check displayed color when another city got choosen
it('incorrect currentCode', () => {
    act(() => {
        render(<CityBox city={city} loadData={loadData} createAlert={createAlert} currentCode="1_01101"></CityBox>, container)
    })

    const button = document.querySelector(".cityBox");
    expect(button.parentNode.style.backgroundColor).toBe("rgb(168, 168, 120)")
})
