import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createPokemon, getPokemonTypes } from '../../redux/actions';
import '../FormPage/FormPage.css'
import Myimage from '../HomePage/img/logo1.png'

class FormPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      image: '',
      hp: '',
      attack: '',
      defense: '',
      speed: '',
      height: '',
      weight: '',
      type1: '', // Nuevo campo agregado
      type2: '', // Nuevo campo agregado
      error: '',
      success: false,
      showModal: false,
    };
  }

  componentDidMount() {
    this.props.getPokemonTypes();
  }

  handleCloseForm = () => {
    this.props.history.push('/home');
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      error: '',
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    const { name, image, hp, attack, defense, speed, height, weight, type1, type2 } = this.state;
    
      // Validar que los campos no estén vacíos
  if (name === '') {
    alert('Por favor, ingresa un nombre');
    return;
  }

  if (image === '') {
    alert('Por favor, ingresa una URL de imagen');
    return;
  }

  if (hp === '') {
    alert('Por favor, ingresa un valor para HP');
    return;
  }

  if (attack === '') {
    alert('Por favor, ingresa un valor para Ataque');
    return;
  }

  if (defense === '') {
    alert('Por favor, ingresa un valor para Defensa');
    return;
  }

  if (speed === '') {
    alert('Por favor, ingresa un valor para Velocidad');
    return;
  }

  if (height === '') {
    alert('Por favor, ingresa un valor para Altura');
    return;
  }

  if (weight === '') {
    alert('Por favor, ingresa un valor para Peso');
    return;
  }

  if (type1 === '') {
    alert('Por favor, selecciona un tipo 1');
    return;
  }

  if (type2 === '') {
    alert('Por favor, selecciona un tipo 2');
    return;
  }

    // Validar que name no contenga números
    if (/\d/.test(name)) {
      alert('El nombre no debe contener números');
      return;
    }
  
    // Validar que image tenga al menos 20 caracteres
    if (image.length < 20) {
      alert('La URL de imagen debe contener al menos 20 caracteres');
      return;
    }
  
    // Validar que los campos numéricos no sean mayores a 100
    const numericFields = ['hp', 'attack', 'defense', 'speed', 'height', 'weight'];
    for (const field of numericFields) {
      if (Number(this.state[field]) > 100) {
        alert(`El valor de ${field.toUpperCase()} no debe ser mayor a 100`);
        return;
      }
    }


    // Validar los tipos de datos antes de enviar la solicitud
    if (!Number.isInteger(Number(hp))) {
      this.setState({ error: 'El valor de HP debe ser un número entero.' });
      return;
    }

    if (!Number.isInteger(Number(attack))) {
      this.setState({ error: 'El valor de Ataque debe ser un número entero.' });
      return;
    }

    if (!Number.isInteger(Number(defense))) {
      this.setState({ error: 'El valor de Defensa debe ser un número entero.' });
      return;
    }

    if (!Number.isInteger(Number(speed))) {
      this.setState({ error: 'El valor de Velocidad debe ser un número entero.' });
      return;
    }

    if (!Number.isInteger(Number(height))) {
      this.setState({ error: 'El valor de Altura debe ser un número entero.' });
      return;
    }

    if (!Number.isInteger(Number(weight))) {
      this.setState({ error: 'El valor de Peso debe ser un número entero.' });
      return;
    }
    const nombre = name.toLowerCase();

    const pokemonData = {
      name: nombre,
      image,
      hp: Number(hp),
      attack: Number(attack),
      defense: Number(defense),
      speed: Number(speed),
      height: Number(height),
      weight: Number(weight),
      types: [type1, type2],
    };

    try {
      await this.props.createPokemon(pokemonData);
      this.setState({ success: true, showModal: true });
      this.props.history.push('/home');
    } catch (error) {
      this.setState({ error: 'Error al crear el Pokémon.' });
    }
  };

  handleCloseModal = () => {
    this.setState({ showModal: false });
  };

  render() {
    const { name, image, hp, attack, defense, speed, height, weight, type1, type2, error, success, showModal } = this.state;
    const { pokemonTypes } = this.props;

    return (
      <div className='form-page-container'>
        <button className='close-button' onClick={this.handleCloseForm}>X</button>
        <img src={Myimage} alt="LOGO" />
        <form className='form-column' onSubmit={this.handleSubmit}>
          <input className="form-input" type="text" name="name" value={name} onChange={this.handleChange} placeholder="Nombre"  />
          <input className="form-input" type="text" name="image" value={image} onChange={this.handleChange} placeholder="URL de imagen"  />
          <input className="form-input" type="text" name="hp" value={hp} onChange={this.handleChange} placeholder="HP"  />
          <input className="form-input" type="text" name="attack" value={attack} onChange={this.handleChange} placeholder="Ataque"  />
          <input className="form-input" type="text" name="defense" value={defense} onChange={this.handleChange} placeholder="Defensa"  />
          <input className="form-input" type="text" name="speed" value={speed} onChange={this.handleChange} placeholder="Velocidad"  />
          <input className="form-input" type="text" name="height" value={height} onChange={this.handleChange} placeholder="Altura"  />
          <input className="form-input" type="text" name="weight" value={weight} onChange={this.handleChange} placeholder="Peso"  />

          <select className="form-select" name="type1" value={type1} onChange={this.handleChange} >
            <option value="">Seleccione el tipo 1</option>
            {pokemonTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <select className="form-select" name="type2" value={type2} onChange={this.handleChange} >
            <option value="">Seleccione el tipo 2</option>
            {pokemonTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          {error && <p>{error}</p>}

          <button className="form-button" type="submit">Crear Pokémon</button>
        </form>

        {success && showModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={this.handleCloseModal}>
                &times;
              </span>
              <h2>Pokémon creado exitosamente</h2>
              <p>¡El Pokémon ha sido creado correctamente!</p>
              <p>Nombre: {name}</p>
              <p>Imagen: {image}</p>
              <p>HP: {hp}</p>
              <p>Ataque: {attack}</p>
              <p>Defensa: {defense}</p>
              <p>Velocidad: {speed}</p>
              <p>Altura: {height}</p>
              <p>Peso: {weight}</p>
              <p>Tipo 1: {type1}</p>
              <p>Tipo 2: {type2}</p>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  pokemonTypes: state.pokemonTypes,
});

const mapDispatchToProps = (dispatch) => ({
  createPokemon: (pokemonData) => dispatch(createPokemon(pokemonData)),
  getPokemonTypes: () => dispatch(getPokemonTypes()),
});

export default connect(mapStateToProps, mapDispatchToProps)(FormPage);
