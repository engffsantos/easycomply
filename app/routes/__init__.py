from flask import Blueprint, render_template

# Blueprints
auth_bp = Blueprint("auth_bp", __name__)
checklist_bp = Blueprint("checklist_bp", __name__)
documentos_bp = Blueprint("documentos_bp", __name__)
incidentes_bp = Blueprint("incidentes_bp", __name__)

# Autenticação
@auth_bp.route("/login")
def login():
    return render_template("login.html")

# Checklists
@checklist_bp.route("/")
def checklist():
    return render_template("checklist.html")

# Documentos
@documentos_bp.route("/")
def documentos():
    return render_template("dashboard.html")  # Pode ajustar se tiver um específico

# Incidentes
@incidentes_bp.route("/")
def incidentes():
    return render_template("dashboard.html")  # Placeholder até ter um template próprio
