# app/controllers/checklist_controller.py
from flask import Blueprint, request, jsonify, current_app, send_from_directory
from werkzeug.utils import secure_filename
import os
import uuid
from datetime import datetime
from ..models.checklist import Checklist
from ..models.checklist_item import ChecklistItem, RiscoEnum, PrioridadeEnum, StatusEnum
from ..models.evidencia import Evidencia
from ..extensions import db
from ..schemas.checklist_schema import ChecklistSchema, ChecklistItemSchema
import json

checklist_bp = Blueprint('checklist', __name__, url_prefix='/api/checklists')

# Configuração para upload de arquivos
UPLOAD_FOLDER = os.path.join(current_app.root_path, 'uploads', 'evidencias')
ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg', 'doc', 'docx', 'xls', 'xlsx', 'txt'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Rotas para Checklists
@checklist_bp.route('/', methods=['GET'])
def get_checklists():
    """Retorna todos os checklists, com opção de filtro por categoria"""
    categoria = request.args.get('categoria')
    
    query = Checklist.query
    if categoria:
        query = query.filter(Checklist.categoria == categoria)
    
    checklists = query.all()
    return jsonify({
        'success': True,
        'data': [checklist.to_dict() for checklist in checklists]
    }), 200

@checklist_bp.route('/<int:checklist_id>', methods=['GET'])
def get_checklist(checklist_id):
    """Retorna um checklist específico com seus itens"""
    checklist = Checklist.query.get_or_404(checklist_id)
    return jsonify({
        'success': True,
        'data': checklist.to_dict()
    }), 200

@checklist_bp.route('/', methods=['POST'])
def create_checklist():
    """Cria um novo checklist"""
    data = request.json
    
    if not data or not data.get('nome'):
        return jsonify({
            'success': False,
            'message': 'Nome do checklist é obrigatório'
        }), 400
    
    checklist = Checklist(
        nome=data.get('nome'),
        categoria=data.get('categoria'),
        descricao=data.get('descricao'),
        user_id=data.get('user_id')
    )
    
    db.session.add(checklist)
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Checklist criado com sucesso',
        'data': checklist.to_dict()
    }), 201

@checklist_bp.route('/<int:checklist_id>', methods=['PUT'])
def update_checklist(checklist_id):
    """Atualiza um checklist existente"""
    checklist = Checklist.query.get_or_404(checklist_id)
    data = request.json
    
    if data.get('nome'):
        checklist.nome = data.get('nome')
    if 'categoria' in data:
        checklist.categoria = data.get('categoria')
    if 'descricao' in data:
        checklist.descricao = data.get('descricao')
    
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Checklist atualizado com sucesso',
        'data': checklist.to_dict()
    }), 200

@checklist_bp.route('/<int:checklist_id>', methods=['DELETE'])
def delete_checklist(checklist_id):
    """Exclui um checklist e seus itens"""
    checklist = Checklist.query.get_or_404(checklist_id)
    
    db.session.delete(checklist)
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Checklist excluído com sucesso'
    }), 200

# Rotas para Itens de Checklist
@checklist_bp.route('/<int:checklist_id>/items', methods=['GET'])
def get_checklist_items(checklist_id):
    """Retorna todos os itens de um checklist, com opções de filtro"""
    checklist = Checklist.query.get_or_404(checklist_id)
    
    # Filtros
    status = request.args.get('status')
    risco = request.args.get('risco')
    prioridade = request.args.get('prioridade')
    
    query = ChecklistItem.query.filter_by(checklist_id=checklist_id)
    
    if status:
        query = query.filter(ChecklistItem.status == status)
    if risco:
        query = query.filter(ChecklistItem.risco == risco)
    if prioridade:
        query = query.filter(ChecklistItem.prioridade == prioridade)
    
    items = query.all()
    
    return jsonify({
        'success': True,
        'data': [item.to_dict() for item in items]
    }), 200

