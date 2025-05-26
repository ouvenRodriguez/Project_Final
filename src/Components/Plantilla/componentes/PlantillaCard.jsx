import React from 'react';
import './styles.css';

const PlantillaCard = ({ plantilla }) => {
  return (
    <div className="plantilla-card">
      <h3>{plantilla.titulo}</h3>
      <p className="plantilla-descripcion">{plantilla.descripcion}</p>
      <div className="plantilla-metadata">
        <span className="plantilla-fecha">Creado: {plantilla.fechaCreacion}</span>
        <span className="plantilla-estado">{plantilla.estado}</span>
      </div>
    </div>
  );
};

export default PlantillaCard; 