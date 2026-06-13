const BASE_URL = 'https://pokeapi.co/api/v2';

export async function getPokemonList(limit = 10, offset = 0) {
  try {
    const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);

    if (!response.ok) {
      throw new Error('Nepavyko gauti Pokémon sąrašo');
    }

    return await response.json();
  } catch (error) {
    console.error('Klaida gaunant Pokémon sąrašą:', error);
    return null;
  }
}

export async function getPokemonByUrl(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Pokémon nerastas');
    }

    return await response.json();
  } catch (error) {
    console.error('Klaida gaunant Pokémon:', error);
    return null;
  }
}

export async function getRandomPokemons(count) {
  const firstPage = await getPokemonList(1, 0);

  if (firstPage === null) {
    return [];
  }

  const maxOffset = firstPage.count - count;
  const randomOffset = Math.floor(Math.random() * maxOffset);

  const pokemonList = await getPokemonList(count, randomOffset);

  if (pokemonList === null) {
    return [];
  }

  const pokemonRequests = pokemonList.results.map((pokemonInfo) => {
    return getPokemonByUrl(pokemonInfo.url);
  });

  const pokemons = await Promise.all(pokemonRequests);

  return pokemons.filter((pokemon) => pokemon !== null);
}
