from app.models import UserContact
from .user_scoped_service import UserScopedService

class UserContactService(UserScopedService):
    model = UserContact