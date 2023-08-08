const submitBtn = document.getElementById("submit");
const input = document.querySelector("input");
const pokemons = document.getElementById("pokemons");
const nameContainer = document.getElementById("name-container");
const natureContainer = document.getElementById("nature-container");
const imgContainer = document.getElementById("img-container");
const evolutionContainer = document.getElementById("evolution-container");

let pokemonArr = [];
const allPoke = "https://pokeapi.co/api/v2/pokemon/?limit=100000&offset=0";

submitBtn.onclick = function(event){
    event.preventDefault();
    pokemonArr = [];
    pokemons.innerHTML = "";
    imgContainer.innerHTML = "";
    fetchData();
}

pokemons.onchange = function(){
    const pokemonURL = "https://pokeapi.co/api/v2/pokemon/" + pokemons.value;
    imgContainer.innerHTML = "";
    showData(pokemonURL);
}

function showData(pokemonURL){
    fetch(pokemonURL)
    .then(function(response){
        return response.json();
    })
    .then(function(pokeJSON){
        nameContainer.innerHTML = "Name: " + pokemons.value;
        natureContainer.innerHTML = "Type(s): " + pokeJSON.types.map(typeData => typeData.type.name);
        const img = document.createElement("img");
        img.src = pokeJSON.sprites.front_default;
        imgContainer.appendChild(img);

        //Evolutions
        const speciesURL = pokeJSON.species.url;
        fetch(speciesURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (speciesData) {
            const evolutionChainURL = speciesData.evolution_chain.url;
            fetch(evolutionChainURL)
            .then(function (response) {
                return response.json();
            })
            .then(function (evolutionChainData) {
                console.log(evolutionChainData);
                // Extract evolution information
                let chain = evolutionChainData.chain;
                const evolutions = [];

                while (chain){
                    evolutions.push(chain.species.name);
                    chain = chain.evolves_to[0]; // Move to the next evolution stage
                }

                evolutionContainer.innerHTML = "Evolutions (in order): " + evolutions;
            });
        });
    });
}

function fetchData(){
    fetch(allPoke)
    .then(function(response){
        return response.json();
    })
    .then(function(pokeJSON){
        for(let i = 0; i < pokeJSON.results.length; i++){ //Get all indexes of pokemons that start with the first couple of letters of the user's input
            if(pokeJSON.results[i].name.substring(0,input.value.length) == input.value){
                pokemonArr.push(pokeJSON.results[i].name);
            }   
        }
        pokemonArr.sort();
        for(let i = 0; i < pokemonArr.length; i++){ //Set all array values to the dropdown menu values
            const pokemon = document.createElement("option");
            pokemon.text = pokemonArr[i];
            pokemon.value = pokemonArr[i];
            pokemons.appendChild(pokemon);
        }
        pokemons.onchange();
    });
}