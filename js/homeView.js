import { appState } from './appState.js';
import { trainer } from './trainerState.js';
import { catchPokemon } from './pokemonService.js';
import { renderCollection } from './collectionView.js';
import { showNotification, capitalize } from './notificationView.js';
import { renderTrainer } from './trainerView.js';

export function renderLoading() {
  const pokemonGrid = document.querySelector('#pokemon-grid');

  pokemonGrid.innerHTML = `
    <div class="loader-card">
      <div class="loader-spinner"></div>
      <p>Atkeliauja Pokémonai...</p>
    </div>
  `;
}

export function renderPokemonCards(pokemons) {
  const pokemonGrid = document.querySelector('#pokemon-grid');

  pokemonGrid.innerHTML = pokemons
    .map((pokemon) => {
      return createPokemonCard(pokemon);
    })
    .join('');

  attachCatchEvents();
}

function createPokemonCard(pokemon) {
  return `
    <article class="pokemon-card">
      <img
        class="pokemon-card-image"
        src="${pokemon.image}"
        alt="${pokemon.name}"
      />

      <div class="pokemon-card-content">
        <h3>${pokemon.name}</h3>
        <p>Tipas: ${pokemon.types.join(', ')}</p>
        <p>HP: ${pokemon.stats.hp}</p>
        <p>Attack: ${pokemon.stats.attack}</p>
        <p>Defense: ${pokemon.stats.defense}</p>

        <button
          type="button"
          class="catch-btn"
          data-pokemon-id="${pokemon.id}"
        >
          Pagauti
        </button>
      </div>
    </article>
  `;
}

function attachCatchEvents() {
  const catchButtons = document.querySelectorAll('.catch-btn');

  catchButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const pokemonId = Number(button.dataset.pokemonId);

      const selectedPokemon = appState.wildPokemons.find((pokemon) => {
        return pokemon.id === pokemonId;
      });

      const wasCaught = catchPokemon(selectedPokemon);

      if (wasCaught) {
        renderCollection(trainer.collection);
        renderTrainer(trainer);

        showNotification(
          `<strong>${capitalize(selectedPokemon.name)}</strong> sėkmingai pridėtas į kolekciją`,
          'success'
        );
      } else {
        showNotification(`<strong>${capitalize(selectedPokemon.name)}</strong> jau yra kolekcijoje`, 'error');
      }
    });
  });
}
