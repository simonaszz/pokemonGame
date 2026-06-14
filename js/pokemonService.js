import { trainer } from './trainerState.js';
import { saveTrainer } from './storageService.js';
import { addTrainerXp } from './trainerService.js';

const XP_FOR_CATCH = 25;
const XP_FOR_TRAINING = 20;
const STAT_INCREASE_ON_LEVEL_UP = 2;

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

  const caughtPokemon = {
    ...pokemon,
    types: [...pokemon.types],
    stats: { ...pokemon.stats },
    caughtAt: new Date().toISOString(),
  };

  trainer.collection.push(caughtPokemon);

  const xpResult = addTrainerXp(XP_FOR_CATCH);

  saveTrainer(trainer);

  return {
    success: true,
    pokemon: caughtPokemon,
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

export function trainPokemon(pokemonId, statName) {
  const pokemon = trainer.collection.find((collectionPokemon) => {
    return collectionPokemon.id === pokemonId;
  });

  if (pokemon === undefined) {
    return {
      success: false,
      reason: 'not_found',
    };
  }

  if (!isTrainableStat(statName)) {
    return {
      success: false,
      reason: 'invalid_stat',
      pokemon: pokemon,
    };
  }

  pokemon.xp += XP_FOR_TRAINING;

  const levelsGained = [];

  while (pokemon.xp >= getRequiredPokemonXp(pokemon)) {
    pokemon.xp -= getRequiredPokemonXp(pokemon);
    pokemon.level += 1;

    pokemon.stats[statName] += STAT_INCREASE_ON_LEVEL_UP;

    levelsGained.push(pokemon.level);
  }

  saveTrainer(trainer);

  return {
    success: true,
    pokemon: pokemon,
    trainedStat: statName,
    xp: {
      xpGained: XP_FOR_TRAINING,
      leveledUp: levelsGained.length > 0,
      levelsGained: levelsGained,
    },
  };
}

function getRequiredPokemonXp(pokemon) {
  return pokemon.level * 50;
}

function isTrainableStat(statName) {
  return statName === 'hp' || statName === 'attack' || statName === 'defense';
}
