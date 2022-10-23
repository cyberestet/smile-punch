import BaseUnit from "./unit.js";
import {
  updateMapUnitWith,
  replaceMapAt,
  isGround,
  moveUnitOnPosition,
  updateInRangeWithUI,
  updateMap,
} from "./utils.js";
import {
  HEALTH_ID,
  SCORE_ID,
  GROUND,
  FIRE,
  PLAYER_MAP_LIMIT,
  STAMINA_ID,
  POWER_ID,
  END_OF_MAP_INDEX,
} from "./constants.js";
import { changeMap, gameOver, isGameStart, setIsGamePause } from "./main.js";
import { spawnedEnemies } from "./enemy-logic-handler.js";

let specsUpdater;
class Player extends BaseUnit {
  PUNCH_STAMINA = 10;
  DASH_STAMINA = 25;
  ULTIMATE_POWER_STAMINA = 100;
  constructor({ deadSkin, onDead, score = 0, ...args }) {
    super(args);
    this.deadSkin = deadSkin;
    this.onDead = onDead;
    this.score = score;
    this.maxHealth = 125;
    this.stamina = 100;
    this.powerCharge = 0;
  }

  updateStamina(amount) {
    this.stamina = updateInRangeWithUI(this.stamina, amount, STAMINA_ID);
  }
  updatePowerCharge(amount) {
    this.powerCharge = updateInRangeWithUI(this.powerCharge, amount, POWER_ID);
  }
  dash(onMove) {
    if (this.stamina >= this.DASH_STAMINA) {
      if (onMove()) this.updateStamina(-25);
    }
  }
  katonFire(direction) {
    let delta;
    let prevPosition = this.position;
    let map;
    const isLeft = direction === "left";
    const isRight = direction === "right";
    if (isLeft) delta = -2;
    else if (isRight) delta = 2;

    const jutsu = setInterval(() => {
      const newPosition = prevPosition + delta;
      if (newPosition < 0 || newPosition > PLAYER_MAP_LIMIT) {
        let killScore = 0;
        spawnedEnemies.forEach((e) => {
          if (
            (isLeft && e.position < this.position) ||
            (isRight && e.position > this.position)
          ) {
            if (e.score > 0) killScore += e.score;
            e.health = 0;
          }
        });
        this.onEnemyKill(killScore);
        map = map.replaceAll(FIRE, GROUND);
        changeMap(map);
        updateMap(map);
        setIsGamePause(false);
        clearInterval(jutsu);
      } else {
        map = replaceMapAt(newPosition, FIRE);
        updateMap(map);
        prevPosition = newPosition;
      }
    }, 100);
  }
  katonSigns(callback) {
    const signs = ["🙏", "👏", "🤲", "🤘", "🙏"];
    let currentSignIndex = -1;
    const jutsu = setInterval(() => {
      let skin;

      if (currentSignIndex === signs.length - 1) {
        skin = this.defaultSkin;
        clearInterval(jutsu);
        callback();
      } else {
        currentSignIndex++;
        skin = signs[currentSignIndex];
      }
      const map = replaceMapAt(this.position, skin);
      this.skin = skin;
      updateMap(map);
    }, 300);
  }
  katonJutsu(direction) {
    if (this.powerCharge === this.ULTIMATE_POWER_STAMINA) {
      this.updatePowerCharge(-100);
      setIsGamePause(true);
      this.katonSigns(() => this.katonFire(direction));
    }
  }
  dead() {
    super.dead();
    this.skin = this.deadSkin;
    if (this.onDead) this.onDead();
  }

  updateHealthUI() {
    document.getElementById(HEALTH_ID).innerText = Math.floor(this.health);
  }
  setScore(value) {
    this.score = value;
    document.getElementById(SCORE_ID).innerText = this.score;
  }

  onEnemyKill(score) {
    this.updateStamina(score);
    this.updatePowerCharge(score);
    if (score > 0) this.updateHealth(score);
    this.setScore(this.score + score);
  }

  onPunch(position, weapon, spawnedEnemies) {
    if (this.stamina < this.PUNCH_STAMINA) return;
    const attackedEnemyIndex = spawnedEnemies.findIndex(
      (e) => e.position === position
    );
    let attackedUnit = GROUND;
    this.updateStamina(-this.PUNCH_STAMINA);
    if (attackedEnemyIndex >= 0) {
      const enemy = spawnedEnemies[attackedEnemyIndex];
      enemy.updateHealth(-this.damage, false);
      if (enemy.health <= 0) {
        this.onEnemyKill(enemy.score);
      } else attackedUnit = enemy.skin;
    }

    replaceMapAt(position, weapon);
    setTimeout(() => {
      updateMapUnitWith(weapon, attackedUnit);
    }, 100);
  }

  moveOnPosition(delta) {
    const playerPosition = this.position;
    if (
      (playerPosition >= 1 && delta < 0) ||
      (playerPosition < END_OF_MAP_INDEX && delta > 0)
    ) {
      const newPosition = playerPosition + delta;
      if (isGround(newPosition, newPosition + 2)) {
        moveUnitOnPosition(playerPosition, this, newPosition);
        return true;
      }
    }
  }
}

function getPlayer() {
  const player = new Player({
    id: 1,
    skin: "😀",
    damage: 25,
    position: 0,
    deadSkin: "🥴",
    damageSkin: "😫",
    onDead: gameOver,
  });
  if (specsUpdater) clearInterval(specsUpdater);
  specsUpdater = setInterval(() => {
    if (isGameStart) {
      player.updateStamina(3);
      if (player.health < 100) player.updateHealth(0.1);
    } else clearInterval(specsUpdater);
  }, 500);
  return player;
}
export { getPlayer };
