from app.services.base_service import BaseService
from app.models import db
from datetime import datetime, timedelta, timezone
from app.utils.time import normalize_utc_fields

class UserScopedService(BaseService):
    utc_fields = ["date"]  # override per service if needed

    @classmethod
    def normalize_input_dates(cls, data: dict) -> dict:
        normalize_utc_fields(data, cls.utc_fields)
        return data

    @staticmethod
    def _get_time_threshold(range_key, tz_offset=0):
        now_utc = datetime.utcnow()
        now = now_utc + timedelta(minutes=tz_offset)
        today = datetime.combine(now.date(), datetime.min.time()) - timedelta(minutes=tz_offset)

        ranges = {
            "today": today,
            "1w": now - timedelta(weeks=1),
            "1m": now - timedelta(days=30),
            "1y": now - timedelta(days=365),
            "all": None
        }

        return ranges.get(range_key, None)
    
    @classmethod
    def list_scoped(cls, user_id, *, range_key="all", tz_offset=0,
                    filters=None, order_by=None, order_dir=None, limit=None, offset=None):
        """
        Returns (items, total) scoped by user_id, optional date range, filters, and pagination.
        """
        q = cls.model.query.filter_by(user_id=user_id)

        since = cls._get_time_threshold(range_key, tz_offset)
        if since is not None and hasattr(cls.model, "date"):
            q = q.filter(cls.model.date >= since)

        # merge user-provided filters (equality) carefully
        base_filters = {}
        if filters:
            # ignore reserved keys here; the view already strips them, but this is safe too
            for k, v in filters.items():
                if cls._allowed_field(k):
                    base_filters[k] = v

        q = cls._apply_filters(q, base_filters)
        total = q.count()

        q = cls._apply_ordering(q, order_by, order_dir)
        q = cls._apply_pagination(q, limit, offset)
        return q.all(), total


    @classmethod
    def get_last_scoped(cls, user_id, *, range_key="all", tz_offset=0, filters=None, order_by=None, order_dir=None):
        q = cls.model.query.filter_by(user_id=user_id)

        since = cls._get_time_threshold(range_key, tz_offset)
        if since is not None and hasattr(cls.model, "date"):
            q = q.filter(cls.model.date >= since)

        base_filters = {}
        if filters:
            for k, v in filters.items():
                if cls._allowed_field(k):
                    base_filters[k] = v
        q = cls._apply_filters(q, base_filters)
        q = cls._apply_ordering(q, order_by, order_dir)
        return q.first()
    


    @classmethod
    def get_all(cls, user_id, range_key="all", tz_offset=0):
        since = cls._get_time_threshold(range_key, tz_offset)
        query = cls.model.query.filter_by(user_id=user_id)
        if since and hasattr(cls.model, "date"):
            query = query.filter(cls.model.date >= since)
        return query.all()

    @classmethod
    def get_by_id(cls, id_, user_id):
        return cls.model.query.filter_by(id=id_, user_id=user_id).first()

    @classmethod
    def create(cls, data, user_id):
        data["user_id"] = user_id
        cls.normalize_input_dates(data)
        instance = cls.model(**data)
        db.session.add(instance)
        db.session.commit()
        return instance

    @classmethod
    def update(cls, id_, data, user_id):
        instance = cls.get_by_id(id_, user_id)
        if not instance:
            return None
        cls.normalize_input_dates(data)
        for key, value in data.items():
            setattr(instance, key, value)
        db.session.commit()
        return instance

    @classmethod
    def delete(cls, id_, user_id):
        instance = cls.get_by_id(id_, user_id)
        if not instance:
            return False
        db.session.delete(instance)
        db.session.commit()
        return True
    




