# app/__init__.py
from flask import Flask
from app.models import db
# from app.config import Config  # if you have a Config class

def create_app():
    app = Flask(__name__)

    # Basic config (adjust to your config module)
    app.config.from_object('app.config.Config')

    # Init extensions
    db.init_app(app)

    # Register blueprints (import inside to avoid circular imports)
    from app.routes.user_routes import api as user_routes
    # from app.routes.auth_routes import auth_routes
    app.register_blueprint(user_routes)
    # app.register_blueprint(auth_routes)

    # Health check / root
    @app.get("/")
    def index():
        return {"message": "API running successfully!"}

    return app
