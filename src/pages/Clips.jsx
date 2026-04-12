import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import MoviePlayer from '../components/MoviePlayer';
import { useAuth } from '../contexts/AuthContext';
import { getClips, toggleSaveMovie, checkSaved, getMovie } from '../services/api';

const Clips = () => {
  const { user } = useAuth();
  const [clips, setClips] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [savedStatus, setSavedStatus] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClips();
  }, []);

  useEffect(() => {
    if (user && clips.length > 0) {
      loadSavedStatus();
    }
  }, [user, clips]);

  const loadClips = async () => {
    setLoading(true);
    const clipsData = await getClips();
    setClips(clipsData);
    setLoading(false);
  };

  const loadSavedStatus = async () => {
    const status = {};
    for (const clip of clips) {
      const result = await checkSaved(clip.movie_id);
      status[clip.id] = result.saved;
    }
    setSavedStatus(status);
  };

  const handleSave = async (clipId, movieId) => {
    if (!user) {
      alert('Сначала зарегистрируйтесь!');
      return;
    }
    
    const result = await toggleSaveMovie(movieId);
    
    if (result) {
      setSavedStatus(prev => ({ ...prev, [clipId]: result.saved }));
      alert(result.saved ? 'Фильм добавлен в отложенные!' : 'Фильм удален из отложенных');
    }
  };

  const handleOpenMovie = async (movieId) => {
    const movie = await getMovie(movieId);
    if (movie) {
      setSelectedMovie(movie);
    }
  };

  const handleClosePlayer = () => {
    setSelectedMovie(null);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div style={{ textAlign: 'center', color: '#d47b7b', padding: '4rem' }}>
          Загрузка клипов...
        </div>
      </>
    );
  }

  const containerStyle = {
    height: 'calc(100vh - 90px)',
    overflowY: 'scroll',
    scrollSnapType: 'y mandatory',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none'
  };

  const clipItemStyle = {
    height: 'calc(100vh - 90px)',
    scrollSnapAlign: 'start',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#0b0a0a',
    position: 'relative'
  };

  const clipCardStyle = {
    width: '100%',
    maxWidth: '400px',
    height: '80vh',
    background: '#141111',
    borderRadius: '32px',
    border: '2px solid #6a1e1e',
    overflow: 'hidden',
    position: 'relative',
    boxShadow: '0 20px 40px rgba(100, 20, 20, 0.4)'
  };

  const clipVideoStyle = {
    width: '100%',
    height: '70%',
    background: '#1d1515',
    position: 'relative',
    overflow: 'hidden'
  };

  const clipInfoStyle = {
    padding: '1.5rem',
    color: '#eacece',
    position: 'relative'
  };

  const clipTitleStyle = {
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: '0.5rem',
    color: '#f3b3b3'
  };

  const clipDescriptionStyle = {
    color: '#a16565',
    marginBottom: '1rem',
    fontSize: '0.95rem'
  };

  const buttonStyle = {
    display: 'inline-block',
    background: 'transparent',
    border: '2px solid #8b1e1e',
    color: '#d47b7b',
    padding: '0.6rem 1.5rem',
    borderRadius: '40px',
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: '0.2s',
    marginTop: '0.5rem'
  };

  const actionsStyle = {
    position: 'absolute',
    right: '1rem',
    bottom: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  };

  const actionBtnStyle = (isSaved) => ({
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    background: isSaved ? '#8b1e1e' : '#1f1818',
    border: '2px solid #6a1e1e',
    color: '#d47b7b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    cursor: 'pointer',
    transition: '0.2s'
  });

  return (
    <>
      <Header />
      <div style={containerStyle}>
        {clips.map((clip, index) => (
          <div key={clip.id} style={clipItemStyle}>
            <div style={clipCardStyle}>
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'rgba(0,0,0,0.7)',
                color: '#a16565',
                padding: '0.3rem 0.8rem',
                borderRadius: '40px',
                fontSize: '0.8rem',
                border: '1px solid #6a1e1e',
                zIndex: 10
              }}>
                #{index + 1}
              </div>
              
              <div style={clipVideoStyle}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: `linear-gradient(145deg, #2c1414 0%, #1f0f0f 100%)`
                }}>
                  <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎬</span>
                  <span style={{ color: '#d47b7b' }}>КЛИП "{clip.title}"</span>
                  <span style={{ color: '#a16565', fontSize: '0.9rem', marginTop: '1rem' }}>
                    (нажмите "Смотреть фильм")
                  </span>
                </div>
              </div>
              
              <div style={clipInfoStyle}>
                <div style={clipTitleStyle}>{clip.title}</div>
                <div style={clipDescriptionStyle}>{clip.description}</div>
                <button 
                  style={buttonStyle}
                  onClick={() => handleOpenMovie(clip.movie_id)}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#8b1e1e';
                    e.target.style.color = '#f0e0e0';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.color = '#d47b7b';
                  }}
                >
                  ▶ Смотреть фильм полностью
                </button>
              </div>
              
              <div style={actionsStyle}>
                <div 
                  style={actionBtnStyle(savedStatus[clip.id])}
                  onClick={() => handleSave(clip.id, clip.movie_id)}
                  onMouseEnter={(e) => {
                    if (!savedStatus[clip.id]) {
                      e.currentTarget.style.background = '#8b1e1e';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!savedStatus[clip.id]) {
                      e.currentTarget.style.background = '#1f1818';
                    }
                  }}
                >
                  📌
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedMovie && (
        <MoviePlayer movie={selectedMovie} onClose={handleClosePlayer} />
      )}
    </>
  );
};

export default Clips;