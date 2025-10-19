# from .user_routes import user_bp
# from .user_information_routes import user_info_bp
from .user_routes import user_bp
from .auth_routes import auth_bp
from .user_contact_routes import user_contact_bp


from .driver_routes import driver_bp
from .trip_routes import trip_bp
from .routes_cluster import cluster_bp


def register_blueprints(app):
    app.register_blueprint(user_bp, url_prefix="/api/v1/user")
    app.register_blueprint(auth_bp, url_prefix="/api/v1/auth")
    app.register_blueprint(user_contact_bp, url_prefix="/api/v1/user-contact-route")

    app.register_blueprint(driver_bp,        url_prefix="/api/v1/driver")


    app.register_blueprint(trip_bp,          url_prefix="/api/v1/trip")
    app.register_blueprint(cluster_bp,       url_prefix="/api/v1/routes")


    # app.register_blueprint(user_info_bp, url_prefix="/api/v1/user-info")
