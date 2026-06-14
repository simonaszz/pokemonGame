export function renderCollectionLoading() {
  const collectionList = document.querySelector('#collection-list');

  collectionList.innerHTML = `
    <div class="loader-card">
      <div class="loader-spinner"></div>
      <p>Kraunama kolekcija...</p>
    </div>
  `;
}

export function renderCollection(collection) {
  const collectionList = document.querySelector('#collection-list');

  if (collection.length === 0) {
    collectionList.innerHTML = `
      <div class="empty-state">
        <p>Dar neturi pagautų Pokémonų.</p>
        <span>Spausk „Pagauti“, kad pradėtum kolekciją.</span>
      </div>
    `;

    return;
  }

  collectionList.innerHTML = collection
    .map((pokemon) => {
      return createCollectionCard(pokemon);
    })
    .join('');
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

        <div>
          <h3>${pokemon.name}</h3>
          <p class="collection-card-level">Level ${pokemon.level}</p>
        </div>
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

function formatCaughtAt(caughtAt) {
  if (caughtAt === undefined) {
    return '-';
  }

  return new Date(caughtAt).toLocaleString('lt-LT');
}
