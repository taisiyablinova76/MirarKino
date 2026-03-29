import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import MovieCard from '../components/MovieCard';
import MoviePlayer from '../components/MoviePlayer';
import { useAuth } from '../contexts/AuthContext';
import { MOVIES } from '../services/api';

const Saved = () => {
  const { user } = useAuth();
  const [savedMovies, setSavedMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`saved_${user.email}`);
      const savedIds = saved ? JSON.parse(saved) : [];
      const movies = savedIds.map(id => MOVIES[id]).filter(m => m);
      setSavedMovies(movies);
    }
  }, [user]);

  const containerStyle = {
    minHeight: 'calc(100vh - 90px)',
    padding: '2rem 2.5rem'
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '2rem'
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: 500,
    borderLeft: '6px solid #8b1e1e',
    paddingLeft: '1.2rem',
    color: '#e2c9c9'
  };

  const countStyle = {
    background: '#2c1414',
    color: '#d47b7b',
    padding: '0.3rem 1rem',
    borderRadius: '40px',
    fontSize: '1rem',
    border: '1px solid #6a1e1e'
  };

  const loginPromptStyle = {
    background: '#141111',
    border: '2px solid #6a1e1e',
    borderRadius: '24px',
    padding: '4rem 2rem',
    textAlign: 'center',
    maxWidth: '500px',
    margin: '4rem auto'
  };

  const loginPromptTitleStyle = {
    color: '#f3b3b3',
    fontSize: '2rem',
    marginBottom: '1rem'
  };

  const loginPromptTextStyle = {
    color: '#a16565',
    marginBottom: '2rem',
    fontSize: '1.2rem'
  };

  const loginPromptBtnStyle = {
    display: 'inline-block',
    background: '#831e1e',
    color: '#f0e0e0',
    textDecoration: 'none',
    padding: '1rem 3rem',
    borderRadius: '40px',
    fontWeight: 700,
    fontSize: '1.2rem',
    border: '1px solid #b54545',
    transition: '0.2s'
  };

  const emptyStyle = {
    textAlign: 'center',
    padding: '4rem',
    color: '#a16565',
    fontSize: '1.2rem'
  };

  const emptyIconStyle = {
    fontSize: '4rem',
    marginBottom: '1rem',
    opacity: 0.5
  };

  const emptyLinkStyle = {
    color: '#d47b7b',
    textDecoration: 'none',
    borderBottom: '1px solid #8b1e1e',
    display: 'inline-block',
    marginTop: '1rem'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '2rem'
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  const handleClosePlayer = () => {
    setSelectedMovie(null);
  };

  // Если пользователь не авторизован, показываем форму входа
  if (!user) {
    return (
      <>
        <Header />
        <main style={containerStyle}>
          <div style={headerStyle}>
            <h1 style={titleStyle}>📌 ОТЛОЖЕННЫЕ</h1>
          </div>
          
          <div style={loginPromptStyle}>
            <h2 style={loginPromptTitleStyle}>🔒 Требуется регистрация</h2>
            <p style={loginPromptTextStyle}>
              Чтобы сохранять фильмы и видеть свои отложенные, нужно войти в аккаунт
            </p>
            <Link to="/register" style={loginPromptBtnStyle}>
              Зарегистрироваться
            </Link>
          </div>
        </main>
      </>
    );
  }

  // Если пользователь авторизован, но нет сохраненных фильмов
  if (savedMovies.length === 0) {
    return (
      <>
        <Header />
        <main style={containerStyle}>
          <div style={headerStyle}>
            <h1 style={titleStyle}>📌 ОТЛОЖЕННЫЕ</h1>
          </div>
          
          <div style={emptyStyle}>
            <div style={emptyIconStyle}>📭</div>
            <p>У вас пока нет отложенных фильмов</p>
            <p style={{ fontSize: '1rem', marginTop: '1rem' }}>
              Листайте клипы и сохраняйте интересные фильмы
            </p>
            <Link to="/clips" style={emptyLinkStyle}>
              Перейти к клипам →
            </Link>
          </div>
        </main>
      </>
    );
  }

  // Если есть сохраненные фильмы, показываем их
  return (
    <>
      <Header />
      <main style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>📌 ОТЛОЖЕННЫЕ</h1>
          <span style={countStyle}>{savedMovies.length} фильмов</span>
        </div>
        
        <div style={gridStyle}>
          {savedMovies.map(movie => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onClick={() => handleMovieClick(movie)}
            />
          ))}
        </div>
      </main>
      {selectedMovie && (
        <MoviePlayer movie={selectedMovie} onClose={handleClosePlayer} />
      )}
    </>
  );
};

export default Saved;