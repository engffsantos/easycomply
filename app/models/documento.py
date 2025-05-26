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
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True) # Quem criou/possui o documento
    
    # Campos adicionais para formulário interativo
    empresa_nome = db.Column(db.String(255), nullable=True)
    tipo_dados = db.Column(db.String(255), nullable=True)
    base_legal = db.Column(db.String(100), nullable=True)
    finalidade = db.Column(db.Text, nullable=True)
    compartilhamento = db.Column(db.Text, nullable=True)
    
    # Campos para assinatura eletrônica (opcional)
    assinatura_status = db.Column(db.String(50), nullable=True) # pendente, assinado, recusado
    assinatura_url = db.Column(db.String(512), nullable=True) # URL para documento assinado ou página de assinatura

    def __init__(self, title, document_type, user_id=None, content_hash=None, storage_path=None,
                empresa_nome=None, tipo_dados=None, base_legal=None, finalidade=None, compartilhamento=None):
        self.title = title
        self.document_type = document_type
        self.user_id = user_id
        self.content_hash = content_hash
        self.storage_path = storage_path
        self.empresa_nome = empresa_nome
        self.tipo_dados = tipo_dados
        self.base_legal = base_legal
        self.finalidade = finalidade
        self.compartilhamento = compartilhamento

    def __repr__(self):
        return f"<Documento {self.title} (v{self.version})>"

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "document_type": self.document_type,
            "version": self.version,
            "storage_path": self.storage_path,
            "user_id": self.user_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "empresa_nome": self.empresa_nome,
            "tipo_dados": self.tipo_dados,
            "base_legal": self.base_legal,
            "finalidade": self.finalidade,
            "compartilhamento": self.compartilhamento,
            "assinatura_status": self.assinatura_status,
            "assinatura_url": self.assinatura_url
        }
