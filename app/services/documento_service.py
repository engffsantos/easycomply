# app/services/documento_service.py
from ..models.documento import Documento
from ..extensions import db
import os
import hashlib # Para gerar hash do conteúdo, se necessário
# from fpdf import FPDF # Exemplo se for gerar PDF diretamente no service

class DocumentoService:

    @staticmethod
    def generate_document_file(template_name, context_data):
        """Simula a geração de um arquivo de documento (ex: PDF).
        Em um cenário real, usaria uma biblioteca como ReportLab, WeasyPrint ou FPDF.
        Retorna um buffer de bytes do arquivo gerado.
        """
        # Exemplo simples: cria um arquivo de texto com o conteúdo
        # from io import BytesIO
        # buffer = BytesIO()
        # text_content = f"Documento: {template_name}\n\n"
        # for key, value in context_data.items():
        #     text_content += f"{key}: {value}\n"
        # buffer.write(text_content.encode("utf-8"))
        # buffer.seek(0)
        # return buffer
        
        # Placeholder: Retorna None, indicando que a lógica de geração de arquivo precisa ser implementada
        print(f"[SERVICE_INFO] Gerando documento: {template_name} com dados: {context_data}")
        # Esta é uma simulação. A geração real de PDF/DOCX seria mais complexa.
        # Por exemplo, usando fpdf:
        # pdf = FPDF()
        # pdf.add_page()
        # pdf.set_font("Arial", size = 12)
        # pdf.cell(200, 10, txt = f"Documento: {template_name}", ln = 1, align = "C")
        # for key, value in context_data.items():
        #     pdf.cell(200, 10, txt = f"{key}: {value}", ln = 1)
        # from io import BytesIO
        # buffer = BytesIO(pdf.output(dest="S").encode("latin-1")) # FPDF usa latin-1 por padrão
        # buffer.seek(0)
        # return buffer
        return None # Implementação real da geração de arquivo é necessária

    @staticmethod
    def save_document_metadata(data, user_id=None, file_path=None, content_hash=None):
        """Salva os metadados de um documento no banco de dados."""
        title = data.get("title")
        document_type = data.get("document_type")

        if not title or not document_type:
            # raise ValueError("Título e tipo do documento são obrigatórios.")
            return None

        new_document = Documento(
            title=title,
            document_type=document_type,
            # user_id=user_id, # Adicionar se o modelo User tiver relacionamento
            storage_path=file_path,
            content_hash=content_hash
        )
        db.session.add(new_document)
        db.session.commit()
        return new_document

    @staticmethod
    def get_all_documents(user_id=None):
        """Retorna metadados de todos os documentos, opcionalmente filtrados por usuário."""
        query = Documento.query
        # if user_id:
        #     query = query.filter_by(user_id=user_id)
        return query.all()

    @staticmethod
    def get_document_metadata_by_id(document_id, user_id=None):
        """Retorna metadados de um documento específico pelo ID."""
        query = Documento.query.filter_by(id=document_id)
        # if user_id:
        #     query = query.filter_by(user_id=user_id)
        return query.first()
    
    @staticmethod
    def get_document_file_by_id(document_id, user_id=None):
        """Busca o arquivo físico do documento.
           Retorna o caminho do arquivo ou um buffer.
        """
        doc_metadata = DocumentoService.get_document_metadata_by_id(document_id, user_id)
        if doc_metadata and doc_metadata.storage_path:
            # Lógica para ler o arquivo do storage_path
            # Exemplo: if os.path.exists(doc_metadata.storage_path):
            # with open(doc_metadata.storage_path, "rb") as f:
            #     from io import BytesIO
            #     return BytesIO(f.read())
            print(f"[SERVICE_INFO] Deveria ler o arquivo de: {doc_metadata.storage_path}")
            pass
        return None

    @staticmethod
    def delete_document(document_id, user_id=None):
        """Deleta os metadados de um documento e, opcionalmente, o arquivo físico."""
        document = DocumentoService.get_document_metadata_by_id(document_id, user_id)
        if not document:
            return False

        # Opcional: Deletar o arquivo físico do storage_path
        # if document.storage_path and os.path.exists(document.storage_path):
        #     try:
        #         os.remove(document.storage_path)
        #     except OSError as e:
        #         print(f"Erro ao deletar arquivo físico: {e}") # Logar o erro
        #         # Decidir se a falha em deletar o arquivo impede a deleção do metadado

        db.session.delete(document)
        db.session.commit()
        return True

    @staticmethod
    def calculate_content_hash(file_buffer):
        """Calcula o hash SHA256 de um buffer de arquivo."""
        file_buffer.seek(0) # Garante que a leitura comece do início
        sha256_hash = hashlib.sha256()
        for byte_block in iter(lambda: file_buffer.read(4096), b""):
            sha256_hash.update(byte_block)
        file_buffer.seek(0) # Restaura a posição do buffer
        return sha256_hash.hexdigest()

