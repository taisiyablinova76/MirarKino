import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import MovieCard from '../components/MovieCard';
import MoviePlayer from '../components/MoviePlayer';
import { searchMovies } from '../services/api';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const query = location.state?.query || '';

  useEffect(() => {
    const performSearch = async () => {
      if (location.state?.results) {
        setResults(location.state.results);
        setLoading(false);
      } else if (query) {
        setLoading(true);
        const searchResults = await searchMovies(query);
        setResults(searchResults);
        setLoading(false);
      } else {
        navigate('/');
      }
    };

    performSearch();
  }, [location, query, navigate]);

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  const handleClosePlayer = () => {
    setSelectedMovie(null);
  };

  const containerStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '2rem'
  };

  const titleStyle = {
    fontSize: '1.8rem',
    fontWeight: 600,
    marginBottom: '1rem',
    color: '#eacece',
    borderLeft: '5px solid #8b1e1e',
    paddingLeft: '1rem'
  };

  const countStyle = {
    color: '#a16565',
    marginBottom: '2rem',
    fontSize: '1rem'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '2rem'
  };

  const emptyStyle = {
    textAlign: 'center',
    padding: '4rem',
    color: '#a16565',
    fontSize: '1.2rem'
  };

  if (loading) {
    return (
      <>
        <Header />
        <main style={containerStyle}>
          <div style={{ textAlign: 'center', color: '#d47b7b', padding: '4rem' }}>
            🔍 Поиск фильмов...
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main style={containerStyle}>
        <h2 style={titleStyle}>
          🔍 Результаты поиска: "{query}"
        </h2>
        <p style={countStyle}>Найдено фильмов: {results.length}</p>

        {results.length > 0 ? (
          <div style={gridStyle}>
            {results.map(movie => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onClick={() => handleMovieClick(movie)}
              />
            ))}
          </div>
        ) : (
          <div style={emptyStyle}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
            <p>Ничего не найдено по запросу "{query}"</p>
            <p style={{ fontSize: '1rem', marginTop: '1rem' }}>
              Попробуйте изменить поисковый запрос
            </p>
          </div>
        )}
      </main>
      {selectedMovie && (
        <MoviePlayer movie={selectedMovie} onClose={handleClosePlayer} />
      )}
    </>
  );
};

export default SearchResults;