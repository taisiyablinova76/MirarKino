from flask import Flask
from flask_cors import CORS
from models import db, User, Movie, Clip, WatchHistory, SavedMovie, LikedClip
from datetime import datetime
import hashlib


def init_db(app):
    """Инициализация базы данных"""
    with app.app_context():
        db.create_all()
        
        # Добавляем тестовые данные, если база пустая
        if Movie.query.count() == 0:
            add_sample_data()

def add_sample_data():
    """Добавление тестовых данных в БД"""
    
    # Добавляем фильмы из вашего api.js
    movies_data = [
        {
            'id': 1,
            'title': 'Эдвард руки-ножницы',
            'year': 1990,
            'description': 'Фантастическая драма о человеке с ножницами вместо рук',
            'video_url': 'https://cdn.lordfilm64.com/?token_movie=39c77691645de97a065a74efc2908f&token=ec4acf58bc9bf62f8be18cad95484c',
            'poster_url': '/images/posters/edward.webp',
            'genre': 'фантастика, драма, романтика',
            'rating': 8.0
        },
        {
            'id': 2,
            'title': 'Прислуга',
            'year': 2011,
            'description': 'Драма о жизни чернокожих служанок в Америке 1960-х',
            'video_url': 'https://cdn.lordfilm64.com/?token_movie=e5c1c0ba38dd1e1c1f3e651d759ccb&token=ec4acf58bc9bf62f8be18cad95484c',
            'poster_url': '/images/posters/the-help.jpg',
            'genre': 'драма, история',
            'rating': 8.1
        },
        {
            'id': 3,
            'title': 'Красотка на всю голову',
            'year': 2018,
            'description': 'После удара головой обычная девушка обретает аномальную уверенность в своей неотразимости, не замечая, что внешне она ни капли не изменилась, что кардинально меняет её жизнь и карьеру.',
            'video_url': 'https://cdn.lordfilm64.com/?token_movie=304f4993c30596341d94f811992b19&token=ec4acf58bc9bf62f8be18cad95484c',
            'poster_url': '/images/posters/i-feel-pretty.jpg',
            'genre': 'комедия, фэнтези',
            'rating': 7.5
        },
        {
            'id': 4,
            'title': 'Бесславные ублюдки',
            'year': 2009,
            'description': 'Детектив о расследовании смерти известного писателя',
            'video_url': 'https://cdn.lordfilm64.com/?token_movie=1795bfe2428f79949aca5a90ac820d&token=ec4acf58bc9bf62f8be18cad95484c',
            'poster_url': '/images/posters/basterds.jpg',
            'genre': 'боевик, драма, военный',
            'rating': 8.2
        },
        {
            'id': 5,
            'title': 'Остров проклятых',
            'year': 2009,
            'description': 'Два американских судебных пристава отправляются на один из островов в штате Массачусетс, чтобы расследовать исчезновение пациентки клиники для умалишенных преступников. При проведении расследования им придется столкнуться с паутиной лжи, обрушившимся ураганом и смертельным бунтом обитателей клиники.',
            'video_url': 'https://cdn.lordfilm64.com/?token_movie=3a0371f659eb08b0a5d74148069566&token=ec4acf58bc9bf62f8be18cad95484c',
            'poster_url': '/images/posters/ostrov-proklatih.jpg',
            'genre': 'триллер, детектив, драма',
            'rating': 8.5
        },
        {
            'id': 6,
            'title': 'Бойцовский клуб',
            'year': 1999,
            'description': 'Сотрудник страховой компании страдает хронической бессонницей и отчаянно пытается вырваться из мучительно скучной жизни. Однажды в очередной командировке он встречает некоего Тайлера Дёрдена - харизматического торговца мылом с извращенной философией. Тайлер уверен, что самосовершенствование - удел слабых, а единственное, ради чего стоит жить - саморазрушение.',
            'video_url': 'https://cdn.lordfilm64.com/?token_movie=49a51d9ed3db49eb96a28553ca2e5d&token=ec4acf58bc9bf62f8be18cad95484c',
            'poster_url': '/images/posters/fight-club.jpg',
            'genre': 'триллер, драма',
            'rating': 8.6
        },
        {
            'id': 7,
            'title': 'Оно',
            'year': 2017,
            'description': 'Когда в городке Дерри штата Мэн начинают пропадать дети, несколько ребят сталкиваются со своими величайшими страхами - не только с группой школьных хулиганов, но со злобным клоуном Пеннивайзом, чьи проявления жестокости и список жертв уходят в глубь веков.',
            'video_url': 'https://cdn.lordfilm64.com/?token_movie=8bcb7e44010177835c0f7b4bd1be29&token=ec4acf58bc9bf62f8be18cad95484c',
            'poster_url': '/images/posters/it.jpg',
            'genre': 'ужасы, драма',
            'rating': 8.0
        },
        {
            'id': 8,
            'title': 'Орудия',
            'year': 2025,
            'description': 'Все дети из одного школьного класса, за исключением одного ребёнка, одновременно и бесследно исчезают. Местные жители и семьи пытаются понять, что или кто стал причиной их исчезновения.',
            'video_url': 'https://cdn.lordfilm64.com/?token_movie=deeb84be1c0b8c20c2b2c67a80199d&token=ec4acf58bc9bf62f8be18cad95484c',
            'poster_url': '/images/posters/weapons.jpg',
            'genre': 'ужасы, триллер',
            'rating': 7.8
        }
    ]
    
    for movie_data in movies_data:
        movie = Movie(**movie_data)
        db.session.add(movie)
    
    # Добавляем клипы (обновленные под новые фильмы)
    clips_data = [
        {'id': 1, 'movie_id': 1, 'title': 'Эдвард руки-ножницы', 'description': 'Трогательная история о любви', 'video_url': 'https://player.vimeo.com/video/76979871?autoplay=1', 'thumbnail': 'poster-1', 'duration': 60},
        {'id': 2, 'movie_id': 2, 'title': 'Прислуга', 'description': 'Лучшие моменты из фильма', 'video_url': 'https://player.vimeo.com/video/76979871?autoplay=1', 'thumbnail': 'poster-2', 'duration': 45},
        {'id': 3, 'movie_id': 3, 'title': 'Красотка на всю голову', 'description': 'Смешные сцены и трансформация', 'video_url': 'https://player.vimeo.com/video/76979871?autoplay=1', 'thumbnail': 'poster-3', 'duration': 50},
        {'id': 4, 'movie_id': 4, 'title': 'Бесславные ублюдки', 'description': 'Лучшие боевые сцены', 'video_url': 'https://player.vimeo.com/video/76979871?autoplay=1', 'thumbnail': 'poster-4', 'duration': 70},
        {'id': 5, 'movie_id': 5, 'title': 'Остров проклятых', 'description': 'Загадочные моменты фильма', 'video_url': 'https://player.vimeo.com/video/76979871?autoplay=1', 'thumbnail': 'poster-5', 'duration': 65},
        {'id': 6, 'movie_id': 6, 'title': 'Бойцовский клуб', 'description': 'Лучшие цитаты и сцены', 'video_url': 'https://player.vimeo.com/video/76979871?autoplay=1', 'thumbnail': 'poster-6', 'duration': 55},
        {'id': 7, 'movie_id': 7, 'title': 'Оно', 'description': 'Самые страшные моменты', 'video_url': 'https://player.vimeo.com/video/76979871?autoplay=1', 'thumbnail': 'poster-1', 'duration': 80},
        {'id': 8, 'movie_id': 8, 'title': 'Орудия', 'description': 'Трейлер и лучшие сцены', 'video_url': 'https://player.vimeo.com/video/76979871?autoplay=1', 'thumbnail': 'poster-2', 'duration': 45}
    ]
    
    for clip_data in clips_data:
        clip = Clip(**clip_data)
        db.session.add(clip)
    
    db.session.commit()
    print("Тестовые данные добавлены в базу данных")

def hash_password(password):
    """Хеширование пароля"""
    return hashlib.sha256(password.encode()).hexdigest()