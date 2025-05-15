# app/services/auth_service.py
from ..models.user import User
from ..extensions import db
from flask_jwt_extended import create_access_token, create_refresh_token
# Outras importações necessárias, como exceptions customizadas

class AuthService:

    @staticmethod
    def register_user(data):
        """Registra um novo usuário no sistema."""
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")

        if User.query.filter_by(email=email).first() or User.query.filter_by(username=username).first():
            # Idealmente, lançar uma exceção customizada aqui
            # raise UserAlreadyExistsError("Usuário ou email já cadastrado.")
            return None # Ou um dicionário de erro

        new_user = User(username=username, email=email, password=password)
        db.session.add(new_user)
        db.session.commit()
        return new_user

    @staticmethod
    def authenticate_user(email, password):
        """Autentica um usuário e retorna tokens JWT se as credenciais forem válidas."""
        user = User.query.filter_by(email=email).first()
        if user and user.check_password(password):
            access_token = create_access_token(identity=user.id)
            refresh_token = create_refresh_token(identity=user.id)
            return {"access_token": access_token, "refresh_token": refresh_token}
        return None

    @staticmethod
    def refresh_auth_token(user_identity):
        """Gera um novo token de acesso para um usuário autenticado."""
        # user_identity é o ID do usuário obtido do refresh token válido
        new_access_token = create_access_token(identity=user_identity)
        return new_access_token

    @staticmethod
    def get_user_by_id(user_id):
        """Busca um usuário pelo ID."""
        return User.query.get(user_id)

# Outros métodos de serviço relacionados à autenticação podem ser adicionados,
# como gerenciamento de roles, permissões, solicitação de reset de senha, etc.

