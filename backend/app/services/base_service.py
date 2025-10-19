# app/services/base_service.py
from __future__ import annotations

from app.models import db
from sqlalchemy import case 
class BaseService:
    model = None
    default_order_by = "id"     # override per model if needed (e.g., "date" or "created_at")
    default_order_dir = "desc"  # "asc" or "desc"
    filterable_fields = None    # optional allowlist; if None, all model columns are candidates


    @classmethod
    def get_all(cls):
        return cls.model.query.all()

    @classmethod
    def get_by_id(cls, id_):
        return cls.model.query.get(id_)

    @classmethod
    def create(cls, data):
        instance = cls.model(**data)
        db.session.add(instance)
        db.session.commit()
        return instance

    @classmethod
    def update(cls, id_, data):
        instance = cls.get_by_id(id_)
        if not instance:
            return None
        for key, value in data.items():
            setattr(instance, key, value)
        db.session.commit()
        return instance

    @classmethod
    def delete(cls, id_):
        instance = cls.get_by_id(id_)
        if not instance:
            return None
        db.session.delete(instance)
        db.session.commit()
        return instance
    


    @classmethod
    def _column(cls, name):
        return getattr(cls.model, name, None)

    @classmethod
    def _allowed_field(cls, name):
        if cls.filterable_fields is None:
            # allow any real column
            return cls._column(name) is not None
        return name in cls.filterable_fields and cls._column(name) is not None

    @classmethod
    def _apply_filters(cls, query, filters: dict | None):
        if not filters:
            return query
        for key, val in filters.items():
            if cls._allowed_field(key):
                query = query.filter(getattr(cls.model, key) == val)
        return query

    @classmethod
    def _apply_ordering(cls, query, order_by: str | None, order_dir: str | None):
        ob = order_by or cls.default_order_by
        col = cls._column(ob) or cls._column("id")
        if col is None:
            return query
        direction = (order_dir or cls.default_order_dir or "desc").lower()
        return query.order_by(col.asc() if direction == "asc" else col.desc())

    @classmethod
    def _apply_pagination(cls, query, limit: int | None, offset: int | None):
        if limit is not None:
            query = query.limit(int(limit))
        if offset:
            query = query.offset(int(offset))
        return query
    
    @classmethod
    def list(cls, *, filters=None, order_by=None, order_dir=None, limit=None, offset=None):
        """
        Returns (items, total) using optional filters/pagination.
        """
        q = cls.model.query
        q = cls._apply_filters(q, filters)
        total = q.count()
        q = cls._apply_ordering(q, order_by, order_dir)
        q = cls._apply_pagination(q, limit, offset)
        return q.all(), total

    @classmethod
    def get_last(cls, *, filters=None, order_by=None, order_dir=None):
        """
        Returns the single latest item by order_by/dir (defaults to service defaults).
        """
        q = cls.model.query
        q = cls._apply_filters(q, filters)
        q = cls._apply_ordering(q, order_by, order_dir)
        return q.first()
    
    @classmethod
    def get_many_by_ids(cls, ids: list[int], preserve_order: bool = False):
        if not ids:
            return []
        q = cls.model.query.filter(cls.model.id.in_(ids))
        if preserve_order:
            order_case = case({id_: idx for idx, id_ in enumerate(ids)}, value=cls.model.id)
            q = q.order_by(order_case)
        return q.all()



