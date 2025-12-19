import React, { useState, useEffect } from 'react';
import styles from './Page.module.css';

const Pedidos = () => {
  const [comandas, setComandas] = useState([]);
  const [estoque, setEstoque] = useState([]);
  const [abaAtiva, setAbaAtiva] = useState('abertas'); 

  const [modalAberto, setModalAberto] = useState(false);
  const [comandaSelecionada, setComandaSelecionada] = useState(null);
  
  const [produtoId, setProdutoId] = useState('');
  const [qtd, setQtd] = useState(1);

  const [novaMesaNome, setNovaMesaNome] = useState('');

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    const estoqueSalvo = await window.api.db.get('estoque') || [];
    const comandasSalvas = await window.api.db.get('comandas') || []; 
    
    setEstoque(estoqueSalvo);
    setComandas(comandasSalvas);
  }

  const salvarComandas = async (novaLista) => {
    setComandas(novaLista);
    await window.api.db.set('comandas', novaLista);
  };


  const abrirNovaComanda = async (e) => {
    e.preventDefault();
    if (!novaMesaNome.trim()) return;

    const novaComanda = {
      id: Date.now(),
      nome: novaMesaNome,
      itens: [],
      total: 0,
      status: 'Aberto', 
      dataAbertura: new Date().toLocaleString('pt-BR')
    };

    await salvarComandas([novaComanda, ...comandas]);
    setNovaMesaNome('');
  };

  const adicionarItemNaComanda = async (e) => {
    e.preventDefault();
    if (!produtoId || !comandaSelecionada) return;

    const produto = estoque.find(p => p.id === Number(produtoId));
    if (!produto) return;

    const novoItem = {
      id: Date.now(), 
      produtoId: produto.id,
      nome: produto.nome,
      valorUnitario: produto.valor,
      qtd: Number(qtd),
      total: produto.valor * Number(qtd)
    };

    const comandasAtualizadas = comandas.map(c => {
      if (c.id === comandaSelecionada.id) {
        return {
          ...c,
          itens: [...c.itens, novoItem],
          total: c.total + novoItem.total
        };
      }
      return c;
    });

    await salvarComandas(comandasAtualizadas);
    
    const comandaAtualizada = comandasAtualizadas.find(c => c.id === comandaSelecionada.id);
    setComandaSelecionada(comandaAtualizada);
    
    setQtd(1); 
  };

  const removerItemDaComanda = async (itemId) => {
    if(!window.confirm("Remover este item da comanda?")) return;

    const comandasAtualizadas = comandas.map(c => {
      if (c.id === comandaSelecionada.id) {
        const itemRemovido = c.itens.find(i => i.id === itemId);
        const novoTotal = c.total - (itemRemovido ? itemRemovido.total : 0);
        return {
          ...c,
          itens: c.itens.filter(i => i.id !== itemId),
          total: novoTotal
        };
      }
      return c;
    });

    await salvarComandas(comandasAtualizadas);
    setComandaSelecionada(comandasAtualizadas.find(c => c.id === comandaSelecionada.id));
  };


  const fecharConta = async (tipoPagamento) => {
    if (!comandaSelecionada) return;
    if (comandaSelecionada.itens.length === 0) {
      alert("Comanda vazia! Adicione itens ou exclua a mesa.");
      return;
    }

    if (!window.confirm(`Confirmar fechamento (${tipoPagamento}) para ${comandaSelecionada.nome}?`)) return;

    const estoqueAtual = [...estoque];
    let erroEstoque = false;

    comandaSelecionada.itens.forEach(itemPedido => {
        const index = estoqueAtual.findIndex(p => p.id === itemPedido.produtoId);
        if (index !== -1) {
            if (estoqueAtual[index].estoque < itemPedido.qtd) {
                alert(`Atenção: Estoque de ${itemPedido.nome} ficará negativo!`);
            }
            estoqueAtual[index].estoque -= itemPedido.qtd;
        }
    });

    await window.api.db.set('estoque', estoqueAtual);
    setEstoque(estoqueAtual);

    if (tipoPagamento === 'Pago') {
        const vendasAtuais = await window.api.db.get('vendas') || [];
        const novaVenda = {
            id: Date.now(),
            produto: `Comanda: ${comandaSelecionada.nome}`,
            qtd: 1, 
            total: comandaSelecionada.total,
            data: new Date().toLocaleString('pt-BR'),
            detalhes: comandaSelecionada.itens 
        };
        await window.api.db.set('vendas', [novaVenda, ...vendasAtuais]);
        
        const novasComandas = comandas.filter(c => c.id !== comandaSelecionada.id);
        await salvarComandas(novasComandas);
        alert("Conta Fechada e Estoque Atualizado! 💰");
    } 
    
    else if (tipoPagamento === 'Fiado') {
        
        const novasComandas = comandas.map(c => {
            if (c.id === comandaSelecionada.id) {
                return { ...c, status: 'Fiado' };
            }
            return c;
        });
        await salvarComandas(novasComandas);
        alert("Conta movida para aba FIADOS. Estoque foi baixado. 📒");
    }

    setModalAberto(false);
    setComandaSelecionada(null);
  };

  const quitarFiado = async (comanda) => {
      if(!window.confirm(`Receber R$ ${comanda.total.toFixed(2)} de ${comanda.nome} agora?`)) return;

      // Agora sim o dinheiro entrou, registra na venda
      const vendasAtuais = await window.api.db.get('vendas') || [];
      const novaVenda = {
          id: Date.now(),
          produto: `Pagamento Fiado: ${comanda.nome}`,
          qtd: 1,
          total: comanda.total,
          data: new Date().toLocaleString('pt-BR')
      };
      await window.api.db.set('vendas', [novaVenda, ...vendasAtuais]);

      // Remove dos fiados
      const novasComandas = comandas.filter(c => c.id !== comanda.id);
      await salvarComandas(novasComandas);
      alert("Dívida quitada e registrada no caixa! ✅");
  };

  const excluirComandaVazia = async (id) => {
      if(!window.confirm("Excluir esta mesa?")) return;
      const novasComandas = comandas.filter(c => c.id !== id);
      await salvarComandas(novasComandas);
      if(modalAberto) setModalAberto(false);
  };

  // --- FILTROS ---
  const comandasFiltradas = comandas.filter(c => 
    abaAtiva === 'abertas' ? c.status === 'Aberto' : c.status === 'Fiado'
  );

  return (
    <div>
      <header className={styles.header}>
        <h2 className={styles.title}>Mesas & Comandas</h2>
        
        {/* Abas de Navegação */}
        <div style={{display:'flex', gap:'10px'}}>
            <button 
                onClick={() => setAbaAtiva('abertas')}
                style={{
                    padding: '8px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: 'bold',
                    background: abaAtiva === 'abertas' ? '#3498db' : '#ecf0f1',
                    color: abaAtiva === 'abertas' ? 'white' : '#7f8c8d'
                }}
            >
                🍻 Abertas ({comandas.filter(c=>c.status==='Aberto').length})
            </button>
            <button 
                onClick={() => setAbaAtiva('fiados')}
                style={{
                    padding: '8px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: 'bold',
                    background: abaAtiva === 'fiados' ? '#e74c3c' : '#ecf0f1',
                    color: abaAtiva === 'fiados' ? 'white' : '#7f8c8d'
                }}
            >
                📒 Fiados ({comandas.filter(c=>c.status==='Fiado').length})
            </button>
        </div>
      </header>

      {/* ÁREA DE MESAS ABERTAS */}
      {abaAtiva === 'abertas' && (
        <div style={{padding: '0 30px'}}>
            {/* Input Nova Mesa - COM VISUAL NOVO */}
            <div className={styles.formContainer} style={{
                display:'flex', 
                gap:'15px', 
                alignItems:'center', 
                margin:'0 0 30px 0',
                background: 'white',
                padding: '20px',
                borderRadius: '15px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
            }}>
                <div style={{
                    display: 'flex', 
                    alignItems: 'center', 
                    background: '#f8f9fa', 
                    borderRadius: '10px', 
                    padding: '0 15px', 
                    flex: 1, 
                    border: '2px solid #eee'
                }}>
                    <span style={{fontSize: '20px'}}>🏷️</span>
                    <input 
                        type="text" 
                        placeholder="Nome da Mesa ou Cliente (ex: Mesa 05)" 
                        value={novaMesaNome}
                        onChange={e => setNovaMesaNome(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && abrirNovaComanda(e)}
                        style={{
                            border: 'none', 
                            background: 'transparent', 
                            padding: '15px', 
                            fontSize: '16px', 
                            width: '100%', 
                            outline: 'none',
                            color: '#2c3e50'
                        }}
                    />
                </div>

                <button 
                    onClick={abrirNovaComanda} 
                    style={{
                        whiteSpace:'nowrap',
                        background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', // Degradê Azul Bonito
                        color: 'white',
                        border: 'none',
                        padding: '14px 30px',
                        borderRadius: '10px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        boxShadow: '0 4px 15px rgba(52, 152, 219, 0.4)', // Sombra colorida (Glow)
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'transform 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <span style={{fontSize: '20px', fontWeight: 'bold'}}>+</span> Abrir Mesa
                </button>
            </div>

            {/* Grid de Cartões */}
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', paddingBottom: '40px'}}>
                {comandasFiltradas.map(comanda => (
                    <div 
                        key={comanda.id}
                        onClick={() => { setComandaSelecionada(comanda); setModalAberto(true); }}
                        style={{
                            background: 'white', padding: '20px', borderRadius: '10px', cursor: 'pointer',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderTop: '4px solid #3498db',
                            transition: 'transform 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <h3 style={{margin: '0 0 10px 0', fontSize:'18px', color: '#2c3e50'}}>{comanda.nome}</h3>
                        <p style={{fontSize: '14px', color: '#7f8c8d'}}>{comanda.itens.length} itens</p>
                        <p style={{fontSize: '22px', fontWeight: 'bold', color: '#27ae60', marginTop: '10px'}}>
                            R$ {comanda.total.toFixed(2)}
                        </p>
                    </div>
                ))}
            </div>
        </div>
      )}

      {/* ÁREA DE FIADOS */}
      {abaAtiva === 'fiados' && (
          <div className={styles.tableContainer}>
              <table className={styles.table}>
                  <thead>
                      <tr>
                          <th>Cliente</th>
                          <th>Data Abertura</th>
                          <th>Valor Devido</th>
                          <th>Ação</th>
                      </tr>
                  </thead>
                  <tbody>
                      {comandasFiltradas.length === 0 && <tr><td colSpan="4" style={{textAlign:'center'}}>Ninguém te deve nada! 🎉</td></tr>}
                      {comandasFiltradas.map(c => (
                          <tr key={c.id}>
                              <td><strong>{c.nome}</strong></td>
                              <td>{c.dataAbertura}</td>
                              <td style={{color:'#c0392b', fontWeight:'bold'}}>R$ {c.total.toFixed(2)}</td>
                              <td>
                                  <button 
                                    onClick={() => quitarFiado(c)}
                                    style={{backgroundColor: '#2ecc71', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer'}}
                                  >
                                      Receber Pagamento
                                  </button>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      )}

      {/* MODAL DE DETALHES DA MESA */}
      {modalAberto && comandaSelecionada && (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
            <div style={{
                background: 'white', width: '90%', maxWidth: '600px', borderRadius: '12px', padding: '30px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', maxHeight: '90vh'
            }}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
                    <h2 style={{margin:0}}>📝 {comandaSelecionada.nome}</h2>
                    <button onClick={() => setModalAberto(false)} style={{background:'transparent', border:'none', fontSize:'24px', cursor:'pointer'}}>×</button>
                </div>

                {/* Adicionar Item */}
                <form onSubmit={adicionarItemNaComanda} style={{display:'flex', gap:'10px', marginBottom:'20px', background:'#f8f9fa', padding:'15px', borderRadius:'8px'}}>
                    <select 
                        value={produtoId} 
                        onChange={e => setProdutoId(e.target.value)} 
                        style={{flex:1, padding:'10px', borderRadius:'6px', border:'1px solid #ddd'}}
                        autoFocus
                    >
                        <option value="">+ Adicionar Produto...</option>
                        {estoque.map(p => (
                            <option key={p.id} value={p.id}>{p.nome} - R$ {p.valor.toFixed(2)}</option>
                        ))}
                    </select>
                    <input 
                        type="number" min="1" value={qtd} onChange={e => setQtd(e.target.value)}
                        style={{width:'60px', padding:'10px', borderRadius:'6px', border:'1px solid #ddd'}}
                    />
                    <button type="submit" style={{background:'#3498db', color:'white', border:'none', borderRadius:'6px', padding:'0 15px', cursor:'pointer', fontSize:'20px'}}>+</button>
                </form>

                {/* Lista de Itens */}
                <div style={{flex:1, overflowY:'auto', borderTop:'1px solid #eee', borderBottom:'1px solid #eee', marginBottom:'20px'}}>
                    {comandaSelecionada.itens.length === 0 ? <p style={{textAlign:'center', color:'#aaa'}}>Nenhum item adicionado.</p> : (
                        <table style={{width:'100%', textAlign:'left', borderCollapse:'collapse'}}>
                            <tbody>
                                {comandaSelecionada.itens.map(item => (
                                    <tr key={item.id} style={{borderBottom:'1px solid #f0f0f0'}}>
                                        <td style={{padding:'10px'}}>{item.nome} <small style={{color:'#7f8c8d'}}>({item.qtd}x)</small></td>
                                        <td style={{padding:'10px', textAlign:'right'}}>R$ {item.total.toFixed(2)}</td>
                                        <td style={{padding:'10px', width:'30px'}}>
                                            <span onClick={() => removerItemDaComanda(item.id)} style={{color:'#e74c3c', cursor:'pointer', fontWeight:'bold'}}>✕</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Total e Botões de Ação */}
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
                    <span style={{fontSize:'14px', color:'#e74c3c', cursor:'pointer'}} onClick={() => excluirComandaVazia(comandaSelecionada.id)}>Excluir Mesa</span>
                    <span style={{fontSize:'28px', fontWeight:'bold', color:'#2c3e50'}}>Total: R$ {comandaSelecionada.total.toFixed(2)}</span>
                </div>

                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px'}}>
                    <button 
                        onClick={() => fecharConta('Fiado')}
                        style={{padding:'15px', background:'#f1c40f', color:'#fff', border:'none', borderRadius:'8px', fontWeight:'bold', cursor:'pointer', fontSize:'16px'}}
                    >
                        📒 Pendurar (Fiado)
                    </button>
                    <button 
                        onClick={() => fecharConta('Pago')}
                        style={{padding:'15px', background:'#27ae60', color:'white', border:'none', borderRadius:'8px', fontWeight:'bold', cursor:'pointer', fontSize:'16px'}}
                    >
                        💰 Receber & Fechar
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default Pedidos;