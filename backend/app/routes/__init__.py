# from .user_routes import user_bp
# from .user_information_routes import user_info_bp
from .user_routes import user_bp
from .auth_routes import auth_bp
from .user_contact_routes import user_contact_bp




def register_blueprints(app):
    app.register_blueprint(user_bp, url_prefix="/api/v1/user")
    app.register_blueprint(auth_bp, url_prefix="/api/v1/auth")
    app.register_blueprint(user_contact_bp, url_prefix="/api/v1/user-contact-route")


    # app.register_blueprint(user_info_bp, url_prefix="/api/v1/user-info")
