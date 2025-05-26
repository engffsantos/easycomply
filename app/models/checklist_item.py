# app/models/checklist_item.py
from ..extensions import db
import datetime
from enum import Enum

class RiscoEnum(str, Enum):
    BAIXO = "baixo"
    MEDIO = "medio"
    ALTO = "alto"

class PrioridadeEnum(str, Enum):
    BAIXA = "baixa"
    MEDIA = "media"
    ALTA = "alta"

class StatusEnum(str, Enum):
    PENDENTE = "pendente"
    EM_ANDAMENTO = "em_andamento"
    CONCLUIDO = "concluido"

class ChecklistItem(db.Model):
    __tablename__ = "checklist_items"

    id = db.Column(db.Integer, primary_key=True)
    checklist_id = db.Column(db.Integer, db.ForeignKey("checklists.id"), nullable=False)
    nome = db.Column(db.String(200), nullable=False)
    descricao = db.Column(db.Text, nullable=True)
    categoria = db.Column(db.String(100), nullable=True)
    risco = db.Column(db.String(20), nullable=False, default=RiscoEnum.MEDIO)
    prioridade = db.Column(db.String(20), nullable=False, default=PrioridadeEnum.MEDIA)
    status = db.Column(db.String(20), nullable=False, default=StatusEnum.PENDENTE)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    
    # Relacionamentos
    evidencias = db.relationship("Evidencia", backref="item", lazy=True, cascade="all, delete-orphan")
    
    def __init__(self, checklist_id, nome, descricao=None, categoria=None, 
                 risco=RiscoEnum.MEDIO, prioridade=PrioridadeEnum.MEDIA, 
                 status=StatusEnum.PENDENTE):
        self.checklist_id = checklist_id
        self.nome = nome
        self.descricao = descricao
        self.categoria = categoria
        self.risco = risco
        self.prioridade = prioridade
        self.status = status

    def __repr__(self):
        return f"<ChecklistItem {self.nome} (Risco: {self.risco}, Status: {self.status})>"

    def to_dict(self):
        return {
            "id": self.id,
            "checklist_id": self.checklist_id,
            "nome": self.nome,
            "descricao": self.descricao,
            "categoria": self.categoria,
            "risco": self.risco,
            "prioridade": self.prioridade,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "evidencias": [evidencia.to_dict() for evidencia in self.evidencias]
        }
