from models import db, User, Movie, WatchHistory, SavedMovie, LikedClip
from sqlalchemy import desc, func
import random

class RecommendationSystem:
    """Система рекомендаций фильмов"""
    
    @staticmethod
    def get_user_preferences(user_id):
        """Получение предпочтений пользователя на основе истории просмотров и сохранений"""
        # Получаем жанры из просмотренных фильмов
        watched_movies = db.session.query(Movie).join(
            WatchHistory, WatchHistory.movie_id == Movie.id
        ).filter(WatchHistory.user_id == user_id).all()
        
        # Получаем жанры из сохраненных фильмов
        saved_movies = db.session.query(Movie).join(
            SavedMovie, SavedMovie.movie_id == Movie.id
        ).filter(SavedMovie.user_id == user_id).all()
        
        # Собираем все жанры
        genres = []
        for movie in watched_movies + saved_movies:
            if movie.genre:
                genres.extend([g.strip() for g in movie.genre.split(',')])
        
        # Считаем частоту жанров
        genre_count = {}
        for genre in genres:
            genre_count[genre] = genre_count.get(genre, 0) + 1
        
        # Сортируем по популярности
        sorted_genres = sorted(genre_count.items(), key=lambda x: x[1], reverse=True)
        
        return [genre for genre, count in sorted_genres[:3]]  # Топ-3 любимых жанра
    
    @staticmethod
    def get_personalized_recommendations(user_id, limit=10):
        """Получение персональных рекомендаций для пользователя"""
        # Получаем предпочтения пользователя
        preferences = RecommendationSystem.get_user_preferences(user_id)
        
        # Получаем ID уже просмотренных и сохраненных фильмов
        watched_ids = [w.movie_id for w in WatchHistory.query.filter_by(user_id=user_id).all()]
        saved_ids = [s.movie_id for s in SavedMovie.query.filter_by(user_id=user_id).all()]
        excluded_ids = set(watched_ids + saved_ids)
        
        # Если есть предпочтения, рекомендуем по жанрам
        if preferences:
            recommendations = []
            for genre in preferences:
                movies = Movie.query.filter(
                    Movie.genre.like(f'%{genre}%'),
                    ~Movie.id.in_(excluded_ids)
                ).order_by(
                    desc(Movie.rating),
                    desc(Movie.views)
                ).limit(limit // len(preferences) + 1).all()
                recommendations.extend(movies)
            
            # Убираем дубликаты
            seen = set()
            unique_recommendations = []
            for movie in recommendations:
                if movie.id not in seen:
                    seen.add(movie.id)
                    unique_recommendations.append(movie)
            
            return unique_recommendations[:limit]
        
        # Если нет предпочтений, рекомендуем популярные фильмы
        popular_movies = Movie.query.filter(
            ~Movie.id.in_(excluded_ids)
        ).order_by(
            desc(Movie.rating),
            desc(Movie.views)
        ).limit(limit).all()
        
        return popular_movies
    
    @staticmethod
    def get_similar_movies(movie_id, limit=5):
        """Получение похожих фильмов на основе жанра"""
        movie = Movie.query.get(movie_id)
        if not movie or not movie.genre:
            return []
        
        genres = [g.strip() for g in movie.genre.split(',')]
        
        similar_movies = []
        for genre in genres:
            movies = Movie.query.filter(
                Movie.id != movie_id,
                Movie.genre.like(f'%{genre}%')
            ).order_by(desc(Movie.rating)).limit(limit).all()
            similar_movies.extend(movies)
        
        # Убираем дубликаты
        seen = set()
        unique_movies = []
        for movie in similar_movies:
            if movie.id not in seen:
                seen.add(movie.id)
                unique_movies.append(movie)
        
        return unique_movies[:limit]
    
    @staticmethod
    def get_personalized_clips(user_id, limit=10):
        """Получение персональных клипов для пользователя"""
        # Получаем предпочтения по жанрам
        preferences = RecommendationSystem.get_user_preferences(user_id)
        
        # Получаем ID уже понравившихся клипов
        liked_clip_ids = [l.clip_id for l in LikedClip.query.filter_by(user_id=user_id).all()]
        
        # Рекомендуем клипы из любимых жанров
        if preferences:
            clips = []
            for genre in preferences:
                # Находим фильмы нужного жанра и их клипы
                movies = Movie.query.filter(Movie.genre.like(f'%{genre}%')).all()
                for movie in movies:
                    movie_clips = Clip.query.filter_by(movie_id=movie.id).all()
                    clips.extend(movie_clips)
            
            # Убираем уже понравившиеся
            unique_clips = []
            for clip in clips:
                if clip.id not in liked_clip_ids:
                    unique_clips.append(clip)
            
            # Сортируем по популярности
            unique_clips.sort(key=lambda x: x.likes, reverse=True)
            
            return unique_clips[:limit]
        
        # Если нет предпочтений, рекомендуем популярные клипы
        popular_clips = Clip.query.order_by(desc(Clip.likes)).limit(limit).all()
        return popular_clips