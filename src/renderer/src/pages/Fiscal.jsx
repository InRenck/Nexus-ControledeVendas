import React, { useState, useEffect } from 'react';
import styles from './Page.module.css';

const Fiscal = () => {
  const [vendas, setVendas] = useState([]);
  const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth());
  const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear());
  const [aliquota, setAliquota] = useState(6); 
  
  const [faturamentoMes, setFaturamentoMes] = useState(0);
  const [impostoEstimado, setImpostoEstimado] = useState(0);

  useEffect(() => {
    async function carregarDados() {
      const vendasSalvas = await window.api.db.get('vendas') || [];
      setVendas(vendasSalvas);
    }
    carregarDados();
  }, []);

  useEffect(() => {
    calcularImpostos();
  }, [vendas, mesSelecionado, anoSelecionado, aliquota]);

  const calcularImpostos = () => {
    const vendasDoMes = vendas.filter(venda => {
      
      try {
        const partesData = venda.data.split('/')[1]; 
        const partesAno = venda.data.split('/')[2].substring(0, 4); 
        

        
        const mesVenda = parseInt(partesData) - 1; 
        const anoVenda = parseInt(partesAno);

        return mesVenda === parseInt(mesSelecionado) && anoVenda === parseInt(anoSelecionado);
      } catch (e) {
        return false;
      }
    });

    const total = vendasDoMes.reduce((acc, item) => acc + item.total, 0);
    setFaturamentoMes(total);
    setImpostoEstimado(total * (aliquota / 100));
  };

  return (
    <div>
      <header className={styles.header}>
        <h2 className={styles.title}>Controle Fiscal (Estimativa)</h2>
      </header>

      <div className={styles.formContainer}>
        <h3>Configuração do Período</h3>
        <div className={styles.formFields}>
          
          { }
          <select 
            value={mesSelecionado} 
            onChange={e => setMesSelecionado(e.target.value)}
            style={{minWidth: '150px'}}
          >
            <option value="0">Janeiro</option>
            <option value="1">Fevereiro</option>
            <option value="2">Março</option>
            <option value="3">Abril</option>
            <option value="4">Maio</option>
            <option value="5">Junho</option>
            <option value="6">Julho</option>
            <option value="7">Agosto</option>
            <option value="8">Setembro</option>
            <option value="9">Outubro</option>
            <option value="10">Novembro</option>
            <option value="11">Dezembro</option>
          </select>

          { }
          <input 
            type="number" 
            value={anoSelecionado} 
            onChange={e => setAnoSelecionado(e.target.value)}
            style={{maxWidth: '100px'}} 
          />

          { }
          <div style={{display:'flex', alignItems:'center', gap:'10px', flex: 1}}>
            <label>Imposto (%):</label>
            <input 
              type="number" 
              value={aliquota} 
              onChange={e => setAliquota(e.target.value)} 
              placeholder="Ex: 6"
            />
          </div>
        </div>
      </div>

      { }
      <div style={{display: 'flex', gap: '20px', padding: '0 40px'}}>
        
        <div style={{
          flex: 1, 
          background: 'white', 
          padding: '20px', 
          borderRadius: '10px', 
          borderLeft: '5px solid #3498db',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
        }}>
          <h4 style={{color:'#7f8c8d'}}>Faturamento no Mês</h4>
          <p style={{fontSize: '24px', fontWeight: 'bold', color:'#2c3e50', marginTop:'10px'}}>
            R$ {faturamentoMes.toFixed(2)}
          </p>
        </div>

        <div style={{
          flex: 1, 
          background: 'white', 
          padding: '20px', 
          borderRadius: '10px', 
          borderLeft: '5px solid #e74c3c',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
        }}>
          <h4 style={{color:'#7f8c8d'}}>Imposto Estimado a Pagar</h4>
          <p style={{fontSize: '24px', fontWeight: 'bold', color:'#c0392b', marginTop:'10px'}}>
            R$ {impostoEstimado.toFixed(2)}
          </p>
        </div>

      </div>

      <div className={styles.tableContainer} style={{marginTop: '30px'}}>
        <h3 style={{padding: '20px', borderBottom:'1px solid #eee'}}>Detalhe das Vendas do Período</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Data</th>
              <th>Produto</th>
              <th>Valor Total</th>
            </tr>
          </thead>
          <tbody>
            {vendas.length === 0 ? (
               <tr><td colSpan="3">Nenhuma venda registrada no sistema.</td></tr>
            ) : (
               <tr><td colSpan="3" style={{textAlign:'center'}}>Consulte a aba Vendas para detalhes individuais.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Fiscal;