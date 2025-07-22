const pokemonList = document.querySelector("#pokemonList");
const loadMoreButton = document.querySelector("#loadMore");
const cartContainer = document.querySelector("#cartContainer");
const maxRecord = 151;
const limit = 10;
let offset = 0;
let allPokemons = [];

function criarPokemon(pokemon) {
  return `
        <li class="pokemon ${pokemon.type}">
          <span class="number">#${pokemon.number}</span>
          <span class="name">${pokemon.name}</span>
          <div class="detail">
            <ol class="types">
                ${pokemon.types
                  .map((type) => `<li class="type ${type}">${type}</li>`)
                  .join("")}
            </ol>
            <img
              src="${pokemon.photo}"
              alt="${pokemon.name}"
            />
          </div>
        </li>
    `;
}

function loadpokemonItens(offset, limit) {
  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    const newHtml = pokemons.map(criarPokemon).join("");
    pokemonList.innerHTML += newHtml;
    allPokemons = allPokemons.concat(pokemons); // Adiciona ao array global
    adicionarEventosDeClique();
  });
}

loadpokemonItens(offset, limit);

loadMoreButton.addEventListener("click", () => {
  offset += limit;

  const qtdRecordsWithNexPage = offset + limit;

  if (qtdRecordsWithNexPage >= maxRecord) {
    const newLimit = maxRecord - offset;
    loadpokemonItens(offset, newLimit);
    loadMoreButton.parentElement.removeChild(loadMoreButton);
  } else {
    loadpokemonItens(offset, limit);
  }
});

function criarCartContainer(pokemon) {
  return `
      <div class="pokemonCart ${pokemon.type}">
        <button class="closeCartBtn" aria-label="Fechar Cart">×</button>
        <div class="pokemonId">
          <span class="spanName">${pokemon.name}</span>
          <span class="spanNumber">#${pokemon.number}</span>
        </div>
        <div class="pokemonImgContainer">
          <img src="${pokemon.photo}" alt="${pokemon.name}" />
        </div>
        <div class="pokemonInfo">
          <span>Height: ${pokemon.height}</span>
          <span>Weight: ${pokemon.weight}</span>
          <span>Types: ${pokemon.types.join(", ")}</span>
          <span>Abilities: ${pokemon.abilities.join(", ")}</span>
        </div>
      </div>`;
}

function mostrarCart(pokemon) {
  cartContainer.innerHTML = criarCartContainer(pokemon);
  cartContainer.style.display = "flex";

  // Adiciona evento ao botão de fechar
  const closeBtn = cartContainer.querySelector('.closeCartBtn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      cartContainer.style.display = "none";
    });
  }
}

function adicionarEventosDeClique() {
  const elementos = document.querySelectorAll(".pokemon");
  elementos.forEach((el, index) => {
    el.onclick = () => mostrarCart(allPokemons[index]);
  });
}

