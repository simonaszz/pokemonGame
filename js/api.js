const BASE_URL = 'https://pokeapi.co/api/v2';

export async function getPokemonById(id) {
  try {
    const response = await fetch(`${BASE_URL}/pokemon/${id}`);

    if (!response.ok) {
      throw new Error('Pokemonas nerastas');
    }
    const pokemon = await response.json();

    return pokemon;
  } catch (error) {
    console.error('Klaida gaunant Pokemona:', error);
    return null;
  }
}
