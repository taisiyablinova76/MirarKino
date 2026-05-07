# test_video.py
import os

print("Текущая директория:", os.getcwd())
print("Файл app.py существует:", os.path.exists('app.py'))

# Проверяем путь к видео
video_folder = os.path.join(os.path.dirname(os.path.abspath('app.py')), 'static', 'videos')
print("\nПуть к папке видео:", video_folder)
print("Папка существует:", os.path.exists(video_folder))

if os.path.exists(video_folder):
    files = os.listdir(video_folder)
    print("Файлы в папке:", files)
    
    for f in files:
        file_path = os.path.join(video_folder, f)
        if os.path.isfile(file_path):
            size_mb = os.path.getsize(file_path) / (1024 * 1024)
            print(f"  {f}: {size_mb:.2f} МБ")