import React, { useState, useEffect, useRef } from 'react';
import './Clips.css';

const Clips = () => {
  const [clips, setClips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likes, setLikes] = useState({});
  const [saved, setSaved] = useState({});
  const containerRef = useRef(null);
  const videoRefs = useRef({});

  useEffect(() => {
    fetchLocalClips();
  }, []);

  const fetchLocalClips = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/clips/local');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) {
        setError('Папка static/videos пуста или не найдена');
        return;
      }
      setClips(data.map((c, i) => ({
        ...c,
        id: c.id || i,
        videoUrl: `http://localhost:5000${c.url.startsWith('/') ? c.url : '/' + c.url}`,
        description: c.description || `Клип из фильма ${c.title || ''}`,
        movieLink: c.movieLink || '#'
      })));
    } catch (err) {
      console.error('Ошибка загрузки клипов:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!containerRef.current || clips.length === 0) return;
    const container = containerRef.current;

    const handleScroll = () => {
      const h = container.clientHeight;
      const idx = Math.round(container.scrollTop / h);
      Object.values(videoRefs.current).forEach(v => { 
        if (v) { 
          v.pause(); 
          v.currentTime = 0; 
        } 
      });
      const cur = videoRefs.current[idx];
      if (cur) {
        cur.currentTime = 0;
        cur.play().catch(() => console.warn('Autoplay blocked'));
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [clips]);

  const handleLike = (clipId) => {
    setLikes(prev => ({
      ...prev,
      [clipId]: !prev[clipId]
    }));
  };

  const handleSave = (clipId) => {
    setSaved(prev => ({
      ...prev,
      [clipId]: !prev[clipId]
    }));
  };

  if (loading) return (
    <div className="loading-container">
      <div>Загрузка клипов...</div>
    </div>
  );
  
  if (error) return (
    <div className="error-container">
      <p>{error}</p>
      <button onClick={fetchLocalClips} className="retry-button">Повторить</button>
    </div>
  );

  if (clips.length === 0) return (
    <div className="empty-container">
      <p>Нет доступных клипов</p>
    </div>
  );

  return (
    <div className="clips-container" ref={containerRef}>
      {clips.map((clip, idx) => (
        <div key={clip.id} className="clip-item">
          <div className="clip-card">
            <div className="clip-number">#{idx + 1}</div>
            
            <div className="clip-video">
              <video
                ref={el => { if (el) videoRefs.current[idx] = el; }}
                muted
                loop
                playsInline
                preload="auto"
                controls
                style={{ width: '100%', height: '100%', objectFit: 'cover', backgroundColor: '#000' }}
                onError={() => console.warn(`Ошибка воспроизведения: ${clip.filename}`)}
              >
                <source src={clip.videoUrl} type={`video/${clip.format}`} />
                Ваш браузер не поддерживает видео.
              </video>
            </div>
            
            <div className="clip-info">
              <div className="clip-title">{clip.title || clip.filename || 'Без названия'}</div>
              <div className="clip-description">
                {clip.description}
              </div>
              <a 
                href={clip.movieLink} 
                className="clip-movie-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Смотреть фильм полностью
              </a>
            </div>
            
            <div className="clip-actions">
              <div 
                className={`action-btn ${likes[clip.id] ? 'liked' : ''}`}
                onClick={() => handleLike(clip.id)}
              >
                ❤️
              </div>
              <div className="likes-count">{likes[clip.id] ? 1 : 0}</div>
              <div 
                className={`action-btn ${saved[clip.id] ? 'saved' : ''}`}
                onClick={() => handleSave(clip.id)}
              >
                📌
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Clips;