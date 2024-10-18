import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Layout from './components/Layout';
import Profile from './pages/Profile';
import Create from './pages/Create';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} /> 
          <Route path="/profile" element={<Profile />} /> 
          <Route path="/create" element={<Create />} />   
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;