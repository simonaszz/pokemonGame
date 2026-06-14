export function renderDashboard(trainer) {
  const caughtCount = document.querySelector('#caught-count');
  const strongestPokemon = document.querySelector('#strongest-pokemon');
  const highestLevel = document.querySelector('#highest-level');
  const mostCommonType = document.querySelector('#most-common-type');
  const totalXp = document.querySelector('#total-xp');

  const collection = trainer.collection;

  caughtCount.textContent = collection.length;
  strongestPokemon.textContent = getStrongestPokemonName(collection);
  highestLevel.textContent = getHighestPokemonLevel(collection);
  mostCommonType.textContent = getMostCommonType(collection);
  totalXp.textContent = trainer.totalXp ?? trainer.xp;
}

function getStrongestPokemonName(collection) {
  if (collection.length === 0) {
    return '-';
  }

  const strongestPokemon = collection.reduce((strongest, pokemon) => {
    if (getPokemonPower(pokemon) > getPokemonPower(strongest)) {
      return pokemon;
    }

    return strongest;
  });

  return capitalize(strongestPokemon.name);
}

function getPokemonPower(pokemon) {
  return pokemon.stats.hp + pokemon.stats.attack + pokemon.stats.defense;
}

function getHighestPokemonLevel(collection) {
  if (collection.length === 0) {
    return '-';
  }

  const levels = collection.map((pokemon) => {
    return pokemon.level;
  });

  return Math.max(...levels);
}

function getMostCommonType(collection) {
  if (collection.length === 0) {
    return '-';
  }

  const typeCounts = {};

  collection.forEach((pokemon) => {
    pokemon.types.forEach((type) => {
      if (typeCounts[type] === undefined) {
        typeCounts[type] = 0;
      }

      typeCounts[type] += 1;
    });
  });

  const mostCommonType = Object.entries(typeCounts).sort((firstType, secondType) => {
    return secondType[1] - firstType[1];
  })[0];

  return capitalize(mostCommonType[0]);
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
