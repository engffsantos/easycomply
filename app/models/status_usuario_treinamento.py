# app/models/status_usuario_treinamento.py
from ..extensions import db
import datetime
from enum import Enum

class StatusTreinamentoEnum(str, Enum):
    NAO_INICIADO = "nao_iniciado"
    EM_ANDAMENTO = "em_andamento"
    CONCLUIDO = "concluido"
    PENDENTE_APROVACAO = "pendente_aprovacao" # Opcional, se necessário

class StatusUsuarioTreinamento(db.Model):
    __tablename__ = "status_usuario_treinamento"

    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    treinamento_id = db.Column(db.Integer, db.ForeignKey("treinamentos.id"), nullable=False)
    status = db.Column(db.String(50), nullable=False, default=StatusTreinamentoEnum.NAO_INICIADO)
    data_inicio = db.Column(db.DateTime, nullable=True)
    data_conclusao = db.Column(db.DateTime, nullable=True)
    pontuacao = db.Column(db.Integer, nullable=True)
    certificado_url = db.Column(db.String(512), nullable=True)
    prazo_conclusao = db.Column(db.DateTime, nullable=True)
    data_atribuicao = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    # Índices
    __table_args__ = (db.UniqueConstraint("usuario_id", "treinamento_id", name="uq_usuario_treinamento"),)

    # Relacionamentos
    usuario = db.relationship("User", backref=db.backref("status_treinamentos", lazy=True))
    treinamento = db.relationship("Treinamento", backref=db.backref("status_usuarios", lazy=True, cascade="all, delete-orphan"))

    def __init__(self, usuario_id, treinamento_id, status=StatusTreinamentoEnum.NAO_INICIADO, prazo_conclusao=None):
        self.usuario_id = usuario_id
        self.treinamento_id = treinamento_id
        self.status = status
        self.prazo_conclusao = prazo_conclusao

    def __repr__(self):
        return f"<StatusUsuarioTreinamento User: {self.usuario_id} Treinamento: {self.treinamento_id} Status: {self.status}>"

    def to_dict(self):
        return {
            "id": self.id,
            "usuario_id": self.usuario_id,
            "treinamento_id": self.treinamento_id,
            "status": self.status,
            "data_inicio": self.data_inicio.isoformat() if self.data_inicio else None,
            "data_conclusao": self.data_conclusao.isoformat() if self.data_conclusao else None,
            "pontuacao": self.pontuacao,
            "certificado_url": self.certificado_url,
            "prazo_conclusao": self.prazo_conclusao.isoformat() if self.prazo_conclusao else None,
            "data_atribuicao": self.data_atribuicao.isoformat() if self.data_atribuicao else None,
            "usuario": self.usuario.username if self.usuario else None,
            # Evitar recursão infinita incluindo treinamento completo aqui
            # "treinamento": self.treinamento.to_dict() if self.treinamento else None 
        }
