import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SearchBar from './SearchBar';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(''); // Добавьте эту строку

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleSearchResult = (results, query) => {
    if (results && results.length > 0) {
      // Передаем результаты поиска через state
      navigate('/search', { state: { results, query } });
    } else if (results === null) {
      // Сброс поиска - возвращаем на главную
      navigate('/');
    } else if (results && results.length === 0) {
      // Нет результатов
      navigate('/search', { state: { results: [], query } });
    }
  };

  return (
    <header className="header">
      <div className="logo-area" onClick={() => navigate('/')}>
        <div className="logo-icon">🎬</div>
        <span className="logo-text">MirarKino</span>
      </div>

      <SearchBar onSearchResult={handleSearchResult} />

      <div className="nav-links">
        <Link to="/" className={isActive('/')}>Главная</Link>
        <Link to="/for-you" className={isActive('/for-you')}>Для вас</Link>
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