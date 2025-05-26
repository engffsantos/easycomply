# app/controllers/risco_controller.py
from flask import Blueprint, request, jsonify, g
from ..services.risco_service import RiscoService
from ..extensions import db
from ..utils.audit_decorators import audit_read, audit_create, audit_update, audit_delete
from ..models.audit_log import EntityTypeEnum

risco_bp = Blueprint("risco", __name__, url_prefix="/api/riscos")

# --- Funções Auxiliares ---
def get_current_user_id():
    if not hasattr(g, "user"):
        return None
    return g.user.id

# --- Rotas para Riscos ---

@risco_bp.route("/", methods=["GET"])
@audit_read(EntityTypeEnum.RISCO, "Usuário {g.user.username} listou riscos")
def get_riscos():
    """Lista todos os riscos com filtros opcionais"""
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({"success": False, "message": "Usuário não autenticado"}), 401
        
    filters = {
        "categoria": request.args.get("categoria"),
        "status": request.args.get("status")
    }
    riscos = RiscoService.get_all_riscos(filters)
    return jsonify({"success": True, "data": riscos}), 200

@risco_bp.route("/", methods=["POST"])
# @audit_create(EntityTypeEnum.RISCO, ...) # Log já feito no service
def create_risco():
    """Cria um novo risco"""
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({"success": False, "message": "Usuário não autenticado"}), 401
        
    data = request.json
    if not data or not data.get("nome"):
        return jsonify({"success": False, "message": "Nome do risco é obrigatório"}), 400
        
    risco = RiscoService.create_risco(data, user_id)
    return jsonify({"success": True, "message": "Risco identificado com sucesso", "data": risco.to_dict()}), 201

@risco_bp.route("/<int:risco_id>", methods=["GET"])
@audit_read(EntityTypeEnum.RISCO, "Usuário {g.user.username} visualizou o risco #{risco_id}")
def get_risco(risco_id):
    """Obtém detalhes de um risco específico"""
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({"success": False, "message": "Usuário não autenticado"}), 401
        
    risco_dict = RiscoService.get_risco_by_id(risco_id)
    return jsonify({"success": True, "data": risco_dict}), 200

@risco_bp.route("/<int:risco_id>", methods=["PUT"])
# @audit_update(EntityTypeEnum.RISCO, ...) # Log já feito no service
def update_risco(risco_id):
    """Atualiza dados básicos de um risco"""
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({"success": False, "message": "Usuário não autenticado"}), 401
        
    data = request.json
    risco = RiscoService.update_risco(risco_id, data, user_id)
    return jsonify({"success": True, "message": "Risco atualizado com sucesso", "data": risco.to_dict(include_details=True)}), 200

@risco_bp.route("/<int:risco_id>", methods=["DELETE"])
# @audit_delete(EntityTypeEnum.RISCO, ...) # Log já feito no service
def delete_risco(risco_id):
    """Exclui/Arquiva um risco"""
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({"success": False, "message": "Usuário não autenticado"}), 401
        
    success = RiscoService.delete_risco(risco_id, user_id)
    if success:
        return jsonify({"success": True, "message": "Risco excluído/arquivado com sucesso"}), 200
    else:
        return jsonify({"success": False, "message": "Falha ao excluir/arquivar risco"}), 500

# --- Rotas para Avaliações de Risco ---

@risco_bp.route("/<int:risco_id>/avaliacoes", methods=["GET"])
@audit_read(EntityTypeEnum.AVALIACAO_RISCO, "Usuário {g.user.username} listou avaliações do risco #{risco_id}")
def get_avaliacoes(risco_id):
    """Lista o histórico de avaliações de um risco"""
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({"success": False, "message": "Usuário não autenticado"}), 401
        
    avaliacoes = RiscoService.get_avaliacoes_by_risco(risco_id)
    return jsonify({"success": True, "data": avaliacoes}), 200

