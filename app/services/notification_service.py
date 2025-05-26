# app/services/notification_service.py
from ..models.notification import Notification, NotificationTypeEnum, NotificationPriorityEnum, NotificationStatusEnum
from ..models.checklist_item import ChecklistItem, StatusEnum, RiscoEnum
from ..extensions import db
import datetime

class NotificationService:
    @staticmethod
    def create_notification(user_id, title, message, notification_type, 
                           priority=NotificationPriorityEnum.MEDIA, 
                           reference_type=None, reference_id=None):
        """
        Cria uma nova notificação para o usuário
        """
        notification = Notification(
            user_id=user_id,
            title=title,
            message=message,
            notification_type=notification_type,
            priority=priority,
            reference_type=reference_type,
            reference_id=reference_id
        )
        
        db.session.add(notification)
        db.session.commit()
        
        return notification
    
    @staticmethod
    def mark_as_read(notification_id, user_id):
        """
        Marca uma notificação como lida
        """
        notification = Notification.query.filter_by(
            id=notification_id, 
            user_id=user_id
        ).first()
        
        if notification:
            notification.mark_as_read()
            db.session.commit()
            return True
        
        return False
    
    @staticmethod
    def mark_all_as_read(user_id):
        """
        Marca todas as notificações não lidas do usuário como lidas
        """
        notifications = Notification.query.filter_by(
            user_id=user_id,
            status=NotificationStatusEnum.NAO_LIDA
        ).all()
        
        now = datetime.datetime.utcnow()
        for notification in notifications:
            notification.status = NotificationStatusEnum.LIDA
            notification.read_at = now
        
        db.session.commit()
        return len(notifications)
    
    @staticmethod
    def archive_notification(notification_id, user_id):
        """
        Arquiva uma notificação
        """
        notification = Notification.query.filter_by(
            id=notification_id, 
            user_id=user_id
        ).first()
        
        if notification:
            notification.archive()
            db.session.commit()
            return True
        
        return False
    
    @staticmethod
    def check_deadlines(user_id=None):
        """
        Verifica itens próximos do vencimento e gera notificações
        Se user_id for fornecido, verifica apenas para esse usuário
        """
        # Obter todos os itens de checklist pendentes ou em andamento que têm prazo definido
        query = ChecklistItem.query.filter(
            ChecklistItem.status.in_([StatusEnum.PENDENTE, StatusEnum.EM_ANDAMENTO]),
            ChecklistItem.deadline.isnot(None)
        )
        
        # Se user_id for fornecido, filtra por checklists desse usuário
        if user_id:
            query = query.join(ChecklistItem.checklist).filter_by(user_id=user_id)
            
        items_with_deadline = query.all()
        
        today = datetime.datetime.now().date()
        notifications_created = 0
        
        for item in items_with_deadline:
            # Verificar se o item tem um prazo e se está próximo do vencimento
            if not item.deadline:
                continue
                
            deadline_date = item.deadline.date() if isinstance(item.deadline, datetime.datetime) else item.deadline
            days_remaining = (deadline_date - today).days
            
            # Definir prioridade com base no risco do item
            priority = NotificationPriorityEnum.MEDIA
            if item.risco == RiscoEnum.ALTO:
                priority = NotificationPriorityEnum.ALTA
            elif item.risco == RiscoEnum.BAIXO:
                priority = NotificationPriorityEnum.BAIXA
            
            # Verificar se já existe uma notificação recente para este item
            existing_notification = Notification.query.filter_by(
                reference_type="checklist_item",
                reference_id=item.id,
                notification_type=NotificationTypeEnum.VENCIMENTO_PROXIMO
            ).filter(
                Notification.created_at > datetime.datetime.utcnow() - datetime.timedelta(days=1)
            ).first()
            
            if existing_notification:
                continue
            
            # Gerar notificações com base na proximidade do prazo
            if days_remaining <= 1:
                # Prazo vence hoje ou amanhã
                notification = Notification(
                    user_id=item.checklist.user_id,
                    title=f"URGENTE: Item vence em {days_remaining+1} dia(s)",
                    message=f"O item '{item.nome}' do checklist '{item.checklist.nome}' vence em {days_remaining+1} dia(s).",
                    notification_type=NotificationTypeEnum.VENCIMENTO_PROXIMO,
                    priority=NotificationPriorityEnum.ALTA,  # Sempre alta quando falta 1 dia ou menos
                    reference_type="checklist_item",
                    reference_id=item.id
                )
                db.session.add(notification)
                notifications_created += 1
                
            elif days_remaining <= 3:
                # Prazo vence em 2-3 dias
                notification = Notification(
                    user_id=item.checklist.user_id,
                    title=f"Item vence em {days_remaining} dias",
                    message=f"O item '{item.nome}' do checklist '{item.checklist.nome}' vence em {days_remaining} dias.",
                    notification_type=NotificationTypeEnum.VENCIMENTO_PROXIMO,
                    priority=priority,
                    reference_type="checklist_item",
                    reference_id=item.id
                )
                db.session.add(notification)
                notifications_created += 1
                
            elif days_remaining <= 7:
                # Prazo vence em 4-7 dias
                notification = Notification(
                    user_id=item.checklist.user_id,
                    title=f"Item vence em {days_remaining} dias",
                    message=f"O item '{item.nome}' do checklist '{item.checklist.nome}' vence em {days_remaining} dias.",
                    notification_type=NotificationTypeEnum.VENCIMENTO_PROXIMO,
                    priority=NotificationPriorityEnum.BAIXA,  # Baixa prioridade para prazos mais distantes
                    reference_type="checklist_item",
                    reference_id=item.id
                )
                db.session.add(notification)
                notifications_created += 1
        
        db.session.commit()
        return notifications_created
    
    @staticmethod
    def notify_item_updated(item, user_id):
        """
        Cria notificação quando um item de checklist é atualizado
        """
        notification = Notification(
            user_id=user_id,
            title=f"Item atualizado: {item.nome}",
            message=f"O item '{item.nome}' do checklist '{item.checklist.nome}' foi atualizado.",
            notification_type=NotificationTypeEnum.ITEM_ATUALIZADO,
            priority=NotificationPriorityEnum.MEDIA,
            reference_type="checklist_item",
            reference_id=item.id
        )
        db.session.add(notification)
        db.session.commit()
        return notification
    
    @staticmethod
    def notify_evidencia_added(evidencia, user_id):
        """
        Cria notificação quando uma evidência é adicionada
        """
        notification = Notification(
            user_id=user_id,
            title="Nova evidência adicionada",
            message=f"Uma nova evidência foi adicionada ao item '{evidencia.item.nome}'.",
            notification_type=NotificationTypeEnum.EVIDENCIA_ADICIONADA,
            priority=NotificationPriorityEnum.BAIXA,
            reference_type="evidencia",
            reference_id=evidencia.id
        )
        db.session.add(notification)
        db.session.commit()
        return notification
    
    @staticmethod
    def notify_documento_gerado(documento, user_id):
        """
        Cria notificação quando um documento é gerado
        """
        notification = Notification(
            user_id=user_id,
            title="Documento gerado",
            message=f"Um novo documento '{documento.nome}' foi gerado.",
            notification_type=NotificationTypeEnum.DOCUMENTO_GERADO,
            priority=NotificationPriorityEnum.MEDIA,
            reference_type="documento",
            reference_id=documento.id
        )
        db.session.add(notification)
        db.session.commit()
        return notification
