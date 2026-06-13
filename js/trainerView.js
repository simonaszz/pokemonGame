import { getRequiredXp } from './trainerService.js';

export function renderTrainer(trainer) {
  const trainerTitle = document.querySelector('#trainer-title');
  const xpText = document.querySelector('#trainer-xp-text');
  const xpProgress = document.querySelector('#xp-progress');

  const requiredXp = getRequiredXp();
  const xpPercent = Math.min((trainer.xp / requiredXp) * 100, 100);

  trainerTitle.textContent = `Treneris Lv. ${trainer.level}`;
  xpText.textContent = `${trainer.xp} / ${requiredXp}`;
  xpProgress.style.width = `${xpPercent}%`;
}
