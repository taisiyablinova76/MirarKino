import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className="header">
      <div className="logo-area">
        <div className="logo-icon">🎬</div>
        <span className="logo-text">MirarKino</span>
      </div>

      <div className="nav-links">
        <Link to="/" className={isActive('/')}>Главная</Link>
        <Link to="/for-you" className={isActive('/for-you')}>Фильмы для вас</Link>
        <Link to="/clips" className={isActive('/clips')}>Клипы</Link>
        <Link to="/saved" className={isActive('/saved')}>Отложенные</Link>
        
        {user ? (
          <>
            <span className="user-greeting">{user.username}</span>
            <Link to="/profile" className="profile-btn">Профиль</Link>
            <button onClick={logout} className="logout-btn">Выйти</button>
          </>
        ) : (
          <Link to="/register" className="register-btn">Регистрация</Link>
        )}
      </div>
    </header>
  );
};

export default Header;