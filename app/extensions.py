from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_mail import Mail
# Outras extensões podem ser adicionadas aqui conforme necessário
# Exemplo: Flask-Caching, Flask-Limiter, etc.

# Instanciar as extensões
# Estas instâncias serão inicializadas na factory create_app() em __init__.py
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
mail = Mail()

# Se você adicionar mais extensões, instancie-as aqui:
# cache = Cache()
# limiter = Limiter(key_func=get_remote_address)

