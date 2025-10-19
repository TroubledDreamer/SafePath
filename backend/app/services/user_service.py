from app.models import User, UserInformation, db
from .base_service import BaseService
from werkzeug.security import generate_password_hash
from flask import jsonify


class UserService(BaseService):
    model = User


    @classmethod
    def create(cls, data):
        info = data.pop('info', None)
        if not info:
            raise ValueError("Missing 'info' key with user information data")

        # Hash password
        data['password'] = generate_password_hash(data['password'])
        
        # Create user first
        user = cls.model(**data)
        db.session.add(user)
        db.session.flush()  # Assigns user.id

        # Create user_information with user_id
        user_info = UserInformation(
            user_id=user.id,
            sex=info['sex'],
            height_cm=info.get('height_cm'),
            date_of_birth=info['date_of_birth']
        )

        db.session.add(user_info)
        db.session.commit()
        return user

