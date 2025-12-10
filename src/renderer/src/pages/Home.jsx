import React, { useState, useEffect } from 'react';
import styles from './Page.module.css'; 

const Home = () => {
  const [resumo, setResumo] = useState({
    faturamento: 0,
    qtdVendas: 0,
    baixoEstoque: []
  });

  useEffect(() => {
    async function carregarDashboard() {
      const estoque = await window.api.db.get('estoque') || [];
      const vendas = await window.api.db.get('vendas') || [];

      const totalFaturamento = vendas.reduce((acc, item) => acc + item.total, 0);

      const alertas = estoque.filter(item => item.estoque < 5);

      setResumo({
        faturamento: totalFaturamento,
        qtdVendas: vendas.length,
        baixoEstoque: alertas
      });
    }
    carregarDashboard(); 
  }, []); 

  const cardStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    flex: 1,
    textAlign: 'center',
    minWidth: '200px'
  };

  return (
    <div>
      <header className={styles.header}>
        <h2 className={styles.title}>Painel de Controle</h2>
      </header>

      <div style={{ padding: '20px' }}>
        { }
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '30px' }}>
          
          <div style={{...cardStyle, borderLeft: '5px solid #27ae60'}}>
            <h3 style={{color: '#7f8c8d'}}>Faturamento Total</h3>
            <p style={{fontSize: '28px', fontWeight: 'bold', color: '#2c3e50', margin: '10px 0'}}>
              R$ {resumo.faturamento.toFixed(2)}
            </p>
          </div>

          <div style={{...cardStyle, borderLeft: '5px solid #2980b9'}}>
            <h3 style={{color: '#7f8c8d'}}>Vendas Realizadas</h3>
            <p style={{fontSize: '28px', fontWeight: 'bold', color: '#2c3e50', margin: '10px 0'}}>
              {resumo.qtdVendas}
            </p>
          </div>

        </div>

        { }
        {resumo.baixoEstoque.length > 0 && (
          <div style={{ backgroundColor: '#fff3cd', padding: '20px', borderRadius: '8px', border: '1px solid #ffeeba' }}>
            <h3 style={{color: '#856404', marginTop: 0}}>⚠️ Alerta de Estoque Baixo</h3>
            <ul style={{paddingLeft: '20px'}}>
              {resumo.baixoEstoque.map(item => (
                <li key={item.id} style={{color: '#856404', marginBottom: '5px'}}>
                  <strong>{item.nome}</strong> só tem <strong>{item.estoque}</strong> unidades!
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;