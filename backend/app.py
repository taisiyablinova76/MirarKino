from flask import Flask, request, jsonify, session
from flask_cors import CORS
from datetime import timedelta
import hashlib
import re

from models import db, User, Movie, Clip, WatchHistory, SavedMovie, LikedClip
from database import init_db, hash_password
from recommend import RecommendationSystem

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-change-this-in-production'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///movies.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = False  # В production установите True
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=7)

CORS(app, supports_credentials=True, origins=['http://localhost:3000'])
db.init_app(app)

# Инициализируем базу данных
with app.app_context():
    init_db(app)

def hash_password(password):
    """Хеширование пароля"""
    return hashlib.sha256(password.encode()).hexdigest()

# ============= АУТЕНТИФИКАЦИЯ =============

@app.route('/api/register', methods=['POST'])
def register():
    """Регистрация нового пользователя"""
    data = request.json
    
    if not data:
        return jsonify({'error': 'Нет данных'}), 400
    
    username = data.get('username', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    
    # Валидация
    if not username or not email or not password:
        return jsonify({'error': 'Все поля обязательны'}), 400
    
    if len(username) < 3 or len(username) > 20:
        return jsonify({'error': 'Имя от 3 до 20 символов'}), 400
    
    email_pattern = re.compile(r'^[^\s@]+@[^\s@]+\.[^\s@]+$')
    if not email_pattern.match(email):
        return jsonify({'error': 'Некорректный email'}), 400
    
    if len(password) < 6:
        return jsonify({'error': 'Пароль минимум 6 символов'}), 400
    
    # Проверка уникальности
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email уже зарегистрирован'}), 409
    
    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Имя пользователя уже занято'}), 409
    
    # Создаем пользователя
    user = User(
        username=username,
        email=email,
        password=hash_password(password)
    )
    
    db.session.add(user)
    db.session.commit()
    
    # Сохраняем в сессию
    session['user_id'] = user.id
    session['user'] = user.to_dict()
    session.permanent = True
    
    return jsonify({
        'success': True,
        'message': 'Регистрация успешна',
        'user': user.to_dict()
    }), 201

@app.route('/api/login', methods=['POST'])
def login():
    """Авторизация пользователя"""
    data = request.json
    
    if not data:
        return jsonify({'error': 'Нет данных'}), 400
    
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    
    user = User.query.filter_by(email=email).first()
    
    if not user or user.password != hash_password(password):
        return jsonify({'error': 'Неверный email или пароль'}), 401
    
    session['user_id'] = user.id
    session['user'] = user.to_dict()
    session.permanent = True
    
    return jsonify({
        'success': True,
        'message': 'Вход выполнен',
        'user': user.to_dict()
    })

@app.route('/api/logout', methods=['POST'])
def logout():
    """Выход из системы"""
    session.clear()
    return jsonify({'success': True})

@app.route('/api/check-auth')
def check_auth():
    """Проверка авторизации"""
    if 'user_id' in session:
        user = User.query.get(session['user_id'])
        if user:
            return jsonify({'authenticated': True, 'user': user.to_dict()})
    
    return jsonify({'authenticated': False})

# ============= ФИЛЬМЫ =============

@app.route('/api/movies')
def get_movies():
    """Получение всех фильмов"""
    movies = Movie.query.all()
    return jsonify([movie.to_dict() for movie in movies])

@app.route('/api/movie/<int:movie_id>')
def get_movie(movie_id):
    """Получение фильма по ID"""
    movie = Movie.query.get(movie_id)
    if not movie:
        return jsonify({'error': 'Фильм не найден'}), 404
    
    # Увеличиваем счетчик просмотров
    movie.views += 1
    db.session.commit()
    
    return jsonify(movie.to_dict())

@app.route('/api/movie/<int:movie_id>/watch', methods=['POST'])
def watch_movie(movie_id):
    """Запись просмотра фильма"""
    if 'user_id' not in session:
        return jsonify({'error': 'Необходимо авторизоваться'}), 401
    
    user_id = session['user_id']
    data = request.json
    watch_duration = data.get('watch_duration', 0)
    
    # Добавляем в историю просмотров
    watch_history = WatchHistory(
        user_id=user_id,
        movie_id=movie_id,
        watch_duration=watch_duration
    )
    db.session.add(watch_history)
    db.session.commit()
    
    return jsonify({'success': True})

# ============= РЕКОМЕНДАЦИИ =============

@app.route('/api/recommendations')
def get_recommendations():
    """Получение персональных рекомендаций"""
    if 'user_id' not in session:
        return jsonify({'error': 'Необходимо авторизоваться'}), 401
    
    user_id = session['user_id']
    recommendations = RecommendationSystem.get_personalized_recommendations(user_id)
    
    return jsonify([movie.to_dict() for movie in recommendations])

@app.route('/api/movie/<int:movie_id>/similar')
def get_similar_movies(movie_id):
    """Получение похожих фильмов"""
    similar = RecommendationSystem.get_similar_movies(movie_id)
    return jsonify([movie.to_dict() for movie in similar])

# ============= СОХРАНЕННЫЕ ФИЛЬМЫ =============

@app.route('/api/saved')
def get_saved_movies():
    """Получение сохраненных фильмов пользователя"""
    if 'user_id' not in session:
        return jsonify({'error': 'Необходимо авторизоваться'}), 401
    
    user_id = session['user_id']
    saved = SavedMovie.query.filter_by(user_id=user_id).all()
    movies = [s.movie.to_dict() for s in saved]
    
    return jsonify(movies)

@app.route('/api/saved/<int:movie_id>', methods=['POST'])
def toggle_save_movie(movie_id):
    """Сохранить или удалить фильм из сохраненных"""
    if 'user_id' not in session:
        return jsonify({'error': 'Необходимо авторизоваться'}), 401
    
    user_id = session['user_id']
    
    saved = SavedMovie.query.filter_by(user_id=user_id, movie_id=movie_id).first()
    
    if saved:
        db.session.delete(saved)
        db.session.commit()
        return jsonify({'saved': False, 'message': 'Фильм удален из сохраненных'})
    else:
        new_saved = SavedMovie(user_id=user_id, movie_id=movie_id)
        db.session.add(new_saved)
        db.session.commit()
        return jsonify({'saved': True, 'message': 'Фильм сохранен'})

@app.route('/api/saved/check/<int:movie_id>')
def check_saved(movie_id):
    """Проверка, сохранен ли фильм"""
    if 'user_id' not in session:
        return jsonify({'saved': False})
    
    user_id = session['user_id']
    saved = SavedMovie.query.filter_by(user_id=user_id, movie_id=movie_id).first()
    
    return jsonify({'saved': saved is not None})

# ============= КЛИПЫ =============

@app.route('/api/clips')
def get_clips():
    """Получение всех клипов"""
    clips = Clip.query.all()
    return jsonify([clip.to_dict() for clip in clips])

@app.route('/api/clip/<int:clip_id>')
def get_clip(clip_id):
    """Получение клипа по ID"""
    clip = Clip.query.get(clip_id)
    if not clip:
        return jsonify({'error': 'Клип не найден'}), 404
    return jsonify(clip.to_dict())

@app.route('/api/clip/<int:clip_id>/like', methods=['POST'])
def like_clip(clip_id):
    """Лайк/дизлайк клипа"""
    if 'user_id' not in session:
        return jsonify({'error': 'Необходимо авторизоваться'}), 401
    
    user_id = session['user_id']
    data = request.json
    liked = data.get('liked', True)
    
    liked_clip = LikedClip.query.filter_by(user_id=user_id, clip_id=clip_id).first()
    
    if liked and not liked_clip:
        # Добавляем лайк
        new_like = LikedClip(user_id=user_id, clip_id=clip_id)
        db.session.add(new_like)
        
        clip = Clip.query.get(clip_id)
        if clip:
            clip.likes += 1
        
        db.session.commit()
        return jsonify({'liked': True, 'likes': clip.likes if clip else 0})
    
    elif not liked and liked_clip:
        # Убираем лайк
        db.session.delete(liked_clip)
        
        clip = Clip.query.get(clip_id)
        if clip:
            clip.likes = max(0, clip.likes - 1)
        
        db.session.commit()
        return jsonify({'liked': False, 'likes': clip.likes if clip else 0})
    
    return jsonify({'liked': liked_clip is not None, 'likes': Clip.query.get(clip_id).likes if Clip.query.get(clip_id) else 0})

@app.route('/api/clip/<int:clip_id>/check-like')
def check_clip_like(clip_id):
    """Проверка, лайкнут ли клип"""
    if 'user_id' not in session:
        return jsonify({'liked': False})
    
    user_id = session['user_id']
    liked = LikedClip.query.filter_by(user_id=user_id, clip_id=clip_id).first()
    
    return jsonify({'liked': liked is not None})

@app.route('/api/clips/recommendations')
def get_personalized_clips():
    """Получение персональных рекомендаций клипов"""
    if 'user_id' not in session:
        return jsonify({'error': 'Необходимо авторизоваться'}), 401
    
    user_id = session['user_id']
    recommendations = RecommendationSystem.get_personalized_clips(user_id)
    
    return jsonify([clip.to_dict() for clip in recommendations])

# ============= ИСТОРИЯ =============

@app.route('/api/history')
def get_watch_history():
    """Получение истории просмотров"""
    if 'user_id' not in session:
        return jsonify({'error': 'Необходимо авторизоваться'}), 401
    
    user_id = session['user_id']
    history = WatchHistory.query.filter_by(user_id=user_id).order_by(
        WatchHistory.watched_at.desc()
    ).limit(20).all()
    
    result = []
    for h in history:
        movie = Movie.query.get(h.movie_id)
        if movie:
            result.append({
                'id': h.id,
                'movie': movie.to_dict(),
                'watched_at': h.watched_at.isoformat(),
                'watch_duration': h.watch_duration
            })
    
    return jsonify(result)

# ============= НОВЫЕ ЭНДПОИНТЫ =============

@app.route('/api/movies/trending')
def get_trending_movies():
    """Получение популярных фильмов"""
    trending = RecommendationSystem.get_trending_movies()
    return jsonify([movie.to_dict() for movie in trending])

@app.route('/api/movies/top-rated')
def get_top_rated_movies():
    """Получение высокооцененных фильмов"""
    top_rated = RecommendationSystem.get_top_rated_movies()
    return jsonify([movie.to_dict() for movie in top_rated])

@app.route('/api/movies/genre/<genre>')
def get_movies_by_genre(genre):
    """Получение фильмов по жанру"""
    movies = Movie.query.filter(Movie.genre.like(f'%{genre}%')).order_by(desc(Movie.rating)).all()
    return jsonify([movie.to_dict() for movie in movies])

@app.route('/api/user/stats')
def get_user_stats():
    """Получение статистики пользователя"""
    if 'user_id' not in session:
        return jsonify({'error': 'Необходимо авторизоваться'}), 401
    
    user_id = session['user_id']
    
    watch_count = WatchHistory.query.filter_by(user_id=user_id).count()
    saved_count = SavedMovie.query.filter_by(user_id=user_id).count()
    liked_count = LikedClip.query.filter_by(user_id=user_id).count()
    
    # Получаем любимый жанр
    preferences = RecommendationSystem.get_user_preferences(user_id)
    favorite_genre = preferences[0] if preferences else 'не определен'
    
    return jsonify({
        'watch_count': watch_count,
        'saved_count': saved_count,
        'liked_count': liked_count,
        'favorite_genre': favorite_genre
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)