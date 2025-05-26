# app/controllers/notification_controller.py
from flask import Blueprint, request, jsonify, g, current_app
from ..models.notification import Notification, NotificationStatusEnum, NotificationTypeEnum, NotificationPriorityEnum
from ..models.checklist_item import ChecklistItem, StatusEnum, RiscoEnum
from ..extensions import db
from sqlalchemy import desc
import datetime

notification_bp = Blueprint('notification', __name__, url_prefix='/api/notifications')

@notification_bp.route('/', methods=['GET'])
def get_notifications():
    """Retorna as notificações do usuário atual com opções de filtro"""
    # Obter parâmetros de filtro
    notification_type = request.args.get('type')
    status = request.args.get('status')
    
    # Iniciar query
    query = Notification.query.filter_by(user_id=g.user.id)
    
    # Aplicar filtros
    if notification_type:
        query = query.filter_by(notification_type=notification_type)
    if status:
        query = query.filter_by(status=status)
    
    # Ordenar por data de criação (mais recentes primeiro)
    query = query.order_by(desc(Notification.created_at))
    
    # Paginação
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    
    notifications = pagination.items
    
    return jsonify({
        'success': True,
        'data': {
            'notifications': [notification.to_dict() for notification in notifications],
            'total': pagination.total,
            'pages': pagination.pages,
            'current_page': page
        }
    }), 200

@notification_bp.route('/count', methods=['GET'])
def get_notification_count():
    """Retorna a contagem de notificações não lidas do usuário atual"""
    count = Notification.query.filter_by(
        user_id=g.user.id, 
        status=NotificationStatusEnum.NAO_LIDA
    ).count()
    
    return jsonify({
        'success': True,
        'data': {
            'count': count
        }
    }), 200

@notification_bp.route('/<int:notification_id>/read', methods=['PUT'])
def mark_as_read(notification_id):
    """Marca uma notificação como lida"""
    notification = Notification.query.filter_by(
        id=notification_id, 
        user_id=g.user.id
    ).first_or_404()
    
    notification.mark_as_read()
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Notificação marcada como lida',
        'data': notification.to_dict()
    }), 200

@notification_bp.route('/<int:notification_id>/unread', methods=['PUT'])
def mark_as_unread(notification_id):
    """Marca uma notificação como não lida"""
    notification = Notification.query.filter_by(
        id=notification_id, 
        user_id=g.user.id
    ).first_or_404()
    
    notification.status = NotificationStatusEnum.NAO_LIDA
    notification.read_at = None
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Notificação marcada como não lida',
        'data': notification.to_dict()
    }), 200

@notification_bp.route('/<int:notification_id>/archive', methods=['PUT'])
def archive_notification(notification_id):
    """Arquiva uma notificação"""
    notification = Notification.query.filter_by(
        id=notification_id, 
        user_id=g.user.id
    ).first_or_404()
    
    notification.archive()
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Notificação arquivada',
        'data': notification.to_dict()
    }), 200

@notification_bp.route('/read-all', methods=['POST'])
def mark_all_as_read():
    """Marca todas as notificações não lidas do usuário como lidas"""
    notifications = Notification.query.filter_by(
        user_id=g.user.id,
        status=NotificationStatusEnum.NAO_LIDA
    ).all()
    
    now = datetime.datetime.utcnow()
    for notification in notifications:
        notification.status = NotificationStatusEnum.LIDA
        notification.read_at = now
    
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': f'{len(notifications)} notificações marcadas como lidas'
    }), 200

@notification_bp.route('/check-deadlines', methods=['GET'])
def check_deadlines():
    """Verifica itens próximos do vencimento e gera notificações se necessário"""
    # Esta função será chamada sob demanda quando o usuário acessar o dashboard ou a página de checklists
    
    # Obter todos os itens de checklist pendentes ou em andamento que têm prazo definido
    items_with_deadline = ChecklistItem.query.filter(
        ChecklistItem.status.in_([StatusEnum.PENDENTE, StatusEnum.EM_ANDAMENTO]),
        ChecklistItem.deadline.isnot(None)
    ).all()
    
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
    
    return jsonify({
        'success': True,
        'message': f'{notifications_created} notificações criadas'
    }), 200
