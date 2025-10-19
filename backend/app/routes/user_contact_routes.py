
# from flask import Blueprint
# from app.services.user_contact_service import UserContact
# from app.routes.user_scoped_crud_view import UserScopedCRUDView

# class UserContactView(UserScopedCRUDView):
#     service_class = UserContact

# user_contact_bp = Blueprint("user_contact_bp", __name__)
# user_contact_view = UserContactView.as_view("user_contact")

# # Register the routes (GET all, POST)
# user_contact_bp.add_url_rule("/", view_func=user_contact_view, methods=["GET", "POST"])

# # Register routes with ID (GET, PUT, DELETE)
# user_contact_bp.add_url_rule("/<int:id>", view_func=user_contact_view, methods=["GET", "PUT", "DELETE"])



from flask import Blueprint
from app.services.user_contact_service import UserContactService
from app.routes.user_scoped_crud_view import UserScopedCRUDView

class UserContactView(UserScopedCRUDView):
    service_class = UserContactService

user_contact_bp = Blueprint("user_contact_bp", __name__)
user_contact_view = UserContactView.as_view("user_contact")

# Register the routes (GET all, POST)
user_contact_bp.add_url_rule("/", view_func=user_contact_view, methods=["GET", "POST"])

# Register routes with ID (GET, PUT, DELETE)
user_contact_bp.add_url_rule("/<int:id>", view_func=user_contact_view, methods=["GET", "PUT", "DELETE"])