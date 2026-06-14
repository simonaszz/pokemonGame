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
        <p class="eyebrow">Pokemon informacija</p>
        <h2>${capitalize(pokemon.name)}</h2>

        <p>Tipai: ${pokemon.types.join(', ')}</p>
        <p>Gebėjimai: ${formatAbilities(pokemon.abilities)}</p>
        <p>Ūgis: ${formatHeight(pokemon.height)}</p>
        <p>Svoris: ${formatWeight(pokemon.weight)}</p>
        <p>Lygis: ${pokemon.level}</p>
        <p>XP: ${pokemon.xp}</p>
        <p>Sugauta: ${formatCaughtAt(pokemon.caughtAt)}</p>

        <div class="pokemon-modal-stats">
          <p>HP: ${pokemon.stats.hp}</p>
          <p>Attack: ${pokemon.stats.attack}</p>
          <p>Defense: ${pokemon.stats.defense}</p>
        </div>

        <div class="pokemon-modal-actions">
          <button
            type="button"
            class="train-btn"
            data-pokemon-id="${pokemon.id}"
          >
            Treniruoti
          </button>

          <button
            type="button"
            class="release-btn"
            data-pokemon-id="${pokemon.id}"
          >
            Paleisti
          </button>
        </div>
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

function formatAbilities(abilities) {
  if (abilities === undefined || abilities.length === 0) {
    return '-';
  }

  return abilities.join(', ');
}

function formatHeight(height) {
  if (height === undefined) {
    return '-';
  }

  return `${height / 10} m`;
}

function formatWeight(weight) {
  if (weight === undefined) {
    return '-';
  }

  return `${weight / 10} kg`;
}

function formatCaughtAt(caughtAt) {
  if (caughtAt === undefined) {
    return '-';
  }

  return new Date(caughtAt).toLocaleString('lt-LT');
}
