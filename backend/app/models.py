# models.py
from decimal import Decimal
from datetime import date, datetime
from sqlalchemy import inspect
from sqlalchemy.sql import func
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


class User(BaseModel):
    __tablename__ = 'Users'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(50), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    gender = db.Column(db.String(50), nullable=False)
    height = db.Column(db.String(50), nullable=False)             
    phone_number = db.Column(db.String(50), nullable=False, unique=True)
    image = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, server_default=func.current_timestamp())

    # Relationships
    driver = db.relationship(
        'Driver',
        back_populates='user',
        uselist=False,                      
        cascade='all, delete-orphan'
    )
    emergency_contacts = db.relationship(
        'EmergencyContact',
        back_populates='user',
        cascade='all, delete-orphan'
    )


class Driver(BaseModel):
    __tablename__ = 'Drivers'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    plate = db.Column(db.String(50), nullable=False, unique=True)
    car_type = db.Column(db.String(100), nullable=False)
    user_id = db.Column(
        db.Integer,
        db.ForeignKey('Users.id', ondelete='CASCADE'),
        nullable=False,
        unique=True                       
    )

    user = db.relationship('User', back_populates='driver')


class EmergencyContact(BaseModel):
    __tablename__ = 'Emergency_Contacts'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(
        db.Integer,
        db.ForeignKey('Users.id', ondelete='CASCADE'),
        nullable=False
    )
    display_name = db.Column(db.String(100), nullable=False)
    contact_phone = db.Column(db.String(50), nullable=False)

    user = db.relationship('User', back_populates='emergency_contacts')
