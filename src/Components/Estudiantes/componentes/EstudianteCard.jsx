import React from 'react';
import './styles.css';

const EstudianteCard = ({ estudiante }) => {
  return (
    <div className="estudiante-card">
      <h3>{estudiante.nombre}</h3>
      <p>{estudiante.carrera}</p>
    </div>
  );
};

export default EstudianteCard; 