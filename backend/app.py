from flask import Flask, request, jsonify, session, send_from_directory, send_file
from flask_cors import CORS
from datetime import timedelta
import hashlib
import re
import os
from sqlalchemy import desc
from models import db, User, Movie, Clip, WatchHistory, SavedMovie, LikedClip
from database import init_db
from recommend import RecommendationSystem
import mimetypes

app = Flask(__name__, static_folder='static', static_url_path='')
app.config['SECRET_KEY'] = 'your-secret-key-change-this-in-production'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///movies.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_SECURE'] = False
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=7)

# Регистрируем MIME-типы для видео
mimetypes.add_type('video/mp4', '.mp4')
mimetypes.add_type('video/webm', '.webm')
mimetypes.add_type('video/ogg', '.ogg')

CORS(app, supports_credentials=True, origins=['http://localhost:3000', 'http://localhost:5000'])

db.init_app(app)

# Инициализируем базу данных
with app.app_context():
    init_db(app)

def hash_password(password):
    """Хеширование пароля"""
    return hashlib.sha256(password.encode()).hexdigest()

# ============= ОБСЛУЖИВАНИЕ СТАТИЧЕСКИХ ФАЙЛОВ =============
@app.route('/videos/<path:filename>')
def serve_videos(filename):
    """Отдача видеофайла с поддержкой перемотки (206 Partial Content)"""
    video_folder = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'videos')
    print(f"[VIDEO] Запрошен файл: {filename}")
    print(f"[VIDEO] Путь к папке: {video_folder}")

    if not os.path.exists(video_folder):
        print(f"[VIDEO] ОШИБКА: Папка не существует: {video_folder}")
        return jsonify({'error': 'Папка с видео не найдена'}), 404

    file_path = os.path.join(video_folder, filename)

    if not os.path.exists(file_path):
        print(f"[VIDEO] ОШИБКА: Файл не найден: {file_path}")
        return jsonify({'error': f'Файл не найден: {filename}'}), 404

    return send_file(file_path, conditional=True, mimetype=mimetypes.guess_type(filename)[0])

@app.route('/api/clips/local')
def get_local_clips():
    """API: сканирует папку static/videos и возвращает список клипов"""
    video_folder = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'videos')
    print(f"[CLIPS API] Сканирование папки: {video_folder}")

    if not os.path.exists(video_folder):
        print(f"[CLIPS API] ОШИБКА: Папка не существует")
        return jsonify([]), 200

    # Поддерживаемые форматы (webm в приоритете)
    supported_ext = ('.webm', '.mp4', '.ogg', '.m4v', '.mov')
    clips = []

    try:
        files = os.listdir(video_folder)
        print(f"[CLIPS API] Найдено файлов в папке: {len(files)}")
        print(f"[CLIPS API] Список файлов: {files}")
        
        for filename in sorted(files):
            if filename.lower().endswith(supported_ext):
                file_path = os.path.join(video_folder, filename)
                
                if not os.path.isfile(file_path):
                    continue
                    
                file_size = os.path.getsize(file_path)
                
                # Создаем URL для видео
                video_url = f'/videos/{filename}'
                
                # Создаем читаемое название
                title = filename.rsplit('.', 1)[0]  # Убираем расширение
                title = title.replace('_', ' ').replace('-', ' ').title()
                
                # Определяем формат
                file_format = filename.rsplit('.', 1)[1].lower()
                
                clip_data = {
                    'id': len(clips),
                    'filename': filename,
                    'url': video_url,
                    'size_mb': round(file_size / (1024 * 1024), 2),
                    'title': title,
                    'format': file_format
                }
                
                print(f"[CLIPS API] Добавлен клип: {title} (формат: {file_format}, размер: {clip_data['size_mb']} МБ)")
                clips.append(clip_data)

    except Exception as e:
        print(f"[CLIPS API] ОШИБКА при сканировании: {e}")
        return jsonify([]), 200

    print(f"[CLIPS API] Всего найдено клипов: {len(clips)}")

    response = jsonify(clips)
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'

    return response

