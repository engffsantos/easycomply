# app/services/treinamento_service.py
from ..extensions import db
from ..models.treinamento import Treinamento
from ..models.status_usuario_treinamento import StatusUsuarioTreinamento, StatusTreinamentoEnum
from ..models.user import User
from ..services.notification_service import NotificationService # Para lembretes (opcional)
from ..services.audit_service import AuditService # Para logs
from ..models.audit_log import ActionTypeEnum, EntityTypeEnum
from flask import g
import datetime

class TreinamentoService:
    @staticmethod
    def get_all_treinamentos(user_id, filters=None):
        """Retorna todos os treinamentos ativos, com status do usuário"""
        query = Treinamento.query.filter_by(ativo=True)
        
        if filters:
            if filters.get("categoria"):
                query = query.filter(Treinamento.categoria == filters["categoria"])
        
        treinamentos = query.order_by(Treinamento.data_criacao.desc()).all()
        
        # Adiciona o status do usuário logado a cada treinamento
        treinamentos_com_status = []
        for treinamento in treinamentos:
            status_usuario = StatusUsuarioTreinamento.query.filter_by(
                usuario_id=user_id,
                treinamento_id=treinamento.id
            ).first()
            treinamentos_com_status.append(treinamento.to_dict(include_status=True, user_status=status_usuario))
            
        return treinamentos_com_status

    @staticmethod
    def get_treinamento_by_id(treinamento_id, user_id):
        """Retorna um treinamento específico com status do usuário"""
        treinamento = Treinamento.query.get_or_404(treinamento_id)
        status_usuario = StatusUsuarioTreinamento.query.filter_by(
            usuario_id=user_id,
            treinamento_id=treinamento_id
        ).first()
        return treinamento.to_dict(include_status=True, user_status=status_usuario)

    @staticmethod
    def create_treinamento(data, admin_user_id):
        """Cria um novo treinamento (apenas admin)"""
        treinamento = Treinamento(
            titulo=data.get("titulo"),
            descricao=data.get("descricao"),
            categoria=data.get("categoria"),
            material_url=data.get("material_url"),
            duracao_estimada=data.get("duracao_estimada"),
            criado_por_id=admin_user_id
        )
        db.session.add(treinamento)
        db.session.commit()
        
        # Log de auditoria
        AuditService.log_action(
            ActionTypeEnum.CREATE,
            EntityTypeEnum.TREINAMENTO,
            f"Admin {g.user.username} criou o treinamento ",
            entity_id=treinamento.id,
            user_id=admin_user_id,
            additional_data=data
        )
        
        return treinamento

    @staticmethod
    def update_treinamento(treinamento_id, data, admin_user_id):
        """Atualiza um treinamento existente (apenas admin)"""
        treinamento = Treinamento.query.get_or_404(treinamento_id)
        
        # Guarda dados antigos para log
        old_data = treinamento.to_dict()
        
        if "titulo" in data: treinamento.titulo = data["titulo"]
        if "descricao" in data: treinamento.descricao = data["descricao"]
        if "categoria" in data: treinamento.categoria = data["categoria"]
        if "material_url" in data: treinamento.material_url = data["material_url"]
        if "duracao_estimada" in data: treinamento.duracao_estimada = data["duracao_estimada"]
        if "ativo" in data: treinamento.ativo = data["ativo"]
        
        db.session.commit()
        
        # Log de auditoria
        AuditService.log_action(
            ActionTypeEnum.UPDATE,
            EntityTypeEnum.TREINAMENTO,
            f"Admin {g.user.username} atualizou o treinamento ",
            entity_id=treinamento.id,
            user_id=admin_user_id,
            additional_data={"old": old_data, "new": data}
        )
        
        return treinamento

    @staticmethod
    def delete_treinamento(treinamento_id, admin_user_id):
        """Desativa (ou exclui) um treinamento (apenas admin)"""
        treinamento = Treinamento.query.get_or_404(treinamento_id)
        
        # Opção 1: Desativar (recomendado)
        treinamento.ativo = False
        action_desc = f"Admin {g.user.username} desativou o treinamento "
        action_type = ActionTypeEnum.UPDATE # Log como update se for desativação
        
        # Opção 2: Excluir (cuidado com dependências)
        # db.session.delete(treinamento)
        # action_desc = f"Admin {g.user.username} excluiu o treinamento "
        # action_type = ActionTypeEnum.DELETE
        
        db.session.commit()
        
        # Log de auditoria
        AuditService.log_action(
            action_type,
            EntityTypeEnum.TREINAMENTO,
            action_desc,
            entity_id=treinamento.id,
            user_id=admin_user_id
        )
        return True

    @staticmethod
    def get_user_status(treinamento_id, user_id):
        """Retorna o status de um usuário para um treinamento específico"""
        status = StatusUsuarioTreinamento.query.filter_by(
            usuario_id=user_id,
            treinamento_id=treinamento_id
        ).first()
        return status

    @staticmethod
    def update_user_status(treinamento_id, user_id, new_status):
        """Atualiza o status de um usuário para um treinamento (iniciar, concluir)"""
        status_entry = StatusUsuarioTreinamento.query.filter_by(
            usuario_id=user_id,
            treinamento_id=treinamento_id
        ).first()
        
        if not status_entry:
            # Se não existe, cria (caso o usuário acesse diretamente)
            status_entry = StatusUsuarioTreinamento(usuario_id=user_id, treinamento_id=treinamento_id)
            db.session.add(status_entry)
        
        old_status = status_entry.status
        
        if new_status == StatusTreinamentoEnum.EM_ANDAMENTO and status_entry.status == StatusTreinamentoEnum.NAO_INICIADO:
            status_entry.status = StatusTreinamentoEnum.EM_ANDAMENTO
            status_entry.data_inicio = datetime.datetime.utcnow()
        elif new_status == StatusTreinamentoEnum.CONCLUIDO and status_entry.status != StatusTreinamentoEnum.CONCLUIDO:
            status_entry.status = StatusTreinamentoEnum.CONCLUIDO
            status_entry.data_conclusao = datetime.datetime.utcnow()
            # Aqui poderia gerar certificado ou pontuação, se aplicável
        else:
            # Não permite transições inválidas
            return None
            
        db.session.commit()
        
        # Log de auditoria
        AuditService.log_action(
            ActionTypeEnum.UPDATE,
            EntityTypeEnum.STATUS_TREINAMENTO,
            f"Usuário {g.user.username} atualizou status do treinamento  para {new_status}",
            entity_id=status_entry.id,
            user_id=user_id,
            additional_data={"treinamento_id": treinamento_id, "old_status": old_status, "new_status": new_status}
        )
        
        return status_entry

    @staticmethod
    def get_treinamento_progress(treinamento_id):
        """Retorna o progresso de todos os usuários para um treinamento (admin)"""
        status_list = StatusUsuarioTreinamento.query.filter_by(treinamento_id=treinamento_id).all()
        return [status.to_dict() for status in status_list]

    @staticmethod
    def assign_treinamento(treinamento_id, user_ids, admin_user_id, prazo_conclusao=None):
        """Atribui um treinamento a uma lista de usuários (admin)"""
        treinamento = Treinamento.query.get_or_404(treinamento_id)
        assigned_count = 0
        already_assigned = []
        users_not_found = []
        
        if prazo_conclusao:
            try:
                prazo_conclusao = datetime.datetime.fromisoformat(prazo_conclusao)
            except ValueError:
                prazo_conclusao = None # Ignora prazo inválido

        for user_id in user_ids:
            user = User.query.get(user_id)
            if not user:
                users_not_found.append(user_id)
                continue
            
            # Verifica se já existe uma atribuição
            existing_status = StatusUsuarioTreinamento.query.filter_by(
                usuario_id=user_id,
                treinamento_id=treinamento_id
            ).first()
            
            if existing_status:
                # Atualiza o prazo se necessário
                if prazo_conclusao and existing_status.prazo_conclusao != prazo_conclusao:
                    existing_status.prazo_conclusao = prazo_conclusao
                    db.session.commit()
                already_assigned.append(user_id)
            else:
                # Cria nova atribuição
                new_status = StatusUsuarioTreinamento(
                    usuario_id=user_id,
                    treinamento_id=treinamento_id,
                    prazo_conclusao=prazo_conclusao
                )
                db.session.add(new_status)
                assigned_count += 1
        
        db.session.commit()
        
        # Log de auditoria
        AuditService.log_action(
            ActionTypeEnum.UPDATE, # Ou CREATE se preferir logar cada atribuição individualmente
            EntityTypeEnum.TREINAMENTO,
            f"Admin {g.user.username} atribuiu o treinamento  a {len(user_ids)} usuários",
            entity_id=treinamento_id,
            user_id=admin_user_id,
            additional_data={"user_ids": user_ids, "prazo": prazo_conclusao.isoformat() if prazo_conclusao else None}
        )
        
        return {
            "assigned_count": assigned_count,
            "already_assigned": already_assigned,
            "users_not_found": users_not_found
        }
    
    # --- Métodos Opcionais ---
    
    @staticmethod
    def check_training_deadlines():
        """Verifica prazos de treinamento e envia notificações (executar periodicamente)"""
        today = datetime.date.today()
        upcoming_deadlines = StatusUsuarioTreinamento.query.filter(
            StatusUsuarioTreinamento.prazo_conclusao.isnot(None),
            StatusUsuarioTreinamento.status != StatusTreinamentoEnum.CONCLUIDO,
            StatusUsuarioTreinamento.prazo_conclusao >= today
        ).all()
        
        notifications_sent = 0
        for status_entry in upcoming_deadlines:
            days_remaining = (status_entry.prazo_conclusao.date() - today).days
            
            # Lógica para enviar notificação (ex: 7 dias, 3 dias, 1 dia antes)
            if days_remaining in [1, 3, 7]:
                # Verificar se já enviou notificação recente para este prazo
                # ... (lógica similar ao NotificationService.check_deadlines)
                
                # Enviar notificação
                # NotificationService.create_notification(...)
                notifications_sent += 1
                
        return notifications_sent

    # Adicionar métodos para upload/gerenciamento de material se necessário
