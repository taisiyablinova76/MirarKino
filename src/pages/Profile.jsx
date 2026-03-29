import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [savedCount, setSavedCount] = useState(0);
  const [likedCount, setLikedCount] = useState(0);

  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`saved_${user.email}`);
      const savedMovies = saved ? JSON.parse(saved) : [];
      setSavedCount(savedMovies.length);
      
      const liked = localStorage.getItem(`liked_${user.email}`);
      const likedClips = liked ? JSON.parse(liked) : [];
      setLikedCount(likedClips.length);
    }
  }, [user]);

  if (!user) return null;

  return (
    <>
      <Header />
      <main className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {user.username[0].toUpperCase()}
            </div>
            <div className="profile-info">
              <h1>{user.username}</h1>
              <p>{user.email}</p>
            </div>
          </div>
          
          <div className="profile-stats">
            <div className="stat-item">
              <div className="stat-value">{savedCount}</div>
              <div className="stat-label">Отложенных фильмов</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{likedCount}</div>
              <div className="stat-label">Понравившихся клипов</div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Profile;