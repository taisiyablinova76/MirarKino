import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserStats } from '../services/api';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    watch_count: 0,
    saved_count: 0,
    liked_count: 0,
    favorite_genre: 'не определен'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    setLoading(true);
    const userStats = await getUserStats();
    setStats(userStats);
    setLoading(false);
  };

  if (!user) return null;

  if (loading) {
    return (
      <>
        
        <div style={{ textAlign: 'center', color: '#d47b7b', padding: '4rem' }}>
          Загрузка профиля...
        </div>
      </>
    );
  }

  return (
    <>
      
      <main className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {user.username[0].toUpperCase()}
            </div>
            <div className="profile-info">
              <h1>{user.username}</h1>
              <p>{user.email}</p>
              <p style={{ marginTop: '0.5rem', color: '#d47b7b' }}>
                Любимый жанр: {stats.favorite_genre}
              </p>
            </div>
          </div>
          
          <div className="profile-stats">
            <div className="stat-item">
              <div className="stat-value">{stats.saved_count}</div>
              <div className="stat-label">Отложенных фильмов</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{stats.watch_count}</div>
              <div className="stat-label">Просмотрено фильмов</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{stats.liked_count}</div>
              <div className="stat-label">Понравившихся клипов</div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Profile;