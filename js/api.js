const BASE_URL = 'https://pokeapi.co/api/v2';

export async function getPokemonList(limit = 10, offset = 0) {
  try {
    const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);

    if (!response.ok) {
      throw new Error('Nepavyko gauti Pokemon sąrašo');
    }

    return await response.json();
  } catch (error) {
    console.error('Klaida gaunant Pokemon sąrašą:', error);
    return null;
  }
}

export async function getPokemonByUrl(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Pokemon nerastas');
    }

    return await response.json();
  } catch (error) {
    console.error('Klaida gaunant Pokemon:', error);
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

export async function getPokemonByName(name) {
  try {
    const normalizedName = name.toLowerCase().trim();

    const exactResponse = await fetch(`${BASE_URL}/pokemon/${normalizedName}`);

    if (exactResponse.ok) {
      return await exactResponse.json();
    }

    const listResponse = await fetch(`${BASE_URL}/pokemon?limit=100000&offset=0`);

    if (!listResponse.ok) {
      throw new Error('Nepavyko gauti Pokemon sąrašo');
    }

    const pokemonList = await listResponse.json();

    const matchedPokemon = pokemonList.results.find((pokemon) => {
      return pokemon.name.includes(normalizedName);
    });

    if (matchedPokemon === undefined) {
      return null;
    }

    return await getPokemonByUrl(matchedPokemon.url);
  } catch (error) {
    console.error('Klaida ieškant Pokemon:', error);

    return null;
  }
}
