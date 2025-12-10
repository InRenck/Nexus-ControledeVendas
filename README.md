# Nexus

> Sistema de gestão comercial (ERP) offline para Windows. / Offline Desktop ERP for Windows.

![Status](https://img.shields.io/badge/Status-Concluído-success)
![Platform](https://img.shields.io/badge/Platform-Windows-blue)
![Tech](https://img.shields.io/badge/Tech-Electron%20%7C%20React%20%7C%20Vite-violet)

<div align="center">
  <p><strong>Select your language / Selecione seu idioma</strong></p>
  <a href="#-português">🇧🇷 Português</a> &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; <a href="#-english">🇺🇸 English</a>
</div>

---

<div id="-português"></div>

## 🇧🇷 Português

### 💻 Sobre o Projeto

O **Nexus** é um sistema de gestão robusto reconstruído do zero como uma aplicação **Desktop Nativa** para Windows, eliminando a dependência de internet.

O foco do projeto é oferecer uma interface moderna, responsiva e rápida para gerenciamento de pequenas empresas, garantindo que os dados fiquem salvos localmente no computador do usuário, oferecendo total privacidade e agilidade.

### ✨ Funcionalidades Principais

- **📊 Dashboard Gerencial:** Visão rápida do faturamento, total de vendas e alertas de estoque baixo.
- **📦 Controle de Estoque:** Adicionar, listar e excluir produtos. O sistema avisa quando o estoque está acabando.
- **💰 Frente de Caixa (Vendas):** Realiza vendas abatendo automaticamente do estoque e gerando histórico financeiro.
- **📝 Gestão de Pedidos:** Criação de orçamentos/pedidos pendentes que podem ser transformados em vendas com um clique.
- **⚖️ Módulo Fiscal:** Estimativa de impostos (DAS/Simples Nacional) baseada no faturamento mensal.
- **💾 Banco de Dados Local:** Persistência de dados offline (sem necessidade de servidor ou internet).

### 🛠 Tecnologias Utilizadas

- **[Electron](https://www.electronjs.org/):** Para criar a janela do aplicativo Windows.
- **[React](https://reactjs.org/):** Para criar as interfaces (telas).
- **[Vite](https://vitejs.dev/):** Para compilação super rápida.
- **[Electron Store](https://github.com/sindresorhus/electron-store):** Para salvar os dados em arquivos JSON no computador.
- **CSS Modules:** Para estilização organizada e moderna.

### 🚀 Como Rodar o Projeto (Desenvolvimento)

Se você quiser editar o código, siga os passos:

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/InRenck/Nexus-ControledeVendas.git](https://github.com/InRenck/Nexus-ControledeVendas.git)
    cd nexus-desktop
    ```
2.  **Instale as dependências:**
    ```bash
    npm install
    ```
3.  **Rode em modo de desenvolvimento:**
    ```bash
    npm run dev
    ```

### 📦 Como Gerar o Executável (.exe)

Para criar o instalador para enviar para clientes ou usar em outro PC:

1.  Pare o terminal de desenvolvimento.
2.  Rode o comando de build:
    ```bash
    npm run build
    ```
3.  O instalador estará na pasta: `dist/win-unpacked/` ou `dist/Nexus Setup 1.0.0.exe`

---

<div id="-english"></div>

## 🇺🇸 English

### 💻 About the Project

**Nexus** is a robust management system rebuilt from scratch as a **Native Desktop Application** for Windows, eliminating internet dependency.

The project focuses on providing a modern, responsive, and fast interface for small business management, ensuring data is saved locally on the user's computer, offering total privacy and agility.

### ✨ Key Features

- **📊 Managerial Dashboard:** Quick view of billing, total sales, and low stock alerts.
- **📦 Inventory Control:** Add, list, and delete products. The system warns when stock is running low.
- **💰 Point of Sale (POS):** Performs sales automatically deducting from inventory and generating financial history.
- **📝 Order Management:** Creation of quotes/pending orders that can be transformed into sales with one click.
- **⚖️ Fiscal Module:** Tax estimation (based on local tax regimes) based on monthly billing.
- **💾 Local Database:** Offline data persistence (no need for server or internet).

### 🛠 Technologies Used

- **[Electron](https://www.electronjs.org/):** To create the Windows application window.
- **[React](https://reactjs.org/):** To create the interfaces (screens).
- **[Vite](https://vitejs.dev/):** For super fast compilation.
- **[Electron Store](https://github.com/sindresorhus/electron-store):** To save data in JSON files on the computer.
- **CSS Modules:** For organized and modern styling.

### 🚀 How to Run the Project (Development)

If you want to edit the code, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/InRenck/Nexus-ControledeVendas.git](https://github.com/InRenck/Nexus-ControledeVendas.git)
    cd nexus-desktop
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run in development mode:**
    ```bash
    npm run dev
    ```

### 📦 How to Generate the Executable (.exe)

To create the installer to send to clients or use on another PC:

1.  Stop the development terminal.
2.  Run the build command:
    ```bash
    npm run build
    ```
3.  The installer will be in the folder: `dist/win-unpacked/` or `dist/Nexus Setup 1.0.0.exe`

---

### Author

**In Renck**

---

**Note:** This project is 100% offline. Make regular backups of the application data folder if you format your computer.
