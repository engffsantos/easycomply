# app/models/checklist.py
from ..extensions import db
import datetime

class Checklist(db.Model):
    __tablename__ = "checklists"

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(200), nullable=False)
    categoria = db.Column(db.String(100), nullable=True)
    descricao = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)  # Quem criou o checklist
    
    # Relacionamentos
    items = db.relationship("ChecklistItem", backref="checklist", lazy=True, cascade="all, delete-orphan")

    def __init__(self, nome, categoria=None, descricao=None, user_id=None):
        self.nome = nome
        self.categoria = categoria
        self.descricao = descricao
        self.user_id = user_id

    def __repr__(self):
        return f"<Checklist {self.nome}>"

    def to_dict(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "categoria": self.categoria,
            "descricao": self.descricao,
            "user_id": self.user_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "items": [item.to_dict() for item in self.items]
        }
    
    @property
    def total_items(self):
        """Retorna o número total de itens no checklist"""
        return len(self.items)
    
    @property
    def items_concluidos(self):
        """Retorna o número de itens concluídos no checklist"""
        return sum(1 for item in self.items if item.status == "concluido")
    
    @property
    def percentual_conclusao(self):
        """Retorna o percentual de conclusão do checklist"""
        if not self.items:
            return 0
        return int((self.items_concluidos / self.total_items) * 100)
    
    @property
    def itens_por_risco(self):
        """Retorna contagem de itens por nível de risco"""
        riscos = {"baixo": 0, "medio": 0, "alto": 0}
        for item in self.items:
            if item.risco in riscos:
                riscos[item.risco] += 1
        return riscos
