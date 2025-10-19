# app/routes/routes_cluster.py
from flask import Blueprint, request, jsonify
from datetime import datetime
from math import radians, sin, cos, asin, sqrt
import json

from app import db
from app.models import RouteCluster

cluster_bp = Blueprint("cluster_bp", __name__)

# ---- Tunables ----
S_MATCH  = 0.70
S_RISK   = 0.30
N_NORMAL = 10
SAMPLE_M = 100
PREC_SIG = 7
PREC_OD  = 5

# ---- helpers (same as earlier, compact) ----
def haversine_m(a, b):
    (lat1, lon1), (lat2, lon2) = a, b
    R = 6371000.0
    p1, p2 = radians(lat1), radians(lat2)
    dlat = p2 - p1
    dlon = radians(lon2 - lon1)
    x = sin(dlat/2)**2 + cos(p1)*cos(p2)*sin(dlon/2)**2
    return 2 * R * asin(sqrt(x))

def decode_polyline(encoded):
    coords = []; index = lat = lng = 0
    while index < len(encoded):
        for coord in (True, False):
            result = shift = 0
            while True:
                b = ord(encoded[index]) - 63; index += 1
                result |= (b & 0x1f) << shift
                shift += 5
                if b < 0x20: break
            d = ~(result >> 1) if (result & 1) else (result >> 1)
            if coord: lat += d
            else:     lng += d
        coords.append((lat/1e5, lng/1e5))
    return coords

def resample_every_m(points, step_m=SAMPLE_M):
    if not points: return []
    out = [points[0]]; acc = 0.0; a = points[0]
    for b in points[1:]:
        seg = haversine_m(a, b)
        while acc + seg >= step_m and seg > 0:
            ratio = (step_m - acc) / seg
            lat = a[0] + ratio * (b[0] - a[0])
            lng = a[1] + ratio * (b[1] - a[1])
            out.append((lat, lng))
            a = (lat, lng)
            seg = haversine_m(a, b)
            acc = 0.0
        acc += seg
        a = b
    return out

try:
    import geohash as _gh
    def geohash_encode(lat, lng, precision):
        return _gh.encode(lat, lng, precision=precision)
except Exception:
    def geohash_encode(lat, lng, precision):
        q = 10 ** (precision - 1)
        return f"{round(float(lat)*q)}:{round(float(lng)*q)}"

def signature_from_polyline(encoded):
    pts = decode_polyline(encoded)
    smp = resample_every_m(pts, SAMPLE_M)
    return list({ geohash_encode(lat, lng, PREC_SIG) for (lat, lng) in smp })

def jaccard(a, b):
    A, B = set(a), set(b)
    return len(A & B) / max(1, len(A | B))

def coarse_hash(lat, lng):
    return geohash_encode(float(lat), float(lng), PREC_OD)

# ---- endpoint ----
@cluster_bp.post("/clusterize")
def clusterize_route():
    """
    POST /api/v1/routes/clusterize
    Body: { origin:{lat,lng}, destination:{lat,lng}, encoded_polyline:"..." }
    """
    data = request.get_json(silent=True) or {}
    origin = data.get("origin") or {}
    dest   = data.get("destination") or {}
    poly   = data.get("encoded_polyline")
    if not poly or "lat" not in origin or "lng" not in origin or "lat" not in dest or "lng" not in dest:
        return jsonify({"error": "origin, destination, encoded_polyline required"}), 400

    sig = signature_from_polyline(poly)
    o_hash = coarse_hash(origin["lat"], origin["lng"])
    d_hash = coarse_hash(dest["lat"], dest["lng"])

    candidates = RouteCluster.query.filter_by(origin_hash=o_hash, dest_hash=d_hash).all()
    best, best_sim = None, 0.0
    for c in candidates:
        sim = jaccard(sig, json.loads(c.geohashes_json))
        if sim > best_sim:
            best, best_sim = c, sim

    if best and best_sim >= S_MATCH:
        best.trips_count += 1
        best.last_seen = datetime.utcnow()
        if best.trips_count >= N_NORMAL:
            best.status = "NORMAL"
        db.session.commit()
        return jsonify({
            "cluster_id": best.id,
            "similarity": round(best_sim, 3),
            "status": best.status,
            "trips_count": best.trips_count
        }), 200

    # create new unusual cluster
    new_c = RouteCluster(
        origin_hash=o_hash,
        dest_hash=d_hash,
        geohashes_json=json.dumps(sig),
        trips_count=1,
        status='UNUSUAL'
    )
    db.session.add(new_c)
    db.session.commit()
    return jsonify({
        "cluster_id": new_c.id,
        "similarity": round(best_sim, 3),
        "status": new_c.status,
        "trips_count": new_c.trips_count,
        "note": "New cluster created"
    }), 201
