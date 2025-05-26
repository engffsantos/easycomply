# app/controllers/treinamento_controller.py
from flask import Blueprint, request, jsonify, g
from ..models.treinamento import Treinamento
from ..models.status_usuario_treinamento import StatusUsuarioTreinamento, StatusTreinamentoEnum
from ..services.treinamento_service import TreinamentoService
from ..extensions import db
from ..utils.audit_decorators import audit_create, audit_update, audit_delete, audit_read # Importar decoradores
from ..models.audit_log import EntityTypeEnum # Importar Enum para logs

treinamento_bp = Blueprint("treinamento", __name__, url_prefix="/api/treinamentos")

# --- Funções Auxiliares de Permissão ---
def require_admin():
    if not hasattr(g, "user") or not g.user.is_admin:
        return jsonify({"success": False, "message": "Acesso restrito a administradores"}), 403
    return None

def get_current_user_id():
    if not hasattr(g, "user"):
        return None
    return g.user.id

# --- Rotas --- 

@treinamento_bp.route("/", methods=["GET"])
@audit_read(EntityTypeEnum.TREINAMENTO, "Usuário {g.user.username} listou treinamentos")
def get_treinamentos():
    """Lista treinamentos ativos com status do usuário logado"""
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({"success": False, "message": "Usuário não autenticado"}), 401
        
    filters = {
        "categoria": request.args.get("categoria")
    }
    
    treinamentos = TreinamentoService.get_all_treinamentos(user_id, filters)
    return jsonify({"success": True, "data": treinamentos}), 200

@treinamento_bp.route("/", methods=["POST"])
# @audit_create(EntityTypeEnum.TREINAMENTO, "Admin {g.user.username} criou o treinamento {data[titulo]}") # Log feito no service
def create_treinamento():
    """Cria um novo treinamento (Admin)"""
    admin_required = require_admin()
    if admin_required: return admin_required
    
    data = request.json
    if not data or not data.get("titulo"):
        return jsonify({"success": False, "message": "Título do treinamento é obrigatório"}), 400
        
    treinamento = TreinamentoService.create_treinamento(data, g.user.id)
    return jsonify({"success": True, "message": "Treinamento criado com sucesso", "data": treinamento.to_dict()}), 201

@treinamento_bp.route("/<int:treinamento_id>", methods=["GET"])
@audit_read(EntityTypeEnum.TREINAMENTO, "Usuário {g.user.username} visualizou o treinamento #{treinamento_id}")
def get_treinamento(treinamento_id):
    """Obtém detalhes de um treinamento com status do usuário logado"""
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({"success": False, "message": "Usuário não autenticado"}), 401
        
    treinamento_dict = TreinamentoService.get_treinamento_by_id(treinamento_id, user_id)
    return jsonify({"success": True, "data": treinamento_dict}), 200

@treinamento_bp.route("/<int:treinamento_id>", methods=["PUT"])
# @audit_update(EntityTypeEnum.TREINAMENTO, "Admin {g.user.username} atualizou o treinamento #{treinamento_id}") # Log feito no service
def update_treinamento(treinamento_id):
    """Atualiza um treinamento existente (Admin)"""
    admin_required = require_admin()
    if admin_required: return admin_required
    
    data = request.json
    treinamento = TreinamentoService.update_treinamento(treinamento_id, data, g.user.id)
    return jsonify({"success": True, "message": "Treinamento atualizado com sucesso", "data": treinamento.to_dict()}), 200

@treinamento_bp.route("/<int:treinamento_id>", methods=["DELETE"])
# @audit_delete(EntityTypeEnum.TREINAMENTO, "Admin {g.user.username} desativou/excluiu o treinamento #{treinamento_id}") # Log feito no service
def delete_treinamento(treinamento_id):
    """Desativa/Exclui um treinamento (Admin)"""
    admin_required = require_admin()
    if admin_required: return admin_required
    
    success = TreinamentoService.delete_treinamento(treinamento_id, g.user.id)
    if success:
        return jsonify({"success": True, "message": "Treinamento desativado/excluído com sucesso"}), 200
    else:
        # Caso a exclusão falhe por algum motivo futuro
        return jsonify({"success": False, "message": "Falha ao desativar/excluir treinamento"}), 500

@treinamento_bp.route("/<int:treinamento_id>/status", methods=["GET"])
@audit_read(EntityTypeEnum.STATUS_TREINAMENTO, "Usuário {g.user.username} verificou status do treinamento #{treinamento_id}")
def get_user_status_for_treinamento(treinamento_id):
    """Obtém o status do usuário logado para um treinamento"""
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({"success": False, "message": "Usuário não autenticado"}), 401
        
    status = TreinamentoService.get_user_status(treinamento_id, user_id)
    return jsonify({"success": True, "data": status.to_dict() if status else None}), 200

@treinamento_bp.route("/<int:treinamento_id>/status", methods=["PUT"])
# @audit_update(EntityTypeEnum.STATUS_TREINAMENTO, "Usuário {g.user.username} atualizou status do treinamento #{treinamento_id} para {data[status]}") # Log feito no service
def update_user_status_for_treinamento(treinamento_id):
    """Atualiza o status do usuário logado (iniciar, concluir)"""
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({"success": False, "message": "Usuário não autenticado"}), 401
        
    data = request.json
    new_status_str = data.get("status")
    
    try:
        new_status_enum = StatusTreinamentoEnum(new_status_str)
    except ValueError:
        return jsonify({"success": False, "message": f"Status inválido: {new_status_str}"}), 400
        
    updated_status = TreinamentoService.update_user_status(treinamento_id, user_id, new_status_enum)
    
    if updated_status:
        return jsonify({"success": True, "message": "Status atualizado com sucesso", "data": updated_status.to_dict()}), 200
    else:
        return jsonify({"success": False, "message": "Não foi possível atualizar o status (transição inválida ou erro)"}), 400

@treinamento_bp.route("/<int:treinamento_id>/usuarios", methods=["GET"])
@audit_read(EntityTypeEnum.TREINAMENTO, "Admin {g.user.username} listou progresso dos usuários no treinamento #{treinamento_id}")
def get_treinamento_user_progress(treinamento_id):
    """Lista o progresso de todos os usuários para um treinamento (Admin)"""
    admin_required = require_admin()
    if admin_required: return admin_required
    
    progress_list = TreinamentoService.get_treinamento_progress(treinamento_id)
    return jsonify({"success": True, "data": progress_list}), 200

@treinamento_bp.route("/<int:treinamento_id>/atribuir", methods=["POST"])
# @audit_update(EntityTypeEnum.TREINAMENTO, "Admin {g.user.username} atribuiu o treinamento #{treinamento_id} a usuários") # Log feito no service
def assign_treinamento_to_users(treinamento_id):
    """Atribui um treinamento a uma lista de usuários (Admin)"""
    admin_required = require_admin()
    if admin_required: return admin_required
    
    data = request.json
    user_ids = data.get("user_ids")
    prazo_conclusao = data.get("prazo_conclusao") # Espera formato ISO (YYYY-MM-DDTHH:MM:SS)
    
    if not user_ids or not isinstance(user_ids, list):
        return jsonify({"success": False, "message": "Lista de user_ids é obrigatória"}), 400
        
    result = TreinamentoService.assign_treinamento(treinamento_id, user_ids, g.user.id, prazo_conclusao)
    return jsonify({"success": True, "message": "Atribuição processada", "data": result}), 200

# Adicionar rota para upload de material se necessário
# @treinamento_bp.route("/<int:treinamento_id>/material", methods=["POST"])
# def upload_material(treinamento_id):
#     ...

