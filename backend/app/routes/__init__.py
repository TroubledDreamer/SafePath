# from .user_routes import user_bp
# from .user_information_routes import user_info_bp
from .user_routes import user_bp




def register_blueprints(app):
    pass
    app.register_blueprint(user_bp, url_prefix="/api/v1/user")
    # app.register_blueprint(user_info_bp, url_prefix="/api/v1/user-info")
