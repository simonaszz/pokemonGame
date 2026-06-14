import { trainer } from './trainerState.js';

import { getRandomPokemons, getPokemonByName } from './api.js';
import { mapPokemon } from './pokemonMapper.js';

import { appState } from './appState.js';

import { renderPokemonCards, renderLoading } from './homeView.js';

import { loadTrainer } from './storageService.js';

import { renderCollection, renderCollectionLoading } from './collectionView.js';

import { renderTrainer } from './trainerView.js';
import { renderDashboard } from './dashboardView.js';
import { renderLeaderboard } from './leaderboardView.js';

import { catchPokemon, releasePokemon, trainPokemon, toggleFavoritePokemon } from './pokemonService.js';
import { showNotification, capitalize } from './notificationView.js';

import { renderPokemonModal, closePokemonModal } from './pokemonModalView.js';

async function initApp() {
  console.log('Trenerio objektas:', trainer);

  renderLoading();
  renderCollectionLoading();

  const savedTrainer = loadTrainer();

  if (savedTrainer !== null) {
    trainer.name = savedTrainer.name;
    trainer.level = savedTrainer.level;
    trainer.xp = savedTrainer.xp;
    trainer.totalXp = savedTrainer.totalXp ?? savedTrainer.xp ?? 0;
    trainer.collection = savedTrainer.collection;
  }

  renderFilteredCollection();
  renderTrainer(trainer);
  renderDashboard(trainer);
  renderLeaderboard(trainer);

  await loadRandomPokemons();

  console.log('Aplikacijos būsena:', appState);
}

async function loadRandomPokemons() {
  renderLoading();

  const apiPokemons = await getRandomPokemons(10);

  const pokemons = apiPokemons.map((apiPokemon) => {
    return mapPokemon(apiPokemon);
  });

  appState.wildPokemons = pokemons;

  renderPokemonCards(appState.wildPokemons);
}

async function appendRandomPokemons(count = 10) {
  const apiPokemons = await getRandomPokemons(count);

  const newPokemons = apiPokemons.map((apiPokemon) => {
    return mapPokemon(apiPokemon);
  });

  const uniqueNewPokemons = newPokemons.filter((newPokemon) => {
    return !appState.wildPokemons.some((wildPokemon) => {
      return wildPokemon.id === newPokemon.id;
    });
  });

  appState.wildPokemons = [...appState.wildPokemons, ...uniqueNewPokemons];

  renderPokemonCards(appState.wildPokemons);

  return uniqueNewPokemons.length;
}

function renderFilteredCollection() {
  renderCollection(trainer.collection, {
    search: appState.collectionSearch,
    sort: appState.collectionSort,
    types: appState.collectionTypes,
  });
}

async function handlePokemonSearch(event) {
  event.preventDefault();

  const searchInput = document.querySelector('#pokemon-search');
  const searchValue = searchInput.value.trim();

  if (searchValue === '') {
    showNotification('Įvesk Pokemon vardą', 'error');

    return;
  }

  const previousPokemons = appState.wildPokemons;

  renderLoading();

  const apiPokemon = await getPokemonByName(searchValue);

  if (apiPokemon === null) {
    renderPokemonCards(previousPokemons);

    showNotification(`<strong>${capitalize(searchValue)}</strong> nerastas`, 'error');

    return;
  }

  const pokemon = mapPokemon(apiPokemon);

  appState.wildPokemons = [pokemon];

  renderPokemonCards(appState.wildPokemons);

  showNotification(`<strong>${capitalize(pokemon.name)}</strong> rastas`, 'success');

  searchInput.value = '';
}

async function handleRandomEncounterClick() {
  await loadRandomPokemons();

  showNotification('Atsirado nauji laukiniai Pokemonai', 'success');
}

async function handleLoadMorePokemonClick(event) {
  const loadMoreButton = event.currentTarget;

  loadMoreButton.disabled = true;
  loadMoreButton.textContent = 'Kraunama...';

  const addedCount = await appendRandomPokemons(10);

  loadMoreButton.disabled = false;
  loadMoreButton.textContent = 'Įkelti daugiau Pokemonų';

  if (addedCount === 0) {
    showNotification('Nepavyko pridėti naujų Pokemonų. Bandyk dar kartą.', 'error');

    return;
  }

  showNotification(`Pridėta naujų Pokemonų: ${addedCount}`, 'success');
}

function handleCollectionSearchInput(event) {
  appState.collectionSearch = event.target.value.trim();

  renderFilteredCollection();
}

function handleCollectionSortChange(event) {
  appState.collectionSort = event.target.value;

  renderFilteredCollection();
}

function handleCollectionTypeChange() {
  const selectedTypeInputs = document.querySelectorAll('input[name="collection-type"]:checked');

  appState.collectionTypes = Array.from(selectedTypeInputs).map((typeInput) => {
    return typeInput.value;
  });

  renderFilteredCollection();
}

