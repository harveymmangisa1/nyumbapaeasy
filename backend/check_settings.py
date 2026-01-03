import os
import django
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

print(f"DATABASE HOST: '{settings.DATABASES['default'].get('HOST')}'")
print(f"DATABASE NAME: '{settings.DATABASES['default'].get('NAME')}'")
print(f"DATABASE USER: '{settings.DATABASES['default'].get('USER')}'")
print(f"DATABASE PORT: '{settings.DATABASES['default'].get('PORT')}'")
print(f"HAS PASSWORD: {bool(settings.DATABASES['default'].get('PASSWORD'))}")

import dotenv
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent
print(f"BASE_DIR: {BASE_DIR}")
env_path = os.path.join(BASE_DIR, 'config.env')
print(f"ENV_PATH: {env_path}")
print(f"ENV_PATH EXISTS: {os.path.exists(env_path)}")
