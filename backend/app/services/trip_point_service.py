from app.services.base_service import BaseService
from app.models import TripPoint, Trip, db

class TripPointService(BaseService):
    model = TripPoint
    default_order_by = "id"
    default_order_dir = "asc"
    filterable_fields = {"trip_id"}

    @classmethod
    def append_point(cls, trip_id: int, user_id: int, *, lat: float, lng: float):
        # ensure trip belongs to user
        trip = Trip.query.filter_by(id=trip_id, user_id=user_id).first()
        if not trip:
            return None
        return cls.create({"trip_id": trip_id, "lat": lat, "lng": lng})

    @classmethod
    def get_path(cls, trip_id: int):
        pts = (cls.model.query
               .filter_by(trip_id=trip_id)
               .order_by(cls.model.id.asc())
               .all())
        return [(float(p.lat), float(p.lng)) for p in pts]
