# app/models/notification.py
from ..extensions import db
import datetime
from enum import Enum

class NotificationTypeEnum(str, Enum):
    VENCIMENTO_PROXIMO = "vencimento_proximo"
    ITEM_ATUALIZADO = "item_atualizado"
    EVIDENCIA_ADICIONADA = "evidencia_adicionada"
    DOCUMENTO_GERADO = "documento_gerado"

class NotificationPriorityEnum(str, Enum):
    BAIXA = "baixa"
    MEDIA = "media"
    ALTA = "alta"

class NotificationStatusEnum(str, Enum):
    NAO_LIDA = "nao_lida"
    LIDA = "lida"
    ARQUIVADA = "arquivada"

class Notification(db.Model):
    __tablename__ = "notifications"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    notification_type = db.Column(db.String(50), nullable=False)
    priority = db.Column(db.String(20), nullable=False, default=NotificationPriorityEnum.MEDIA)
    status = db.Column(db.String(20), nullable=False, default=NotificationStatusEnum.NAO_LIDA)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    read_at = db.Column(db.DateTime, nullable=True)
    
    # Campos para referência ao objeto relacionado
    reference_type = db.Column(db.String(50), nullable=True)  # "checklist_item", "documento", etc.
    reference_id = db.Column(db.Integer, nullable=True)
    
    # Relacionamentos
    user = db.relationship("User", backref=db.backref("notifications", lazy=True))
    
    def __init__(self, user_id, title, message, notification_type, 
                 priority=NotificationPriorityEnum.MEDIA, 
                 reference_type=None, reference_id=None):
        self.user_id = user_id
        self.title = title
        self.message = message
        self.notification_type = notification_type
        self.priority = priority
        self.reference_type = reference_type
        self.reference_id = reference_id
        self.status = NotificationStatusEnum.NAO_LIDA
    
    def mark_as_read(self):
        self.status = NotificationStatusEnum.LIDA
        self.read_at = datetime.datetime.utcnow()
    
    def archive(self):
        self.status = NotificationStatusEnum.ARQUIVADA
    
    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "title": self.title,
            "message": self.message,
            "notification_type": self.notification_type,
            "priority": self.priority,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "read_at": self.read_at.isoformat() if self.read_at else None,
            "reference_type": self.reference_type,
            "reference_id": self.reference_id
        }
