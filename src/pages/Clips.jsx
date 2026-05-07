import React, { useState, useEffect, useRef } from 'react';
import './Clips.css';

const Clips = () => {
  const [clips, setClips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
        videoUrl: `http://localhost:5000${c.url.startsWith('/') ? c.url : '/' + c.url}`
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
      Object.values(videoRefs.current).forEach(v => { if (v) { v.pause(); v.currentTime = 0; } });
      const cur = videoRefs.current[idx];
      if (cur) {
        cur.currentTime = 0;
        cur.play().catch(() => console.warn('Autoplay blocked'));
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [clips]);

  if (loading) return <div style={{height:'80vh', display:'flex', alignItems:'center', justifyContent:'center', color:'#d47b7b'}}>Загрузка...</div>;
  if (error) return (
    <div style={{height:'80vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', color:'#d47b7b'}}>
      <p>{error}</p>
      <button onClick={fetchLocalClips} style={{padding:'10px 20px', background:'#8b1e1e', color:'#fff', border:'none', borderRadius:'5px', cursor:'pointer'}}>Повторить</button>
    </div>
  );

  return (
    <div className="clips-container" ref={containerRef}>
      {clips.map((clip, idx) => (
        <div key={clip.id} className="clip-item">
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
            <div className="clip-title">{clip.title}</div>
            <div className="clip-meta">{clip.size_mb} МБ • {clip.format.toUpperCase()}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Clips;