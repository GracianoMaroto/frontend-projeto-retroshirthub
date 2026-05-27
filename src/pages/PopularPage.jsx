import { useEffect, useState } from 'react';
import { fetchPopularProducts } from '../services/api';

function PopularPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchPopularProducts();
        setProducts(data);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return <p className="loading-state">Carregando ranking...</p>;
  }

  return (
    <div className="popular-page">
      <section className="section-intro">
        <div>
          <p className="eyebrow">Ranking em tempo real</p>
          <h2>As camisas mais vistas da RetroShirt Hub</h2>
          <p>Contadores de visualização atualizados em tempo real para te orientar na descoberta de raridades.</p>
        </div>
      </section>

      <div className="popular-list">
        {products.map((product, index) => (
          <article key={product._id} className="rank-item">
            <span className="rank-number">#{index + 1}</span>
            <div>
              <h3>{product.name}</h3>
              <p>{product.team} • {product.brand}</p>
            </div>
            <strong>{product.viewCount || 0} visualizações</strong>
          </article>
        ))}
      </div>
    </div>
  );
}

export default PopularPage;