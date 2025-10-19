
from flask import Blueprint
from app.services.user_service import UserService
from app.routes.base_view import BaseCRUDView

class UserView(BaseCRUDView):
    service_class = UserService

user_bp = Blueprint("user_bp", __name__)
user_view = UserView.as_view("user")

# Register the routes (GET all, POST)
user_bp.add_url_rule("/", view_func=user_view, methods=["GET", "POST"])

# Register routes with ID (GET, PUT, DELETE)
user_bp.add_url_rule("/<int:id>", view_func=user_view, methods=["GET", "PUT", "DELETE"])