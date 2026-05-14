import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// ✅ Страницы
import Home from './pages/Home';
import ForYou from './pages/ForYou';
import Clips from './pages/Clips';
import Saved from './pages/Saved';
import Profile from './pages/Profile';
import Register from './pages/Register';
import Login from './pages/Login';
import SearchResults from './pages/SearchResults';

// ✅ Компоненты
import Header from './components/Header'; // ← ДОБАВЛЕНО: импорт Header
import MoviePlayer from './components/MoviePlayer';

import './App.css';

function App() {
  const [currentMovie, setCurrentMovie] = useState(null);

  useEffect(() => {
    const handleOpenMoviePlayer = (event) => {
      setCurrentMovie(event.detail);
      document.body.classList.add('player-open');
    };

    window.addEventListener('openMoviePlayer', handleOpenMoviePlayer);
    
    return () => {
      window.removeEventListener('openMoviePlayer', handleOpenMoviePlayer);
      document.body.classList.remove('player-open');
    };
  }, []);

  const handleClosePlayer = () => {
    setCurrentMovie(null);
    document.body.classList.remove('player-open');
  };

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          {/* ✅ ДОБАВЛЕНО: шапка отображается на всех страницах */}
          <Header />
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/for-you" element={<ForYou />} />
            <Route path="/clips" element={<Clips />} />
            <Route path="/saved" element={<Saved />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/search" element={<SearchResults />} />
          </Routes>
          
          {currentMovie && (
            <MoviePlayer movie={currentMovie} onClose={handleClosePlayer} />
          )}
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;