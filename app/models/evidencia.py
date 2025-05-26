# app/models/evidencia.py
from ..extensions import db
import datetime
import os

class Evidencia(db.Model):
    __tablename__ = "evidencias"

    id = db.Column(db.Integer, primary_key=True)
    item_id = db.Column(db.Integer, db.ForeignKey("checklist_items.id"), nullable=False)
    arquivo = db.Column(db.String(512), nullable=False)  # Caminho para o arquivo
    nome_original = db.Column(db.String(255), nullable=False)  # Nome original do arquivo
    tipo_arquivo = db.Column(db.String(100), nullable=True)  # MIME type
    tamanho = db.Column(db.Integer, nullable=True)  # Tamanho em bytes
    observacao = db.Column(db.Text, nullable=True)
    data_upload = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)  # Quem fez o upload

    def __init__(self, item_id, arquivo, nome_original, tipo_arquivo=None, 
                 tamanho=None, observacao=None, user_id=None):
        self.item_id = item_id
        self.arquivo = arquivo
        self.nome_original = nome_original
        self.tipo_arquivo = tipo_arquivo
        self.tamanho = tamanho
        self.observacao = observacao
        self.user_id = user_id

    def __repr__(self):
        return f"<Evidencia {self.nome_original} para item {self.item_id}>"

    def to_dict(self):
        return {
            "id": self.id,
            "item_id": self.item_id,
            "arquivo": self.arquivo,
            "nome_original": self.nome_original,
            "tipo_arquivo": self.tipo_arquivo,
            "tamanho": self.tamanho,
            "observacao": self.observacao,
            "data_upload": self.data_upload.isoformat() if self.data_upload else None,
            "user_id": self.user_id
        }
    
    @property
    def nome_arquivo(self):
        """Retorna apenas o nome do arquivo sem o caminho"""
        return os.path.basename(self.arquivo)
    
    @property
    def extensao(self):
        """Retorna a extensão do arquivo"""
        _, ext = os.path.splitext(self.nome_original)
        return ext.lower()
