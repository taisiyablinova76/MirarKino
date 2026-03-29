from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)  # В реальном проекте хешируйте!
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Связи
    watch_history = db.relationship('WatchHistory', backref='user', lazy=True, cascade='all, delete-orphan')
    saved_movies = db.relationship('SavedMovie', backref='user', lazy=True, cascade='all, delete-orphan')
    liked_clips = db.relationship('LikedClip', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Movie(db.Model):
    __tablename__ = 'movies'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    year = db.Column(db.Integer)
    description = db.Column(db.Text)
    video_url = db.Column(db.String(500))
    poster_url = db.Column(db.String(500))
    genre = db.Column(db.String(100))  # Жанр для рекомендаций
    rating = db.Column(db.Float)  # Рейтинг фильма
    views = db.Column(db.Integer, default=0)  # Количество просмотров
    
    # Связи
    watch_history = db.relationship('WatchHistory', backref='movie', lazy=True)
    saved_by = db.relationship('SavedMovie', backref='movie', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'year': self.year,
            'description': self.description,
            'video_url': self.video_url,
            'poster_url': self.poster_url,
            'genre': self.genre,
            'rating': self.rating,
            'views': self.views
        }

class Clip(db.Model):
    __tablename__ = 'clips'
    
    id = db.Column(db.Integer, primary_key=True)
    movie_id = db.Column(db.Integer, db.ForeignKey('movies.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    video_url = db.Column(db.String(500))
    thumbnail = db.Column(db.String(200))
    duration = db.Column(db.Integer)  # Длительность в секундах
    likes = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Связи
    movie = db.relationship('Movie', backref='clips')
    liked_by = db.relationship('LikedClip', backref='clip', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'movie_id': self.movie_id,
            'title': self.title,
            'description': self.description,
            'video_url': self.video_url,
            'thumbnail': self.thumbnail,
            'duration': self.duration,
            'likes': self.likes
        }

class WatchHistory(db.Model):
    __tablename__ = 'watch_history'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    movie_id = db.Column(db.Integer, db.ForeignKey('movies.id'), nullable=False)
    watched_at = db.Column(db.DateTime, default=datetime.utcnow)
    watch_duration = db.Column(db.Integer, default=0)  # Просмотрено секунд
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'movie_id': self.movie_id,
            'watched_at': self.watched_at.isoformat() if self.watched_at else None,
            'watch_duration': self.watch_duration
        }

class SavedMovie(db.Model):
    __tablename__ = 'saved_movies'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    movie_id = db.Column(db.Integer, db.ForeignKey('movies.id'), nullable=False)
    saved_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    __table_args__ = (db.UniqueConstraint('user_id', 'movie_id', name='unique_user_movie'),)

class LikedClip(db.Model):
    __tablename__ = 'liked_clips'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    clip_id = db.Column(db.Integer, db.ForeignKey('clips.id'), nullable=False)
    liked_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    __table_args__ = (db.UniqueConstraint('user_id', 'clip_id', name='unique_user_clip'),)