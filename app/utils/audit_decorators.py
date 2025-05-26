# app/utils/audit_decorators.py
from functools import wraps
from flask import g, request
from ..services.audit_service import AuditService
from ..models.audit_log import ActionTypeEnum, EntityTypeEnum
import json

def audit_log(action_type, entity_type, description_template):
    """
    Decorador para registrar ações em logs de auditoria
    
    Args:
        action_type (ActionTypeEnum): Tipo de ação realizada
        entity_type (EntityTypeEnum): Tipo de entidade afetada
        description_template (str): Template de descrição da ação
            Pode conter placeholders como {id} que serão substituídos por valores de kwargs
    
    Returns:
        function: Decorador configurado
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Executar a função original
            result = f(*args, **kwargs)
            
            try:
                # Extrair entity_id dos kwargs ou do resultado
                entity_id = kwargs.get('id') or kwargs.get('entity_id')
                
                # Se não encontrou nos kwargs, tenta extrair do resultado
                if not entity_id and isinstance(result, tuple) and len(result) > 0:
                    # Assumindo que o primeiro item do resultado é um dict com 'data'
                    if isinstance(result[0], dict) and 'data' in result[0]:
                        data = result[0]['data']
                        if isinstance(data, dict) and 'id' in data:
                            entity_id = data['id']
                
                # Formatar a descrição substituindo placeholders
                description = description_template
                for key, value in kwargs.items():
                    if f"{{{key}}}" in description:
                        description = description.replace(f"{{{key}}}", str(value))
                
                # Obter user_id do contexto global
                user_id = g.user.id if hasattr(g, 'user') else None
                
                # Obter IP e User Agent
                ip_address = request.remote_addr if request else None
                user_agent = request.user_agent.string if request and request.user_agent else None
                
                # Registrar a ação
                AuditService.log_action(
                    action_type=action_type,
                    entity_type=entity_type,
                    entity_id=entity_id,
                    description=description,
                    user_id=user_id,
                    additional_data=json.dumps(kwargs) if kwargs else None
                )
            except Exception as e:
                # Não deve interromper a execução normal se o logging falhar
                print(f"Erro ao registrar log de auditoria: {str(e)}")
            
            return result
        return decorated_function
    return decorator

# Decoradores específicos para ações comuns

def audit_create(entity_type, description_template):
    """Decorador para registrar ações de criação"""
    return audit_log(ActionTypeEnum.CREATE, entity_type, description_template)

def audit_read(entity_type, description_template):
    """Decorador para registrar ações de leitura"""
    return audit_log(ActionTypeEnum.READ, entity_type, description_template)

def audit_update(entity_type, description_template):
    """Decorador para registrar ações de atualização"""
    return audit_log(ActionTypeEnum.UPDATE, entity_type, description_template)

def audit_delete(entity_type, description_template):
    """Decorador para registrar ações de exclusão"""
    return audit_log(ActionTypeEnum.DELETE, entity_type, description_template)

def audit_login(description_template="Usuário realizou login"):
    """Decorador para registrar ações de login"""
    return audit_log(ActionTypeEnum.LOGIN, EntityTypeEnum.USER, description_template)

def audit_logout(description_template="Usuário realizou logout"):
    """Decorador para registrar ações de logout"""
    return audit_log(ActionTypeEnum.LOGOUT, EntityTypeEnum.USER, description_template)

def audit_export(entity_type, description_template):
    """Decorador para registrar ações de exportação"""
    return audit_log(ActionTypeEnum.EXPORT, entity_type, description_template)

def audit_generate(entity_type, description_template):
    """Decorador para registrar ações de geração"""
    return audit_log(ActionTypeEnum.GENERATE, entity_type, description_template)

def audit_upload(entity_type, description_template):
    """Decorador para registrar ações de upload"""
    return audit_log(ActionTypeEnum.UPLOAD, entity_type, description_template)

def audit_download(entity_type, description_template):
    """Decorador para registrar ações de download"""
    return audit_log(ActionTypeEnum.DOWNLOAD, entity_type, description_template)
