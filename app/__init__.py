from flask import Flask, Blueprint, render_template
from .config import Config
from .extensions import db, jwt, migrate, mail
from app.routes.auth_routes import auth_bp
from .routes import checklist_bp, documentos_bp, incidentes_bp


from flask import Flask, Blueprint, render_template
from .config import Config
from .extensions import db, jwt, migrate, mail
from app.routes.auth_routes import auth_bp
from .routes import checklist_bp, documentos_bp, incidentes_bp
from datetime import datetime

def create_app(config_class=Config):
    """Factory function to create and configure the Flask app."""
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Inicializar extensões Flask
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    mail.init_app(app)

    # Disponibilizar a função now() no Jinja
    app.jinja_env.globals['now'] = datetime.now

    # Registrar Blueprints com prefixos
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(checklist_bp, url_prefix="/checklists")
    app.register_blueprint(documentos_bp, url_prefix="/documentos")
    app.register_blueprint(incidentes_bp, url_prefix="/incidentes")

    # Criar e registrar o blueprint principal
    main_bp = Blueprint("main", __name__)

    @main_bp.route('/')
    def index():
        return render_template("login.html")

    app.register_blueprint(main_bp)

    return app

