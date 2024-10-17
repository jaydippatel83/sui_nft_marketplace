import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Layout from './components/Layout';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} /> 
          <Route path="/profile" element={<Profile />} /> 
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;