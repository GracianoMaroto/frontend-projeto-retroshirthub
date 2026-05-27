import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { createOrder, fetchProduct, registerLike, toggleFavorite } from '../services/api';

function ProductPage({ auth }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [size, setSize] = useState('M');
  const [favoriteStatus, setFavoriteStatus] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const data = await fetchProduct(id);
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  useEffect(() => {
    if (auth?.user?.name) {
      setCustomerName(auth.user.name);
    }
  }, [auth]);

  const saleMessage = useMemo(() => {
    if (!product) return '';
    return `Compra simulada de ${product.name} no tamanho ${size}`;
  }, [product, size]);

  async function handleFavorite() {
    try {
      await toggleFavorite(product._id);
      await registerLike(product._id);
      setFavoriteStatus('Camisa favoritada e curtida com sucesso!');
    } catch (err) {
      setFavoriteStatus(err.message);
    }
  }

  async function handlePurchase(event) {
    event.preventDefault();

    try {
      await createOrder({
        customerName,
        productId: product._id,
        size,
        quantity: 1
      });
      setMessage('Compra simulada registrada com sucesso!');
    } catch (err) {
      setMessage(err.message);
    }
  }

  if (loading) {
    return <p className="loading-state">Carregando detalhes...</p>;
  }

  if (error || !product) {
    return <p className="error-message">{error || 'Camisa não encontrada'}</p>;
  }

  return (
    <div className="product-page">
      <div className="detail-media">
        <img src={product.image} alt={product.name} className="detail-image" />
      </div>
      <div className="detail-copy">
        <p className="eyebrow">{product.rarity}</p>
        <h2>{product.name}</h2>
        <p className="detail-description">{product.description}</p>
        <div className="detail-metrics">
          <span><strong>Time:</strong> {product.team}</span>
          <span><strong>Ano:</strong> {product.year}</span>
          <span><strong>Marca:</strong> {product.brand}</span>
          <span><strong>Preço:</strong> R$ {product.price.toFixed(2)}</span>
          <span><strong>Visualizações:</strong> {product.viewCount}</span>
          <span><strong>Curtidas:</strong> {product.likesCount}</span>
        </div>

        <div className="actions-row">
          <button type="button" onClick={handleFavorite}>Favoritar e curtir</button>
          {auth?.user ? (
            <span className="helper-copy">Sua conta ficará associada ao favorito.</span>
          ) : (
            <span className="helper-copy">Ação salva na sessão atual.</span>
          )}
        </div>
        {favoriteStatus && <p className="success-copy">{favoriteStatus}</p>}

        <form onSubmit={handlePurchase} className="purchase-form">
          <label>
            Seu nome
            <input value={customerName} onChange={(event) => setCustomerName(event.target.value)} required />
          </label>
          <label>
            Tamanho
            <select value={size} onChange={(event) => setSize(event.target.value)}>
              {product.sizes.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <button type="submit">Simular compra</button>
          <p className="helper-copy">{saleMessage}</p>
          {message && <p className="success-copy">{message}</p>}
        </form>

        <div className="detail-footer-note">
          <p>Quer usar uma conta real de demo?</p>
          <Link to="/auth">Acesse a tela de autenticação</Link>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;