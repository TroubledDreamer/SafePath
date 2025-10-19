from dateutil import parser
from datetime import timezone

def parse_utc_naive(date_str: str):
    return parser.isoparse(date_str).astimezone(timezone.utc).replace(tzinfo=None)


def normalize_utc_fields(data: dict, fields: list[str]):
    for field in fields:
        if field in data and isinstance(data[field], str):
            try:
                dt = parser.isoparse(data[field])
                dt_utc_naive = dt.astimezone(timezone.utc).replace(tzinfo=None)
                data[field] = dt_utc_naive
            except Exception as e:
                raise ValueError(f"Invalid datetime format for field '{field}': {data[field]}")
