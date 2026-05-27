import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  return (
    <article className="product-card">
      <div className="product-image-frame">
        <img src={product.image} alt={product.name} className="product-image" />
      </div>
      <div className="product-content">
        <div className="product-tags-row">
          <span className="product-tag">{product.rarity}</span>
          <span className="product-year">{product.year}</span>
        </div>
        <h3>{product.name}</h3>
        <p className="product-meta">{product.team} • {product.brand}</p>
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <div>
            <strong>R$ {product.price.toFixed(2)}</strong>
            <p>{product.viewCount || 0} visualizações</p>
          </div>
          <Link to={`/produto/${product._id}`}>Explorar</Link>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;