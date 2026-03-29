import React, { useEffect, useRef } from 'react';

const MoviePlayer = ({ movie, onClose }) => {
  const playerRef = useRef(null);

  useEffect(() => {
    if (movie) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [movie]);

  const handleClose = () => {
    if (onClose) onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!movie) return null;

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.95)',
    zIndex: 2000,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(12px)',
    animation: 'fadeIn 0.3s ease'
  };

  const containerStyle = {
    width: '90%',
    maxWidth: '1200px',
    background: '#000000',
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 30px 60px rgba(100, 20, 20, 0.5)',
    border: '2px solid #6a1e1e'
  };

  const videoWrapperStyle = {
    position: 'relative',
    width: '100%',
    paddingBottom: '56.25%',
    background: '#0f0c0c'
  };

  const iframeStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 'none'
  };

  const closeButtonStyle = {
    marginTop: '2rem',
    background: '#831e1e',
    color: '#f0e0e0',
    border: 'none',
    padding: '0.8rem 2rem',
    borderRadius: '40px',
    fontWeight: 700,
    fontSize: '1rem',
    cursor: 'pointer',
    transition: '0.2s',
    border: '1px solid #b54545'
  };

  const infoStyle = {
    padding: '1rem',
    background: '#141111',
    color: '#eacece'
  };

  const titleStyle = {
    fontSize: '1.5rem',
    marginBottom: '0.5rem',
    color: '#f3b3b3'
  };

  const yearStyle = {
    color: '#a16565',
    marginLeft: '0.5rem'
  };

  const descriptionStyle = {
    color: '#a16565',
    fontSize: '0.9rem'
  };

  return (
    <div style={overlayStyle} onClick={handleOverlayClick}>
      <div style={containerStyle}>
        <div style={videoWrapperStyle}>
          <iframe
            ref={playerRef}
            style={iframeStyle}
            src={movie.video_url}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title={movie.title}
          />
        </div>
        <div style={infoStyle}>
          <div style={titleStyle}>
            {movie.title}
            <span style={yearStyle}>({movie.year})</span>
          </div>
          {movie.description && (
            <div style={descriptionStyle}>{movie.description}</div>
          )}
        </div>
      </div>
      <button style={closeButtonStyle} onClick={handleClose}>
        ЗАКРЫТЬ ПЛЕЕР [X]
      </button>
      
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
};

export default MoviePlayer;