@checklist_bp.route('/<int:checklist_id>/items', methods=['POST'])
def create_checklist_item(checklist_id):
    """Cria um novo item de checklist"""
    checklist = Checklist.query.get_or_404(checklist_id)
    data = request.json
    
    if not data or not data.get('nome'):
        return jsonify({
            'success': False,
            'message': 'Nome do item é obrigatório'
        }), 400
    
    item = ChecklistItem(
        checklist_id=checklist_id,
        nome=data.get('nome'),
        descricao=data.get('descricao'),
        categoria=data.get('categoria'),
        risco=data.get('risco', RiscoEnum.MEDIO),
        prioridade=data.get('prioridade', PrioridadeEnum.MEDIA),
        status=data.get('status', StatusEnum.PENDENTE)
    )
    
    db.session.add(item)
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Item criado com sucesso',
        'data': item.to_dict()
    }), 201

@checklist_bp.route('/<int:checklist_id>/items/<int:item_id>', methods=['PUT'])
def update_checklist_item(checklist_id, item_id):
    """Atualiza um item de checklist existente"""
    item = ChecklistItem.query.filter_by(id=item_id, checklist_id=checklist_id).first_or_404()
    data = request.json
    
    if 'nome' in data:
        item.nome = data.get('nome')
    if 'descricao' in data:
        item.descricao = data.get('descricao')
    if 'categoria' in data:
        item.categoria = data.get('categoria')
    if 'risco' in data:
        item.risco = data.get('risco')
    if 'prioridade' in data:
        item.prioridade = data.get('prioridade')
    if 'status' in data:
        item.status = data.get('status')
    
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Item atualizado com sucesso',
        'data': item.to_dict()
    }), 200

@checklist_bp.route('/<int:checklist_id>/items/<int:item_id>', methods=['DELETE'])
def delete_checklist_item(checklist_id, item_id):
    """Exclui um item de checklist"""
    item = ChecklistItem.query.filter_by(id=item_id, checklist_id=checklist_id).first_or_404()
    
    db.session.delete(item)
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Item excluído com sucesso'
    }), 200

# Rotas para Evidências
@checklist_bp.route('/<int:checklist_id>/items/<int:item_id>/evidencias', methods=['POST'])
def upload_evidencia(checklist_id, item_id):
    """Faz upload de uma evidência para um item de checklist"""
    item = ChecklistItem.query.filter_by(id=item_id, checklist_id=checklist_id).first_or_404()
    
    # Verifica se há arquivo na requisição
    if 'arquivo' not in request.files:
        return jsonify({
            'success': False,
            'message': 'Nenhum arquivo enviado'
        }), 400
    
    arquivo = request.files['arquivo']
    
    # Se o usuário não selecionar um arquivo, o navegador envia um arquivo vazio
    if arquivo.filename == '':
        return jsonify({
            'success': False,
            'message': 'Nenhum arquivo selecionado'
        }), 400
    
    if arquivo and allowed_file(arquivo.filename):
        # Gera um nome de arquivo seguro e único
        filename = secure_filename(arquivo.filename)
        unique_filename = f"{uuid.uuid4()}_{filename}"
        
        # Cria diretório para o usuário e checklist se não existir
        user_dir = os.path.join(UPLOAD_FOLDER, str(item.checklist.user_id or 'anonymous'))
        checklist_dir = os.path.join(user_dir, str(checklist_id))
        item_dir = os.path.join(checklist_dir, str(item_id))
        
        os.makedirs(item_dir, exist_ok=True)
        
        # Salva o arquivo
        file_path = os.path.join(item_dir, unique_filename)
        arquivo.save(file_path)
        
        # Cria registro de evidência no banco de dados
        evidencia = Evidencia(
            item_id=item_id,
            arquivo=file_path,
            nome_original=arquivo.filename,
            tipo_arquivo=arquivo.content_type,
            tamanho=os.path.getsize(file_path),
            observacao=request.form.get('observacao'),
            user_id=request.form.get('user_id')
        )
        
        db.session.add(evidencia)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Evidência enviada com sucesso',
            'data': evidencia.to_dict()
        }), 201
    
    return jsonify({
        'success': False,
        'message': 'Tipo de arquivo não permitido'
    }), 400

@checklist_bp.route('/<int:checklist_id>/items/<int:item_id>/evidencias', methods=['GET'])
def get_evidencias(checklist_id, item_id):
    """Retorna todas as evidências de um item de checklist"""
    item = ChecklistItem.query.filter_by(id=item_id, checklist_id=checklist_id).first_or_404()
    
    evidencias = Evidencia.query.filter_by(item_id=item_id).all()
    
    return jsonify({
        'success': True,
        'data': [evidencia.to_dict() for evidencia in evidencias]
    }), 200

