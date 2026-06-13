const BASE_URL = 'https://pokeapi.co/api/v2';

export async function getPokemonCount() {
  try {
    const response = await fetch(`${BASE_URL}/pokemon?limit=1`);

    if (!response.ok) {
      throw new Error('Nepavyko gauti Pokemon kiekio');
    }

    const data = await response.json();

    returncdata.count;
  } catch (error) {
    console.error('klaida gaunant pokemon kieki:', error);
    return 0;
  }
}

export async function getPokemonById(id) {
  try {
    const response = await fetch(`${BASE_URL}/pokemon/${id}`);

    if (!response.ok) {
      throw new Error('Pokemonas nerastas');
    }

    const pokemon = await response.json();

    return pokemon;
  } catch (error) {
    console.error('klaida gaunant Pokemona:', error);
    return null;
  }
}

export async function getRandomPokemon(count) {
  const pokemon = [];
  const pokemonCount = await getPokemonCount();

  if (pokemonCount === 0) {
    return pokemons;
  }

  for (let i = 0; i < count; i++) {
    const randomId = Math.floor(Math.random() * pokemonCount) + 1;

    const pokemon = await getPokemonById(randomId);

    if (pokemon !== null) {
      pokemons.push(pokemon);
    }
  }

  return pokemons;
}
