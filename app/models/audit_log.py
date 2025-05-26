# app/models/audit_log.py
from ..extensions import db
import datetime
from enum import Enum

class ActionTypeEnum(str, Enum):
    CREATE = "create"
    READ = "read"
    UPDATE = "update"
    DELETE = "delete"
    LOGIN = "login"
    LOGOUT = "logout"
    EXPORT = "export"
    GENERATE = "generate"
    UPLOAD = "upload"
    DOWNLOAD = "download"

class EntityTypeEnum(str, Enum):
    USER = "user"
    CHECKLIST = "checklist"
    CHECKLIST_ITEM = "checklist_item"
    EVIDENCIA = "evidencia"
    DOCUMENTO = "documento"
    NOTIFICATION = "notification"
    SYSTEM = "system"

class AuditLog(db.Model):
    __tablename__ = "audit_logs"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)  # Pode ser nulo para ações do sistema
    action_type = db.Column(db.String(50), nullable=False)
    entity_type = db.Column(db.String(50), nullable=False)
    entity_id = db.Column(db.Integer, nullable=True)  # Pode ser nulo para ações gerais
    description = db.Column(db.Text, nullable=False)
    ip_address = db.Column(db.String(50), nullable=True)
    user_agent = db.Column(db.String(255), nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    additional_data = db.Column(db.Text, nullable=True)  # JSON com dados adicionais
    
    # Relacionamentos
    user = db.relationship("User", backref=db.backref("audit_logs", lazy=True))
    
    def __init__(self, action_type, entity_type, description, 
                 user_id=None, entity_id=None, ip_address=None, 
                 user_agent=None, additional_data=None):
        self.user_id = user_id
        self.action_type = action_type
        self.entity_type = entity_type
        self.entity_id = entity_id
        self.description = description
        self.ip_address = ip_address
        self.user_agent = user_agent
        self.additional_data = additional_data
    
    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "action_type": self.action_type,
            "entity_type": self.entity_type,
            "entity_id": self.entity_id,
            "description": self.description,
            "ip_address": self.ip_address,
            "user_agent": self.user_agent,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None,
            "additional_data": self.additional_data,
            "user": self.user.username if self.user else None
        }
