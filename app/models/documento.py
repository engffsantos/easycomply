# app/models/documento.py
from ..extensions import db
import datetime

class Documento(db.Model):
    __tablename__ = "documentos"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    document_type = db.Column(db.String(50), nullable=False) # Ex: "politica_privacidade", "termo_uso", "contrato_dpa"
    content_hash = db.Column(db.String(256), nullable=True) # Hash do conteúdo para versionamento/integridade
    version = db.Column(db.Integer, default=1)
    storage_path = db.Column(db.String(512), nullable=True) # Caminho para o arquivo no sistema de arquivos ou S3
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    # user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False) # Quem criou/possui o documento
    # created_by_user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)

    def __init__(self, title, document_type, user_id=None, content_hash=None, storage_path=None):
        self.title = title
        self.document_type = document_type
        # self.user_id = user_id
        self.content_hash = content_hash
        self.storage_path = storage_path

    def __repr__(self):
        return f"<Documento {self.title} (v{self.version})>"

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "document_type": self.document_type,
            "version": self.version,
            "storage_path": self.storage_path,
            # "user_id": self.user_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }

