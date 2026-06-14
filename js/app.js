import { trainer } from './trainerState.js';

import { getRandomPokemons } from './api.js';
import { mapPokemon } from './pokemonMapper.js';

import { appState } from './appState.js';

import { renderPokemonCards, renderLoading } from './homeView.js';

import { loadTrainer } from './storageService.js';

import { renderCollection, renderCollectionLoading } from './collectionView.js';

import { renderTrainer } from './trainerView.js';
import { renderDashboard } from './dashboardView.js';

import { catchPokemon, releasePokemon, trainPokemon } from './pokemonService.js';

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
  renderDashboard(trainer);

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

  const result = catchPokemon(selectedPokemon);

  if (result.success === false) {
    showNotification(`<strong>${capitalize(result.pokemon.name)}</strong> jau yra kolekcijoje`, 'error');

    return;
  }

  renderCollection(trainer.collection);
  renderTrainer(trainer);
  renderDashboard(trainer);

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
    showNotification('Neteisingas Pokémon ID', 'error');

    return;
  }

  const result = releasePokemon(pokemonId);

  if (result.success === false) {
    showNotification('Pokémonas nerastas kolekcijoje', 'error');

    return;
  }

  renderCollection(trainer.collection);
  renderDashboard(trainer);

  showNotification(`<strong>${capitalize(result.pokemon.name)}</strong> paleistas iš kolekcijos`, 'success');
}

function handleTrainClick(event) {
  const trainButton = event.target.closest('.train-btn');

  if (trainButton === null) {
    return;
  }

  const pokemonId = Number(trainButton.dataset.pokemonId);

  if (Number.isNaN(pokemonId)) {
    showNotification('Neteisingas Pokémon ID', 'error');

    return;
  }

  const result = trainPokemon(pokemonId);

  if (result.success === false) {
    showNotification('Pokémonas nerastas kolekcijoje', 'error');

    return;
  }

  renderCollection(trainer.collection);
  renderDashboard(trainer);

  let message = `
    <strong>${capitalize(result.pokemon.name)}</strong> treniruotas
    <p>+${result.xp.xpGained} XP</p>
  `;

  if (result.xp.leveledUp) {
    const reachedLevel = result.xp.levelsGained.at(-1);

    message += `
      <p><strong>Level Up!</strong></p>
      <p>Pasiektas ${reachedLevel} lygis</p>
      <p>Stats padidėjo</p>
    `;
  }

  showNotification(message, 'success');
}

document.addEventListener('click', handleCatchClick);
document.addEventListener('click', handleReleaseClick);
document.addEventListener('click', handleTrainClick);

initApp();
