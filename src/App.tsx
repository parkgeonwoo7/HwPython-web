import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Templates } from './pages/Templates';
import { ProblemCreation } from './pages/ProblemCreation';
import { Layout } from './components/Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Templates />} />
          <Route path="create/:templateName" element={<ProblemCreation />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;