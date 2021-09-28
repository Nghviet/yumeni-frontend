/**
 * @jest-environment jsdom
 */
import React from "react"
import { render, unmountComponentAtNode } from "react-dom"
import { act } from "react-dom/test-utils"

import PrefectureBox from './PrefectureBox'
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

resas.getPopulationOfPrefecture.mockImplementation(()=>Promise.resolve(0))

const loadData = jest.fn()
const createAlert = jest.fn()
const onPrefectureSelect = jest.fn()
const pref = {
    "prefCode": 1,
    "prefName": "北海道"
}

it("basic test mode 1 undefined currentCode", async () => {
    act(() => {
        render(<PrefectureBox pref={pref} mode={1} currentCode = {undefined} loadData={loadData} createAlert={createAlert} onPrefectureSelect={onPrefectureSelect}></PrefectureBox>, container)
    })

    const button = document.querySelector(".prefBox");
    expect(button.innerHTML).toBe("北海道")
    expect(button.style.backgroundColor).toBe("rgb(168, 168, 120)")

    act(() => {
        button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    
    await sleep(100) // wait for function to be finished
    expect(loadData).toBeCalled()
    expect(createAlert).not.toBeCalled()

})

it("basic test mode 2 undefined currentCode", async () => {
    act(() => {
        render(<PrefectureBox pref={pref} mode={2} currentCode = {undefined} loadData={loadData} createAlert={createAlert} onPrefectureSelect={onPrefectureSelect}></PrefectureBox>, container)
    })

    const button = document.querySelector(".prefBox");
    act(() => {
        button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    
    await sleep(100) // wait for function to be finished
    expect(onPrefectureSelect).toBeCalled()
})

it("basic test mode 1 correct currentCode", async () => {
    act(() => {
        render(<PrefectureBox pref={pref} mode={1} currentCode = "1_" loadData={loadData} createAlert={createAlert} onPrefectureSelect={onPrefectureSelect}></PrefectureBox>, container)
    })

    const button = document.querySelector(".prefBox");
    expect(button.style.backgroundColor).toBe("rgb(73, 36, 161)")

    act(() => {
        button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    
    await sleep(100) // wait for function to be finished
    expect(loadData).toHaveBeenCalledTimes(1)
    expect(createAlert).not.toBeCalled()
})

it("basic test mode 2 correct currentCode", async () => {
    act(() => {
        render(<PrefectureBox pref={pref} mode={2} currentCode = "1_" loadData={loadData} createAlert={createAlert} onPrefectureSelect={onPrefectureSelect}></PrefectureBox>, container)
    })

    const button = document.querySelector(".prefBox");
    expect(button.style.backgroundColor).toBe("rgb(73, 36, 161)")
})

it("basic test mode 2 correct currentCode", async () => {
    act(() => {
        render(<PrefectureBox pref={pref} mode={2} currentCode = "2_" loadData={loadData} createAlert={createAlert} onPrefectureSelect={onPrefectureSelect}></PrefectureBox>, container)
    })

    const button = document.querySelector(".prefBox");
    expect(button.style.backgroundColor).toBe("rgb(168, 168, 120)")
})

it("basic test mode 2 correct currentCode", async () => {
    act(() => {
        render(<PrefectureBox pref={pref} mode={2} currentCode = "2_2002" loadData={loadData} createAlert={createAlert} onPrefectureSelect={onPrefectureSelect}></PrefectureBox>, container)
    })

    const button = document.querySelector(".prefBox");
    expect(button.style.backgroundColor).toBe("rgb(168, 168, 120)")
})