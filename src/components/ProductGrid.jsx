import ProductCard from './ProductCard';

function ProductGrid({ products }) {
  if (!products.length) {
    return <p className="empty-state">Nenhuma camisa encontrada para os filtros aplicados.</p>;
  }

  return (
    <section className="product-grid">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </section>
  );
}

export default ProductGrid;