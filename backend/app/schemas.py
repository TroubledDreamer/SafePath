# schemas.py
from marshmallow import Schema, fields, validate, validates, ValidationError
from app.models import User, Driver, EmergencyContact
from app import db


def validate_unique_email(email):
    if db.session.query(User).filter_by(email=email).first():
        raise ValidationError("That email is already taken.")



class UserInfoSchema(Schema):
    id = fields.Int(dump_only=True)
    user_id = fields.Int(dump_only=True)
    gender = fields.Str(required=True, validate=validate.OneOf(['M','F','Other']))
    height = fields.Decimal(as_string=True)
    date_of_birth = fields.Date(required=True)
    phone_number = fields.Int(dump_only=True)


class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True, validate=validate.Length(max=100))
    email = fields.Email(required=True, validate=validate_unique_email)
    password = fields.Str(required=True, load_only=True)
    created_at = fields.DateTime(dump_only=True)
    info = fields.Nested(UserInfoSchema, attribute="user_information", required=True)




class DriverSchema(Schema):
    id = fields.Int(dump_only=True)
    plate = fields.String(required=True, validate=validate.Length(max=50))
    car_type = fields.String(required=True, validate=validate.Length(max=100))
    user_id = fields.Int(required=True)
    date = fields.DateTime()

    


class EmergencyContactSchema(Schema):
    id = fields.Int(dump_only=True)
    user_id = fields.Int(required=True)
    display_name = fields.String(required=True, validate=validate.Length(max=100))
    contact_phone = fields.String(required=True, validate=validate.Length(max=50))



