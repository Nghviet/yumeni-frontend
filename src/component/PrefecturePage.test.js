/**
 * @jest-environment jsdom
 */
import React from "react"
import { render, unmountComponentAtNode } from "react-dom"
import { act } from "react-dom/test-utils"

import PrefecturePage from './PrefecturePage'
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

resas.getPrefectures.mockImplementation(() => Promise.resolve([{
    "prefCode": 1,
    "prefName": "北海道"
}]))

const loadData = jest.fn()
const createAlert = jest.fn()

it('basic test', async () => {
    act(() => {
        render(<PrefecturePage currentCode = {undefined} loadData={loadData} createAlert={createAlert}></PrefecturePage>, container)
    })

    await sleep(100) // Wait to rerender after API call

    const box = document.querySelector(".prefBox")
    expect(box.innerHTML).toBe("北海道")
})