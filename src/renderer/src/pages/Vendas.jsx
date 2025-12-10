import React, { useState, useEffect } from 'react';
import styles from './Page.module.css'; 

const Vendas = () => {
  const [vendas, setVendas] = useState([]);
  const [estoque, setEstoque] = useState([]); 
  
  const [produtoSelecionadoId, setProdutoSelecionadoId] = useState('');
  const [qtdVenda, setQtdVenda] = useState(1);

  useEffect(() => {
    async function carregarTudo() {
      const estoqueSalvo = await window.api.db.get('estoque') || [];
      const vendasSalvas = await window.api.db.get('vendas') || [];
      
      setEstoque(estoqueSalvo);
      setVendas(vendasSalvas);
    }
    carregarTudo();
  }, []);

  const handleVenda = async (e) => {
    e.preventDefault();

    const produtoAlvo = estoque.find(item => item.id === Number(produtoSelecionadoId));

    if (!produtoAlvo) {
      alert("Selecione um produto válido!");
      return;
    }

    if (produtoAlvo.estoque < qtdVenda) {
      alert("Estoque insuficiente para essa venda!");
      return;
    }

    const novoEstoque = estoque.map(item => {
      if (item.id === Number(produtoSelecionadoId)) {
        return { ...item, estoque: item.estoque - Number(qtdVenda) };
      }
      return item;
    });

    const novaVenda = {
      id: Date.now(),
      produto: produtoAlvo.nome,
      qtd: Number(qtdVenda),
      total: produtoAlvo.valor * Number(qtdVenda),
      data: new Date().toLocaleString('pt-BR')
    };
    
    const novasVendas = [novaVenda, ...vendas]; 

    await window.api.db.set('estoque', novoEstoque);
    await window.api.db.set('vendas', novasVendas);

    setEstoque(novoEstoque);
    setVendas(novasVendas);
    alert("Venda realizada com sucesso!");
  };

  return (
    <div>
      <header className={styles.header}>
        <h2 className={styles.title}>Registro de Vendas</h2>
      </header>

      <div className={styles.formContainer}>
        <h3>Nova Venda</h3>
        <form onSubmit={handleVenda} className={styles.formFields}>
          
          { }
          <select 
            value={produtoSelecionadoId} 
            onChange={(e) => setProdutoSelecionadoId(e.target.value)}
            required
            style={{padding: '10px', borderRadius: '5px', border: '1px solid #ddd'}}
          >
            <option value="">Selecione um Produto...</option>
            {estoque.map(item => (
              <option key={item.id} value={item.id}>
                {item.nome} (Disp: {item.estoque}) - R$ {item.valor}
              </option>
            ))}
          </select>

          <input 
            type="number" 
            min="1"
            value={qtdVenda} 
            onChange={e => setQtdVenda(e.target.value)} 
            placeholder="Qtd" 
            required
          />
          
          <button type="submit" style={{backgroundColor: '#27ae60'}}>Confirmar Venda</button>
        </form>
      </div>

      <div className={styles.tableContainer}>
        <h3>Histórico de Vendas</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Data</th>
              <th>Produto</th>
              <th>Qtd</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {vendas.length === 0 && <tr><td colSpan="4">Nenhuma venda registrada.</td></tr>}
            {vendas.map(venda => (
              <tr key={venda.id}>
                <td>{venda.data}</td>
                <td>{venda.produto}</td>
                <td>{venda.qtd}</td>
                <td>R$ {venda.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Vendas;