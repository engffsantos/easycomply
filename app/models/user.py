# app/models/user.py
from ..extensions import db
from werkzeug.security import generate_password_hash, check_password_hash
import datetime

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    is_admin = db.Column(db.Boolean, default=False)
    # Campos adicionais
    full_name = db.Column(db.String(150), nullable=True)
    company_name = db.Column(db.String(150), nullable=True)

    # Relacionamentos
    checklists = db.relationship("Checklist", backref="owner", lazy=True)
    documentos = db.relationship("Documento", backref="owner", lazy=True)
    evidencias = db.relationship("Evidencia", backref="uploader", lazy=True)

    def __init__(self, username, email, password, is_admin=False, full_name=None, company_name=None):
        self.username = username
        self.email = email
        self.set_password(password)
        self.is_admin = is_admin
        self.full_name = full_name
        self.company_name = company_name

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f"<User {self.username}>"

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "full_name": self.full_name,
            "company_name": self.company_name,
            "is_admin": self.is_admin,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
