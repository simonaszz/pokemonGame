export function renderCollection(collection) {
  const collectionList = document.querySelector('#collection-list');

  collectionList.innerHTML = collection
    .map((pokemon) => {
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
          </div>
        </article>
      `;
    })
    .join('');
}
