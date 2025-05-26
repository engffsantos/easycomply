# app/models/treinamento.py
from ..extensions import db
import datetime

class Treinamento(db.Model):
    __tablename__ = "treinamentos"

    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(200), nullable=False)
    descricao = db.Column(db.Text, nullable=True)
    categoria = db.Column(db.String(100), nullable=True)
    criado_por_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    data_criacao = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    material_url = db.Column(db.String(512), nullable=True)
    duracao_estimada = db.Column(db.Integer, nullable=True) # Em minutos
    ativo = db.Column(db.Boolean, default=True)

    # Relacionamentos
    criado_por = db.relationship("User")
    # O relacionamento com StatusUsuarioTreinamento será definido no modelo StatusUsuarioTreinamento
    # status_usuarios = db.relationship("StatusUsuarioTreinamento", back_populates="treinamento", cascade="all, delete-orphan")

    def __init__(self, titulo, descricao=None, categoria=None, criado_por_id=None, material_url=None, duracao_estimada=None, ativo=True):
        self.titulo = titulo
        self.descricao = descricao
        self.categoria = categoria
        self.criado_por_id = criado_por_id
        self.material_url = material_url
        self.duracao_estimada = duracao_estimada
        self.ativo = ativo

    def __repr__(self):
        return f"<Treinamento {self.titulo}>"

    def to_dict(self, include_status=False, user_status=None):
        data = {
            "id": self.id,
            "titulo": self.titulo,
            "descricao": self.descricao,
            "categoria": self.categoria,
            "criado_por_id": self.criado_por_id,
            "data_criacao": self.data_criacao.isoformat() if self.data_criacao else None,
            "material_url": self.material_url,
            "duracao_estimada": self.duracao_estimada,
            "ativo": self.ativo,
            "criado_por": self.criado_por.username if self.criado_por else None
        }
        if include_status and user_status:
             data["user_status"] = user_status.to_dict() if user_status else None
        return data
