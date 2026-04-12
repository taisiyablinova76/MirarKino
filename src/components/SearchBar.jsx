import React, { useState, useEffect, useRef } from 'react';
import { suggestMovies, getMovie } from '../services/api';
import MoviePlayer from './MoviePlayer';
import './SearchBar.css';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length >= 2) {
        const results = await suggestMovies(query);
        setSuggestions(results);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const delayDebounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSuggestionClick = async (suggestion) => {
    setShowSuggestions(false);
    setQuery('');
    
    const movie = await getMovie(suggestion.id);
    if (movie) {
      setSelectedMovie(movie);
    }
  };

  const handleClear = () => {
    setQuery('');
  };

  const handleClosePlayer = () => {
    setSelectedMovie(null);
  };

  return (
    <>
      <div className="search-container" ref={searchRef}>
        <div className="search-form">
          <input
            type="text"
            className="search-input"
            placeholder="Поиск фильмов..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length >= 2 && setShowSuggestions(true)}
          />
          {query && (
            <button type="button" className="search-clear" onClick={handleClear}>
              ✕
            </button>
          )}
          <button type="submit" className="search-button">
            🔍
          </button>
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div className="suggestions-dropdown">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <span className="suggestion-icon">🎬</span>
                <span className="suggestion-title">{suggestion.title}</span>
                <span className="suggestion-action">▶ Смотреть</span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {selectedMovie && (
        <MoviePlayer movie={selectedMovie} onClose={handleClosePlayer} />
      )}
    </>
  );
};

export default SearchBar;