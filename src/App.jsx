import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './Pages/Login/Login';
import './App.css';
import CreateProject from './Components/Project/CreateProject/CreateProject';
import ListProjects from './Components/Project/ListProject/ListProject';
import RegisterEstudiante from './Components/Estudiantes/RegisterEstudiante/RegisterEstudiante';
import ListEstudiantes from './Components/Estudiantes/ListEstudiante/ListEstudiante';
import RegisterDocente from './Components/Docentes/RegisterDocente/RegisterDocente';
import ListDocentes from './Components/Docentes/ListDocente/ListDocentes';
import Plantilla from './Components/Plantilla/Plantilla';
import Home from './Pages/Home/Home';
import ListProjectStudent from './Components/Project/ListProjectStudent/ListProjectStudent';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      <Route element={<Plantilla />}>
        <Route path="/home" element={<Home />} />
        <Route path="/create-project" element={<CreateProject />} />
        <Route path="/list-projects" element={<ListProjects />} />
        <Route path="/register-estudiante" element={<RegisterEstudiante />} />
        <Route path="/list-projects-student" element={<ListProjectStudent />} />
        <Route path="/list-estudiantes" element={<ListEstudiantes />} />
        <Route path="/register-docente" element={<RegisterDocente />} />
        <Route path="/list-docentes" element={<ListDocentes />} />
      </Route>
    </Routes>
  );
};

export default App;
