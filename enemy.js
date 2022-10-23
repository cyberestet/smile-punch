import BaseUnit from "./unit.js";

class Enemy extends BaseUnit {
  constructor({ moveInterval, score = 1, ...args }) {
    super(args);
    this.moveInterval = moveInterval; // in seconds
    this.lastMoveTime = 0;
    this.score = score;
  }
}

function getEnemiesList() {
  return new Array(
    new Enemy({
      id: 1,
      skin: "🐵",
      damageSkin: "🙈",
      damage: 10,
      moveInterval: 1,
      score: 15,
    }),
    new Enemy({
      id: 2,
      skin: "💩",
      // damageSkin: "🚽",
      damage: 3,
      moveInterval: 0.7,
      score: -1,
    }),
    new Enemy({
      id: 3,
      skin: "🤡",
      damageSkin: "👻",
      damage: 7,
      moveInterval: 0.5,
      score: 10,
    }),
    new Enemy({
      id: 4,
      skin: "👹",
      damageSkin: "👺",
      damage: 5,
      moveInterval: 0.5,
      score: 12,
    }),
    new Enemy({
      id: 5,
      skin: "💣",
      damage: 50,
      moveInterval: 3,
      score: 16,
    }),
    new Enemy({
      id: 6,
      skin: "🎅",
      damageSkin: "🤬",
      damage: 15,
      moveInterval: 2,
      score: 15,
    }),
    new Enemy({
      id: 7,
      skin: "🐷",
      damageSkin: "🐽",
      damage: 1,
      moveInterval: 1,
      score: 8,
    }),
    new Enemy({
      id: 8,
      skin: "👀",
      // damageSkin: "👁️",
      damage: 5,
      moveInterval: 1,
      score: 20,
    }),
    new Enemy({
      id: 9,
      skin: "🎠",
      damage: 5,
      moveInterval: 1,
      score: 17,
    })
  );
}

export { Enemy, getEnemiesList };