function handleFavoriteClick(event) {
  const favoriteButton = event.target.closest('.favorite-btn');

  if (favoriteButton === null) {
    return;
  }

  const pokemonId = Number(favoriteButton.dataset.pokemonId);

  if (Number.isNaN(pokemonId)) {
    showNotification('Neteisingas Pokemon ID', 'error');

    return;
  }

  const result = toggleFavoritePokemon(pokemonId);

  if (result.success === false) {
    showNotification('Pokemonas nerastas kolekcijoje', 'error');

    return;
  }

  renderFilteredCollection();

  if (result.pokemon.isFavorite) {
    showNotification(`<strong>${capitalize(result.pokemon.name)}</strong> pridėtas prie mėgstamų`, 'success');

    return;
  }

  showNotification(`<strong>${capitalize(result.pokemon.name)}</strong> pašalintas iš mėgstamų`, 'success');
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

  const result = catchPokemon(selectedPokemon);

  if (result.success === false) {
    showNotification(`<strong>${capitalize(result.pokemon.name)}</strong> jau yra kolekcijoje`, 'error');

    return;
  }

  renderFilteredCollection();
  renderTrainer(trainer);
  renderDashboard(trainer);
  renderLeaderboard(trainer);

  let message = `
    <strong>${capitalize(result.pokemon.name)}</strong> sėkmingai pridėtas į kolekciją
    <p>+${result.xp.xpGained} XP</p>
  `;

  if (result.xp.leveledUp) {
    const reachedLevel = result.xp.levelsGained.at(-1);

    message += `
      <p><strong>Level Up!</strong></p>
      <p>Pasiektas ${reachedLevel} lygis</p>
    `;
  }

  showNotification(message, 'success');
}

function handleReleaseClick(event) {
  const releaseButton = event.target.closest('.release-btn');

  if (releaseButton === null) {
    return;
  }

  const pokemonId = Number(releaseButton.dataset.pokemonId);

  if (Number.isNaN(pokemonId)) {
    showNotification('Neteisingas Pokemon ID', 'error');

    return;
  }

  const result = releasePokemon(pokemonId);

  if (result.success === false) {
    showNotification('Pokemonas nerastas kolekcijoje', 'error');

    return;
  }

  renderFilteredCollection();
  renderDashboard(trainer);

  if (appState.selectedPokemonId === pokemonId) {
    appState.selectedPokemonId = null;
    closePokemonModal();
  }

  showNotification(`<strong>${capitalize(result.pokemon.name)}</strong> paleistas iš kolekcijos`, 'success');
}

function handleTrainClick(event) {
  const trainButton = event.target.closest('.train-btn');

  if (trainButton === null) {
    return;
  }

  const pokemonId = Number(trainButton.dataset.pokemonId);
  const statName = trainButton.dataset.statName;

  if (Number.isNaN(pokemonId)) {
    showNotification('Neteisingas Pokemon ID', 'error');

    return;
  }

  const result = trainPokemon(pokemonId, statName);

  if (result.success === false) {
    if (result.reason === 'invalid_stat') {
      showNotification('Neteisingai pasirinkta statistika', 'error');

      return;
    }

    showNotification('Pokemonas nerastas kolekcijoje', 'error');

    return;
  }

  renderFilteredCollection();
  renderDashboard(trainer);

  if (appState.selectedPokemonId === pokemonId) {
    const updatedPokemon = trainer.collection.find((pokemon) => {
      return pokemon.id === pokemonId;
    });

    if (updatedPokemon !== undefined) {
      renderPokemonModal(updatedPokemon);
    }
  }

  let message = `
    <strong>${capitalize(result.pokemon.name)}</strong> treniruotas:
    ${formatStatName(result.trainedStat)}
    <p>+${result.xp.xpGained} XP</p>
  `;

  if (result.xp.leveledUp) {
    const reachedLevel = result.xp.levelsGained.at(-1);

    message += `
      <p><strong>Level Up!</strong></p>
      <p>Pasiektas ${reachedLevel} lygis</p>
      <p>${formatStatName(result.trainedStat)} padidėjo</p>
    `;
  }

  showNotification(message, 'success');
}

function handleDetailsClick(event) {
  const detailsButton = event.target.closest('.details-btn');

  if (detailsButton === null) {
    return;
  }

  const pokemonId = Number(detailsButton.dataset.pokemonId);

  if (Number.isNaN(pokemonId)) {
    showNotification('Neteisingas Pokemon ID', 'error');

    return;
  }

  const selectedPokemon = trainer.collection.find((pokemon) => {
    return pokemon.id === pokemonId;
  });

  if (selectedPokemon === undefined) {
    showNotification('Pokemonas nerastas kolekcijoje', 'error');

    return;
  }

  appState.selectedPokemonId = pokemonId;

  renderPokemonModal(selectedPokemon);
}

function handleModalCloseClick(event) {
  const closeButton = event.target.closest('.modal-close-btn');

  if (closeButton === null) {
    return;
  }

  appState.selectedPokemonId = null;

  closePokemonModal();
}

function formatStatName(statName) {
  if (statName === 'hp') {
    return 'HP';
  }

  if (statName === 'attack') {
    return 'Attack';
  }

  if (statName === 'defense') {
    return 'Defense';
  }

  return statName;
}

document.addEventListener('click', handleCatchClick);
document.addEventListener('click', handleReleaseClick);
document.addEventListener('click', handleTrainClick);
document.addEventListener('click', handleDetailsClick);
document.addEventListener('click', handleModalCloseClick);
document.addEventListener('click', handleFavoriteClick);

const searchForm = document.querySelector('.search-form');
const randomButton = document.querySelector('.random-btn');
const loadMoreButton = document.querySelector('.load-more-btn');
const collectionSearchInput = document.querySelector('#collection-search');
const collectionSortSelect = document.querySelector('#collection-sort');
const collectionTypeFilter = document.querySelector('.collection-type-filter');

searchForm.addEventListener('submit', handlePokemonSearch);
randomButton.addEventListener('click', handleRandomEncounterClick);
loadMoreButton.addEventListener('click', handleLoadMorePokemonClick);
collectionSearchInput.addEventListener('input', handleCollectionSearchInput);
collectionSortSelect.addEventListener('change', handleCollectionSortChange);
collectionTypeFilter.addEventListener('change', handleCollectionTypeChange);

initApp();
