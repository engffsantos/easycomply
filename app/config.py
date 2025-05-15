import os
from dotenv import load_dotenv

# Carrega variáveis de ambiente do arquivo .env (se existir)
# Útil para desenvolvimento local, não deve ser versionado em produção.
basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, "..", ".env")) # Assumindo que .env está na raiz do projeto

class Config:
    """Configurações base, compartilhadas por todos os ambientes."""
    SECRET_KEY = os.environ.get("SECRET_KEY") or "uma-chave-secreta-muito-dificil-de-adivinhar"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY") or "uma-outra-chave-jwt-super-secreta"
    # Configurações de Email (exemplo com Mailtrap/Gmail)
    MAIL_SERVER = os.environ.get("MAIL_SERVER") or "smtp.mailtrap.io"
    MAIL_PORT = int(os.environ.get("MAIL_PORT") or 2525)
    MAIL_USE_TLS = os.environ.get("MAIL_USE_TLS") is not None and os.environ.get("MAIL_USE_TLS").lower() in ["true", "1", "t"]
    MAIL_USE_SSL = os.environ.get("MAIL_USE_SSL") is not None and os.environ.get("MAIL_USE_SSL").lower() in ["true", "1", "t"]
    MAIL_USERNAME = os.environ.get("MAIL_USERNAME")
    MAIL_PASSWORD = os.environ.get("MAIL_PASSWORD")
    MAIL_DEFAULT_SENDER = os.environ.get("MAIL_DEFAULT_SENDER") or "noreply@easycomply.com"

    # Outras configurações da aplicação podem ser adicionadas aqui
    ITEMS_PER_PAGE = 10

class DevelopmentConfig(Config):
    """Configurações para o ambiente de desenvolvimento."""
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get("DEV_DATABASE_URL") or \
        "sqlite:///" + os.path.join(basedir, "..", "dev_easycomply.db")
    # Exemplo: Habilitar modo de debug para extensões, se aplicável
    # JWT_BLACKLIST_ENABLED = True
    # JWT_BLACKLIST_TOKEN_CHECKS = ["access", "refresh"]

class TestingConfig(Config):
    """Configurações para o ambiente de testes."""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.environ.get("TEST_DATABASE_URL") or \
        "sqlite:///" + os.path.join(basedir, "..", "test_easycomply.db") # Banco de dados em memória ou arquivo separado para testes
    # Desabilitar CSRF protection em testes, se estiver usando WTForms CSRF
    WTF_CSRF_ENABLED = False 
    # Garante que os emails não sejam realmente enviados durante os testes
    MAIL_SUPPRESS_SEND = True 

class ProductionConfig(Config):
    """Configurações para o ambiente de produção."""
    DEBUG = False
    TESTING = False
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL") # Deve ser configurado no ambiente de produção
    # Configurações de segurança adicionais para produção:
    # SESSION_COOKIE_SECURE = True
    # REMEMBER_COOKIE_SECURE = True
    # SESSION_COOKIE_HTTPONLY = True
    # REMEMBER_COOKIE_HTTPONLY = True
    # SESSION_COOKIE_SAMESITE = "Lax"

# Dicionário para facilitar o acesso às classes de configuração
config_by_name = dict(
    dev=DevelopmentConfig,
    test=TestingConfig,
    prod=ProductionConfig,
    default=DevelopmentConfig
)

def get_config_by_name(config_name):
    return config_by_name.get(config_name, DevelopmentConfig)

