export function mapPokemon(apiPokemon) {
  return {
    id: apiPokemon.id,
    name: apiPokemon.name,
    image: apiPokemon.sprites.other['official-artwork'].front_default,
    types: apiPokemon.types.map((typeInfo) => {
      return typeInfo.type.name;
    }),
    abilities: apiPokemon.abilities.map((abilityInfo) => {
      return abilityInfo.ability.name;
    }),
    weight: apiPokemon.weight,
    height: apiPokemon.height,
    stats: {
      hp: getStat(apiPokemon, 'hp'),
      attack: getStat(apiPokemon, 'attack'),
      defense: getStat(apiPokemon, 'defense'),
    },
    level: 1,
    xp: 0,
  };
}

function getStat(apiPokemon, statName) {
  const statInfo = apiPokemon.stats.find((stat) => {
    return stat.stat.name === statName;
  });

  return statInfo.base_stat;
}
