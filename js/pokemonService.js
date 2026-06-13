import { trainer } from './trainerState.js';

export function catchPokemon(pokemon) {
  const alreadyCaught = trainer.collection.some((caughtPokemon) => {
    return caughtPokemon.id === pokemon.id;
  });

  if (alreadyCaught) {
    return false;
  }

  trainer.collection.push(pokemon);

  return true;
}
