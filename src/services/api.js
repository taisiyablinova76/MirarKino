import axios from 'axios';

// Используем относительный путь, чтобы работать на одном сервере
const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// ============= АУТЕНТИФИКАЦИЯ =============

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/register', userData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw { error: 'Ошибка регистрации' };
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post('/login', credentials);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw { error: 'Ошибка входа' };
  }
};

export const logout = async () => {
  try {
    const response = await api.post('/logout');
    return response.data;
  } catch (error) {
    return { success: false, error: 'Ошибка выхода' };
  }
};

export const checkAuth = async () => {
  try {
    const response = await api.get('/check-auth');
    return response.data;
  } catch (error) {
    return { authenticated: false };
  }
};

// ============= ФИЛЬМЫ =============

export const getMovies = async () => {
  try {
    const response = await api.get('/movies');
    return response.data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
};

export const getMovie = async (movieId) => {
  try {
    const response = await api.get(`/movie/${movieId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching movie:', error);
    return null;
  }
};

export const getRecommendations = async () => {
  try {
    const response = await api.get('/recommendations');
    return response.data;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return [];
  }
};

// ============= СОХРАНЕННЫЕ ФИЛЬМЫ =============

export const getSavedMovies = async () => {
  try {
    const response = await api.get('/saved');
    return response.data;
  } catch (error) {
    console.error('Error fetching saved movies:', error);
    return [];
  }
};

export const toggleSaveMovie = async (movieId) => {
  try {
    const response = await api.post(`/saved/${movieId}`);
    return response.data;
  } catch (error) {
    console.error('Error toggling saved movie:', error);
    return { saved: false, error: 'Ошибка сохранения' };
  }
};

export const checkSaved = async (movieId) => {
  try {
    const response = await api.get(`/saved/check/${movieId}`);
    return response.data;
  } catch (error) {
    return { saved: false };
  }
};

// ============= КЛИПЫ =============

export const getClips = async () => {
  try {
    const response = await api.get('/clips');
    return response.data;
  } catch (error) {
    console.error('Error fetching clips:', error);
    return [];
  }
};

export const likeClip = async (clipId, liked) => {
  try {
    const response = await api.post(`/clip/${clipId}/like`, { liked });
    return response.data;
  } catch (error) {
    console.error('Error liking clip:', error);
    return { liked: false, likes: 0 };
  }
};

export const checkClipLike = async (clipId) => {
  try {
    const response = await api.get(`/clip/${clipId}/check-like`);
    return response.data;
  } catch (error) {
    return { liked: false };
  }
};

export const getPersonalizedClips = async () => {
  try {
    const response = await api.get('/clips/recommendations');
    return response.data;
  } catch (error) {
    console.error('Error fetching personalized clips:', error);
    return [];
  }
};

// ============= ИСТОРИЯ =============

export const getWatchHistory = async () => {
  try {
    const response = await api.get('/history');
    return response.data;
  } catch (error) {
    console.error('Error fetching history:', error);
    return [];
  }
};

export const recordWatch = async (movieId, watchDuration = 0) => {
  try {
    const response = await api.post(`/movie/${movieId}/watch`, { watch_duration: watchDuration });
    return response.data;
  } catch (error) {
    console.error('Error recording watch:', error);
    return { success: false };
  }
};

// ============= СТАТИСТИКА =============

export const getUserStats = async () => {
  try {
    const response = await api.get('/user/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return { watch_count: 0, saved_count: 0, liked_count: 0, favorite_genre: 'не определен' };
  }
};



// Добавьте в api.js после других функций

export const searchMovies = async (query) => {
  try {
    const response = await api.get('/movies/search', {
      params: { q: query }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
};

export const suggestMovies = async (query) => {
  try {
    const response = await api.get('/movies/suggest', {
      params: { q: query }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting suggestions:', error);
    return [];
  }
};

// ============= ВРЕМЕННЫЕ ДАННЫЕ ДЛЯ РАЗРАБОТКИ =============
// Эти данные используются пока бэкенд не полностью интегрирован

export const MOVIES = {
  1: { 
    id: 1, 
    title: 'Эдвард руки-ножницы', 
    year: 1990, 
    poster_url: '/images/posters/edward.webp',
    video_url: 'https://cdn.lordfilm64.com/?token_movie=39c77691645de97a065a74efc2908f&token=ec4acf58bc9bf62f8be18cad95484c',
    description: 'Фантастическая драма о человеке с ножницами вместо рук',
    genre: 'фантастика, драма, романтика',
    rating: 8.0
  },
  2: { 
    id: 2, 
    title: 'Прислуга', 
    year: 2011, 
    poster_url: '/images/posters/the-help.jpg',
    video_url: 'https://cdn.lordfilm64.com/?token_movie=e5c1c0ba38dd1e1c1f3e651d759ccb&token=ec4acf58bc9bf62f8be18cad95484c',
    description: 'Драма о жизни чернокожих служанок в Америке 1960-х',
    genre: 'драма, история',
    rating: 8.1
  },
  3: { 
    id: 3, 
    title: 'Красотка на всю голову', 
    year: 2018, 
    poster_url: '/images/posters/i-feel-pretty.jpg',
    video_url: 'https://cdn.lordfilm64.com/?token_movie=304f4993c30596341d94f811992b19&token=ec4acf58bc9bf62f8be18cad95484c',
    description: 'Комедия о девушке, которая просыпается после пластической операции',
    genre: 'комедия, фэнтези',
    rating: 7.5
  },
  4: { 
    id: 4, 
    title: 'Бесславные ублюдки', 
    year: 2009, 
    poster_url: '/images/posters/basterds.jpg',
    video_url: 'https://cdn.lordfilm64.com/?token_movie=1795bfe2428f79949aca5a90ac820d&token=ec4acf58bc9bf62f8be18cad95484c',
    description: 'Вторая мировая война, отряд еврейских солдат охотится на нацистов',
    genre: 'боевик, драма, военный',
    rating: 8.2
  },
  5: { 
    id: 5, 
    title: 'Остров проклятых', 
    year: 2009, 
    poster_url: '/images/posters/ostrov-proklatih.jpg',
    video_url: 'https://cdn.lordfilm64.com/?token_movie=3a0371f659eb08b0a5d74148069566&token=ec4acf58bc9bf62f8be18cad95484c',
    description: 'Детективный триллер о расследовании в психиатрической клинике',
    genre: 'триллер, детектив, драма',
    rating: 8.5
  },
  6: { 
    id: 6, 
    title: 'Бойцовский клуб', 
    year: 1999, 
    poster_url: '/images/posters/fight-club.jpg',
    video_url: 'https://cdn.lordfilm64.com/?token_movie=49a51d9ed3db49eb96a28553ca2e5d&token=ec4acf58bc9bf62f8be18cad95484c',
    description: 'Культовый фильм о подпольных боях и поиске себя',
    genre: 'триллер, драма',
    rating: 8.6
  },
  7: { 
    id: 7, 
    title: 'Оно', 
    year: 2017, 
    poster_url: '/images/posters/it.jpg',
    video_url: 'https://cdn.lordfilm64.com/?token_movie=8bcb7e44010177835c0f7b4bd1be29&token=ec4acf58bc9bf62f8be18cad95484c',
    description: 'Ужасы о клоуне-монстре, терроризирующем город',
    genre: 'ужасы, драма',
    rating: 8.0
  },
  8: { 
    id: 8, 
    title: 'Орудия', 
    year: 2025, 
    poster_url: '/images/posters/weapons.jpg',
    video_url: 'https://cdn.lordfilm64.com/?token_movie=deeb84be1c0b8c20c2b2c67a80199d&token=ec4acf58bc9bf62f8be18cad95484c',
    description: 'Триллер о массовом исчезновении детей',
    genre: 'ужасы, триллер',
    rating: 7.8
  },
};

export const CLIPS = [
  { 
    id: 1, 
    movie_id: 1, 
    title: 'Эдвард руки-ножницы', 
    description: 'Трогательная история о любви', 
    video_url: 'https://player.vimeo.com/video/76979871?autoplay=1', 
    likes: 0, 
    thumbnail: 'poster-1',
    duration: 60
  },
  { 
    id: 2, 
    movie_id: 2, 
    title: 'Прислуга', 
    description: 'Лучшие моменты из фильма', 
    video_url: 'https://player.vimeo.com/video/76979871?autoplay=1', 
    likes: 0, 
    thumbnail: 'poster-2',
    duration: 45
  },
  { 
    id: 3, 
    movie_id: 3, 
    title: 'Красотка на всю голову', 
    description: 'Смешные сцены и трансформация', 
    video_url: 'https://player.vimeo.com/video/76979871?autoplay=1', 
    likes: 0, 
    thumbnail: 'poster-3',
    duration: 50
  },
  { 
    id: 4, 
    movie_id: 4, 
    title: 'Бесславные ублюдки', 
    description: 'Лучшие боевые сцены', 
    video_url: 'https://player.vimeo.com/video/76979871?autoplay=1', 
    likes: 0, 
    thumbnail: 'poster-4',
    duration: 70
  },
  { 
    id: 5, 
    movie_id: 5, 
    title: 'Остров проклятых', 
    description: 'Загадочные моменты фильма', 
    video_url: 'https://player.vimeo.com/video/76979871?autoplay=1', 
    likes: 0, 
    thumbnail: 'poster-5',
    duration: 65
  },
  { 
    id: 6, 
    movie_id: 6, 
    title: 'Бойцовский клуб', 
    description: 'Лучшие цитаты и сцены', 
    video_url: 'https://player.vimeo.com/video/76979871?autoplay=1', 
    likes: 0, 
    thumbnail: 'poster-6',
    duration: 55
  },
  { 
    id: 7, 
    movie_id: 7, 
    title: 'Оно', 
    description: 'Самые страшные моменты', 
    video_url: 'https://player.vimeo.com/video/76979871?autoplay=1', 
    likes: 0, 
    thumbnail: 'poster-1',
    duration: 80
  },
  { 
    id: 8, 
    movie_id: 8, 
    title: 'Орудия', 
    description: 'Трейлер и лучшие сцены', 
    video_url: 'https://player.vimeo.com/video/76979871?autoplay=1', 
    likes: 0, 
    thumbnail: 'poster-2',
    duration: 45
  }
];

export default api;