@app.route('/api/debug/videos')
def debug_videos():
    """Отладка: показывает информацию о папке с видео"""
    video_folder = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'videos')
    info = {
        'video_folder': video_folder,
        'exists': os.path.exists(video_folder),
        'files': [],
        'static_folder': app.static_folder,
        'current_directory': os.getcwd(),
        'absolute_path': os.path.abspath(__file__)
    }

    if os.path.exists(video_folder):
        info['files'] = os.listdir(video_folder)
        for f in info['files']:
            file_path = os.path.join(video_folder, f)
            if os.path.isfile(file_path):
                info[f'size_{f}'] = f"{os.path.getsize(file_path)} bytes ({round(os.path.getsize(file_path) / (1024 * 1024), 2)} MB)"
            else:
                info[f'type_{f}'] = 'directory'

    return jsonify(info)

@app.route('/images/<path:filename>')
def serve_images(filename):
    return send_from_directory('static/images', filename)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    if path.startswith('api/') or path.startswith('images/') or path.startswith('videos/'):
        return jsonify({'error': 'Not found'}), 404
    static_folder = os.path.join(os.path.dirname(__file__), 'static')
    if path and os.path.exists(os.path.join(static_folder, path)):
        return send_from_directory(static_folder, path)
    
    index_path = os.path.join(static_folder, 'index.html')
    if os.path.exists(index_path):
        return send_from_directory(static_folder, 'index.html')
        
    return jsonify({'error': 'Frontend not built. Run "npm run build" first.'}), 404

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

    if not username or not email or not password:
        return jsonify({'error': 'Все поля обязательны'}), 400

    if len(username) < 3 or len(username) > 20:
        return jsonify({'error': 'Имя от 3 до 20 символов'}), 400

    email_pattern = re.compile(r'^[^\s@]+@[^\s@]+\.[^\s@]+$')
    if not email_pattern.match(email):
        return jsonify({'error': 'Некорректный email'}), 400

    if len(password) < 6:
        return jsonify({'error': 'Пароль минимум 6 символов'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email уже зарегистрирован'}), 409

    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Имя пользователя уже занято'}), 409

    user = User(
        username=username,
        email=email,
        password=hash_password(password)
    )

    db.session.add(user)
    db.session.commit()

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

    watch_history = WatchHistory(
        user_id=user_id,
        movie_id=movie_id,
        watch_duration=watch_duration
    )
    db.session.add(watch_history)
    db.session.commit()

    return jsonify({'success': True})

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

@app.route('/api/movies/genre/<string:genre>')
def get_movies_by_genre(genre):
    """Получение фильмов по жанру"""
    movies = Movie.query.filter(Movie.genre.like(f'%{genre}%')).order_by(desc(Movie.rating)).all()
    return jsonify([movie.to_dict() for movie in movies])

@app.route('/api/movies/search')
def search_movies():
    """Поиск фильмов по названию"""
    query = request.args.get('q', '').strip()
    if not query:
        return jsonify([])

    movies = Movie.query.filter(
        Movie.title.ilike(f'%{query}%')
    ).order_by(
        desc(Movie.rating)
    ).all()

    return jsonify([movie.to_dict() for movie in movies])

@app.route('/api/movies/suggest')
def suggest_movies():
    """Автодополнение названий фильмов"""
    query = request.args.get('q', '').strip()
    if not query or len(query) < 2:
        return jsonify([])

    movies = Movie.query.filter(
        Movie.title.ilike(f'%{query}%')
    ).limit(5).all()

    return jsonify([{'id': m.id, 'title': m.title} for m in movies])

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
    """Получение всех клипов из базы данных"""
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
        new_like = LikedClip(user_id=user_id, clip_id=clip_id)
        db.session.add(new_like)
        
        clip = Clip.query.get(clip_id)
        if clip:
            clip.likes += 1
        
        db.session.commit()
        return jsonify({'liked': True, 'likes': clip.likes if clip else 0})

    elif not liked and liked_clip:
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

# ============= СТАТИСТИКА =============
@app.route('/api/user/stats')
def get_user_stats():
    """Получение статистики пользователя"""
    if 'user_id' not in session:
        return jsonify({'error': 'Необходимо авторизоваться'}), 401
    user_id = session['user_id']

    watch_count = WatchHistory.query.filter_by(user_id=user_id).count()
    saved_count = SavedMovie.query.filter_by(user_id=user_id).count()
    liked_count = LikedClip.query.filter_by(user_id=user_id).count()

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