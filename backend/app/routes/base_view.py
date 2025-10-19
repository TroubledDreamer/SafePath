from flask.views import MethodView
from flask import request, jsonify
from app.utils.jwt_helpers import token_required

RESERVED = {"limit", "offset", "order_by", "order_dir", "last", "ids"}


def _parse_ids_arg(arg: str | None) -> list[int]:
    if not arg:
        return []

    ids = []
    for part in arg.split(","):
        part = part.strip()
        if part.isdigit():
            ids.append(int(part))

    ids += [int(x) for x in request.args.getlist("ids") if x.isdigit()]
    seen = set()
    ordered = []
    for i in ids:
        if i not in seen:
            seen.add(i)
            ordered.append(i)
    return ordered

class BaseCRUDView(MethodView):
    service_class = None

    @token_required
    def get(self, id=None):
        if id is None:
            ids = _parse_ids_arg(request.args.get("ids"))
            if ids:
                items = self.service_class.get_many_by_ids(ids, preserve_order=True)
                return jsonify({
                    "data": [i.to_dict() for i in items],
                    "meta": {"total": len(items), "ids": ids}
                })
            
            limit = request.args.get("limit", type=int)
            offset = request.args.get("offset", default=0, type=int)
            order_by = request.args.get("order_by")
            order_dir = request.args.get("order_dir", "desc")
            get_last = request.args.get("last", "false").lower() in ("1", "true", "yes")
            filters = {k: v for k, v in request.args.items() if k not in RESERVED}

            if get_last:
                item = self.service_class.get_last(filters=filters, order_by=order_by, order_dir=order_dir)
                return (jsonify(item.to_dict()), 200) if item else ("Not found", 404)

            items, total = self.service_class.list(
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
                }
            })

        item = self.service_class.get_by_id(id)
        return jsonify(item.to_dict()) if item else ("Not found", 404)

    @token_required
    def post(self):
        data = request.json
        item = self.service_class.create(data)
        return jsonify(item.to_dict()), 201

    @token_required
    def put(self, id):
        data = request.json
        item = self.service_class.update(id, data)
        return jsonify(item.to_dict()) if item else ("Not found", 404)

    @token_required
    def delete(self, id):
        result = self.service_class.delete(id)
        return ("Deleted", 204) if result else ("Not found", 404)

