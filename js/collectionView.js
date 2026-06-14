export function renderCollectionLoading() {
  const collectionList = document.querySelector('#collection-list');

  collectionList.innerHTML = `
    <div class="loader-card">
      <div class="loader-spinner"></div>
      <p>Kraunama kolekcija...</p>
    </div>
  `;
}

export function renderCollection(collection, options = {}) {
  const collectionList = document.querySelector('#collection-list');

  if (collection.length === 0) {
    collectionList.innerHTML = `
      <div class="empty-state">
        <p>Dar neturi pagautų Pokemonų.</p>
        <span>Spausk „Pagauti“, kad pradėtum kolekciją.</span>
      </div>
    `;

    return;
  }

  const searchValue = options.search ?? '';
  const sortValue = options.sort ?? 'caught-newest';
  const selectedTypes = options.types ?? [];

  const collectionHtml = collection
    .filter((pokemon) => {
      return pokemon.name.toLowerCase().includes(searchValue.toLowerCase());
    })
    .filter((pokemon) => {
      if (selectedTypes.length === 0) {
        return true;
      }

      return selectedTypes.every((type) => {
        return pokemon.types.includes(type);
      });
    })
    .sort((firstPokemon, secondPokemon) => {
      if (sortValue === 'favorite-first') {
        const favoriteDifference = Number(secondPokemon.isFavorite === true) - Number(firstPokemon.isFavorite === true);

        if (favoriteDifference !== 0) {
          return favoriteDifference;
        }

        return getCaughtTime(secondPokemon) - getCaughtTime(firstPokemon);
      }

      if (sortValue === 'level-highest') {
        return secondPokemon.level - firstPokemon.level;
      }

      if (sortValue === 'name-az') {
        return firstPokemon.name.localeCompare(secondPokemon.name);
      }

      if (sortValue === 'attack-highest') {
        return secondPokemon.stats.attack - firstPokemon.stats.attack;
      }

      return getCaughtTime(secondPokemon) - getCaughtTime(firstPokemon);
    })
    .map((pokemon) => {
      return createCollectionCard(pokemon);
    })
    .join('');

  if (collectionHtml === '') {
    collectionList.innerHTML = `
      <div class="empty-state">
        <p>Pagal filtrus nieko nerasta.</p>
        <span>Pabandyk kitą vardą, tipą arba rūšiavimą.</span>
      </div>
    `;

    return;
  }

  collectionList.innerHTML = collectionHtml;
}

function createCollectionCard(pokemon) {
  return `
    <article class="pokemon-card collection-card">
      <div class="collection-card-header">
        <img
          class="pokemon-card-image"
          src="${pokemon.image}"
          alt="${pokemon.name}"
        />

        <div class="collection-card-title">
          <h3>${pokemon.name}</h3>
          <p class="collection-card-level">Level ${pokemon.level}</p>
        </div>

        <button
          type="button"
          class="${getFavoriteButtonClass(pokemon)}"
          data-pokemon-id="${pokemon.id}"
          aria-label="Pažymėti kaip mėgstamą"
        >
          ${pokemon.isFavorite === true ? '★' : '☆'}
        </button>
      </div>

      <div class="type-list">
        ${createTypeBadges(pokemon.types)}
      </div>

      <div class="collection-card-stats">
        <div>
          <span>XP</span>
          <strong>${pokemon.xp}</strong>
        </div>

        <div>
          <span>HP</span>
          <strong>${pokemon.stats.hp}</strong>
        </div>

        <div>
          <span>ATK</span>
          <strong>${pokemon.stats.attack}</strong>
        </div>

        <div>
          <span>DEF</span>
          <strong>${pokemon.stats.defense}</strong>
        </div>
      </div>

      <p class="caught-time">
        Sugauta: ${formatCaughtAt(pokemon.caughtAt)}
      </p>

      <button
        type="button"
        class="details-btn"
        data-pokemon-id="${pokemon.id}"
      >
        Detaliau
      </button>
    </article>
  `;
}

function createTypeBadges(types) {
  return types
    .map((type) => {
      return `<span class="type-badge">${type}</span>`;
    })
    .join('');
}

function getFavoriteButtonClass(pokemon) {
  if (pokemon.isFavorite === true) {
    return 'favorite-btn favorite-btn-active';
  }

  return 'favorite-btn';
}

function getCaughtTime(pokemon) {
  if (pokemon.caughtAt === undefined) {
    return 0;
  }

  return new Date(pokemon.caughtAt).getTime();
}

function formatCaughtAt(caughtAt) {
  if (caughtAt === undefined) {
    return '-';
  }

  return new Date(caughtAt).toLocaleString('lt-LT');
}
