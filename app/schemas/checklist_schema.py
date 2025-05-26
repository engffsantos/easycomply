# app/schemas/checklist_schema.py
from marshmallow import Schema, fields, validate

# class ChecklistItemSchema(Schema):
#     id = fields.Int(dump_only=True)
#     text = fields.Str(required=True, validate=validate.Length(min=1, max=500))
#     is_completed = fields.Bool(missing=False)
#     created_at = fields.DateTime(dump_only=True)

class ChecklistSchema(Schema):
    id = fields.Int(dump_only=True)
    title = fields.Str(required=True, validate=validate.Length(min=3, max=200))
    description = fields.Str(missing=None, validate=validate.Length(max=1000))
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    # user_id = fields.Int(dump_only=True) # Ou load_only se for para atribuir na criação
    # items = fields.List(fields.Nested(ChecklistItemSchema), missing=[])

class ChecklistCreateSchema(Schema):
    title = fields.Str(required=True, validate=validate.Length(min=3, max=200))
    description = fields.Str(missing=None, validate=validate.Length(max=1000))
    # user_id = fields.Int(required=False) # Se for associar a um usuário na criação
    # items = fields.List(fields.Nested(ChecklistItemSchema), missing=[])

class ChecklistUpdateSchema(Schema):
    title = fields.Str(validate=validate.Length(min=3, max=200))
    description = fields.Str(validate=validate.Length(max=1000))
    # items = fields.List(fields.Nested(ChecklistItemSchema)) # Para atualizar itens

