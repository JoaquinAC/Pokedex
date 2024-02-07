import { createStore, applyMiddleware, compose } from "redux";
import thunkMiddleware from 'redux-thunk';
import pokemonReducer from "./reducer";


const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // esta línea es para conectar con la extensión del navegador >>> REDUX DEVTOOLS

const store = createStore(
    pokemonReducer,
    composeEnhancer(applyMiddleware(thunkMiddleware))
);

export default store;