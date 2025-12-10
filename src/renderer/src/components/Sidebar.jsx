import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const styles = {
    menu: {
      width: '240px', 
      height: '100%',
      background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)', 
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      boxShadow: '4px 0 10px rgba(0,0,0,0.1)', 
      zIndex: 10
    },
    logo: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '40px',
      textAlign: 'center',
      color: '#4cc9f0', 
      letterSpacing: '1px'
    },
    link: (path) => ({
      textDecoration: 'none',
      color: location.pathname === path ? '#fff' : '#a0a0b0', 
      backgroundColor: location.pathname === path ? 'rgba(255,255,255,0.1)' : 'transparent',
      padding: '12px 15px',
      borderRadius: '8px',
      marginBottom: '8px',
      fontSize: '16px',
      transition: 'all 0.3s ease',
      borderLeft: location.pathname === path ? '4px solid #4cc9f0' : '4px solid transparent',
      display: 'block'
    })
  };

  return (
    <div style={styles.menu}>
      <div style={styles.logo}>CONTROLE DE VENDAS</div>
      
      <nav>
        <Link to="/" style={styles.link('/')}>Dashboard</Link>
        <Link to="/estoque" style={styles.link('/estoque')}>Estoque</Link>
        <Link to="/vendas" style={styles.link('/vendas')}>Vendas</Link>
        <Link to="/pedidos" style={styles.link('/pedidos')}>Pedidos</Link>
        <Link to="/fiscal" style={styles.link('/fiscal')}> Fiscal </Link>
      </nav>
      
      <div style={{ marginTop: 'auto', fontSize: '12px', color: '#555', textAlign: 'center' }}>
        v1.0 Offline
      </div>
    </div>
  );
};

export default Sidebar;