@checklist_bp.route('/<int:checklist_id>/items/<int:item_id>/evidencias/<int:evidencia_id>', methods=['GET'])
def download_evidencia(checklist_id, item_id, evidencia_id):
    """Faz download de uma evidência"""
    evidencia = Evidencia.query.filter_by(id=evidencia_id, item_id=item_id).first_or_404()
    
    # Extrai o diretório e o nome do arquivo do caminho completo
    directory = os.path.dirname(evidencia.arquivo)
    filename = os.path.basename(evidencia.arquivo)
    
    return send_from_directory(directory, filename, as_attachment=True, download_name=evidencia.nome_original)

@checklist_bp.route('/<int:checklist_id>/items/<int:item_id>/evidencias/<int:evidencia_id>', methods=['DELETE'])
def delete_evidencia(checklist_id, item_id, evidencia_id):
    """Exclui uma evidência"""
    evidencia = Evidencia.query.filter_by(id=evidencia_id, item_id=item_id).first_or_404()
    
    # Remove o arquivo físico
    try:
        os.remove(evidencia.arquivo)
    except OSError:
        # Se o arquivo não existir, apenas continua
        pass
    
    # Remove o registro do banco de dados
    db.session.delete(evidencia)
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Evidência excluída com sucesso'
    }), 200

# Rotas para métricas e dashboard
@checklist_bp.route('/metricas', methods=['GET'])
def get_metricas():
    """Retorna métricas gerais de todos os checklists para o dashboard"""
    # Total de checklists
    total_checklists = Checklist.query.count()
    
    # Itens por status
    itens_pendentes = ChecklistItem.query.filter_by(status=StatusEnum.PENDENTE).count()
    itens_em_andamento = ChecklistItem.query.filter_by(status=StatusEnum.EM_ANDAMENTO).count()
    itens_concluidos = ChecklistItem.query.filter_by(status=StatusEnum.CONCLUIDO).count()
    total_itens = itens_pendentes + itens_em_andamento + itens_concluidos
    
    # Itens por risco
    itens_risco_alto = ChecklistItem.query.filter_by(risco=RiscoEnum.ALTO).count()
    itens_risco_medio = ChecklistItem.query.filter_by(risco=RiscoEnum.MEDIO).count()
    itens_risco_baixo = ChecklistItem.query.filter_by(risco=RiscoEnum.BAIXO).count()
    
    # Percentual de conformidade geral
    percentual_conformidade = 0
    if total_itens > 0:
        percentual_conformidade = int((itens_concluidos / total_itens) * 100)
    
    # Métricas por categoria
    categorias = db.session.query(Checklist.categoria).distinct().all()
    metricas_por_categoria = []
    
    for categoria_tuple in categorias:
        categoria = categoria_tuple[0]
        if not categoria:
            continue
            
        checklists_categoria = Checklist.query.filter_by(categoria=categoria).all()
        total_itens_categoria = 0
        itens_concluidos_categoria = 0
        
        for checklist in checklists_categoria:
            for item in checklist.items:
                total_itens_categoria += 1
                if item.status == StatusEnum.CONCLUIDO:
                    itens_concluidos_categoria += 1
        
        percentual_categoria = 0
        if total_itens_categoria > 0:
            percentual_categoria = int((itens_concluidos_categoria / total_itens_categoria) * 100)
        
        metricas_por_categoria.append({
            'categoria': categoria,
            'total_itens': total_itens_categoria,
            'itens_concluidos': itens_concluidos_categoria,
            'percentual_conformidade': percentual_categoria
        })
    
    return jsonify({
        'success': True,
        'data': {
            'total_checklists': total_checklists,
            'total_itens': total_itens,
            'itens_por_status': {
                'pendentes': itens_pendentes,
                'em_andamento': itens_em_andamento,
                'concluidos': itens_concluidos
            },
            'itens_por_risco': {
                'alto': itens_risco_alto,
                'medio': itens_risco_medio,
                'baixo': itens_risco_baixo
            },
            'percentual_conformidade': percentual_conformidade,
            'metricas_por_categoria': metricas_por_categoria
        }
    }), 200
