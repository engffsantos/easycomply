# app/models/plano_tratamento.py
from ..extensions import db
import datetime
from enum import Enum

class StatusPlanoTratamentoEnum(str, Enum):
    PENDENTE = "pendente"
    EM_ANDAMENTO = "em_andamento"
    CONCLUIDO = "concluido"
    CANCELADO = "cancelado"

class PlanoTratamento(db.Model):
    __tablename__ = "planos_tratamento_risco"

    id = db.Column(db.Integer, primary_key=True)
    risco_id = db.Column(db.Integer, db.ForeignKey("riscos.id"), nullable=False)
    acao = db.Column(db.Text, nullable=False)
    responsavel_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    prazo = db.Column(db.DateTime, nullable=True)
    status = db.Column(db.String(50), nullable=False, default=StatusPlanoTratamentoEnum.PENDENTE)
    data_criacao = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    data_conclusao = db.Column(db.DateTime, nullable=True)
    observacoes = db.Column(db.Text, nullable=True)
    custo_estimado = db.Column(db.Float, nullable=True)

    # Relacionamentos
    risco = db.relationship("Risco", back_populates="planos_tratamento")
    responsavel = db.relationship("User")

    def __init__(self, risco_id, acao, responsavel_id=None, prazo=None, status=StatusPlanoTratamentoEnum.PENDENTE, observacoes=None, custo_estimado=None):
        self.risco_id = risco_id
        self.acao = acao
        self.responsavel_id = responsavel_id
        self.prazo = prazo
        self.status = status
        self.observacoes = observacoes
        self.custo_estimado = custo_estimado

    def __repr__(self):
        return f"<PlanoTratamento Risco: {self.risco_id} Ação: {self.acao[:50]}... Status: {self.status}>"

    def to_dict(self):
        return {
            "id": self.id,
            "risco_id": self.risco_id,
            "acao": self.acao,
            "responsavel_id": self.responsavel_id,
            "responsavel": self.responsavel.username if self.responsavel else None,
            "prazo": self.prazo.isoformat() if self.prazo else None,
            "status": self.status,
            "data_criacao": self.data_criacao.isoformat() if self.data_criacao else None,
            "data_conclusao": self.data_conclusao.isoformat() if self.data_conclusao else None,
            "observacoes": self.observacoes,
            "custo_estimado": self.custo_estimado
        }

