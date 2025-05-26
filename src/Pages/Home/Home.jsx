import React from 'react';
import './Home.css';

const Home = () => {
    return (
        <div className="home-container">
            <div className="hero-section">
                <div className="hero-content">
                    <h1>Bienvenido a Nuestro Sistema</h1>
                    <p>Tu plataforma integral para gestionar y optimizar tus procesos</p>
                </div>
                <div className="hero-image">
                    <img 
                        src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                        alt="Sistema de gestión" 
                    />
                </div>
            </div>
        </div>
    )
}

export default Home;