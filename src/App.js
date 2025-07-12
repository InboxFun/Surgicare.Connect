import logo from './assets/surgicare_logo2.png';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import LoginPage from './Login';
import DoctorDashboard from './components/DoctorDashboard';
import AddPatientForm from './components/AddPatientForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DoctorDashboard />} />
        <Route path="/add-patient" element={<AddPatientForm />} />
      </Routes>
    </Router>
  );
}

export default App;
