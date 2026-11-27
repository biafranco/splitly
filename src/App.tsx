
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Groups } from './pages/Groups';
  
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="groups" element={<Groups />} />
          <Route path="expenses" element={<h2>Despesas</h2>} />
          <Route path="settlements" element={<h2>Acertos</h2>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
