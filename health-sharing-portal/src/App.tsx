import { Route, Routes } from 'react-router-dom';
import { Layout } from './Layout';
import { HomePage } from './pages/HomePage';
import './styles/App.css';

function App() {
  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={<HomePage />}
        />
        <Route
          path="*"
          element={<HomePage />}
        />
      </Routes>
    </Layout>
  );
}

export default App;
