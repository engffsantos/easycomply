# app/models/checklist.py
from ..extensions import db
import datetime

class Checklist(db.Model):
    __tablename__ = "checklists"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    # user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False) # Exemplo de ForeignKey
    # items = db.relationship("ChecklistItem", backref="checklist", lazy=True, cascade="all, delete-orphan")

    def __init__(self, title, description=None, user_id=None):
        self.title = title
        self.description = description
        # self.user_id = user_id

    def __repr__(self):
        return f"<Checklist {self.title}>"

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            # "user_id": self.user_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            # "items": [item.to_dict() for item in self.items]
        }

# class ChecklistItem(db.Model):
#     __tablename__ = "checklist_items"
#     id = db.Column(db.Integer, primary_key=True)
#     text = db.Column(db.String(500), nullable=False)
#     is_completed = db.Column(db.Boolean, default=False)
#     checklist_id = db.Column(db.Integer, db.ForeignKey("checklists.id"), nullable=False)
#     created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

#     def to_dict(self):
#         return {
#             "id": self.id,
#             "text": self.text,
#             "is_completed": self.is_completed
#         }

