import { map, changeMap } from "./main.js";
import { GROUND } from "./constants.js";

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function getUniqueId() {
  return Math.random().toString(16).slice(2);
}

function isGround(start, end) {
  return map.substring(start, end) === GROUND;
}

function replaceMapAt(index, replacement) {
  if (index < 0) return;
  const newMap =
    map.substring(0, index) +
    replacement +
    map.substring(index + replacement.length);
  changeMap(newMap);
  return newMap;
}

function moveUnitOnPosition(currentPosition, unit, newPosition) {
  replaceMapAt(currentPosition, GROUND);
  replaceMapAt(newPosition, unit.skin);
  unit.position = newPosition;
}
function updateMap(newMap) {
  window.history.pushState("", "", newMap);
  // window.location.hash = newMap
}
function updateMapUnitWith(targetPosition, replacement) {
  const newMap = replaceMapAt(targetPosition, replacement);
  updateMap(newMap);
}
function cloneObject(obj) {
  return Object.create(
    Object.getPrototypeOf(obj),
    Object.getOwnPropertyDescriptors(obj)
  );
}
function updateInRangeWithUI(value, amount, uIid, min = 0, max = 100) {
  if (value <= max) {
    value += amount;
    if (value < min) value = min;
    if (value > max) value = max;

    document.getElementById(uIid).innerText = value;
    return value;
  }
}

const throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export {
  updateInRangeWithUI,
  randomIntFromInterval,
  isGround,
  moveUnitOnPosition,
  replaceMapAt,
  updateMap,
  updateMapUnitWith,
  cloneObject,
  throttle,
  getUniqueId,
};
