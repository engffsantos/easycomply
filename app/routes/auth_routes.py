from flask import Blueprint, request, jsonify
from app.controllers.auth_controller import login_user, register_user

auth_bp = Blueprint('auth_bp', __name__, url_prefix='/auth')

auth_bp.route('/login', methods=['POST'])(login_user)
auth_bp.route('/register', methods=['POST'])(register_user)
