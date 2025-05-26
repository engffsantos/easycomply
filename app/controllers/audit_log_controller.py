# app/controllers/audit_log_controller.py
from flask import Blueprint, request, jsonify, g, current_app, send_file
from ..models.audit_log import AuditLog, ActionTypeEnum, EntityTypeEnum
from ..services.audit_service import AuditService
from ..extensions import db
from sqlalchemy import desc
import datetime
import io

audit_log_bp = Blueprint('audit_log', __name__, url_prefix='/api/audit-logs')

@audit_log_bp.route('/', methods=['GET'])
def get_audit_logs():
    """Retorna logs de auditoria com opções de filtro e paginação"""
    # Verificar se o usuário tem permissão (admin)
    if not hasattr(g, 'user') or not g.user.is_admin:
        return jsonify({
            'success': False,
            'message': 'Acesso não autorizado'
        }), 403
    
    # Obter parâmetros de filtro
    filters = {}
    
    if 'user_id' in request.args:
        filters['user_id'] = request.args.get('user_id', type=int)
    
    if 'action_type' in request.args:
        filters['action_type'] = request.args.get('action_type')
    
    if 'entity_type' in request.args:
        filters['entity_type'] = request.args.get('entity_type')
    
    if 'entity_id' in request.args:
        filters['entity_id'] = request.args.get('entity_id', type=int)
    
    if 'start_date' in request.args:
        filters['start_date'] = request.args.get('start_date')
    
    if 'end_date' in request.args:
        filters['end_date'] = request.args.get('end_date')
    
    if 'search' in request.args:
        filters['search'] = request.args.get('search')
    
    # Paginação
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    
    # Buscar logs
    logs, total, pages = AuditService.search_logs(filters, page, per_page)
    
    # Registrar a ação de visualização de logs
    AuditService.log_action(
        ActionTypeEnum.READ,
        EntityTypeEnum.SYSTEM,
        f"Usuário {g.user.username} visualizou logs de auditoria",
        user_id=g.user.id,
        additional_data={"filters": filters, "page": page, "per_page": per_page}
    )
    
    return jsonify({
        'success': True,
        'data': {
            'logs': [log.to_dict() for log in logs],
            'total': total,
            'pages': pages,
            'current_page': page
        }
    }), 200

@audit_log_bp.route('/<int:log_id>', methods=['GET'])
def get_audit_log(log_id):
    """Retorna detalhes de um log específico"""
    # Verificar se o usuário tem permissão (admin)
    if not hasattr(g, 'user') or not g.user.is_admin:
        return jsonify({
            'success': False,
            'message': 'Acesso não autorizado'
        }), 403
    
    log = AuditLog.query.get_or_404(log_id)
    
    # Registrar a ação de visualização de log específico
    AuditService.log_action(
        ActionTypeEnum.READ,
        EntityTypeEnum.SYSTEM,
        f"Usuário {g.user.username} visualizou log de auditoria #{log_id}",
        entity_id=log_id,
        user_id=g.user.id
    )
    
    return jsonify({
        'success': True,
        'data': log.to_dict()
    }), 200

@audit_log_bp.route('/entity/<string:entity_type>/<int:entity_id>', methods=['GET'])
def get_entity_history(entity_type, entity_id):
    """Retorna histórico de logs para uma entidade específica"""
    # Verificar se o usuário tem permissão (admin)
    if not hasattr(g, 'user') or not g.user.is_admin:
        return jsonify({
            'success': False,
            'message': 'Acesso não autorizado'
        }), 403
    
    # Validar entity_type
    try:
        entity_type_enum = EntityTypeEnum(entity_type)
    except ValueError:
        return jsonify({
            'success': False,
            'message': f'Tipo de entidade inválido: {entity_type}'
        }), 400
    
    # Buscar histórico
    logs = AuditService.get_entity_history(entity_type_enum, entity_id)
    
    # Registrar a ação
    AuditService.log_action(
        ActionTypeEnum.READ,
        EntityTypeEnum.SYSTEM,
        f"Usuário {g.user.username} visualizou histórico de {entity_type} #{entity_id}",
        user_id=g.user.id,
        additional_data={"entity_type": entity_type, "entity_id": entity_id}
    )
    
    return jsonify({
        'success': True,
        'data': {
            'logs': [log.to_dict() for log in logs],
            'entity_type': entity_type,
            'entity_id': entity_id
        }
    }), 200

@audit_log_bp.route('/user/<int:user_id>', methods=['GET'])
def get_user_activity(user_id):
    """Retorna histórico de atividades de um usuário"""
    # Verificar se o usuário tem permissão (admin ou próprio usuário)
    if not hasattr(g, 'user') or (not g.user.is_admin and g.user.id != user_id):
        return jsonify({
            'success': False,
            'message': 'Acesso não autorizado'
        }), 403
    
    # Buscar atividades
    logs = AuditService.get_user_activity(user_id)
    
    # Registrar a ação
    AuditService.log_action(
        ActionTypeEnum.READ,
        EntityTypeEnum.USER,
        f"Usuário {g.user.username} visualizou atividades do usuário #{user_id}",
        entity_id=user_id,
        user_id=g.user.id
    )
    
    return jsonify({
        'success': True,
        'data': {
            'logs': [log.to_dict() for log in logs],
            'user_id': user_id
        }
    }), 200

