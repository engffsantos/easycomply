# app/controllers/documentos_controller.py
from flask import Blueprint, request, jsonify, current_app, send_from_directory, render_template
import os
import uuid
import hashlib
from datetime import datetime
from weasyprint import HTML, CSS
from ..models.documento import Documento
from ..extensions import db
import json

documentos_bp = Blueprint('documentos', __name__, url_prefix='/api/documentos')

# Configuração para armazenamento de documentos
DOCUMENTS_FOLDER = os.path.join(current_app.root_path, 'documents')
os.makedirs(DOCUMENTS_FOLDER, exist_ok=True)

@documentos_bp.route('/', methods=['GET'])
def get_documentos():
    """Retorna todos os documentos, com opção de filtro por tipo"""
    document_type = request.args.get('document_type')
    
    query = Documento.query
    if document_type:
        query = query.filter(Documento.document_type == document_type)
    
    documentos = query.order_by(Documento.created_at.desc()).all()
    return jsonify({
        'success': True,
        'data': [documento.to_dict() for documento in documentos]
    }), 200

@documentos_bp.route('/<int:documento_id>', methods=['GET'])
def get_documento(documento_id):
    """Retorna um documento específico"""
    documento = Documento.query.get_or_404(documento_id)
    return jsonify({
        'success': True,
        'data': documento.to_dict()
    }), 200

@documentos_bp.route('/gerar', methods=['POST'])
def gerar_documento():
    """Gera um novo documento legal com base nos dados fornecidos"""
    data = request.json
    
    if not data or not data.get('document_type') or not data.get('title'):
        return jsonify({
            'success': False,
            'message': 'Tipo de documento e título são obrigatórios'
        }), 400
    
    # Verificar se já existe um documento com o mesmo título e tipo
    existing_doc = Documento.query.filter_by(
        title=data.get('title'),
        document_type=data.get('document_type')
    ).order_by(Documento.version.desc()).first()
    
    # Se existir, incrementar a versão
    version = 1
    if existing_doc:
        version = existing_doc.version + 1
    
    # Gerar hash do conteúdo para versionamento/integridade
    content_hash = hashlib.sha256(json.dumps(data, sort_keys=True).encode()).hexdigest()
    
    # Criar diretório para o tipo de documento se não existir
    doc_type_dir = os.path.join(DOCUMENTS_FOLDER, data.get('document_type'))
    os.makedirs(doc_type_dir, exist_ok=True)
    
    # Gerar nome de arquivo único
    filename = f"{data.get('title').replace(' ', '_')}_{version}_{uuid.uuid4().hex[:8]}.pdf"
    file_path = os.path.join(doc_type_dir, filename)
    
    # Gerar o documento PDF
    try:
        # Selecionar o template HTML com base no tipo de documento
        template_name = f"documentos/{data.get('document_type')}.html"
        
        # Renderizar o template com os dados fornecidos
        html_content = render_template(template_name, **data)
        
        # Converter HTML para PDF
        HTML(string=html_content).write_pdf(
            file_path,
            stylesheets=[
                CSS(string='@page { margin: 1cm; }')
            ]
        )
        
        # Criar registro do documento no banco de dados
        documento = Documento(
            title=data.get('title'),
            document_type=data.get('document_type'),
            user_id=data.get('user_id'),
            content_hash=content_hash,
            storage_path=file_path,
            version=version,
            empresa_nome=data.get('empresa_nome'),
            tipo_dados=data.get('tipo_dados'),
            base_legal=data.get('base_legal'),
            finalidade=data.get('finalidade'),
            compartilhamento=data.get('compartilhamento')
        )
        
        db.session.add(documento)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Documento gerado com sucesso',
            'data': documento.to_dict()
        }), 201
        
    except Exception as e:
        # Em caso de erro, remover o arquivo se foi criado
        if os.path.exists(file_path):
            os.remove(file_path)
        
        return jsonify({
            'success': False,
            'message': f'Erro ao gerar documento: {str(e)}'
        }), 500

@documentos_bp.route('/<int:documento_id>/download', methods=['GET'])
def download_documento(documento_id):
    """Faz download de um documento"""
    documento = Documento.query.get_or_404(documento_id)
    
    if not documento.storage_path or not os.path.exists(documento.storage_path):
        return jsonify({
            'success': False,
            'message': 'Arquivo não encontrado'
        }), 404
    
    # Extrai o diretório e o nome do arquivo do caminho completo
    directory = os.path.dirname(documento.storage_path)
    filename = os.path.basename(documento.storage_path)
    
    # Nome para download (mais amigável)
    download_name = f"{documento.title}_v{documento.version}.pdf"
    
    return send_from_directory(directory, filename, as_attachment=True, download_name=download_name)

@documentos_bp.route('/<int:documento_id>/versoes', methods=['GET'])
def get_documento_versoes(documento_id):
    """Retorna todas as versões de um documento"""
    documento = Documento.query.get_or_404(documento_id)
    
    # Buscar todas as versões do mesmo documento (mesmo título e tipo)
    versoes = Documento.query.filter_by(
        title=documento.title,
        document_type=documento.document_type
    ).order_by(Documento.version.desc()).all()
    
    return jsonify({
        'success': True,
        'data': [versao.to_dict() for versao in versoes]
    }), 200

@documentos_bp.route('/<int:documento_id>/assinatura', methods=['POST'])
def atualizar_assinatura(documento_id):
    """Atualiza o status de assinatura de um documento"""
    documento = Documento.query.get_or_404(documento_id)
    data = request.json
    
    if not data or 'assinatura_status' not in data:
        return jsonify({
            'success': False,
            'message': 'Status de assinatura é obrigatório'
        }), 400
    
    # Atualizar status de assinatura
    documento.assinatura_status = data.get('assinatura_status')
    if 'assinatura_url' in data:
        documento.assinatura_url = data.get('assinatura_url')
    
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Status de assinatura atualizado com sucesso',
        'data': documento.to_dict()
    }), 200
