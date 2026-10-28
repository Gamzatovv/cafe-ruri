import { useEffect, useMemo, useState } from 'react';
import { CategoryFilter } from '../../components/menu/CategoryFilter/CategoryFilter';
import { ProductCard } from '../../components/menu/ProductCard/ProductCard';

export function MenuPage({ products, onAdd, initialCategory = 'Все' }) {
  const [category, setCategory] = useState(initialCategory);

  const categories = useMemo(
    () => ['Все', ...new Set(products.map((product) => product.category).filter(Boolean))],
    [products],
  );

  useEffect(() => {
    if (!categories.includes(category)) {
      setCategory('Все');
    }
  }, [categories, category]);

  const filtered = useMemo(
    () => products.filter(
      (product) => category === 'Все' || product.category === category,
    ),
    [products, category],
  );

  return (
    <section className="page-section">
      <div className="page-intro">
        <div className="eyebrow">
          <span className="eyebrow-line" /> НАШЕ МЕНЮ
        </div>
        <h1>
          Восток на <em>вашем столе.</em>
        </h1>
        <p>
          Выбирайте любимые блюда — каждое приготовлено с уважением к традиции.
        </p>
      </div>

      <CategoryFilter
        categories={categories}
        selected={category}
        onChange={setCategory}
      />

      <div className="food-grid menu-grid">
        {filtered.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            index={index}
            onAdd={onAdd}
          />
        ))}
      </div>
    </section>
  );
}
