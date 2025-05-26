import React from 'react';
import './styles.css';

const DocenteCard = ({ docente }) => {
  return (
    <div className="docente-card">
      <h3>{docente.nombre}</h3>
      <p>{docente.especialidad}</p>
    </div>
  );
};

export default DocenteCard; 