# app/routes/__init__.py
from flask import Blueprint

# Blueprint para autenticação
auth_bp = Blueprint("auth_bp", __name__)

# Blueprint para checklists
checklist_bp = Blueprint("checklist_bp", __name__)

# Blueprint para documentos
documentos_bp = Blueprint("documentos_bp", __name__)

# Blueprint para incidentes (exemplo adicional, conforme modelos)
incidentes_bp = Blueprint("incidentes_bp", __name__)

# Importar as rotas específicas de cada módulo para registrar no blueprint
# Estes arquivos serão criados no passo de criação dos controllers (1.5)
# e/ou em arquivos de rotas dedicados dentro da pasta app/routes/

# Exemplo de como as rotas seriam importadas (após a criação dos controllers):
# from . import auth_routes  # Supondo um app/routes/auth_routes.py
# from . import checklist_routes
# from . import documentos_routes
# from . import incidentes_routes

# Por enquanto, vamos adicionar rotas de placeholder diretamente aqui para teste,
# mas a melhor prática é separá-las em arquivos como auth_routes.py, etc.

@auth_bp.route("/login")
def login_placeholder():
    return "Auth Blueprint - Login Placeholder"

@checklist_bp.route("/")
def checklist_placeholder():
    return "Checklist Blueprint - List Placeholder"

@documentos_bp.route("/")
def documentos_placeholder():
    return "Documentos Blueprint - List Placeholder"

@incidentes_bp.route("/")
def incidentes_placeholder():
    return "Incidentes Blueprint - List Placeholder"

