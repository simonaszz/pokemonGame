export function renderPokemonCard(pokemon) {
  const pokemonGrid = document.querySelector('#pokemon-grid');

  pokemonGrid.innerHTML = `
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

        <button type="button" class="catch-btn">
          Pagauti
        </button>
      </div>
    </article>
  `;
}
