import React, { useState, useEffect } from 'react';
// import { collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore'; // <-- ISSO SAIU
import styles from './Page.module.css'; 

const Estoque = () => {
  const [estoque, setEstoque] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [nomeItem, setNomeItem] = useState('');
  const [qtdItem, setQtdItem] = useState(''); 
  const [valorItem, setValorItem] = useState(''); 

  useEffect(() => {
    async function carregarDados() {
      const dadosSalvos = await window.api.db.get('estoque');
      setEstoque(dadosSalvos || []);
      setLoading(false);
    }
    carregarDados();
  }, []);
  
  const handleAddItem = async (e) => {
      e.preventDefault();
      if(nomeItem.trim() === '') return;
      
      const novoItem = {
          id: Date.now(), 
          nome: nomeItem,
          estoque: Number(qtdItem),
          valor: Number(valorItem),
          dataAtualizacao: new Date().toLocaleDateString('pt-BR')
      };
      
      const novaLista = [...estoque, novoItem];

      setEstoque(novaLista);

      await window.api.db.set('estoque', novaLista);
      
      setNomeItem('');
      setQtdItem('');
      setValorItem('');
  }

  const handleDeleteItem = async (id) => {
      if(window.confirm("Tem certeza que deseja excluir este item?")) {
          const novaLista = estoque.filter(item => item.id !== id);
          
          setEstoque(novaLista);

          await window.api.db.set('estoque', novaLista);
      }
  }

  if (loading) return <p>Carregando estoque...</p>;

  return (
    <div>
      <header className={styles.header}>
        <h2 className={styles.title}>Controle de Estoque (Offline)</h2>
      </header>

      {/* Formulário */}
      <div className={styles.formContainer}>
        <h3>Adicionar Novo Item</h3>
        <form onSubmit={handleAddItem} className={styles.formFields}>
          <input type="text" value={nomeItem} onChange={e => setNomeItem(e.target.value)} placeholder="Nome do Item" required/>
          <input type="number" value={qtdItem} onChange={e => setQtdItem(e.target.value)} placeholder="Quantidade" required/>
          <input type="number" step="0.01" value={valorItem} onChange={e => setValorItem(e.target.value)} placeholder="Valor" required/>
          <button type="submit">Salvar Item</button>
        </form>
      </div>
      
      {/* Tabela */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Quantidade</th>
              <th>Valor</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {estoque.length === 0 && (
                <tr><td colSpan="4" style={{textAlign: 'center', padding: '20px'}}>Nenhum item no estoque ainda.</td></tr>
            )}
            {estoque.map(item => (
              <tr key={item.id}>
                <td>{item.nome}</td>
                <td>{item.estoque}</td>
                <td>R$ {item.valor.toFixed(2)}</td>
                <td className={styles.actions}>
                  <button onClick={() => handleDeleteItem(item.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Estoque;