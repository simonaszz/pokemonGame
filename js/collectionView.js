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
    <article class="pokemon-card">
      <img
        class="pokemon-card-image"
        src="${pokemon.image}"
        alt="${pokemon.name}"
      />

      <div class="pokemon-card-content">
        <h3>${pokemon.name}</h3>

        <p>Tipai: ${pokemon.types.join(', ')}</p>
        <p>Lygis: ${pokemon.level}</p>
        <p>XP: ${pokemon.xp}</p>
        <p>HP: ${pokemon.stats.hp}</p>
        <p>Attack: ${pokemon.stats.attack}</p>
        <p>Defense: ${pokemon.stats.defense}</p>
        <p>Sugauta: ${formatCaughtAt(pokemon.caughtAt)}</p>

        <button
          type="button"
          class="details-btn"
          data-pokemon-id="${pokemon.id}"
        >
          Detaliau
        </button>
      </div>
    </article>
  `;
}

function formatCaughtAt(caughtAt) {
  if (caughtAt === undefined) {
    return '-';
  }

  return new Date(caughtAt).toLocaleString('lt-LT');
}
