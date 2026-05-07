import axios from 'axios';
const API_BASE = 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_BASE, headers: {'Content-Type': 'application/json'}, withCredentials: true });

export const registerUser = async (d) => { try { return (await api.post('/register', d)).data; } catch(e) { return e.response?.data || {error:'Ошибка'}; }};
export const login = async (d) => { try { return (await api.post('/login', d)).data; } catch(e) { return e.response?.data || {error:'Ошибка'}; }};
export const logout = async () => { try { return (await api.post('/logout')).data; } catch { return {success:false}; }};
export const checkAuth = async () => { try { return (await api.get('/check-auth')).data; } catch { return {authenticated:false}; }};

export const getMovies = async () => { try { return (await api.get('/movies')).data; } catch { return []; }};
export const getMovie = async (id) => { try { return (await api.get(`/movie/${id}`)).data; } catch { return null; }};
export const getTrendingMovies = async () => { try { return (await api.get('/movies/trending')).data; } catch { return []; }};
export const getTopRatedMovies = async () => { try { return (await api.get('/movies/top-rated')).data; } catch { return []; }};
export const getMoviesByGenre = async (g) => { try { return (await api.get(`/movies/genre/${g}`)).data; } catch { return []; }};
export const searchMovies = async (q) => { try { return (await api.get('/movies/search', {params:{q}})).data; } catch { return []; }};
export const suggestMovies = async (q) => { try { return (await api.get('/movies/suggest', {params:{q}})).data; } catch { return []; }};
export const getRecommendations = async () => { try { return (await api.get('/recommendations')).data; } catch { return []; }};
export const getSimilarMovies = async (id) => { try { return (await api.get(`/movie/${id}/similar`)).data; } catch { return []; }};

export const getSavedMovies = async () => { try { return (await api.get('/saved')).data; } catch { return []; }};
export const toggleSaveMovie = async (id) => { try { return (await api.post(`/saved/${id}`)).data; } catch { return {saved:false}; }};
export const checkSaved = async (id) => { try { return (await api.get(`/saved/check/${id}`)).data; } catch { return {saved:false}; }};

export const getClips = async () => { try { return (await api.get('/clips')).data; } catch { return []; }};
export const getLocalClips = async () => { try { const r = await fetch('http://localhost:5000/api/clips/local'); if(!r.ok) throw new Error(r.status); return await r.json(); } catch { return []; }};
export const getClip = async (id) => { try { return (await api.get(`/clip/${id}`)).data; } catch { return null; }};
export const likeClip = async (id, liked) => { try { return (await api.post(`/clip/${id}/like`, {liked})).data; } catch { return {liked:false, likes:0}; }};
export const checkClipLike = async (id) => { try { return (await api.get(`/clip/${id}/check-like`)).data; } catch { return {liked:false}; }};
export const getPersonalizedClips = async () => { try { return (await api.get('/clips/recommendations')).data; } catch { return []; }};

export const getWatchHistory = async () => { try { return (await api.get('/history')).data; } catch { return []; }};
export const recordWatch = async (id, dur=0) => { try { return (await api.post(`/movie/${id}/watch`, {watch_duration:dur})).data; } catch { return {success:false}; }};
export const getUserStats = async () => { try { return (await api.get('/user/stats')).data; } catch { return {watch_count:0, saved_count:0, liked_count:0, favorite_genre:'не определен'}; }};

export default api;