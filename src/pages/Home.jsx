import React, { useState } from 'react';
import Header from '../components/Header';
import MovieCard from '../components/MovieCard';
import MoviePlayer from '../components/MoviePlayer';
import { MOVIES } from '../services/api';

const Home = () => {
  const [selectedMovie, setSelectedMovie] = useState(null);

  const containerStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '2rem'
  };

  const titleStyle = {
    fontSize: '1.8rem',
    fontWeight: 600,
    marginBottom: '2rem',
    color: '#eacece',
    borderLeft: '5px solid #8b1e1e',
    paddingLeft: '1rem'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '2rem'
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  const handleClosePlayer = () => {
    setSelectedMovie(null);
  };

  return (
    <>
      <Header />
      <main style={containerStyle}>
        <h2 style={titleStyle}>🔴 КАТАЛОГ ФИЛЬМОВ</h2>
        <div style={gridStyle}>
          {Object.values(MOVIES).map(movie => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onClick={() => handleMovieClick(movie)}
            />
          ))}
        </div>
      </main>
      {selectedMovie && (
        <MoviePlayer movie={selectedMovie} onClose={handleClosePlayer} />
      )}
    </>
  );
};

export default Home;