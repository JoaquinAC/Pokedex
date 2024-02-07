import React, { Component } from 'react';
import './Card.css';
class Card extends Component {
  render() {
    const { id, image, name, types } = this.props;

    return (
      <div className="card">
        <div className="card-image">
          <img src={image} alt={name} />
        </div>
        <div className="card-content">
          <h3>{name}</h3>
          <div className='card-text'>
              <p>ID: {id}</p>
              <p>Types: {types.join(', ')}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Card;