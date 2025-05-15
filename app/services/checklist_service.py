# app/services/checklist_service.py
from ..models.checklist import Checklist # , ChecklistItem (se for usar)
from ..extensions import db

class ChecklistService:

    @staticmethod
    def create_checklist(data):
        """Cria um novo checklist."""
        title = data.get("title")
        description = data.get("description")
        # user_id = data.get("user_id") # Assumindo que o ID do usuário virá do token JWT ou de um campo

        # Validações adicionais podem ser feitas aqui antes de criar
        if not title:
            # raise ValueError("O título do checklist é obrigatório.")
            return None # Ou um dicionário de erro

        new_checklist = Checklist(title=title, description=description)
        # new_checklist = Checklist(title=title, description=description, user_id=user_id)
        db.session.add(new_checklist)
        db.session.commit()
        return new_checklist

    @staticmethod
    def get_all_checklists(user_id=None):
        """Retorna todos os checklists, opcionalmente filtrados por usuário."""
        query = Checklist.query
        # if user_id:
        #     query = query.filter_by(user_id=user_id)
        return query.all()

    @staticmethod
    def get_checklist_by_id(checklist_id, user_id=None):
        """Retorna um checklist específico pelo ID, opcionalmente verificando o proprietário."""
        query = Checklist.query.filter_by(id=checklist_id)
        # if user_id:
        #     query = query.filter_by(user_id=user_id)
        return query.first()

    @staticmethod
    def update_checklist(checklist_id, data, user_id=None):
        """Atualiza um checklist existente."""
        checklist = ChecklistService.get_checklist_by_id(checklist_id, user_id)
        if not checklist:
            return None # Checklist não encontrado ou não pertence ao usuário

        if "title" in data:
            checklist.title = data["title"]
        if "description" in data:
            checklist.description = data["description"]
        
        db.session.commit()
        return checklist

    @staticmethod
    def delete_checklist(checklist_id, user_id=None):
        """Deleta um checklist."""
        checklist = ChecklistService.get_checklist_by_id(checklist_id, user_id)
        if not checklist:
            return False # Checklist não encontrado ou não pertence ao usuário
        
        db.session.delete(checklist)
        db.session.commit()
        return True

    # Métodos para ChecklistItem podem ser adicionados aqui
    # Ex: add_item_to_checklist, update_checklist_item, delete_checklist_item

