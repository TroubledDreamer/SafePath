# schemas.py
from marshmallow import Schema, fields, validate, validates, ValidationError
from app.models import User, Driver, EmergencyContact
from app import db

class DriverSchema(Schema):
    id = fields.Int(dump_only=True)
    plate = fields.String(required=True, validate=validate.Length(max=50))
    car_type = fields.String(required=True, validate=validate.Length(max=100))
    user_id = fields.Int(required=True)


class EmergencyContactSchema(Schema):
    id = fields.Int(dump_only=True)
    user_id = fields.Int(required=True)
    display_name = fields.String(required=True, validate=validate.Length(max=100))
    contact_phone = fields.String(required=True, validate=validate.Length(max=50))


class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    username = fields.String(required=True, validate=validate.Length(max=50))
    password = fields.String(required=True, load_only=True, validate=validate.Length(min=8))
    email = fields.Email(required=True, validate=validate.Length(max=100))
    gender = fields.String(required=True, validate=validate.Length(max=50))
    height = fields.String(required=True, validate=validate.Length(max=50))
    phone_number = fields.String(required=True, validate=validate.Length(max=50))
    image = fields.String(required=True, validate=validate.Length(max=255))
    created_at = fields.DateTime(dump_only=True)

    driver = fields.Nested(DriverSchema, dump_only=True)                      # 1-to-1
    emergency_contacts = fields.Nested(EmergencyContactSchema, many=True, dump_only=True)

    @validates('email')
    def validate_unique_email(self, value):
        if db.session.query(User).filter_by(email=value).first():
            raise ValidationError("That email is already taken.")
