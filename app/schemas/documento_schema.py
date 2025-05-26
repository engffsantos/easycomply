# app/schemas/documento_schema.py
from marshmallow import Schema, fields, validate

class DocumentoSchema(Schema):
    id = fields.Int(dump_only=True)
    title = fields.Str(required=True, validate=validate.Length(min=3, max=255))
    document_type = fields.Str(required=True, validate=validate.Length(min=3, max=50))
    content_hash = fields.Str(dump_only=True, validate=validate.Length(max=256))
    version = fields.Int(dump_only=True)
    storage_path = fields.Str(dump_only=True, validate=validate.Length(max=512))
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    # user_id = fields.Int(dump_only=True)

class DocumentoCreateSchema(Schema):
    title = fields.Str(required=True, validate=validate.Length(min=3, max=255))
    document_type = fields.Str(required=True, validate=validate.Length(min=3, max=50))
    # Campos para a geração do documento, ex: template_id, context_data
    template_id = fields.Str(required=False) # Ou Int, dependendo de como os templates são identificados
    context_data = fields.Dict(required=False) # Dados para preencher o template

class DocumentoUpdateSchema(Schema):
    title = fields.Str(validate=validate.Length(min=3, max=255))
    # Outros campos que podem ser atualizados nos metadados do documento

