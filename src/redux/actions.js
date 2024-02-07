import axios from 'axios';
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
    RESET_SEARCH_BYNAME
  } from './action-types';
//CREATE POKEMON
export const createPokemonSuccess = (pokemon) => ({
    type: CREATE_POKEMON_SUCCESS,
    payload: pokemon,
  });
  
  //GET ALL POKEMONS 
  const getPokemonsSuccess = (allPokemonsAPI, allPokemonsBD) => ({
    type: GET_POKEMONS_SUCCESS,
    payload: {
      allPokemonsAPI,
      allPokemonsBD,
    },
  });
  
  //GET POKEMON BY NAME
  const getPokemonByNameSuccess = (pokemon) => ({
    type: GET_POKEMON_BY_NAME_SUCCESS,
    payload: {
      pokemon,
    },
  });
  
  //GET POKEMON BY ID
  export const getPokemonByIdSuccess = (pokemonDetails) => ({
    type: GET_POKEMON_BY_ID_SUCCESS,
    payload: pokemonDetails,
  });
  
  //RESET DELETE POKEMON
  export const resetDeletedPokemon = () => ({
    type: RESET_DELETED_POKEMON,
  });
  
  //RESET MODIFY POKEMON
  export const modifyPokemonSuccess = (modifiedPokemon) => ({
    type: MODIFY_POKEMON_SUCCESS,
    payload: modifiedPokemon,
    
  });
  
  export const resetModifyPokemon = () => ({
    type: RESET_MODIFY_POKEMON,
  });
  
  //GET TYPES 
  export const getPokemonTypesSuccess = (types) => ({
    type: GET_POKEMON_TYPES_SUCCESS,
    payload: types,
  });

  export const resetSearch = () => ({
    type: RESET_SEARCH_BYNAME,
  });
  
  
  //==========================
  
  //CREATE
  export const createPokemon = (pokemonData) => {
    return async (dispatch) => {
      try {
        const response = await axios.post('http://localhost:3001/pokemons/new', pokemonData);
        const createdPokemon = response.data;
  
        dispatch(createPokemonSuccess(createdPokemon));
      } catch (error) {
        console.error(error);
        // Manejo de error en caso de que la petición falle
      }
    };
  };
  
  //GET ALL POKEMONS
  export const getPokemons = (page) => {
    return async (dispatch) => {
      try {
        const response = await axios.get(`http://localhost:3001/pokemons/main/${page}`);
        const pokemons = response.data;
  
        // Mapear los resultados según su origen y asignarlos a los initial states correspondientes
        const allPokemonsAPI = [];
        const allPokemonsBD = [];
  
        pokemons.forEach((pokemon) => {
          if (pokemon.origen === 'API') {
            allPokemonsAPI.push(pokemon);
          } else if (pokemon.origen === 'BD') {
            allPokemonsBD.push(pokemon);
          }
        });
  
        dispatch(getPokemonsSuccess(allPokemonsAPI, allPokemonsBD));
      } catch (error) {
        console.error(error);
        // Manejo de errores o lanzamiento de acciones de error
      }
    };
  };
  
  //GET POKEMON BY NAME
  export const getPokemonByName = (name) => {
    return async (dispatch) => {
      try {
        const response = await axios.get(`http://localhost:3001/pokemons/?name=${name}`);
        const pokemon = response.data;
  
        dispatch(getPokemonByNameSuccess(pokemon));
      } catch (error) {
        console.error(error);
        // Manejo de errores o lanzamiento de acciones de error
      }
    };
  };
  
  
  //GET POKEMON BY ID
  export const getPokemonById = (id) => {
    return async (dispatch) => {
      try {
        const response = await axios.get(`http://localhost:3001/pokemons/${id}`);
        const pokemonDetails = response.data;
        dispatch(getPokemonByIdSuccess(pokemonDetails));
      } catch (error) {
        console.error(error);
        // Manejo de error en caso de que la petición falle
      }
    };
  };
  
  //DELETE POKEMON
  
  export const deletePokemon = (id) => {
    return async (dispatch) => {
      try {
        await axios.delete(`http://localhost:3001/pokemons/delete/${id}`);
        dispatch({ type: DELETE_POKEMON });
      } catch (error) {
        console.error(error);
        // Manejo de error en caso de que la petición falle
      }
    };
  };
  
  //MODIFY POKEMON 
  
  export const modifyPokemon = (id, modifiedData) => {
    return async (dispatch) => {
      try {
        await axios.put(`http://localhost:3001/pokemons/put/${id}`, modifiedData);
  
        // Después de modificar el Pokémon, obtener el Pokémon modificado por su ID
        const response = await axios.get(`http://localhost:3001/pokemons/${id}`);
        const modifiedPokemon = response.data;
  
        dispatch(modifyPokemonSuccess(modifiedPokemon));
      } catch (error) {
        console.error(error);
        // Manejo de error en caso de que la petición falle
      }
    };
  };
  
  
  //GET TYPES
  
  export const getPokemonTypes = () => {
    return async (dispatch) => {
      try {
        const response = await axios.get('http://localhost:3001/types');
        const types = response.data;
  
        dispatch(getPokemonTypesSuccess(types));
      } catch (error) {
        console.error(error);
        // Manejo de error en caso de que la petición falle
      }
    };
  };
