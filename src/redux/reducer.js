import {
    CREATE_POKEMON_SUCCESS,
    GET_POKEMONS_SUCCESS,
    GET_POKEMON_BY_NAME_SUCCESS,
    GET_POKEMON_BY_ID_SUCCESS,
    DELETE_POKEMON,
    RESET_DELETED_POKEMON,
    MODIFY_POKEMON_SUCCESS,
    RESET_MODIFY_POKEMON,
    GET_POKEMON_TYPES_SUCCESS,
    RESET_SEARCH_BYNAME,
    GET_POKEMON_SEARCH_SUCCESS
  } from './action-types';

  
  
  const initialState = {
    createdPokemon: null,
    AllPokemonsAPI: [],
    AllPokemonsBD: [],
    pokemonByName: [],
    pokemonByID:null,
    deletedPokemon:false,
    modifyPokemon:false,
    pokemonTypes: [],
    AllPokemonsSearch: []
  };
  
  const pokemonReducer = (state = initialState, action) => {
    switch (action.type) {
      case CREATE_POKEMON_SUCCESS:
        return {
          ...state,
          createdPokemon: action.payload,
        };
      case GET_POKEMONS_SUCCESS:
        return {
          ...state,
          AllPokemonsAPI: action.payload.allPokemonsAPI,
          AllPokemonsBD: action.payload.allPokemonsBD,
        };
        case GET_POKEMON_BY_NAME_SUCCESS:
            return {
              ...state,
              pokemonByName: action.payload.pokemon,
          };
  
        case GET_POKEMON_BY_ID_SUCCESS:
            return {
              ...state,
              pokemonByID: action.payload,
        };
  
        case DELETE_POKEMON:
            return {
              ...state,
              deletedPokemon: true,
        }
        case RESET_DELETED_POKEMON:
        return {
          ...state,
          deletedPokemon: false,
        };
  
        case MODIFY_POKEMON_SUCCESS:
          const { modifiedPokemon } = action.payload;
          const modifiedAllPokemonsAPI = state.AllPokemonsAPI.map((pokemon) =>
            pokemon.id === modifiedPokemon.id ? modifiedPokemon : pokemon
          );
          const modifiedAllPokemonsBD = state.AllPokemonsBD.map((pokemon) =>
            pokemon.id === modifiedPokemon.id ? modifiedPokemon : pokemon
          );
          return {
            ...state,
            AllPokemonsAPI: modifiedAllPokemonsAPI,
            AllPokemonsBD: modifiedAllPokemonsBD,
            modifyPokemon: true,
          };
  
        case RESET_MODIFY_POKEMON:
        return {
          ...state,
          modifyPokemon: false,
        };
  
        case GET_POKEMON_TYPES_SUCCESS:
          return {
            ...state,
            pokemonTypes: action.payload,
          };
        case RESET_SEARCH_BYNAME:
          return{
            ...state,
            pokemonByName:[],  
          };
        case GET_POKEMON_SEARCH_SUCCESS:
          return {
            ...state,
            AllPokemonsSearch: action.payload,
          }
      default:
        return state;
    }
  };
  
  
  export default pokemonReducer;