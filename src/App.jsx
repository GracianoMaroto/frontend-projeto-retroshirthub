import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';
import FavoritesPage from './pages/FavoritesPage';
import HomePage from './pages/HomePage';
import PopularPage from './pages/PopularPage';
import ProductPage from './pages/ProductPage';
import { fetchMe, getStoredAuth, logoutUser } from './services/api';

function App() {
  const [auth, setAuth] = useState(getStoredAuth());

  useEffect(() => {
    async function syncAuth() {
      if (!auth.token) {
        return;
      }

      try {
        const response = await fetchMe();
        setAuth({ token: auth.token, user: response.user });
      } catch (_error) {
        await logoutUser();
        setAuth({ token: null, user: null });
      }
    }

    syncAuth();
  }, [auth.token]);

  async function handleLogout() {
    await logoutUser();
    setAuth({ token: null, user: null });
  }

  return (
    <div className="app-shell">
      <Navbar auth={auth} onLogout={handleLogout} />
      <main className="page-content">
        <Routes>
          <Route path="/" element={<HomePage auth={auth} />} />
          <Route path="/produto/:id" element={<ProductPage auth={auth} />} />
          <Route path="/favoritos" element={<FavoritesPage auth={auth} />} />
          <Route path="/populares" element={<PopularPage auth={auth} />} />
          <Route
            path="/auth"
            element={auth.token ? <Navigate to="/" replace /> : <AuthPage onAuth={setAuth} />} 
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;