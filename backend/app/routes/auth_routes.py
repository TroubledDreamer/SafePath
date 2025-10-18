from flask import Blueprint, request, jsonify
from app.models import DirectoryTable  # Import the model

from werkzeug.security import generate_password_hash, check_password_hash
from app.models import User, UserInformation, db
from app.utils.jwt_helpers import generate_token

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    info = data.get("info")

    if not all([name, email, password, info]):
        return jsonify({"error": "Missing required fields"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 409

    # Create user
    user = User(
        name=name,
        email=email,
        password=generate_password_hash(password),
    )
    db.session.add(user)
    db.session.flush()  # Assigns user.id

    # Create user_information
    user_info = UserInformation(
        user_id=user.id,
        sex=info["sex"],
        height_cm=info.get("height_cm"),
        date_of_birth=info["date_of_birth"]
    )
    db.session.add(user_info)

    # 🚀 Create main folders for each category
    for category in ["dietary", "activity", "intake", "other"]:
        folder = DirectoryTable(
            user_id=user.id,
            name=f"Main {category.capitalize()} Folder",
            category=category,
            is_main=True,
            parent_id=None,
            is_public=False,
        )
        db.session.add(folder)

    db.session.commit()

    token = generate_token(user)
    return jsonify({"message": "Registered", "token": token}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({"error": "Invalid email or password"}), 401

    token = generate_token(user)
    return jsonify({"message": "Login successful", "token": token}), 200
