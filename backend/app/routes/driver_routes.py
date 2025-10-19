# app/routes/driver_view.py
from flask import Blueprint
from app.services.driver_service import DriverService
from app.routes.user_scoped_crud_view import UserScopedCRUDView

class DriverView(UserScopedCRUDView):
    service_class = DriverService

driver_bp = Blueprint("driver_bp", __name__)
driver_view = DriverView.as_view("driver")
driver_bp.add_url_rule("/", view_func=driver_view, methods=["GET", "POST"])
driver_bp.add_url_rule("/<int:id>", view_func=driver_view, methods=["GET", "PUT", "DELETE"])
