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
    right: 0,
    bottom: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.98)',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(10px)',
    animation: 'fadeIn 0.3s ease'
  };

  const containerStyle = {
    width: '100%',
    maxWidth: '1400px',
    height: '90vh',
    backgroundColor: '#000',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 30px 60px rgba(100, 20, 20, 0.5)',
    border: '2px solid #6a1e1e',
    display: 'flex',
    flexDirection: 'column'
  };

  const videoWrapperStyle = {
    position: 'relative',
    width: '100%',
    height: 'calc(100% - 80px)',
    backgroundColor: '#000'
  };

  const iframeStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 'none'
  };

  const infoStyle = {
    padding: '1rem 2rem',
    background: 'linear-gradient(to top, #141111, #1a1515)',
    color: '#eacece',
    height: '80px'
  };

  const titleStyle = {
    fontSize: '1.2rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
    color: '#f3b3b3'
  };

  const yearStyle = {
    color: '#a16565',
    marginLeft: '0.5rem',
    fontSize: '0.9rem'
  };

  const descriptionStyle = {
    color: '#a16565',
    fontSize: '0.85rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  };

  const closeButtonStyle = {
    position: 'fixed',
    top: '20px',
    right: '20px',
    background: '#831e1e',
    color: '#f0e0e0',
    border: 'none',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    fontSize: '24px',
    cursor: 'pointer',
    transition: '0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
  };

  return (
    <>
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
          
          @keyframes slideIn {
            from {
              transform: scale(0.9);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}
      </style>
      
      <div style={overlayStyle} onClick={handleOverlayClick}>
        <button style={closeButtonStyle} onClick={handleClose}>
          ✕
        </button>
        
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
      </div>
    </>
  );
};

export default MoviePlayer;