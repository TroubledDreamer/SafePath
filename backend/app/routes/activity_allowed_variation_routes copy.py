
# from flask import Blueprint
# from app.services.activity_allowed_variation_service import ActivityAllowedVariationService
# from app.routes.base_view import BaseCRUDView

# class ActivityAllowedVariationView(BaseCRUDView):
#     service_class = ActivityAllowedVariationService

# activity_allowed_variation_bp = Blueprint("activity_allowed_variation_bp", __name__)
# activity_allowed_variation_view = ActivityAllowedVariationView.as_view("activity_allowed_variation")

# # Register the routes (GET all, POST)
# activity_allowed_variation_bp.add_url_rule("/", view_func=activity_allowed_variation_view, methods=["GET", "POST"])

# # Register routes with ID (GET, PUT, DELETE)
# activity_allowed_variation_bp.add_url_rule("/<int:id>", view_func=activity_allowed_variation_view, methods=["GET", "PUT", "DELETE"])