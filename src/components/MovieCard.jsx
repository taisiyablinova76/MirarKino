import React, { useState } from 'react';

const MovieCard = ({ movie, onClick }) => {
  const [imageError, setImageError] = useState(false);

  const cardStyle = {
    background: '#141111',
    borderRadius: '24px',
    overflow: 'hidden',
    cursor: 'pointer',
    border: '1px solid #2f1c1c',
    transition: 'transform 0.3s, box-shadow 0.3s'
  };

  const cardHoverStyle = {
    transform: 'translateY(-8px)',
    borderColor: '#6a1e1e',
    boxShadow: '0 15px 30px rgba(100, 20, 20, 0.3)'
  };

  const posterStyle = {
    height: '320px',
    background: 'linear-gradient(145deg, #2c1414 0%, #1f0f0f 100%)',
    position: 'relative',
    overflow: 'hidden'
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s'
  };

  const fallbackStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(145deg, #2c1414 0%, #1f0f0f 100%)'
  };

  const titleStyle = {
    padding: '1rem',
    textAlign: 'center',
    color: '#eacece',
    fontWeight: '600'
  };

  const yearStyle = {
    color: '#a16565',
    marginLeft: '0.5rem',
    fontWeight: '400',
    fontSize: '0.85rem'
  };

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      style={{
        ...cardStyle,
        ...(isHovered ? cardHoverStyle : {})
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={posterStyle}>
        {!imageError && movie.poster_url ? (
          <img 
            src={movie.poster_url}
            alt={movie.title}
            style={{
              ...imageStyle,
              ...(isHovered ? { transform: 'scale(1.05)' } : {})
            }}
            onError={() => setImageError(true)}
          />
        ) : (
          <div style={fallbackStyle}>
            <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎬</span>
            <span style={{ 
              background: 'rgba(0, 0, 0, 0.7)',
              padding: '0.5rem 1rem',
              borderRadius: '12px',
              color: '#d47b7b',
              fontWeight: '600',
              fontSize: '0.9rem',
              textAlign: 'center'
            }}>
              {movie.title.toUpperCase()}
            </span>
          </div>
        )}
      </div>
      <div style={titleStyle}>
        {movie.title}
        <span style={yearStyle}>({movie.year})</span>
      </div>
    </div>
  );
};

export default MovieCard;