@risco_bp.route("/<int:risco_id>/avaliacoes", methods=["POST"])
# @audit_create(EntityTypeEnum.AVALIACAO_RISCO, ...) # Log já feito no service
def create_avaliacao(risco_id):
    """Cria uma nova avaliação para um risco"""
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({"success": False, "message": "Usuário não autenticado"}), 401
        
    data = request.json
    if not data or data.get("probabilidade") is None or data.get("impacto") is None:
        return jsonify({"success": False, "message": "Probabilidade e Impacto são obrigatórios"}), 400
        
    try:
        # Valida se são inteiros
        int(data["probabilidade"])
        int(data["impacto"])
        if data.get("probabilidade_residual") is not None: int(data["probabilidade_residual"])
        if data.get("impacto_residual") is not None: int(data["impacto_residual"])
    except (ValueError, TypeError):
         return jsonify({"success": False, "message": "Probabilidade e Impacto (e residuais, se informados) devem ser números inteiros"}), 400

    avaliacao = RiscoService.create_avaliacao(risco_id, data, user_id)
    return jsonify({"success": True, "message": "Avaliação criada com sucesso", "data": avaliacao.to_dict()}), 201

# --- Rotas para Planos de Tratamento ---

@risco_bp.route("/<int:risco_id>/planos-tratamento", methods=["GET"])
@audit_read(EntityTypeEnum.PLANO_TRATAMENTO, "Usuário {g.user.username} listou planos de tratamento do risco #{risco_id}")
def get_planos_tratamento(risco_id):
    """Lista as ações do plano de tratamento de um risco"""
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({"success": False, "message": "Usuário não autenticado"}), 401
        
    planos = RiscoService.get_planos_by_risco(risco_id)
    return jsonify({"success": True, "data": planos}), 200

@risco_bp.route("/<int:risco_id>/planos-tratamento", methods=["POST"])
# @audit_create(EntityTypeEnum.PLANO_TRATAMENTO, ...) # Log já feito no service
def create_plano_tratamento(risco_id):
    """Adiciona uma nova ação ao plano de tratamento"""
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({"success": False, "message": "Usuário não autenticado"}), 401
        
    data = request.json
    if not data or not data.get("acao"):
        return jsonify({"success": False, "message": "Descrição da ação é obrigatória"}), 400
        
    plano = RiscoService.create_plano_tratamento(risco_id, data, user_id)
    return jsonify({"success": True, "message": "Ação adicionada ao plano com sucesso", "data": plano.to_dict()}), 201

# Usar /api/planos-tratamento/:id para PUT e DELETE para evitar ambiguidade
plano_tratamento_bp = Blueprint("plano_tratamento", __name__, url_prefix="/api/planos-tratamento")

@plano_tratamento_bp.route("/<int:plano_id>", methods=["PUT"])
# @audit_update(EntityTypeEnum.PLANO_TRATAMENTO, ...) # Log já feito no service
def update_plano_tratamento(plano_id):
    """Atualiza uma ação do plano de tratamento"""
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({"success": False, "message": "Usuário não autenticado"}), 401
        
    data = request.json
    plano = RiscoService.update_plano_tratamento(plano_id, data, user_id)
    return jsonify({"success": True, "message": "Ação do plano atualizada com sucesso", "data": plano.to_dict()}), 200

@plano_tratamento_bp.route("/<int:plano_id>", methods=["DELETE"])
# @audit_delete(EntityTypeEnum.PLANO_TRATAMENTO, ...) # Log já feito no service
def delete_plano_tratamento(plano_id):
    """Exclui uma ação do plano de tratamento"""
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({"success": False, "message": "Usuário não autenticado"}), 401
        
    success = RiscoService.delete_plano_tratamento(plano_id, user_id)
    if success:
        return jsonify({"success": True, "message": "Ação do plano excluída com sucesso"}), 200
    else:
        return jsonify({"success": False, "message": "Falha ao excluir ação do plano"}), 500

# --- Rota para Dashboard --- 

@risco_bp.route("/dashboard", methods=["GET"])
@audit_read(EntityTypeEnum.RISCO, "Usuário {g.user.username} acessou o dashboard de riscos")
def get_dashboard_data():
    """Retorna dados agregados para o dashboard de riscos"""
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({"success": False, "message": "Usuário não autenticado"}), 401
        
    dashboard_data = RiscoService.get_dashboard_data()
    return jsonify({"success": True, "data": dashboard_data}), 200

