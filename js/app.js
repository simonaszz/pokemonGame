import { trainer } from './trainerState.js';
import { getRandomPokemons } from './api.js';
import { mapPokemon } from './pokemonMapper.js';
import { appState } from './appState.js';
import { renderPokemonCards, renderLoading } from './homeView.js';
import { loadTrainer } from './storageService.js';
import { renderCollection, renderCollectionLoading } from './collectionView.js';

async function initApp() {
  console.log('Trenerio objektas:', trainer);

  renderLoading();
  renderCollectionLoading();

  const savedTrainer = loadTrainer();

  if (savedTrainer !== null) {
    trainer.name = savedTrainer.name;
    trainer.level = savedTrainer.level;
    trainer.xp = savedTrainer.xp;
    trainer.collection = savedTrainer.collection;
  }

  renderCollection(trainer.collection);

  const apiPokemons = await getRandomPokemons(10);

  const pokemons = apiPokemons.map((apiPokemon) => {
    return mapPokemon(apiPokemon);
  });

  appState.wildPokemons = pokemons;

  console.log('Aplikacijos būsena:', appState);

  renderPokemonCards(pokemons);
}
initApp();
