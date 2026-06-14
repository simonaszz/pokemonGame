export function renderDashboard(trainer) {
  const caughtCount = document.querySelector('#caught-count');
  const strongestPokemon = document.querySelector('#strongest-pokemon');
  const highestLevel = document.querySelector('#highest-level');
  const totalXp = document.querySelector('#total-xp');

  const collection = trainer.collection;

  caughtCount.textContent = collection.length;
  strongestPokemon.textContent = getStrongestPokemonName(collection);
  highestLevel.textContent = getHighestPokemonLevel(collection);
  totalXp.textContent = getTotalPokemonXp(collection);
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

function getTotalPokemonXp(collection) {
  return collection.reduce((total, pokemon) => {
    return total + pokemon.xp;
  }, 0);
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
