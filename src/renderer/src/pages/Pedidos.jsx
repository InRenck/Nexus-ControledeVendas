import React, { useState, useEffect } from 'react';
import styles from './Page.module.css'; 

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [estoque, setEstoque] = useState([]);
  
  const [cliente, setCliente] = useState('');
  const [produtoId, setProdutoId] = useState('');
  const [qtd, setQtd] = useState(1);

  useEffect(() => {
    async function carregarDados() {
      const estoqueSalvo = await window.api.db.get('estoque') || [];
      const pedidosSalvos = await window.api.db.get('pedidos') || []; 
      setEstoque(estoqueSalvo);
      setPedidos(pedidosSalvos);
    }
    carregarDados();
  }, []);

  const handleCriarPedido = async (e) => {
    e.preventDefault();
    const produto = estoque.find(item => item.id === Number(produtoId));
    if (!produto) return;

    const novoPedido = {
      id: Date.now(),
      cliente: cliente,
      produtoNome: produto.nome,
      produtoId: produto.id,
      qtd: Number(qtd),
      valorTotal: produto.valor * Number(qtd),
      status: 'Pendente' 
    };

    const novaLista = [novoPedido, ...pedidos];
    setPedidos(novaLista);
    await window.api.db.set('pedidos', novaLista);
    
    setCliente('');
    setQtd(1);
    alert("Pedido agendado com sucesso!");
  };

  const handleFinalizarPedido = async (pedido) => {
    if(!window.confirm(`Confirmar venda para ${pedido.cliente}?`)) return;

    const estoqueAtual = await window.api.db.get('estoque') || [];
    const itemNoEstoque = estoqueAtual.find(i => i.id === pedido.produtoId);

    if (!itemNoEstoque || itemNoEstoque.estoque < pedido.qtd) {
      alert("Erro: Estoque insuficiente para finalizar este pedido!");
      return;
    }

    const vendasAtuais = await window.api.db.get('vendas') || [];
    const novaVenda = {
        id: Date.now(),
        produto: pedido.produtoNome,
        qtd: pedido.qtd,
        total: pedido.valorTotal,
        data: new Date().toLocaleString('pt-BR') + ` (Cliente: ${pedido.cliente})`
    };
    await window.api.db.set('vendas', [novaVenda, ...vendasAtuais]);

    const estoqueAtualizado = estoqueAtual.map(item => {
        if(item.id === pedido.produtoId) {
            return { ...item, estoque: item.estoque - pedido.qtd };
        }
        return item;
    });
    await window.api.db.set('estoque', estoqueAtualizado);
    setEstoque(estoqueAtualizado); 

    const pedidosAtualizados = pedidos.filter(p => p.id !== pedido.id);
    setPedidos(pedidosAtualizados);
    await window.api.db.set('pedidos', pedidosAtualizados);

    alert("Venda realizada e estoque atualizado!");
  };

  const handleExcluirPedido = async (id) => {
      const novaLista = pedidos.filter(p => p.id !== id);
      setPedidos(novaLista);
      await window.api.db.set('pedidos', novaLista);
  };

  return (
    <div>
      <header className={styles.header}>
        <h2 className={styles.title}>Gerenciar Pedidos</h2>
      </header>

      <div className={styles.formContainer}>
        <h3>Novo Pedido</h3>
        <form onSubmit={handleCriarPedido} className={styles.formFields}>
          <input 
            type="text" 
            placeholder="Nome do Cliente" 
            value={cliente} 
            onChange={e => setCliente(e.target.value)} 
            required 
          />
          
          <select 
            value={produtoId} 
            onChange={e => setProdutoId(e.target.value)} 
            required
            style={{padding: '14px', borderRadius: '8px', border: '2px solid #e2e8f0', minWidth: '200px'}}
          >
            <option value="">Escolha o Produto...</option>
            {estoque.map(p => (
              <option key={p.id} value={p.id}>{p.nome}</option>
            ))}
          </select>

          <input 
            type="number" 
            min="1" 
            value={qtd} 
            onChange={e => setQtd(e.target.value)} 
            placeholder="Qtd" 
            required 
            style={{maxWidth: '100px'}}
          />

          <button type="submit">Gerar Pedido</button>
        </form>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Produto</th>
              <th>Total</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.length === 0 && <tr><td colSpan="5">Nenhum pedido pendente.</td></tr>}
            {pedidos.map(pedido => (
              <tr key={pedido.id}>
                <td>{pedido.cliente}</td>
                <td>{pedido.produtoNome} ({pedido.qtd}x)</td>
                <td>R$ {pedido.valorTotal.toFixed(2)}</td>
                <td><span style={{backgroundColor: '#f39c12', color:'white', padding:'4px 8px', borderRadius:'4px', fontSize:'12px'}}>Pendente</span></td>
                <td className={styles.actions} style={{display:'flex', gap:'10px'}}>
                  <button 
                    onClick={() => handleFinalizarPedido(pedido)}
                    style={{backgroundColor: '#2ecc71', borderColor: '#27ae60', color: 'white'}}
                  >
                    ✅ Vender
                  </button>
                  <button onClick={() => handleExcluirPedido(pedido.id)}>
                    ❌ Cancelar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Pedidos;