export function renderLoading() {
  const pokemonGrid = document.querySelector('#pokemon-grid');

  pokemonGrid.innerHTML = `
    <div class="loader-card">
      <div class="loader-spinner"></div>
      <p>Atkeliauja Pokemonai...</p>
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
