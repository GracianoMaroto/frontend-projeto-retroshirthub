import { useEffect, useState } from 'react';
import ProductGrid from '../components/ProductGrid';
import { fetchFavorites, removeFavorite } from '../services/api';

function FavoritesPage({ auth }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  async function loadFavorites() {
    try {
      setLoading(true);
      const data = await fetchFavorites();
      setProducts(data);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFavorites();
  }, [auth?.token]);

  async function handleRemove(productId) {
    try {
      await removeFavorite(productId);
      setMessage('Favorito removido');
      await loadFavorites();
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <div className="favorites-page">
      <section className="section-intro">
        <div>
          <p className="eyebrow">Sua coleção</p>
          <h2>{auth?.user ? `${auth.user.name}, seus favoritos` : 'Favoritos da sessão atual'}</h2>
          <p>
            {auth?.user
              ? 'Todos os itens abaixo estão associados à sua conta demo e ficam prontos para você continuar navegando.'
              : 'Ainda não há conta ativa? Você pode explorar e salvar itens na sessão atual.'}
          </p>
        </div>
      </section>

      {message && <p className="success-copy">{message}</p>}
      {loading ? <p className="loading-state">Carregando favoritos...</p> : <ProductGrid products={products} />}
      {!loading && products.length === 0 && (
        <p className="empty-state">Nenhum favorito ainda. Explore o catálogo para descobrir peças exclusivas.</p>
      )}
    </div>
  );
}

export default FavoritesPage;