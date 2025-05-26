from flask import Flask
from .config import Config  # Será criado no passo 1.2
from .extensions import db, jwt, migrate, mail # Será criado no passo 1.3

def create_app(config_class=Config):
    """Factory function to create and configure the Flask app."""
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Inicializar extensões Flask
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    mail.init_app(app)

    # Registrar Blueprints
    # Exemplo: (serão criados e importados do app.routes no passo 1.4 e controllers no 1.5)
    # from .routes.auth_routes import auth_bp
    # app.register_blueprint(auth_bp, url_prefix='/auth')

    # from .routes.checklist_routes import checklist_bp
    # app.register_blueprint(checklist_bp, url_prefix='/checklists')
    
    # Adicionar um blueprint principal simples para teste inicial
    from flask import Blueprint
    main_bp = Blueprint('main', __name__)

    @main_bp.route('/')
    def index():
        return "EasyComply App Initialized!"

    app.register_blueprint(main_bp)

    return app

