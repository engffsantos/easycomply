# app/services/risco_service.py
from ..extensions import db
from ..models.risco import Risco, StatusRiscoEnum
from ..models.avaliacao_risco import AvaliacaoRisco
from ..models.plano_tratamento import PlanoTratamento, StatusPlanoTratamentoEnum
from ..models.user import User
from ..services.audit_service import AuditService
from ..models.audit_log import ActionTypeEnum, EntityTypeEnum
from flask import g # Para obter o usuário logado para auditoria
import datetime

class RiscoService:

    @staticmethod
    def get_all_riscos(filters=None):
        """Retorna todos os riscos, com opções de filtro"""
        query = Risco.query
        
        if filters:
            if filters.get("categoria"):
                query = query.filter(Risco.categoria == filters["categoria"])
            if filters.get("status"):
                query = query.filter(Risco.status == filters["status"])
            # Adicionar mais filtros se necessário (nível de risco, etc.)
            
        riscos = query.order_by(Risco.data_identificacao.desc()).all()
        # Retorna dicionário simplificado para listagem
        return [risco.to_dict(include_details=False) for risco in riscos]

    @staticmethod
    def get_risco_by_id(risco_id):
        """Retorna um risco específico com detalhes completos"""
        risco = Risco.query.get_or_404(risco_id)
        return risco.to_dict(include_details=True)

    @staticmethod
    def create_risco(data, user_id):
        """Cria um novo risco"""
        risco = Risco(
            nome=data.get("nome"),
            descricao=data.get("descricao"),
            categoria=data.get("categoria"),
            ativo_relacionado=data.get("ativo_relacionado"),
            fonte_risco=data.get("fonte_risco"),
            checklist_item_id=data.get("checklist_item_id"),
            identificado_por_id=user_id
        )
        db.session.add(risco)
        db.session.commit()
        
        AuditService.log_action(
            ActionTypeEnum.CREATE,
            EntityTypeEnum.RISCO,
            f"Usuário {g.user.username} identificou o risco",
            entity_id=risco.id,
            user_id=user_id,
            additional_data=data
        )
        return risco

    @staticmethod
    def update_risco(risco_id, data, user_id):
        """Atualiza dados básicos de um risco"""
        risco = Risco.query.get_or_404(risco_id)
        old_data = risco.to_dict(include_details=True) # Log completo
        
        if "nome" in data: risco.nome = data["nome"]
        if "descricao" in data: risco.descricao = data["descricao"]
        if "categoria" in data: risco.categoria = data["categoria"]
        if "ativo_relacionado" in data: risco.ativo_relacionado = data["ativo_relacionado"]
        if "fonte_risco" in data: risco.fonte_risco = data["fonte_risco"]
        if "checklist_item_id" in data: risco.checklist_item_id = data["checklist_item_id"]
        if "status" in data: 
            try:
                new_status = StatusRiscoEnum(data["status"])
                risco.status = new_status
            except ValueError:
                pass # Ignora status inválido
        
        db.session.commit()
        
        AuditService.log_action(
            ActionTypeEnum.UPDATE,
            EntityTypeEnum.RISCO,
            f"Usuário {g.user.username} atualizou o risco",
            entity_id=risco.id,
            user_id=user_id,
            additional_data={"old": old_data, "new": data}
        )
        return risco

    @staticmethod
    def delete_risco(risco_id, user_id):
        """Exclui um risco (pode ser alterado para arquivar)"""
        risco = Risco.query.get_or_404(risco_id)
        
        # TODO: Considerar arquivamento em vez de exclusão física
        # risco.status = StatusRiscoEnum.FECHADO 
        # db.session.commit()
        
        db.session.delete(risco)
        db.session.commit()
        
        AuditService.log_action(
            ActionTypeEnum.DELETE,
            EntityTypeEnum.RISCO,
            f"Usuário {g.user.username} excluiu o risco",
            entity_id=risco_id, # ID ainda é útil para o log
            user_id=user_id
        )
        return True

    # --- Avaliações --- 

    @staticmethod
    def get_avaliacoes_by_risco(risco_id):
        """Retorna o histórico de avaliações de um risco"""
        risco = Risco.query.get_or_404(risco_id)
        avaliacoes = risco.avaliacoes.order_by(AvaliacaoRisco.data_avaliacao.desc()).all()
        return [avaliacao.to_dict() for avaliacao in avaliacoes]

    @staticmethod
    def create_avaliacao(risco_id, data, user_id):
        """Cria uma nova avaliação para um risco"""
        risco = Risco.query.get_or_404(risco_id)
        
        avaliacao = AvaliacaoRisco(
            risco_id=risco_id,
            probabilidade=data.get("probabilidade"),
            impacto=data.get("impacto"),
            justificativa_probabilidade=data.get("justificativa_probabilidade"),
            justificativa_impacto=data.get("justificativa_impacto"),
            controles_existentes=data.get("controles_existentes"),
            probabilidade_residual=data.get("probabilidade_residual"),
            impacto_residual=data.get("impacto_residual"),
            justificativa_residual=data.get("justificativa_residual"),
            observacoes=data.get("observacoes"),
            avaliado_por_id=user_id
        )
        # O cálculo dos níveis é feito no __init__ do modelo
        
        db.session.add(avaliacao)
        
        # Atualiza status do risco para AVALIADO se ainda não estiver
        if risco.status == StatusRiscoEnum.IDENTIFICADO or risco.status == StatusRiscoEnum.ANALISADO:
             risco.status = StatusRiscoEnum.AVALIADO
             
        db.session.commit()
        
        AuditService.log_action(
            ActionTypeEnum.CREATE,
            EntityTypeEnum.AVALIACAO_RISCO,
            f"Usuário {g.user.username} avaliou o risco",
            entity_id=avaliacao.id,
            user_id=user_id,
            additional_data=data
        )
        return avaliacao

    # --- Planos de Tratamento --- 

    @staticmethod
    def get_planos_by_risco(risco_id):
        """Retorna os planos de tratamento de um risco"""
        risco = Risco.query.get_or_404(risco_id)
        planos = risco.planos_tratamento.order_by(PlanoTratamento.data_criacao.desc()).all()
        return [plano.to_dict() for plano in planos]

    @staticmethod
    def create_plano_tratamento(risco_id, data, user_id):
        """Cria uma nova ação no plano de tratamento"""
        risco = Risco.query.get_or_404(risco_id)
        
        prazo = None
        if data.get("prazo"):
            try:
                prazo = datetime.datetime.fromisoformat(data["prazo"])
            except ValueError:
                pass # Ignora prazo inválido
                
        plano = PlanoTratamento(
            risco_id=risco_id,
            acao=data.get("acao"),
            responsavel_id=data.get("responsavel_id"),
            prazo=prazo,
            observacoes=data.get("observacoes"),
            custo_estimado=data.get("custo_estimado")
        )
        db.session.add(plano)
        
        # Atualiza status do risco para EM_TRATAMENTO se aplicável
        if risco.status == StatusRiscoEnum.AVALIADO:
            risco.status = StatusRiscoEnum.EM_TRATAMENTO
            
        db.session.commit()
        
        AuditService.log_action(
            ActionTypeEnum.CREATE,
            EntityTypeEnum.PLANO_TRATAMENTO,
            f"Usuário {g.user.username} adicionou ação ao plano de tratamento do risco",
            entity_id=plano.id,
            user_id=user_id,
            additional_data=data
        )
        return plano

    @staticmethod
    def update_plano_tratamento(plano_id, data, user_id):
        """Atualiza uma ação do plano de tratamento (status, conclusão, etc.)"""
        plano = PlanoTratamento.query.get_or_404(plano_id)
        old_data = plano.to_dict()
        
        if "acao" in data: plano.acao = data["acao"]
        if "responsavel_id" in data: plano.responsavel_id = data["responsavel_id"]
        if "prazo" in data:
            try:
                plano.prazo = datetime.datetime.fromisoformat(data["prazo"])
            except (ValueError, TypeError):
                plano.prazo = None
        if "status" in data:
            try:
                new_status = StatusPlanoTratamentoEnum(data["status"])
                plano.status = new_status
                if new_status == StatusPlanoTratamentoEnum.CONCLUIDO and not plano.data_conclusao:
                    plano.data_conclusao = datetime.datetime.utcnow()
                elif new_status != StatusPlanoTratamentoEnum.CONCLUIDO:
                    plano.data_conclusao = None # Limpa data se não estiver concluído
            except ValueError:
                pass # Ignora status inválido
        if "observacoes" in data: plano.observacoes = data["observacoes"]
        if "custo_estimado" in data: plano.custo_estimado = data["custo_estimado"]
        
        db.session.commit()
        
        # TODO: Atualizar status do Risco pai se todas as ações estiverem concluídas/canceladas?
        
        AuditService.log_action(
            ActionTypeEnum.UPDATE,
            EntityTypeEnum.PLANO_TRATAMENTO,
            f"Usuário {g.user.username} atualizou ação do plano de tratamento",
            entity_id=plano.id,
            user_id=user_id,
            additional_data={"old": old_data, "new": data}
        )
        return plano

    @staticmethod
    def delete_plano_tratamento(plano_id, user_id):
        """Exclui uma ação do plano de tratamento"""
        plano = PlanoTratamento.query.get_or_404(plano_id)
        db.session.delete(plano)
        db.session.commit()
        
        AuditService.log_action(
            ActionTypeEnum.DELETE,
            EntityTypeEnum.PLANO_TRATAMENTO,
            f"Usuário {g.user.username} excluiu ação do plano de tratamento",
            entity_id=plano_id,
            user_id=user_id
        )
        return True

    # --- Dashboard --- 
    
    @staticmethod
    def get_dashboard_data():
        """Retorna dados agregados para o dashboard de riscos"""
        total_riscos = Risco.query.count()
        riscos_por_status = db.session.query(Risco.status, db.func.count(Risco.id)).group_by(Risco.status).all()
        
        # Dados para Matriz de Risco (usando a última avaliação de cada risco)
        matriz_data = []
        riscos_ativos = Risco.query.filter(Risco.status != StatusRiscoEnum.FECHADO).all()
        for risco in riscos_ativos:
            avaliacao = risco.ultima_avaliacao
            if avaliacao:
                matriz_data.append({
                    "id": risco.id,
                    "nome": risco.nome,
                    "probabilidade": avaliacao.probabilidade,
                    "impacto": avaliacao.impacto,
                    "nivel_inerente": avaliacao.nivel_risco_inerente,
                    "probabilidade_residual": avaliacao.probabilidade_residual,
                    "impacto_residual": avaliacao.impacto_residual,
                    "nivel_residual": avaliacao.nivel_risco_residual
                })
                
        return {
            "total_riscos": total_riscos,
            "riscos_por_status": dict(riscos_por_status),
            "matriz_data": matriz_data
        }

