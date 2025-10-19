from flask import Flask, jsonify, request
import os
from app.config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
db = SQLAlchemy()
migrate = Migrate()

from app.routes import register_blueprints


def create_app():
    print('api3')
    app = Flask(__name__)
    app.config.from_object(Config)

    print(app.config["SQLALCHEMY_DATABASE_URI"])

    app.config['SQLALCHEMY_DATABASE_URI'] = app.config["SQLALCHEMY_DATABASE_URI"]
                                                      
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    migrate.init_app(app, db)

    @app.before_request
    def log_request():
        print("\n📥 --- Incoming Request ---")
        print("Method:", request.method)
        print("URL:", request.url)
        print("Headers:", dict(request.headers))
        print("Query Params:", request.args.to_dict())
        print("Body (JSON):", request.get_json(silent=True))
        print("--- End Request Log ---\n")


    with app.app_context():
        register_blueprints(app)

    @app.route('/')
    def index(): return jsonify({'message':'Welcome to Hackathon API'})

    return app





