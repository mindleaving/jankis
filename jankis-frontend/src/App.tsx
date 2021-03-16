import React from 'react';
import { Switch } from 'react-router';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { NewsPage } from './pages/NewsPage';
import './styles/App.css';

function App() {
  return (
    <Layout>
      <Switch>
        <Route exact path="/">
          <NewsPage />
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
