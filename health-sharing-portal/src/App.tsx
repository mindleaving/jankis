import { Route, Routes } from 'react-router-dom';
import { Layout } from './Layout';
import { CreateEditStudyPage } from './pages/CreateEditStudyPage';
import { HomePage } from './pages/HomePage';
import { StudiesPage } from './pages/StudiesPage';
import { StudyPage } from './pages/StudyPage';
import './styles/App.css';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/create/study" element={<CreateEditStudyPage />} />
        <Route path="/edit/study/:id" element={<CreateEditStudyPage />} />
        <Route path="/study/:id" element={<StudyPage />} />
        <Route path="/studies" element={<StudiesPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Layout>
  );
}

export default App;
