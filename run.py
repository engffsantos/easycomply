# run.py
import os
from app import create_app
from app.config import config_by_name

# Obtém a configuração desejada (padrão para 'dev' se não especificado)
# Em um ambiente de produção, FLASK_CONFIG pode ser definido como 'prod'
config_name = os.getenv("FLASK_CONFIG") or "dev"
app_config = config_by_name[config_name]

app = create_app(app_config)

if __name__ == "__main__":
    # O host 0.0.0.0 torna o servidor acessível externamente (útil para Docker/ambientes de desenvolvimento)
    # Em produção, um servidor WSGI como Gunicorn seria usado em vez do servidor de desenvolvimento do Flask.
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)), debug=app_config.DEBUG)

