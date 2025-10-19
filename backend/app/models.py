# models.py
from decimal import Decimal
from datetime import date, datetime
from sqlalchemy import inspect
from sqlalchemy.sql import func
from sqlalchemy import UniqueConstraint, CheckConstraint, ForeignKey
from . import db

class BaseModel(db.Model):
    __abstract__ = True

    def _serialize_value(self, val):
        if isinstance(val, (bytes, bytearray, memoryview)):
            return val.hex()
        if isinstance(val, Decimal):
            return float(val)
        if isinstance(val, (datetime, date)):
            return val.isoformat()
        return val

    def to_dict(self):
        out = {}
        for c in inspect(self).mapper.column_attrs:
            out[c.key] = self._serialize_value(getattr(self, c.key))
        return out



class UserInformation(BaseModel):
    __tablename__ = 'user_information'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    gender = db.Column(db.Enum('M', 'F', 'Other'), nullable=False)
    height = db.Column(db.Numeric(6, 3))
    phone_number = db.Column(db.Integer)
    date_of_birth = db.Column(db.Date, nullable=False)

    user = db.relationship('User', back_populates='user_information', uselist=False)


class User(BaseModel):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(512), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user_information = db.relationship('UserInformation', back_populates='user', uselist=False)


    # Self-referential contacts:
    # - contacts: users I have added
    # - contacted_by: users who added me
    contacts = db.relationship(
        'UserContact',
        foreign_keys='UserContact.user_id',
        back_populates='owner',
        cascade="all, delete-orphan"
    )
    contacted_by = db.relationship(
        'UserContact',
        foreign_keys='UserContact.contact_user_id',
        back_populates='contact'
    )

    # Keep drivers relation as-is
    drivers = db.relationship('Driver', back_populates='user', cascade="all, delete-orphan")

    def to_dict(self):
        data = super().to_dict()
        data["user_information"] = self.user_information.to_dict() if self.user_information else None
        return data


class Driver(BaseModel):
    __tablename__ = 'driver'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete="CASCADE"), nullable=False)
    plate = db.Column(db.String(50), nullable=False, unique=True)
    car_type = db.Column(db.String(100), nullable=False)
    date = db.Column(db.DateTime)

    user = db.relationship('User', back_populates='drivers')


class UserContact(BaseModel):
    """
    Self-referential association: a user adds another user as a contact.
    Enforces:
      - no self contact
      - unique pair (user_id, contact_user_id)
    """
    __tablename__ = 'user_contact'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    user_id = db.Column(db.Integer, ForeignKey('user.id', ondelete="CASCADE"), nullable=False)
    contact_user_id = db.Column(db.Integer, ForeignKey('user.id', ondelete="CASCADE"), nullable=False)

    label = db.Column(db.String(100))
    is_emergency = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, server_default=func.now(), nullable=False)

    # Constraints
    __table_args__ = (
        UniqueConstraint('user_id', 'contact_user_id', name='uq_user_contact_pair'),
        CheckConstraint('user_id <> contact_user_id', name='ck_user_not_self'),
    )

    # Relationships to User
    owner = db.relationship('User', foreign_keys=[user_id], back_populates='contacts')
    contact = db.relationship('User', foreign_keys=[contact_user_id], back_populates='contacted_by')
