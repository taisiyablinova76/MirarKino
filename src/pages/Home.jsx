import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import MovieCard from '../components/MovieCard';
import MoviePlayer from '../components/MoviePlayer';
import { getMovies } from '../services/api';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    setLoading(true);
    const moviesData = await getMovies();
    setMovies(moviesData);
    setLoading(false);
  };

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

  if (loading) {
    return (
      <>
        <Header />
        <main style={containerStyle}>
          <div style={{ textAlign: 'center', color: '#d47b7b', padding: '4rem' }}>
            Загрузка фильмов...
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main style={containerStyle}>
        <h2 style={titleStyle}>🔴 КАТАЛОГ ФИЛЬМОВ</h2>
        <div style={gridStyle}>
          {movies.map(movie => (
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