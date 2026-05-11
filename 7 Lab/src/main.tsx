import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Weather from './pages/Weather';
import Market from './pages/Market';
import Notes from './pages/Notes';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/weather" element={<Weather />} />
          <Route path="/market" element={<Market />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="*" element={<Navigate to="/weather" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  </React.StrictMode>
);