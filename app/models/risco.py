# app/models/risco.py
from ..extensions import db
import datetime
from enum import Enum

class StatusRiscoEnum(str, Enum):
    IDENTIFICADO = "identificado"
    ANALISADO = "analisado"
    AVALIADO = "avaliado"
    EM_TRATAMENTO = "em_tratamento"
    MITIGADO = "mitigado"
    ACEITO = "aceito"
    FECHADO = "fechado"

class Risco(db.Model):
    __tablename__ = "riscos"

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(255), nullable=False)
    descricao = db.Column(db.Text, nullable=True)
    categoria = db.Column(db.String(100), nullable=True)
    ativo_relacionado = db.Column(db.String(255), nullable=True)
    fonte_risco = db.Column(db.String(100), nullable=True)
    identificado_por_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    data_identificacao = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    status = db.Column(db.String(50), nullable=False, default=StatusRiscoEnum.IDENTIFICADO)
    data_atualizacao = db.Column(db.DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    checklist_item_id = db.Column(db.Integer, db.ForeignKey("checklist_items.id"), nullable=True)

    # Relacionamentos
    identificado_por = db.relationship("User")
    avaliacoes = db.relationship("AvaliacaoRisco", back_populates="risco", lazy="dynamic", cascade="all, delete-orphan")
    planos_tratamento = db.relationship("PlanoTratamento", back_populates="risco", lazy="dynamic", cascade="all, delete-orphan")
    # checklist_item será definido no ChecklistItem

    def __init__(self, nome, descricao=None, categoria=None, ativo_relacionado=None, fonte_risco=None, identificado_por_id=None, checklist_item_id=None):
        self.nome = nome
        self.descricao = descricao
        self.categoria = categoria
        self.ativo_relacionado = ativo_relacionado
        self.fonte_risco = fonte_risco
        self.identificado_por_id = identificado_por_id
        self.checklist_item_id = checklist_item_id

    def __repr__(self):
        return f"<Risco {self.nome} (Status: {self.status})>"

    @property
    def ultima_avaliacao(self):
        return self.avaliacoes.order_by(AvaliacaoRisco.data_avaliacao.desc()).first()

    def to_dict(self, include_details=False):
        data = {
            "id": self.id,
            "nome": self.nome,
            "categoria": self.categoria,
            "status": self.status,
            "data_identificacao": self.data_identificacao.isoformat() if self.data_identificacao else None,
            "data_atualizacao": self.data_atualizacao.isoformat() if self.data_atualizacao else None,
            "identificado_por": self.identificado_por.username if self.identificado_por else None,
            "checklist_item_id": self.checklist_item_id
        }
        if include_details:
            ultima_avaliacao = self.ultima_avaliacao
            data.update({
                "descricao": self.descricao,
                "ativo_relacionado": self.ativo_relacionado,
                "fonte_risco": self.fonte_risco,
                "ultima_avaliacao": ultima_avaliacao.to_dict() if ultima_avaliacao else None,
                "planos_tratamento": [plano.to_dict() for plano in self.planos_tratamento.all()]
            })
        return data

# Importar AvaliacaoRisco e PlanoTratamento aqui para evitar dependência circular se necessário
# from .avaliacao_risco import AvaliacaoRisco
# from .plano_tratamento import PlanoTratamento

