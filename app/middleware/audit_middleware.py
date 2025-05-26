# app/middleware/audit_middleware.py
from flask import request, g
from ..services.audit_service import AuditService
from ..models.audit_log import ActionTypeEnum, EntityTypeEnum
import json
import re

# Lista de rotas que devem ser monitoradas automaticamente
MONITORED_ROUTES = [
    # Rotas sensíveis que devem ser sempre logadas
    {'method': 'POST', 'pattern': r'/api/auth/login', 'action': ActionTypeEnum.LOGIN, 'entity': EntityTypeEnum.USER},
    {'method': 'POST', 'pattern': r'/api/auth/logout', 'action': ActionTypeEnum.LOGOUT, 'entity': EntityTypeEnum.USER},
    {'method': 'POST', 'pattern': r'/api/users', 'action': ActionTypeEnum.CREATE, 'entity': EntityTypeEnum.USER},
    {'method': 'PUT', 'pattern': r'/api/users/\d+', 'action': ActionTypeEnum.UPDATE, 'entity': EntityTypeEnum.USER},
    {'method': 'DELETE', 'pattern': r'/api/users/\d+', 'action': ActionTypeEnum.DELETE, 'entity': EntityTypeEnum.USER},
    
    # Rotas de documentos
    {'method': 'POST', 'pattern': r'/api/documentos', 'action': ActionTypeEnum.CREATE, 'entity': EntityTypeEnum.DOCUMENTO},
    {'method': 'PUT', 'pattern': r'/api/documentos/\d+', 'action': ActionTypeEnum.UPDATE, 'entity': EntityTypeEnum.DOCUMENTO},
    {'method': 'DELETE', 'pattern': r'/api/documentos/\d+', 'action': ActionTypeEnum.DELETE, 'entity': EntityTypeEnum.DOCUMENTO},
    {'method': 'GET', 'pattern': r'/api/documentos/download/\d+', 'action': ActionTypeEnum.DOWNLOAD, 'entity': EntityTypeEnum.DOCUMENTO},
    {'method': 'POST', 'pattern': r'/api/documentos/gerar', 'action': ActionTypeEnum.GENERATE, 'entity': EntityTypeEnum.DOCUMENTO},
    
    # Rotas de checklists
    {'method': 'POST', 'pattern': r'/api/checklists', 'action': ActionTypeEnum.CREATE, 'entity': EntityTypeEnum.CHECKLIST},
    {'method': 'PUT', 'pattern': r'/api/checklists/\d+', 'action': ActionTypeEnum.UPDATE, 'entity': EntityTypeEnum.CHECKLIST},
    {'method': 'DELETE', 'pattern': r'/api/checklists/\d+', 'action': ActionTypeEnum.DELETE, 'entity': EntityTypeEnum.CHECKLIST},
    
    # Rotas de itens de checklist
    {'method': 'POST', 'pattern': r'/api/checklist-items', 'action': ActionTypeEnum.CREATE, 'entity': EntityTypeEnum.CHECKLIST_ITEM},
    {'method': 'PUT', 'pattern': r'/api/checklist-items/\d+', 'action': ActionTypeEnum.UPDATE, 'entity': EntityTypeEnum.CHECKLIST_ITEM},
    {'method': 'DELETE', 'pattern': r'/api/checklist-items/\d+', 'action': ActionTypeEnum.DELETE, 'entity': EntityTypeEnum.CHECKLIST_ITEM},
    
    # Rotas de evidências
    {'method': 'POST', 'pattern': r'/api/evidencias', 'action': ActionTypeEnum.UPLOAD, 'entity': EntityTypeEnum.EVIDENCIA},
    {'method': 'DELETE', 'pattern': r'/api/evidencias/\d+', 'action': ActionTypeEnum.DELETE, 'entity': EntityTypeEnum.EVIDENCIA},
    {'method': 'GET', 'pattern': r'/api/evidencias/download/\d+', 'action': ActionTypeEnum.DOWNLOAD, 'entity': EntityTypeEnum.EVIDENCIA},
]

def log_request():
    """
    Middleware executado antes de cada requisição para registrar ações automaticamente
    """
    # Ignorar requisições para rotas estáticas ou de assets
    if request.path.startswith('/static/') or request.path.startswith('/assets/'):
        return
    
    # Verificar se a rota atual deve ser monitorada
    for route in MONITORED_ROUTES:
        if request.method == route['method'] and re.match(route['pattern'], request.path):
            try:
                # Extrair ID da entidade da URL, se disponível
                entity_id = None
                match = re.search(r'/(\d+)', request.path)
                if match:
                    entity_id = int(match.group(1))
                
                # Preparar descrição da ação
                action_type = route['action']
                entity_type = route['entity']
                
                # Descrição padrão baseada no tipo de ação e entidade
                description = f"Requisição {action_type} para {entity_type}"
                
                # Descrições específicas para ações comuns
                if action_type == ActionTypeEnum.LOGIN:
                    description = "Tentativa de login"
                elif action_type == ActionTypeEnum.LOGOUT:
                    description = "Logout do sistema"
                elif action_type == ActionTypeEnum.CREATE:
                    description = f"Criação de {entity_type}"
                elif action_type == ActionTypeEnum.UPDATE:
                    description = f"Atualização de {entity_type} #{entity_id}"
                elif action_type == ActionTypeEnum.DELETE:
                    description = f"Exclusão de {entity_type} #{entity_id}"
                elif action_type == ActionTypeEnum.DOWNLOAD:
                    description = f"Download de {entity_type} #{entity_id}"
                elif action_type == ActionTypeEnum.UPLOAD:
                    description = f"Upload para {entity_type}"
                elif action_type == ActionTypeEnum.GENERATE:
                    description = f"Geração de {entity_type}"
                
                # Obter dados adicionais do corpo da requisição (para POST/PUT)
                additional_data = None
                if request.is_json and (request.method == 'POST' or request.method == 'PUT'):
                    # Copiar dados para não modificar a requisição original
                    data = request.get_json(silent=True)
                    if data:
                        # Remover campos sensíveis
                        if isinstance(data, dict):
                            data_copy = data.copy()
                            for field in ['password', 'senha', 'token', 'secret']:
                                if field in data_copy:
                                    data_copy[field] = '******'
                            additional_data = json.dumps(data_copy)
                
                # Registrar a ação
                user_id = g.user.id if hasattr(g, 'user') else None
                
                AuditService.log_action(
                    action_type=action_type,
                    entity_type=entity_type,
                    entity_id=entity_id,
                    description=description,
                    user_id=user_id,
                    additional_data=additional_data
                )
            except Exception as e:
                # Não deve interromper a execução normal se o logging falhar
                print(f"Erro ao registrar log de auditoria no middleware: {str(e)}")
                
    # Continuar com a requisição normalmente
    return None

def log_response(response):
    """
    Middleware executado após cada resposta para registrar resultados de ações
    """
    # Implementação futura: registrar resultados de ações específicas
    # Por exemplo, registrar falhas de login, erros de servidor, etc.
    
    return response

def setup_audit_middleware(app):
    """
    Configura o middleware de auditoria na aplicação Flask
    """
    app.before_request(log_request)
    app.after_request(log_response)
