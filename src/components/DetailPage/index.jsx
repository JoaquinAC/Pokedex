import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  getPokemonById,
  deletePokemon,
  resetDeletedPokemon,
  modifyPokemon,
  resetModifyPokemon,
  getPokemonTypes,
} from '../../redux/actions';
import '../DetailPage/DetailPage.css';

class DetailPage extends Component {
  // Estado local del componente
  state = {
    name: '',
    image: '',
    hp: '',
    attack: '',
    defense: '',
    speed: '',
    height: '',
    weight: '',
    type1: '',
    type2: '',
    selectedType1: '',
    selectedType2: '',
    isDeleteMessageVisible: false,
    isModifyMessageVisible: false,
    isModalOpen: false,
  };

  // Método que se ejecuta después de que el componente ha sido montado en el DOM
  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.getPokemonById(id);
    this.props.getPokemonTypes();
  }

  // Método que se ejecuta cuando las props o el estado del componente cambian
  componentDidUpdate(prevProps) {
    // Si se ha eliminado un Pokémon, muestra un mensaje y redirige a la página de inicio después de 1 segundo
    if (prevProps.deletedPokemon !== this.props.deletedPokemon && this.props.deletedPokemon) {
      this.showDeleteMessage();
    }

    // Si se ha modificado un Pokémon, muestra un mensaje, obtiene el Pokémon actualizado y redirige a la página de inicio después de 1 segundo
    if (prevProps.modifyPokemon !== this.props.modifyPokemon && this.props.modifyPokemon) {
      this.showModifyMessage();
      const { id } = this.props.match.params;
      this.props.getPokemonById(id);
    }
  }

  // Método que maneja el evento de eliminación de un Pokémon
  handleDelete = () => {
    const { id } = this.props.match.params;
    this.props.deletePokemon(id);
  };

  // Método que maneja el evento de modificación de un Pokémon
  handleModify = () => {
    const { id } = this.props.match.params;
    const { name, hp, attack, defense, speed, height, weight, selectedType1, selectedType2 } = this.state;

    // Objeto que contendrá los datos modificados del Pokémon
    const modifiedData = {};

    // Convertir el nombre a minúsculas y eliminar espacios en blanco iniciales y finales
    const nombre = name.toLowerCase();
    if (name) {
      modifiedData.name = nombre.trim();
    }
    // Convertir los valores numéricos a enteros
    if (hp) {
      modifiedData.hp = parseInt(hp);
    }
    if (attack) {
      modifiedData.attack = parseInt(attack);
    }
    if (defense) {
      modifiedData.defense = parseInt(defense);
    }
    if (speed) {
      modifiedData.speed = parseInt(speed);
    }
    if (height) {
      modifiedData.height = parseInt(height);
    }
    if (weight) {
      modifiedData.weight = parseInt(weight);
    }
    // Crear un array de tipos modificados si se han seleccionado nuevos tipos
    if (selectedType1 || selectedType2) {
      modifiedData.types = [];
      if (selectedType1) {
        modifiedData.types.push(selectedType1);
      }
      if (selectedType2) {
        modifiedData.types.push(selectedType2);
      }
    }

    // Llamar a la acción para modificar el Pokémon en el backend
    this.props.modifyPokemon(id, modifiedData);

    // Actualizar el estado local del componente con los datos modificados
    this.setState({
      name: modifiedData.name || '',
      hp: modifiedData.hp || '',
      attack: modifiedData.attack || '',
      defense: modifiedData.defense || '',
      speed: modifiedData.speed || '',
      height: modifiedData.height || '',
      weight: modifiedData.weight || '',
      selectedType1: modifiedData.types && modifiedData.types.length > 0 ? modifiedData.types[0] : '',
      selectedType2: modifiedData.types && modifiedData.types.length > 1 ? modifiedData.types[1] : '',
      isModalOpen: false, // Cerrar el modal después de modificar el Pokémon
    });
  };

  // Método que maneja los cambios en los campos de entrada del formulario
  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  // Métodos que manejan los cambios en los campos de selección de tipo
  handleType1Change = (e) => {
    this.setState({ selectedType1: e.target.value });
  };

  handleType2Change = (e) => {
    this.setState({ selectedType2: e.target.value });
  };

  // Método que maneja el evento de volver a la página de inicio
  handleGoBack = () => {
    this.props.history.push('/home');
  };

  // Método que abre el modal para modificar el Pokémon
  handleOpenModal = () => {
    this.setState({ isModalOpen: true });
  };

  // Método que cierra el modal para modificar el Pokémon
  handleCloseModal = () => {
    this.setState({ isModalOpen: false });
  };

  // Método que muestra el mensaje de eliminación con éxito
  showDeleteMessage = () => {
    this.setState({ isDeleteMessageVisible: true }, () => {
      setTimeout(() => {
        this.setState({ isDeleteMessageVisible: false });
        this.props.resetDeletedPokemon();
        this.props.history.push('/home');
      }, 1000);
    });
  };

  // Método que muestra el mensaje de modificación con éxito
  showModifyMessage = () => {
    this.setState({ isModifyMessageVisible: true }, () => {
      setTimeout(() => {
        this.setState({ isModifyMessageVisible: false });
        this.props.resetModifyPokemon();
        this.props.history.push('/home');
      }, 1000);
    });
  };

  render() {
    const { pokemon, pokemonTypes } = this.props;

    if (!pokemon) {
      return <div>Loading...</div>;
    }

    let apiPokemon, bdPokemon;

    // Separar el Pokémon de la API y el Pokémon de la BD si es un array
    if (Array.isArray(pokemon)) {
      apiPokemon = pokemon.find((p) => p.origen === 'API');
      bdPokemon = pokemon.find((p) => p.origen === 'BD');
    } else {
      apiPokemon = pokemon.origen === 'API' ? pokemon : null;
      bdPokemon = pokemon.origen === 'BD' ? pokemon : null;
    }

    const { isDeleteMessageVisible, isModifyMessageVisible, isModalOpen } = this.state;

    return (
      <div className="principal-detail-container">
        <button className="comeback-button" onClick={this.handleGoBack}>
          X
        </button>

        <div className="detail-allitems-container">
          {/* Mostrar información del Pokémon de la API */}
          {apiPokemon && (
            <div className="detail-item-container">
              <div className="detail-image-item-container">
                <img src={apiPokemon.image} alt={apiPokemon.name} />
                <div className="detail-name">{apiPokemon.name}</div>
              </div>
              <div className="detail-stats">
                <div className="stat-item">
                  <strong>id:</strong> {apiPokemon.id}
                </div>
                {apiPokemon.stats.map((stat) => (
                  <div className="stat-item" key={stat.name}>
                    <strong>{stat.name}:</strong> {stat.value}
                  </div>
                ))}
                <div className="stat-item">
                  <strong>Types:</strong> {apiPokemon.types.join(', ')}
                </div>
                <div className="stat-item">
                  <strong>Origen:</strong> {apiPokemon.origen}
                </div>
              </div>
            </div>
          )}

          {/* Mostrar información del Pokémon de la BD */}
          {bdPokemon && (
            <div className="detail-item-container">
              {bdPokemon.image && (
                <div className="detail-image-item-container">
                  <img src={bdPokemon.image} alt={bdPokemon.name} />
                  <div className="detail-name">{bdPokemon.name}</div>
                </div>
              )}
              <div className="detail-stats">
                <div className="stat-item">
                  <strong>id:</strong> {bdPokemon.id}
                </div>
                {bdPokemon.hp && (
                  <div className="stat-item">
                    <strong>hp:</strong> {bdPokemon.hp}
                  </div>
                )}
                {bdPokemon.attack && (
                  <div className="stat-item">
                    <strong>attack:</strong> {bdPokemon.attack}
                  </div>
                )}
                {bdPokemon.defense && (
                  <div className="stat-item">
                    <strong>defense:</strong> {bdPokemon.defense}
                  </div>
                )}
                {bdPokemon.speed && (
                  <div className="stat-item">
                    <strong>speed:</strong> {bdPokemon.speed}
                  </div>
                )}
                {bdPokemon.height && (
                  <div className="stat-item">
                    <strong>height:</strong> {bdPokemon.height}
                  </div>
                )}
                {bdPokemon.weight && (
                  <div className="stat-item">
                    <strong>weight:</strong> {bdPokemon.weight}
                  </div>
                )}
                {bdPokemon.types && (
                  <div className="stat-item">
                    <strong>Types:</strong> {bdPokemon.types.join(', ')}
                  </div>
                )}
                <div className="stat-item">
                  <strong>Origen:</strong> {bdPokemon.origen}
                </div>
                <button onClick={this.handleOpenModal}>Modificar</button>
              </div>
            </div>
          )}
        </div>

        {/* Mostrar mensajes de éxito después de la eliminación o modificación */}
        {isDeleteMessageVisible && <div>Eliminado con éxito</div>}
        {isModifyMessageVisible && <div>Pokemon modificado con éxito</div>}

        {/* Modal para modificar */}
        {bdPokemon && (
          <>
            {isModalOpen && (
              <div className="modal-container">
                <form className="modal-form" onSubmit={this.handleModify}>
                  <label className="modal-label">Nombre:</label>
                  <input
                    className="modal-input"
                    type="text"
                    name="name"
                    value={this.state.name}
                    onChange={this.handleInputChange}
                  />

                  <br />
                  <label className="modal-label">URL de la imagen:</label>
                  <input
                    className="modal-input"
                    type="text"
                    name="image"
                    value={this.state.image}
                    onChange={this.handleInputChange}
                  />

                  <br />
                  <label className="modal-label">HP:</label>
                  <input
                    className="modal-input"
                    type="number"
                    name="hp"
                    value={this.state.hp}
                    onChange={this.handleInputChange}
                  />

                  <br />
                  <label className="modal-label">Ataque:</label>
                  <input
                    className="modal-input"
                    type="number"
                    name="attack"
                    value={this.state.attack}
                    onChange={this.handleInputChange}
                  />

                  <br />
                  <label className="modal-label">Defensa:</label>
                  <input
                    className="modal-input"
                    type="number"
                    name="defense"
                    value={this.state.defense}
                    onChange={this.handleInputChange}
                  />

                  <br />
                  <label className="modal-label">Velocidad:</label>
                  <input
                    className="modal-input"
                    type="number"
                    name="speed"
                    value={this.state.speed}
                    onChange={this.handleInputChange}
                  />

                  <br />
                  <label className="modal-label">Altura:</label>
                  <input
                    className="modal-input"
                    type="number"
                    name="height"
                    value={this.state.height}
                    onChange={this.handleInputChange}
                  />

                  <br />
                  <label className="modal-label">Peso:</label>
                  <input
                    className="modal-input"
                    type="number"
                    name="weight"
                    value={this.state.weight}
                    onChange={this.handleInputChange}
                  />
                  <br />
                  <label className="modal-label">Tipo 1:</label>
                  <select
                    className="modal-select"
                    value={this.state.selectedType1}
                    onChange={this.handleType1Change}
                  >
                    <option value="">Seleccionar tipo</option>
                    {pokemonTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>

                  <br />
                  <label className="modal-label">Tipo 2:</label>
                  <select
                    className="modal-select"
                    value={this.state.selectedType2}
                    onChange={this.handleType2Change}
                  >
                    <option value="">Seleccionar tipo</option>
                    {pokemonTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <br />
                  <button className="modal-button" type="submit">
                    Modificar
                  </button>
                  <button className="modal-button" type="button" onClick={this.handleCloseModal}>
                    Cancelar
                  </button>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  pokemon: state.pokemonByID,
  pokemonTypes: state.pokemonTypes,
  deletedPokemon: state.deletedPokemon,
  modifyPokemon: state.modifyPokemon,
});

const mapDispatchToProps = {
  getPokemonById,
  deletePokemon,
  resetDeletedPokemon,
  modifyPokemon,
  resetModifyPokemon,
  getPokemonTypes,
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailPage);
