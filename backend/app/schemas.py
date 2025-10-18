from marshmallow import Schema, fields, validate, ValidationError
from app.models import User
from app import db

def validate_unique_email(email):
    if db.session.query(User).filter_by(email=email).first():
        raise ValidationError("That email is already taken.")
