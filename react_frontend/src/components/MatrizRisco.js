// app/react_frontend/src/components/MatrizRisco.js
import React from 'react';
import PropTypes from 'prop-types';

// Componente para a Matriz de Risco
const MatrizRisco = ({ data, tipo = 'residual' }) => {
  // Define os níveis e cores (ajustar conforme a metodologia)
  const niveis = {
    probabilidade: [1, 2, 3, 4, 5], // Baixa -> Alta
    impacto: [1, 2, 3, 4, 5]       // Baixo -> Alto
  };
  const cores = {
    baixo: '#d4edda',    // Verde claro
    medio: '#fff3cd',    // Amarelo claro
    alto: '#f8d7da',     // Vermelho claro
    critico: '#f5c6cb' // Vermelho mais escuro
  };
  const limites = {
    baixo: 5,
    medio: 12,
    alto: 20
    // Acima de 20 é crítico
  };

  // Função para determinar a cor da célula com base no nível de risco
  const getCorNivel = (nivel) => {
    if (nivel === null || nivel === undefined) return '#f8f9fa'; // Cinza claro para nulo
    if (nivel <= limites.baixo) return cores.baixo;
    if (nivel <= limites.medio) return cores.medio;
    if (nivel <= limites.alto) return cores.alto;
    return cores.critico;
  };

  // Cria a estrutura da matriz (5x5)
  const matriz = Array(niveis.probabilidade.length).fill(null).map(() => Array(niveis.impacto.length).fill(null).map(() => []));

  // Preenche a matriz com os riscos
  data.forEach(risco => {
    const p = tipo === 'residual' ? risco.probabilidade_residual : risco.probabilidade;
    const i = tipo === 'residual' ? risco.impacto_residual : risco.impacto;
    const nivel = tipo === 'residual' ? risco.nivel_residual : risco.nivel_inerente;

    // Verifica se probabilidade e impacto são válidos e dentro dos limites da matriz
    if (p !== null && i !== null && p >= 1 && p <= 5 && i >= 1 && i <= 5) {
      // Índices são base 0 (p-1, i-1), mas a matriz visual é Probabilidade (linhas) x Impacto (colunas)
      // Probabilidade aumenta de baixo para cima, Impacto da esquerda para direita
      const linhaIndex = niveis.probabilidade.length - p; // Inverte a linha (5 fica na linha 0)
      const colunaIndex = i - 1;
      matriz[linhaIndex][colunaIndex].push({ id: risco.id, nome: risco.nome, nivel: nivel });
    }
  });

  return (
    <div style={{ marginTop: '1rem', overflowX: 'auto' }}>
      <h4 style={{ textAlign: 'center', marginBottom: '1rem' }}>
        Matriz de Risco {tipo === 'residual' ? 'Residual' : 'Inerente'}
      </h4>
      <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '600px', border: '1px solid #ccc' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '8px', background: '#eee', width: '80px' }}>Prob.</th>
            {niveis.impacto.map(i => (
              <th key={`impacto-${i}`} style={{ border: '1px solid #ccc', padding: '8px', background: '#eee', textAlign: 'center' }}>
                Impacto {i}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {niveis.probabilidade.slice().reverse().map((p, rowIndex) => ( // Itera de 5 a 1
            <tr key={`prob-${p}`}>
              <td style={{ border: '1px solid #ccc', padding: '8px', background: '#eee', fontWeight: 'bold', textAlign: 'center' }}>
                {p}
              </td>
              {niveis.impacto.map((i, colIndex) => {
                const nivelCalculado = p * i;
                const cor = getCorNivel(nivelCalculado);
                const riscosNaCelula = matriz[rowIndex][colIndex]; // Usa rowIndex (0 a 4)
                
                return (
                  <td key={`cell-${p}-${i}`} style={{
                    border: '1px solid #ccc',
                    padding: '8px',
                    backgroundColor: cor,
                    verticalAlign: 'top',
                    minHeight: '60px', // Garante altura mínima
                    height: 'auto'
                  }}>
                    {riscosNaCelula.length > 0 ? (
                      <ul style={{ margin: 0, paddingLeft: '15px', fontSize: '0.8rem' }}>
                        {riscosNaCelula.map(risco => (
                          <li key={risco.id} title={`Risco: ${risco.nome}\nNível: ${risco.nivel}`}>
                            <a href={`/riscos/${risco.id}`} style={{ color: '#0056b3', textDecoration: 'none' }}>
                              #{risco.id} (N: {risco.nivel})
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span style={{ color: '#aaa', fontSize: '0.8rem' }}>-</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {/* Legenda */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '1rem', fontSize: '0.85rem' }}>
        <span style={{ padding: '3px 6px', borderRadius: '4px', backgroundColor: cores.baixo }}>Baixo (&le;{limites.baixo})</span>
        <span style={{ padding: '3px 6px', borderRadius: '4px', backgroundColor: cores.medio }}>Médio (&le;{limites.medio})</span>
        <span style={{ padding: '3px 6px', borderRadius: '4px', backgroundColor: cores.alto }}>Alto (&le;{limites.alto})</span>
        <span style={{ padding: '3px 6px', borderRadius: '4px', backgroundColor: cores.critico }}>Crítico (&gt;{limites.alto})</span>
      </div>
    </div>
  );
};

MatrizRisco.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    nome: PropTypes.string,
    probabilidade: PropTypes.number,
    impacto: PropTypes.number,
    nivel_inerente: PropTypes.number,
    probabilidade_residual: PropTypes.number,
    impacto_residual: PropTypes.number,
    nivel_residual: PropTypes.number
  })).isRequired,
  tipo: PropTypes.oneOf(['inerente', 'residual'])
};

export default MatrizRisco;

