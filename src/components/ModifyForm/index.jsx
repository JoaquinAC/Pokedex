import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { getPokemonTypes, modifyPokemon, resetModifyPokemon } from '../../redux/actions';
import imageFile from '../HomePage/img/logo1.png'
import '../ModifyForm/ModifyForm.css'
class ModifyForm extends Component {
    state = {
        name: '',
        image: '',
        hp: '',
        attack: '',
        defense: '',
        speed: '',
        height: '',
        weight: '',
        selectedType1: '',
        selectedType2: '',
        showSuccessMessage: false,
        redirectToHome: false,
        formError: false,
        isSubmitting: false,
        formFilled: false, // Nuevo campo agregado
      };

  componentDidMount() {
    // Ejecutar la acción getPokemonTypes para obtener los tipos de Pokémon
    this.props.getPokemonTypes();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.showSuccessMessage && !this.state.showSuccessMessage) {
      setTimeout(() => {
        this.props.resetModifyPokemon();
        this.setState({ redirectToHome: true });
      }, 1000);
    }
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value, formFilled: !!value });
  };

  handleType1Change = (e) => {
    this.setState({ selectedType1: e.target.value });
  };

  handleType2Change = (e) => {
    this.setState({ selectedType2: e.target.value });
  };

  handleModify = (e) => {
    e.preventDefault();
    this.setState({ formError: false });
    const { id } = this.props.match.params;
    const {
      name,
      image,
      hp,
      attack,
      defense,
      speed,
      height,
      weight,
      selectedType1,
      selectedType2,
    } = this.state;
  
    // Verificar que al menos uno de los campos tenga un valor
    if (!name && !image && !hp && !attack && !defense && !speed && !height && !weight && !selectedType1 && !selectedType2) {
      this.setState({ formError: true });
      return;
    }
  
    const modifiedData = {};
    
    const nombre = name.toLowerCase()
    if (name) {
      modifiedData.name = nombre.trim();
    }
    if (image) {
      modifiedData.image = image.trim();
    }
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
    if (selectedType1) {
      modifiedData.types = [selectedType1];
    }
    if (selectedType2) {
      modifiedData.types = modifiedData.types ? [...modifiedData.types, selectedType2] : [selectedType2];
    }
  
    this.setState({ isSubmitting: true });
  
    this.props.modifyPokemon(id, modifiedData);
  
    setTimeout(() => {
      this.setState({ isSubmitting: false, showSuccessMessage: true }, () => {
        setTimeout(() => {
          this.setState({ showSuccessMessage: false });
          this.props.resetModifyPokemon();
          this.setState({ redirectToHome: true });
        }, 1000);
      });
    }, 1000);
  };
  
  
  

  handleCancel = () => {
    this.setState({ redirectToHome: true });
  };

  render() {
    const { pokemonTypes } = this.props;
    const { showSuccessMessage, redirectToHome, isSubmitting , formError } = this.state;
    


    if (redirectToHome) {
      return <Redirect to="/home" />;
    }

    return (
      <div className="modify-form-container">
        <div className="form-header">
          <img src={imageFile} alt="logo" className="form-logo" />
        </div>
        <form className="modify-form" onSubmit={this.handleModify}>
          <div className="modify-form-item">
            <label>Nombre:</label>
            <input
              type="text"
              name="name"
              value={this.state.name}
              onChange={this.handleInputChange}
            />
          </div>
          <br />
          <div className="modify-form-item">
            <label>URL de la imagen:</label>
            <input
              type="text"
              name="image"
              value={this.state.image}
              onChange={this.handleInputChange}
            />
          </div>
          <br />
          <div className="modify-form-item">
            <label>HP:</label>
            <input
              type="number"
              name="hp"
              value={this.state.hp}
              onChange={this.handleInputChange}
            />
          </div>
          <br />
          <div className="modify-form-item">
            <label>Ataque:</label>
            <input
              type="number"
              name="attack"
              value={this.state.attack}
              onChange={this.handleInputChange}
            />
          </div>
          <br />
          <div className="modify-form-item">
            <label>Defensa:</label>
            <input
              type="number"
              name="defense"
              value={this.state.defense}
              onChange={this.handleInputChange}
            />
          </div>
          <br />
          <div className="modify-form-item">
            <label>Velocidad:</label>
            <input
              type="number"
              name="speed"
              value={this.state.speed}
              onChange={this.handleInputChange}
            />
          </div>
          <br />
          <div className="modify-form-item">
            <label>Altura:</label>
            <input
              type="number"
              name="height"
              value={this.state.height}
              onChange={this.handleInputChange}
            />
          </div>
          <br />
          <div className="modify-form-item">
            <label>Peso:</label>
            <input
              type="number"
              name="weight"
              value={this.state.weight}
              onChange={this.handleInputChange}
            />
          </div>
          <br />
          <div className="modify-form-item">
            <label>Tipo 1:</label>
            <select value={this.state.selectedType1} onChange={this.handleType1Change}>
              <option value="">Seleccionar tipo</option>
              {pokemonTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <br />
          <div className="modify-form-item">
            <label>Tipo 2:</label>
            <select value={this.state.selectedType2} onChange={this.handleType2Change}>
              <option value="">Seleccionar tipo</option>
              {pokemonTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <br />
          <div className='button-container'>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Modificar"}
            </button>
            <button onClick={this.handleCancel}>Cancelar</button>
          </div>
          {!this.state.formFilled && !isSubmitting && <p>Rellene uno de los campos</p>}
          {showSuccessMessage && !isSubmitting && !formError && <p>Cambios realizados con éxito</p>}
        </form>
      </div>
    );
    
    
  }
}

const mapStateToProps = (state) => ({
  pokemonTypes: state.pokemonTypes,
});

const mapDispatchToProps = {
  getPokemonTypes,
  modifyPokemon,
  resetModifyPokemon,
};

export default connect(mapStateToProps, mapDispatchToProps)(ModifyForm);