@audit_log_bp.route('/export', methods=['GET'])
def export_logs():
    """Exporta logs de auditoria para CSV ou JSON"""
    # Verificar se o usuário tem permissão (admin)
    if not hasattr(g, 'user') or not g.user.is_admin:
        return jsonify({
            'success': False,
            'message': 'Acesso não autorizado'
        }), 403
    
    # Obter parâmetros de filtro
    filters = {}
    
    if 'user_id' in request.args:
        filters['user_id'] = request.args.get('user_id', type=int)
    
    if 'action_type' in request.args:
        filters['action_type'] = request.args.get('action_type')
    
    if 'entity_type' in request.args:
        filters['entity_type'] = request.args.get('entity_type')
    
    if 'entity_id' in request.args:
        filters['entity_id'] = request.args.get('entity_id', type=int)
    
    if 'start_date' in request.args:
        filters['start_date'] = request.args.get('start_date')
    
    if 'end_date' in request.args:
        filters['end_date'] = request.args.get('end_date')
    
    if 'search' in request.args:
        filters['search'] = request.args.get('search')
    
    # Formato de exportação
    format = request.args.get('format', 'csv')
    if format not in ['csv', 'json']:
        format = 'csv'
    
    # Exportar logs
    content = AuditService.export_logs(filters, format)
    
    # Criar arquivo em memória
    buffer = io.BytesIO()
    buffer.write(content.encode('utf-8'))
    buffer.seek(0)
    
    # Nome do arquivo
    timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = f"audit_logs_{timestamp}.{format}"
    
    # Registrar a ação de exportação
    AuditService.log_action(
        ActionTypeEnum.EXPORT,
        EntityTypeEnum.SYSTEM,
        f"Usuário {g.user.username} exportou logs de auditoria em formato {format}",
        user_id=g.user.id,
        additional_data={"filters": filters, "format": format}
    )
    
    # Determinar o tipo MIME
    mimetype = 'text/csv' if format == 'csv' else 'application/json'
    
    return send_file(
        buffer,
        as_attachment=True,
        download_name=filename,
        mimetype=mimetype
    )

@audit_log_bp.route('/statistics', methods=['GET'])
def get_statistics():
    """Retorna estatísticas de atividades (contagens por tipo, usuário, etc.)"""
    # Verificar se o usuário tem permissão (admin)
    if not hasattr(g, 'user') or not g.user.is_admin:
        return jsonify({
            'success': False,
            'message': 'Acesso não autorizado'
        }), 403
    
    # Estatísticas por tipo de ação
    action_stats = db.session.query(
        AuditLog.action_type, 
        db.func.count(AuditLog.id)
    ).group_by(AuditLog.action_type).all()
    
    action_counts = {action: count for action, count in action_stats}
    
    # Estatísticas por tipo de entidade
    entity_stats = db.session.query(
        AuditLog.entity_type, 
        db.func.count(AuditLog.id)
    ).group_by(AuditLog.entity_type).all()
    
    entity_counts = {entity: count for entity, count in entity_stats}
    
    # Estatísticas por usuário (top 10)
    user_stats = db.session.query(
        AuditLog.user_id, 
        db.func.count(AuditLog.id)
    ).filter(AuditLog.user_id.isnot(None)).group_by(AuditLog.user_id).order_by(
        db.func.count(AuditLog.id).desc()
    ).limit(10).all()
    
    user_counts = {user_id: count for user_id, count in user_stats}
    
    # Estatísticas por período (últimos 7 dias)
    today = datetime.datetime.now().date()
    period_stats = []
    
    for i in range(7):
        date = today - datetime.timedelta(days=i)
        start_datetime = datetime.datetime.combine(date, datetime.time.min)
        end_datetime = datetime.datetime.combine(date, datetime.time.max)
        
        count = AuditLog.query.filter(
            AuditLog.timestamp >= start_datetime,
            AuditLog.timestamp <= end_datetime
        ).count()
        
        period_stats.append({
            'date': date.strftime('%Y-%m-%d'),
            'count': count
        })
    
    # Registrar a ação
    AuditService.log_action(
        ActionTypeEnum.READ,
        EntityTypeEnum.SYSTEM,
        f"Usuário {g.user.username} visualizou estatísticas de logs de auditoria",
        user_id=g.user.id
    )
    
    return jsonify({
        'success': True,
        'data': {
            'action_counts': action_counts,
            'entity_counts': entity_counts,
            'user_counts': user_counts,
            'period_stats': period_stats
        }
    }), 200
