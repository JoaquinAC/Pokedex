import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getPokemons, getPokemonByName, deletePokemon, resetDeletedPokemon, getPokemonTypes, getPokemonSearch } from '../../redux/actions';
import Card from '../Card';
import { Link } from 'react-router-dom';
import './HomePage.css';
import imageFile from '../HomePage/img/logo1.png';

class HomePage extends Component {

  state = {
    searchName: '',
    showModal: false,
    deletedPokemonId: null,
    selectedOption: '',
    selectedType: '',
    selectedTypeFilter: '',
    isSearching: false,
  };

  componentDidMount() {
    this.props.getPokemons(1);
    this.props.getPokemonTypes();
    this.props.getPokemonSearch();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.searchName.length === 0 && prevState.searchName.length > 0) {
      this.props.getPokemons(1);
    }
  }

  handleInputChange = (e) => {
    const searchValue = e.target.value.toLowerCase();
    this.setState({ searchName: searchValue });

    // if (searchValue.length > 0) {
    //   this.props.getPokemonSearch();
    // } else {
    //   this.props.getPokemons(1);
    // }
  };

  handlePageChange = (page) => {
    if (!this.state.searchName) {
      this.props.getPokemons(page);
    }
  };

  handleSelectChange = (e) => {
    this.setState({ selectedOption: e.target.value });
  };

  handleTypeSelectChange = (e) => {
    this.setState({ selectedType: e.target.value });
  };

  handleType2SelectChange = (e) => {
    this.setState({ selectedTypeFilter: e.target.value });
  };

  handleCloseModal = () => {
    this.setState({ showModal: false, isSearching: false });
  };

  handleDelete = (id) => {
    this.props.deletePokemon(id);
    this.setState({ deletedPokemonId: id, showModal: false });
    alert('Eliminado con exito, refresque la pagina');
  };

  render() {
    const { pokemonTypes, AllPokemonsSearch } = this.props;
    const { searchName, selectedOption, selectedType, selectedTypeFilter } = this.state;
    
    let pokemonsToDisplay = searchName.length > 0
    ? AllPokemonsSearch.filter(pokemon => pokemon.name.toLowerCase().includes(searchName))
    : [...this.props.AllPokemonsBD, ...this.props.AllPokemonsAPI];

    if (selectedOption === 'API') {
      pokemonsToDisplay = pokemonsToDisplay.filter((pokemon) => pokemon.origen === 'API');
    } else if (selectedOption === 'BD') {
      pokemonsToDisplay = pokemonsToDisplay.filter((pokemon) => pokemon.origen === 'BD');
    }

    if (selectedType) {
      pokemonsToDisplay = pokemonsToDisplay.filter((pokemon) => pokemon.types.includes(selectedType));
    }

    if (selectedTypeFilter) {
      pokemonsToDisplay = pokemonsToDisplay.filter((pokemon) => pokemon.types.includes(selectedTypeFilter));
    }

    return (
      <div className="pokemon">
        <img className='logo' src={imageFile} alt='imagen'></img>
        <div className="button-container">
          <Link to="/create">
            <button className="pokemon-button">Crear Pokémon</button>
          </Link>
        </div>
        <div className="pokemon-filter-section">
          <select value={selectedOption} onChange={this.handleSelectChange} className="pokemon-filter-select">
            <option value="">Mostrar todos</option>
            <option value="API">API</option>
            <option value="BD">BD</option>
          </select>
          <select value={selectedType} onChange={this.handleTypeSelectChange} className="pokemon-filter-select">
            <option value="">Mostrar todos los tipos</option>
            {pokemonTypes.map((type, index) => (
              <option value={type} key={index}>{type}</option>
            ))}
          </select>
          <select value={selectedTypeFilter} onChange={this.handleType2SelectChange} className="pokemon-filter-select">
            <option value="">Mostrar todos los tipos</option>
            {pokemonTypes.map((type, index) => (
              <option value={type} key={index}>{type}</option>
            ))}
          </select>
          <input type="text" value={this.state.searchName} onChange={this.handleInputChange} className="pokemon-filter-input" />
        </div>
        <div className="pokemon-list">
          {pokemonsToDisplay.map((pokemon) => (
            <Link to={`/detail/${pokemon.id}`} key={pokemon.id} className="pokemon-link">
              <Card id={pokemon.id} image={pokemon.image} name={pokemon.name} types={pokemon.types} />
            </Link>
          ))}
        </div>
        {/* Asumiendo que se eliminó la funcionalidad del modal y otros elementos relacionados con la búsqueda anterior */}
        <div className="pokemon-pagination-buttons">
          {this.state.searchName.length === 0 && [1, 2, 3, 4, 5].map(page => (
            <button onClick={() => this.handlePageChange(page)} key={page}>{page}</button>
          ))}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  AllPokemonsAPI: state.AllPokemonsAPI,
  AllPokemonsBD: state.AllPokemonsBD,
  pokemonByName: state.pokemonByName,
  deletedPokemon: state.deletedPokemon,
  pokemonTypes: state.pokemonTypes,
  AllPokemonsSearch: state.AllPokemonsSearch,
});

const mapDispatchToProps = {
  getPokemons,
  getPokemonByName,
  deletePokemon,
  resetDeletedPokemon,
  getPokemonTypes,
  getPokemonSearch,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
