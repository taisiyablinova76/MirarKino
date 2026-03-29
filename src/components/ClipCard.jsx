import React from 'react';
import './ClipCard.css';

const ClipCard = ({ clip, index, isSaved, onLike, onSave, onOpenMovie }) => {
  return (
    <div className="clip-item" data-clip-id={clip.id} data-movie-id={clip.movie_id}>
      <div className="clip-card">
        <div className="clip-number">#{index + 1}</div>
        
        <div className="clip-video">
          <div className={`clip-poster-placeholder ${clip.thumbnail}`}>
            <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎬</span>
            <span style={{ color: '#d47b7b' }}>КЛИП "{clip.title}"</span>
            <span style={{ color: '#a16565', fontSize: '0.9rem', marginTop: '1rem' }}>
              (здесь будет видео)
            </span>
          </div>
        </div>
        
        <div className="clip-info">
          <div className="clip-title">{clip.title}</div>
          <div className="clip-description">{clip.description}</div>
          <button 
            className="clip-movie-link" 
            onClick={() => onOpenMovie(clip.movie_id)}
          >
            ▶ Смотреть фильм полностью
          </button>
        </div>
        
        <div className="clip-actions">
          <div 
            className={`action-btn like-btn ${clip.liked ? 'liked' : ''}`}
            onClick={onLike}
          >
            ❤️
          </div>
          <div className="likes-count">{clip.likes}</div>
          
          <div 
            className={`action-btn save-btn ${isSaved ? 'saved' : ''}`}
            onClick={onSave}
          >
            📌
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClipCard;