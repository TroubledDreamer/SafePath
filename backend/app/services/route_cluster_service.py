import json
from app.services.base_service import BaseService
from app.models import RouteCluster, db

class RouteClusterService(BaseService):
    model = RouteCluster
    default_order_by = "last_seen"
    default_order_dir = "desc"
    filterable_fields = {"origin_hash", "dest_hash", "status"}

    @classmethod
    def find_candidates(cls, origin_hash: str, dest_hash: str):
        return (cls.model.query
                .filter_by(origin_hash=origin_hash, dest_hash=dest_hash)
                .all())

    @classmethod
    def create_cluster(cls, origin_hash: str, dest_hash: str, geohashes: list[str]):
        return cls.create({
            "origin_hash": origin_hash,
            "dest_hash": dest_hash,
            "geohashes_json": json.dumps(geohashes),
            "trips_count": 1,
            "status": "UNUSUAL"
        })

    @classmethod
    def increment_count(cls, cluster_id: int, make_normal_at: int = 10):
        c = cls.model.query.get(cluster_id)
        if not c:
            return None
        c.trips_count += 1
        if c.trips_count >= make_normal_at:
            c.status = "NORMAL"
        db.session.commit()
        return c

    @classmethod
    def get_signature(cls, cluster_id: int) -> list[str] | None:
        c = cls.model.query.get(cluster_id)
        if not c:
            return None
        return json.loads(c.geohashes_json)
