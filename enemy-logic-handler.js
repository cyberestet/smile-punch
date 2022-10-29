import {
  randomIntFromInterval,
  replaceMapAt,
  updateMap,
  cloneObject,
  getUniqueId,
} from "./utils.js";
import {
  GROUND,
  SPAWN_DISTANCE_FROM_PLAYER,
  ENEMY_SPAWN_DELAY,
  END_OF_MAP_INDEX,
} from "./constants.js";
import { getEnemiesList } from "./enemy.js";
import { gameTime, map, player } from "./main.js";

const availableEnemies = getEnemiesList();
let spawnedEnemies;
let lastEnemySpawnTime;

function initEnemyData() {
  spawnedEnemies = [];
  lastEnemySpawnTime = undefined;
}
function killAllEnemies() {
  spawnedEnemies.forEach((e) => e.dead());
}

function setlastEnemySpawnTime(value) {
  lastEnemySpawnTime = value;
}
function selectEnemiesForSpawn() {
  if (
    (spawnedEnemies.length <= 5 &&
      Math.abs(gameTime - lastEnemySpawnTime) > ENEMY_SPAWN_DELAY) ||
    spawnedEnemies.length === 0
  ) {
    lastEnemySpawnTime = gameTime;
    const enemy =
      availableEnemies[randomIntFromInterval(0, availableEnemies.length - 1)];
    const newEnemy = cloneObject(enemy);
    newEnemy.setId(getUniqueId());
    spawnedEnemies.push(newEnemy);
  }
}
function updateEnemyList() {
  spawnedEnemies = spawnedEnemies.filter((e) => e.health > 0);
}

function updateEnemies() {
  selectEnemiesForSpawn();
  updateEnemyList();
  const playerPosition = player.position;

  for (let index = 0; index < spawnedEnemies.length; index++) {
    const enemy = spawnedEnemies[index];
    let newPosition = null;
    if (Math.abs(gameTime - enemy.lastMoveTime) > enemy.moveInterval) {
      // we can move
      const currentPosition = enemy.position;
      if (currentPosition && currentPosition >= 0) {
        // enemy already on map so we need to move him to the player
        if (Math.abs(playerPosition - currentPosition) > 2) {
          // move to player
          if (playerPosition > currentPosition)
            // player on the right side
            newPosition = currentPosition + 2;
          else if (playerPosition < currentPosition)
            // player on the left side
            newPosition = currentPosition - 2;
          const enemyOnPosition = spawnedEnemies.find(
            (e) => e.position == newPosition && e.id !== enemy.id
          );
          if (!enemyOnPosition) {
            // TODO if player will be on the left side
            replaceMapAt(currentPosition, GROUND);
          } else {
            newPosition = null;
            // attack
            enemyOnPosition.updateHealth(-enemy.damage);
          }
        } else player.updateHealth(-enemy.damage); // attack player
      } else {
        // not on the map
        newPosition = playerPosition;
        while (
          Math.abs(playerPosition - newPosition) < SPAWN_DISTANCE_FROM_PLAYER
        ) {
          const randomPosition = randomIntFromInterval(0, END_OF_MAP_INDEX + 1);
          if (map.substring(randomPosition, randomPosition + 2) === GROUND)
            newPosition = randomPosition;
        }
      }

      if (newPosition) {
        enemy.position = newPosition;
        replaceMapAt(newPosition, enemy.skin);
        updateMap(map);
      }
      enemy.lastMoveTime = gameTime;
    }
  }
}
export {
  spawnedEnemies,
  updateEnemies,
  setlastEnemySpawnTime,
  initEnemyData,
  killAllEnemies,
};
