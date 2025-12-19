import React, { useState, useEffect } from 'react';
import styles from './Page.module.css';

const Fiscal = () => {
  const [vendas, setVendas] = useState([]);
  const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth());
  const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear());
  const [aliquota, setAliquota] = useState(6); // % Imposto

  const [dadosMes, setDadosMes] = useState([]);
  const [faturamentoMes, setFaturamentoMes] = useState(0);
  const [impostoEstimado, setImpostoEstimado] = useState(0);

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    filtrarDados();
  }, [vendas, mesSelecionado, anoSelecionado, aliquota]);

  async function carregarDados() {
    const vendasSalvas = await window.api.db.get('vendas') || [];
    setVendas(vendasSalvas);
  }

  const filtrarDados = () => {
    const vendasFiltradas = vendas.filter(venda => {
      try {
        const partes = venda.data.split(',')[0].split('/'); // Pega só a data
        const mesVenda = parseInt(partes[1]) - 1; // Meses no JS são 0-11
        const anoVenda = parseInt(partes[2]);
        
        return mesVenda === parseInt(mesSelecionado) && anoVenda === parseInt(anoSelecionado);
      } catch (e) {
        return false;
      }
    });

    setDadosMes(vendasFiltradas);

    const total = vendasFiltradas.reduce((acc, item) => acc + item.total, 0);
    setFaturamentoMes(total);
    setImpostoEstimado(total * (aliquota / 100));
  };

  const handleExportarRelatorio = () => {
    if (dadosMes.length === 0) {
      alert("Não há dados neste mês para exportar.");
      return;
    }

    let csvContent = "Data,Produto,Qtd,Valor Total,Cliente\n";

    dadosMes.forEach(venda => {
      const produtoLimpo = venda.produto.replace(/,/g, ''); 
      const dataLimpa = venda.data.replace(/,/g, ' '); 
      
      const linha = `${dataLimpa},${produtoLimpo},${venda.qtd},${venda.total.toFixed(2)},CLIENTE BALCAO`;
      csvContent += linha + "\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Relatorio_Fiscal_${mesSelecionado + 1}_${anoSelecionado}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <header className={styles.header}>
        <h2 className={styles.title}>Módulo Fiscal & Relatórios</h2>
        <button 
          onClick={handleExportarRelatorio}
          style={{
            backgroundColor: '#27ae60', 
            color: 'white', 
            border: 'none', 
            padding: '10px 20px', 
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          📂 Exportar para Contador
        </button>
      </header>

      <div className={styles.formContainer}>
        <div className={styles.formFields}>
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

          <input 
            type="number" 
            value={anoSelecionado} 
            onChange={e => setAnoSelecionado(e.target.value)}
            style={{maxWidth: '100px'}} 
          />

          <div style={{display:'flex', alignItems:'center', gap:'10px', flex: 1, justifyContent: 'flex-end'}}>
            <label>Alíquota Simples (%):</label>
            <input 
              type="number" 
              value={aliquota} 
              onChange={e => setAliquota(e.target.value)} 
              style={{maxWidth: '80px'}}
            />
          </div>
        </div>
      </div>

      {/* RESUMO GRÁFICO (BARRAS CSS) */}
      <div style={{padding: '0 40px', marginBottom: '30px'}}>
        <div style={{display: 'flex', gap: '20px'}}>
          <div style={{flex: 1, background: '#fff', padding: '20px', borderRadius: '10px', borderLeft: '5px solid #3498db', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'}}>
            <small style={{color:'#7f8c8d', textTransform:'uppercase'}}>Faturamento Bruto</small>
            <div style={{fontSize: '28px', fontWeight: 'bold', color:'#2c3e50'}}>R$ {faturamentoMes.toFixed(2)}</div>
          </div>
          <div style={{flex: 1, background: '#fff', padding: '20px', borderRadius: '10px', borderLeft: '5px solid #e74c3c', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'}}>
            <small style={{color:'#7f8c8d', textTransform:'uppercase'}}>Imposto Estimado</small>
            <div style={{fontSize: '28px', fontWeight: 'bold', color:'#c0392b'}}>R$ {impostoEstimado.toFixed(2)}</div>
          </div>
          <div style={{flex: 1, background: '#fff', padding: '20px', borderRadius: '10px', borderLeft: '5px solid #2ecc71', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'}}>
            <small style={{color:'#7f8c8d', textTransform:'uppercase'}}>Líquido Estimado</small>
            <div style={{fontSize: '28px', fontWeight: 'bold', color:'#27ae60'}}>R$ {(faturamentoMes - impostoEstimado).toFixed(2)}</div>
          </div>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <h3 style={{padding: '20px', borderBottom:'1px solid #eee', margin: 0}}>Livro Caixa - {parseInt(mesSelecionado)+1}/{anoSelecionado}</h3>
        <div style={{maxHeight: '400px', overflowY: 'auto'}}>
          <table className={styles.table}>
            <thead style={{position: 'sticky', top: 0}}>
              <tr>
                <th>Data / Hora</th>
                <th>Produto</th>
                <th>Qtd</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {dadosMes.length === 0 ? (
                <tr><td colSpan="4" style={{textAlign:'center', padding: '30px'}}>Nenhuma venda neste período.</td></tr>
              ) : (
                dadosMes.map((venda, index) => (
                  <tr key={index}>
                    <td>{venda.data}</td>
                    <td>{venda.produto}</td>
                    <td>{venda.qtd}</td>
                    <td>R$ {venda.total.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Fiscal;