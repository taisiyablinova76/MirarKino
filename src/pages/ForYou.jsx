import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import MoviePlayer from '../components/MoviePlayer';
import { useAuth } from '../contexts/AuthContext';
import { getRecommendations } from '../services/api';

const ForYou = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadRecommendations();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadRecommendations = async () => {
    setLoading(true);
    const recs = await getRecommendations();
    setRecommendations(recs);
    setLoading(false);
  };

  const containerStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '2rem'
  };

  const recommendationHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '0.5rem'
  };

  const titleStyle = {
    fontSize: '1.8rem',
    fontWeight: 600,
    color: '#eacece',
    borderLeft: '5px solid #8b1e1e',
    paddingLeft: '1rem'
  };

  const badgeStyle = {
    background: 'linear-gradient(145deg, #2c1414 0%, #1f0f0f 100%)',
    border: '1px solid #8b1e1e',
    borderRadius: '40px',
    padding: '0.4rem 1.5rem',
    fontSize: '1rem',
    color: '#d47b7b'
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

  const noteStyle = {
    background: 'rgba(139, 30, 30, 0.1)',
    borderLeft: '4px solid #8b1e1e',
    padding: '1rem 2rem',
    marginBottom: '2rem',
    borderRadius: '0 12px 12px 0',
    color: '#c9b0b0',
    fontSize: '1.1rem'
  };

  const noteSpanStyle = {
    color: '#d47b7b',
    fontWeight: 600
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

  if (loading) {
    return (
      <>
        <main style={containerStyle}>
          <div style={{ textAlign: 'center', color: '#d47b7b', padding: '4rem' }}>
            Загрузка рекомендаций...
          </div>
        </main>
      </>
    );
  }

  // Если пользователь не авторизован
  if (!user) {
    return (
      <>
        <main style={containerStyle}>
          <div style={recommendationHeaderStyle}>
            <h2 style={titleStyle}>🎯 ФИЛЬМЫ ДЛЯ ВАС</h2>
            <span style={badgeStyle}>персональные рекомендации</span>
          </div>
          
          <div style={loginPromptStyle}>
            <h2 style={loginPromptTitleStyle}>🔒 Требуется регистрация</h2>
            <p style={loginPromptTextStyle}>
              Чтобы получать персональные рекомендации и сохранять фильмы, нужно войти в аккаунт
            </p>
            <Link to="/register" style={loginPromptBtnStyle}>
              Зарегистрироваться
            </Link>
          </div>
        </main>
      </>
    );
  }

  // Если нет рекомендаций
  if (recommendations.length === 0) {
    return (
      <>
        <main style={containerStyle}>
          <div style={recommendationHeaderStyle}>
            <h2 style={titleStyle}>🎯 ФИЛЬМЫ ДЛЯ ВАС</h2>
            <span style={badgeStyle}>персональные рекомендации</span>
          </div>
          
          <div style={noteStyle}>
            <span style={noteSpanStyle}>{user.username}</span>, смотрите фильмы и клипы, чтобы получать рекомендации! 🔥
          </div>
          
          <div style={{ textAlign: 'center', padding: '4rem', color: '#a16565' }}>
            <p>Нет рекомендаций. Посмотрите несколько фильмов, чтобы мы могли подобрать для вас лучшие!</p>
            <Link to="/" style={{ color: '#d47b7b' }}>Перейти к каталогу →</Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <main style={containerStyle}>
        <div style={recommendationHeaderStyle}>
          <h2 style={titleStyle}>🎯 ФИЛЬМЫ ДЛЯ ВАС</h2>
          <span style={badgeStyle}>персональные рекомендации</span>
        </div>
        
        <div style={noteStyle}>
          <span style={noteSpanStyle}>{user.username}</span>, мы подобрали фильмы специально для вас 🔥
        </div>

        <div style={gridStyle}>
          {recommendations.map(movie => (
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

export default ForYou;