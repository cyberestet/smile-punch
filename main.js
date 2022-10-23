import { updateMap } from "./utils.js";
import { GROUND, PLAYER_MAP_LIMIT } from "./constants.js";
import { getPlayer } from "./player.js";
import { addListeners } from "./input-handler.js";
import {
  setlastEnemySpawnTime,
  updateEnemies,
  initEnemyData,
} from "./enemy-logic-handler.js";
import * as stone from "./stone.js";

let awakeTimeoutId = null;
let isGameStart = false;
let isGamePause = false;
let refreshIntervalId = null;
let player;
let gameTime;
let map = "";

window.onload = function () {
  awake();
  addListeners();
};

function awake(
  event = null,
  currentString = "PRESS_ANY_⌨_TO_START_🎲",
  toReplace = "⌨",
  replacer = "KEY"
) {
  map = currentString.replace(toReplace, replacer);

  updateMap(map);
  awakeTimeoutId = setTimeout(() => {
    awake(null, currentString, replacer, toReplace);
  }, 500);
}

function start() {
  isGameStart = true;
  isGamePause = false;
  setlastEnemySpawnTime(0);
  initEnemyData();
  player = getPlayer();
  stone.start(player);
  gameTime = 0;
  map = player.skin + new Array(PLAYER_MAP_LIMIT).join(GROUND);
  updateMap(map);
  clearTimeout(awakeTimeoutId);
  refreshIntervalId = setInterval(update, 100);
}

function update() {
  if (!isGamePause) {
    gameTime += 0.1;
    updateEnemies();
  }
}

function changeMap(newMap) {
  map = newMap;
}
function setIsGamePause(value) {
  isGamePause = value;
}

function gameOver() {
  isGameStart = false;
  clearInterval(refreshIntervalId);
  alert("GAME OVER !");
  player.updateHealth(100);
  player.updateStamina(100);
  player.updatePowerCharge(-100);
  player.setScore(0);
  awake();
}

export {
  map,
  start,
  player,
  gameTime,
  isGameStart,
  isGamePause,
  setIsGamePause,
  changeMap,
  gameOver,
};
