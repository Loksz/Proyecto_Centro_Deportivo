import React from 'react';
import Header from './components/Header'; // Importar el componente Header
import Home from './pages/Home'; // Importar la página principal

const App: React.FC = () => {
    return (
        <div>
            <Header />
            <Home />
        </div>
    );
};

export default App;
