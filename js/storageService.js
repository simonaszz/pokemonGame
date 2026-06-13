const STORAGE_KEY = 'pokemon-trainer';

export function saveTrainer(trainer) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trainer));
}

export function loadTrainer() {
  const savedTrainer = localStorage.getItem(STORAGE_KEY);

  if (savedTrainer === null) {
    return null;
  }

  return JSON.parse(savedTrainer);
}
