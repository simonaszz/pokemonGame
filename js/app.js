import { trainer } from './trainerState.js';
import { getPokemonById } from './api.js';
import { mapPokemon } from './pokemonMapper.js';
import { renderPokemonCard } from './homeView.js';

async function initApp() {
  console.log('Trenerio objektas:', trainer);

  const apiPokemon = await getPokemonById(25);
  const pokemon = mapPokemon(apiPokemon);

  console.log('Švarus Pokémon objektas:', pokemon);

  renderPokemonCard(pokemon);
}

initApp();
