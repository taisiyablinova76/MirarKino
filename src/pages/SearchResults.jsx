// src/pages/SearchResults.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import MovieCard from '../components/MovieCard';
import { searchMovies } from '../services/api';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (query) {
        setLoading(true);
        const results = await searchMovies(query);
        setMovies(results);
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <>
      <Header />
      <div className="main-content">
        <h1 className="catalog-title">
          Результаты поиска: "{query}"
        </h1>
        
        {loading ? (
          <div style={{ textAlign: 'center', color: '#d47b7b', padding: '2rem' }}>
            Поиск...
          </div>
        ) : movies.length > 0 ? (
          <div className="movies-grid">
            {movies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: '#d47b7b', padding: '2rem' }}>
            Ничего не найдено
          </div>
        )}
      </div>
    </>
  );
};

export default SearchResults;