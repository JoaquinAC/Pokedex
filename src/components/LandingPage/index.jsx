import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import pokeballGif from './img/pokebola.gif';
import pikachu from './img/pikachu.gif';
import miu from './img/miu.gif';
import farfetch from './img/farfetch.gif';
import gengar from './img/Gengar.gif';
import './LandingPage.css';

class LandingPage extends Component {
  state = {
    gifs: [pokeballGif, pikachu, miu, farfetch, gengar],
    currentIndex: 0,
  };

  componentDidMount() {
    this.startGifTransition();
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  startGifTransition = () => {
    this.timeout = setTimeout(() => {
      this.setState((prevState) => ({
        currentIndex: (prevState.currentIndex + 1) % prevState.gifs.length,
      }));
      this.startGifTransition();
    }, 3000); // Cambiar el tiempo de transición aquí (en milisegundos)
  };

  render() {
    const { gifs, currentIndex } = this.state;

    return (
      <div className="landing-page">
        <div className="title-container">
          <h1 className="title">¡Bienvenido al mundo de los Pokémon!</h1>
          <Link to="/home" className="home-button">
            <button className="pokemon-button">Ir a Home</button>
          </Link>
        </div>
        <div className="gif-container">
          <img className="gif" src={gifs[currentIndex]} alt="GIF" />
        </div>
      </div>
    );
  }
}

export default LandingPage;