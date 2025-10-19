"""models.py - SQLAlchemy models for GymDatabaseV1 (aligned with activity_config schema)"""
from datetime import datetime
from sqlalchemy.inspection import inspect
from sqlalchemy import UniqueConstraint
from . import db
from decimal import Decimal
from datetime import date, datetime

class BaseModel(db.Model):
    __abstract__ = True

    def _serialize_value(self, val):
        if isinstance(val, (bytes, bytearray, memoryview)):
            return val.hex()
        if isinstance(val, Decimal):
            # choose str if you want exactness; float for convenience
            return float(val)
        if isinstance(val, (datetime, date)):
            return val.isoformat()
        return val

    def to_dict(self):
        out = {}
        for c in inspect(self).mapper.column_attrs:
            out[c.key] = self._serialize_value(getattr(self, c.key))
        return out
