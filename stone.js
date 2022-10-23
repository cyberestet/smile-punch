import { killAllEnemies } from "./enemy-logic-handler.js";
import { isGameStart } from "./main.js";

const STONE_SPEED = 7;
let stoneUpdate;
let stoneMove;

function start(player) {
  const stone = getStone();
  stone.addEventListener("click", () => {
    killAllEnemies();
    player.updateHealth(100);
    disableStone();
  });

  stoneUpdate = setInterval(() => {
    if (player.health <= 20 && !stoneMove && isGameStart) {
      launchStone();
    }
    if ((player.health === 0 || !isGameStart) && (stoneMove || stoneUpdate))
      disableStone();
  }, 100);
}

function makeNewPosition() {
  // Get viewport dimensions (remove the dimension of the div)

  var h = window.innerHeight - 50;
  var w = window.innerWidth - 50;

  var nh = Math.floor(Math.random() * h);
  var nw = Math.floor(Math.random() * w);

  return [nh, nw];
}

function getPositionBasedOnDelta(current, target) {
  const delta = target > current ? +STONE_SPEED : -STONE_SPEED;
  let newValue = current + delta;
  newValue = Math.abs(newValue - target) >= STONE_SPEED ? newValue : target;
  return `${newValue}px`;
}
function getStone() {
  return document.getElementById("stone");
}
function disableStone() {
  const stone = getStone();
  stone.style.display = "none";
  stoneUpdate = clearInterval(stoneUpdate);
  stoneMove = clearInterval(stoneMove);
}
function launchStone() {
  const stone = getStone();
  let [newTop, newLeft] = makeNewPosition();
  stone.style.top = `${newTop}px`;
  stone.style.left = `${newLeft}px`;
  [newTop, newLeft] = makeNewPosition();

  newTop = newTop - (newTop % STONE_SPEED);
  newLeft = newLeft - (newLeft % STONE_SPEED);

  stone.style.display = "block";

  stoneMove = setInterval(function () {
    const top = +stone.style.top.replace("px", "");
    const left = +stone.style.left.replace("px", "");
    const isTopReached = top === newTop;
    const isLeftReached = left === newLeft;

    if (isTopReached && isLeftReached) disableStone();
    else {
      if (!isTopReached) stone.style.top = getPositionBasedOnDelta(top, newTop);

      if (!isLeftReached)
        stone.style.left = getPositionBasedOnDelta(left, newLeft);

    }
  }, 30);
}

export { start, launchStone };
