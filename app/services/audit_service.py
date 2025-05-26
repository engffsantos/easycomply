# app/services/audit_service.py
from ..models.audit_log import AuditLog, ActionTypeEnum, EntityTypeEnum
from ..extensions import db
from flask import g, request
import json
import datetime

class AuditService:
    @staticmethod
    def log_action(action_type, entity_type, description, 
                  entity_id=None, user_id=None, additional_data=None):
        """
        Registra uma ação no log de auditoria
        
        Args:
            action_type (ActionTypeEnum): Tipo de ação realizada
            entity_type (EntityTypeEnum): Tipo de entidade afetada
            description (str): Descrição da ação
            entity_id (int, optional): ID da entidade afetada
            user_id (int, optional): ID do usuário que realizou a ação
            additional_data (dict, optional): Dados adicionais em formato JSON
        
        Returns:
            AuditLog: O registro de log criado
        """
        # Se user_id não for fornecido, tenta obter do contexto global
        if user_id is None and hasattr(g, 'user'):
            user_id = g.user.id
        
        # Obter IP e User Agent se disponíveis
        ip_address = request.remote_addr if request else None
        user_agent = request.user_agent.string if request and request.user_agent else None
        
        # Converter additional_data para JSON string se for um dicionário
        if additional_data and isinstance(additional_data, dict):
            additional_data = json.dumps(additional_data)
        
        # Criar o log
        log = AuditLog(
            action_type=action_type,
            entity_type=entity_type,
            entity_id=entity_id,
            description=description,
            user_id=user_id,
            ip_address=ip_address,
            user_agent=user_agent,
            additional_data=additional_data
        )
        
        db.session.add(log)
        db.session.commit()
        
        return log
    
    @staticmethod
    def get_entity_history(entity_type, entity_id, limit=100):
        """
        Obtém o histórico de ações para uma entidade específica
        
        Args:
            entity_type (EntityTypeEnum): Tipo de entidade
            entity_id (int): ID da entidade
            limit (int, optional): Limite de registros a retornar
        
        Returns:
            list: Lista de logs de auditoria para a entidade
        """
        logs = AuditLog.query.filter_by(
            entity_type=entity_type,
            entity_id=entity_id
        ).order_by(
            AuditLog.timestamp.desc()
        ).limit(limit).all()
        
        return logs
    
    @staticmethod
    def get_user_activity(user_id, limit=100):
        """
        Obtém o histórico de atividades de um usuário
        
        Args:
            user_id (int): ID do usuário
            limit (int, optional): Limite de registros a retornar
        
        Returns:
            list: Lista de logs de auditoria do usuário
        """
        logs = AuditLog.query.filter_by(
            user_id=user_id
        ).order_by(
            AuditLog.timestamp.desc()
        ).limit(limit).all()
        
        return logs
    
    @staticmethod
    def search_logs(filters=None, page=1, per_page=20):
        """
        Pesquisa logs de auditoria com filtros
        
        Args:
            filters (dict, optional): Filtros a serem aplicados
            page (int, optional): Página a ser retornada
            per_page (int, optional): Registros por página
        
        Returns:
            tuple: (logs, total, pages)
        """
        query = AuditLog.query
        
        if filters:
            if 'user_id' in filters and filters['user_id']:
                query = query.filter_by(user_id=filters['user_id'])
            
            if 'action_type' in filters and filters['action_type']:
                query = query.filter_by(action_type=filters['action_type'])
            
            if 'entity_type' in filters and filters['entity_type']:
                query = query.filter_by(entity_type=filters['entity_type'])
            
            if 'entity_id' in filters and filters['entity_id']:
                query = query.filter_by(entity_id=filters['entity_id'])
            
            if 'start_date' in filters and filters['start_date']:
                start_date = datetime.datetime.strptime(filters['start_date'], '%Y-%m-%d')
                query = query.filter(AuditLog.timestamp >= start_date)
            
            if 'end_date' in filters and filters['end_date']:
                end_date = datetime.datetime.strptime(filters['end_date'], '%Y-%m-%d')
                end_date = end_date.replace(hour=23, minute=59, second=59)
                query = query.filter(AuditLog.timestamp <= end_date)
            
            if 'search' in filters and filters['search']:
                search = f"%{filters['search']}%"
                query = query.filter(AuditLog.description.ilike(search))
        
        # Ordenar por timestamp (mais recentes primeiro)
        query = query.order_by(AuditLog.timestamp.desc())
        
        # Paginação
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        
        return pagination.items, pagination.total, pagination.pages
    
    @staticmethod
    def export_logs(filters=None, format='csv'):
        """
        Exporta logs de auditoria para CSV ou JSON
        
        Args:
            filters (dict, optional): Filtros a serem aplicados
            format (str, optional): Formato de exportação ('csv' ou 'json')
        
        Returns:
            str: Conteúdo do arquivo exportado
        """
        query = AuditLog.query
        
        if filters:
            # Aplicar os mesmos filtros da função search_logs
            # ...
            pass
        
        # Ordenar por timestamp (mais recentes primeiro)
        logs = query.order_by(AuditLog.timestamp.desc()).all()
        
        if format == 'json':
            # Exportar para JSON
            return json.dumps([log.to_dict() for log in logs], indent=2)
        else:
            # Exportar para CSV
            import csv
            import io
            
            output = io.StringIO()
            writer = csv.writer(output)
            
            # Cabeçalho
            writer.writerow([
                'ID', 'Usuário', 'Ação', 'Entidade', 'ID Entidade', 
                'Descrição', 'IP', 'Data/Hora', 'Dados Adicionais'
            ])
            
            # Dados
            for log in logs:
                writer.writerow([
                    log.id,
                    log.user.username if log.user else 'Sistema',
                    log.action_type,
                    log.entity_type,
                    log.entity_id or '',
                    log.description,
                    log.ip_address or '',
                    log.timestamp.strftime('%d/%m/%Y %H:%M:%S'),
                    log.additional_data or ''
                ])
            
            return output.getvalue()
