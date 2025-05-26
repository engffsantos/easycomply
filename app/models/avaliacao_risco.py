# app/models/avaliacao_risco.py
from ..extensions import db
import datetime

class AvaliacaoRisco(db.Model):
    __tablename__ = "avaliacoes_risco"

    id = db.Column(db.Integer, primary_key=True)
    risco_id = db.Column(db.Integer, db.ForeignKey("riscos.id"), nullable=False)
    avaliado_por_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    data_avaliacao = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    
    # Escalas podem ser ajustadas conforme metodologia (ex: 1-5)
    probabilidade = db.Column(db.Integer, nullable=False)
    impacto = db.Column(db.Integer, nullable=False)
    
    # Nível de risco inerente (antes dos controles)
    nivel_risco_inerente = db.Column(db.Integer, nullable=True) # Calculado: probabilidade * impacto
    
    justificativa_probabilidade = db.Column(db.Text, nullable=True)
    justificativa_impacto = db.Column(db.Text, nullable=True)
    controles_existentes = db.Column(db.Text, nullable=True)
    
    # Nível de risco residual (após considerar controles)
    # Pode ser calculado ou inserido manualmente com base na eficácia dos controles
    probabilidade_residual = db.Column(db.Integer, nullable=True)
    impacto_residual = db.Column(db.Integer, nullable=True)
    nivel_risco_residual = db.Column(db.Integer, nullable=True) # Calculado: probabilidade_residual * impacto_residual
    justificativa_residual = db.Column(db.Text, nullable=True)
    
    observacoes = db.Column(db.Text, nullable=True)

    # Relacionamentos
    risco = db.relationship("Risco", back_populates="avaliacoes")
    avaliado_por = db.relationship("User")

    def __init__(self, risco_id, probabilidade, impacto, avaliado_por_id=None, 
                 justificativa_probabilidade=None, justificativa_impacto=None, 
                 controles_existentes=None, probabilidade_residual=None, 
                 impacto_residual=None, justificativa_residual=None, observacoes=None):
        self.risco_id = risco_id
        self.probabilidade = probabilidade
        self.impacto = impacto
        self.avaliado_por_id = avaliado_por_id
        self.justificativa_probabilidade = justificativa_probabilidade
        self.justificativa_impacto = justificativa_impacto
        self.controles_existentes = controles_existentes
        self.probabilidade_residual = probabilidade_residual
        self.impacto_residual = impacto_residual
        self.justificativa_residual = justificativa_residual
        self.observacoes = observacoes
        # Calcula níveis de risco ao inicializar
        self.calcular_niveis_risco()

    def calcular_niveis_risco(self):
        if self.probabilidade is not None and self.impacto is not None:
            self.nivel_risco_inerente = self.probabilidade * self.impacto
        else:
            self.nivel_risco_inerente = None
            
        if self.probabilidade_residual is not None and self.impacto_residual is not None:
            self.nivel_risco_residual = self.probabilidade_residual * self.impacto_residual
        elif self.controles_existentes: # Se há controles mas não residual, pode ser igual ao inerente
             self.nivel_risco_residual = self.nivel_risco_inerente
        else: # Sem controles, residual = inerente
            self.nivel_risco_residual = self.nivel_risco_inerente

    def __repr__(self):
        return f"<AvaliacaoRisco Risco: {self.risco_id} Nível Inerente: {self.nivel_risco_inerente} Nível Residual: {self.nivel_risco_residual}>"

    def to_dict(self):
        return {
            "id": self.id,
            "risco_id": self.risco_id,
            "avaliado_por_id": self.avaliado_por_id,
            "avaliado_por": self.avaliado_por.username if self.avaliado_por else None,
            "data_avaliacao": self.data_avaliacao.isoformat() if self.data_avaliacao else None,
            "probabilidade": self.probabilidade,
            "impacto": self.impacto,
            "nivel_risco_inerente": self.nivel_risco_inerente,
            "justificativa_probabilidade": self.justificativa_probabilidade,
            "justificativa_impacto": self.justificativa_impacto,
            "controles_existentes": self.controles_existentes,
            "probabilidade_residual": self.probabilidade_residual,
            "impacto_residual": self.impacto_residual,
            "nivel_risco_residual": self.nivel_risco_residual,
            "justificativa_residual": self.justificativa_residual,
            "observacoes": self.observacoes
        }

