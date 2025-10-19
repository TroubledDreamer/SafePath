import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config(object):
    """Base Config Object"""
    DEBUG = False
    SECRET_KEY = os.getenv('SECRET_KEY', os.urandom(24).hex()) 
    WTF_CSRF_ENABLED = False

    CORS_ORIGINS = os.getenv('CORS_ORIGINS', '*')
    CORS_SUPPORTS_CREDENTIALS = True

    # Database Configuration
    DATABASE_USER = os.environ.get('DATABASE_USER') 
    DATABASE_PASSWORD =  os.environ.get('DATABASE_PASSWORD') 
    DATABASE_HOST = os.environ.get('DATABASE_HOST') 
    DATABASE_NAME = os.environ.get('DATABASE_NAME') 
    DATABASE_PORT = os.getenv('DATABASE_PORT', '3306')


    MYSQL_SSL_CA = os.getenv('MYSQL_SSL_CA')
    
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL', 'mysql+pymysql://{DATABASE_USER}:{DATABASE_PASSWORD}@{DATABASE_HOST}:{DATABASE_PORT}/{DATABASE_NAME}'.format(
            DATABASE_USER=DATABASE_USER,
            DATABASE_PASSWORD=DATABASE_PASSWORD,
            DATABASE_HOST=DATABASE_HOST,
            DATABASE_NAME=DATABASE_NAME,
            DATABASE_PORT=DATABASE_PORT
        )
    )


    SQLALCHEMY_TRACK_MODIFICATIONS = False

    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_pre_ping": True,
        "pool_recycle": 280,
        **(
            {"connect_args": {"ssl": {"ca": MYSQL_SSL_CA}}}
            if MYSQL_SSL_CA else {}
        ),
    }


    

    
