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
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete="CASCADE"), nullable=False)

    gender = db.Column(db.Enum('M', 'F', 'Other'), nullable=False)
    # Schema: VARCHAR(50) NOT NULL
    height = db.Column(db.String(50), nullable=False)
    # Schema: VARCHAR(50) NOT NULL UNIQUE
    phone_number = db.Column(db.String(50), nullable=False, unique=True)
    date_of_birth = db.Column(db.Date, nullable=False)

    user = db.relationship('User', back_populates='user_information', uselist=False)


class User(BaseModel):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    # Schema: VARCHAR(50) NOT NULL
    name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(512), nullable=False)
    created_at = db.Column(db.DateTime, server_default=func.now(), nullable=False)

    user_information = db.relationship(
        'UserInformation', back_populates='user', uselist=False, cascade="all, delete-orphan"
    )

    # Self-referential contacts
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

    drivers = db.relationship('Driver', back_populates='user', cascade="all, delete-orphan")

    def to_dict(self):
        data = super().to_dict()
        data["user_information"] = self.user_information.to_dict() if self.user_information else None
        return data


class Driver(BaseModel):
    __tablename__ = 'driver'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    # Schema fix: user_id is nullable, ON DELETE SET NULL
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete="SET NULL"), nullable=True)
    plate = db.Column(db.String(50), nullable=False, unique=True)
    car_type = db.Column(db.String(100), nullable=False)
    date = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, server_default=func.now(), nullable=False)

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

    __table_args__ = (
        UniqueConstraint('user_id', 'contact_user_id', name='uq_user_contact_pair'),
        CheckConstraint('user_id <> contact_user_id', name='ck_user_not_self'),
    )

    owner = db.relationship('User', foreign_keys=[user_id], back_populates='contacts')
    contact = db.relationship('User', foreign_keys=[contact_user_id], back_populates='contacted_by')


# --- add below UserContact ---

class RouteCluster(BaseModel):
    __tablename__ = "route_cluster"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    origin_hash = db.Column(db.String(24), nullable=False)
    dest_hash   = db.Column(db.String(24), nullable=False)
    # store the route signature (list of geohashes) as JSON text
    geohashes_json = db.Column(db.Text, nullable=False)
    trips_count = db.Column(db.Integer, nullable=False, default=0)
    status = db.Column(db.Enum('UNUSUAL', 'NORMAL', name='cluster_status'),
                       nullable=False, default='UNUSUAL')
    last_seen = db.Column(db.DateTime, server_default=func.now(), nullable=False)


class Trip(BaseModel):
    __tablename__ = "trip"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete="CASCADE"), nullable=False)

    origin_lat = db.Column(db.Numeric(9,6), nullable=False)
    origin_lng = db.Column(db.Numeric(9,6), nullable=False)
    dest_lat   = db.Column(db.Numeric(9,6), nullable=False)
    dest_lng   = db.Column(db.Numeric(9,6), nullable=False)

    mode = db.Column(db.Enum('DRIVING','WALKING','BICYCLING','TRANSIT', name='trip_mode'),
                     nullable=False)

    # from Google Routes (or client for hackathon)
    route_polyline = db.Column(db.Text, nullable=False)
    eta_sec   = db.Column(db.Integer, nullable=False)
    distance_m = db.Column(db.Integer, nullable=False)

    status = db.Column(db.Enum('REQUESTED','IN_PROGRESS','COMPLETED','CANCELLED', name='trip_status'),
                       nullable=False, default='REQUESTED')
    started_at = db.Column(db.DateTime, server_default=func.now(), nullable=False)
    ended_at   = db.Column(db.DateTime, nullable=True)

    # clustering & risk
    cluster_id  = db.Column(db.Integer, db.ForeignKey('route_cluster.id', ondelete="SET NULL"))
    cluster_sim = db.Column(db.Numeric(4,3))
    risk_level  = db.Column(db.Enum('NORMAL','UNUSUAL','RISKY', name='risk_level'))
    alert_sent  = db.Column(db.Boolean, nullable=False, default=False)

    # relationships
    user = db.relationship('User', backref=db.backref('trips', cascade="all, delete-orphan"))
    cluster = db.relationship('RouteCluster', backref=db.backref('trips', lazy='dynamic'))


class TripPoint(BaseModel):
    __tablename__ = "trip_point"

    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    trip_id = db.Column(db.Integer, db.ForeignKey('trip.id', ondelete="CASCADE"), nullable=False, index=True)
    lat = db.Column(db.Numeric(9,6), nullable=False)
    lng = db.Column(db.Numeric(9,6), nullable=False)
    recorded_at = db.Column(db.DateTime, server_default=func.now(), nullable=False)

    trip = db.relationship('Trip', backref=db.backref('points', order_by="TripPoint.id.asc()", cascade="all, delete-orphan"))
