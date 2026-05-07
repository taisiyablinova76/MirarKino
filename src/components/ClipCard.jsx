import React, { useRef, useEffect, useState } from 'react';
import './ClipCard.css';

const ClipCard = ({ clip, index }) => {
  const videoRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onReady = () => setReady(true);
    const onErr = () => setError(true);
    v.addEventListener('canplay', onReady);
    v.addEventListener('error', onErr);
    v.load();
    return () => { v.removeEventListener('canplay', onReady); v.removeEventListener('error', onErr); };
  }, [clip]);

  const getMime = (f) => {
    const ext = f.split('.').pop().toLowerCase();
    return ext === 'webm' ? 'video/webm' : ext === 'ogg' ? 'video/ogg' : 'video/mp4';
  };

  return (
    <div className="clip-card">
      <div className="clip-number">#{index + 1}</div>
      <div className="clip-video-wrapper">
        {!error ? (
          <video ref={videoRef} muted loop playsInline preload="metadata"
            style={{ width: '100%', height: '100%', objectFit: 'cover', backgroundColor: '#000', display: ready ? 'block' : 'none' }}>
            <source src={clip.videoUrl || clip.url} type={getMime(clip.filename)} />
          </video>
        ) : null}
        
        {!ready && !error && (
          <div style={{position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'#1a1a1a', color:'#d47b7b'}}>Загрузка...</div>
        )}
        {error && (
          <div style={{position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'#1a1a1a', color:'#d47b7b', padding:'2rem', textAlign:'center'}}>
            <div style={{fontSize:'2rem', marginBottom:'0.5rem'}}>⚠️</div>
            <div>Ошибка видео</div>
            <div style={{fontSize:'0.8rem', marginTop:'0.5rem', color:'#8b6b6b'}}>{clip.filename}</div>
          </div>
        )}
      </div>
      <div className="clip-info">
        <div className="clip-title">{clip.title}</div>
        <div className="clip-meta">{clip.size_mb} МБ • {clip.filename}</div>
      </div>
    </div>
  );
};

export default ClipCard;