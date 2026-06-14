export function renderPokemonModal(pokemon) {
  const modal = document.querySelector('#pokemon-modal');

  modal.innerHTML = `
    <article class="pokemon-modal-content">
      <button
        type="button"
        class="modal-close-btn"
        aria-label="Uždaryti modalą"
      >
        ×
      </button>

      <img
        class="pokemon-modal-image"
        src="${pokemon.image}"
        alt="${pokemon.name}"
      />

      <div class="pokemon-modal-info">
        <p class="eyebrow">Pokémon informacija</p>
        <h2>${capitalize(pokemon.name)}</h2>

        <p>Tipai: ${pokemon.types.join(', ')}</p>
        <p>Lygis: ${pokemon.level}</p>
        <p>XP: ${pokemon.xp}</p>

        <div class="pokemon-modal-stats">
          <p>HP: ${pokemon.stats.hp}</p>
          <p>Attack: ${pokemon.stats.attack}</p>
          <p>Defense: ${pokemon.stats.defense}</p>
        </div>

        <button
          type="button"
          class="train-btn"
          data-pokemon-id="${pokemon.id}"
        >
          Treniruoti
        </button>
      </div>
    </article>
  `;

  if (!modal.open) {
    modal.showModal();
  }
}

export function closePokemonModal() {
  const modal = document.querySelector('#pokemon-modal');

  modal.close();
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
