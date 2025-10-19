from app.services.user_scoped_service import UserScopedService
from app.models import Trip, db

class TripService(UserScopedService):
    model = Trip
    default_order_by = "started_at"
    default_order_dir = "desc"
    filterable_fields = {"mode", "status", "risk_level", "cluster_id"}

    @classmethod
    def create_trip(cls, user_id: int, *, origin_lat, origin_lng, dest_lat, dest_lng,
                    mode, route_polyline, eta_sec, distance_m):
        payload = {
            "user_id": user_id,
            "origin_lat": origin_lat, "origin_lng": origin_lng,
            "dest_lat": dest_lat, "dest_lng": dest_lng,
            "mode": mode,
            "route_polyline": route_polyline,
            "eta_sec": int(eta_sec),
            "distance_m": int(distance_m)
        }
        return super().create(payload)

    @classmethod
    def finalize(cls, trip_id: int, user_id: int, *, status="COMPLETED", risk_level=None):
        trip = cls.get_by_id(trip_id, user_id)
        if not trip:
            return None
        trip.status = status
        if risk_level:
            trip.risk_level = risk_level
        db.session.commit()
        return trip

    @classmethod
    def set_cluster(cls, trip_id: int, user_id: int, *, cluster_id: int, similarity: float):
        trip = cls.get_by_id(trip_id, user_id)
        if not trip:
            return None
        trip.cluster_id = cluster_id
        trip.cluster_sim = round(float(similarity), 3)
        db.session.commit()
        return trip

    @classmethod
    def set_risk(cls, trip_id: int, user_id: int, *, risk_level: str, alert_sent: bool | None = None):
        trip = cls.get_by_id(trip_id, user_id)
        if not trip:
            return None
        trip.risk_level = risk_level
        if alert_sent is not None:
            trip.alert_sent = alert_sent
        db.session.commit()
        return trip
