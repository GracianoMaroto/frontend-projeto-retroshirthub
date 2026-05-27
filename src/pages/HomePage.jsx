import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FiltersPanel from '../components/FiltersPanel';
import PopularSection from '../components/PopularSection';
import ProductGrid from '../components/ProductGrid';
import { fetchPopularProducts, fetchProducts } from '../services/api';

function HomePage({ auth }) {
  const [search, setSearch] = useState('');
  const [rarity, setRarity] = useState('');
  const [sort, setSort] = useState('recent');
  const [products, setProducts] = useState([]);
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [productData, popularData] = await Promise.all([
          fetchProducts({ search, rarity, sort }),
          fetchPopularProducts()
        ]);

        setProducts(productData);
        setPopular(popularData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [search, rarity, sort]);

  const featuredProduct = products.find((product) => product.featured) || products[0];

  return (
    <div className="home-page">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Nicho, nostalgia e raridade</p>
          <h2>Camisas retrô com curadoria, ranking e identidade.</h2>
          <p>
            Descubra peças inéditas, siga os favoritos do seu perfil e acompanhe o ranking das camisas mais visualizadas.
          </p>
          <div className="hero-actions">
            <Link to="/populares" className="cta-button">Ver ranking</Link>
            <Link to="/auth" className="secondary-button">Entrar ou cadastrar</Link>
          </div>
        </div>

        <div className="hero-card-stack">
          <div className="stats-card">
            <strong>{products.length}</strong>
            <span>camisas no catálogo</span>
          </div>
          <div className="stats-card">
            <strong>{popular.length}</strong>
            <span>itens no ranking</span>
          </div>
          {auth?.user ? (
            <div className="stats-card profile-card">
              <span>Perfil ativo</span>
              <strong>{auth.user.name}</strong>
              <p>{auth.user.favoriteTeam} • {auth.user.city}</p>
            </div>
          ) : null}
        </div>
      </section>

      {featuredProduct ? (
        <section className="featured-highlight">
          <div>
            <p className="eyebrow">Peça em destaque</p>
            <h3>{featuredProduct.name}</h3>
            <p>{featuredProduct.description}</p>
          </div>
          <Link to={`/produto/${featuredProduct._id}`}>Abrir detalhes</Link>
        </section>
      ) : null}

      <FiltersPanel
        search={search}
        rarity={rarity}
        sort={sort}
        onSearchChange={setSearch}
        onRarityChange={setRarity}
        onSortChange={setSort}
      />

      {error && <p className="error-message">{error}</p>}
      {loading ? <p className="loading-state">Carregando catálogo...</p> : <ProductGrid products={products} />}
      <PopularSection products={popular} />
    </div>
  );
}

export default HomePage;