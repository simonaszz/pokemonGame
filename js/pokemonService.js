import { trainer } from './trainerState.js';
import { saveTrainer } from './storageService.js';
import { addTrainerXp } from './trainerService.js';

const XP_FOR_CATCH = 25;

export function catchPokemon(pokemon) {
  const alreadyCaught = trainer.collection.some((caughtPokemon) => {
    return caughtPokemon.id === pokemon.id;
  });

  if (alreadyCaught) {
    return {
      success: false,
      reason: 'duplicate',
      pokemon: pokemon,
    };
  }

  trainer.collection.push(pokemon);

  const xpResult = addTrainerXp(XP_FOR_CATCH);

  saveTrainer(trainer);

  return {
    success: true,
    pokemon: pokemon,
    xp: xpResult,
  };
}

export function releasePokemon(pokemonId) {
  const pokemonIndex = trainer.collection.findIndex((pokemon) => {
    return pokemon.id === pokemonId;
  });

  if (pokemonIndex === -1) {
    return {
      success: false,
      reason: 'not_found',
    };
  }

  const releasedPokemon = trainer.collection[pokemonIndex];

  trainer.collection.splice(pokemonIndex, 1);

  saveTrainer(trainer);

  return {
    success: true,
    pokemon: releasedPokemon,
  };
}
