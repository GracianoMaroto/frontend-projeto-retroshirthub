import { Link } from 'react-router-dom';

function PopularSection({ products }) {
  return (
    <section className="popular-section">
      <div className="section-header">
        <div>
          <p className="eyebrow">Ranking em tempo real</p>
          <h2>Camisas mais vistas e queridinhas</h2>
        </div>
        <Link to="/populares">Ver ranking completo</Link>
      </div>

      <div className="popular-grid">
        {products.map((product, index) => (
          <article key={product._id} className="popular-card">
            <span>#{index + 1}</span>
            <h3>{product.name}</h3>
            <p>{product.team}</p>
            <strong>{product.viewCount || 0} visualizações</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

export default PopularSection;