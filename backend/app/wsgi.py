# app/wsgi.py
import os
from app import create_app

app = create_app()

if __name__ == "__main__":
    # For local dev; change port if you like
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5001)), debug=True)
