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

        <p>Lygis: ${pokemon.level}</p>
        <p>XP: ${pokemon.xp}</p>
        <p>HP: ${pokemon.stats.hp}</p>
        <p>Attack: ${pokemon.stats.attack}</p>
        <p>Defense: ${pokemon.stats.defense}</p>

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
    </article>
  `;
}
