import { trainer } from './trainerState.js';
import { getRandomPokemons } from './api.js';
import { mapPokemon } from './pokemonMapper.js';
import { appState } from './appState.js';
import { renderPokemonCards, renderLoading } from './homeView.js';

async function initApp() {
  console.log('Trenerio objektas:', trainer);

  renderLoading();

  const apiPokemons = await getRandomPokemons(10);

  const pokemons = apiPokemons.map((apiPokemon) => {
    return mapPokemon(apiPokemon);
  });

  appState.wildPokemons = pokemons;

  console.log('Aplikacijos būsena:', appState);

  renderPokemonCards(pokemons);
}

initApp();
