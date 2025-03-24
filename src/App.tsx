import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Upload } from './pages/Upload';
import { Preview } from './pages/Preview';
import { Result } from './pages/Result';
import { Translation } from './pages/Translation';
import { Layout } from './components/Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Upload />} />
          <Route path="preview" element={<Preview />} />
          <Route path="result" element={<Result />} />
          <Route path="translation" element={<Translation />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;