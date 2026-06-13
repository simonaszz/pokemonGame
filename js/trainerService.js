import { trainer } from './trainerState.js';

export function addTrainerXp(amount) {
  trainer.xp += amount;

  const levelsGained = [];

  while (trainer.xp >= getRequiredXp()) {
    trainer.xp -= getRequiredXp();
    trainer.level += 1;

    levelsGained.push(trainer.level);
  }

  return {
    xpGained: amount,
    leveledUp: levelsGained.length > 0,
    levelsGained: levelsGained,
  };
}

export function getRequiredXp() {
  return trainer.level * 100;
}
