//O método map chama a função callback recebida por parâmetro para cada elemento do Array original, em ordem, e constrói um novo array com base nos retornos de cada chamada
const pokeApi = {};

//O objeto pokeApi é um objeto que contém métodos para interagir com a PokeAPI, uma API pública que fornece dados sobre Pokémon.
//Ele possui dois métodos: getPokemons e getPokemonDetail. O primeiro busca uma lista de Pokémon com base em um offset e um limite, enquanto o segundo busca detalhes específicos de um Pokémon dado seu URL.
pokeApi.getPokemons = (offset = 0, limit = 5) => {
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
  return fetch(url) //devolve uma promise de response
    .then((response) => response.json()) // converte o body para json
    .then((jsonBody) => jsonBody.results) // pega o results
    .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail)) //pega o array de pokemons e chama o método getPokemonDetail para cada pokemon, retornando uma nova lista de promises. O método map é usado para transformar cada elemento do array de pokémons em uma promessa que busca os detalhes de cada pokémon. Isso resulta em um array de promessas, onde cada promessa representa a busca dos detalhes de um pokémon específico.
    .then((detailRequests) => Promise.all(detailRequests)) // Promise.all é usado para aguardar que todas as promessas sejam resolvidas. Ele recebe um array de promessas e retorna uma nova promessa que é resolvida quando todas as promessas no array são resolvidas. Isso significa que o código aguarda até que todos os detalhes dos pokémons tenham sido buscados antes de continuar.
    .then((pokemonsDetails) => pokemonsDetails) //retorna os detalhes dos pokémons
    .catch((error) => console.log(error)) //tratamento de erro
};

//O método getPokemonDetail recebe um objeto pokemon, que contém informações básicas sobre um Pokémon, e retorna uma promessa que busca detalhes adicionais sobre esse Pokémon usando o URL fornecido no objeto pokemon. Ele usa a função fetch para fazer a solicitação HTTP e, em seguida, converte a resposta em JSON. O resultado é uma promessa que resolve com os detalhes do Pokémon.
//A função retorna uma promessa que resolve com os detalhes do Pokémon.
pokeApi.getPokemonDetail = (pokemon) =>{
    return fetch(pokemon.url)//faz uma requisição para o URL do Pokémon
    .then((response) => response.json())// converte o body para json
    .then(convertDetailPokemon)// converte os detalhes do Pokémon usando a função convertDetailPokemon
};

//O método convertDetailPokemon recebe um objeto pokeDetail, que contém detalhes de um Pokémon, e converte esses detalhes em uma instância da classe Pokemon. Ele extrai informações como número, nome, tipos e foto do Pokémon e as atribui às propriedades correspondentes da instância Pokemon. Isso permite que os dados do Pokémon sejam estruturados de forma consistente para uso posterior.
//A função retorna a instância do Pokémon com as informações convertidas.
function convertDetailPokemon(pokeDetail){
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name
    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types
    pokemon.types = types
    pokemon.type = type
    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default
       pokemon.height = pokeDetail.height
    pokemon.weight = pokeDetail.weight
    pokemon.abilities = pokeDetail.abilities.map((ab) => ab.ability.name)
    return pokemon
}




