import { updateMap, throttle } from "./utils.js";
import {
  LEFT_FIST_KEY,
  RIGHT_FIST_KEY,
  MOVE_LEFT_KEY,
  SHIFT_KEY,
  KATSU_KEY,
  MOVE_RIGHT_KEY,
  LEFT_FIST,
  RIGHT_FIST,
} from "./constants.js";
import { player, start, isGameStart, map, isGamePause } from "./main.js";
import { spawnedEnemies } from "./enemy-logic-handler.js";

let prevKey = null;
let isShiftPressed = false;
let isKPressed = false;

const controlHandler = (key) => {
  if (isGameStart && !isGamePause) {
    const playerPosition = player.position;
    switch (key) {
      case "arrowleft":
      case "a": {
        if (isShiftPressed) player.dash(() => player.moveOnPosition(-4));
        else if (isKPressed) player.katonJutsu("left");
        else player.moveOnPosition(-2);

        break;
      }
      case "arrowright":
      case "d": {
        if (isShiftPressed) player.dash(() => player.moveOnPosition(4));
        else if (isKPressed) player.katonJutsu("right");
        else player.moveOnPosition(2);
        break;
      }
      case LEFT_FIST_KEY: {
        player.onPunch(playerPosition - 2, LEFT_FIST, spawnedEnemies);
        break;
      }
      case RIGHT_FIST_KEY: {
        player.onPunch(playerPosition + 2, RIGHT_FIST, spawnedEnemies);
        break;
      }
    }
    updateMap(map);
  } // on restart
  else if (!isGamePause) start();
};
const throttledMovement = throttle(controlHandler, 150);

function handleKeyDown(newKey) {
  newKey = newKey.toLowerCase();
  if (!isShiftPressed) isShiftPressed = newKey === SHIFT_KEY;
  if (!isKPressed) isKPressed = newKey === KATSU_KEY;
  if (newKey !== prevKey) throttledMovement(newKey);
  prevKey = newKey;
}
const onKeyUp = (key) => {
  prevKey = null;

  if (isShiftPressed) isShiftPressed = !(key === SHIFT_KEY);
  if (isKPressed) isKPressed = !(key === KATSU_KEY);
};
function addListeners() {
  window.addEventListener("mouseup", () => (prevKey = null));

  window.addEventListener("keyup", (event) => onKeyUp(event.key.toLowerCase()));

  window.addEventListener("keydown", (e) => handleKeyDown(e.key));
  window.addEventListener("unload", () => (window.location = "/"));

  document
    .getElementById("leftControl")
    .addEventListener("click", () => handleKeyDown(MOVE_LEFT_KEY));
  document
    .getElementById("rightControl")
    .addEventListener("click", () => handleKeyDown(MOVE_RIGHT_KEY));

  document
    .getElementById("leftAttack")
    .addEventListener("click", () => handleKeyDown(LEFT_FIST_KEY));

  document
    .getElementById("rightAttack")
    .addEventListener("click", () => handleKeyDown(RIGHT_FIST_KEY));

  document
    .getElementById("fireJutsu")
    .addEventListener("mousedown", () => handleKeyDown(KATSU_KEY));
  document
    .getElementById("fireJutsu")
    .addEventListener("mouseup", () => onKeyUp(KATSU_KEY));

  document
    .getElementById("jump")
    .addEventListener("mousedown", () => handleKeyDown(SHIFT_KEY));
  document
    .getElementById("jump")
    .addEventListener("mouseup", () => onKeyUp(SHIFT_KEY));
}

export { addListeners };
