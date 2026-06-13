export function mapPokemon(apiPokemon) {
  return {
    id: apiPokemon.id,
    name: apiPokemon.name,
    image: apiPokemon.sprites.other['official-artwork'].front_default,
    types: apiPokemon.types.map((typeInfo) => typeInfo.type.name),
    stats: {
      hp: apiPokemon.stats[0].base_stat,
      attack: apiPokemon.stats[1].base_stat,
      defense: apiPokemon.stats[2].base_stat,
    },
    level: 1,
    xp: 0,
  };
}
