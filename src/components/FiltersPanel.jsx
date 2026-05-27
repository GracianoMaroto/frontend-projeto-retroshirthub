function FiltersPanel({ search, rarity, sort, onSearchChange, onRarityChange, onSortChange }) {
  return (
    <section className="filters-panel">
      <input
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Buscar por time, nome ou tag"
      />
      <select value={rarity} onChange={(event) => onRarityChange(event.target.value)}>
        <option value="">Todas as raridades</option>
        <option value="baixa">Baixa</option>
        <option value="média">Média</option>
        <option value="alta">Alta</option>
        <option value="raríssima">Raríssima</option>
      </select>
      <select value={sort} onChange={(event) => onSortChange(event.target.value)}>
        <option value="recent">Mais recentes</option>
        <option value="views">Mais visualizadas</option>
        <option value="price-asc">Preço crescente</option>
        <option value="price-desc">Preço decrescente</option>
      </select>
    </section>
  );
}

export default FiltersPanel;