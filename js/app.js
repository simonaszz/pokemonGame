import { trainer } from './trainerState.js';

import { getRandomPokemons } from './api.js';
import { mapPokemon } from './pokemonMapper.js';

import { appState } from './appState.js';

import { renderPokemonCards, renderLoading } from './homeView.js';

import { loadTrainer } from './storageService.js';

import { renderCollection, renderCollectionLoading } from './collectionView.js';

import { renderTrainer } from './trainerView.js';

import { catchPokemon } from './pokemonService.js';
import { showNotification, capitalize } from './notificationView.js';

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
  renderTrainer(trainer);

  const apiPokemons = await getRandomPokemons(10);

  const pokemons = apiPokemons.map((apiPokemon) => {
    return mapPokemon(apiPokemon);
  });

  appState.wildPokemons = pokemons;

  console.log('Aplikacijos būsena:', appState);

  renderPokemonCards(pokemons);
}

function handleCatchClick(event) {
  const catchButton = event.target.closest('.catch-btn');

  if (catchButton === null) {
    return;
  }

  const pokemonId = Number(catchButton.dataset.pokemonId);

  const selectedPokemon = appState.wildPokemons.find((pokemon) => {
    return pokemon.id === pokemonId;
  });

  if (selectedPokemon === undefined) {
    return;
  }

  const wasCaught = catchPokemon(selectedPokemon);

  if (wasCaught) {
    renderCollection(trainer.collection);
    renderTrainer(trainer);

    showNotification(`<strong>${capitalize(selectedPokemon.name)}</strong> sėkmingai pridėtas į kolekciją`, 'success');
  } else {
    showNotification(`<strong>${capitalize(selectedPokemon.name)}</strong> jau yra kolekcijoje`, 'error');
  }
}

document.addEventListener('click', handleCatchClick);

initApp();
