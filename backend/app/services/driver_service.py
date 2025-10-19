from app.services.user_scoped_service import UserScopedService
from app.models import Driver

class DriverService(UserScopedService):
    model = Driver
    default_order_by = "created_at"
    default_order_dir = "desc"
    filterable_fields = {"plate", "car_type", "user_id"}
