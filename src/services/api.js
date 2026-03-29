import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true  // Важно для сессий
});

// ============= АУТЕНТИФИКАЦИЯ =============

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Ошибка регистрации' };
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post('/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Ошибка входа' };
  }
};

export const logout = async () => {
  const response = await api.post('/logout');
  return response.data;
};

export const checkAuth = async () => {
  const response = await api.get('/check-auth');
  return response.data;
};

// ============= ФИЛЬМЫ =============

export const getMovies = async () => {
  const response = await api.get('/movies');
  return response.data;
};

export const getMovie = async (movieId) => {
  const response = await api.get(`/movie/${movieId}`);
  return response.data;
};

export const getRecommendations = async () => {
  const response = await api.get('/recommendations');
  return response.data;
};

// ============= СОХРАНЕННЫЕ ФИЛЬМЫ =============

export const getSavedMovies = async () => {
  const response = await api.get('/saved');
  return response.data;
};

export const toggleSaveMovie = async (movieId) => {
  const response = await api.post(`/saved/${movieId}`);
  return response.data;
};

export const checkSaved = async (movieId) => {
  const response = await api.get(`/saved/check/${movieId}`);
  return response.data;
};

// ============= КЛИПЫ =============

export const getClips = async () => {
  const response = await api.get('/clips');
  return response.data;
};

export const likeClip = async (clipId, liked) => {
  const response = await api.post(`/clip/${clipId}/like`, { liked });
  return response.data;
};

export const getPersonalizedClips = async () => {
  const response = await api.get('/clips/recommendations');
  return response.data;
};

// ============= ДЛЯ СОВМЕСТИМОСТИ С СТАРЫМ КОДОМ =============

// Эти функции оставляем для совместимости, но они используют бэкенд
export const saveMovieOld = async (movieId, email) => {
  // Используем новый API, email игнорируется (берется из сессии)
  const result = await toggleSaveMovie(movieId);
  return { success: true, saved: result.saved };
};

export const checkSavedOld = async (movieId, email) => {
  const result = await checkSaved(movieId);
  return { saved: result.saved };
};

// Данные о фильмах (для быстрого доступа, но лучше использовать API)
export const MOVIES = {
  1: { 
    id: 1, 
    title: 'Эдвард руки-ножницы', 
    year: 1990, 
    poster_url: '/images/posters/edward.webp',
    video_url: 'https://cdn.lordfilm64.com/?token_movie=39c77691645de97a065a74efc2908f&token=ec4acf58bc9bf62f8be18cad95484c',
    description: 'Фантастическая драма о человеке с ножницами вместо рук'
  },
  2: { 
    id: 2, 
    title: 'Прислуга', 
    year: 2011, 
    poster_url: '/images/posters/the-help.jpg',
    video_url: 'https://cdn.lordfilm64.com/?token_movie=e5c1c0ba38dd1e1c1f3e651d759ccb&token=ec4acf58bc9bf62f8be18cad95484c',
    description: 'Драма о жизни чернокожих служанок в Америке 1960-х'
  },
  3: { 
    id: 3, 
    title: 'Красотка на всю голову', 
    year: 2018, 
    poster_url: '/images/posters/i-feel-pretty.jpg',
    video_url: 'https://cdn.lordfilm64.com/?token_movie=304f4993c30596341d94f811992b19&token=ec4acf58bc9bf62f8be18cad95484c',
    description: 'Комедия о девушке, которая просыпается после пластической операции'
  },
  4: { 
    id: 4, 
    title: 'Бесславные ублюдки', 
    year: 2009, 
    poster_url: '/images/posters/basterds.jpg',
    video_url: 'https://cdn.lordfilm64.com/?token_movie=1795bfe2428f79949aca5a90ac820d&token=ec4acf58bc9bf62f8be18cad95484c',
    description: 'Вторая мировая война, отряд еврейских солдат охотится на нацистов'
  },
  5: { 
    id: 5, 
    title: 'Остров проклятых', 
    year: 2009, 
    poster_url: '/images/posters/ostrov-proklatih.jpg',
    video_url: 'https://cdn.lordfilm64.com/?token_movie=3a0371f659eb08b0a5d74148069566&token=ec4acf58bc9bf62f8be18cad95484c',
    description: 'Детективный триллер о расследовании в психиатрической клинике'
  },
  6: { 
    id: 6, 
    title: 'Бойцовский клуб', 
    year: 1999, 
    poster_url: '/images/posters/fight-club.jpg',
    video_url: 'https://cdn.lordfilm64.com/?token_movie=49a51d9ed3db49eb96a28553ca2e5d&token=ec4acf58bc9bf62f8be18cad95484c',
    description: 'Культовый фильм о подпольных боях и поиске себя'
  },
  7: { 
    id: 7, 
    title: 'Оно', 
    year: 2017, 
    poster_url: '/images/posters/it.jpg',
    video_url: 'https://cdn.lordfilm64.com/?token_movie=8bcb7e44010177835c0f7b4bd1be29&token=ec4acf58bc9bf62f8be18cad95484c',
    description: 'Ужасы о клоуне-монстре, терроризирующем город'
  },
  8: { 
    id: 8, 
    title: 'Орудия', 
    year: 2025, 
    poster_url: '/images/posters/weapons.jpg',
    video_url: 'https://cdn.lordfilm64.com/?token_movie=deeb84be1c0b8c20c2b2c67a80199d&token=ec4acf58bc9bf62f8be18cad95484c',
    description: 'Триллер о массовом исчезновении детей'
  },
};

export const CLIPS = [
  { id: 1, movie_id: 1, title: 'Эдвард руки-ножницы', description: 'Трогательная история', video_url: 'https://player.vimeo.com/video/76979871?autoplay=1', likes: 0, poster_url: '/images/posters/edward.webp' },
  { id: 2, movie_id: 2, title: 'Прислуга', description: 'Лучшие моменты', video_url: 'https://player.vimeo.com/video/76979871?autoplay=1', likes: 0, poster_url: '/images/posters/the-help.jpg' },
  { id: 3, movie_id: 3, title: 'Красотка на всю голову', description: 'Смешные сцены', video_url: 'https://player.vimeo.com/video/76979871?autoplay=1', likes: 0, poster_url: '/images/posters/i-feel-pretty.jpg' }
];

export default api;