import { GROUND } from "./constants.js";
import { updateMapUnitWith } from "./utils.js";

class BaseUnit {
  constructor({
    id,
    health = 100,
    skin,
    damage,
    position = null,
    damageSkin = "💀",
  }) {
    this.id = id;
    this.skin = skin;
    this.defaultSkin = skin;
    this.health = health;
    this.damage = damage;
    this.position = position;
    this.maxHealth = health;
    this.damageSkin = damageSkin;
    this.deadSkin = GROUND;
  }
  setId(id) {
    this.id = id;
  }

  dead() {
    updateMapUnitWith(this.skin, this.deadSkin);
  }

  updateHealth(value, useDamageSkin = true) {
    let health = this.health;
    if (health >= 0) {
      health += value;
      if (health > this.maxHealth) health = this.maxHealth;
      if (value < 0 && health > 0 && useDamageSkin) {
        updateMapUnitWith(this.skin, this.damageSkin);
        this.skin = this.damageSkin;
        setTimeout(() => {
          this.skin = this.defaultSkin;
          updateMapUnitWith(this.damageSkin, this.skin);
        }, 100);
      }
      if (health <= 0) health = 0;

      this.health = health;
      this.updateHealthUI();
      if (health === 0) this.dead();
    }
  }
  updateHealthUI() {}
}
export default BaseUnit;
