from flask import Flask
from flask_cors import CORS
from models import db, User, Movie, Clip, WatchHistory, SavedMovie, LikedClip
import hashlib

def init_db(app):
    with app.app_context():
        db.create_all()
        if Movie.query.count() == 0:
            add_sample_data()

def add_sample_data():
    movies = [
        {'id':1,'title':'Эдвард руки-ножницы','year':1990,'description':'Фантастическая драма','poster_url':'/images/posters/edward.webp','genre':'фантастика, драма','rating':8.0},
        {'id':2,'title':'Прислуга','year':2011,'description':'Драма','poster_url':'/images/posters/the-help.jpg','genre':'драма, история','rating':8.1},
        {'id':3,'title':'Красотка на всю голову','year':2018,'description':'Комедия','poster_url':'/images/posters/i-feel-pretty.jpg','genre':'комедия','rating':7.5}
    ]
    for m in movies:
        if not Movie.query.get(m['id']):
            db.session.add(Movie(**m))
            
    clips = [
        {'id':1,'movie_id':1,'title':'Эдвард - моменты','description':'','video_url':'/videos/clip1.webm','duration':114},
        {'id':2,'movie_id':2,'title':'Прислуга - моменты','description':'','video_url':'/videos/clip2.webm','duration':45}
    ]
    for c in clips:
        if not Clip.query.get(c['id']):
            db.session.add(Clip(**c))
    db.session.commit()
    print("Тестовые данные добавлены")

def hash_password(pwd):
    return hashlib.sha256(pwd.encode()).hexdigest()