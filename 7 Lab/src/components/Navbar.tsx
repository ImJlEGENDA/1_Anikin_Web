import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        <span className="navbar-brand">📊 Инфо-Табло</span>
        <div className="navbar-nav flex-row gap-3">
          <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/weather">⛅ Погода</NavLink>
          <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/market">📈 Рынок</NavLink>
          <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/notes">📝 Заметки</NavLink>
        </div>
      </div>
    </nav>
  );
}