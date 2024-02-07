import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getPokemons, getPokemonByName, deletePokemon, resetDeletedPokemon, getPokemonTypes } from '../../redux/actions';
import Card from '../Card';
import { Link } from 'react-router-dom';
import './HomePage.css';
import imageFile from '../HomePage/img/logo1.png'

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

  // Cuando el componente ha sido montado, se obtienen los pokémones y los tipos de pokémon disponibles
  componentDidMount() {
    this.props.getPokemons(1);
    this.props.getPokemonTypes();
  }

  // Cuando el componente ha sido actualizado
  componentDidUpdate(prevProps, prevState) {
    // Si se ha eliminado un Pokémon y se muestra el modal, se oculta el modal si no se encontró el Pokémon en la búsqueda
    const { deletedPokemonId, showModal } = this.state;
    const { pokemonByName } = this.props;
    if (deletedPokemonId === null && showModal && (!pokemonByName || pokemonByName.length === 0)) {
      this.setState({ showModal: false });
      this.props.getPokemons(1)
    }
  }

  // Manejador para cambiar de página
  handlePageChange = (page) => {
    this.props.getPokemons(page);
    this.setState({ selectedOption: 'API' });
  };

  // Manejador para cambiar el valor del input de búsqueda
  handleInputChange = (e) => {
    this.setState({ searchName: e.target.value });
  };

  // Manejador para realizar la búsqueda de Pokémon por nombre
  handleSearch = () => {
    const { searchName } = this.state;
    if (searchName.trim() === '') {
      alert('Digite un Pokémon');
    } else {
      this.props.getPokemonByName(searchName);
      if (this.props.pokemonByName[0] === null && this.props.pokemonByName[1] === null) {
        this.setState({ showModal: false });
      } else {
        this.setState({ showModal: true, isSearching: true });
      }
    }
  };

  // Manejador para cerrar el modal
  handleCloseModal = () => {
    this.setState({ showModal: false, isSearching: false });
  };

  // Manejador para eliminar un Pokémon
  handleDelete = (id) => {
    this.props.deletePokemon(id); // Eliminar el pokémon del backend si es necesario
    this.setState({
      deletedPokemonId: id,
      showModal: false, // Cerrar el modal después de eliminar el pokémon
    });
    alert('Eliminado con exito , refresque la pagina')
  };

  // Manejador para cambiar la opción seleccionada en el primer select (Mostrar todos o API o BD)
  handleSelectChange = (e) => {
    this.setState({ selectedOption: e.target.value });
  };

  // Manejador para cambiar el tipo seleccionado en el primer select
  handleTypeSelectChange = (e) => {
    this.setState({ selectedType: e.target.value });
  };

  // Manejador para cambiar el tipo seleccionado en el segundo select
  handleType2SelectChange = (e) => {
    this.setState({ selectedTypeFilter: e.target.value });
  };

  render() {
    const { AllPokemonsAPI, AllPokemonsBD, pokemonByName, pokemonTypes } = this.props;
    const { selectedOption, selectedType, selectedTypeFilter } = this.state;

    // Combinar todos los pokémones de la API y de la base de datos
    const allPokemons = [...AllPokemonsBD, ...AllPokemonsAPI];
    let filteredPokemons = [];

    // Filtrar los pokémones según la opción seleccionada en el primer select (Mostrar todos, API o BD)
    if (selectedOption === 'API') {
      filteredPokemons = AllPokemonsAPI.filter((pokemon) => pokemon.origen === 'API');
    } else if (selectedOption === 'BD') {
      filteredPokemons = AllPokemonsBD.filter((pokemon) => pokemon.origen === 'BD');
    } else {
      filteredPokemons = allPokemons;
    }

    // Filtrar por tipo si se ha seleccionado uno en el primer select
    if (selectedType) {
      filteredPokemons = filteredPokemons.filter((pokemon) => pokemon.types.includes(selectedType));
    } else if (selectedTypeFilter) {
      // Filtrar por tipo del segundo select
      filteredPokemons = filteredPokemons.filter((pokemon) => pokemon.types.includes(selectedTypeFilter));
    }

    // Filtrar por ambos tipos seleccionados (selectedType y selectedTypeFilter)
    if (selectedType && selectedTypeFilter) {
      filteredPokemons = filteredPokemons.filter(
        (pokemon) => pokemon.types.includes(selectedType) && pokemon.types.includes(selectedTypeFilter)
      );
    }

    // Eliminar el bloque de renderizado de los pokémones con origen "BD" en "Mostrar todos"
    const currentPage = this.props.match.params.page || 1;
    const showBDPokemons = currentPage === 1;

    if (!showBDPokemons) {
      filteredPokemons = filteredPokemons.filter((pokemon) => pokemon.origen !== 'BD');
    }
    console.log(pokemonByName);
    return (
      <div className="pokemon">
        <img  className='logo' src={imageFile} alt='imagen'></img>
        <div className="button-container">
          <Link to="/create">
            <button className="pokemon-button">Crear Pokémon</button>
          </Link>
        </div>
        <div className="pokemon-filter-section">
          <select
            value={selectedOption}
            onChange={this.handleSelectChange}
            className="pokemon-filter-select"
          >
            <option value="">Mostrar todos</option>
            <option value="API">API</option>
            <option value="BD">BD</option>
          </select>
          <select
            value={selectedType}
            onChange={this.handleTypeSelectChange}
            className="pokemon-filter-select"
          >
            <option value="">Mostrar todos los tipos</option>
            {pokemonTypes.map((type, index) => (
              <option value={type} key={index}>
                {type}
              </option>
            ))}
          </select>

          <select
            value={selectedTypeFilter}
            onChange={this.handleType2SelectChange}
            className="pokemon-filter-select"
          >
            <option value="">Mostrar todos los tipos</option>
            {pokemonTypes.map((type, index) => (
              <option value={type} key={index}>
                {type}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={this.state.searchName}
            onChange={this.handleInputChange}
            className="pokemon-filter-input"
          />
          <button onClick={this.handleSearch} className="pokemon-filter-button">
            Buscar
          </button>
        </div>
        <div className="pokemon-list">
          {showBDPokemons &&
            filteredPokemons.map((pokemon) => (
              <Link to={`/detail/${pokemon.id}`} key={pokemon.id} className="pokemon-link">
                <Card
                  key={pokemon.id}
                  id={pokemon.id}
                  image={pokemon.image}
                  name={pokemon.name}
                  types={pokemon.types}
                />
              </Link>
            ))}
          {!showBDPokemons &&
            filteredPokemons.map((pokemon) => (
              <Link to={`/detail/${pokemon.id}`} key={pokemon.id} className="pokemon-link" >
                <Card
                  key={pokemon.id}
                  id={pokemon.id}
                  image={pokemon.image}
                  name={pokemon.name}
                  types={pokemon.types}
                />
              </Link>
            ))}
        </div>
        {this.state.showModal && (
          <div className="pokemon-modal">
            <div className="pokemon-modal-content">
              {pokemonByName.filter((pokemon) => pokemon !== null).map((pokemon, index) => (
                <div key={index} className="pokemon-details">
                  {pokemon ? (
                    <div className='pokemon-modal-results'>
                      <div className='pokemon-modal-tittle'>
                        <img src={pokemon.image} alt={pokemon.name} />
                        <h2>{pokemon.name}</h2>
                      </div>
                      {pokemon.origen === 'API' ? (
                        <div className='pokemon-modal-item'>
                          <p>ID: {pokemon.id}</p>
                          <p>Origen: {pokemon.origen}</p>
                          {pokemon.stats.map((stat, index) => (
                            <p key={index}>
                              {stat.name}: {stat.value}
                            </p>
                          ))}
                          <p>Types: {pokemon.types.join(', ')}</p>
                        </div>
                      ) : (
                        <div className='pokemon-modal-item'>
                          <p>ID: {pokemon.id}</p>
                          <p>HP: {pokemon.hp}</p>
                          <p>Attack: {pokemon.attack}</p>
                          <p>Defense: {pokemon.defense}</p>
                          <p>Speed: {pokemon.speed}</p>
                          <p>Height: {pokemon.height}</p>
                          <p>Weight: {pokemon.weight}</p>
                          <p>Origen: {pokemon.origen}</p>
                          <p>Types: {pokemon.types.join(', ')}</p>
                          <Link to={`/modify/${pokemon.id}`}>
                            <button>Modificar Pokémon</button>
                          </Link>
                          <button onClick={() => this.handleDelete(pokemon.id)}>
                            Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              ))}
              <div className="modal-close-button" onClick={this.handleCloseModal}>
                X
              </div>
            </div>
          </div>
)}


        <div className="pokemon-pagination-buttons">
          <button onClick={() => this.handlePageChange(1)}>1</button>
          <button onClick={() => this.handlePageChange(2)}>2</button>
          <button onClick={() => this.handlePageChange(3)}>3</button>
          <button onClick={() => this.handlePageChange(4)}>4</button>
          <button onClick={() => this.handlePageChange(5)}>5</button>
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
  pokemonTypes: state.pokemonTypes, // Agregado el estado de los tipos de Pokémon
});

const mapDispatchToProps = {
  getPokemons,
  getPokemonByName,
  deletePokemon,
  resetDeletedPokemon,
  getPokemonTypes, // Agregada la acción para obtener los tipos de Pokémon
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
