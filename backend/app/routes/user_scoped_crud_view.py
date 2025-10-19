from flask.views import MethodView
from flask import request, jsonify
from app.utils.jwt_helpers import token_required

RESERVED = {"range", "tz_offset", "limit", "offset", "order_by", "order_dir", "last"}


class UserScopedCRUDView(MethodView):
    service_class = None

    decorators = [token_required]  # apply to all methods




    def get(self, id=None):
        user_id = request.user["user_id"]

        if id is None:
            # pagination & ordering
            range_key = request.args.get("range", "all")
            tz_offset = int(request.args.get("tz_offset", 0))
            limit = request.args.get("limit", type=int)
            offset = request.args.get("offset", default=0, type=int)
            order_by = request.args.get("order_by")  # e.g., "date"
            order_dir = request.args.get("order_dir", "desc")  # "asc" | "desc"

            # support ?last=true to fetch only the latest item
            get_last = request.args.get("last", "false").lower() in ("1", "true", "yes")

            # simple equality filters for allowed fields
            filters = {k: v for k, v in request.args.items() if k not in RESERVED}

            if get_last:
                item = self.service_class.get_last_scoped(
                    user_id,
                    range_key=range_key,
                    tz_offset=tz_offset,
                    filters=filters,
                    order_by=order_by,
                    order_dir=order_dir,
                )
                return (jsonify(item.to_dict()), 200) if item else ("Not found", 404)

            items, total = self.service_class.list_scoped(
                user_id,
                range_key=range_key,
                tz_offset=tz_offset,
                filters=filters,
                order_by=order_by,
                order_dir=order_dir,
                limit=limit,
                offset=offset,
            )
            return jsonify({
                "data": [i.to_dict() for i in items],
                "meta": {
                    "total": total,
                    "limit": limit,
                    "offset": offset,
                    "order_by": order_by or self.service_class.default_order_by,
                    "order_dir": order_dir or self.service_class.default_order_dir,
                    "range": range_key,
                }
            })

        # id-specific
        item = self.service_class.get_by_id(id, user_id)
        return jsonify(item.to_dict()) if item else ("Not found", 404)



    def post(self):
        user_id = request.user["user_id"]
        data = request.json
        item = self.service_class.create(data, user_id)
        return jsonify(item.to_dict()), 201

    def put(self, id):
        user_id = request.user["user_id"]
        data = request.json
        item = self.service_class.update(id, data, user_id)
        return jsonify(item.to_dict()) if item else ("Not found", 404)

    def delete(self, id):
        user_id = request.user["user_id"]
        result = self.service_class.delete(id, user_id)
        return ("Deleted", 204) if result else ("Not found", 404)
