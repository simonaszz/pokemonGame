import { trainer } from './trainerState.js';
import { saveTrainer } from './storageService.js';
import { addTrainerXp } from './trainerService.js';

export function catchPokemon(pokemon) {
  const alreadyCaught = trainer.collection.some((caughtPokemon) => {
    return caughtPokemon.id === pokemon.id;
  });

  if (alreadyCaught) {
    return false;
  }

  trainer.collection.push(pokemon);

  addTrainerXp(25);

  saveTrainer(trainer);

  return true;
}
