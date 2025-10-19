# app/routes/trip_view.py
from flask import Blueprint, request, jsonify
from app.services.trip_service import TripService
from app.services.trip_point_service import TripPointService
from app.routes.user_scoped_crud_view import UserScopedCRUDView
from app.utils.jwt_helpers import token_required

class TripView(UserScopedCRUDView):
    service_class = TripService

trip_bp = Blueprint("trip_bp", __name__)
trip_view = TripView.as_view("trip")

# CRUD
trip_bp.add_url_rule("/", view_func=trip_view, methods=["GET", "POST"])
trip_bp.add_url_rule("/<int:id>", view_func=trip_view, methods=["GET", "PUT", "DELETE"])

# Realtime endpoints
@trip_bp.post("/<int:trip_id>/ping")
@token_required
def trip_ping(trip_id):
    user_id = request.user["user_id"]
    data = request.get_json(silent=True) or {}
    lat, lng = data.get("lat"), data.get("lng")
    if lat is None or lng is None:
        return {"error": "lat,lng required"}, 400

    point = TripPointService.append_point(trip_id, user_id, lat=float(lat), lng=float(lng))
    if point is None:
        return {"error": "trip not found or not yours"}, 404

    trip = TripService.get_by_id(trip_id, user_id)
    return jsonify({
        "trip_id": trip_id,
        "risk_level": trip.risk_level,
        "cluster_id": trip.cluster_id,
        "similarity": float(trip.cluster_sim or 0.0)
    })

@trip_bp.post("/<int:trip_id>/end")
@token_required
def trip_end(trip_id):
    user_id = request.user["user_id"]
    t = TripService.finalize(trip_id, user_id, status="COMPLETED")
    return (jsonify(t.to_dict()), 200) if t else ("Not found", 404)
