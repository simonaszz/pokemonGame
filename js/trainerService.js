import { trainer } from './trainerState.js';

export function addTrainerXp(amount) {
  trainer.xp += amount;

  while (trainer.xp >= getRequiredXp()) {
    trainer.xp -= getRequiredXp();
    trainer.level += 1;
  }
}

export function getRequiredXp() {
  return trainer.level * 100;
}
