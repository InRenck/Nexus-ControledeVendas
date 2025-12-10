import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Estoque from './pages/Estoque';
import Vendas from './pages/Vendas';
import Pedidos from './pages/Pedidos';
import Fiscal from './pages/Fiscal';

function App() {
  return (
    <HashRouter>
      { }
      <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', backgroundColor: '#f3f4f6' }}>
        
        { }
        <Sidebar />

        { }
        <main style={{ 
          flex: 1, 
          overflowY: 'auto', 
          overflowX: 'hidden', 
          position: 'relative' 
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '50px' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/estoque" element={<Estoque />} />
              <Route path="/vendas" element={<Vendas />} />
              <Route path="/pedidos" element={<Pedidos/>} />
              <Route path="/fiscal" element={<Fiscal/>} />
            </Routes>
          </div>
        </main>
      </div>
    </HashRouter>
  );
}

export default App;