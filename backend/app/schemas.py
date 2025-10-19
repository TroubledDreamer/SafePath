# schemas.py
from marshmallow import Schema, fields, validate, validates, validates_schema, ValidationError
from app.models import User, Driver, UserContact
from app import db

# --------- Helpers ---------
def validate_unique_email(email, *, exclude_user_id=None):
    q = db.session.query(User).filter(User.email == email)
    if exclude_user_id is not None:
        q = q.filter(User.id != exclude_user_id)
    if db.session.query(q.exists()).scalar():
        raise ValidationError("That email is already taken.")

# --------- Schemas ---------
class UserInfoSchema(Schema):
    id = fields.Int(dump_only=True)
    user_id = fields.Int(dump_only=True)
    gender = fields.Str(required=True, validate=validate.OneOf(['M', 'F', 'Other']))
    # DB column is VARCHAR(50)
    height = fields.String(required=True, validate=validate.Length(max=50))
    date_of_birth = fields.Date(required=True)
    # DB is VARCHAR(50) NOT NULL UNIQUE
    phone_number = fields.String(required=True, validate=validate.Length(max=50))

class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    # DB is VARCHAR(50)
    name = fields.Str(required=True, validate=validate.Length(max=50))
    email = fields.Email(required=True)
    password = fields.Str(required=True, load_only=True)
    created_at = fields.DateTime(dump_only=True)

    # Allow nested info on create/update
    info = fields.Nested(UserInfoSchema, attribute="user_information", required=False)

    # Optionally expose contacts (dump only)
    contacts = fields.List(
        fields.Nested(lambda: UserContactSchema(exclude=("user_id",))),
        dump_only=True,
        attribute="contacts"
    )

    @validates("email")
    def _unique_email(self, value, **kwargs):
        exclude_id = self.context.get("user_id") if hasattr(self, "context") else None
        validate_unique_email(value, exclude_user_id=exclude_id)

class DriverSchema(Schema):
    id = fields.Int(dump_only=True)
    plate = fields.String(required=True, validate=validate.Length(max=50))
    car_type = fields.String(required=True, validate=validate.Length(max=100))
    # driver.user_id is nullable in DB → not required
    user_id = fields.Int(required=False, allow_none=True)
    created_at = fields.DateTime(dump_only=True)

class UserContactSchema(Schema):
    """
    Self-referential contacts; DB enforces UNIQUE(user_id, contact_user_id).
    """
    user_id = fields.Int(required=True)
    contact_user_id = fields.Int(required=True)
    label = fields.String(validate=validate.Length(max=100))
    is_emergency = fields.Boolean(load_default=False)
    created_at = fields.DateTime(dump_only=True)

    @validates_schema
    def _not_self(self, data, **kwargs):
        if data.get("user_id") == data.get("contact_user_id"):
            raise ValidationError("A user cannot add themselves as a contact.", field_name="contact_user_id")

    @validates_schema
    def _pair_unique(self, data, **kwargs):
        uid = data.get("user_id")
        cid = data.get("contact_user_id")
        if uid is None or cid is None:
            return
        exists = (
            db.session.query(UserContact)
            .filter(UserContact.user_id == uid, UserContact.contact_user_id == cid)
            .first()
        )
        if exists:
            raise ValidationError("This contact already exists.", field_name="contact_user_id")

    @validates("user_id")
    def _user_exists(self, value, **kwargs):
        if not db.session.query(User.id).filter_by(id=value).first():
            raise ValidationError("User not found.")

    @validates("contact_user_id")
    def _contact_user_exists(self, value, **kwargs):
        if not db.session.query(User.id).filter_by(id=value).first():
            raise ValidationError("Contact user not found.")
